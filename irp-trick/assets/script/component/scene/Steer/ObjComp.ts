import SteerComp from "./SteerComp";
import SteerUtil from "./SteerUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ObjComp extends cc.Component {

    static MODEL_ENUM = cc.Enum({
        SEEK: 1 << 0,
        EVADE: 1 << 1,
        ARRIVE: 1 << 2,
        WANDER: 1 << 3
    });

    private _coreComp: SteerComp; // 核心脚本
    private _steeredForce: cc.Vec2; // 转向力
    private _velocity: cc.Vec2; // 速度
    private _position: cc.Vec2; // 位置
    private _angle: number; // 角度 
    private _steerUtil: SteerUtil; // 工具
    private _model: number = ObjComp.MODEL_ENUM.WANDER; // 模式
    private _speed: number = 1; // 速度
    private _autoMoveTarget: cc.Vec2; // 自动移动时候的目标点

    public get autoMoveTarget(): cc.Vec2 {
        return this._autoMoveTarget;
    }
    public set autoMoveTarget(value: cc.Vec2) {
        this._autoMoveTarget = value;
    }
    public get speed(): number {
        return this._speed;
    }
    public set speed(value: number) {
        this._speed = value;
    }
    public get model(): number {
        return this._model;
    }
    public set model(value: number) {
        this._model = value;
    }
    public get steerUtil(): SteerUtil {
        return this._steerUtil;
    }
    public set steerUtil(value: SteerUtil) {
        this._steerUtil = value;
    }
    public get coreComp() {
        return this._coreComp;
    }
    public set coreComp(value) {
        this._coreComp = value;
    }
    public get angle(): number {
        let radian = Math.atan2(this.velocity.y, this.velocity.x);
        let angle = 180 / Math.PI * radian - 90;
        // let angle = 180 / Math.PI * this.velocity.signAngle(cc.v2(1, 0));
        // let angle = 180 / Math.PI * this.velocity.angle(cc.v2(1, 0));
        // cc.log(angle);
        return angle;
    }
    public set angle(value: number) {
        this._angle = value;
    }
    public get steeredForce() {
        return this._steeredForce;
    }
    public set steeredForce(value) {
        this._steeredForce = value;
    }
    public get velocity() {
        // let out = cc.v2(0, 0);
        // cc.Vec2.max(out, cc.Vec2.min(out, this._velocity, cc.v2(1, 1)), cc.v2(-1, -1))
        // return out;
        return this._velocity;
    }
    public set velocity(value) {
        this._velocity = value;
    }
    public get position() {
        return this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
    }
    public set position(value) {
        this._position = value;
    }

    onLoad(): void {
        this.resetProperty();
        this.steerUtil = new SteerUtil();
        cc.log(cc.sys.getSafeAreaRect().width, cc.sys.getSafeAreaRect().height);
    }
    update(dt): void {
        this.updateGame(dt);
    }

    updateGame(dt): void {
        if (this.coreComp && this.coreComp.playerPos) {
            this.updateSteerForce(dt);
            this.updatePosition(dt);
            this.updateAngle(dt);
        }
    }
    updateAngle(dt): void {
        this.node.angle = this.angle;
    }
    updateSteerForce(dt): void {
        if (this.model == ObjComp.MODEL_ENUM.EVADE) { // 躲避

        }
        if (this.model == ObjComp.MODEL_ENUM.WANDER) { // 徘徊
            let steerForce = this.steerUtil.wander(this.autoMoveTarget, this.position, this.velocity, this.speed);
            cc.log(this.velocity.x, "<=>", this.velocity.y);
            this.steeredForce = steerForce;
        }
        if (this.model == ObjComp.MODEL_ENUM.ARRIVE) { // 降落
            let steerForce = this.steerUtil.arrive(this.coreComp.playerPos, this.position, this.velocity, this.speed);
            cc.log(this.velocity.x, "<=>", this.velocity.y);
            this.steeredForce = steerForce;
        }
        if (this.model == ObjComp.MODEL_ENUM.SEEK) { // 寻找
            let steerForce = this.steerUtil.seek(this.coreComp.playerPos, this.position, this.velocity, this.speed);
            this.steeredForce = steerForce;
        }
    }
    updatePosition(dt): void {
        this.steeredForce.multiplyScalar(dt)
        this.velocity = this.velocity.add(this.steeredForce)
        this.steeredForce.set(cc.v2(0, 0))
        let t_pos = this.node.position.add(this.velocity);
        t_pos.x = Math.limit(t_pos.x, -cc.sys.getSafeAreaRect().width / 2, cc.sys.getSafeAreaRect().width / 2);
        t_pos.y = Math.limit(t_pos.y, -cc.sys.getSafeAreaRect().height / 2, cc.sys.getSafeAreaRect().height / 2);
        // cc.log(t_pos.x, "<=>", t_pos.y);
        this.node.setPosition(t_pos)
    }
    resetProperty(): void {
        this.velocity = new cc.Vec2(0, 0);
        this.speed = 10;
        this.steeredForce = new cc.Vec2(0, 0);
        this.autoMoveTarget = new cc.Vec2(0, 0);
    }

    limit(): void { }
}
Math.limit = function (x, min, max) {
    return Math.min(Math.max(min, x), max);
}