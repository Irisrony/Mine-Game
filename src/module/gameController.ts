import Block from "./block"
import ScorePanel from "./scorePanel"
import { totalBolcks,mines,startTime,blocksWidth,blocksHeight,Color } from "./global"

class GameController{
    // 方块
    blocks: Block
    // 计分板
    scorePanel: ScorePanel
    // 扫雷区域
    minesArea: HTMLElement
    
    // 游戏是否结束
    isAlive: boolean = true

    // 是否是第一次点击
    isFirstClick: boolean = true

    // 绑定this的鼠标监听函数
    bindMouseClickHandler: (e: MouseEvent) => void

    constructor(){
        this.blocks = new Block()
        this.scorePanel = new ScorePanel(startTime,totalBolcks,mines)
        this.minesArea = document.querySelector("#stage")!

        this.bindMouseClickHandler = this.mouseClickHandler.bind(this)

        this.init()
    }

    private init(){
        // 初始化格子
        // 初始化方块
        for(let i = 0;i<blocksHeight;++i){
            for(let j = 0;j<blocksWidth;++j){
                if((i+j) % 2 === 0){
                    this.minesArea.insertAdjacentHTML("beforeend",`<div style="background-color:${Color.Light}" key="${i+","+j}"></div>`)
                }else{
                    this.minesArea.insertAdjacentHTML("beforeend",`<div style="background-color:${Color.Dark}" key="${i+","+j}"></div>`)
                }
            }
        } 

        // 绑定鼠标单击事件
        this.minesArea.addEventListener("click",this.bindMouseClickHandler)
    }

    // 鼠标点击事件
    private mouseClickHandler(e : MouseEvent){
        const target = (e.target as HTMLDivElement)
        if(target.hasAttribute('key')){
            const [x,y] = target.getAttribute('key')!.split(",")
            const i = Number.parseInt(x)
            const j =  Number.parseInt(y)

            try{
                if(this.isFirstClick){
                    this.run()
                }
                const cnt = this.blocks.checkMine(i,j,this.isFirstClick)

                this.scorePanel.decreaseSaveBlock(cnt)
                this.isFirstClick = false

                if(this.scorePanel.Block === 0){
                    this.isAlive = false
                    alert(`您成功了！用时${this.scorePanel.TimeRec}`)
                }

            }catch(e : any){
                this.isAlive = false
                this.blocks.paintMines()
                alert(e.message)
            }

        }
    }

    private run(){
        if(this.isAlive){
            this.scorePanel.addTime()
            setTimeout(this.run.bind(this),1000)
        }else{
            this.minesArea.removeEventListener("click",this.bindMouseClickHandler!)
            // location.reload()
        }
    }
}

export default GameController