/**
 *  @desc 物理液体主脚本
 */

import BaseSceneC from "../../../common/BaseSceneC";
import PhysicsManager from "../../../manager/PhysicsManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MetaBallC extends BaseSceneC {

    @property({ type: cc.Node })
    particleBox: cc.Node = null;
    @property({ type: cc.Graphics })
    drawingBoard: cc.Graphics = null;

    private _world;
    private _particles;
    private _particleGroup;

    public get particleGroup() {
        return this._particleGroup;
    }
    public set particleGroup(value) {
        this._particleGroup = value;
    }
    public get particles() {
        return this._particles;
    }
    public set particles(value) {
        this._particles = value;
    }
    public get world() {
        return this._world;
    }
    public set world(value) {
        this._world = value;
    }

    onLoad(): void {
        PhysicsManager.getInstance().openPhysicsSystem();
        if (!CC_EDITOR) {
            this.initWorld();
        }
    }
    start(): void {
    }
    update(dt): void {
        this.renderParticleGroup();
    }
    initWorld(): void {
        let world = this._world = PhysicsManager.getInstance().physicsManager._world;// new b2.World(new b2.Vec2(0, -15.0));
        var psd = new b2.ParticleSystemDef();
        psd.radius = 0.35;
        // psd.dampingStrength = 1.5;
        psd.viscousStrength = 0;

        this._particles = world.CreateParticleSystem(psd);
    }
    createParticlesGroup() {
        let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
        var boxSize = this.particleBox.getContentSize();
        var boxPos = this.particleBox.getPosition();
        var size = cc.winSize;
        var box = new b2.PolygonShape();

        // https://google.github.io/liquidfun/API-Ref/html/classb2_polygon_shape.html#a890690250115483da6c7d69829be087e
        // Build vertices to represent an oriented box.
        // box的大小影响粒子的数量
        box.SetAsBox(
            boxSize.width / 1 / PTM_RATIO,
            boxSize.height / 1 / PTM_RATIO)

        var particleGroupDef = new b2.ParticleGroupDef();
        particleGroupDef.shape = box;
        particleGroupDef.flags = b2.waterParticle;
        particleGroupDef.position.Set(
            (boxPos.x + size.width / 2) / PTM_RATIO,
            (boxPos.y + size.height / 2) / PTM_RATIO);

        this._particleGroup = this._particles.CreateParticleGroup(particleGroupDef);
        // this.metaBallsRenderer.SetParticles(this._particles);

        let vertsCount = this._particles.GetParticleCount();
        console.log(vertsCount);
        window._particles = this._particles
    }
    generateWater() {
        this.resetParticleGroup();

        // re-create particles in next tick
        // otherwise old particle system is not correctly released
        // this is a non-repeat schedule
        let that = this;
        cc.director.getScheduler().schedule(() => {
            that.createParticlesGroup();
        }, this.node, 0, 0, 0, false);
    }
    resetParticleGroup() {
        if (this._particleGroup != null) {
            this._particleGroup.DestroyParticles(false);
            this._particles.DestroyParticleGroup(this._particleGroup);

            this._particleGroup = null;
        }
    }
    renderParticleGroup() {
        if (this._particles != null) {
            let posList = this._particles.m_positionBuffer.data;
            this.drawingBoard.clear();
            for (let index = 0; index < posList.length; index++) {
                let element = posList[index];
                if (element) {
                    this.drawCircle(this.convertPhysicsPosToWorldPos(element));
                }
            }
        }
    }
    convertPhysicsPosToWorldPos(pos): cc.Vec2 {
        let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
        return cc.v2(pos.x * PTM_RATIO, pos.y * PTM_RATIO);
    }
    drawCircle(pos): void {
        this.drawingBoard.lineWidth = 1;
        this.drawingBoard.strokeColor = cc.Color.YELLOW;
        this.drawingBoard.fillColor = cc.Color.YELLOW;
        this.drawingBoard.circle(pos.x, pos.y, 20);
        this.drawingBoard.fill();
        this.drawingBoard.stroke();
    }

}