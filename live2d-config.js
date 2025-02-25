const live2d_config = {
    model: {
        jsonPath: "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
        alternativeModels: [
            "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
            "https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json",
            "https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json",
            "https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json"
        ]
    },
    display: {
        position: "right",
        width: 200,
        height: 400,
        hOffset: 10,
        vOffset: 0
    },
    mobile: {
        show: true,
        scale: 0.8
    },
    react: {
        opacityDefault: 1.0,
        opacityOnHover: 1.0
    },
    dialog: {
        enable: true,
        hitokoto: true,
        script: {
            'tap body': ['哎呀！别碰我！', '你在干什么呢？', '有什么可以帮到你吗？'],
            'tap face': ['人家已经不是小孩子了！', '你要干什么啦！', '喵喵喵？'],
            'welcome': ['欢迎来到ZYH的二次元知识库~', '哇，你好呀！', '今天也是元气满满的一天呢！'],
            'copy': ['你刚刚复制了什么呀？', '复制成功了吗？', '是不是在抄我说的话？'],
            'visibilitychange': ['你去哪里了？', '欢迎回来！', '我好想你啊~']
        }
    },
    theme: {
        color: '#FF6B9A',
        darkColor: '#FF8EB4'
    },
    custom: {
        specialDays: {
            '01-01': '新年快乐！又是充满希望的一年呢~',
            '02-14': '情人节快乐！巧克力吃了吗？',
            '03-08': '妇女节快乐！感谢所有的女性朋友！',
            '05-01': '劳动节快乐！辛苦了呢~',
            '10-01': '国庆节快乐！祖国万岁！',
            '12-24': '平安夜快乐！圣诞老人要来啦~',
            '12-25': '圣诞节快乐！收到礼物了吗？'
        }
    }
};

// live2d-widget配置
window.live2d_settings = {
    // 基本设置
    "modelAPI": "https://live2d.fghrsh.net/api/",  // 默认API
    "tipsMessage": "waifu-tips.json",              // 同目录下的提示语言文件
    "hitokotoAPI": "lwl12.com",                    // 一言API，可选 'lwl12.com', 'hitokoto.cn', 'jinrishici.com'(古诗词)
    
    // 模型设置
    "modelId": 1,                                  // 默认模型ID，可在API中查看可用的模型列表
    "modelTexturesId": 53,                         // 默认材质ID
    
    // 工具栏设置
    "showToolMenu": true,                          // 显示工具栏
    "canSwitchModel": true,                        // 显示模型切换按钮
    "canSwitchTextures": true,                     // 显示材质切换按钮
    "canSwitchHitokoto": true,                     // 显示一言切换按钮
    "canTakeScreenshot": true,                     // 显示看板娘截图按钮
    "canTurnToHomePage": true,                     // 显示返回首页按钮
    "canTurnToAboutPage": true,                    // 显示跳转关于页按钮
    
    // 样式设置
    "waifuSize": "280x250",                        // 看板娘大小，例如 '280x250', '600x535'
    "waifuTipsSize": "250x70",                     // 提示框大小，例如 '250x70', '570x150'
    "waifuFontSize": "12px",                       // 提示框字体，例如 '12px', '30px'
    "waifuToolFont": "14px",                       // 工具栏字体，例如 '14px', '36px'
    "waifuToolLine": "20px",                       // 工具栏行高，例如 '20px', '36px'
    "waifuToolTop": "0px",                         // 工具栏顶部边距，例如 '0px', '-60px'
    "waifuMinWidth": "768px",                      // 面页小于 指定宽度 隐藏看板娘，例如 'disable'(禁用), '768px'
    
    // 其他设置
    "homePageUrl": "/",                            // 主页地址，可选 'auto'(自动), '/'(首页), '/URL'(绝对地址), 'URL'(相对地址)
    "aboutPageUrl": "/about/",                     // 关于页地址，可选 'auto'(自动), '/about/'(关于页), '/URL'(绝对地址), 'URL'(相对地址)
    "screenshotCaptureName": "live2d.png",         // 看板娘截图文件名，例如 'live2d.png'
    
    // 开关设置
    "showHitokoto": true,                          // 显示一言
    "showF12Status": true,                         // 显示加载状态
    "showF12Message": false,                       // 显示看板娘消息
    "showF12OpenMsg": true,                        // 显示控制台打开提示
    "showCopyMessage": true,                       // 显示 复制内容 提示
    "showWelcomeMessage": true,                    // 显示进入面页欢迎词
    
    // 消息设置
    "copyMessage": "你都复制了些什么呀，转载请注明出处哦~",
    "welcomeMessage": "欢迎来到 %t ！"
};

// 检查是否已经加载了live2d-widget
if (typeof(initWidget) === 'function') {
    console.log('Live2D widget is ready to initialize');
    initWidget({
        waifuPath: window.live2d_settings.tipsMessage,
        apiPath: window.live2d_settings.modelAPI,
        cdnPath: window.live2d_settings.modelAPI
    });
} else {
    console.error('Live2D widget initialization function not found');
}
