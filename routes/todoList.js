var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

//Koppla upp mot MongoDb med Mongoose
await mongoose.connect('mongodb://127.0.0.1:27017/todoListDb', { useMongoClient: true });
mongoose.Promise = global.Promise;

//Skapa schema
let todoSchema = mongoose.Schema({
  todoId: Number,
  todoTitle: String,
  todoDescription: String,
  todoIsDone: Boolean
});

//Skapa Model
let Todo = mongoose.model('Todo', todoSchema);

/* Hämta (GET) todos */
router.get('/', function(req, res, next) {
  res.send("Hämta (GET) alla todos!");
});

/* Hämta specifikt Todo */
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  res.send(`Hämta Specifikt todo med id: ${id}`);
});

/* Uppdatera Todo */
router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  res.send(`UPPDATERA Specifikt todo med id: ${id}`);
});

/* Skapa nytt Todo (Post) */
router.post('/', (req, res, next) => {
  res.send("SKAPA Nytt todo");
});

/* Radera Todo (Delete) */
router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  res.send(`RADERA Specifikt todo med id: ${id}`);
});


module.exports = router;
