// 组件类没有必要继承 UObject
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/非挂载脚本/演员组件父类")
export abstract class UActorComponent extends cc.Component {

}