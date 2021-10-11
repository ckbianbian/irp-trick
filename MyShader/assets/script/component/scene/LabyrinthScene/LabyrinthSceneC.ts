import MathUtils from "../../../lib/MathUtils";
import GraphicsUtil from "../../../utils/GraphicsUtil";

const { ccclass, property } = cc._decorator;
const BASE_NUM = 4;
const DIRECTION_ENUM = cc.Enum({
    UP: 1 << 0,
    DOWN: 1 << 1,
    RIGHT: 1 << 2,
    LEFT: 1 << 3
});

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
    // 初始化二维数组方块信息
    initCheckerboard(rowNum = 51, columnNum = 71): void {
        if (rowNum % 2 == 0) { rowNum += 1; }
        if (columnNum % 2 == 0) { columnNum += 1; }
        rowNum = Math.max(5, rowNum);
        columnNum = Math.max(5, columnNum);
        let rectWh = Math.min(cc.winSize.width / columnNum, cc.winSize.height / rowNum);
        let offset = { x: -(Math.floor(columnNum / 2) + 0.5) * rectWh, y: -(Math.floor(rowNum / 2) + 0.5) * rectWh };

        this._boardArr = [];
        for (let row = 0; row < rowNum; row++) {
            let rowArr = [];
            for (let column = 0; column < columnNum; column++) {
                let block = new Block();
                block.state = Block.STATE_ENUM.UNCHECKED;
                block.x = column, block.y = row, block.h = block.w = rectWh, block.pos = cc.v2(column * rectWh + offset.x, row * rectWh + offset.y);
                row % 2 === 0 ? block.type = Block.STATE_ENUM.WALL : column % 2 === 0 ? block.type = Block.STATE_ENUM.WALL : block.type = Block.STATE_ENUM.ROAD;
                rowArr.push(block);
            }
            this._boardArr.push(rowArr);
        }
    }
    drawCheckerboard(): void {
        this.drawBigAreaLabyrinth();
        // this.drawNormalLabyrinth();
        // this.drawRdPrimeLabyrinth();
    }
    drawBigAreaLabyrinth(): void {
        this.genBigLabyrinth();
    }
    drawNormalLabyrinth(): void {
        let startBlock = this.getStartBlock();
        this.calculateMap(startBlock);
    }
    drawRdPrimeLabyrinth(): void {
        let startBlock = this.getStartBlock();
        this.calculateMapPrimeRd(startBlock, []);
    }
    // 通过行数和列数获取方块
    getBlockByRowColumn(row, column): Block {
        if (this._boardArr) { return this._boardArr[row][column]; }
        return null;
    }
    // 获取起始方块
    getStartBlock(): Block {
        if (this._boardArr) {
            let arr = [];
            for (let row = 1; row < this._boardArr.length - 1; row += 2) {
                let rowBlockArr = this._boardArr[row];
                if (row == 1 || row == this._boardArr.length - 2) {
                    for (let column = 1; column < rowBlockArr.length - 1; column += 2) {
                        let block = rowBlockArr[column];
                        if (block.type == Block.STATE_ENUM.ROAD) {
                            arr.push(block);
                        }
                    }
                } else {
                    let firstColumn = 1, endColumn = rowBlockArr.length - 2;
                    let block = rowBlockArr[firstColumn];
                    if (block) { arr.push(block); };
                    block = rowBlockArr[endColumn];
                    if (block) { arr.push(block); }
                }
            }
            let randomIndex = MathUtils.Random(0, arr.length - 1);
            let result = arr[randomIndex];
            result.isStart = true;
            return result;
        }
        return null;
    }
    // 普通生成迷宫算法 会生成一个很长主路的迷宫 不自然
    calculateMap(block: Block): void {
        if (block.state & Block.STATE_ENUM.UNCHECKED) {
            block.state = Block.STATE_ENUM.CHECKED;
            block.type = Block.STATE_ENUM.ROAD;
            block.dirt = true;
        }
        let otherBlock = this.getAroundBlock(block);
        if (otherBlock) {
            otherBlock.before = block;
            let wallBlock = this.getBlockWallBetweenTwoBlock(block, otherBlock);
            if (wallBlock && wallBlock.state & Block.STATE_ENUM.UNCHECKED) {
                wallBlock.dirt = true;
                wallBlock.type = Block.STATE_ENUM.ROAD;
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
        if (block.state & Block.STATE_ENUM.UNCHECKED) {
            block.dirt = true;
            block.type = Block.STATE_ENUM.ROAD;
            block.state = Block.STATE_ENUM.CHECKED;
        }
        let wallBlockArr = block.getCorrectAroundWallBlockArr(this._boardArr);
        let newArr = arr.concat(wallBlockArr);
        if (newArr.length > 0) {
            let rdIndex = MathUtils.Random(0, newArr.length - 1);
            let wallBlock = newArr.splice(rdIndex, 1)[0];
            let roadBlock = this.getBlockByWallBlock(wallBlock);
            if (roadBlock.type & Block.STATE_ENUM.ROAD && roadBlock.state & Block.STATE_ENUM.UNCHECKED) {
                wallBlock.state = Block.STATE_ENUM.LOCK;
                wallBlock.type = Block.STATE_ENUM.ROAD;
            } else {
                wallBlock.state = Block.STATE_ENUM.CHECKED;
            }
            this.calculateMapPrimeRd(roadBlock, newArr);
        }
    }
    // 生成大型迷宫
    genBigLabyrinth(): void {
        let bigAreaNum = 3; // 生成几个大型区域
        this.genBigAreaByArr(bigAreaNum);
        this.calculateMap(this.getStartBlock());
        this.genLinkBlock();
        this.changeRoadAroundThreeWallToWall();
    }
    // 消除周围道路周围是三个墙体的道路
    changeRoadAroundThreeWallToWall(): void {
        let clearNum = 2; // 执行清除次数
        let roadArr = this.getBlockByType(Block.STATE_ENUM.ROAD);
        for (let i = 0; i < clearNum; i++) {
            for (let block of roadArr) {
                if (!block.isStart) {
                    let wallNum = block.getAroundWallBlockNum(this._boardArr);
                    if (wallNum >= 3) {
                        block.type = Block.STATE_ENUM.WALL;
                    }
                }
            }
        }
    }
    // 生成连接大块区域和道路的块
    genLinkBlock(): void {
        let unitBigAreaLinkBlockNum = 1;
        let countMap = new Map();
        let bigAreaBlockArr = this.getBlockByType(Block.STATE_ENUM.BIG_AREA);
        for (let block of bigAreaBlockArr) {
            let id = block.belongBigAreaID;
            if (countMap.has(id) && countMap.get(id) >= unitBigAreaLinkBlockNum) {
                continue;
            }
            let linkBlockArr = block.getLinkBlock(this._boardArr);
            if (linkBlockArr.length > 0) {
                linkBlockArr[MathUtils.Random(0, linkBlockArr.length - 1)].type = Block.STATE_ENUM.LINK_BLOCK;
                countMap.has(id) ? countMap.set(id, countMap.get(id) + 1) : countMap.set(id, 1);
            }
        }
    }
    // 根据状态获取方块数组
    getBlockByType(type): Block[] {
        let result = [];
        for (let row = 0; row < this._boardArr.length; row++) {
            let rowArr = this._boardArr[row];
            for (let column = 0; column < rowArr.length; column++) {
                let block = rowArr[column];
                if (block.type == type) {
                    result.push(block);
                }
            }
        }
        return result;
    }
    // 根据象限获取Blocks
    getBlocksByQuadrant(arr, index, recur): [] {
        for (let i = recur; i > 0; i--) {
            let unitNum = Math.pow(BASE_NUM, i - 1);
            let firstIndex = Math.floor(index / unitNum);
            if (unitNum == 1) {
                firstIndex = index;
            }
            arr = arr[firstIndex];
            index -= firstIndex * unitNum;
        }
        return arr;
    }
    // 根据数组生成大区块
    genBigAreaByArr(bigAreaNum): void {
        let recurNum = Math.ceil(Math.log(bigAreaNum) / Math.log(BASE_NUM));
        let allGridNum = Math.pow(BASE_NUM, recurNum);
        let divideArr = this.recurDivideArr(this._boardArr, recurNum); // 获取分割后的数组
        let randomIndexArr = MathUtils.Shuffle(MathUtils.CreateArrIndexByArrLength(allGridNum));
        while (bigAreaNum > 0 && randomIndexArr.length > 0) {
            if (this.genBigArea(divideArr, randomIndexArr.shift(), recurNum)) bigAreaNum -= 1;
            if (bigAreaNum > 0 && randomIndexArr.length <= 0) cc.log("num %d area gen failed.", bigAreaNum);
        }
    }
    genBigArea(arr, index, recur): boolean | Block[] {
        // cc.log(index, recur);
        let uuid = MathUtils.genUUID();
        // cc.log(uuid);
        let proportion = 1 / 2;
        let blockArr: Block[] = MathUtils.Shuffle(this.getBlocksByQuadrant(arr, index, recur));
        let bigAreaLimit = { maxColumn: Math.round(proportion * (this._boardArr[0].length - 2)), maxRow: Math.round(proportion * (this._boardArr.length - 2)), minColumn: 3, minRow: 3 };
        for (let block of blockArr) {
            if (block.type & Block.STATE_ENUM.ROAD) {
                let result = this.getCanBeBigAreaArrByBlock(block, bigAreaLimit);
                if (result) {
                    for (let index = 0; index < result.length; index++) {
                        let element = result[index];
                        element.belongBigAreaID = uuid;
                        element.state = Block.STATE_ENUM.CHECKED;
                        element.type = Block.STATE_ENUM.BIG_AREA;
                    }
                    return true;
                }
            }
        }
        return false;
    }
    // 获取可以变成 big area 的数组
    getCanBeBigAreaArrByBlock(block, bigAreaLimit): Block[] | boolean {
        let result = [];
        let rowRd = MathUtils.Random(bigAreaLimit.minRow, bigAreaLimit.maxRow), columnRd = MathUtils.Random(bigAreaLimit.minColumn, bigAreaLimit.maxColumn);
        if (rowRd % 2 == 0) rowRd -= 1;
        if (columnRd % 2 == 0) columnRd -= 1;
        for (let row = block.y; row > block.y - rowRd; row--) {
            for (let column = block.x; column > block.x - columnRd; column--) {
                if (this._boardArr[row]) {
                    let curBlock = this._boardArr[row][column] as Block;
                    if (curBlock) {
                        if (curBlock.type & Block.STATE_ENUM.ROAD) {
                            if (!curBlock.checkCanBeBigArea(this._boardArr)) {
                                return false;
                            }
                        }
                        result.push(curBlock);
                    } else { return false; }
                } else { return false; }
            }
        }
        return result;
    }
    // 获得分裂数组
    recurDivideArr(arr, num = 1): any[] {
        num -= 1;
        let treeArr = MathUtils.divisionArrToFourQuadrantsTree(arr);
        if (num == 0) {
            treeArr[0] = MathUtils.transformTwoDimensionalToOne(treeArr[0]);
            treeArr[1] = MathUtils.transformTwoDimensionalToOne(treeArr[1]);
            treeArr[2] = MathUtils.transformTwoDimensionalToOne(treeArr[2]);
            treeArr[3] = MathUtils.transformTwoDimensionalToOne(treeArr[3]);
            return treeArr;
        }
        return [this.recurDivideArr(treeArr[0], num), this.recurDivideArr(treeArr[1], num), this.recurDivideArr(treeArr[2], num), this.recurDivideArr(treeArr[3], num)]
    }
    // 获取两个方块中间的墙体方块
    getBlockWallBetweenTwoBlock(block1, block2): Block {
        let row = (block1.y + block2.y) / 2, column = (block1.x + block2.x) / 2;
        let block = this.getBlockByRowColumn(row, column);
        return block;
    }
    // 通过墙体方块获得对应的夹着这个墙体方块的普通方块
    getBlockByWallBlock(wallBlock: Block): Block {
        let row = wallBlock.y * 2 - wallBlock.parent.y, column = wallBlock.x * 2 - wallBlock.parent.x;
        return this.getBlockByRowColumn(row, column);
    }
    // 随机获取方块周围一个方块
    getAroundBlock(block: Block): Block {
        let aroundBlockArr = block.getCorrectAroundBlockArr(this._boardArr);
        if (aroundBlockArr.length > 0) {
            let index = MathUtils.Random(0, aroundBlockArr.length - 1);
            return aroundBlockArr[index];
        }
        return null;
    }
    // 渲染棋盘
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
        BIG_AREA: 1 << 5,
        LINK_BLOCK: 1 << 6,
        START_BLOCK: 1 << 7,
        END_BLOCK: 1 << 8,
        UNCHECKED: 1 << 9
    });
    identity: number; // 代表是1还是0
    x: number; // column
    y: number; // row
    w: number;
    h: number;
    pos: cc.Vec2;
    dirt: boolean = true;
    type: number; // 当前方块类型
    state: number; // 当前方块状态
    parent: Block;
    before: Block;
    isStart: boolean = false;
    belongBigAreaID: number;

    getColor() {
        let result = cc.Color.BLACK;
        if (this.type & Block.STATE_ENUM.WALL) {
            result = cc.Color.WHITE;
        }
        if (this.type & Block.STATE_ENUM.ROAD) {
            result = cc.Color.GRAY;
        }
        if (this.type & Block.STATE_ENUM.BIG_AREA) {
            result = cc.Color.GREEN;
        }
        if (this.type & Block.STATE_ENUM.LINK_BLOCK) {
            result = cc.Color.BLUE;
        }
        if (this.isStart) {
            result = cc.Color.RED;
        }
        return result;
    }
    // 获取周围一格内八个方块下标数组
    getAroundBlockIndexDiagonal(): { x, y }[] {
        return [{ x: this.x - 1, y: this.y }, { x: this.x + 1, y: this.y }, { x: this.x, y: this.y - 1 }, { x: this.x, y: this.y + 1 }, { x: this.x + 1, y: this.y + 1 }, { x: this.x - 1, y: this.y - 1 }, { x: this.x + 1, y: this.y - 1 }, { x: this.x - 1, y: this.y + 1 }];
    }
    // 获取周围二格内垂直方向四个方块下标数组
    getAroundBlockIndex(): { x, y }[] {
        return [{ x: this.x - 2, y: this.y }, { x: this.x + 2, y: this.y }, { x: this.x, y: this.y - 2 }, { x: this.x, y: this.y + 2 }];
    }
    // 获取周围一格内垂直方向四个方块下标数组
    getAroundWallBlockIndex(): { x, y }[] {
        return [{ x: this.x - 1, y: this.y }, { x: this.x + 1, y: this.y }, { x: this.x, y: this.y - 1 }, { x: this.x, y: this.y + 1 }];
    }
    // 获取周围符合条件的道路数组
    getCorrectAroundBlockArr(blockArr): Block[] {
        let aroundBlockIndex = this.getAroundBlockIndex();
        let result = [];
        for (let obj of aroundBlockIndex) {
            if (obj.x >= 0 && obj.y >= 0 && obj.y < blockArr.length && obj.x < blockArr[0].length) {
                let block = blockArr[obj.y][obj.x] as Block;
                if (block && block.state & Block.STATE_ENUM.UNCHECKED && block.type & Block.STATE_ENUM.ROAD) {
                    result.push(block);
                }
            }
        }
        return result;
    }
    // 获取周围符合条件的墙壁数组
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
                if (block && block.state & Block.STATE_ENUM.UNCHECKED && block.type & Block.STATE_ENUM.WALL) {
                    block.parent = this;
                    block.state = Block.STATE_ENUM.UNLOCK;
                    result.push(block);
                }
            }
        }
        return result;
    }
    // 检测是否可以转变为大区域方块
    checkCanBeBigArea(blockArr): boolean {
        let aroundBlockIndex = this.getAroundBlockIndex();
        for (let blockCfg of aroundBlockIndex) {
            if (blockArr[blockCfg.y]) {
                let block = blockArr[blockCfg.y][blockCfg.x] as Block;
                if (block) {
                    if (block.type == Block.STATE_ENUM.ROAD) {
                        continue;
                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // 获取周围方块链接道路的方块
    getLinkBlock(blockArr): Block[] {
        let result = [];
        let aroundBlockIndex = this.getAroundBlockIndex();

        for (let blockCfg of aroundBlockIndex) {
            if (blockArr[blockCfg.y]) {
                let block = blockArr[blockCfg.y][blockCfg.x] as Block;
                if (block) {
                    if (block.type == Block.STATE_ENUM.ROAD) {
                        let linkBlock = blockArr[(this.y + block.y) / 2][(this.x + block.x) / 2];
                        result.push(linkBlock);
                    }
                }
            }
        }

        return result;
    }
    // 检测方块周围一个墙状态方块的数量
    getAroundWallBlockNum(blockArr): number {
        let num = 0;
        let aroundBlockIndex = this.getAroundWallBlockIndex();

        for (let blockCfg of aroundBlockIndex) {
            if (blockArr[blockCfg.y]) {
                let block = blockArr[blockCfg.y][blockCfg.x] as Block;
                if (block) {
                    if (block.type & Block.STATE_ENUM.WALL) {
                        num++;
                    }
                }
            }
        }

        return num;
    }
    clone(): Block {
        let result = new Block();
        result.pos = this.pos.clone(), result.x = this.x, result.y = this.y;
        return result;
    }

}
