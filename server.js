var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());

//get /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

//get /todos/:id
app.get('/todos/:id', function (req, res) {
   var todoId = parseInt(req.params.id, 10);
   var matchedTodo = _.findWhere(todos, {id: todoId});
    
   if (matchedTodo) {
       res.json(matchedTodo);
   }
   else {
       res.status(404).send("unable to find id");
   }
});

//POST request
app.post('/todos', function (req, res) {
    var body = _.pick(req.body,'description', 'completed');
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    
    // set body.description to the trimmed value
    body.description = body.description.trim();
    
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

// delete request

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if (!matchedTodo) {
        return res.status(404).send();
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
 
});

app.listen(PORT, function () {
    console.log('express listening on port ' + PORT);
});