import * as dgram from 'dgram'
import {sprintf} from 'sprintf-js'

interface PacketMetrix{
  tickCount:number,
  packetCount:number,
  messageCount:number,
  totalBytes:number,
  sendBytes:number,
  recvBytes:number
};

interface UDPPacket{
  packet:Buffer,
  info:dgram.RemoteInfo
}

interface VoiceServerOpt{
  freq:number,
  port?:number,
  quantizeBit:16|8
}

const PacketMetrix={
  tickCount:0,
  packetCount:0,
  messageCount:0,
  totalBytes:0,
  sendBytes:0,
  recvBytes:0
};

class ClientList extends Map<dgram.RemoteInfo,string>{

  public blackIP(){
  }
  
  public whiteList(){
    
    return Array.from(this.keys())
      .filter(k=>{
        //ブラックリスト検索

        //OKなホストのみ
        return this.get(k)=="OK";
      });
  }
}


class VoiceServer{
  public port:number=0;
  protected socket:any;
  public clientList:ClientList=new ClientList();

  private voiceBuff:Buffer;
  private lastTime:number =(new Date()).getTime();

  public accept(info:dgram.RemoteInfo){
    if(!this.clientList.has(info)){
      this.clientList.set(info,"OK");
    }
  }


  private constructor($port:number = 44333,
    opt:VoiceServerOpt={
      freq:8000,
      quantizeBit:8
    }){

    let $socket=dgram.createSocket('udp4');

    $socket.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      $socket.close();
    });

    $socket.on('listening', () => {
      console.dir($socket.address);
    });
    this.voiceBuff = Buffer.alloc(opt.freq/8*opt.quantizeBit,0,'binary');

    this.socket=$socket;
    this.clientList.whiteList();
  }

  public static Start(
    $port:number = 8000,
    opt:VoiceServerOpt = {
      freq:8000,
      quantizeBit:8
    }):VoiceServer{
     
    const instance:VoiceServer = new VoiceServer($port,opt);

    instance.socket.bind($port);
    var interval = setInterval(instance.echoAll);
    instance.socket.on('message',instance.voiceListen); 
    return instance;
  }

  //基本的にホワイトリストにデータをそうしんするだけ
  private echoAll(){
    this.clientList.whiteList().forEach(
      remote=>{
        //送信
      }
    );
  }

  private voiceListen(msg:Buffer, remote:dgram.RemoteInfo){


  }
}

const vserver=VoiceServer.Start(44333);


/*
function bufferOverWrite(data:Buffer){

  let now = (new Date()).getTime();
  let pos = now - lastTime;
  //上書き位置を矯正(125msec = 1KBにする)
  let start = Math.floor(pos / 125) * 1000;

  
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
*/

/**
受信した
*/
/*
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
    vserver.accept(remote);
  }
});
*/


/*
延々とクライアントに対して送信する
直近5秒以内に接続してこなかった奴は無視
*/

/*
setInterval(()=>{
  //
  clients.forEach(c=>{
    
    server.send(voiceBuff,0,voiceBuff.length,
      c.rinfo.port,c.rinfo.address
    );
    totalBytes+=voiceBuff.length;
    sendBytes+=voiceBuff.length;
    //console.log(c.rinfo.address+":"+c.rinfo.port);
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
  //
  process.stdout.write(
    `\r [${tickCount}] `+
    `C=${clients.length} `+
    `Pa:${packetCount} `+
    `Ms:${messageCount} `+ 
    `Bytes:${unitConv(sendBytes)}|${unitConv(recvBytes)}|${unitConv(totalBytes)} `);
  tickCount++;
},1000);
*/

/* -h */
function unitConv(v:number){
  if(v<(1<<10))return sprintf("%d B",v);
  if(v<(1<<20))return sprintf("%5.2f KB",v/(1<<10));
  if(v<(1<<30))return sprintf("%5.2f MB",v/(1<<20));
} 
