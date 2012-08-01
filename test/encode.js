var should = require('should');
var protocol = require('../lib/protocol');

describe(' encode Test ',function() {
    it(' normal test',function() {
        var msg = {'name':'pomelo'};
        var route = 'connect';
        var id = 4294967293;
        var buf = protocol.encode(id,route,msg);
        console.log(buf);
        buf[0].should.equal(0xff);
        buf[4].should.equal(7);
        buf.length.should.equal(5+route.length+JSON.stringify(msg).length);
        //console.log(buf.toString('ascii',0,buf.length));
    });
});

describe(' Decode Test ',function() {
    it (' normal test',function() {
        var msg = '\0\0\0\3\34connector.loginHandler.login{"route":"connector.loginHandler.login","username":"yph5","password":"123","timestamp":1343788088493}';
        var dmsg = protocol.decode(msg);
        dmsg.id.should.equal(3);
    });
});

