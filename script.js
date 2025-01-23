// 立即执行函数确保变量作用域隔离
(function() {
    // 初始化状态管理
    const state = {
        initialized: false,
        loadingStarted: false,
        resourcesLoaded: false,
        totalResources: 0,
        loadedResources: 0,
        progressValue: 0
    };

    // DOM元素引用
    let elements = {
        progressElement: null,
        preloader: null,
        contentWrapper: null,
        backToTop: null,
        progressBar: null,
        qrcodeElement: null
    };

    // 初始化DOM元素引用
    function initializeElements() {
        elements = {
            progressElement: document.querySelector('.progress'),
            preloader: document.querySelector('.preloader'),
            contentWrapper: document.querySelector('.content-wrapper'),
            backToTop: document.querySelector('.back-to-top'),
            progressBar: document.querySelector('.progress-bar'),
            qrcodeElement: document.getElementById('qrcode')
        };

        // 确保预加载器可见且内容隐藏
        if (elements.preloader) {
            elements.preloader.style.display = 'block';
            elements.preloader.style.opacity = '1';
        }
        if (elements.contentWrapper) {
            elements.contentWrapper.style.opacity = '0';
            elements.contentWrapper.style.transform = 'translateY(20px)';
            elements.contentWrapper.style.display = 'none';
        }
    }

    // 初始化QR码
    function initializeQRCode() {
        if (elements.qrcodeElement && typeof QRCode !== 'undefined') {
            try {
                new QRCode(elements.qrcodeElement, {
                    text: window.location.href,
                    width: 128,
                    height: 128,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            } catch (error) {
                console.warn('QR码初始化失败:', error);
            }
        }
    }

    // 监听资源加载
    function trackResourceLoading() {
        if (state.loadingStarted) return;
        state.loadingStarted = true;

        // 立即设置初始进度
        updateProgressValue(30);

        // 获取所有需要加载的资源
        const resources = Array.from(document.querySelectorAll(
            'img[src], video[src], audio[src], script[src], link[rel="stylesheet"]'
        )).filter(resource => {
            return !(resource.complete || resource.readyState === 4);
        });

        state.totalResources = resources.length || 1;
        
        // 如果没有需要加载的资源，直接完成
        if (resources.length === 0) {
            state.resourcesLoaded = true;
            updateProgressValue(100);
            finishLoading();
            return;
        }

        // 设置一个计数器来跟踪加载失败的资源
        let failedResources = 0;

        resources.forEach(resource => {
            const loadHandler = () => {
                state.loadedResources++;
                const progress = Math.min(100, (state.loadedResources / state.totalResources) * 70 + 30);
                updateProgressValue(progress);
                
                // 检查是否所有资源都已处理完
                if (state.loadedResources + failedResources === state.totalResources) {
                    state.resourcesLoaded = true;
                    finishLoading();
                }
            };

            const errorHandler = () => {
                failedResources++;
                console.warn('资源加载失败:', resource.src || resource.href);
                
                // 即使加载失败也继续处理
                if (state.loadedResources + failedResources === state.totalResources) {
                    state.resourcesLoaded = true;
                    finishLoading();
                }
            };

            resource.addEventListener('load', loadHandler, { once: true });
            resource.addEventListener('error', errorHandler, { once: true });
        });

        // 启动加载超时处理
        setupLoadingTimeout();
    }

    // 更新进度值
    function updateProgressValue(targetProgress) {
        if (state.progressValue >= targetProgress) return;

        const animate = () => {
            if (state.progressValue >= targetProgress) {
                if (targetProgress >= 100) {
                    state.resourcesLoaded = true;
                    finishLoading();
                }
                return;
            }

            // Increase the increment step for faster progress
            state.progressValue += Math.min(5, targetProgress - state.progressValue);
            
            if (elements.progressElement) {
                elements.progressElement.textContent = Math.floor(state.progressValue);
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // 完成加载过程
    function finishLoading() {
        if (!elements.preloader || !elements.contentWrapper) return;
        
        // 确保内容已准备好
        elements.contentWrapper.style.display = 'block';
        elements.contentWrapper.style.opacity = '0';
        
        // 强制重排以确保过渡效果生效
        void elements.contentWrapper.offsetHeight;
        
        // 添加过渡效果
        requestAnimationFrame(() => {
            // 先隐藏预加载器
            elements.preloader.classList.add('fade-out');
            
            // 显示内容
            elements.contentWrapper.style.opacity = '1';
            elements.contentWrapper.style.transform = 'translateY(0)';
            
            // 确保预加载器完全隐藏
            setTimeout(() => {
                elements.preloader.style.display = 'none';
                // 初始化其他功能
                initializeQRCode();
                setupEventListeners();
            }, 300); // 与 preloader 的 transition 时间匹配
        });
    }

    // 设置加载超时
    function setupLoadingTimeout() {
        setTimeout(() => {
            if (!state.resourcesLoaded) {
                console.warn('加载超时，强制完成');
                state.resourcesLoaded = true;
                state.loadedResources = state.totalResources;
                updateProgressValue(100);
                finishLoading();
            }
        }, 5000); // 减少超时时间到5秒
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 滚动事件处理
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 主题切换
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-moon');
                    icon.classList.toggle('fa-sun');
                }
            });
        }

        // 返回顶部按钮
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // 滚动处理
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 返回顶部按钮显示/隐藏
        if (elements.backToTop) {
            elements.backToTop.style.display = scrollTop > 300 ? 'block' : 'none';
        }

        // 进度条更新
        if (elements.progressBar) {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / height) * 100;
            elements.progressBar.style.width = `${progress}%`;
        }
    }

    // 延迟加载图片
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级处理
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // 主初始化函数
    function initialize() {
        if (state.initialized) return;
        state.initialized = true;

        initializeElements();
        trackResourceLoading();
        lazyLoadImages();
    }

    // 确保在DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 确保在window.load时也能正确初始化
    window.addEventListener('load', () => {
        if (!state.initialized) {
            initialize();
        }
    });
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
