var should = require('should');
var protocol = require('../lib/protocol');

describe(' encode Test ',function() {
    it(' normal test',function() {
        var msg = {'name':'pomelo'};
        var route = 'connect';
        var id = 4294967293;
        var buf = protocol.encode(id,route,msg);
        buf.charCodeAt(0).should.equal(0xff);
        buf.charCodeAt(4).should.equal(7);
        buf.length.should.equal(5+route.length+JSON.stringify(msg).length);
    });
});

describe(' Decode Test ',function() {
    it (' normal test',function() {
        var msg = {'name':'pomelo'};
        var route = 'connect';
        var id = 4294967293;
        var buf = protocol.encode(id,route,msg);
        var dmsg = protocol.decode(buf);
        dmsg.id.should.equal(id);
        dmsg.route.should.equal(route);
    });
});


describe(' Chinese message Test ',function() {
    it (' normal test',function() {
        var msg = {'name':'看了v不'};
        var route = 'connect';
        var id = 4294967294;
        var str = protocol.encode(id,route,msg);
        var dmsg = protocol.decode(str);
        dmsg.id.should.equal(id);
				dmsg.route.should.equal(route);
				dmsg.body.should.equal(JSON.stringify(msg));
    });
});

















