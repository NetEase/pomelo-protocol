var should = require('should');
var protocol = require('../lib/protocol');

console.log(protocol);

describe(' encode and decode Test ',function() {
	it(' normal test',function() {
		var flag = 3;
		var bt = new Buffer(3);
		bt[0] = 0x1;
		bt[1] = 0x1;
		bt[2] = 0x1;
		var buf = protocol.head.encode(flag,bt);
		console.log(buf);
		buf[bt.length+2].should.equal(1);
		var m = protocol.head.decode(buf);
		console.log(m);
		m.flag.should.equal(3);
		var route = 'connector.server.loging';
		var body = {'a':1,'b':2};
		buf = protocol.body.encode(1,0,protocol.strencode(route),protocol.strencode(body));
		var _m = protocol.body.decode(buf);
		console.log(protocol.strdecode(_m.route));
		console.log(_m.buffer);
		console.log(protocol.strdecode(_m.buffer));
		protocol.strdecode(_m.route).should.equal(route);
	});
});















