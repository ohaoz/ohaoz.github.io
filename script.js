// 立即执行函数
(function() {
    // DOM 元素引用
    const elements = {
        preloader: null,
        contentWrapper: null,
        progressElement: null,
        qrcodeElement: null,
        backToTop: null,
        progressBar: null
    };

    let isUpdatingProgress = false;

    // 初始化 DOM 元素引用
    function initializeElements() {
        console.log('开始初始化DOM元素...');
        elements.preloader = document.querySelector('.preloader');
        elements.contentWrapper = document.querySelector('.content-wrapper');
        elements.progressElement = document.querySelector('.error-text .progress');
        elements.qrcodeElement = document.getElementById('qrcode');
        elements.backToTop = document.querySelector('.back-to-top');
        elements.progressBar = document.querySelector('.progress-bar');

        // 设置初始样式
        if (elements.contentWrapper) {
            elements.contentWrapper.style.display = 'none';
        }

        if (elements.preloader) {
            elements.preloader.style.display = 'flex';
        }

        console.log('DOM元素状态：', {
            preloader: !!elements.preloader,
            contentWrapper: !!elements.contentWrapper,
            progressElement: !!elements.progressElement,
            qrcodeElement: !!elements.qrcodeElement,
            backToTop: !!elements.backToTop,
            progressBar: !!elements.progressBar
        });

        if (!elements.preloader || !elements.contentWrapper) {
            console.error('找不到必要的DOM元素：preloader 或 contentWrapper');
            return false;
        }

        // 确保进度显示元素存在
        if (!elements.progressElement) {
            console.error('无法找到进度显示元素 .error-text .progress');
            return false;
        }

        return true;
    }

    // 模拟加载进度
    function simulateLoading() {
        if (isUpdatingProgress) return;
        isUpdatingProgress = true;
        let progress = 0;
        
        function updateProgress() {
            if (!elements.progressElement) {
                console.error('进度元素不存在，停止更新');
                return;
            }

            progress += Math.random() * 3;
            if (progress > 100) progress = 100;
            
            elements.progressElement.textContent = Math.round(progress) + '%';
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                isUpdatingProgress = false;
                showContent();
            }
        }

        requestAnimationFrame(updateProgress);
    }

    // 显示主内容
    function showContent() {
        if (!elements.contentWrapper || !elements.preloader) {
            console.error('无法显示主内容：找不到必要的DOM元素');
            return;
        }

        // 显示主内容
        elements.contentWrapper.style.display = 'block';
        elements.contentWrapper.style.opacity = '0';

        // 使用 requestAnimationFrame 确保样式已应用
        requestAnimationFrame(() => {
            // 淡出预加载器
            elements.preloader.style.opacity = '0';
            elements.preloader.style.visibility = 'hidden';

            // 淡入主内容
            elements.contentWrapper.style.opacity = '1';
            elements.contentWrapper.style.visibility = 'visible';

            // 延迟后移除预加载器
            setTimeout(() => {
                elements.preloader.style.display = 'none';
                // 初始化其他功能
                initializeFeatures();
            }, 500);
        });
    }

    // 初始化其他功能
    function initializeFeatures() {
        // 生成二维码
        if (elements.qrcodeElement) {
            new QRCode(elements.qrcodeElement, {
                text: window.location.href,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        // 返回顶部按钮
        if (elements.backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    elements.backToTop.style.display = 'block';
                } else {
                    elements.backToTop.style.display = 'none';
                }
            });

            elements.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // 阅读进度条
        if (elements.progressBar) {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                elements.progressBar.style.width = scrolled + '%';
            });
        }
    }

    // 主初始化函数
    function initialize() {
        console.log('开始初始化...');
        if (initializeElements()) {
            console.log('DOM元素初始化成功，开始模拟加载...');
            simulateLoading();
        } else {
            console.error('初始化失败');
            // 如果初始化失败，直接显示内容
            if (elements.contentWrapper) {
                elements.contentWrapper.style.display = 'block';
                elements.contentWrapper.style.visibility = 'visible';
                elements.contentWrapper.style.opacity = '1';
            }
            if (elements.preloader) {
                elements.preloader.style.display = 'none';
            }
        }
    }

    // 启动初始化
    document.addEventListener('DOMContentLoaded', initialize);
})();

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // Live2D看板娘配置
    localStorage.setItem('waifu-tips', JSON.stringify({
        "mouseover": [
            {"selector": "#live2d", "text": ["干嘛呢你，快把手拿开～～", "鼠…鼠标放错地方了！"]},
            {"selector": ".fa-comment", "text": ["猜猜我要说些什么？", "我从青蛙王子那里听到了不少人生经验。"]},
            {"selector": ".fa-user-circle", "text": ["你想看看我的小伙伴吗？", "这里记录着我搜集的朋友们。"]},
            {"selector": ".fa-street-view", "text": ["喜欢换装游戏吗？", "这里是和服咖啡制服任你选～"]},
            {"selector": ".fa-camera-retro", "text": ["你要给我拍照呀？一二三～茄子～", "要不，我们来合影吧！"]},
            {"selector": ".fa-info-circle", "text": ["想要知道更多关于我的事么？", "这里有一些关于我的小秘密哦！"]},
            {"selector": ".fa-times", "text": ["到了说再见的时候了吗？", "呜呜 QAQ 后会有期……", "不要抛弃我呀……"]}
        ],
        "click": [
            {"selector": "#live2d", "text": ["是…是不小心碰到了吧？", "萝莉控是什么呀？", "你看到我的小熊了吗？", "再摸的话我可要报警了！⌇●﹏●⌇", "110吗，这里有个变态一直在摸我(ó﹏ò｡)"]},
            {"selector": ".fa-comment", "text": ["猜猜我要说些什么？", "我从青蛙王子那里听到了不少人生经验。"]},
            {"selector": ".fa-user-circle", "text": ["我的朋友们都在这里哦！", "这里是我的朋友录～"]},
            {"selector": ".fa-street-view", "text": ["我的衣橱里有什么呢？", "想看看我的新衣服吗？"]},
            {"selector": ".fa-camera-retro", "text": ["你要给我拍照呀？茄子～", "要不，我们来合影吧！"]},
            {"selector": ".fa-info-circle", "text": ["想知道我的小秘密吗？", "这里有一些有趣的故事哦！"]},
            {"selector": ".fa-times", "text": ["就要说再见了吗？", "呜呜 QAQ 后会有期……", "不要抛弃我呀……"]}
        ]
    }));

    // 配置看板娘参数
    localStorage.setItem('modelId', '7');
    localStorage.setItem('modelTexturesId', '1');
    window.LIVE2D_CONFIG = {
        "model": {
            "jsonPath": "https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
        },
        "display": {
            "superSample": 2,
            "width": 150,
            "height": 300,
            "position": "right",
            "hOffset": 0,
            "vOffset": -20,
        },
        "mobile": {
            "show": true,
            "scale": 0.5
        },
        "react": {
            "opacity": 0.7
        },
        "dialog": {
            "enable": true,
            "hitokoto": true
        },
        "dev": {
            "border": false
        }
    };

    // 添加页面切换动画
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);

    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('javascript:')) {
                e.preventDefault();
                pageTransition.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });

    // 添加滚动提示
    if (document.querySelector('.hero')) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        document.querySelector('.hero').appendChild(scrollIndicator);
    }
});
