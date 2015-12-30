#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var LEDs = "/sys/firmware/lpd8806/device/rgb";
var LEDcount = process.env.STRING_LEN;
var ms = 50;
var colorUp = "50 0 0";
var colorDown = "0 50 50";
var colorUpOff = "0 0 0";
var colorDownOff= "0 0 25";

console.log("LEDcount = %d", LEDcount);

var fd = fs.openSync(LEDs, 'w');
console.log("fd=%d", fd);

// for(var i = 0; i < LEDcount; i++) {
//     // fs.writeSync(fd, util.format("150 0 0 %d", i));
//     fs.write(fd, util.format("0 50 0 %d", i));
// }

for(var i = 0; i<30*10; i+=30) {
    console.log("i=%d", i);
    setTimeout(updateLED, i*ms, 0, 1, 0, LEDcount, colorUp, colorUpOff);
}
setInterval(updateString, ms);

function updateLED(pos, dir, start, stop, color, colorOff) {
    fs.write(fd, util.format("%s %d", colorOff, pos));
    // console.log("fd=%d", fd);
    // fs.writeSync(fd, util.format("0 0 0 %d", pos));
    // console.log("pos=%d, dir=%d, start=%d, stop=%d", pos, dir, start, stop);
    pos += dir;
    if(pos >= stop || pos < start) {
        dir = -dir;
        pos += dir;
        if(dir>0) {
            color=colorUp;
            colorOff=colorUpOff;
        } else {
            color = colorDown;
            colorOff=colorDownOff;
        }
        console.log("dir = %d", dir);
    }
  fs.write(fd, util.format("%s %d", color, pos), 0, 'utf8', function(err, written, string) {});
    // fs.writeSync(fd, util.format("0 150 0 %d\n", pos));
    setTimeout(updateLED, ms, pos, dir, start, stop, color, colorOff);
}

function updateString() {
    fs.write(fd, "\n");
}
// fs.closeSync(fd);