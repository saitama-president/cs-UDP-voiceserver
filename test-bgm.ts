import * as dgram from 'dgram'
import * as fs from 'fs'
import * as dotenv from "dotenv"

dotenv.config();

var PORT = 43333;
var BGM_FILE = 'eine8kmono8b.wav';
var HOST = '127.0.0.1';


/**
延々とBGMを垂れ流しにする
(ソースは8Kbps wav)
*/
var client = dgram.createSocket('udp4',(msg, rinfo)=>{
  process.stdout.write(msg);
});
client.on('error',e=>{
  console.dir(e);
});
client.on('message',(msg,info)=>{
  //何もしない
});

function send($payload:Buffer){
  client.send($payload, 0, $payload.length, PORT, HOST,(err, bytes)=>{
    if(err){
      console.log(err);
    }
  });
}

let src=fs.createReadStream(BGM_FILE,{
//  encoding:"binary",
  highWaterMark:8000
});
var sec = 0;

src.on('data',chunk=>{
  //これはこれで一気に読み込んでしまう
  //console.log(chunk.length); 
  send(chunk);
  sec+=chunk.length/8000;
  process.stdout.write(`\r ${sec} sec send `);
});


setInterval(()=>{
  //send(Buffer.alloc(1000,0,'binary'));
},1000);



//エンドレス
setTimeout(()=>{
//  process.exit();
},3000);
