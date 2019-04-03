import * as dgram from 'dgram'

const server = dgram.createSocket('udp4');
let tickCount =0;
let packetCount =0;
let messageCount = 0;
let totalBytes=0;

let sendBytes=0;
let recvBytes=0;

let clients:{life:number,rinfo:dgram.RemoteInfo}[]=[];
let packets:{from:dgram.RemoteInfo,packet:Buffer}[]=[];

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg:Buffer, remote:dgram.RemoteInfo) => {
  
  recvBytes+=msg.length;
  totalBytes+=msg.length;

  packets.push({from:remote,packet:msg});
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

server.bind(42222);

/*
延々とクライアントに対して送信する
直近5秒以内に接続してこなかった奴は無視
*/

setInterval(()=>{

  let p : {
    from: dgram.RemoteInfo,
    packet: Buffer
  };
  while(p = packets.shift() as {
    from: dgram.RemoteInfo,
    packet: Buffer
  }){
    /*
    クライアント一覧にパケットを投げる
    */
    clients.forEach(c=>{ 
      //自分自身には送信しない
      if(p.from.address == c.rinfo.address
        && p.from.port == c.rinfo.port){

	//        console.log("自分自身なので送らない");
        return false;
      }

      server.send(p.packet,0,p.packet.length,
        c.rinfo.port,c.rinfo.address
      );
      totalBytes+=p.packet.length;
      packetCount++;
    });
  }
  clients=clients.filter(c=>{
    c.life-=1000;
    return 0<c.life;
  });

  /*現在の状態*/
  process.stdout.write(`\r [${tickCount}] C=${clients.length} Pa:${packetCount} Ms:${messageCount} Bytes:${sendBytes}|${recvBytes}|${totalBytes} `);
  tickCount++;
},1000);

