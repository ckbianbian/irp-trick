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
    @property({ type: cc.RichText, displayName: '富文本' })
    riceInfo: cc.RichText = null;

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
        let str = this.changeRiceInfo<string>('wck');
    }
    changeRiceInfoBak<T>(arg: T): T {
        let str = '<color=yellow>wck</c><color=red>我爱你</c>巴拉巴拉巴拉';
        let charArr = str.replace(/<.+?\/?>/g, '').split('');
        let tempStrArr = [str];
        for (let i = charArr.length; i > 1; i--) {
            let curStr = tempStrArr[charArr.length - i];
            let lastIdx = curStr.lastIndexOf(charArr[i - 1]);
            let prevStr = curStr.slice(0, lastIdx);
            let nextStr = curStr.slice(lastIdx + 1, curStr.length);

            tempStrArr.push(prevStr + nextStr);
        }
        console.log(tempStrArr)
        cc.log(charArr);
        return arg;
    }
    changeRiceInfo<T>(arg: T): T {
        let str = '<color=yellow>wck</c><color=red>我爱你</c>巴拉巴拉巴拉';
        let temp = '';
        let jump = true;
        let firstArr = [];
        let charArr = str.replace(/<.+?\/?>/g, '').split('');
        for (let char of str) {
            if (char == '<') { jump = false; temp = ''; }
            if (jump) { firstArr.push(char); }
            if (!jump) { temp += char; }
            if (char == '>') { firstArr.push(temp); jump = true; } // cc.log(temp); }
        }
        let printArr = [];
        printArr.push(firstArr.join(''));
        for (let i = charArr.length - 1; i > 0; i--) {
            let testChar = charArr[i];
            for (let j = firstArr.length; j > 0; j--) {
                let char = firstArr[j];
                if (char === testChar) {
                    firstArr.splice(j, 1);
                    printArr.push(firstArr.join(''));
                    break;
                }
            }
        }
        let printRvArr = printArr.reverse();
        this.schedule(() => {
            this.riceInfo.string = '';
            this.riceInfo.string += printRvArr.shift();
        }, 0.2, printRvArr.length - 1);
        return arg;
    }
    /** 信息编辑框改变数据 */
    changeInfoEditBox() {
        this.infoText = this.editBox.string;
    }
    // update (dt) {}
}
