const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 5500 || process.env.PORT;

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello Its working");
});

const users = [{}];
const server = http.createServer(app);

const io = socketIO(server);

app.get("/votingSection", async (req, res) => {
  console.log(req.query);
  let qryData = req.query;
  let result = null;
  if (qryData["voting"] != "undefined") {
    result = {
      voting: qryData["voting"],
    };
  }

  io.emit("vote", result);
  res.status(200).send(result);
  //res.status(200).send(result);
});

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `${users[socket.id]} welcome to the chat`,
    });
  });

  socket.on("message", ({ message, id, currTime, file }) => {
    io.emit("sendMessage", { user: users[id], message, id, currTime, file });
  });

  socket.on("disConnect", () => {
    
      console.log("User Left");
      socket.broadcast.emit("leave", {
        user: "Admin",
        message: `${users[socket.id]} has left`,
      });
    
  });
});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
