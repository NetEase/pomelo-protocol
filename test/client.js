var Protocol = require('../lib/protocol');
var route = "";
for(var i= 0;i<255;i++) {
    route+="t";
}
var msg = {'name':'pomelo'};
var route = 'connect';
var id = 4294967294;
debugger;
var str = Protocol.encode(id,route,msg);
console.log(str);
var dmsg = Protocol.decode(str);
console.log(dmsg.id);
console.log(dmsg.route);
console.log('%j',dmsg);
