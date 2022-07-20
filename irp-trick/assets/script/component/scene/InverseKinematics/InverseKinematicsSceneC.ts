import GraphicsUtil from "../../../utils/GraphicsUtil";

/**
 *  
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class InverseKinematicsSceneC extends cc.Component {

    @property({ type: cc.Graphics })
    drawBoard: cc.Graphics = null;

    _recurNum = 5;
    _lineArr: IKModel[] = [];
    _targetPos: cc.Vec2 = null;

    onLoad(): void { }

    update(): void { }

    async start() {
        this.setTargetPos();
        this.initLineArr();
        this.drawLine();
        await this.inverseKinematics();
        cc.log("test");
    }
    setTargetPos(): void {
        this._targetPos = cc.v2(300, 200);
    }
    drawLine(): void {
        this.drawBoard.clear();
        let pointArr = this.getLinePosArr();
        this.updateDrawBoard(pointArr);
    }
    async inverseKinematics(): Promise<void> {
        for (let count = 0; count < this._recurNum; count++) {
            for (let i = 1; i < this._lineArr.length; i++) {
                let firstModel = this._lineArr[0];
                let curModel = this._lineArr[i];
                let toStartVec = firstModel.pos.sub(curModel.pos);
                let toTargetVec = this._targetPos.sub(curModel.pos);
                let radian = toStartVec.signAngle(toTargetVec);
                for (let j = i - 1; j >= 0; j--) {
                    let tempVec = cc.v2(0, 0);
                    let preModel = this._lineArr[j];
                    let toPreVec = preModel.pos.sub(curModel.pos);
                    toPreVec.rotate(radian, tempVec);
                    preModel.pos = tempVec.addSelf(curModel.pos).clone();
                }
                await this.waitMin();
                cc.log(radian * 180 / Math.PI);
                this.drawLine();
            }
        }
    }
    async waitMin(time = 1) {
        return new Promise((resolve) => {
            this.scheduleOnce(() => {
                resolve("hello");
            }, time);
        });
    }
    initLineArr(): void {
        let arr = [cc.v2(0, 0), cc.v2(0, 50), cc.v2(50, 100), cc.v2(100, 200)];
        for (let pos of arr) {
            let point = new IKModel();
            point.pos = pos.clone();
            this._lineArr.push(point);
        }
    }
    getLinePosArr(): cc.Vec2[] {
        let result = [];
        for (let elm of this._lineArr) {
            result.push(elm.pos.clone());
        }
        return result;
    }
    updateDrawBoard(arr): void {
        GraphicsUtil.getInstance().drawLine(arr, this.drawBoard);
        GraphicsUtil.getInstance().drawCircle([this._targetPos], this.drawBoard, 10, cc.Color.WHITE);
    }
}

class IKModel {
    pos: cc.Vec2;
    rotateLimit: { min: 0, max: 360 };
}