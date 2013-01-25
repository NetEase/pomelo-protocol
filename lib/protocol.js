

(function (exports,ByteArray, global) {


	var Protocol = exports;
	var BODY_HEADER = 5;
	var HEAD_HEADER = 4;
	var DEF_ROUTE_LEN = 2;
	var ProHead = {};
	var ProBody = {};

	var copyArray = function(dest,doffset,src,soffset,length){
		for(var index = 0;index<length;index++){
			dest[doffset++] = src[soffset++];
		}
	}
	/**
	 * pomele client encode
	 * id message id;
	 * route message route
	 * msg message body
	 * socketio current support string
	 */
	 Protocol.strencode = function(str){
	 	var byteArray = new ByteArray(str.length*3);
	 	var offset = 0;
	 	for(var i = 0; i < str.length; i++){
	 		var charCode = str.charCodeAt(i);
	 		var codes = null;
	 		if(charCode <= 0x7f){
	 			codes = [charCode];
	 		}else if(charCode <= 0x7ff){
	 			codes = [0xc0|(charCode>>6), 0x80|(charCode & 0x3f)];
	 		}else{
	 			codes = [0xe0|(charCode>>12), 0x80|((charCode & 0xfc0)>>6), 0x80|(charCode & 0x3f)];
	 		}
	 		for(var j = 0; j < codes.length; j++){
	 			byteArray[offset] = codes[j];
	 			++offset;
	 		}
	 	}
	 	var _buffer = new ByteArray(offset);
	 	copyArray(_buffer,0,byteArray,0,offset);
	 	return _buffer;
	 };

	/**
	 * client decode
	 * msg String data
	 * return Message Object
	 */
	 Protocol.strdecode = function(buffer){
	 	var bytes = new ByteArray(buffer);
	 	var array = [];
	 	var offset = charCode = 0;
	 	var end = bytes.length;
	 	while(offset < end){
	 		if(bytes[offset] < 128){
	 			charCode = bytes[offset];
	 			offset += 1;
	 		}else if(bytes[offset] < 224){
	 			charCode = ((bytes[offset] & 0x3f)<<6) + (bytes[offset+1] & 0x3f);
	 			offset += 2;
	 		}else{
	 			charCode = ((bytes[offset] & 0x0f)<<12) + ((bytes[offset+1] & 0x3f)<<6) + (bytes[offset+2] & 0x3f);
	 			offset += 3;
	 		}
	 		array.push(charCode);
	 	}
	 	delete charCode;
	 	return String.fromCharCode.apply(null, array);
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
