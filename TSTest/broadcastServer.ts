import * as dgram from 'dgram'

const server = dgram.createSocket('udp4');

let buff=[];

server.setRecvBufferSize(10*1024);

let clients:{life:number,rinfo:any}[]=[];
let packets:[]=[];

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  process.stdout.write(msg);
  var response=Buffer.from("OKOK!");
  //送り返す
  server.send(response,0,response.length,rinfo.port,rinfo.address);
  
});

server.on('listening', () => {
  const address = server.address();
  console.dir(address);
});


setInterval(()=>{
  Object.keys(listeners).forEach(key=>{
       this[key]-=
  },listeners);
} ,1000);


server.bind(41234);

/*
延々とクライアントに対して送信する
直近5秒以内に接続してこなかった奴は無視
*/

setInterval(()=>{

  let packet:Buffer = null;
  while(packet = packets.shift() ){
    /*
    クライアント一覧にパケットを投げる
    */
    clients.forEach(c=>{
      
      server.send(packet,0,packet.length,
        c.rinfo.port,c.rinfo.address
      );
    });
  }
  clients=clients.filter(c=>false);

},1000);

