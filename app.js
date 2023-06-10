/* REST-api i NodeJS + Express, till Moment 5 - Projekt i kurs DT162G
Av: Marcus Andersson, maan2117@student.miun.se */

//Grundläggande imports och inställningar
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors"); //För att slippa CORS-error
app.use(cors({ origin: '*' }));
app.use(express.json());

//Importera Routes
let usersRouter = require("./routes/users");
let todoListRouter = require("./routes/todoList");

//Ifall användare besöker ./ så möts de av ett statusmeddelande i JSON-format
app.get("/", (req, res, next) => { 
    res.json({"Status": "Online!"});
});

//Knyt URI till router
app.use("/users", usersRouter);
app.use("/todoList", todoListRouter);


//Starta server och lyssna på port 3000
app.listen(port, function() {
    console.log(`Servern startades och lyssnar på port: ${port}`);
});
