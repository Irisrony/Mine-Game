import { blocksHeight,blocksWidth,mines,Color } from "./global"

class Block{
    // 每一个方块
    blocks: Array<Array<number>>
    // 每个方块是否被翻开了
    vis: Array<Array<boolean>>
    // 方块集合
    blocksElem: HTMLCollection
    // 大小： 24 * 20
    width: number = blocksWidth
    height: number = blocksHeight
    // 初始化时最大掀开的格子数
    readonly maxOpenBlocks: number = 20

    constructor(){
        this.blocksElem = document.querySelector("#stage")!.getElementsByTagName('div')
        this.blocks = new Array(this.height).fill(0).map(v=>new Array(this.width).fill(0))
        this.vis = new Array(this.height).fill(0).map(v=>new Array(this.width).fill(false))
        this.init()
    }

    private init(){
        // 初始化方块
        for(let i = 0;i<this.height;++i){
            for(let j = 0;j<this.width;++j){
                if(i*this.width + j < mines){
                    this.blocks[i][j] = 1
                }
            }
        }        
        // 打乱顺序
        this.shuffle()
        
    }

    // 检查是否是地雷
    checkMine(i : number,j : number,flag: boolean) : number{
        // 地雷
        if(this.blocks[i][j] === 1){
            this.paintBlock(i, j)
            throw new Error("碰到炸弹了!")
        }else if(this.blocks[i][j] === 0 && !this.vis[i][j]){ // 安全格
            return this.bfsBlocks(i,j,flag)
        }else{ // 翻开过了
            return 0
        }
    }

    // 绘制被翻开的格子
    private paintBlock(i: number,j: number){
        (this.blocksElem[i*this.width+j] as HTMLElement).style.backgroundColor = Color.Open;
        if(this.blocks[i][j] === 1){ // 炸弹
            (this.blocksElem[i*this.width+j] as HTMLElement).style.color = Color.Over;
            (this.blocksElem[i*this.width+j] as HTMLElement).innerHTML = "X"
        }else{ // 安全格
            const cnt = this.calMines(i,j);
            (this.blocksElem[i*this.width+j] as HTMLElement).innerHTML = cnt === 0 ? "" : cnt + "";
        }
    }

    // 首次广搜不是炸弹的格子
    private bfsBlocks(xx: number,yy: number, firstFlag: boolean): number{
        // 先绘制进来的
        let cnt = 1
        this.paintBlock(xx,yy)
        this.vis[xx][yy] = true
        const roundMines = this.calMines(xx,yy)

        // 队列
        const q : Array<[number,number]> = []
        q.push([xx,yy])

        // 空格子队列
        const emptyQ : Array<[number,number]> = []

        if(roundMines === 0){
            emptyQ.push([xx,yy])
        }

        // 首次点击
        while(q.length > 0 && firstFlag && cnt < this.maxOpenBlocks){
            const [x,y] = q.shift()!
            for(let i = -1;i<=1;++i){
                for(let j = -1;j<=1;++j){
                    if(Math.abs(i) === Math.abs(j)){
                        continue
                    }
                    const curX = x+i,curY = y+j
                    if(curX>=0&&curX<this.height&&curY>=0&&curY<this.width&&this.blocks[curX][curY] === 0&&!this.vis[curX][curY]&&cnt < this.maxOpenBlocks){
                        ++cnt
                        this.paintBlock(curX,curY)
                        this.vis[curX][curY] = true
                        q.push([curX,curY])

                        if(this.calMines(curX,curY) === 0){
                            emptyQ.push([curX,curY])
                        }
                    }
                }
            }
        }

        // 翻开所有空格子
        while(emptyQ.length > 0){
            const [x,y] = emptyQ.shift()!
            for(let i = -1;i<=1;++i){
                for(let j = -1;j<=1;++j){
                    const curX = x+i,curY = y+j
                    if(curX>=0&&curX<this.height&&curY>=0&&curY<this.width&&this.blocks[curX][curY] === 0&&!this.vis[curX][curY]){
                        ++cnt
                        this.paintBlock(curX,curY)
                        this.vis[curX][curY] = true

                        if(this.calMines(curX,curY) === 0){
                            emptyQ.push([curX,curY])
                        }
                    }
                }
            }
        }
        
        return cnt
    }

    // 描出所有地雷
    paintMines(){
        for(let i = 0;i<this.height;++i){
            for(let j = 0;j<this.width;++j){
                if(this.blocks[i][j] === 1){
                    this.paintBlock(i,j)
                }
            }
        }        
    }

    // 打乱顺序
    private shuffle(){
        for(let i = 0;i<this.height;++i){
            for(let j = 0;j<this.width;++j){
                const pos = Math.round(Math.random()*(this.width*this.height-1))             
                this.swap(Math.floor(pos / this.width),pos - Math.floor(pos / this.width) * this.width,i,j)
            }
        }
    }

    // 交换
    private swap(i:number,j:number,prei:number,prej:number){        
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