import { USceneComponent } from "../../../common/core/USceneComponent";
import MathUtils from "../../../lib/MathUtils";
import CoordinateTranslationUtils from "../../../utils/CoordinateTranslationUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu("自定义组件/场景脚本/水流场景")
export class UWaterFlowScene extends USceneComponent {

    @property({ displayName: "水流节点预制体", type: cc.Prefab })
    public nodePrefab: cc.Prefab = null;

    private bIsTouch = false;
    private touchPos = null;

    private waterFlowCtrl: WaterFlowCtrl = null;

    onLoad(): void {
        this.init();
    }
    init(): void {
        this.waterFlowCtrl = new WaterFlowCtrl();
        this.initTouchManager();
    }
    update(dt): void {
        if (this.bIsTouch) {
            this.waterFlowCtrl.updateWaterFlow(this.touchPos, dt);
        }
    }
    initTouchManager(): void {
        this.rootNode.on(cc.Node.EventType.TOUCH_START, (inTouch: cc.Event.EventTouch) => {
            this.waterFlowCtrl.initWaterFlow(inTouch, this.nodePrefab, this.rootNode,
                [
                    cc.v2(1, 0),
                    cc.v2(-1, 0),
                    cc.v2(0, 1),
                    // cc.v2(0.3, 1),
                    // cc.v2(-0.3, 1),
                    // cc.v2(0.8, 1),
                    // cc.v2(-0.8, 1),
                    // cc.v2(1.2, 1),
                    // cc.v2(-1.2, 1),
                    // cc.v2(1, 0.3),
                    // cc.v2(-1, 0.3),
                    cc.v2(0, -1),
                    cc.v2(1, -1),
                    cc.v2(-1, -1),
                    cc.v2(-1, 1),
                    cc.v2(1, 1)
                ]);
            this.touchPos = inTouch.getLocation();
            this.bIsTouch = true;
        }, this)
        this.rootNode.on(cc.Node.EventType.TOUCH_MOVE, (inTouch: cc.Event.EventTouch) => {
            this.touchPos = inTouch.getLocation();

        }, this)
        this.rootNode.on(cc.Node.EventType.TOUCH_END, (inTouch: cc.Event.EventTouch) => {
            this.bIsTouch = false;
            this.touchPos = null;
            this.waterFlowCtrl.clearAllWaterFlow();
        }, this)
        this.rootNode.on(cc.Node.EventType.TOUCH_CANCEL, (inTouch: cc.Event.EventTouch) => {
            this.bIsTouch = false;
            this.touchPos = null;
            this.waterFlowCtrl.clearAllWaterFlow();
        }, this)
    }

}

class WaterFlowCtrl {

    public flowDirect: cc.Vec2 = cc.Vec2.RIGHT;
    public flowLength = 500;
    public flowSpeed = 50;
    public flowArr: Array<WaterFlow> = new Array();
    public emitPos: cc.Vec2 = cc.Vec2.ZERO;

    setFlowDirect(): void {

    }
    update(dt: number): void { }
    initWaterFlowBak(inTouch: cc.Event.EventTouch, inPrefab: cc.Prefab, inParent: cc.Node, inDirect?: cc.Vec2): void {
        this.flowDirect = inDirect || this.flowDirect
        let num = Math.ceil(this.flowLength / this.flowSpeed) + 1;
        let initPos = inTouch.getLocation();
        let targetPos = initPos.add(this.flowDirect.normalize().mul(this.flowLength));
        this.emitPos = initPos;
        for (let index = 0; index < num; index++) {
            let obj = new WaterFlow();
            let node = cc.instantiate(inPrefab);
            let genPos = initPos.add(this.flowDirect.normalize().mul(index * this.flowSpeed));
            obj.node = node;
            obj.targetPos = targetPos;
            obj.node.setParent(inParent);
            index == num - 1 ? obj.node.setPosition(inParent.convertToNodeSpaceAR(targetPos)) : obj.node.setPosition(inParent.convertToNodeSpaceAR(genPos));

            this.flowArr.unshift(obj);
        }
    }
    initWaterFlow(inTouch: cc.Event.EventTouch, inPrefab: cc.Prefab, inParent: cc.Node, inDirectArr?: cc.Vec2[]): void {
        for (let inDirect of inDirectArr) {
            let obj = new WaterFlow();
            obj.initWaterFlow(inTouch, inPrefab, inParent, inDirect);
            this.flowArr.push(obj);
        }
    }
    updateWaterFlow(iTouchPos: cc.Vec2, iDt: number): void {
        for (const waterFlow of this.flowArr) {
            waterFlow.updateWaterFlow(iTouchPos, iDt);
        }
    }
    updateWaterFlowBak(touchPos: cc.Vec2, dt): void {
        let initPos = touchPos;
        let targetPos = initPos.add(this.flowDirect.normalize().mul(this.flowLength));
        let len = this.flowArr.length;
        let offsetVec: cc.Vec2 = touchPos.sub(this.emitPos);
        this.emitPos = touchPos.clone();
        let dtOff = this.flowDirect.dot(offsetVec);
        offsetVec = this.flowDirect.mul(dtOff);

        cc.log(dtOff);

        // for (let index = 0; index < len; index++) {
        //     let obj = this.flowArr[index];
        //     obj.node.setPosition(obj.node.position.add(cc.v3(offsetVec)));
        //     obj.targetPos.addSelf(offsetVec);
        // }

        for (let index = 0; index < len; index++) {
            let obj = this.flowArr[index];
            let disVec = obj.targetPos.sub(CoordinateTranslationUtils.convertToCoordPos(obj.node));
            if (disVec.len() >= this.flowSpeed) {
                obj.node.setPosition(obj.node.position.add(cc.v3(disVec.normalize().mul(this.flowSpeed))));
            } else {
                obj.node.setPosition(obj.node.position.add(cc.v3(disVec)));
            }
        }

        for (let index = 0; index < len; index++) {
            let obj = this.flowArr.shift();
            if (CoordinateTranslationUtils.convertToCoordPos(obj.node).fuzzyEquals(obj.targetPos, 1)) {
                obj.node.setPosition(obj.node.parent.convertToNodeSpaceAR(initPos));
                obj.targetPos = targetPos;
                this.flowArr.push(obj);
            } else {
                this.flowArr.unshift(obj);
            }
        }
    }
    updateFlowPos(): void {

    }
    clearAllWaterFlow(): void {
        while (this.flowArr.length > 0) {
            let obj = this.flowArr.pop();
            // obj.destroySelf();
            obj.clearAllWaterFlow();
        }
    }

}

