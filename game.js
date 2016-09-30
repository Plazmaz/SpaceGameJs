var canvas = document.createElement('canvas'),
    height = canvas.height = window.innerHeight,
    width = canvas.width = window.innerWidth;
var canv = canvas.getContext('2d');
document.body.appendChild(canvas);
var playerimg = new Image();
var mosbossimg = new Image();
var bossimg = new Image();
var enimg = new Image();
var turbobossimg = new Image();
var notimeout = true;
var bbbimg = new Image();
var player = new playerf();
var pbullets = [];
var ebullets = [];
var enemies = [];
var boombs = [];
var rainbows= [];
var refreshen = false;
var paused = false;
var refreshenhealth = false;
var playerlaser=false;
var enemyhealth = 3;
var lvl = 0;
var shots = 0;
loadScore();
var shooting = false;
var laserlength=height-2/20;

playerimg.src = "/Spaceship.png";
turbobossimg.src ="/TheBOSS.png";
enimg.src = "/Enemy.png";
bossimg.src = "/Boss.png";
mosbossimg.src = "/MosquitoBoss.png";
bbbimg.src = "/TheBBB.png";
var bg = new Image();
var texty = height / 2;
var textx = width / 2 - 180;
bg.src = "/StarField.png";
setInterval(draw, 50);
var textoffset = 0;
var pcomp = false,
    bcomp = false,
    attackfinished = false,
    firsttime = true;
var bl = false,
    pl = false,
    el = false,
    mbl = false;
document.body.addEventListener("keydown", onKeyDown);
document.body.addEventListener("keyup", onKeyUp);
canvas.focus();


bg.onload = function () {
    bl = true;
};
playerimg.onload = function () {
    pl = true;
};
enimg.onload = function () {
    el = true;
};
mosbossimg.onload = function () {
    mbl = true;
};
setInterval(new

function () {
    if (shooting) {
        if (lvl >= 10) {
            for (var j = -2; j < 2; j++) {
                var tmp = new bullet(player.x + player.drawsize / 2 - 2, height - player.drawsize / 1.2 - 2);
                tmp.accx = j;
                pbullets.push(tmp);
            }
        } else {
            pbullets.push(new bullet(player.x + player.drawsize / 2 - 2, height - player.drawsize / 1.2 - 2));
        }
    }
}, 100);

