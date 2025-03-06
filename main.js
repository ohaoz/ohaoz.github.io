// 导航栏滚动效果
// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

window.addEventListener('scroll', throttle(() => {
    requestAnimationFrame(() => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
        updateActiveNavLink();
    });
}, 100));

// 平滑滚动到锚点
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

// 导航栏活动状态
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 搜索框功能
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

const debouncedSearch = debounce(async (searchTerm) => {
    try {
        // 显示加载状态
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // 模拟API调用
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('搜索失败');
        
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('搜索错误:', error);
        // 显示错误消息
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.innerHTML = '<p class="error">搜索时发生错误，请稍后重试</p>';
        }
    } finally {
        // 恢复搜索按钮
        searchButton.innerHTML = '<i class="fas fa-search"></i>';
    }
}, 500);

searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length >= 2) {
        debouncedSearch(searchTerm);
    }
});

function displaySearchResults(results) {
    // 实现搜索结果显示逻辑
    console.log('搜索结果:', results);
}

// Newsletter表单提交
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        if (email) {
            // 这里可以实现实际的订阅功能
            console.log('Newsletter subscription for:', email);
            newsletterForm.innerHTML = '<p class="success-message">感谢订阅！我们会将最新的技术动态发送到您的邮箱。</p>';
        }
    });
}

// 文章卡片和分类卡片动画效果
function animateOnScroll() {
    const elements = document.querySelectorAll('.post-card, .category-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// 初始化卡片样式
document.querySelectorAll('.post-card, .category-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// 阅读进度条功能
function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', throttle(() => {
        requestAnimationFrame(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.transform = `scaleX(${progress / 100})`;
            progressBar.setAttribute('aria-valuenow', Math.round(progress));
        });
    }, 100));
}

// 页面加载完成后的动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 魔法搜索框功能
const magicSearchBox = document.querySelector('.magic-search-box input');
const magicSearchButton = document.querySelector('.magic-search-box button');
const magicSearchContainer = document.querySelector('.magic-search-box');

if (magicSearchBox && magicSearchButton) {
    // 初始化搜索框
    magicSearchContainer.classList.add('initialized');
    
    // 点击搜索按钮时触发搜索
    magicSearchButton.addEventListener('click', () => {
        const searchTerm = magicSearchBox.value.trim();
        if (searchTerm) {
            performSearch(searchTerm);
        }
    });
    
    // 按下回车键时触发搜索
    magicSearchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = magicSearchBox.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }
    });
    
    // 获得焦点时添加彩色光环效果
    magicSearchBox.addEventListener('focus', () => {
        // 添加彩色粒子效果
        createGlowEffect(magicSearchContainer);
    });
    
    // 鼠标悬停效果
    magicSearchContainer.addEventListener('mouseenter', () => {
        magicSearchContainer.classList.add('hover');
    });
    
    magicSearchContainer.addEventListener('mouseleave', () => {
        magicSearchContainer.classList.remove('hover');
    });
}

// 执行搜索
function performSearch(searchTerm) {
    console.log('正在搜索:', searchTerm);
    // 这里可以实现实际的搜索功能，跳转到搜索结果页面或调用API
    window.location.href = `/search.html?q=${encodeURIComponent(searchTerm)}`;
}

// 创建彩色光效
function createGlowEffect(element) {
    // 添加彩色光效粒子
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'search-particle';
        
        // 随机选择粒子颜色
        const colors = [
            'rgba(255, 107, 154, 0.8)', // 粉色
            'rgba(107, 154, 255, 0.8)', // 蓝色
            'rgba(157, 107, 255, 0.8)', // 紫色
            'rgba(107, 255, 154, 0.8)', // 绿色
            'rgba(255, 220, 107, 0.8)'  // 黄色
        ];
        
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 12 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 2 + 1}s`;
        
        // 添加粒子运动效果
        particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
        particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
        
        element.appendChild(particle);
        
        // 消除粒子
        setTimeout(() => {
            if (particle.parentNode === element) {
                element.removeChild(particle);
            }
        }, 3000);
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化进度条
    initProgressBar();
    
    // 初始化魔法搜索框
    const magicSearchBox = document.querySelector('.magic-search-box');
    if (magicSearchBox) {
        // 添加初始化样式
        magicSearchBox.classList.add('initialized');
    }
});
