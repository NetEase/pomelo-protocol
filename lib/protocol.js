var Protocol = function(){
};

module.exports = Protocol;

var HEADER = 5;

var Message = function(id,route,body){
    this.id = id;
    this.route = route;
    this.body = body;
};

/**
 *
 * pomelo server protocl end
 * return Buffer
 * id messageid
 * route message route
 *  msg message entity
 */
Protocol.encode = function(id,route,msg) {
    var msgStr = JSON.stringify(msg);
    var buf = new Buffer(HEADER + route.length + msgStr.length);
    var index = 0;
    buf.writeUInt8((id>>24) & 0xFF,index++);
    buf.writeUInt8((id>>16) & 0xFF,index++);
    buf.writeUInt8((id>>8) & 0xFF,index++);
    buf.writeUInt8(id & 0xFF,index++);
    buf.writeUInt8(route.length,index++);
    for(var i = 0;i<route.length;i++){
        buf[index++] = route.charCodeAt(i);
    }
    for (var i = 0; i < msgStr.length; i++) {
        buf[index++] = msgStr.charCodeAt(i);
    }
    return buf; 
}

/**
 *
 *server decode client message
 * msg String data
 * return Message Object
 */
Protocol.decode = function(msg){
    var buf = new Buffer(msg);
    var id = ((buf.readUInt8(0) <<24) | (buf.readUInt8(1))  << 16  |  (buf.readUInt8(2)) << 8 | buf.readUInt8(3)) >>>0; 
    var routeLen = buf.readUInt8(HEADER-1);
    //console.log(routeLen + " ");
    var routeBuf = buf.slice(HEADER, routeLen+HEADER);
    var route = routeBuf.toString('ascii', 0, routeBuf.length);
    var bodyBuf = buf.slice(routeLen+HEADER,buf.length);  
    var body = bodyBuf.toString('ascii', 0, bodyBuf.length);
    return new Message(id,route,body);
};

