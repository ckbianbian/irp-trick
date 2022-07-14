import { USceneComponent } from "../../../common/core/USceneComponent";

const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu("自定义组件/场景脚本/物理绳子场景")
// 物理绳子
export class UPhysicalRopeScene extends USceneComponent {

    @property({ type: cc.Prefab, displayName: "绳子质点预制体" })
    protected ropeParticlePrefab: cc.Prefab = null;

}

