const {WebSocket} = require('ws')

class ChatClient{
    secretKey = 'aelwfhlaef';
    secretIV = 'aifjaoeifjo';
    encMethod = 'aes-256-cbc';
    cryptors = require('node:crypto');

    constructor(options){
        this.ws = new WebSocket(options.url);
        this.sessionId = options.sessionId || null;
        this.username = options.username;
        this.key = options.key;
    }
    init() {
        this.ws.on('open', () => this.onOpen());
        this.ws.on('message', (data) => this.onMessage(data));
        this.ws.on('error', console.error);
    }
    onOpen(){
        console.log('connected');
        this.ws.send(JSON.stringify({
            type: 'options',
            sessionId : this.sessionId,
            data: {
                username: this.username
            } 
         }));
    }
    onMessage(data){
        const parsedData = JSON.parse(data);
        switch (parsedData.type){
            case'message':{
                console.log(`${parsedData.data.sender} >> ${parsedData.data.message}`);
                break;
            }
            case 'options': {
                this.setOptions(parsedData);
                break;
            }
            default:
                console.log('unknow messahe type');    
        }

    }
    setOptions (msObject){
        this.sessionId = msObject.sessionId;
        console.log('Your sessionId: ', this.sessionId); 
    }
    encryptData (data) {
        const key = this.cryptors.createHash('sha512').update(this.key).digest('hex').substring(0,32)
        const encIv = this.cryptors.createHash('sha512').update(this.secretIV).digest('hex').substring(0,16)
        const cipher = this.cryptors.createCipheriv(this.encMethod, key, encIv)
        const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
        return Buffer.from(encrypted).toString('base64')
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
  send(data){
        const msObject = {
            type: 'message',
            sessionId : this.sessionId,
            data: this.key !== null ? this.encryptData(data) : data,
            crypto: this.key !== null
        }
        this.ws.send(JSON.stringify(msObject));
    }
}
module.exports = {ChatClient};