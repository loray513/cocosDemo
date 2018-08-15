// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var temPlayer = require('player');
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: temPlayer
        },
        dici: {
            default: null,
            type: cc.Prefab
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
        bgAudio: {
            default: null,
            type: cc.AudioClip
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        diciCount: 0,
        jumpHigh: 30,
        wallWidth: 92,
        dc_duration: 120,
        score: 0,
        timeCount: 60,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('OverScene');
        //播放背景音乐
        // cc.audioEngine.play(this.bgAudio);
        cc.audioEngine.playMusic(this.bgAudio, true, 1);
        var self = this;
        // 添加TOUCH_START监听
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            cc.audioEngine.playEffect(self.jumpAudio, false);
            var locationX = event.getLocationX();
            if (locationX > this.width/2) {
                //点击右边
                if (self.player.node.rotationY === 180) {
                    var action1 = cc.moveTo(0.2,cc.v2(this.width/2-self.wallWidth-self.jumpHigh, self.player.node.y));
                    var action2 = cc.moveTo(0.2,cc.v2(this.width/2-self.wallWidth, self.player.node.y));
                    self.player.node.runAction(cc.sequence(action1, action2));
                }else {
                    self.player.node.runAction(cc.moveTo(0.2,cc.v2(this.width/2-self.wallWidth, self.player.node.y)));
                }
                self.player.node.rotationY = 180;
            } else {
                //点击左边
                if (self.player.node.rotationY === 0) {
                    var action1 = cc.moveTo(0.2,cc.v2(-this.width/2+self.wallWidth+self.jumpHigh, self.player.node.y));
                    var action2 = cc.moveTo(0.2,cc.v2(-this.width/2+self.wallWidth, self.player.node.y));
                    self.player.node.runAction(cc.sequence(action1, action2));
                }else {
                    self.player.node.runAction(cc.moveTo(0.2,cc.v2(-this.width/2+self.wallWidth, self.player.node.y)));
                }
                self.player.node.rotationY = 0;
            }

            //分数统计
            self.score+=1;
            cc.sys.localStorage.setItem("score",self.score);

            self.scoreLabel.string = self.score;

            self.generateDici();
        }, this.node);
        //添加地刺
        for(var i=0;i<8;i++)
        {
            this.generateDici();
        }

        this.schedule(function(){
            this.timeCount -= 1;
            this.timeLabel.string = "倒计时:"+this.timeCount;
            if(this.timeCount<=0){
                cc.audioEngine.pauseMusic();
                cc.director.loadScene('OverScene');
            }
        },1);
    },

    generateDici: function() {
        this.diciCount += 1;
        var newDici = cc.instantiate(this.dici);
        this.node.addChild(newDici);
        var randD= Math.random();
        if (randD > 0.5) {
            newDici.rotationY = 0;
        } else {
            newDici.rotationY = 180;
        }
        newDici.setPosition(this.getDiciPosition(randD));
    },

    getDiciPosition: function(randD) {
        var diciX = 0;
        var diciY = 0;
        if (randD > 0.5) {
            // 右边
            diciX = this.node.width/2 - this.wallWidth + 10;
        } else {
            // 左边
            diciX = -this.node.width/2 + this.wallWidth - 10;
        }

        if(this.diciCount<=8){
            diciY=(this.node.height/2)-(this.dc_duration*this.diciCount)-this.dc_duration*1;
        }else{
            diciY=(this.node.height/2)-(this.dc_duration*8)-this.dc_duration*1;
        }
        return cc.v2(diciX, diciY);
    },
});
