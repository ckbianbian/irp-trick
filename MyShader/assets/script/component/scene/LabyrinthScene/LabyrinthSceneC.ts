import MathUtils from "../../../lib/MathUtils";
import GraphicsUtil from "../../../utils/GraphicsUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabyrinthSceneC extends cc.Component {

    @property({ type: cc.Graphics })
    DrawBoard: cc.Graphics = null;

    _boardArr = null;

    onLoad(): void { }
    start(): void {
        this.initCheckerboard();
        this.drawCheckerboard();
        this.renderCheckerboard();
    }

    initCheckerboard(rowNum = 11, columnNum = 11): void {
        if (rowNum % 2 == 0) { rowNum += 1; }
        if (columnNum % 2 == 0) { columnNum += 1; }
        let rectWh = Math.min(cc.winSize.width / columnNum, cc.winSize.height / rowNum);
        let offset = { x: -(Math.floor(columnNum / 2) + 0.5) * rectWh, y: -(Math.floor(rowNum / 2) + 0.5) * rectWh };

        this._boardArr = [];
        for (let row = 0; row < rowNum; row++) {
            let rowArr = [];
            for (let column = 0; column < columnNum; column++) {
                let block = new Block();
                block.x = column, block.y = row, block.h = block.w = rectWh, block.pos = cc.v2(column * rectWh + offset.x, row * rectWh + offset.y);
                row % 2 === 0 ? block.type = block.state = Block.STATE_ENUM.WALL : column % 2 === 0 ? block.type = block.state = Block.STATE_ENUM.WALL : block.type = block.state = Block.STATE_ENUM.ROAD;
                rowArr.push(block);
            }
            this._boardArr.push(rowArr);
        }
    }
    getBlockByRowColumn(row, column): Block {
        if (this._boardArr) { return this._boardArr[row][column]; }
        return null;
    }
    getStartBlock(): Block {
        if (this._boardArr) {
            let result = this.getBlockByRowColumn(1, 1);
            result.isStart = true;
            return result;
        }
        return null;
    }
    drawCheckerboard(): void {
        let startBlock = this.getStartBlock();
        this.genBigLabyrinth();
        // this.calculateMap(startBlock);
        // this.calculateMapPrimeRd(startBlock, []);
    }
    calculateMap(block: Block): void {
        if (block.state != Block.STATE_ENUM.CHECKED) {
            block.state = Block.STATE_ENUM.CHECKED;
            block.dirt = true;
        }
        let otherBlock = this.getAroundBlock(block);
        if (otherBlock) {
            otherBlock.before = block;
            let wallBlock = this.getBlockWallBetweenTwoBlock(block, otherBlock);
            if (wallBlock && wallBlock.state == Block.STATE_ENUM.WALL) {
                wallBlock.dirt = true;
                wallBlock.state = Block.STATE_ENUM.CHECKED;
            }
            this.calculateMap(otherBlock);
        } else {
            if (block.isStart) { return; }
            if (block.before) {
                this.calculateMap(block.before);
            }
        }
    }
    // prime 算法生成迷宫
    calculateMapPrimeRd(block: Block, arr: Block[]): void {
        if (block.state != Block.STATE_ENUM.CHECKED) {
            block.state = Block.STATE_ENUM.CHECKED;
            block.dirt = true;
        }
        let wallBlockArr = block.getCorrectAroundWallBlockArr(this._boardArr);
        let newArr = arr.concat(wallBlockArr);
        if (newArr.length > 0) {
            let rdIndex = MathUtils.Random(0, newArr.length - 1);
            let wallBlock = newArr.splice(rdIndex, 1)[0];
            let roadBlock = this.getBlockByWallBlock(wallBlock);
            if (roadBlock.state & Block.STATE_ENUM.ROAD) {
                wallBlock.state = Block.STATE_ENUM.CHECKED;
            } else {
                wallBlock.state = Block.STATE_ENUM.LOCK;
            }
            this.calculateMapPrimeRd(roadBlock, newArr);
        }
    }
    // 生成大型迷宫
    genBigLabyrinth(): void {
        let bigAreaNum = 4; // 必须是4的2次倍数
        let bigAreaLimit = { maxColumn: Math.round(3 / 5 * (this._boardArr[0].length - 2)), maxRow: Math.round(3 / 5 * (this._boardArr.length - 2)), minColumn: 3, minRow: 3 };
        cc.log(bigAreaLimit);
        let result = this.recurSpliceArr(this._boardArr, 2);
        cc.log(result);
    }
    // 获得分裂数组
    recurSpliceArr(arr, num = 1): any[] {
        num -= 1;
        let treeArr = MathUtils.divisionArrToFourQuadrantsTree(arr);
        if (num == 0) {
            return treeArr;
        }
        return [this.recurSpliceArr(treeArr[0], num), this.recurSpliceArr(treeArr[1], num), this.recurSpliceArr(treeArr[2], num), this.recurSpliceArr(treeArr[3], num)]
    }
    getBlockWallBetweenTwoBlock(block1, block2): Block {
        let row = (block1.y + block2.y) / 2, column = (block1.x + block2.x) / 2;
        let block = this.getBlockByRowColumn(row, column);
        return block;
    }
    getBlockByWallBlock(wallBlock: Block): Block {
        let row = wallBlock.y * 2 - wallBlock.parent.y, column = wallBlock.x * 2 - wallBlock.parent.x;
        return this.getBlockByRowColumn(row, column);
    }
    getAroundBlock(block: Block): Block {
        let aroundBlockArr = block.getCorrectAroundBlockArr(this._boardArr);
        if (aroundBlockArr.length > 0) {
            let index = MathUtils.Random(0, aroundBlockArr.length - 1);
            return aroundBlockArr[index];
        }
        return null;
    }
    renderCheckerboard(): void {
        if (this._boardArr && this.DrawBoard) {
            let time_cont = 1;
            let step_time = 0.01;
            for (let row of this._boardArr) {
                for (let block of row) {
                    if (block.dirt) {
                        block.dirt = false;
                        // this.scheduleOnce(() => {
                        GraphicsUtil.getInstance().drawRect([block.pos], this.DrawBoard, cc.v2(block.w, block.h), block.getColor());
                        // }, time_cont += step_time);
                    }
                }
            }
        }
    }
}

