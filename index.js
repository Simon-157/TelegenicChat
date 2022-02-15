const app = require('express')();
const mysql = require('mysql');
const server = require("http").createServer(app);


const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"password",
    database:"RegistrationSystem",
});



const cors = require('cors')
const io = require("socket.io")(server, {
    cors:{
        origin:"*",
        methods:["GET", "POST"]

    }
});

// app.use()
app.use(cors());


const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res.send('server is running');
});

io.on('connection', (socket)=>{
    socket.emit('me', socket.id);
    socket.on('disconnect', ()=>{
        socket.boradcast.emit("callended")
    });
    socket.on("calluser",({userToCall,signalData, from, name}) =>{
        io.to(userToCall).emit("calluser", {signal:signalData, from, name})
    });
    socket.on("answercall", (data) =>{
        io.to(data.to).emit("callaccepted",data.signal);
    });
});

server.listen(PORT, ()=>console.log(`listening on port ${PORT}`));



