/**
 *  @desc 自定义渲染器
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class MeshRenderer extends cc.Component {

    @property(cc.Sprite)
    sp = null;

    onLoad(): void {

    }

    start() {
        this.updateSp();
    }

    updateSp(): void {
        this.sp.spriteFrame.vertices = {
            x: [0, 100, 100],
            y: [0, 0, 100],
            nu: [0, 1, 1],
            nv: [0, 0, 1],
            triangles: [0, 1, 2],
        }
        // 标记顶点数据修改过了
        this.sp.setVertsDirty();
    }
}