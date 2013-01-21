var should = require('should');
var protocol = require('../lib/protocol');

describe(' encode and decode Test ',function() {
    it(' normal test',function() {
        var flag = 3;
				var bt = new Buffer(2);
				bt[0] = 0x1;
				bt[1] = 0x1;
				var buf = protocol.encode(flag,bt);
				console.log(buf);
				var m = protocol.decode(buf);
				console.log(m);
    });
});















