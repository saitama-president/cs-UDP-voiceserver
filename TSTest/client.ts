import * as dgram from 'dgram'

var PORT = 42222;
var HOST = '127.0.0.1';


var client = dgram.createSocket('udp4',(msg, rinfo)=>{
  process.stdout.write(msg);
});

client.on('error',e=>{
  console.dir(e);
});

client.on('message',(msg,info)=>{
  console.dir(msg);
});

function send($payload:Buffer){
  client.send($payload, 0, $payload.length, PORT, HOST,(err, bytes)=>{
    //process.stdout.write($payload);
    if(err){
      console.log(err);
    }
  });
}



var message = Buffer.from('1234567890');
//var heavy= Buffer.alloc(66000).fill("H");

const str="あいうえおかきくけこさしすせそたちつてとなにぬねの";
for(var i=0;i<3;i++){
  var $c=str.substr( i % 20 , 4 );
  send(Buffer.from(str));
}

setTimeout(()=>{
  process.exit();
},1000);