class Block {
    static STATE_ENUM = cc.Enum({
        WALL: 1 << 0,
        ROAD: 1 << 1,
        CHECKED: 1 << 2,
        LOCK: 1 << 3,
        UNLOCK: 1 << 4,
        BIG_AREA: 1 << 5
    });

    x: number; // column
    y: number; // row
    w: number;
    h: number;
    pos: cc.Vec2;
    dirt: boolean = true;
    type: number;
    state: number;
    parent: Block;
    before: Block;
    isStart: boolean = false;

    getColor() {
        if (this.state & Block.STATE_ENUM.WALL || this.state & Block.STATE_ENUM.LOCK) {
            return cc.Color.GRAY;
        }
        if (this.state & Block.STATE_ENUM.ROAD) {
            return cc.Color.YELLOW;
        }
        if (this.state & Block.STATE_ENUM.CHECKED || this.state & Block.STATE_ENUM.BIG_AREA) {
            return cc.Color.WHITE;
        }
    }
    getAroundBlockIndex(): { x, y }[] {
        return [{ x: this.x - 2, y: this.y }, { x: this.x + 2, y: this.y }, { x: this.x, y: this.y - 2 }, { x: this.x, y: this.y + 2 }];
    }
    getAroundWallBlockIndex(): { x, y }[] {
        return [{ x: this.x - 1, y: this.y }, { x: this.x + 1, y: this.y }, { x: this.x, y: this.y - 1 }, { x: this.x, y: this.y + 1 }];
    }
    getCorrectAroundBlockArr(blockArr): Block[] {
        let aroundBlockIndex = this.getAroundBlockIndex();
        let result = [];
        for (let obj of aroundBlockIndex) {
            if (obj.x >= 0 && obj.y >= 0 && obj.y < blockArr.length && obj.x < blockArr[0].length) {
                let block = blockArr[obj.y][obj.x] as Block;
                if (block != null && block.state != Block.STATE_ENUM.CHECKED && block.type == Block.STATE_ENUM.ROAD) {
                    result.push(block);
                }
            }
        }
        return result;
    }
    getCorrectAroundWallBlockArr(blockArr): Block[] {
        let aroundBlockIndex = this.getAroundWallBlockIndex();
        let result = [];
        for (let obj of aroundBlockIndex) {
            if (obj.x >= 0 && obj.y >= 0 && obj.y < blockArr.length
                && obj.x < blockArr[0].length
                && obj.x - 1 >= 0 && obj.x + 1 < blockArr[0].length
                && obj.y - 1 >= 0 && obj.y + 1 < blockArr.length
            ) {
                let block = blockArr[obj.y][obj.x] as Block;
                if (block != null && block.state != Block.STATE_ENUM.CHECKED
                    && block.type == Block.STATE_ENUM.WALL
                    && block.state != Block.STATE_ENUM.UNLOCK
                    && block.state != Block.STATE_ENUM.LOCK
                ) {
                    block.parent = this;
                    block.state = Block.STATE_ENUM.UNLOCK;
                    result.push(block);
                }
            }
        }
        return result;
    }

}
