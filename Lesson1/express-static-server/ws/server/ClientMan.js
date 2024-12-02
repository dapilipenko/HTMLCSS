const {randomUUID} = require("crypto");
let uuid = crypto.randomUUID();

class Client{
   constructor(options){
    this.ws = options.ws;
    this.username = options.username;
    this.sessionId = options.sessionId || randomUUID();
    this.sendOption();
   }

   sendOption(){
       this.send({
            type: 'options',
            sessionId: this.sessionId,
            data:{
                username: this.username
            }
       });
   }

   updateWS(ws){
        this.ws.terminate();
        this.ws = ws;
   }

   send(msObject){
        this.ws.send(JSON.stringify(msObject));
   }
}
module.exports ={Client};