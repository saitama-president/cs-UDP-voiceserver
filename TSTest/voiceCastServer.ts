import * as dgram from 'dgram'

const server = dgram.createSocket('udp4');
let tickCount =0;
let packetCount =0;
let messageCount = 0;
let totalBytes=0;

let sendBytes=0;
let recvBytes=0;

let clients:{life:number,rinfo:dgram.RemoteInfo}[]=[];

let voiceBuff:Buffer=Buffer.alloc(8000,0,'binary');

let lastTime:number =(new Date()).getTime();

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

function bufferOverWrite(data:Buffer){

  let now = (new Date()).getTime();
  let pos = now - lastTime;
  //上書き位置を矯正(125msec = 1KBにする)
  let start = Math.floor(pos / 125) * 1000;

  console.log("START:"+start);
  
  for(var i=0;i < data.length && i < (8000-start) ; i++){
    let seek:number = i + start; 
    let current:number = voiceBuff.readInt8(seek);
    let input:number = data.readInt8(i);
    
    //合成して書き込み
    let mix= current+input;
    mix=mix < -127 ? -127 : mix;
    mix=127 < mix  ? 127 : mix;
    voiceBuff.writeInt8(mix,seek);
  } 
}

/**
受信した
*/
server.on('message', (msg:Buffer, remote:dgram.RemoteInfo) => {
  
  recvBytes+=msg.length;
  totalBytes+=msg.length;

  //packets.push({from:remote,packet:msg});
  bufferOverWrite(msg);
  //現在のバッファに上書き  
  
  messageCount++;
  var v=clients.find(
    e=>
      e.rinfo.port == remote.port
      && e.rinfo.address == remote.address
    );
  if(v){
    v.life=5000;
  }else{
    clients.push({life:5000,rinfo:remote});
  }
});

server.on('listening', () => {
  const address = server.address();
  console.dir(address);
});

server.bind(43333);

/*
延々とクライアントに対して送信する
直近5秒以内に接続してこなかった奴は無視
*/

setInterval(()=>{
  /*
   全クライアント一にパケットを投げる
  */
  clients.forEach(c=>{
    
    server.send(voiceBuff,0,voiceBuff.length,
      c.rinfo.port,c.rinfo.address
    );
    totalBytes+=voiceBuff.length;
    console.log(c.rinfo.address+":"+c.rinfo.port);
    packetCount++;
  });
  voiceBuff.fill(0);

  //寿命削除
  clients=clients.filter(c=>{
    c.life-=1000;
    return 0<c.life;
  });
  //もう一度alloc

  lastTime =(new Date()).getTime();
  /*現在の状態*/
  process.stdout.write(`\r [${tickCount}] C=${clients.length} Pa:${packetCount} Ms:${messageCount} Bytes:${sendBytes}|${recvBytes}|${totalBytes} `);
  tickCount++;
},1000);