function draw() {
    canv.clearRect(0, 0, width, height);

    if (enemies.length === 0 && player.health > 0 && !firsttime) {

        if(lvl % 9 === 0 && lvl !=0 ) {  
            shots++;
        }
        lvl++;
        if (lvl % 10 !== 0 || lvl === 0) {
            for (var i = 10; i < width - 60; i += 60) {
                enemies.push(new enemy(i, 20));
            }
        } else {
            var cen = new enemy((width / 2) - 150, -90);
            if (lvl % 20 === 0 && lvl % 30 !== 0 && lvl % 100 !== 0) {
                cen.mosboss = true;
                cen.size = 30;
                cen.health = lvl * 8;
                //enemies.push(cen);
            } else if (lvl % 10 === 0 && lvl % 30 !== 0 && lvl % 100 !== 0) {
                cen.boss = true;
                cen.size = 200;
                cen.health = lvl * 12;
                // enemies.push(cen);    
            } else if (lvl % 30 === 0)  {
                cen.bbb = true;
                cen.size = 180;
                cen.health = lvl * 12;
            } else if (lvl % 100 === 0) {
                cen.tb = true;
                cen.size = 250;
                cen.health = lvl * 13;
            }
            enemies.push(cen);
        }
        if (lvl % 5 === 0) {
            refreshenhealth = true;
        }
        player.health = player.maxhealth;
        saveScore();

    }


    if (refreshenhealth) {
        enemyhealth += 5;
        player.health += 2;
        player.maxhealth += 2;
        refreshenhealth = false;
    }



    
    if (bl) canv.drawImage(bg, 0, 0, width, height);
    canv.font = 'Bold 20px Sans-Serif';
    canv.fillStyle = 'red';

    if (firsttime) {
        canv.fillText("Press Any Key to Begin.", width / 2 - 110, height / 2);
        return;
    }
    if (paused) {
        canv.fillText("Paused, Press Any Key to Resume.", width / 2 - 150, height / 2);
        return;
    }
    canv.fillText("Wave " + lvl, 10, 20);
    canv.fillText("Life: " + player.health, 10, 40);

    if (player.health <= 0 || attackfinished) {
        shots = 1;
        lvl = 0;
        saveScore();
        for (var j = 0; j < 50; j++) {
            var tmp = new boomparticle(player.x, player.y);
            tmp.maxlife = 2000;
            boombs.push(tmp);
        }
        setInterval(new

        function () {
            if (enemies.length > 0) enemies[0].hitcount = enemies[0].health;
        }, 3000);
        canv.font = 'Bold Italic 60px Sans-Serif';
        canv.fillText("GAME OVER", textx, texty);
        canv.font = 'Bold 60px Serif';
        canv.fillText("CREDITS", textx + 20, texty + height);
        canv.font = 'Bold 20px Serif';
        canv.fillText("Dylan K. - Creator, Designer, Artist", textx + 10, texty + height + 60);
        canv.fillText("Geoffrey S. - Co-Designer, Co-Artist", textx + 10, texty + height + 120);
        canv.fillText("Luke S. - Tester/Creative executive", textx + 10, texty + height + 180);
        texty -= 5;
        if (textoffset >= height / 2 + 140) canv.fillText("Press Any Key to Restart.", width / 2 - 110, height / 2);
        player.x = 5000000;
        player.left = false;
        player.right = false;
        textoffset += 3;
        //return;
    }
    if(playerlaser) {
            for(var i=0;i<laserlength-1;i++) {
                var tmp = rainbows[i];
                tmp.x=player.x+player.size/2;
                tmp.y=player.y+5-(i*20);
                tmp.x2=player.x+player.size/2;
                tmp.y2=player.y-(i*20)-20;
            }
    } else {
            for(var i=0;i<laserlength-1;i++) {
                var tmp = rainbows[i];
                tmp.x=5000;
                tmp.y=5000;
                tmp.x2=5000;
                tmp.y2=5000;
            }
    }
    for (var i = 0; i < pbullets.length; i++) {
        canv.fillStyle = "red";
        pbullets[i].update(false);
        canv.fillRect(pbullets[i].x, pbullets[i].y, pbullets[i].drawsize, pbullets[i].drawsize);
            if (pbullets[i].y < 0) {
                pbullets.splice(i, 1);
                continue;
            }
        for (var j = 0; j < enemies.length; j++) {

            if (isColliding(pbullets[i], enemies[j])) {
                enemies[j].hitcount++;
                for (var k = 0; k < 2; k++) {
                    boombs.push(new boomparticle(pbullets[i].x, pbullets[i].y));
                }
                pbullets.splice(i, 1);

            }
        }
    }
    for(var j=0;j<rainbows.length;j++) {
        rainbows[j].draw();
        rainbows[j].update();
        
    }
    for (var i = 0; i < ebullets.length; i++) {
        canv.fillStyle = "lime";
        if (isColliding(ebullets[i], player)) {
            player.health--;
            ebullets.splice(i, 1);
            continue;
        }
        if (ebullets[i].y > height) {
            ebullets.splice(i, 1);
            continue;
        } else {
        	ebullets[i].update(true);
        	canv.fillRect(ebullets[i].x, ebullets[i].y, ebullets[i].drawsize, ebullets[i].drawsize);
	}
    }
    for (var i = 0; i < boombs.length; i++) {
    var bp = boombs[i];
    if (bp.life >= bp.maxlife) {
        boombs.splice(i, 1);
        bp=null;
        continue;
    } else {
    bp.update();
    bp.draw();
    }
}
    if (pl) canv.drawImage(playerimg, player.x, player.y, player.drawsize, player.drawsize);
    player.update();
    if (el) for (var i = 0; i < enemies.length; i++) {
        var tmp = enemies[i];
        if (tmp.boss == true) {
            canv.drawImage(bossimg, tmp.x, enemies[i].y, tmp.size, tmp.size)
        } else if (tmp.mosboss == true) {
            canv.drawImage(mosbossimg, tmp.x, tmp.y, tmp.size, tmp.size);
        } else if (tmp.bbb) {
            canv.drawImage(bbbimg, tmp.x, tmp.y, tmp.size, tmp.size);
        } else if (tmp.tb) {
            canv.drawImage(turbobossimg, tmp.x, tmp.y, tmp.size, tmp.size);
        } else {
            canv.drawImage(enimg, tmp.x, tmp.y, tmp.size, tmp.size);
        }

    
    tmp.update();
    if (tmp.hitcount >= tmp.health) {
        for (var j = 0; j < 5; j++) {
            if (player.health <= 0) boombs.push((new boomparticle(tmp.x, tmp.y).maxlife = 50));
            else boombs.push(new boomparticle(tmp.x, tmp.y));
        }
        if (tmp.boss || tmp.tbt || tmp.bbb) {
            for (var k = 0; k < 50; k++) {
		var tmpb=new boomparticle(tmp.x + tmp.size / 2, tmp.y + tmp.size / 2);
		tmpb.maxlife=50;
                boombs.push(tmpb);
            }
            
        }
        enemies.splice(i, 1);
    }
    }
}



