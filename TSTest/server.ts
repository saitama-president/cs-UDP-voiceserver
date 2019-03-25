import * as dgram from 'dgram'

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  process.stdout.write(msg);
  //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  var response=Buffer.from("OKOK!");
  server.send(
    response,
    0,
    response.length,
    rinfo.port,
    rinfo.address);

});

server.on('listening', () => {
  const address = server.address();
  console.dir(address);
});

server.bind(41234);
