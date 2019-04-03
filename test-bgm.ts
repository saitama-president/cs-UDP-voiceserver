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

//var seek:number = 0;
var sendTotal = 0;

function BGMLoop(){
  var interval:any = null;
  fs.open(BGM_FILE,'r',(status,fd)=>{

     interval=setInterval(()=>{
      if(status){
        console.log("end");
        return;
      }
      
      var buffer = Buffer.alloc(8000);
        fs.read(fd, buffer,0, 8000, null,(err, num,buff)=>{
          
          if(0==num){
            clearInterval(interval);
            BGMLoop();
            console.log("Loop");
            return;
          }
          //console.log("READ:"+num);
          send(buff);
      });
    },1000);//1秒固定
  });
}



//エンドレス
setTimeout(()=>{
//  process.exit();
},3000);

BGMLoop();
