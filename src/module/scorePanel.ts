class ScorePanel{
    timeRecElem: HTMLElement
    saveBlockElem: HTMLElement

    time: number
    saveBlocks: number

    constructor(startTime: number = 0,totalBolcks: number = 480,mines: number = 99){
        this.timeRecElem = document.querySelector('#timeRec')!
        this.saveBlockElem = document.querySelector('#saveBlock')!

        this.time = startTime
        this.saveBlocks = totalBolcks - mines

        this.init()
    }

    private init(){
        this.timeRecElem.innerHTML = this.time + ""
        this.saveBlockElem.innerHTML = this.saveBlocks + ""
    }

    addTime() : boolean{

        this.timeRecElem.innerHTML = ++this.time + ""

        return true
    }

    decreaseSaveBlock(value: number = 0){
        this.saveBlocks -= value
        this.saveBlockElem.innerHTML = this.saveBlocks + ""
    }

    get Block(){
        return this.saveBlocks
    }

    get TimeRec(){
        return this.time
    }
}

export default ScorePanel