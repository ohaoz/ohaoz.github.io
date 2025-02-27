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
        
        // 检测是否为移动设备并添加标记
        if (window.innerWidth <= 768 || navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.add('is-desktop');
        }
        
        // 监听窗口大小变化，更新设备类型标记
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                document.body.classList.add('is-mobile');
                document.body.classList.remove('is-desktop');
            } else {
                document.body.classList.add('is-desktop');
                document.body.classList.remove('is-mobile');
            }
        });
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
        // 检查是否为移动设备，如果是则不创建樱花效果
        if (window.innerWidth <= 768 || document.body.classList.contains('is-mobile')) {
            console.log('移动设备上禁用樱花效果以节省内存');
            return;
        }
        
        const sakuraContainer = document.createElement('div');
        sakuraContainer.className = 'sakura-container';
        document.body.appendChild(sakuraContainer);
        
        // 减少初始樱花数量从20个到10个
        for (let i = 0; i < 10; i++) {
            createSakura(sakuraContainer);
        }
        
        // 减少樱花生成频率和最大数量
        // 从每3秒一个改为每5秒一个，最大数量从30个减少到15个
        let sakuraInterval = setInterval(() => {
            if (document.querySelectorAll('.sakura').length < 15) {
                createSakura(sakuraContainer);
            }
            
            // 如果用户切换到了其他标签页，暂停创建新樱花
            if (document.hidden) {
                clearInterval(sakuraInterval);
                // 当用户回到页面时重新启动
                document.addEventListener('visibilitychange', function onVisibilityChange() {
                    if (!document.hidden) {
                        sakuraInterval = setInterval(() => {
                            if (document.querySelectorAll('.sakura').length < 15) {
                                createSakura(sakuraContainer);
                            }
                        }, 5000);
                        document.removeEventListener('visibilitychange', onVisibilityChange);
                    }
                });
            }
        }, 5000);
        
        // 添加页面可见性变化监听，在页面不可见时清除所有樱花以节省内存
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面不可见时，移除所有樱花
                const sakuras = document.querySelectorAll('.sakura');
                sakuras.forEach(sakura => sakura.remove());
            } else {
                // 页面重新可见时，重新创建几个樱花
                if (document.querySelectorAll('.sakura').length === 0) {
                    for (let i = 0; i < 5; i++) {
                        createSakura(sakuraContainer);
                    }
                }
            }
        });
    }
    
    // 创建单个樱花
    function createSakura(container) {
        const sakura = document.createElement('div');
        sakura.className = 'sakura';
        
        // 随机大小
        const size = Math.random() * 15 + 10; // 稍微减小樱花大小
        sakura.style.width = `${size}px`;
        sakura.style.height = `${size}px`;
        
        // 随机位置
        sakura.style.left = `${Math.random() * 100}%`;
        
        // 随机透明度
        sakura.style.opacity = Math.random() * 0.6 + 0.4;
        
        // 随机动画持续时间
        const fallDuration = Math.random() * 8 + 8; // 减少最大动画时间
        const shakeDuration = Math.random() * 4 + 2;
        sakura.style.animationDuration = `${fallDuration}s, ${shakeDuration}s`;
        
        // 随机延迟
        const delay = Math.random() * 10; // 减少最大延迟时间
        sakura.style.animationDelay = `${delay}s, ${delay}s`;
        
        container.appendChild(sakura);
        
        // 动画结束后移除
        setTimeout(() => {
            if (sakura.parentNode) {
                sakura.remove();
            }
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
        // 先检查是否已存在按钮，避免重复创建
        if (document.querySelector('.scroll-top-btn')) {
            return;
        }
        
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-btn ripple';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', '返回顶部');
        
        // 使用更强制的样式设置方式
        scrollBtn.style.cssText = `
            position: fixed !important;
            bottom: 2rem !important;
            right: 2rem !important;
            left: auto !important;
            top: auto !important;
            opacity: 0;
            z-index: 9999;
        `;
        
        // 确保按钮添加到body的最后位置
        document.body.appendChild(scrollBtn);
        
        // 确保按钮在任何其他元素之后添加
        setTimeout(() => {
            // 再次确认按钮在DOM中的位置，如果不是在body下，重新添加
            if (scrollBtn.parentElement !== document.body) {
                document.body.appendChild(scrollBtn);
            }
            
            // 添加滚动监听，控制按钮显示/隐藏
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY || document.documentElement.scrollTop;
                if (scrollPosition > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            });
            
            // 初始检查滚动位置
            const initialScrollPosition = window.scrollY || document.documentElement.scrollTop;
            if (initialScrollPosition > 300) {
                scrollBtn.classList.add('visible');
            }
            
            // 添加点击事件
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                // 添加点击反馈效果
                scrollBtn.classList.add('clicked');
                setTimeout(() => {
                    scrollBtn.classList.remove('clicked');
                }, 300);
            });
        }, 100);
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
            
            // 平滑过渡主题按钮文本
            if (themeText) {
                // 淡出当前文本
                themeText.style.opacity = '0';
                themeText.style.transform = 'translateY(5px)';
                
                // 短暂延迟后更新文本并淡入
                setTimeout(() => {
                    // 预先设置好宽度，防止文本重排导致的不良布局
                    themeText.style.width = '60px';
                    updateThemeUI(newTheme);
                    
                    // 确保DOM有时间更新
                    setTimeout(() => {
                        themeText.style.opacity = '1';
                        themeText.style.transform = 'translateY(0)';
                    }, 50);
                }, 150);
            } else {
                updateThemeUI(newTheme);
            }
            
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
        // 使用IntersectionObserver API进行懒加载
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            // 使用更高的阈值和更少的回调频率
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 创建新图像对象预加载
                        const tempImage = new Image();
                        tempImage.onload = function() {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('fade-in');
                        };
                        tempImage.onerror = function() {
                            // 加载失败时使用占位图
                            img.src = 'placeholder.jpg';
                            img.removeAttribute('data-src');
                        };
                        tempImage.src = img.dataset.src;
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px 0px', // 提前200px开始加载
                threshold: 0.1 // 只需要10%可见就开始加载
            });
            
            lazyImages.forEach(image => {
                lazyImageObserver.observe(image);
            });
        } else {
            // 对于不支持IntersectionObserver的浏览器，使用简单的延迟加载
            setTimeout(() => {
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }, 1000);
        }
        
        // 为所有图片添加loading="lazy"属性
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    // 初始化Live2D相关配置和页面切换效果
    function initializeLive2D() {
        // 不再需要初始化Live2D，由autoload.js处理
        console.log("Live2D initialization is now handled by autoload.js");
    }

    // 合并所有初始化操作于DOMContentLoaded事件
    document.addEventListener('DOMContentLoaded', () => {
        initializeElements();
        // 确保尽早创建返回顶部按钮
        createScrollToTopButton();
        simulateLoading();
        initializeDarkMode();
        initializeSmoothScroll();
        initializeCardEffects();
        initializeNavAnimation();
        addRippleEffect();
        initLazyLoading();
        
        // 初始化移动端增强功能
        if (document.body.classList.contains('is-mobile')) {
            initMobileEnhancements();
        }

        // 初始化Live2D及页面切换效果
        initializeLive2D();
        
        // 添加跟随鼠标的装饰效果
        if (window.innerWidth > 768) {
            addMouseFollowEffect();
        }
        
        // 定期检查返回顶部按钮是否正确附加到body
        ensureButtonAttachedToBody();
    });
    
    // 添加鼠标跟随效果
    function addMouseFollowEffect() {
        // 只在桌面设备上添加鼠标跟随效果
        if (document.body.classList.contains('is-mobile')) {
            return;
        }
        
        // 检查是否已经存在鼠标跟随元素
        if (document.querySelector('.custom-cursor')) {
            // 如果已经存在，获取现有的cursor元素并使用它
            const cursor = document.querySelector('.custom-cursor');
            
            // 使用节流函数减少mousemove事件处理频率
            let lastExecution = 0;
            const throttleDelay = 10; // 10ms节流
            
            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                if (now - lastExecution < throttleDelay) return;
                
                lastExecution = now;
                
                // 使用transform代替left/top，提高性能
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                
                // 检查鼠标是否在文章卡片上，如果是则调整光标样式
                const hoveredCard = document.elementFromPoint(e.clientX, e.clientY);
                const isOverCard = hoveredCard && (
                    hoveredCard.classList.contains('article-card') || 
                    hoveredCard.closest('.article-card')
                );
                
                if (isOverCard) {
                    // 在文章卡片上时稍微调整光标样式
                    cursor.style.mixBlendMode = 'normal';
                    cursor.style.opacity = '0.4';
                } else {
                    // 恢复默认样式
                    cursor.style.mixBlendMode = 'difference';
                    cursor.style.opacity = '0.6';
                }
            });
            
            return;
        }
        
        // 如果不存在，创建新的cursor元素
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        // 使用节流函数减少mousemove事件处理频率
        let lastExecution = 0;
        const throttleDelay = 10; // 10ms节流
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastExecution < throttleDelay) return;
            
            lastExecution = now;
            
            // 使用transform代替left/top，提高性能
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            
            // 检查鼠标是否在文章卡片上，如果是则调整光标样式
            const hoveredCard = document.elementFromPoint(e.clientX, e.clientY);
            const isOverCard = hoveredCard && (
                hoveredCard.classList.contains('article-card') || 
                hoveredCard.closest('.article-card')
            );
            
            if (isOverCard) {
                // 在文章卡片上时稍微调整光标样式
                cursor.style.mixBlendMode = 'normal';
                cursor.style.opacity = '0.4';
            } else {
                // 恢复默认样式
                cursor.style.mixBlendMode = 'difference';
                cursor.style.opacity = '0.6';
            }
        });
    }

    // 确保返回顶部按钮直接附加到body
    function ensureButtonAttachedToBody() {
        // 每0.5秒检查一次
        setInterval(() => {
            const scrollBtn = document.querySelector('.scroll-top-btn');
            if (scrollBtn && scrollBtn.parentElement !== document.body) {
                console.log('重新附加返回顶部按钮到body');
                document.body.appendChild(scrollBtn);
                
                // 重新设置样式
                scrollBtn.style.cssText = `
                    position: fixed !important;
                    bottom: 2rem !important;
                    right: 2rem !important;
                    left: auto !important;
                    top: auto !important;
                    z-index: 9999 !important;
                `;
                
                // 如果在移动设备上，调整位置
                if (window.innerWidth <= 768) {
                    scrollBtn.style.bottom = '1.5rem !important';
                    scrollBtn.style.right = '1.5rem !important';
                }
            }
        }, 500);
    }

    // 添加移动端增强功能
    function initMobileEnhancements() {
        // 为导航链接添加触摸反馈
        document.querySelectorAll('.nav-links a, .category-nav a').forEach(link => {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
            });
            
            link.addEventListener('touchend', () => {
                link.classList.remove('touch-active');
            });
        });
        
        // 为返回顶部按钮添加触摸反馈
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('touchstart', () => {
                scrollTopBtn.classList.add('touch-active');
                scrollTopBtn.classList.add('clicked');
            });
            
            scrollTopBtn.addEventListener('touchend', () => {
                scrollTopBtn.classList.remove('touch-active');
                setTimeout(() => {
                    scrollTopBtn.classList.remove('clicked');
                }, 300);
            });
        }
        
        // 修复iOS上的:hover效果持续问题
        document.addEventListener('touchend', () => {}, true);
        
        // 优化移动端图片加载
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            if (!img.getAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
        
        // 移动端长按复制链接处理
        document.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('contextmenu', (e) => {
                if (document.body.classList.contains('is-mobile')) {
                    // 阻止默认长按菜单
                    e.preventDefault();
                }
            });
        });
        
        // 检测返回顶部按钮的位置，避免遮挡看板娘
        const scrollBtn = document.querySelector('.scroll-top-btn');
        const waifu = document.querySelector('#waifu');
        
        if (scrollBtn && waifu) {
            // 使用更强制的样式设置方式
            scrollBtn.style.cssText = `
                position: fixed !important;
                bottom: 2rem !important;
                right: 2rem !important;
                left: auto !important;
                top: auto !important;
                z-index: 9999 !important;
            `;
            
            // 监听窗口大小变化，动态调整按钮位置
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    // 移动端位置
                    scrollBtn.style.cssText = `
                        position: fixed !important;
                        bottom: 1.5rem !important;
                        right: 1.5rem !important;
                        left: auto !important;
                        top: auto !important;
                        z-index: 9999 !important;
                    `;
                } else {
                    // 检查Live2D模型是否显示
                    const waifuDisplay = window.getComputedStyle(waifu).display;
                    if (waifuDisplay !== 'none') {
                        // 避开Live2D
                        scrollBtn.style.cssText = `
                            position: fixed !important;
                            bottom: 2rem !important;
                            right: 320px !important;
                            left: auto !important;
                            top: auto !important;
                            z-index: 9999 !important;
                        `;
                    } else {
                        // 默认位置
                        scrollBtn.style.cssText = `
                            position: fixed !important;
                            bottom: 2rem !important;
                            right: 2rem !important;
                            left: auto !important;
                            top: auto !important;
                            z-index: 9999 !important;
                        `;
                    }
                }
            });
            
            // 初始化时触发一次resize事件来设置正确的位置
            window.dispatchEvent(new Event('resize'));
        }
        
        // 添加FastClick以减少移动端点击延迟
        if (typeof FastClick !== 'undefined') {
            FastClick.attach(document.body);
        }
    }
})();
