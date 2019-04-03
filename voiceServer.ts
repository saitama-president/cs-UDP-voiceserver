import * as dgram from 'dgram'

const server = dgram.createSocket('udp4');

const Hz=8000;

let buff=[];

server.setRecvBufferSize(Hz);

let listeners = {
  [key:string]:number
};



server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  process.stdout.write(msg);
  var response=Buffer.from("OKOK!");
  
  server.send(
    response,
    0,
    response.length,
    rinfo.port,
    rinfo.address);
  // port:address のハッシュ値を取得する
  let $key=`${rinfo.port}:${rinfo.port.toString()}`;
  if($key in listeners){
    //寿命を延ばす
    listeners[$key]+=1050;
  }else{
    //寿命セット
    listeners[$key]+=5000;
  }

  //音声mix


});

function VoiceMix(buff){
  let data=Int8Array.from(buff);

  //現在のvoiceをin
  let source

}


server.on('listening', () => {
  const address = server.address();
  console.dir(address);
});

/**
まず5秒分くらいのバッファを作る
*/



setInterval(()=>{
  /*
    全員の寿命を削る
  */
//  Object.keys(listeners).map(())
//  listeners.map($)
  Object.keys(listeners).forEach(key=>{
       this[key]-=
  },listeners);
} ,1000);


server.bind(41234);

/*
延々とクライアントに対して送信する
直近5秒以内に接続してこなかった奴は無視
*/


