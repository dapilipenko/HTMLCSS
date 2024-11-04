const { WebSocketServer, WebSocket } = require('ws');
const {Client} = require('./ClientMan');
class ChatServer {
    wss = null;
    clientsMap = new Map();
    constructor(options){
        this.port = options.port;
    }
    init(){
        this.wss = new WebSocketServer({ port: this.port });
        this.wss.on('connection', (ws) => this.OnConnection(ws));
        this.wss.on('error', console.error);
        console.log(`ChatServer started on port ${this.port}`)
    } 
    OnConnection(ws){
        console.log('new connection');  
        ws.on('message',(data) => this.onMessage(ws, data));
    }   
    onMessage(ws, data){
        const msObject = JSON.parse(data.toString());
        console.log(msObject)

        switch (msObject.type){
            case 'message':{
                this.broadcast(msObject);
                break;
            }
            case 'options': {
                this.createClient(ws, msObject)
                break;
            }
            default:
                console.log('unknow messahe type');    
        }
    }  
    createClient(ws, msObject){
        const client = new Client({
            ws: ws,
            username: msObject.data.username,
            sessionId: msObject.sessionId
        });
        this.clientsMap.set(client.sessionId, client)
        console.log(`Client ${client.username} connected`);
        
    }
    broadcast(msObject){
        const sender = this.clientsMap.get(msObject.sessionId);
        console.log(msObject);
        this.clientsMap.forEach((client) => {
           if (client.ws.readyState === WebSocket.OPEN && client.sessionId !== msObject.sessionId){
                client.send ({
                   type: 'message',
                   data: {
                        sender: sender.username,
                        message: msObject.data
                   } 
                });
            }
        });
    }                                                                         
}
module.exports = {ChatServer};