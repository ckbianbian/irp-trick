import SceneC from "../SceneC";

/**
 *  @description 切换场景加载场景
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class MainC extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    private _age: string;
    private _sex: string;

    public get sex(): string {
        return this._sex;
    }
    public set sex(value: string) {
        this._sex = value;
    }

    public set age(v: string) {
        this._age = v;
        cc.log('use func');
    }
    public get age() {
        return this._age;
    }
    @property({
        displayName: '玩家节点',
        type: cc.Node
    })
    player = null;
    @property({
        displayName: '障碍物',
        type: cc.Node
    })
    wall = null;
    @property({
        displayName: '绘图节点',
        type: cc.Node
    })
    graphics = null;
    @property({
        displayName: '遮罩节点',
        type: cc.Mask
    })
    mask = null;
    /** 辐射线数量 */
    _rayNum = 720;
    /** 辐射线半径 */
    _rayRadiu = 1000;
    /** 视野顶点数组 */
    _lightVertsArray = new Array();



    /** ------------------------------------基础方法-------------------------------------- */


    update(dt: number): void {
        this.renderSightArea();
    }
    onLoad(): void {
        // this.testRay();
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        // // var p1 = cc.v2(0, 100);//起点
        // let p1 = this.player.position;
        // var p2 = cc.v2(0, 1000);//终点
        // // this.drawRay(p1, p2);
        // p1 = this.node.convertToWorldSpaceAR(p1);
        // p2 = this.node.convertToWorldSpaceAR(p2);
        // // this.drawRay(p1, p2);
        // cc.log(p1, p2);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            let pos = event.getLocation();
            this.node.convertToNodeSpaceAR(pos, pos);
            this.player.setPosition(pos);
            // cc.log(pos);
        }, this);
        this.scheduleOnce(() => {
            // let physicsManager = cc.director.getPhysicsManager();
            // let result = physicsManager.rayCast(p1, p2, cc.RayCastType.Closest);
            // this.drawRayByNum(p1);
            // cc.log(result);
            // this.renderSightArea();
            this.player.runAction(cc.sequence(
                cc.moveBy(0.6, cc.v2(0, -500)),
                cc.moveBy(0.6, cc.v2(-500, 0)),
                cc.moveBy(0.6, cc.v2(0, 350)),
                cc.moveBy(0.6, cc.v2(500, 0)),
                cc.moveBy(0.9, cc.v2(0, 350)),
            ));
        }, 3);
    }
    /** 绘制视野区域 */
    renderSightArea(): void {
        let p1 = this.player.position;
        p1 = this.node.convertToWorldSpaceAR(p1);
        this.drawRayByNum(p1);
        this.renderMask();
    }
    /** 通过射线数量绘制辐射线 */
    drawRayByNum(p1): void {
        // let self = this;
        // self.ctx = this.graphics.getComponent(cc.Graphics);
        // self.ctx.clear();
        // let p2 = cc.v2(p1.x, p1.y + this._rayRadiu);
        let unitRd = 2 * Math.PI / this._rayNum;
        this._lightVertsArray = new Array();
        for (let i = 0; i < this._rayNum; i++) {
            let p3 = cc.v2(Math.cos(i * unitRd) * this._rayRadiu + p1.x, Math.sin(i * unitRd) * this._rayRadiu + p1.y);
            let physicsManager = cc.director.getPhysicsManager();
            let result = physicsManager.rayCast(p1, p3, cc.RayCastType.Closest);
            if (result.length > 0) {
                p3 = result[0].point;
            }
            this._lightVertsArray.push(p3);
            // self.ctx.lineWidth = 3;
            // self.ctx.strokeColor = cc.Color.BLACK;
            // self.ctx.moveTo(p1.x, p1.y);
            // self.ctx.lineTo(p3.x, p3.y);
            // self.ctx.stroke();
        }
    }
    /** 绘制遮罩 */
    renderMask(): void {
        let potArr = this._lightVertsArray;
        // let potArr = GameDatas.vertexs;
        this.mask._updateGraphics = () => {
            var graphics: cc.Graphics = this.mask._graphics;
            graphics.clear(false);
            graphics.lineWidth = 10;
            graphics.fillColor.fromHEX('#ff0000');
            graphics.moveTo(potArr[0].x, potArr[0].y);
            for (let i = 1; i < potArr.length; i++) {
                const p = potArr[i];
                graphics.lineTo(p.x, p.y);
            }
            graphics.close();
            graphics.stroke();
            graphics.fill();
        }
        this.mask._updateGraphics();
    }



    /** ------------------------------------子类实现-------------------------------------- */





}