const mineflayer = require('mineflayer')
const cmd = require('mineflayer-cmd').plugin
const fs = require('fs');

const config = require('./config.json')
const host = config.ip
const username = config.name
const nightskip = "true"

let lasttime = -1;
let moving = 0;
let connected = 0;
let lastaction;
let pi = 3.14159;
let moveinterval = 2;
let maxrandom = 5;

let actions = [ 'forward', 'back', 'left', 'right']
let bot = mineflayer.createBot({host: host, username: username});

function getRandomArbitrary(min, max) {
       return Math.random() * (max - min) + min;
}

bot.loadPlugin(cmd)

bot.on('login', () => {
	console.log(username + ' joined the server! Server:-' + host)
	bot.chat("I joined the server!");
});

bot.on('time', (time) => {

	if(nightskip == "true"){

	    if(bot.time.timeOfDay >= 13000){
	        bot.chat('/time set day')
        }
    }

    if(connected <1){
        return;
    }

    if(lasttime<0){
        lasttime = bot.time.age;
    }
    else{

        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval*20 + randomadd;

        if (bot.time.age - lasttime > interval) {

            if (moving == 1) {

                bot.setControlState(lastaction,false);
                moving = 0;
                lasttime = bot.time.age;
            }
            else{

                var yaw = Math.random()*pi - (0.5*pi);
                var pitch = Math.random()*pi - (0.5*pi);

                bot.look(yaw, pitch, false);

                lastaction = actions[Math.floor(Math.random() * actions.length)];

                bot.setControlState(lastaction,true);

                moving = 1;

                lasttime = bot.time.age;

                bot.activateItem();
            }
        }
    }
});

bot.on('spawn',function() {
    connected=1;
});

bot.on('death',function() {
    bot.emit("respawn")
});