class WaterFlow {

    public moveDis = 0;
    public node: cc.Node;
    public nodeArr: Array<any> = new Array();
    public nodeSpace = 50;
    public flowLength = 200;
    public emitPos: cc.Vec2 = cc.Vec2.ZERO;
    public targetPos: cc.Vec2;
    public limitRotateAngle = 10; // 节点旋转角度
    public flowDirect: cc.Vec2 = cc.Vec2.RIGHT; // 水流方向

    // public moveStrategy; // 不同的移动策略可以实现不同的水流

    resetAttr(): void {
        this.moveDis = 0;
        this.targetPos = null;
        this.node = null;
    }
    initWaterFlow(inTouch: cc.Event.EventTouch, inPrefab: cc.Prefab, inParent: cc.Node, inDirect: cc.Vec2 = cc.Vec2.RIGHT): void {
        this.flowDirect = inDirect || this.flowDirect
        let num = Math.ceil(this.flowLength / this.nodeSpace) + 1;
        let initPos = inTouch.getLocation();
        let targetPos = initPos.add(this.flowDirect.normalize().mul(this.flowLength));
        this.emitPos = initPos.clone();
        for (let index = 0; index < num; index++) {
            let node = cc.instantiate(inPrefab);
            let genPos = initPos.add(this.flowDirect.normalize().mul(index * this.nodeSpace));
            let obj = { node: null, i_attenuation: 0 };
            node.setParent(inParent);
            obj.node = node;
            obj.i_attenuation = MathUtils.FormatNumber(MathUtils.DisAttenuation((num - index) * this.nodeSpace, MathUtils.attenuation_constant.zero));
            cc.log("MathUtils.DisAttenuation(index * this.nodeSpace)", obj.i_attenuation);

            index == num - 1 ? node.setPosition(inParent.convertToNodeSpaceAR(targetPos)) : node.setPosition(inParent.convertToNodeSpaceAR(genPos));

            this.nodeArr.unshift(obj);
        }
    }
    clearAllWaterFlow(): void {
        while (this.nodeArr.length > 0) {
            this.nodeArr.pop().node.destroy();
        }
    }
    destroySelf(): void {
        this.node.destroy();
        this.resetAttr();
    }
    setNodeWorldPos(node, pos): cc.Vec2 {
        return node.setPosition(node.parent.convertToNodeSpaceAR(pos));
    }
    getNodeWorldPos(node): cc.Vec2 {
        return CoordinateTranslationUtils.convertToCoordPos(node);
    }
    updateWaterFlow(iTouchPos: cc.Vec2, iDt: number): void {
        let initPos = iTouchPos.clone();
        let moveVec: cc.Vec2 = iTouchPos.sub(this.emitPos);
        this.emitPos = iTouchPos.clone();
        let cross = this.flowDirect.cross(moveVec.clone());
        for (let index = 0; index < this.nodeArr.length; index++) {
            let obj = this.nodeArr[index];
            if (index == 0) {
                this.setNodeWorldPos(obj.node, initPos);
                continue;
            }
            let genPos = initPos.add(this.flowDirect.normalize().mul(index * this.nodeSpace));
            if (index > 1) {
                let direct = this.nodeArr[index - 1].node.position.sub(this.nodeArr[index - 2].node.position);
                genPos = this.nodeArr[index - 1].node.position.add(direct.normalize().mul(this.nodeSpace));
                obj.node.setPosition(genPos);
            } else {
                this.setNodeWorldPos(obj.node, genPos);
            }
            if (obj.i_attenuation > 0) {
                let preObj = this.nodeArr[index - 1];
                let preToCurVec = obj.node.position.sub(preObj.node.position);
                let verticalVec = cc.v2(preToCurVec.normalize().y, preToCurVec.normalize().x);
                cross >= 0 ? verticalVec.x *= -1 : verticalVec.y *= -1;
                let dotVertical = verticalVec.mul(-1 * verticalVec.normalize().dot(moveVec) * obj.i_attenuation).add(preToCurVec);
                obj.node.setPosition(preObj.node.position.add(dotVertical.normalize().mul(this.nodeSpace)));
            }

        }
    }
    updateFlowPos(): void {

    }

}