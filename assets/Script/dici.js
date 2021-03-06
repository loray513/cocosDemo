// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
cc.Class({
    extends: cc.Component,

    properties: {
        dieAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (touch, event) => {
                self.node.runAction(cc.moveBy(0.2,cc.v2(0,120)));
                return true;
            },
            onTouchMoved: function (touches, event) {

            },
            onTouchEnded: function (touches, event) {

            },
            onTouchCancelled: function (touches, event) {
            }
        }, this.node);
    },

    update (dt) {
        var player = cc.find("Canvas/background").getComponent("main").player;
        if(player.node.getBoundingBoxToWorld().intersects(this.node.getBoundingBoxToWorld())){
            cc.audioEngine.playEffect(this.dieAudio,false);
            cc.audioEngine.pauseMusic();
            cc.director.loadScene('OverScene');
           //cc.log('碰撞');
        }
    },
});
