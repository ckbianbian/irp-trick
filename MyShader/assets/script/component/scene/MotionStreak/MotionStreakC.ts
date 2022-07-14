import { USceneComponent } from "../../../common/core/USceneComponent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/场景脚本/闪电拖尾")
export default class MotionSteakC extends USceneComponent {

    @property(cc.Node)
    motionStreak: cc.Node = null;
    @property(cc.Sprite)
    effectSp = null;

    _pointArr = new Float32Array(256);
    _infoArr = new Array();
    _len = 10;
    _lenThreshold = 10;
    _maxNum = 64;
    _maxLen = 2000; // maxLen / unitLen < 64
    _unitLen = 200;
    _hideTime = 200; // 用来 之后 控制闪电的粗细透明度 以及消失 时间戳 毫秒单位
    _openTrigger = false;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.rootNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Touch) => {
            let pos = event.getLocation();
            cc.log(pos.x, "--", pos.y);
            cc.log(cc.view.getVisibleSize().width);
            // this.addTouchPoint(cc.v2(pos.x / cc.view.getVisibleSize().width, 1 - pos.y / cc.view.getVisibleSize().height));
            this.addTouchPoint(pos);
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Touch) => {
            this._openTrigger = true;
            let pos = event.getLocation();
            let nPos = this.node.convertToNodeSpaceAR(pos);
            this.motionStreak.setPosition(nPos);
            // this.addTouchPoint(cc.v2(pos.x / cc.view.getVisibleSize().width, 1 - pos.y / cc.view.getVisibleSize().height));
            this.addTouchPoint(pos);
            // this.updatePointArr()
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Touch) => {
            // this._openTrigger = false;
            // this.resetArr()
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Touch) => {
            // this._openTrigger = false;
            // this.resetArr()
        });

        this.resetArr()
    }

    update(): void {
        if (this._openTrigger) {
            this.updatePointArr();
        }
    }

    public resetArr(): void {
        this._pointArr.fill(0);
        // this._pointArr[0] = 0.5;
        // this._pointArr[1] = 0.5;
        // this._pointArr[2] = 0.5;
        // this._pointArr[3] = 0.5;
        // this._pointArr[4] = 0.9;
        // this._pointArr[5] = 0.9;
        // this._pointArr[6] = 0.9;
        // this._pointArr[7] = 0.9;
        this._infoArr = new Array();
        this.updateMaterial();
    }

    public addTouchPoint(pos: cc.Vec2): void {
        let info = new cc.Vec4(pos.x, pos.y, new Date().getTime(), 0);
        this._infoArr.unshift(info);
    }

    public getThunderPointArr(): Array<cc.Vec4> {
        let result = new Array();
        if (this._infoArr.length < 2) return;
        if (this._infoArr[1].z + this._hideTime < new Date().getTime()) return;

        let len = this._unitLen;
        let num = Math.floor(this._maxLen / this._unitLen);
        result.push(this.normalizeCustom(this._infoArr[0]));
        let temp = this._infoArr[0];
        for (let i = 1; i < this._infoArr.length; i++) {
            let info = this._infoArr[i];
            if (info.z + this._hideTime < new Date().getTime() || num == 0) {
                this._infoArr.splice(i);
                cc.log(this._infoArr.length);
                break;
            }
            let dis = cc.Vec2.distance(cc.v2(temp.x, temp.y), cc.v2(info.x, info.y));
            if (len > dis) {
                temp = info;
                len -= dis;
                if (i == this._infoArr.length - 1 && num > 0) {
                    result.push(this.normalizeCustom(temp));
                }
            } else {
                let tempV = cc.v2(temp.x, temp.y);
                let infoV = cc.v2(info.x, info.y);
                let t = tempV.add(infoV.sub(tempV).normalizeSelf().multiplyScalar(len));
                temp = new cc.Vec4(t.x, t.y, (1 - len / dis) * temp.z + temp.z * len / dis, 0); // TODO: 时间戳有问题
                result.push(this.normalizeCustom(temp));

                len = this._unitLen;
                num--
            }
        }

        return result;
    }

    public normalizeCustom(vec): any {
        return new cc.Vec4(vec.x / cc.view.getVisibleSize().width, 1 - vec.y / cc.view.getVisibleSize().height, Math.min((new Date().getTime() - vec.z) / this._hideTime, 1), 0);
    }

    public updatePointArr(): void {
        this._pointArr.fill(0);
        let arr = this.getThunderPointArr();
        if (arr) {
            for (let i = 0; i < this._maxNum; i++) {
                let index = Math.min(i, arr.length - 1);
                let offset = i * 4;
                let info = arr[index];
                this._pointArr[offset] = info.x;
                this._pointArr[offset + 1] = info.y;
                this._pointArr[offset + 2] = info.z;
                this._pointArr[offset + 3] = info.w;
            }
            // cc.log(this._pointArr);
        }
        this.updateMaterial();
    }

    public updateMaterial(): void {
        this.effectSp.getMaterial(0).setProperty("light_prop", this._pointArr);
    }

    // update (dt) {}
}
