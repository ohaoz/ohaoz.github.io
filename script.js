// 使用严格模式
(function() {
    "use strict";

    // 存储DOM元素的引用
    const elements = {
        preloader: null,
        progressElement: null,
        progressBar: null,
        navbar: null,
        articleCards: null,
        themeToggle: null,
        categoryLinks: null,
        footerLinks: null
    };

    // 初始化相关元素
    function initializeElements() {
        elements.preloader = document.querySelector('.preloader');
        updatePreloader(); // 更新预加载动画
        elements.progressBar = document.querySelector('.progress-bar');
        elements.navbar = document.querySelector('.navbar');
        elements.articleCards = document.querySelectorAll('.article-card');
        elements.themeToggle = document.querySelector('.theme-toggle');
        elements.categoryLinks = document.querySelectorAll('.category-nav a');
        elements.footerLinks = document.querySelectorAll('.footer-section a');
    }

    // 模拟加载进度
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12 + 3;
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
                addFadeInAnimations();
                createSakuraEffect(); // 添加樱花效果
            }, 500);
        }
    }

    // 创建樱花飘落效果
    function createSakuraEffect() {
        const sakuraContainer = document.createElement('div');
        sakuraContainer.className = 'sakura-container';
        document.body.appendChild(sakuraContainer);
        
        // 创建20个樱花
        for (let i = 0; i < 20; i++) {
            createSakura(sakuraContainer);
        }
        
        // 每隔3秒添加一个新樱花
        setInterval(() => {
            if (document.querySelectorAll('.sakura').length < 30) {
                createSakura(sakuraContainer);
            }
        }, 3000);
    }
    
    // 创建单个樱花
    function createSakura(container) {
        const sakura = document.createElement('div');
        sakura.className = 'sakura';
        
        // 随机大小
        const size = Math.random() * 15 + 15;
        sakura.style.width = `${size}px`;
        sakura.style.height = `${size}px`;
        
        // 随机位置
        sakura.style.left = `${Math.random() * 100}%`;
        
        // 随机透明度
        sakura.style.opacity = Math.random() * 0.6 + 0.4;
        
        // 随机动画持续时间
        const fallDuration = Math.random() * 10 + 10;
        const shakeDuration = Math.random() * 5 + 3;
        sakura.style.animationDuration = `${fallDuration}s, ${shakeDuration}s`;
        
        // 随机延迟
        const delay = Math.random() * 15;
        sakura.style.animationDelay = `${delay}s, ${delay}s`;
        
        container.appendChild(sakura);
        
        // 动画结束后移除
        setTimeout(() => {
            sakura.remove();
        }, (fallDuration + delay) * 1000);
    }

    // 修改预加载动画为可爱的二次元风格
    function updatePreloader() {
        const preloader = elements.preloader;
        if (!preloader) return;
        
        // 移除原有的蓝屏内容
        const bsodContainer = preloader.querySelector('.bsod-container');
        if (bsodContainer) {
            bsodContainer.remove();
        }
        
        // 创建可爱的加载动画
        const kawaiiLoader = document.createElement('div');
        kawaiiLoader.className = 'kawaii-loader';
        
        const face = document.createElement('div');
        face.className = 'kawaii-face';
        
        const leftEye = document.createElement('div');
        leftEye.className = 'kawaii-eye left';
        
        const rightEye = document.createElement('div');
        rightEye.className = 'kawaii-eye right';
        
        const mouth = document.createElement('div');
        mouth.className = 'kawaii-mouth';
        
        const leftBlush = document.createElement('div');
        leftBlush.className = 'kawaii-blush left';
        
        const rightBlush = document.createElement('div');
        rightBlush.className = 'kawaii-blush right';
        
        face.appendChild(leftEye);
        face.appendChild(rightEye);
        face.appendChild(mouth);
        face.appendChild(leftBlush);
        face.appendChild(rightBlush);
        
        kawaiiLoader.appendChild(face);
        
        const loadingText = document.createElement('div');
        loadingText.style.textAlign = 'center';
        loadingText.style.marginTop = '20px';
        loadingText.style.color = '#FF6B9A';
        loadingText.style.fontWeight = 'bold';
        loadingText.style.fontSize = '1.2rem';
        loadingText.innerHTML = '加载中... <span class="progress">0</span>%';
        
        kawaiiLoader.appendChild(loadingText);
        
        // 更新进度元素引用
        elements.progressElement = loadingText.querySelector('.progress');
        
        // 添加到预加载器
        preloader.style.background = '#FFEEF5';
        preloader.appendChild(kawaiiLoader);
    }

    // 初始化滚动效果，包括更新进度条和导航栏显示/隐藏
    function initializeScrollEffects() {
        let lastScrollTop = 0;
        const navbar = elements.navbar;
        const threshold = 100;
        const scrollThrottleDelay = 10;
        let lastScrollTime = 0;
        
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime < scrollThrottleDelay) return;
            lastScrollTime = now;
            
            updateProgressBar();

            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 导航栏滑动效果
            if (currentScrollTop > lastScrollTop && currentScrollTop > threshold) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollTop = currentScrollTop;
            
            // 检查是否需要显示"返回顶部"按钮
            checkScrollToTopButton(currentScrollTop);
            
            // 滚动时激活淡入动画
            animateElementsOnScroll();
        });
    }

    // 添加淡入动画到元素
    function addFadeInAnimations() {
        const animatedElements = document.querySelectorAll('.article-card, .category-nav, .footer-section');
        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.animationDelay = `${index * 0.15}s`;
        });
    }

    // 滚动时触发元素动画
    function animateElementsOnScroll() {
        const animatableElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        const windowHeight = window.innerHeight;
        
        animatableElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated');
                element.classList.add('fade-in');
            }
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

    // 检查是否需要显示返回顶部按钮
    function checkScrollToTopButton(scrollPosition) {
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (!scrollTopBtn) return;
        
        if (scrollPosition > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    // 创建返回顶部按钮
    function createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-btn ripple';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', '返回顶部');
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollBtn);
    }

    // 添加暗色模式切换功能
    function initializeDarkMode() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const themeText = themeToggle.querySelector('span');
        const themeIcon = themeToggle.querySelector('i');
        
        // 移除涟漪效果，添加自定义点击效果
        themeToggle.classList.remove('ripple');
        themeToggle.addEventListener('click', function() {
            // 添加简单的缩放动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
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
            
            // 添加主题切换动画
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 1000);
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
                
                // 减小旋转角度，使效果更微妙
                const rotateX = (y - centerY) / 30;
                const rotateY = -(x - centerX) / 30;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // 添加动态阴影效果
                const shadowX = (x - centerX) / 20;
                const shadowY = (y - centerY) / 20;
                card.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.1)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
                card.style.boxShadow = 'var(--card-shadow)';
            });
        });
    }

    // 添加涟漪效果到按钮和链接
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.ripple');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // 添加导航栏交互动画
    function initializeNavAnimation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.classList.add('ripple');
            
            link.addEventListener('mouseenter', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                link.style.setProperty('--x', `${x}px`);
                link.style.setProperty('--y', `${y}px`);
            });
        });
        
        // 添加呼吸效果到分类导航链接
        const categoryLinks = document.querySelectorAll('.category-nav a');
        categoryLinks.forEach(link => {
            link.classList.add('ripple');
        });
    }

    // 添加懒加载功能
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }

    // 初始化Live2D相关配置和页面切换效果
    function initializeLive2D() {
        if (window.loadLive2D) {
            window.loadLive2D();
        }

        // 添加页面切换动画
        if (!document.querySelector('.page-transition')) {
            const pageTransition = document.createElement('div');
            pageTransition.className = 'page-transition';
            document.body.appendChild(pageTransition);
        }

        document.querySelectorAll('a:not([href^="#"])').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
                    e.preventDefault();
                    const pageTransition = document.querySelector('.page-transition');
                    pageTransition.classList.add('active');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600);
                }
            });
        });

        // 添加滚动提示（如果存在.hero元素）
        if (document.querySelector('.hero') && !document.querySelector('.scroll-indicator')) {
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
        createScrollToTopButton();
        initializeCardEffects();
        initializeNavAnimation();
        addRippleEffect();
        initLazyLoading();

        // 初始化Live2D及页面切换效果
        initializeLive2D();
        
        // 添加跟随鼠标的装饰效果
        if (window.innerWidth > 768) {
            addMouseFollowEffect();
        }
    });
    
    // 添加鼠标跟随效果
    function addMouseFollowEffect() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        // 鼠标悬停在链接上时的效果
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-expanded');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-expanded');
            });
        });
    }
})();
