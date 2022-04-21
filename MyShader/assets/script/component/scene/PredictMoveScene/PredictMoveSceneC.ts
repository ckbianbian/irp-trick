// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MathUtils from "../../../lib/MathUtils";
import GraphicsUtil from "../../../utils/GraphicsUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.Node })
    moveObjNode: cc.Node = null;
    @property({ type: cc.Node })
    staticObjNode: cc.Node = null;

    @property({ type: cc.Graphics })
    paintBoard: cc.Graphics = null;

    pointArr = new Array();
    pointArrLength = 0;

    staticObj;
    moveObj;
    targetPos: cc.Vec2;
    interval = 0.017;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    async start() {
        this.initData();
        this.startShoot();
    }
    async waitMin(time = 1) {
        return new Promise((resolve) => {
            this.scheduleOnce(() => {
                resolve("hello");
            }, time);
        });
    }
    async startShoot() {
        let time = Math.random() * 3;
        await this.waitMin(time);
        let result = MathUtils.GetCollisionPointByTwoPointAndSpeed(this.staticObj.pos, this.staticObj.speed, this.moveObj.pos, this.moveObj.speedDirect);
        if (result) {
            this.targetPos = result;
            this.staticObj.node.opacity = 255;
            result.sub(this.staticObj.initPos, this.staticObj.speedDirect);
            this.staticObj.pos = this.staticObj.initPos.clone();
            this.staticObj.speedDirect.normalizeSelf().multiplyScalar(this.staticObj.speed);
            // this.schedule(this.pointMove, this.interval);
        }
    }
    initData(): void {
        let moveObj = new PawnObject();
        moveObj.pos = cc.v2(-300, 200);
        // moveObj.speed = cc.v2(-10, -10);
        moveObj.speedDirect = cc.v2(150, 0);
        moveObj.node = this.moveObjNode;
        moveObj.node.position = moveObj.pos;
        let staticObj = new PawnObject();
        staticObj.node = this.staticObjNode;
        staticObj.pos = cc.v2(-300, -200);
        staticObj.speed = 1200;
        staticObj.speedDirect = cc.v2(0, 0);
        let newObj = cc.instantiate(this.staticObjNode);
        staticObj.node.position = staticObj.pos;
        staticObj.initPos = staticObj.pos.clone();
        staticObj.node = newObj;
        newObj.parent = this.staticObjNode.parent;
        staticObj.node.opacity = 0;
        // this.pointArr.push(moveObj.pos.clone());
        // this.pointArr.push(staticObj.pos.clone());

        this.moveObj = moveObj;
        this.staticObj = staticObj;
    }
    paintHandler(): void {
        if (this.pointArrLength != this.pointArr.length) {
            this.updatePaintBoard();
        }
    }
    updatePaintBoard(): void {
        GraphicsUtil.getInstance().drawCircle(this.pointArr, this.paintBoard);
    }

    update(dt) {
        // this.paintHandler();
        this.moveObjMove(dt);
        this.staticPointMove(dt);
    }

    moveObjMove(dt) {
        let newVec2 = cc.v2(0, 0);
        this.moveObj.pos.add(this.moveObj.speedDirect.clone().multiplyScalar(dt), newVec2);
        this.moveObj.pos = newVec2;
        this.moveObj.node.position = this.moveObj.pos;
    }
    staticPointMove(dt) {
        if (this.targetPos) {
            let newVec = cc.v2(0, 0);

            this.staticObj.pos.add(this.staticObj.speedDirect.clone().multiplyScalar(dt), newVec);

            this.staticObj.pos = newVec;
            this.staticObj.node.position = this.staticObj.pos;

            if (this.staticObj.pos.fuzzyEquals(this.targetPos, 10)) {
                this.staticObj.node.opacity = 0;
                this.targetPos = null;
                this.moveObj.speedDirect.x *= -1;
                this.startShoot();
            }
        }
    }
}

class PawnObject {
    pos: cc.Vec2;
    initPos: cc.Vec2;
    speed: number;
    speedDirect: cc.Vec2;
    velocityFuncK: number;
    velocityFuncB: number;
    node: cc.Node;
}
