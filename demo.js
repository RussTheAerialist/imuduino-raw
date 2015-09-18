var imuduino = require('./imuduino')({
  autoConnect: true
});

imuduino.on('peripheral', function (p) {
  console.log('discovered ' + p.uuid + ' ' + p.advertisement.localName);
});

imuduino.on('connect', function (p) {
  console.log('connected ' + p.advertisement.localName);
});

imuduino.on('packet', function (p) {
  console.log(p);
});
