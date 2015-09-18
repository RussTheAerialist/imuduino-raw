var emitter = require('events').EventEmitter,
    noble = require('noble'),
    parser = require('./parser'),
    uuids = require('imuduino-service-info');

function Imuduino(opts) {
  if (!(this instanceof Imuduino)) {
    return new Imuduino(opts);
  }

  var self = this;
  opts = opts || {};
  this.buffer = [];

  noble.on('discover', function (peripheral) {
    self.emit('peripheral', peripheral);
    if (peripheral.advertisement.localName == 'UART' && opts.autoConnect) {
      self.connect(peripheral);
      noble.stopScanning();
    }
  });
  noble.on('stateChange', function (state) {
    if (state == 'poweredOn') {
      noble.startScanning();
    }
  });
}

module.exports = Imuduino;
Imuduino.prototype = new emitter();

Imuduino.prototype.connect = function (p) {
  var self = this;
  p.connect(function() {
    self.emit('connect', p);
    p.discoverServices([], function(err, all_services) {
      if (err) {
        throw err;
      }
      var services = all_services.filter(function (s) {
        return s.uuid == uuids.uart;
      });

      services[0].discoverCharacteristics([], function(err, all_chars) {
        if (err) {
          throw err;
        }
        var characteristics = all_chars.filter(function (c) {
          return c.uuid == uuids.rx;
        });

        var characteristic = characteristics[0];
        characteristic.on('read', function(data) {
          parser.parse_buffer(data, function(p) {
            self.emit('packet', p);
          });
        });
        characteristic.notify(true); // Start Receiving
      });
    });
  });
};