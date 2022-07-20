import Utiles from "./Utiles"

/** 
 *  @description A*寻路算法工具类
 */
export default class AlgorithmUtiles extends Utiles {
    /**
     *  @description A*算法
     *  @param currentPos 当前位置
     *  @param targetPos 目标位置
     *  @param roadMap 道路地图
     *  @param canMove 可以移动的tiled
     */
    public static AStarWayfindingAlgorithm(currentPos: cc.Vec2, targetPos: cc.Vec2,
        roadMap: cc.TiledLayer, canMove: Map<number, any>): Array<any> {
        if (!canMove) {
            cc.log('no canMoveMap.');
            return [];
        }
        let startBlock = new Block({
            currentPos: currentPos,
            targetPos: targetPos
        });
        let openList: Array<Block> = new Array(); // 未检测过的方块数组
        let closeList: Array<Block> = new Array(); // 检测过的方块数组
        if (!canMove.has(roadMap.getTileGIDAt(targetPos))) {
            cc.log('targetPos can not move.');
            return [];
        } // 如果终点方块非道路则退出
        openList.push(startBlock); // 将开始方块放入检测过的方块数组中
        while (openList.length > 0) {
            if (openList.findIndex((b) => { // 如果检测过的方块数组中包含有目标位置则退出循环
                return b.currentPos.equals(targetPos);
            }) >= 0) {
                closeList.push(openList.pop());
                break;
            };
            openList.sort((a, b) => { // 按照F值排序
                return a.F - b.F;
            });
            let minFBlock: Block = openList.shift(); // 获取F值最小的方块
            closeList.push(minFBlock);
            let aroundBlockArray: Array<Block> = minFBlock.getAroundBlock(minFBlock, canMove, roadMap); // 获取该方块周围的方块数组
            for (let elm of aroundBlockArray) {
                if (elm.currentPos.equals(targetPos)) { // 如果遍历到终点，则直接跳出循环
                    elm.parentBlock = minFBlock;
                    openList.push(elm);
                    break;
                }
                if (closeList.findIndex((b) => {
                    return elm.currentPos.equals(b.currentPos);
                }) >= 0 || !canMove.has(elm.GID)) { // 如果在closeMap或者不可抵达跳过
                    continue;
                }
                let index = openList.findIndex(obj => { return obj.currentPos.equals(elm.currentPos); });
                if (index > 0) { // 如果openlist中有该方块
                    let openListBlock = openList[index];
                    let tempG = openListBlock.countPosition(elm, openListBlock) + elm.G;
                    if (tempG < openListBlock.G) { // 如果当前的G值小于openlist中的G值，重新计算其g h f 值， 重置其父节点为当前节点
                        openListBlock.parentBlock = elm;
                        openListBlock.G = tempG;
                        openListBlock.F = openListBlock.countF(openListBlock.G, openListBlock.H);
                        openList.sort((a, b) => { // 按照F值排序
                            return a.F - b.F;
                        });
                    }
                } else { // 如果没有该方块
                    openList.push(elm);
                }
            }

        }
        let moveBlockArray = new Array();
        if (closeList.findIndex(b => { return b.currentPos.equals(targetPos) }) >= 0 && closeList.findIndex(b => { return b.currentPos.equals(currentPos); }) >= 0) {
            let searchPos = targetPos;
            while (closeList.length > 0) {
                let index = closeList.findIndex(b => { return b.currentPos.equals(searchPos) });
                let block = closeList[index];
                closeList.slice(index, 1);
                if (block.currentPos.equals(currentPos)) {
                    break;
                }
                moveBlockArray.unshift(block);
                searchPos = block.parentBlock.currentPos;
            }
            return moveBlockArray;
        } else {
            return [];
        }
    }
}

/**
 *  @description 地图块的类
 */
class Block {
    public GID: number; // 地图块的GID
    public moveExpend: number; // 地图块移动消耗 
    public H: number; // H值  距离目标点所需的方块数量*移动消耗值
    public G: number; // G值  距离父块的距离
    public F: number; // F值  F=H+G;
    public targetPos: cc.Vec2; // 目标位置
    public currentPos: cc.Vec2; // 当前位置
    public type: string; // 类型
    public parentBlock: Block; // 父块
    constructor(params: any) {
        this.GID = params.GID || 0;
        this.moveExpend = params.moveExpend || 10;
        this.H = params.H || 0;
        this.G = params.G || 0;
        this.F = params.F || 0;
        this.targetPos = params.targetPos || cc.v2(0, 0);
        this.currentPos = params.currentPos || cc.v2(0, 0);
        this.type = params.type || '';
    }
    /** 获取周围方块 */
    public getAroundBlock(block: Block, map: Map<number, any>, layer: cc.TiledLayer) {
        let mapSize = layer.getLayerSize();
        let aroundBlockArray: Array<Block> = new Array();

        if (block.currentPos.y + 1 < mapSize.height && block.currentPos.x - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x - 1, block.currentPos.y + 1))) { // 左上角方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x - 1, block.currentPos.y + 1);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 14;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.y + 1 < mapSize.height && map.has(layer.getTileGIDAt(block.currentPos.x, block.currentPos.y + 1))) { // 正上方方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x, block.currentPos.y + 1);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 10;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.y + 1 < mapSize.height && block.currentPos.x + 1 < mapSize.width && map.has(layer.getTileGIDAt(block.currentPos.x + 1, block.currentPos.y + 1))) { // 右上角方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x + 1, block.currentPos.y + 1);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 14;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.x + 1 < mapSize.width && map.has(layer.getTileGIDAt(block.currentPos.x + 1, block.currentPos.y))) { // 右边方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x + 1, block.currentPos.y);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 10;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.x + 1 < mapSize.width && block.currentPos.y - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x + 1, block.currentPos.y - 1))) { // 右下角方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x + 1, block.currentPos.y - 1);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 14;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.y - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x, block.currentPos.y - 1))) { // 正下方方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x, block.currentPos.y - 1);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 10;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.y - 1 >= 0 && block.currentPos.x - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x - 1, block.currentPos.y - 1))) { // 左下角方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x - 1, block.currentPos.y - 1);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 14;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        if (block.currentPos.x - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x - 1, block.currentPos.y))) { // 左边方块
            let nB = new Block({});
            nB.currentPos = cc.v2(block.currentPos.x - 1, block.currentPos.y);
            nB.GID = layer.getTileGIDAt(nB.currentPos);
            nB.moveExpend = map.get(nB.GID).moveExpend;
            nB.G = block.G + 10;
            nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
            nB.F = nB.countF(nB.G, nB.H);
            nB.parentBlock = block;
            nB.targetPos = block.targetPos;
            aroundBlockArray.push(nB);
        }

        return aroundBlockArray;
    }
    /** 计算H值 */
    public countH(cPos: cc.Vec2, tPos: cc.Vec2, mvEd: number): number {
        return (Math.abs(tPos.x - cPos.x) + Math.abs(tPos.y - cPos.y)) * mvEd;
    }
    /** 计算F值 */
    public countF(g: number, h: number): number {
        return h + g;
    }
    /** 判断当前方块和对比方块位置关系返回距离值 */
    public countPosition(parentBlock: Block, childBlock: Block): number {
        if (parentBlock.currentPos.x == childBlock.currentPos.x || parentBlock.currentPos.y == childBlock.currentPos.y) {
            return 10;
        }
        return 14;
    }
}


export { Block };