function playerf() {
    this.x = width / 2 - 45;
    this.y = height - 90;
    this.health = 3;
    this.maxhealth = 3
    this.drawsize = 60;
    this.size = 60;
    this.left = false;
    this.right = false;
    this.speed = 20;
    this.update = function () {
        if (this.left && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.right && this.x < width - 90) {
            this.x += this.speed;
        }
    }
}

function bullet(x, y) {

    this.targx = player.x + player.size / 2;
    this.targy = player.y + player.size / 2;
    this.x = x;
    this.y = y;
    this.size = 4;
    this.drawsize = 4;
    this.accx = 0;
    this.accy = 10;
    this.update = function (enemy) {
        if (!enemy) {
            this.y -= this.accy;
            this.x += this.accx;
        } else {
            this.y += this.accy;
            this.x += this.accx;
        }
    };
}

function enemy(x, y) {
    this.x = x;
    this.y = y;
    this.size = 60;
    this.bbb = false;
    this.tb = false;
    this.tbt = 0;
    this.hitcount = 0;
    this.timer = 0;
    this.nextdest = Math.random() * width;
    this.boss = false;
    this.mosboss = false;
    this.lastupdate = 1;
    this.health = enemyhealth;
    this.recycled = false;
    this.mcounter = 0;
    this.bbbt = 0;
    this.targx = 0;
    this.targy = 0;
    this.update = function () {
        if (lvl % 5 == 0 && lvl != 0) {
            if (this.lastupdate != lvl) {
                this.health += 5;
                // refreshenhealth=true;
                this.lastupdate = lvl;
            }
        }
        if (this.y > height) {
            this.y = 40;
            this.recycled = true;
            //refreshen=true;
        }
        if (!this.boss && !this.mosboss && !this.tb && !this.bbb || this.y < 0) {
            this.y += Math.random() * 1;
        }
        if (this.tb) {
            this.tbt++;
            if (this.tbt >= 20) {
                var tmpr = Math.round(Math.random()) * 3
                if (tmpr <= 1) {
                    var tmp = new bullet((this.x + this.size / 2) + 50, this.y + this.size - 5);
                    tmp.timer=0
                    tmp.size = 20;
                    tmp.drawsize = 20
                  
                    tmp.update = function (enemy) {
                        if(this.timer>=height/10) {
                          this.size=0;
                          this.drawsize=0;
                          this.posy=50000;
                        }
                        if (!enemy) {
                            this.y -= this.accy;
                            this.x += this.accx;
                        } else {
                            this.y += this.accy;
                            this.x += this.accx;
                            if (this.timer <= height/10) {
                                for (var x = 0; x < width; x += 128) {
                                    ebullets.push(new bullet(x, this.y));
                                }
                                this.update=function() {
                                    if(!enemy) {
                                        this.y-=accy;
                                        this.x+=this.accx;
                                    } else {
                                      this.y+=this.accy;
                                      this.x+=this.accx;
                                    }
                                }
                                this.size=4;
                            }
                        }
                    };
                    ebullets.push(tmp);
                } else if(tmpr==2){
                    var tmp = new bullet((this.x + this.size / 2) + 50, this.y + this.size - 5);
                    tmp.size = 10;
                    tmp.drawsize = 10;
                    tmp.life=0;
                    tmp.update = function (enemy) {
                        this.life++;
                        if(this.life>=height/3) {
                            this.y=5000;
                            return;
                        }
                        if (!enemy) {
                            this.y -= this.accy;
                            this.x += this.accx;
                        } else {
                            if (this.y < player.y+player.size/2) {
                                this.y += 5;
                            } 
                            if (this.y > player.y+player.size/2) {
                                this.y -= 5;
                            } 
                            if (this.x < player.x+player.size/2) {
                                this.x += 5;
                            } 
                            if (this.x > player.x+player.size/2) {
                                this.x -= 5;
                            } 
                            
                        }
                    };
                    ebullets.push(tmp);
                } else if(tmpr==3){
                    for(var i=laserlength;i<rainbows.length;i++) {
                        rainbows[i].x=(this.x + this.size / 2)
                        rainbows[i].y=this.y + this.size - 5;
                        rainbows[i].x2=player.x+player.size/2;
                        rainbows[i].y2=player.y+player.size/2;
                        rainbows[i].isenemy=true;
                    }
            }
                this.tbt = 0;
            }
        }
        if (this.mosboss || this.bbb) {
            this.mcounter++;
            if (this.mcounter >= 80) {
                this.nextdest = (Math.random() * width - this.size) + this.size
                this.mcounter = 0;
            }
            if (this.x + 20 < this.nextdest) {
                this.x += 20;
            } else if (this.x - 20 > this.nextdest) {
                this.x -= 20;
            } else {
                this.x = this.nextdest;
            }
            if (Math.floor(Math.random() * 20) <= 1) {
                ebullets.push(new bullet(this.x + this.size / 2, this.y + this.size / 2));
            }
        }
        if (!this.boss && !this.mossboss) {
            if (Math.floor(Math.random() * 201) <= 1) {
                ebullets.push(new bullet(this.x + this.size / 2, this.y + this.size / 2));
            }
        }
        if (this.boss) {
            this.timer++;
            if (this.timer >= 60) {
                for (var i = -10; i < 10; i++) {
                    var tmp = new bullet((this.x + this.size / 2) + 50, this.y + this.size - 5);
                    tmp.accx = i;
                    ebullets.push(tmp);
                }
                this.timer = 0;
            }
            if (Math.floor(Math.random() * 201) <= 1) {
                enemies.push(new enemy((Math.random() * width - 100) + 50, this.y));
            }


        }
        if (this.bbb) {
            this.bbbt++;
            if (this.bbbt >= 45) {
                for (var i = -5; i < 5; i++) {
                    var tmp = new bullet((this.x + this.size / 2), this.y + this.size);
                    tmp.accx = i;
                    tmp.x = this.x + this.size / 2 + i
                    tmp.y = this.y + this.size - Math.abs(i);

                    ebullets.push(tmp);
                }
            }
            if (this.bbbt >= 47) {
                this.laser = false;
                this.bbbt = 0;
            }
            if (Math.floor(Math.random() * 801) <= 1) {

                var tmp = new enemy((Math.random() * width - 100) + 50, this.y);
                tmp.mosboss = true;
                enemies.push(tmp);
            }


        }

    }

}

