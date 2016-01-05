/**
 * Created by seven on 2016/1/4.
 */

var express = require("express"),
    app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

var body = require("body-parser");
var ejs = require("ejs");


app.use(express.static('./client'));
app.use(require('body-parser').urlencoded({extended: true}));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.set("view options",{                    
    "layout":false
});

app.get('/', function(req, res){
    res.sendfile(__dirname+"/client/index.html");
});
var userName = "";
app.post('/chat', function(req, res){
	//console.log( req.body.userName );
    //res.sendfile(__dirname+"/views/chat.html");
    userName = req.body.userName;
   res.render("chat",{userName:userName});
});

var arr = [];

io.on('connection', function (socket) {
    //console.log( "有人上线了，名字为"+userName );
    socket.on("userName",function (data){
        arr.push( data );
        io.emit('userName',arr); 
         
    });
    socket.on('send mes', function (data) {
      // socket.emit("new mes",data);
       socket.broadcast.emit('send mes',data);
    });
    socket.on('disconnect', function () {
	    io.emit('user disconnected');
	});
   // socket.emit("userName",arr);
});

server.listen(3000);


