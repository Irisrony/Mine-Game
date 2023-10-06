import { Color } from "./global"

type blockInfo = {
    x: number
    y: number
    roundMines: number
}

class Block{
    // 每一个方块
    private blocks: Array<Array<number>>
    // 每个方块是否被翻开了
    private vis: Array<Array<boolean>>
    // 大小
    private width: number
    private height: number
    // 地雷数量
    private mines: number
    // 初始化时最大掀开的格子数
    private maxOpenBlocks: number = 20

    constructor(blocksWidth:number,blocksHeight:number,mines:number){
        
        this.width = blocksWidth
        this.height = blocksHeight
        this.mines = mines

        this.blocks = new Array(this.height).fill(0).map(v=>new Array(this.width).fill(0))
        this.vis = new Array(this.height).fill(0).map(v=>new Array(this.width).fill(false))
        
        this.init()
    }

    private init(){
        // 初始化方块
        for(let i = 0;i<this.height;++i){
            for(let j = 0;j<this.width;++j){
                if(i*this.width + j < this.mines){
                    this.blocks[i][j] = 1
                }
            }
        }        
        // 打乱顺序
        this.shuffle()   
    }

    // 检查是否是地雷
    checkMine(i : number,j : number,flag: boolean) : Array<blockInfo>{
        if(this.blocks[i][j] === 1){// 地雷
            throw new Error("碰到炸弹了!")
        }else if(this.blocks[i][j] === 0 && !this.vis[i][j]){ // 安全格
            return this.bfsBlocks(i,j,flag)
        }else{ // 翻开过了
            return []
        }
    }

    // 首次广搜不是炸弹的格子
    private bfsBlocks(x: number,y: number, firstFlag: boolean): Array<blockInfo>{
        // 先绘制进来的
        let cnt = 1
        this.vis[x][y] = true

        // 该格子周围的地雷
        let roundMines = this.calMines(x,y)

        // 空格子队列
        const emptyQ : Array<[number,number]> = []

        if(roundMines === 0){
            emptyQ.push([x,y])
        }

        // 队列
        const q : Array<[number,number]> = []
        q.push([x,y])

        // 返回值
        const res = new Array<blockInfo>
        res.push({x,y,roundMines})

        // 首次点击
        while(q.length > 0 && firstFlag && cnt < this.maxOpenBlocks){
            const [xx,yy] = q.shift()!
            for(let i = -1;i<=1;++i){
                for(let j = -1;j<=1;++j){
                    if(Math.abs(i) === Math.abs(j)){
                        continue
                    }
                    // 新位置
                    const [x,y] = [xx+i,yy+j]
                    // 判断是否为合法位置
                    if(x>=0&&x<this.height&&y>=0&&y<this.width&&this.blocks[x][y] === 0&&!this.vis[x][y]&&cnt < this.maxOpenBlocks){
                        ++cnt
                        this.vis[x][y] = true
                        q.push([x,y])
                        roundMines = this.calMines(x,y)
                        res.push({x,y,roundMines})

                        if(roundMines === 0){
                            emptyQ.push([x,y])
                        }
                    }
                }
            }
        }

        // 翻开所有空格子
        while(emptyQ.length > 0){
            const [xx,yy] = emptyQ.shift()!
            for(let i = -1;i<=1;++i){
                for(let j = -1;j<=1;++j){
                    // 当前位置
                    const [x,y] = [xx+i,yy+j]
                    // 判断是否为合法位置
                    if(x>=0&&x<this.height&&y>=0&&y<this.width&&this.blocks[x][y] === 0&&!this.vis[x][y]){
                        ++cnt
                        this.vis[x][y] = true

                        roundMines = this.calMines(x,y)

                        res.push({x,y,roundMines})

                        if(roundMines === 0){
                            emptyQ.push([x,y])
                        }
                    }
                }
            }
        }
        
        return res
    }

    // 获得所有地雷位置
    getAllMines(): Array<blockInfo>{
        const res = new Array<blockInfo>
        for(let x = 0;x<this.height;++x){
            for(let y = 0;y<this.width;++y){
                if(this.blocks[x][y] === 1){
                    const roundMines = -1
                    res.push({x,y,roundMines})
                }
            }
        }
        return res
    }

    // 打乱顺序
    private shuffle(): void{
        for(let i = 0;i<this.height;++i){
            for(let j = 0;j<this.width;++j){
                const pos = Math.round(Math.random()*(this.width*this.height-1))             
                this.swap(Math.floor(pos / this.width),pos - Math.floor(pos / this.width) * this.width,i,j)
            }
        }
    }

    // 交换
    private swap(i:number,j:number,prei:number,prej:number): void{        
        const tmp = this.blocks[i][j]
        this.blocks[i][j] = this.blocks[prei][prej]
        this.blocks[prei][prej] = tmp
    }

    // 计算炸弹
    private calMines(x:number,y:number): number{
        let cnt = 0
        for(let i = -1;i<=1;++i){
            for(let j = -1;j<=1;++j){
                if(x + i >= 0 && x + i < this.height && y + j >= 0 && y + j < this.width){
                    if(this.blocks[x+i][y+j] === 1){
                        ++cnt
                    }
                }
            }
        }
        return cnt
    }
}

export default Block