/**
 *  @description 绘画辅助工具
 */

import Singleton from "../common/Singleton";
export default class GraphicsUtil extends Singleton {

    /** 画圆点 */
    drawCircle(posArr: cc.Vec2[], draw_board: cc.Graphics, radius = 10, color = cc.Color.YELLOW): void {
        for (const pos of posArr) {
            let p = pos.clone();
            draw_board.lineWidth = 1;
            draw_board.fillColor = color;
            draw_board.circle(p.x, p.y, radius);
            draw_board.fill();
            draw_board.stroke();
        }
    }
    /** 画矩形 */
    drawRect(posArr: cc.Vec2[], draw_board: cc.Graphics, wh = cc.v2(10, 10), color = cc.Color.YELLOW): void {
        for (const pos of posArr) {
            let p = pos.clone();
            draw_board.lineWidth = 1;
            draw_board.fillColor = color;
            draw_board.rect(p.x, p.y, wh.x, wh.y);
            draw_board.fill();
            draw_board.stroke();
        }
    }

    /** 画线 */
    drawLine(posArr: cc.Vec2[], draw_board: cc.Graphics, w = 10, color = cc.Color.YELLOW): void {
        let startFlag = true;
        for (const pos of posArr) {
            let p = pos.clone();
            if (startFlag) {
                startFlag = false;
                draw_board.moveTo(p.x, p.y);
            } else {
                draw_board.lineTo(p.x, p.y);
            }
        }
        draw_board.lineJoin = cc.Graphics.LineJoin.ROUND;
        draw_board.lineWidth = w;
        draw_board.strokeColor = color;
        draw_board.stroke();
    }

    /**
     * 将root节点渲染到target节点上，target节点如果没有sprite组件会自动创建一个并关联内存纹理
     * @param root 
     * @param others 
     * @param target 
     * @param extend 内存纹理相比较原图的扩边大小，上下左右分别多出extend宽度的像素
     * @returns 
     */
    public RenderToMemory(root: cc.Node, others: cc.Node[], target: cc.Node, extend: number = 0): cc.RenderTexture {
        // 使截屏处于被截屏对象中心（两者有同样的父节点）
        let node = new cc.Node;
        node.parent = root;
        node.x = (0.5 - root.anchorX) * root.width;
        node.y = (0.5 - root.anchorY) * root.height;

        let camera = node.addComponent(cc.Camera);
        camera.backgroundColor = new cc.Color(255, 255, 255, 0);        // 透明区域仍然保持透明，半透明区域和白色混合
        camera.clearFlags = cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL | cc.Camera.ClearFlags.COLOR;

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        let success: boolean = false;
        try {
            let scaleX = 1.0;   //this.fitArea.scaleX;
            let scaleY = 1.0;   //this.fitArea.scaleY;
            //@ts-ignore
            let gl = cc.game._renderContext;

            let targetWidth = Math.floor(root.width * scaleX + extend * 2);      // texture's width/height must be integer
            let targetHeight = Math.floor(root.height * scaleY + extend * 2);

            // 内存纹理创建后缓存在目标节点上
            // 如果尺寸和上次不一样也重新创建
            let texture: cc.RenderTexture = target["__gt_texture"];
            if (!texture || texture.width != targetWidth || texture.height != target.height) {
                texture = target["__gt_texture"] = new cc.RenderTexture();

                texture.initWithSize(targetWidth, targetHeight, gl.STENCIL_INDEX8);
                texture.packable = false;
            }

            camera.alignWithScreen = false;
            // camera.orthoSize = root.height / 2;
            camera.orthoSize = targetHeight / 2;
            camera.targetTexture = texture;

            // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
            camera.render(root);
            if (others) {
                for (let o of others) {
                    camera.render(o);
                }
            }

            let screenShot = target;
            screenShot.active = true;
            screenShot.opacity = 255;

            // screenShot.parent = root.parent;
            // screenShot.position = root.position;
            screenShot.width = targetWidth;     // root.width;
            screenShot.height = targetHeight;   // root.height;
            screenShot.angle = root.angle;

            // fitArea有可能被缩放，截图的实际尺寸是缩放后的
            screenShot.scaleX = 1.0 / scaleX;
            screenShot.scaleY = -1.0 / scaleY;

            let sprite = screenShot.getComponent(cc.Sprite);
            if (!sprite) {
                sprite = screenShot.addComponent(cc.Sprite);
                // sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
            }

            if (!sprite.spriteFrame) {
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                sprite.spriteFrame = new cc.SpriteFrame(texture);
            }

            success = true;
        } finally {
            camera.targetTexture = null;
            node.removeFromParent();
            if (!success) {
                target.active = false;
            }
        }

        return target["__gt_texture"];
    }

    /**
     * 将RGBA颜色分量转换为一个数值表示的颜色，颜色分量为0~255之间的值
     * @param r 
     * @param g 
     * @param b 
     * @param a 
     */
    private convertToNumber(r: number, g: number, b: number, a: number = 255): number {
        return ((r & 0xfe) << 23) | (g << 16) | (b << 8) | a;
    }

    /**将十六进制的颜色转换为RGBA分量表示的颜色 */
    private convertToRGBA(color: number): { r: number, g: number, b: number, a: number } {
        return {
            r: (color & 0xef000000) >> 23,
            g: (color & 0x00ff0000) >> 16,
            b: (color & 0x0000ff00) >> 8,
            a: (color & 0x000000ff),
        };
    }

    // 储存的texture值，从左到右/从下到上。
    public setPointColorByRGBA(data: Uint8Array, width, height) {
        let colorRecord = {};
        let result = new Array(width);
        result.fill(new Array(height));

        for (let y = 0; y < height; ++y) {
            let i = y * width * 4
            for (let x = 0; x < width; ++x) {
                let color = this.convertToNumber(data[i++], data[i++], data[i++], data[i++]);
                result[x][y] = color;
                if (!colorRecord[color]) {
                    colorRecord[color] = 1;
                } else {
                    colorRecord[color] += 1;
                }
            }
        }

        return result;
    }

}