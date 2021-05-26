const express = require("express");
const app = express();
const http = require("http").createServer(app);
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const socket = require('socket.io')


const passport = require('passport');
const bodyParser = require('body-parser');

const users = require('./routes/api/user');
const drawingBoards = require('./routes/api/drawingBoards')


mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));


app.get("/", (req, res) => res.send("Hiya World"));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/drawingBoards", drawingBoards)

const port = process.env.PORT || 5000;

server = app.listen(port, () => console.log(`Server is running on port ${port}`));

io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }})

let people = 0
io.on('connection', (socket) => {
    console.log("User Online")
    people++
    clients++
    console.log(people)
    io.sockets.emit("broadcast", {description: people + "clients connected!"})


    socket.on("disconnect", function(){
        people--;
        socket.broadcast.emit("broadcast", {description: people + "clients connected!"})
    })

<<<<<<< HEAD
    socket.on("canvas-data", (data, boardName) => {
        console.log(data)
        console.log(boardName)
        socket.broadcast.emit(boardName, data, boardName)
    })
})
=======
// http.listen(port, () => {
//     console.log("Started on :" + port)
// })
>>>>>>> main






