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
        document.querySelector('#waifu').classList.remove('hidden');
        showMessage('哇，你好呀！欢迎来到ZYH的二次元知识库~', 4000);
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

// 看板娘实现
(function() {
    // 获取看板娘元素
    const waifu = document.getElementById('waifu');
    const live2d = document.getElementById('live2d');
    const waifuTips = document.getElementById('waifu-tips');
    const waifuTool = document.getElementById('waifu-tool');
    const waifuToggle = document.getElementById('waifu-toggle');
    
    // 是否已经初始化
    let isInitialized = false;
    
    // 显示消息
    function showMessage(text, timeout) {
        if (!waifuTips) return;
        
        waifuTips.innerHTML = text;
        waifuTips.classList.add('active');
        
        clearTimeout(waifuTips.messageTimer);
        waifuTips.messageTimer = setTimeout(() => {
            waifuTips.classList.remove('active');
        }, timeout || 3000);
    }
    
    // 随机获取数组中的一个元素
    function randomSelection(obj) {
        return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
    }
    
    // 工具按钮点击事件
    function initToolbar() {
        const tools = waifuTool.querySelectorAll('span');
        
        // 按钮功能：对话、截图、关于、关闭
        tools[0].addEventListener('click', () => {
            const messages = [
                '你想听点什么呢？',
                '我可以陪你聊天哦~',
                '有什么想告诉我的吗？',
                '今天过得怎么样？',
                '我喜欢你的博客设计！'
            ];
            showMessage(randomSelection(messages), 4000);
        });
        
        // 截图功能
        tools[1].addEventListener('click', () => {
            showMessage('照好了嘛，是不是很可爱呢？', 4000);
            Live2D.captureName = 'waifu.png';
            Live2D.captureFrame = true;
        });
        
        // 关于信息
        tools[2].addEventListener('click', () => {
            const aboutText = '我是这个博客的守护者，希望能陪伴你度过愉快的阅读时光！';
            showMessage(aboutText, 6000);
        });
        
        // 隐藏看板娘
        tools[3].addEventListener('click', () => {
            showMessage('下次再见啦~', 2000);
            setTimeout(() => {
                waifu.classList.add('hidden');
                waifuToggle.classList.add('visible');
            }, 2000);
        });
    }
    
    // 添加鼠标事件
    function initMouseEvents() {
        // 鼠标移动
        document.addEventListener('mousemove', throttle(e => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // 判断鼠标是否在看板娘附近
            const rect = live2d.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 计算鼠标和看板娘中心的距离
            const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
            
            // 当距离小于200px时，让看板娘"注视"鼠标
            if (distance < 200) {
                const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
                const x = Math.cos(angle) * 10;
                const y = Math.sin(angle) * 10;
                
                live2d.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                live2d.style.transform = 'translate(0, 0)';
            }
        }, 100));
        
        // 鼠标点击
        live2d.addEventListener('click', () => {
            const messages = window.live2d_custom_tips.click.body;
            showMessage(randomSelection(messages), 4000);
        });
    }
    
    // 节流函数，限制函数执行频率
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func(...args);
        };
    }
    
    // 显示季节性消息
    function showSeasonalMessage() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const formatDate = `${month < 10 ? '0' + month : month}/${date < 10 ? '0' + date : date}`;
        
        const seasonalTips = window.live2d_custom_tips.seasons;
        for (let i = 0; i < seasonalTips.length; i++) {
            if (formatDate === seasonalTips[i].date) {
                showMessage(randomSelection(seasonalTips[i].text), 6000);
                return;
            }
        }
    }
    
    // 初始化看板娘
    function initWaifu() {
        if (isInitialized) return;
        isInitialized = true;
        
        // 检查是否支持WebGL
        if (!window.WebGLRenderingContext) {
            console.error('您的浏览器不支持WebGL，无法显示看板娘');
            return;
        }
        
        // 初始化工具栏
        initToolbar();
        
        // 初始化鼠标事件
        initMouseEvents();
        
        // 定时显示随机消息
        setInterval(() => {
            const messages = [
                '好无聊啊，陪我聊天吧！',
                '你知道吗？樱花的花期只有一周左右呢~',
                '主人说要好好学习，天天向上！',
                '技术改变世界，代码改变生活~',
                '听说二次元的世界没有Bug...',
                '我的朋友说，优秀的代码就像优美的诗篇~'
            ];
            
            if (Math.random() < 0.2) {
                showMessage(randomSelection(messages), 4000);
            }
        }, 30000);
        
        // 检查季节性消息
        showSeasonalMessage();
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                showMessage('哇，你回来啦！', 2000);
            }
        });
        
        // 适应主题变化
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme');
                    showMessage(`切换到${theme === 'dark' ? '暗色' : '亮色'}主题啦~`, 3000);
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }
    
    // 切换看板娘显示/隐藏
    if (waifuToggle) {
        waifuToggle.addEventListener('click', () => {
            waifu.classList.remove('hidden');
            waifuToggle.classList.remove('visible');
            
            if (!isInitialized) {
                initWaifu();
            }
            
            showMessage('哇，你又来找我啦！', 4000);
        });
    }
    
    // 加载Live2D模型
    window.loadLive2D = function() {
        const config = window.live2d_config || {};
        
        // 加载模型
        const modelPath = config.model && config.model.jsonPath 
            ? config.model.jsonPath 
            : 'https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json';
        
        loadlive2d('live2d', modelPath);
        
        // 初始化看板娘功能
        initWaifu();
    };
})();
