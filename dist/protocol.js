var Protocol = function(){
};

var HEADER = 5;

var Message = function(id,route,body){
    this.id = id;
    this.route = route;
    this.body = body;
};

/**
 *
 *pomele client encode
 * id message id;
 * route message route
 * msg message body
 * socketio current support string
 *
 */
Protocol.encode = function(id,route,msg){
    var msgStr = JSON.stringify(msg);
    var byteArray = new Uint8Array(HEADER + route.length + msgStr.length);
    var index = 0;
    byteArray[index++] = (id>>24) & 0xFF;
    byteArray[index++] = (id>>16) & 0xFF;
    byteArray[index++] = (id>>8) & 0xFF;
    byteArray[index++] = id & 0xFF;
    byteArray[index++] = route.length;
    for(var i = 0;i<route.length;i++){
        byteArray[index++] = route.charCodeAt(i);
    }
    for (var i = 0; i < msgStr.length; i++) {
        byteArray[index++] = msgStr.charCodeAt(i);
    }
    return String.fromCharCode.apply(null,byteArray);
};




/**
 *
 *client decode
 *msg String data
 *return Message Object
 */
Protocol.decode = function(msg){
    var idx, len = msg.length, arr = new Array( len );
    for ( idx = 0 ; idx < len ; ++idx ) {
        arr[idx] = msg.charCodeAt(idx) & 0xFF;
    }
    var index = 0;
    var buf = Uint8Array(arr).buffer;
    var id = ((buf[index++] <<24) | (buf[index++])  << 16  |  (buf[index++]) << 8 | buf[index++]) >>>0; 
    var routeLen = buf[HEADER-1];
    var routeBuf = buf.slice(HEADER, routeLen+HEADER);
    var route = String.fromCharCode.apply(null,routeBuf);
    var bodyBuf = buf.slice(routeLen+HEADER,buf.length);  
    var body = String.fromCharCode.apply(null,bodyBuf);
    return new Message(id,route,body);
};

