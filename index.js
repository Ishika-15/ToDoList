const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000; 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let todos = []; 


const weatherIconUrl = '/images/cloud.png'; 

app.get('/', (req, res) => {
    const { priority } = req.query;
    let filteredTodos = todos;
    
    if (priority && priority !== 'All') { 
        filteredTodos = todos.filter(todo => todo.priority === priority);
    }
    
    const totalCount = todos.length;


    res.render('index', { 
        todos: filteredTodos, 
        query: req.query,
        weatherIconUrl: weatherIconUrl, 
        uncompletedCount: totalCount, 
        completedCount: 0 
    });
});
 

app.post('/add', (req, res) => {
    const { task, priority } = req.body;
    if (!task || !task.trim()) { 
        return res.redirect('/?error=empty'); 
    }
    const newPriority = priority || 'Medium'; 
    todos.push({ id: Date.now(), task, priority: newPriority });
    res.redirect('/');
});


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


app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id != id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
