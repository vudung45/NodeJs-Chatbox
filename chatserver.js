/*W2heaven Chat Server*/
var app = require('express')();

var chatData = JSON.parse('{"english" : [], "vietnamese" : []}');
var userData = JSON.parse("{}");
var bufferSize = 50;
var admins = ["davidvu98"];
var commands = ["/ban","/prune"]; // still developing

//Show Chat
app.get("/:chatserver", function(req, res) {
    if (typeof(req.params["chatserver"]) != "undefined") {
        var chatserver = req.params["chatserver"];
        if (typeof(chatData["" + chatserver]) != "undefined") {
            var thisServer = new chatServer(chatserver);
            thisServer.showChat(function(data) {
                res.send("" + data);
            })
        } else {
            res.send(JSON.stringify(chatData));
        }
    }
});

//Add new message
app.get("/send/:chatserver/:username/:token/:mess", function(req, res) {
        var chatserver = req.params["chatserver"];
        getName(req.params["username"],req.params["token"],function(err,uname){
            if(err){
                res.send("Can't find this user");
            } else {
                if (typeof(chatData["" + chatserver]) != "undefined") {
                    var thisServer = new chatServer(chatserver);
                    thisServer.addMessage(uname, req.params["mess"], function(data) {
                        res.send("" + data);
                    });
                } else {
                    res.send(JSON.stringify(chatData));
                }
            }
        });
    });
    
app.get("/",function(req,res){
    res.send("Way2Heaven Chat Server");
    });


//get new token for user    
app.get("/newtoken/:username/:name/:profilepic",function(req,res){
    var token = new Date().valueOf(); //return a semi-unique value
    res.send(""+token);
    var userPower = 0;
    if(admins.indexOf(req.params["name"]) != -1) userPower = 1;
    userData[""+req.params["username"]] = {"name" : req.params["name"], "token": token, "profilepic" : req.params["profilepic"], "admin" : userPower, "bantime" : 0};
    console.log(JSON.stringify(userData));
});

//get name and check validity
function getName(username,token,callback){
    if(typeof(userData[username]) != "undefined"){
        if(userData[username].token == token){
            if(new Date().getTime() > userData[username].bantime){
                callback(null,""+userData[username].name);
            } else {
                callback("This user is banned",null);
            }
        } else {
            callback("Invalid token", null);
        }
    } else {
        callback("User Not Found", null);
    }
    
}

/*Chat server class*/

var chatServer = function(server) {
    this.myServer = server;
}

//Return chat content in String
chatServer.prototype.showChat = function(callback) {
    var myContent = chatData["" + this.myServer];
    callback(JSON.stringify(chatData));
}

chatServer.prototype.addMessage = function(username, message, callback) {
    chatData["" + this.myServer].push({
        "name": username,
        "content": message
    });
    if(Object.keys(chatData["" + this.myServer]).length >= bufferSize){
        delete chatData["" + this.myServer][0]; //delete first item
    }
    // if(userData[username]["admin"] == 1){
    //     for(var cmd in commands){
    //         if(message.contains(commands.cmd)){
                
    //         }
    //     }
    // }
    this.showChat(function(data) {
        callback(data);
    });
}


var simScanner = function (someString){
    this.string = someString;
    this.starting = 0;
    this.token = " ";
}

simScanner.prototype.findNext = function(){
    if(this.string.indexOf(this.token) != -1){
        this.starting = this.string.indexOf(this.token);
        if(this.starting < this.string.length + 1){
            this.string = someString.slice(this.starting + 1);
            var nextToken = this.string.indexOf(this.token);
            if(nextToken == -1 && nextToken < this.string.length + 1){
                return this.string;
            } else {
                return this.string.slice(this.starting, nextToken + 1);
            }
        } else {
            return null;
        }
    } else {
        return null
    }
}


app.listen(8080, function() {
    console.log('W2heaven Demo chat server')
})