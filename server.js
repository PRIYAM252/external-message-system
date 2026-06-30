const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = 0;

io.on("connection",(socket)=>{

users++;
io.emit("user count",users);

console.log("User connected");

socket.on("chat message",(data)=>{

let email=data.email.toLowerCase().trim();
let msg=data.msg;

let internalDomains=["@company.com","@company.in"];

let isInternal = internalDomains.some(domain => email.endsWith(domain));

let text="";

if(isInternal){
text="✅ "+email+" : "+msg;
}else{
text="⚠ EXTERNAL - "+email+" : "+msg;
}

io.emit("chat message",text);

});

socket.on("disconnect",()=>{
users--;
io.emit("user count",users);
});

});

http.listen(5000,()=>{
console.log("Server running 🚀");
console.log("Open in browser: http://localhost:5000");
});
