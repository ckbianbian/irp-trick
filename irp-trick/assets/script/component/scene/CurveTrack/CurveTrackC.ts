import { USceneComponent } from "../../../common/core/USceneComponent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/场景脚本/弯曲赛道")
export default class CurveTrackC extends USceneComponent {

    /* ---------------------------------- 全局属性 ---------------------------------- */


    /* ---------------------------------- 成员属性 ---------------------------------- */

    @property({ type: cc.Float, name: "近平面距离" })
    nearPlant = 1;
    @property({ type: cc.Float, name: "远平面距离" })
    farPlant = 10000;
    @property({ type: cc.Float, name: "X-FOV" })
    xFov = 60; // field-of-view 
    @property({ type: cc.Float, name: "Y-FOV" })
    yFov = 60; // field-of-view 
    @property({ type: cc.Node, name: "物体" })
    pawnNode: cc.Node = null;

    yResolution = cc.view.getViewportRect().size.height;
    xResolution = cc.view.getViewportRect().size.width;

    pawn: Pseudo3D = null;

    /* ---------------------------------- 生命周期方法 ---------------------------------- */

    protected onLoad(): void {
        // cc.log(cc.view.getViewportRect().size);
        this.pawn = new Pseudo3D(this.pawnNode);
    }
    protected start(): void {
        this.scheduleOnce(() => {
            this.pawn.z = 10;
            let tPos = this.calculateScreenPos(this.pawn);
            cc.log(tPos);
            let actM = cc.moveTo(0.6, tPos);
            this.pawn.node.runAction(actM);
        }, 3);
    }
    protected update(dt: number): void {
        this.pawnNode.setScale(this.calculateScreenScaling(this.pawn));
    }
    /* ---------------------------------- 成员方法 ---------------------------------- */

    public openTouchEvent(): void {
        this.rootNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Touch) => {
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Touch) => {
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Touch) => {
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Touch) => {
        });
    }
    // y_screen = (y_world*scaling/z_world) + (y_resolution/2)
    // x_screen = (x_world*scaling)/z_world + (x_resolution/2)
    // scaling = (x_resolution/2) / tan(fov_angle/2)
    // Z = Y_world / (Y_screen - (height_screen / 2))
    calculateScreenPos(obj: Pseudo3D): cc.Vec2 {
        let result = cc.v2(
            obj.pos.x * obj.z / this.nearPlant,
            obj.pos.y * obj.z / this.nearPlant
        );

        return result;
    }
    calculateScreenScaling(obj: Pseudo3D): cc.Vec2 {
        let result = cc.v2(
            this.nearPlant / obj.z,
            this.nearPlant / obj.z
        );
        return result;
    }
    calculatePawnPos(): void {

    }
}

class Pseudo3D {
    pos: cc.Vec3 = cc.v3(0, 0, 0);
    node: cc.Node = null;
    scale: cc.Vec2 = cc.v2(1, 1);
    z: number = 1;

    constructor(node: cc.Node) {
        this.pos = cc.v3(node.getPosition());
        this.node = node;
        node.getScale(this.scale);
    }
}