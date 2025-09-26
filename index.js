const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
// FIX: Use environment variable PORT for hosting platforms, default to 3000 locally
const port = process.env.PORT || 3000; 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let todos = []; // our in-memory "database"

// --- Weather Icon Integration Placeholder ---
// Assuming you have a weather data service/API call here
// For demonstration, let's hardcode a URL path
const weatherIconUrl = '/images/cloud.png'; 
// ------------------------------------------

// Home route
app.get('/', (req, res) => {
    const { priority } = req.query;
    let filteredTodos = todos;
    
    if (priority && priority !== 'All') { // Added check for 'All'
        filteredTodos = todos.filter(todo => todo.priority === priority);
    }
    
    // Calculate counts (assuming no 'completed' status yet)
    const totalCount = todos.length;

    // Pass all necessary data to the view
    res.render('index', { 
        todos: filteredTodos, 
        query: req.query,
        weatherIconUrl: weatherIconUrl, // Passed the icon URL
        uncompletedCount: totalCount, 
        completedCount: 0 // Placeholder
    });
});
 
// Add todo
app.post('/add', (req, res) => {
    const { task, priority } = req.body;
    if (!task || !task.trim()) { // Simplified check for task
        // Added a placeholder task if task is empty, prevents crash
        return res.redirect('/?error=empty'); 
    }
    // Assign a default priority if none is provided
    const newPriority = priority || 'Medium'; 
    todos.push({ id: Date.now(), task, priority: newPriority });
    res.redirect('/');
});

// Edit todo
app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task, priority } = req.body;
    const todo = todos.find(t => t.id == id);
    if (todo && task.trim()) {
        todo.task = task;
        todo.priority = priority;
    }
    res.redirect('/');
});

// Delete todo
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id != id);
    res.redirect('/');
});

// Server listens on the defined 'port' (either ENV or 3000)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
