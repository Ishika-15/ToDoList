const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let todos = []; // our in-memory "database"

// Home route
app.get('/', (req, res) => {
    const { priority } = req.query;
    let filteredTodos = todos;
    if (priority) {
        filteredTodos = todos.filter(todo => todo.priority === priority);
    }
    res.render('index', { todos: filteredTodos, query: req.query  });
});
 
// Add todo
app.post('/add', (req, res) => {
    const { task, priority } = req.body;
    if (!task.trim()) {
        return res.redirect('/?error=empty');
    }
    todos.push({ id: Date.now(), task, priority });
    res.redirect('/');
});

// Edit todo
app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task, priority } = req.body;
    const todo = todos.find(t => t.id == id);
    if (todo) {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});