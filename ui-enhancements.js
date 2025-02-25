// 增强 UI 交互效果

// 等待文档加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题切换 - 使用script.js中的实现
    // 注意：主题切换功能已移至script.js中的initializeDarkMode函数
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化微交互
    initMicroInteractions();
    
    // 添加浮动气泡
    createFloatingBubbles();
    
    // 创建樱花效果
    createSakuraEffect();
    
    // 添加滚动进度条
    createScrollIndicator();
    
    // 初始化返回顶部按钮
    initScrollToTopButton();
    
    // 初始化导航栏滚动行为
    initNavbarScroll();
    
    // 检测移动设备并优化
    detectMobile();
    
    // 移除预加载动画
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1000);
});

// 主题切换功能 - 已移至script.js
function initThemeToggle() {
    // 此函数已被移除，避免与script.js中的实现冲突
    console.log('Theme toggle functionality is now handled in script.js');
}

// 滚动动画初始化
function initScrollAnimations() {
    // 获取所有需要淡入的元素
    const fadeElements = document.querySelectorAll('.article-card, .hero, .section-title, .cta-section');
    
    // 为每个元素添加淡入类
    fadeElements.forEach(element => {
        element.classList.add('fade-in-up');
    });
    
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // 一旦元素已显示，停止观察
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // 至少10%的元素可见时触发
        rootMargin: '0px 0px -50px 0px' // 提前50px触发
    });
    
    // 观察所有淡入元素
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// 微交互初始化
function initMicroInteractions() {
    // 为所有按钮和链接添加涟漪效果
    const interactiveElements = document.querySelectorAll('button, .nav-links a, .category-nav a, .social-links a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', createRippleEffect);
        
        // 为移动设备添加触摸反馈
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // 为卡片添加悬停效果
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '5';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// 创建涟漪效果
function createRippleEffect(event) {
    const button = event.currentTarget;
    
    // 创建涟漪元素
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    
    // 根据点击位置设置涟漪起点
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // 添加到按钮
    button.appendChild(ripple);
    
    // 动画结束后移除
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 创建浮动气泡
function createFloatingBubbles() {
    const bubblesContainer = document.createElement('div');
    bubblesContainer.classList.add('floating-bubbles');
    
    // 创建5个气泡
    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubblesContainer.appendChild(bubble);
    }
    
    document.body.appendChild(bubblesContainer);
}

// 创建樱花效果
function createSakuraEffect() {
    const sakuraContainer = document.createElement('div');
    sakuraContainer.classList.add('sakura-container');
    
    // 创建10个樱花
    for (let i = 0; i < 10; i++) {
        const sakura = document.createElement('div');
        sakura.classList.add('sakura');
        
        // 随机位置和尺寸
        sakura.style.left = Math.random() * 100 + '%';
        sakura.style.width = (Math.random() * 10 + 5) + 'px';
        sakura.style.height = (Math.random() * 10 + 5) + 'px';
        
        // 随机动画时间
        const fallDuration = Math.random() * 10 + 8;
        const shakeDuration = Math.random() * 5 + 3;
        sakura.style.animationDuration = `${fallDuration}s, ${shakeDuration}s`;
        
        // 随机延迟
        sakura.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 5}s`;
        
        sakuraContainer.appendChild(sakura);
    }
    
    document.body.appendChild(sakuraContainer);
}

// 创建滚动进度指示器
function createScrollIndicator() {
    const scrollContainer = document.createElement('div');
    scrollContainer.classList.add('scroll-indicator-container');
    
    const scrollBar = document.createElement('div');
    scrollBar.classList.add('scroll-indicator-bar');
    
    scrollContainer.appendChild(scrollBar);
    document.body.appendChild(scrollContainer);
    
    // 监听滚动事件更新进度条
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + '%';
    });
}

// 初始化返回顶部按钮
function initScrollToTopButton() {
    // 创建返回顶部按钮
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', '返回顶部');
    
    document.body.appendChild(scrollTopBtn);
    
    // 监听滚动显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // 点击返回顶部
    scrollTopBtn.addEventListener('click', () => {
        scrollTopBtn.classList.add('clicked');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            scrollTopBtn.classList.remove('clicked');
        }, 300);
    });
}

// 导航栏滚动行为
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        // 添加滚动阴影效果
        if (scrollTop > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 向下滚动隐藏，向上滚动显示
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.classList.add('scroll-down');
            navbar.classList.remove('scroll-up');
        } else {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        
        lastScrollTop = scrollTop;
    });
}

// 移动设备检测与优化
function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       window.innerWidth <= 768;
    
    if (isMobile) {
        document.body.classList.add('is-mobile');
        
        // 降低动画复杂度
        const sakuraContainer = document.querySelector('.sakura-container');
        if (sakuraContainer) {
            const sakuras = sakuraContainer.querySelectorAll('.sakura');
            // 减少樱花数量
            for (let i = 0; i < sakuras.length; i++) {
                if (i > 4) {
                    sakuras[i].remove();
                }
            }
        }
        
        // 移除浮动气泡以提高性能
        const bubbles = document.querySelector('.floating-bubbles');
        if (bubbles) {
            bubbles.style.display = 'none';
        }
    }
}

// 首篇文章设置为大卡片
function setFeaturedArticle() {
    const articles = document.querySelectorAll('.article-card');
    if (articles.length > 0) {
        articles[0].classList.add('featured');
    }
}

// 自定义鼠标跟随效果
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    // 更新鼠标位置
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // 悬停在可点击元素上时扩大指针
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .article-card');
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-expanded');
        });
        
        elem.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-expanded');
        });
    });
    
    // 在移动设备上禁用自定义鼠标
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        cursor.style.display = 'none';
    }
}

// 创建预加载动画
function createPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        const loader = document.createElement('div');
        loader.classList.add('kawaii-loader');
        
        // 创建可爱的加载表情
        const face = document.createElement('div');
        face.classList.add('kawaii-face');
        
        const leftEye = document.createElement('div');
        leftEye.classList.add('kawaii-eye', 'left');
        
        const rightEye = document.createElement('div');
        rightEye.classList.add('kawaii-eye', 'right');
        
        const mouth = document.createElement('div');
        mouth.classList.add('kawaii-mouth');
        
        const leftBlush = document.createElement('div');
        leftBlush.classList.add('kawaii-blush', 'left');
        
        const rightBlush = document.createElement('div');
        rightBlush.classList.add('kawaii-blush', 'right');
        
        face.appendChild(leftEye);
        face.appendChild(rightEye);
        face.appendChild(mouth);
        face.appendChild(leftBlush);
        face.appendChild(rightBlush);
        
        loader.appendChild(face);
        preloader.appendChild(loader);
        
        // 添加加载文字
        const loadingText = document.createElement('p');
        loadingText.style.color = 'white';
        loadingText.style.marginTop = '20px';
        loadingText.style.fontSize = '14px';
        loadingText.textContent = '正在加载可爱内容...';
        
        preloader.appendChild(loadingText);
    }
}

// 页面加载时执行初始化函数
window.onload = function() {
    // 初始化自定义鼠标
    initCustomCursor();
    
    // 设置首篇文章为大卡片
    setFeaturedArticle();
    
    // 创建预加载动画
    createPreloader();
};

// 季节性主题（根据季节更改某些UI元素）
function seasonalTheme() {
    const month = new Date().getMonth(); // 0-11
    
    // 根据季节更改樱花颜色和背景
    const sakuras = document.querySelectorAll('.sakura');
    
    if (month >= 2 && month <= 4) { // 春季 (3-5月)
        // 樱花季节
        sakuras.forEach(sakura => {
            sakura.style.backgroundColor = '#ffccd5'; // 粉色樱花
        });
        
    } else if (month >= 5 && month <= 7) { // 夏季 (6-8月)
        // 改为夏季元素 (如气泡)
        sakuras.forEach(sakura => {
            sakura.style.backgroundColor = '#87CEFA'; // 蓝色泡泡
            sakura.style.borderRadius = '50%';
        });
        
    } else if (month >= 8 && month <= 10) { // 秋季 (9-11月)
        // 改为落叶
        sakuras.forEach(sakura => {
            sakura.style.backgroundColor = '#FFA500'; // 橙色落叶
            sakura.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
        });
        
    } else { // 冬季 (12-2月)
        // 改为雪花
        sakuras.forEach(sakura => {
            sakura.style.backgroundColor = 'white'; // 白色雪花
            sakura.style.borderRadius = '50%';
        });
    }
}

// 调用季节性主题函数
document.addEventListener('DOMContentLoaded', function() {
    seasonalTheme();
}); 