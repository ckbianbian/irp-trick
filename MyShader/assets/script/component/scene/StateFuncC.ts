import SceneC from "../SceneC";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StateFuncC extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    fsm;
    @property(cc.EditBox)
    editBox = null;
    @property(cc.Label)
    info = null;
    private _infoText: string = '1';
    public get infoText(): string {
        return this._infoText;
    }
    public set infoText(value: string) {
        this.info.string = value;
        this._infoText = value;
    }


    /** ------------------------------------基础方法-------------------------------------- */


    /** onload */
    onLoad() {
        // var output = document.getElementById('output'),
        //     demo = document.getElementById('demo'),
        //     panic = document.getElementById('panic'),
        //     warn = document.getElementById('warn'),
        //     calm = document.getElementById('calm'),
        //     clear = document.getElementById('clear'),
        //     count = 0;

        // var log = function (msg, separate) {
        //     count = count + (separate ? 1 : 0);
        //     output.value = count + ": " + msg + "\n" + (separate ? "\n" : "") + output.value;
        //     refreshUI();
        // };

        // var refreshUI = function () {
        //     setTimeout(function () {
        //         demo.className = fsm.state;
        //         panic.disabled = fsm.cannot('panic', true);
        //         warn.disabled = fsm.cannot('warn', true);
        //         calm.disabled = fsm.cannot('calm', true);
        //         clear.disabled = fsm.cannot('clear', true);
        //     }, 0); // defer until end of current tick to allow fsm to complete transaction
        // };

        this.fsm = new StateMachine({
            init: 'none',
            transitions: [
                { name: 'normal', from: 'normal', to: 'invalid' },
            ],

            methods: {

                onBeforeTransition: function (lifecycle) {
                    cc.log("BEFORE: " + lifecycle.transition, true);
                },

                onLeaveState: function (lifecycle) {
                    cc.log("LEAVE: " + lifecycle.from);
                },

                onEnterState: function (lifecycle) {
                    cc.log("ENTER: " + lifecycle.to);
                },

                onAfterTransition: function (lifecycle) {
                    cc.log("AFTER: " + lifecycle.transition);
                },

                onTransition: function (lifecycle) {
                    cc.log("DURING: " + lifecycle.transition + " (from " + lifecycle.from + " to " + lifecycle.to + ")");
                }
                // onLeaveGreen: function (lifecycle) {

                // },
                // onLeaveRed: function (lifecycle) {
                //     return new Promise(function (resolve, reject) {
                //         var msg = lifecycle.transition + ' to ' + lifecycle.to;
                //         cc.log("PENDING " + msg + " in ...3");
                //         setTimeout(function () {
                //             cc.log("PENDING " + msg + " in ...2");
                //             setTimeout(function () {
                //                 cc.log("PENDING " + msg + " in ...1");
                //                 setTimeout(function () {
                //                     resolve();
                //                 }, 1000);
                //             }, 1000);
                //         }, 1000);
                //     });
                // },
                // onRed: function (lifecycle) {
                //     cc.log('here id red ', lifecycle);
                // }

            }
        });

    }
    /** start */
    start() {
        this.scheduleOnce(() => {
            this.infoText = 'hello world.';
        }, 3);
    }
    /** 信息编辑框改变数据 */
    changeInfoEditBox() {
        this.infoText = this.editBox.string;
    }
    // update (dt) {}
}
