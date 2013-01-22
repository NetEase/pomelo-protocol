
(function (exports,ByteArray, global) {


	var Protocol = exports;
	var BODY_HEADER = 5;
	var HEAD_HEADER = 4;
	var DEF_ROUTE_LEN = 2;
	var ProHead = {};
	var ProBody = {};

	Protocol.bt2Str = function(byteArray,start,end) {
		var result = "";
		for(var i = start; i < byteArray.length && i<end; i++) {
			result = result + String.fromCharCode(byteArray[i]);
		}
		return result;
	};

	/**
	 * pomele client encode
	 * id message id;
	 * route message route
	 * msg message body
	 * socketio current support string
	 */
	 Protocol.strencode = function(msg){
	 	var msgStr = JSON.stringify(msg);
	 	var byteArray = new ByteArray(msgStr.length);
	 	var index = 0;
	 	for (var i = 0; i < msgStr.length; i++) {
	 		byteArray[index++] = msgStr.charCodeAt(i);
	 	}
	 	return byteArray;
	 };

	/**
	 * client decode
	 * msg String data
	 * return Message Object
	 */
	 Protocol.strdecode = function(buffer){
	 	var bytes = new ByteArray(buffer);
	 	var body = Protocol.bt2Str(bytes,0,bytes.length);  
	 	return JSON.parse(body);
	 };
 

	/**
	 *
	 * pomele client Head message encode
	 *
	 * @param flag message flag
	 * @param body message Byte Array
	 * return Byte Array;
	 *
	 */

 	ProHead.encode = function(flag,body){
 		var length = body.length;
 		var _buffer = new ByteArray(HEAD_HEADER+length);
 		var index = 0;
 		_buffer[index++] = flag & 0xFF;
 		_buffer[index++] = length>>16 & 0xFF;
 		_buffer[index++] = length>>8 & 0xFF;
 		_buffer[index++] = length & 0xFF;
 		for(;index<HEAD_HEADER+length;){
 			_buffer[index] = body[index-HEAD_HEADER];
 			index++;
 		}
 		return _buffer;
 	};

 
	/**
	 *
	 * pomele client Head message decode
	 *
	 * @param buffer message Byte Array
	 *
	 * return Object{'flag':flag,'buffer':body};
	 *
	 */
 	ProHead.decode = function(buffer){
		var bytes =  new ByteArray(buffer);
 		var flag = bytes[0] & 0X7F; 
 		var index = 1;
        var btLen = bytes.length || bytes.byteLength;
 		var length = ((buffer[index++])  << 16  |  (buffer[index++]) << 8 | buffer[index++]) >>>0; 
 		var body = new ByteArray(btLen-HEAD_HEADER);
 		index = 0 ;
 		for(;index<btLen-HEAD_HEADER;){
 			body[index] = bytes[index+HEAD_HEADER];
 			index++;
 		}
 		return {'flag':flag,'buffer':body};
 	};

 
	/**
	 *
	 * pomele client message body encode
	 *
	 * @param id message id;
	 * @param flag(0,1) message type;
	 * @param route message route
	 * @param msg message body
	 *
	 * return Byte Array
	 *
	 */

	 ProBody.encode = function(id,flag,route,msg){
	 	if (route.length>255) { throw new Error('route maxlength is overflow'); };
	 	var bufferLen = BODY_HEADER + route.length + msg.length;
	 	if (flag == 0) {
	 		bufferLen++;
	 	}
	 	var buffer = new ByteArray(bufferLen);
	 	var index = 0;
	 	buffer[index++] = (id>>24) & 0xFF;
	 	buffer[index++] = (id>>16) & 0xFF;
	 	buffer[index++] = (id>>8) & 0xFF;
	 	buffer[index++] = id & 0xFF;
	 	buffer[index++] =  flag & 0xFF;
	 	if (flag == 0) {
	 		buffer[index++] = route.length & 0xF;
	 	}
	 	for(var i = 0;i<route.length;){
	 		buffer[index++] = route[i++];
	 	}
	 	for (var i = 0; i <= msg.length;) {
	 		buffer[index++] = msg[i++];
	 	}
	 	return buffer;
	 };

	/**
	 *
	 * pomelo client message decode
	 * @param msg  Byte Array to decode
	 *
	 * return Object{'id':id,'flag':flag,'route':route,'buffer':body}
	 */

	 ProBody.decode = function(buffer){
		var bytes =  new ByteArray(buffer);
	 	var btLen = bytes.length || bytes.byteLength;
	 	var index = 0;
	 	var id = ((buffer[index++] <<24) | (buffer[index++])  << 16  |  (buffer[index++]) << 8 | buffer[index++]) >>>0; 
	 	var flag = buffer[index++];
	 	var routeLen = DEF_ROUTE_LEN;
	 	if (flag == 0) {
	 		routeLen = bytes[index++];
	 	}
	 	var route = new ByteArray(routeLen);
	 	for (var i = 0; i < routeLen;  ) {
	 		route[i++] = bytes[index++];
	 	}
	 	var bodyLen = btLen-index;
	 	var body = new ByteArray(bodyLen);
	 	i = 0;
	 	for (;i < bodyLen;) {
	 		body[i++] = buffer[index++];
	 	}
	 	return {'id':id,'flag':flag,'route':route,'buffer':body};
	 };
 


	Protocol.head = ProHead;
	Protocol.encode = Protocol.head.encode;
	Protocol.decode = Protocol.head.decode;
	Protocol.body = ProBody;



})('object' === typeof module ? module.exports : (this.Protocol = {}),'object' === typeof module ? Buffer:Uint8Array, this);