function onKeyDown(e) {
    if (e.keyCode == 37) player.left = true;
    if (e.keyCode == 39) player.right = true;
    if(e.keyCode==88 && lvl>100) playerlaser=true;
}

function onKeyUp(e) {
    if (e.keyCode == 37) player.left = false;
    if (e.keyCode == 39) player.right = false;
    if (e.keyCode == 88) {
        if (shots > 1 && lvl<=100) {
            for (var j = -shots; j < shots; j++) {
                var tmp = new bullet(player.x + player.drawsize / 2 - 2, height - player.drawsize / 1.2 - 2);
                tmp.accx = j;
                pbullets.push(tmp);
            }
        } else if(lvl<100) {
            pbullets.push(new bullet(player.x + player.drawsize / 2 - 2, height - player.drawsize / 1.2 - 2));
        } else {
              playerlaser=false;        
        }
    }
    if ((player.health <= 0 || attackfinished) && textoffset >= height / 2 + 140) reset();
    if (firsttime) {
        pbullets = [];
        ebullets = [];
        enemies = [];
        boombs = [];
        rainbows=[];
        for(var i=0;i<laserlength;i++) {
            rainbows.push(new rainbow(5000,5000,5000,5000,false));
        }
        refreshen = false;
        refreshenhealth = false;
        texty = height / 2;
        textx = width / 2 - 180;
        textoffset = 0;
        attackfinished = false;
        player = new playerf();
        firsttime = false;
    }
    if (paused) {
        paused = false
    }
    if (e.keyCode == 80) paused = true;
}

