# Mine-Game(扫雷)

## 一、开箱即食

```shell
// 初始化项目
cnpm init -y
// 下载依赖
cnpm i
// 运行
npm run start
```

## 二、模块说明

1. index.html是项目模板，index.ts是webpack入口
2. gameController.ts是游戏控制器，负责所需模块的初始化和运行调度，可以在这里修改方块的样式
3. block.ts负责完成地雷的位置的初始化及扫雷铺开的逻辑，可以在这里自定义自己的逻辑
