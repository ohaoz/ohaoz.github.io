// 使用严格模式
(function() {
    "use strict";

    // 存储DOM元素的引用
    const elements = {
        preloader: null,
        progressElement: null,
        progressBar: null,
        navbar: null
    };

    // 初始化相关元素
    function initializeElements() {
        elements.preloader = document.querySelector('.preloader');
        elements.progressElement = document.querySelector('.progress');
        elements.progressBar = document.querySelector('.progress-bar');
        elements.navbar = document.querySelector('.navbar');
    }

    // 模拟加载进度
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(showContent, 500);
            }
            if (elements.progressElement) {
                elements.progressElement.textContent = Math.floor(progress);
            }
        }, 200);
    }

    // 显示主要内容
    function showContent() {
        if (elements.preloader) {
            elements.preloader.classList.add('fade-out');
            setTimeout(() => {
                elements.preloader.style.display = 'none';
                document.body.style.overflow = 'visible';
                initializeScrollEffects();
            }, 500);
        }
    }

    // 初始化滚动效果，包括更新进度条和导航栏显示/隐藏
    function initializeScrollEffects() {
        let lastScrollTop = 0;
        const navbar = elements.navbar;
        const threshold = 50;
        if (!navbar) {
            return;
        }

        window.addEventListener('scroll', () => {
            updateProgressBar();

            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > lastScrollTop && currentScrollTop > threshold) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollTop = currentScrollTop;
        });
    }

    // 更新阅读进度条
    function updateProgressBar() {
        if (elements.progressBar) {
            const winScroll = window.pageYOffset || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            elements.progressBar.style.transform = `scaleX(${scrolled / 100})`;
        }
    }

    // 添加暗色模式切换功能
    function initializeDarkMode() {
        const themeToggle = document.querySelector('.theme-toggle');
        const themeText = themeToggle.querySelector('span');
        const themeIcon = themeToggle.querySelector('i');
        
        // 恢复保存的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeUI(savedTheme);
        }

        // 检查系统主题偏好
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (!savedTheme && prefersDarkScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeUI('dark');
        }

        // 主题切换处理函数
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        }

        // 更新UI显示
        function updateThemeUI(theme) {
            if (theme === 'dark') {
                themeText.textContent = '亮色模式';
                themeIcon.className = 'fas fa-sun';
            } else {
                themeText.textContent = '暗色模式';
                themeIcon.className = 'fas fa-moon';
            }
        }

        // 绑定点击事件
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 添加平滑滚动效果
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 添加文章卡片悬浮效果
    function initializeCardEffects() {
        const cards = document.querySelectorAll('.article-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = -(x - centerX) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
            });
        });
    }

    // 添加导航栏链接动画
    function initializeNavAnimation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                link.style.setProperty('--x', `${x}px`);
                link.style.setProperty('--y', `${y}px`);
            });
        });
    }

    // 初始化Live2D相关配置和页面切换效果
    function initializeLive2D() {
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

        localStorage.setItem('modelId', '7');
        localStorage.setItem('modelTexturesId', '1');
        window.LIVE2D_CONFIG = {
            "model": {
                "jsonPath": "https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json"
            },
            "display": {
                "superSample": 2,
                "width": 150,
                "height": 300,
                "position": "right",
                "hOffset": 0,
                "vOffset": -20
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

        // 添加滚动提示（如果存在.hero元素）
        if (document.querySelector('.hero')) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            document.querySelector('.hero').appendChild(scrollIndicator);
        }
    }

    // 合并所有初始化操作于DOMContentLoaded事件
    document.addEventListener('DOMContentLoaded', () => {
        initializeElements();
        simulateLoading();
        initializeDarkMode();
        initializeSmoothScroll();
        initializeCardEffects();
        initializeNavAnimation();

        // 初始化Live2D及页面切换效果
        initializeLive2D();
    });
})();
