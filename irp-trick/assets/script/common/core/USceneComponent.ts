import { UActorComponent } from "./UActorComponent";
/** 场景类组件父类 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/非挂载脚本/场景类组件父类")
export class USceneComponent extends UActorComponent {

    @property({ displayName: "根节点", type: cc.Node })
    protected rootNode: cc.Node = null;

}