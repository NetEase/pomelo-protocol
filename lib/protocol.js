(function (exports, global) {

	var Protocol = exports;
 
	var WS_PROTOCOL = 0X80;

	var HEADER = 3;

	var Message = function(id,route,body){
	    this.type = id;
	    this.flag = route;
	    this.buffer = body;
	};

/**
 *
 * pomele client message encode
 *
 * @param int flag message type
 * @param arraybuffer buffer proto message body
 *
 * return Uint8Array 
 *
 */
Protocol.encode = function(flag,buffer){
		var length = buffer.length;
    var byteArray = new Uint8Array(HEADER+length);
		var mask = WS_PROTOCOL | flag;
    var index = 0;
		byteArray[index++] = mask & 0xFF;
    byteArray[index++] = length>>8 & 0xFF;
    byteArray[index++] = length & 0xFF;
    for(;index<HEADER+length;){
			byteArray[index] = buffer[index-HEADER];
			index++;
		}
		return byteArray;
};




/**
 *
 *
 * pomelo client message decode
 *
 * @param arraybuffer buffer decode message 
 *
 * return Message Object
 *
 */
Protocol.decode = function(buffer){
	  var type = (buffer[0] & WS_PROTOCOL);
    var flag = buffer[0] & 0X7F; 
    var byteArray = new Uint8Array(buffer.length-HEADER);
		var index = 0 ;
		for(;index<buffer.length-HEADER;){
			byteArray[index] = buffer[index+HEADER];
			index++;
		}
    return new Message(type,flag,byteArray);
};

})('object' === typeof module ? module.exports : (this.Protocol = {}), this);

