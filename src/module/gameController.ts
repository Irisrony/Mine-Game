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
    // 刷新按钮
    reloadButton: HTMLElement
    // 暂停按钮
    stopButton: HTMLElement
    // 继续按钮
    goOnButton: HTMLElement
    
    // 游戏是否结束
    isAlive: boolean = true

    // 是否是第一次点击
    isFirstClick: boolean = true

    // 是否继续进行
    isOn: boolean = true

    // 绑定this的鼠标监听函数
    bindMouseClickHandler: (e: MouseEvent) => void

    constructor(){
        this.blocks = new Block()
        this.scorePanel = new ScorePanel(startTime,totalBolcks,mines)
        this.minesArea = document.querySelector("#stage")!
        this.reloadButton = document.querySelector("#reload")!
        this.stopButton = document.querySelector("#stop")!
        this.goOnButton = document.querySelector("#go_on")!

        this.bindMouseClickHandler = this.mouseClickHandler.bind(this)

        this.init()
    }

    private init(){
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

        // 绑定扫雷区域鼠标单击事件
        this.addMinesListener()

        // 绑定刷新按钮点击事件
        this.reloadButton.addEventListener("click",this.reloadButtonClickHandler.bind(this))

        // 绑定暂停按钮点击事件
        this.stopButton.addEventListener("click",this.stopButtonClickHandler.bind(this))

        // 绑定继续按钮点击事件
        this.goOnButton.addEventListener("click",this.goOnButtonClickHandler.bind(this))

    }

    // 扫雷区域鼠标点击事件
    private mouseClickHandler(e : MouseEvent){
        const target = (e.target as HTMLDivElement)
        if(target.hasAttribute('key')){
            const [x,y] = target.getAttribute('key')!.split(",")
            const i = Number.parseInt(x)
            const j =  Number.parseInt(y)

            try{
                // 首次点击后才开始运行
                if(this.isFirstClick){
                    this.run()
                }
                // 翻开的格子数
                const cnt = this.blocks.checkMine(i,j,this.isFirstClick)

                // 减少安全格数量
                this.scorePanel.decreaseSaveBlock(cnt)
                this.isFirstClick = false

                if(this.scorePanel.Block === 0){
                    this.isAlive = false
                    this.blocks.paintMines()
                    alert(`您成功了！用时${this.scorePanel.TimeRec}s!`)
                }

            }catch(e : any){
                this.isAlive = false
                this.blocks.paintMines()
                alert(e.message)
            }

        }
    }

    // 计时器运行
    private run(){
        // 游戏正常进行
        if(this.isAlive){
            // 游戏继续
            if(this.isOn){
                this.scorePanel.addTime()
            }
            setTimeout(this.run.bind(this),1000)
        }else{ // 游戏结束
            this.removeMinesListener()
        }
    }

    // 移除扫雷区域监听事件
    private removeMinesListener(){
        this.minesArea.removeEventListener("click",this.bindMouseClickHandler!)
    }

    // 添加扫雷区域监听事件
    private addMinesListener(){
        this.minesArea.addEventListener("click",this.bindMouseClickHandler!)
    }

    // 刷新按钮鼠标点击事件
    private reloadButtonClickHandler(e: MouseEvent){        
        location.reload()
    }

    // 暂停按钮鼠标单击事件
    private stopButtonClickHandler(e: MouseEvent){
        this.isOn = false
        this.removeMinesListener()
    }

    // 继续按钮鼠标点击事件
    private goOnButtonClickHandler(e: MouseEvent){
        this.isOn = true
        this.addMinesListener()
    }
}

export default GameController