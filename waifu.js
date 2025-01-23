// 看板娘配置
window.live2d_settings = {
    modelId: 1,                  // 默认模型ID
    modelTexturesId: 1,         // 默认材质ID
    modelStorage: false,        // 不储存模型ID
    waifuSize: '280x250',      // 看板娘大小
    waifuTipsSize: '250x70',   // 提示框大小
    waifuFontSize: '12px',     // 提示框字体
    waifuToolFont: '14px',     // 工具栏字体
    waifuToolLine: '20px',     // 工具栏行高
    waifuToolTop: '0px',       // 工具栏顶部边距
    waifuMinWidth: '768px',    // 面页小于 指定宽度 隐藏看板娘，例如 'disable'(禁用), '768px'
    waifuEdgeSide: 'right:0',  // 看板娘贴边方向
    waifuDraggable: 'disable', // 拖拽样式，例如 'disable'(禁用), 'axis-x'(只能水平拖拽), 'unlimited'(自由拖拽)
    waifuDraggableRevert: true,// 松开鼠标还原拖拽位置
    homePageUrl: '/',          // 主页地址，可选 'auto'(自动), '{URL 网址}'
    aboutPageUrl: 'about/',    // 关于页地址, '{URL 网址}'
    screenshotCapture: true,   // 开启看板娘截图功能
    language: 'zh-CN',         // 语言设置，例如 'en-US'、'zh-CN'、'zh-TW'
    debug: false,              // 调试模式，可在控制台输出日志
    // 在 initModel 前添加自定义函数
    onModelLoad: () => {
        console.log('看板娘加载完成！');
    }
};

// 自定义提示语
window.live2d_custom_tips = {
    'mouseover': {
        'body': ['哎呀！别碰我！', '害羞ing...'],
        'face': ['人家已经不是小孩子了！', '你看到我的小熊了吗？'],
        'home': ['点击这里回到首页哦！', '回首页看看吧！'],
        'about': ['想了解我的主人吗？', '点击这里可以找到我的主人哦！'],
        'search': ['找什么呢？让我帮你！', '要找什么东西呢？']
    },
    'click': {
        'body': ['哎呀！别戳我！', '痒痒的～'],
        'face': ['人家的脸不可以随便摸的！', '不要这样啦！'],
    },
    'seasons': [
        { 'date': '01/01', 'text': ['新年快乐！', '又是一年呢～'] },
        { 'date': '02/14', 'text': ['情人节快乐！', '有人送你巧克力了吗？'] },
        { 'date': '12/24', 'text': ['平安夜快乐！', '圣诞老人要来了！'] },
        { 'date': '12/25', 'text': ['圣诞节快乐！', '收到礼物了吗？'] }
    ]
};
