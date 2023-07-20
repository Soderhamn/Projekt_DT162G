var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();

//Koppla upp mot MongoDb med Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/todoListDb")
  .catch((error) => console.log(error)); //Konsol-logga felet ifall anslutning misslyckas
mongoose.Promise = global.Promise;

//Skapa schema
let todoSchema = mongoose.Schema({
  todoTitle: String,
  todoDescription: String,
  todoIsDone: Number,
});

//Skapa Model
let Todo = mongoose.model("Todo", todoSchema);

/* --------------------------------------------------Hämta (GET) todos --------------------------------------------------*/
router.get("/", async function (req, res, next) {
  let todos = await Todo.find({}); //Hitta alla Todos

  if (todos !== null) {
    //Så länge det finns träffar
    res.send(todos); //Returnerar alla todos
  } else {
    res.status(404);
    res.send("Du har inget att göra...");
  }
});

/* --------------------------------------------------Hämta specifikt Todo-------------------------------------------------- */
router.get("/:id", async (req, res, next) => {
  let id = req.params.id; //Läs in det Id som skickats med som parameter

  let todo = await Todo.findById(id); //Hitta en specifit "Att göra" via dess Id

  //Om todo inte är null
  if (todo !== null) {
    res.send(todo); //Returnerar den hittade "att-göra"
  } else {
    //Returenra 404 - not found + felmeddelande
    res.status(404);
    res.send(`Kunde inte hitta todo med id: ${id}`);
  }
});

/* --------------------------------------------------Skapa nytt Todo (Post)-------------------------------------------------- */
router.post("/", async (req, res, next) => {
  const jsonData = req.body; //Läs in den Json-data som skickats med i Body i anropet

  //Skapa ny instans av modellen Todo, lägg in datat som skickats med..
  let todo = new Todo({
    todoTitle: jsonData.todoName,
    todoDescription: jsonData.todoDesc,
    todoIsDone: jsonData.todoIsDone,
  });

  //Spara ny Todo i Databasen
  await todo.save().catch((err) => console.log(err)); //Konsol-logga eventuella fel

  //Returnera meddelande att Todo skapats
  res.status(201); //Http 201, created
  res.send({
    status: "Todo skapad",
    "Data som lagrats": todo,
  });
});

/* --------------------------------------------------Uppdatera Todo-------------------------------------------------- */
router.put("/:id", async (req, res, next) => {
  let id = req.params.id; //Läser in det Id som skickats med som parameter

  let foundTodo = await Todo.findById(id); //Hitta en specifikt "Att göra" via dess Id

  if (foundTodo === null) {
    //Hittades inte
    res.status(404);
    res.send(`Kunde inte hitta todo med id ${id}`);
  } else {
    //Hittades
    const jsonData = req.body; //Läs in den Json-data som skickats med i Body i anropet

    //Skapa ny instans av modellen Todo, lägg in datat som skickats med..
    let todo = new Todo({
      todoTitle: jsonData.todoName,
      todoDescription: jsonData.todoDesc,
      todoIsDone: jsonData.todoIsDone,
    });

    //Uppdatera dokumentet
    let result = await Todo.updateOne(
      { _id: id },
      {
        todoTitle: todo.todoTitle,
        todoDescription: todo.todoDescription,
        todoIsDone: todo.todoIsDone,
      }
    ).catch((err) => {
      console.log(err);
    });

    console.log("RESULTAT: " + JSON.stringify(result));

    if (result.modifiedCount == 1) {
      //Ett (1) dokument har modifierats
      res.status(200); //Lyckades
      res.send(todo);
    } else if (result.modifiedCount == 0 && result.matchedCount == 1) {
      res.status(400); //Error-kod (Internal server error)
      res.send("Fel: Ingen data att uppdatera");
    } else {
      res.status(500); //Error-kod (Internal server error)
      res.send("Fel: kunde inte uppdatera");
    }
  }
});

/*--------------------------------------------------Radera Todo (Delete)-------------------------------------------------- */
router.delete("/:id", async (req, res, next) => {
  let id = req.params.id; //Läs in id

  let todo = await Todo.findById(id);

  //Om todo hittades
  if (todo) {
    todo.deleteOne(); //Radera
    //Returnera meddelande
    res.send({
      status: "Lyckades",
      text: `Todo med Id ${id} raderades!`,
    });
  }
});

/* --------------------Hantera felaktig Delete-anrop och Update (snyggare felmedd. ifall saknar id-parameter)-------------------- */
router.delete("/", async (req, res, next) => {
  res.status(400);
  res.send("Saknar parameter: :id");
});

router.put("/", async (req, res, next) => {
  res.status(400);
  res.send("Saknar parameter: :id");
});

module.exports = router;
