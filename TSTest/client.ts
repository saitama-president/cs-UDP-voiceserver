import * as dgram from 'dgram'

var PORT = 41234;
var HOST = '127.0.0.1';


var client = dgram.createSocket('udp4',(msg, rinfo)=>{
  process.stdout.write(msg);
});

function send($payload){
  client.send($payload, 0, message.length, PORT, HOST,(err, bytes)=>{
    process.stdout.write($payload);
  });
}



var message = Buffer.from('1234567890');

const str="あいうえおかきくけこさしすせそたちつてとなにぬねの";
for(var i=0;i<300;i++){
  var $c=str.substr(i%24,2);
  send($c);
}