function isColliding(p, p2) {
    if (p.x > p2.x + p2.size || p.x - p.size < p2.x || p.y > p2.y + p2.size || p.y - p.size < p2.y) {
        return false;
    } else {
        return true;
    }

}

function boomparticle(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxlife = 8;
    this.accx = Math.floor(Math.random() * (3 - -3 + 1)) + -3;
    this.accy = Math.floor(Math.random() * (3 - -3 + 1)) + -3;
    this.color = "rgb(" + Math.floor(Math.random() * 255) + ",0," + Math.floor(Math.random() * 100) + ")";
    this.draw = function() {
        canv.fillStyle = this.color;
        canv.fillRect(this.x, this.y, 4, 4);
    }
    this.update = function() {
        this.x += this.accx;
        this.y += this.accy;
        this.life++;
    }
}

function reset() {

    pbullets = [];
    ebullets = [];
    enemies = [];
    boombs = [];
    rainbows=[];
    refreshen = false;
    refreshenhealth = false;
    enemyhealth = 3
    lvl = 0;
    for(var i=0;i<laserlength;i++) {
        rainbows.push(new rainbow(5000,5000,5000,5000,false));
    }
    shots = 1;
    saveScore();
    texty = height / 2;
    textx = width / 2 - 180;
    textoffset = 0;
    attackfinished = false;
    player = new playerf();

}

function saveScore() {
    localStorage.setItem("Score", lvl);
    localStorage.setItem("Shots", shots);
}

function loadScore() {
    lvl = localStorage.getItem("Score");
    shots=lvl/10;
    if (shots == null || shots == 0) {
        shots = 1;
    }
    if (lvl > 0) {
        alert("Welcome Back! Your current level is " + lvl);
        lvl -= 1
    }
    if(lvl>0) {
    player.maxhealth = (lvl/5)*2;
    player.health = player.maxHealth;
    enemyhealth=lvl;
    } else {
        enemyhealth=3;
        player.health=3;
        player.maxhealth=3;
    }
}
function rainbow(x,y,targx,targy,enemy) {
    this.x=targx;
    this.y=targy;
    this.x2=x;
    this.y2=y;
    this.size=20;
    this.updates=0;
    this.isenemy=enemy
    this.draw = function() {
        canv.strokeStyle="red"
        for(var i=-3;i<3;i++) {

            switch(i) {
                case -3: {
                    canv.strokeStyle="Red";
                    break;
                } 
                case -2: {
                  canv.strokeStyle="Orange";
                    break;
                }
                case -1: {
                 canv.strokeStyle="Yellow";  
                    break;
                }
                case 0: {
                  canv.strokeStyle="Blue"  
                    break;
                }
                case 1: {
                    canv.strokeStyle="Green";
                    break;
                }
                case 2: {
                    canv.strokeStyle="Indigo";
                    break;
                }
                case 3: {
                   canv.strokeStyle="Violet";  
                    break;
                }
            }
            canv.beginPath();
            canv.moveTo(this.x2+i,this.y2);
            canv.lineTo(this.x+i,this.y);
            canv.stroke();
        }
    }
    this.update=function() {
        this.updates++;
        if(this.isenemy) {
            if(isColliding(this,player) && this.updates>=25) {
               player.health--; 
               this.updates=0;
            }
        } else {
            for(var i=0;i<enemies.length;i++) {
                //alert(enemies[i]);
                if(isColliding(this,enemies[i]) && this.updates>=5)          
                {
                   enemies[i].hitcount+=Math.round(lvl/8);
                   this.updates=0;
                }
            }
        }
    }
}
function initiateLoginSequence() {
    var isnewplayer=prompt("Hello! Are you new?(Y/N)");
    if(isnewplayer.equalsIgnoreCase("N")) {
        var username = prompt("Enter username.");
        var password = prompt("Enter Password.");
    } else {
        var username = prompt("Enter a username. This will be used for future logins.");
        var password = prompt("Enter a password. This will be used for future logins.","*");
        var req = new XMLHttpRequest();  
        req.open('POST', 'http://69.144.34.106/Scores.php', true);   
        req.send("returning=false"+"&name="+username+"&pw="+password+"&level="+lvl+"&save=true");
        req.send();
    }
}