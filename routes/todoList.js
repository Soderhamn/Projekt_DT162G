var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

//Koppla upp mot MongoDb med Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/todoListDb')
.catch(error => console.log(error)); //Konsol-logga felet ifall anslutning misslyckas
mongoose.Promise = global.Promise;

//Skapa schema
let todoSchema = mongoose.Schema({
  todoTitle: String,
  todoDescription: String,
  todoIsDone: Boolean
});

//Skapa Model
let Todo = mongoose.model('Todo', todoSchema);

/* Hämta (GET) todos */
router.get('/', async function(req, res, next) {
  let todos = await Todo.find({}); //Hitta alla Todos
  res.send(todos); //Returnerar alla todos
});

/* Hämta specifikt Todo */
router.get('/:id', async (req, res, next) => {
  let id = req.params.id; //Läs in det Id som skickats med som parameter
  let todo = await Todo.findById(id); //Hitta en specifit "Att göra" via dess Id
  res.send(todo); //Returnera den funna "att-göra"
});

/* Uppdatera Todo */
router.put('/:id', async (req, res, next) => {
  let id = req.params.id;
  res.send(`UPPDATERA Specifikt todo med id: ${id}`);
});

/* Skapa nytt Todo (Post) */
router.post('/', async (req, res, next) => {
  const jsonData = req.body; //Läs in den Json-data som skickats med i Body i anropet

  //Skapa ny instans av modellen Todo, lägg in datat som skickats med..
  let todo = new Todo({
    todoTitle: jsonData.todoName,
    todoDescription: jsonData.todoDesc,
    todoIsDone: false
  });

  //Spara ny Todo i Databasen
  await todo.save().catch(err => console.log(err)); //Konsol-logga eventuella fel

  res.send(todo);
});

/* Radera Todo (Delete) */
router.delete('/:id', async (req, res, next) => {
  let id = req.params.id;
  res.send(`RADERA Specifikt todo med id: ${id}`);
});


module.exports = router;
