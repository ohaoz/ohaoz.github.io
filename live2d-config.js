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
