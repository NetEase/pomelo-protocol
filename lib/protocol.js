
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
	 	var byteArray = new ByteArray(msg.length);
	 	var index = 0;
	 	for (var i = 0; i < msg.length; i++) {
	 		byteArray[index++] = msg.charCodeAt(i);
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
	 	return Protocol.bt2Str(bytes,0,bytes.length);  
	 };
	 
 
	 var copyArray = function(dest,doffset,src,soffset,length){
		for(var index = 0;index<length;index++){
 			dest[doffset++] = src[soffset++];
 		}
	 }
	/**
	 *
	 * pomele client Head message encode
	 *
	 * @param flag message flag
	 * @param body message Byte Array
	 * return Byte Array;
	 *
	 */

 	ProHead.encode = function(flag,buffer){
 		var length = buffer.length;
 		var _buffer = new ByteArray(HEAD_HEADER+length);
 		var index = 0;
 		_buffer[index++] = flag & 0xFF;
 		_buffer[index++] = length>>16 & 0xFF;
 		_buffer[index++] = length>>8 & 0xFF;
 		_buffer[index++] = length & 0xFF;
 		copyArray(_buffer,index,buffer,index-HEAD_HEADER,length);
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
 		var flag = bytes[0]; 
 		var index = 1;
 		var length = ((bytes[index++])  << 16  |  (bytes[index++]) << 8 | bytes[index++]) >>>0; 
 		var _buffer = new ByteArray(length);
 		copyArray(_buffer,0,bytes,HEAD_HEADER,length);
 		return {'flag':flag,'buffer':_buffer};
 	};

 
	/**
	 *
	 * pomele client message body encode
	 *
	 * @param id   id;
	 * @param flag(0,1)   type;
	 * @param route  ByteArray
	 * @param msg   ByteArray
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
	 	var _buffer = new ByteArray(bufferLen);
	 	var index = 0;
	 	_buffer[index++] = (id>>24) & 0xFF;
	 	_buffer[index++] = (id>>16) & 0xFF;
	 	_buffer[index++] = (id>>8) & 0xFF;
	 	_buffer[index++] = id & 0xFF;
	 	_buffer[index++] =  flag & 0xFF;
	 	if (flag == 0) {
	 		_buffer[index++] = route.length & 0xFF;
	 	}
	 	copyArray(_buffer,index,route,0,route.length);
	 	copyArray(_buffer,index+route.length,msg,0,msg.length);
	 	return _buffer;
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
	 	var bytesLen = bytes.length || bytes.byteLength;
	 	var index = 0;
	 	var id = ((bytes[index++] <<24) | (bytes[index++])  << 16  |  (bytes[index++]) << 8 | bytes[index++]) >>>0; 
	 	var flag = bytes[index++];
	 	var routeLen = DEF_ROUTE_LEN;
	 	if (flag == 0) {
	 		routeLen = bytes[index++];
	 	}
	 	var route = new ByteArray(routeLen);
	 	copyArray(route,0,bytes,index,routeLen);
	 	index+=routeLen;
	 	var _bufferLen = bytesLen-index;
	 	var _buffer = new ByteArray(_bufferLen);
	 	copyArray(_buffer,0,bytes,index,_bufferLen);
	 	return {'id':id,'flag':flag,'route':route,'buffer':_buffer};
	 };
 

	Protocol.head = ProHead;
	Protocol.encode = Protocol.head.encode;
	Protocol.decode = Protocol.head.decode;
	Protocol.body = ProBody;



})('object' === typeof module ? module.exports : (this.Protocol = {}),'object' === typeof module ? Buffer:Uint8Array, this);

