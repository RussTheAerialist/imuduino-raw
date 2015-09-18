IMUduino Raw Data For Node
=========================

If you are using a Bluetooth 4.0 adapter on a GNU/Linux machine, you may need to run the following command from within this folder:

```
find -path '*noble*Release/hci-ble' -exec sudo setcap cap_net_raw+eip '{}' \;
```
...This will allow the noble library to run without requiring 'sudo' to access local hardware.

Note, if you have multiple Bluetooth HCI devices on your machine, you may need to power down the non-BLE capable devices using `hciconfig hciX down` (X is the index number, as seen with the `hcitool` command).

# Starting up

1. npm install imuduino-raw
2. load the raw_values.ino from the repository onto the arduino
3. Take a look at demo.js for how to use.

```
# Assuming hci0 is a Bluetooth LE capable HCI device. CTRL-C to stop scanning.
sudo hcitool -i hci0 lescan
```
