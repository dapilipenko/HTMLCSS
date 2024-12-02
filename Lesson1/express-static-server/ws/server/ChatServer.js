const { WebSocketServer, WebSocket } = require('ws');
const {Client} = require('./ClientMan');
class ChatServer {
    wss = null;
    clientsMap = new Map();
    secretKey = 'aelwfhlaef';
    secretIV = 'aifjaoeifjo';
    encMethod = 'aes-256-cbc';
    cryptors = require('node:crypto');

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

    decryptData(encryptedData) {
        if(encryptedData == null || encryptedData == '' || encryptedData[0] == '{') return encryptedData;
        const key = this.cryptors.createHash('sha512').update(this.secretKey).digest('hex').substring(0,32);
        const encIv = this.cryptors.createHash('sha512').update(this.secretIV).digest('hex').substring(0,16);
        const buff = Buffer.from(encryptedData, 'base64');
        const encryptedDataBuff = buff.toString('utf-8');
        const decipher = this.cryptors.createDecipheriv(this.encMethod, key, encIv);
        return decipher.update(encryptedDataBuff, 'hex', 'utf8') + decipher.final('utf8');
    }
  
    onMessage(ws, data){
        const msObject = JSON.parse(data);
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
                console.log('unknow message type');    
        }
    } 

    createClient(ws, msObject){
        const ifClientExists = this.clientsMap.get(msObject.sessionId);
        if (ifClientExists){
            const client = this.clientsMap.get(msObject.sessionId);
            client.updateWS(ws);
            console.log(`Client ${client.username} reconnected`);
            return;
        }

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
        this.clientsMap.forEach((client) => {
        let isCrypto = msObject.crypto || false;
        if(isCrypto) {console.log(`Message from ${sender.username}: ${this.decryptData(msObject.data)}`);}     
        else {console.log(`Message from ${sender.username}: ${msObject.data}`);}     
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