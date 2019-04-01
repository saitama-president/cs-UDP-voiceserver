import * as dgram from 'dgram'

var PORT = 43333;
var HOST = '127.0.0.1';


var client = dgram.createSocket('udp4',(msg, rinfo)=>{
  process.stdout.write(msg);
});

client.on('error',e=>{
  console.dir(e);
});

client.on('message',(msg,info)=>{
  /*console.dir(msg);*/
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

//1000バイトずつ贈る
setInterval(()=>{
  send(Buffer.alloc(1000,2,'binary'));
//},125);
},12);

setTimeout(()=>{
  process.exit();
},3000);
