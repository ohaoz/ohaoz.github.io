const live2d_config = {
    model: {
        jsonPath: "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
    },
    display: {
        position: "right",
        width: 150,
        height: 300,
        hOffset: 0,
        vOffset: -20
    },
    mobile: {
        show: true,
        scale: 0.8
    },
    react: {
        opacityDefault: 0.7,
        opacityOnHover: 0.2
    },
    dialog: {
        enable: true,
        script: {
            'tap body': '哎呀！别碰我！',
            'tap face': '人家已经不是小孩子了！',
            'welcome': '欢迎来到我的博客~'
        }
    }
};
