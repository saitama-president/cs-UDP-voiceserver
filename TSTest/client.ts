import * as dgram from 'dgram'

var PORT = 41234;
var HOST = '13.230.251.141';


var client = dgram.createSocket('udp4',(msg, rinfo)=>{
  process.stdout.write(msg);
});

client.on('error',e=>{
  console.dir(e);
});

client.setSendBufferSize(1<<17);


function send($payload){
  client.send($payload, 0, $payload.length, PORT, HOST,(err, bytes)=>{
    //process.stdout.write($payload);
    if(err){
      console.log(err);
    }
  });
}



var message = Buffer.from('1234567890');
var heavy= Buffer.alloc(66000).fill("H");

const str="あいうえおかきくけこさしすせそたちつてとなにぬねの";
for(var i=0;i<3;i++){
  var $c=str.substr( i % 20 , 4 );
  send(heavy);
}


