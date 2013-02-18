var should = require('should');
var protocol = require('../lib/protocol');

describe(' encode and decode Test ',function() {
	it(' normal test',function() {
		var flag = 3;
		var bt = new Buffer(3);
		bt[0] = 0x1;
		bt[1] = 0x1;
		bt[2] = 0x1;
		var buf = protocol.head.encode(flag,bt);
		//console.log(buf);
		buf[bt.length+2].should.equal(1);
		var m = protocol.head.decode(buf);
		//console.log(m);
		m.flag.should.equal(3);


		testFlag(0, 'c');

		testFlag(1, 2);
	});
});

function testFlag(flag, route){
	var body = JSON.stringify({'a':1,'b':2});

	var buf = protocol.body.encode(1,flag, route,protocol.strencode(body));
	var _m = protocol.body.decode(buf);
	console.log('route : %j', protocol.strdecode(_m.route));
	_m.route.should.equal(route);

	_m.body = protocol.strdecode(_m.buffer);

	//_m.should.equal(body);
}















