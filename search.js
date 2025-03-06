// 搜索结果处理脚本
(function() {
    "use strict";

    // 模拟的文章数据，实际应用中应该从服务器获取
    const articles = [
        {
            id: 1,
            title: "深入理解算法复杂度",
            excerpt: "探讨时间复杂度和空间复杂度的概念，以及它们在实际编程中的应用。本文将通过实例深入分析不同算法的性能特点...",
            image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&auto=format&fit=crop&q=60",
            date: "2025-01-18",
            comments: 8,
            category: "algorithm",
            tags: ["算法", "性能优化", "计算机科学"]
        },
        {
            id: 2,
            title: "2025年前端框架对比",
            excerpt: "React、Vue、Angular、Svelte等主流前端框架的最新特性和性能对比。哪一个框架最适合你的项目？本文将给你答案...",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
            date: "2025-01-15",
            comments: 12,
            category: "frontend",
            tags: ["前端", "框架", "React", "Vue", "Angular", "Svelte"]
        },
        {
            id: 3,
            title: "云原生架构实践指南",
            excerpt: "从微服务到Kubernetes，探索云原生架构的核心概念和最佳实践。如何设计可扩展、高可用的现代应用架构...",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60",
            date: "2025-01-10",
            comments: 5,
            category: "system",
            tags: ["云原生", "微服务", "Kubernetes", "架构设计"]
        },
        {
            id: 4,
            title: "机器学习入门指南",
            excerpt: "从零开始学习机器学习的核心概念、算法和实践应用。适合初学者的完整学习路径和资源推荐...",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
            date: "2024-12-28",
            comments: 20,
            category: "ai",
            tags: ["机器学习", "人工智能", "数据科学", "Python"]
        },
        {
            id: 5,
            title: "TypeScript高级技巧",
            excerpt: "掌握TypeScript的类型系统、泛型、装饰器等高级特性，提升代码质量和开发效率的实用技巧...",
            image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60",
            date: "2024-12-20",
            comments: 15,
            category: "frontend",
            tags: ["TypeScript", "JavaScript", "前端开发", "类型系统"]
        },
        {
            id: 6,
            title: "系统设计面试指南",
            excerpt: "如何准备和应对系统设计面试，包括常见问题、解题思路和实际案例分析。帮助你在技术面试中脱颖而出...",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60",
            date: "2024-12-15",
            comments: 18,
            category: "system",
            tags: ["系统设计", "面试", "架构", "分布式系统"]
        },
        {
            id: 7,
            title: "Node.js性能优化实战",
            excerpt: "深入探讨Node.js应用的性能瓶颈和优化策略，包括内存管理、异步操作和服务器配置等方面的最佳实践...",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60",
            date: "2024-12-10",
            comments: 9,
            category: "backend",
            tags: ["Node.js", "性能优化", "后端开发", "JavaScript"]
        },
        {
            id: 8,
            title: "深度学习框架比较：PyTorch vs TensorFlow",
            excerpt: "详细对比两大主流深度学习框架的优缺点、适用场景和性能特点，帮助你选择最适合自己项目的工具...",
            image: "https://images.unsplash.com/photo-1677442135136-760c813028c0?w=500&auto=format&fit=crop&q=60",
            date: "2024-12-05",
            comments: 14,
            category: "ai",
            tags: ["深度学习", "PyTorch", "TensorFlow", "人工智能"]
        }
    ];

    // DOM元素引用
    let searchTerm;
    let searchTermDisplay;
    let searchResultsList;
    let searchLoading;
    let noResults;
    let filterButtons;

    // 初始化搜索页面
    function initializeSearchPage() {
        // 获取DOM元素
        searchTerm = getQueryParam('q');
        searchTermDisplay = document.getElementById('search-term');
        searchResultsList = document.querySelector('.search-results-list');
        searchLoading = document.querySelector('.search-loading');
        noResults = document.querySelector('.no-results');
        filterButtons = document.querySelectorAll('.filter-btn');
        
        // 显示搜索词
        if (searchTermDisplay) {
            searchTermDisplay.textContent = searchTerm || '';
        }
        
        // 在搜索输入框中填入搜索词
        const searchInput = document.getElementById('search-query');
        if (searchInput && searchTerm) {
            searchInput.value = searchTerm;
        }
        
        // 模拟搜索过程
        if (searchTerm) {
            setTimeout(() => {
                performSearch(searchTerm);
            }, 1000); // 模拟1秒的搜索延迟
        } else {
            // 如果没有搜索词，直接显示所有文章
            searchLoading.style.display = 'none';
            searchResultsList.style.display = 'block';
            renderArticles(articles);
        }
        
        // 添加过滤器点击事件
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按钮的active类
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // 为当前点击的按钮添加active类
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                filterResults(filter);
            });
        });
    }
    
    // 从URL获取查询参数
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    // 执行搜索
    function performSearch(query) {
        // 转换为小写以进行不区分大小写的搜索
        query = query.toLowerCase();
        
        // 过滤文章
        const results = articles.filter(article => {
            return (
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query) ||
                article.tags.some(tag => tag.toLowerCase().includes(query))
            );
        });
        
        // 隐藏加载状态
        searchLoading.style.display = 'none';
        
        // 显示结果或无结果提示
        if (results.length > 0) {
            searchResultsList.style.display = 'block';
            noResults.style.display = 'none';
            renderArticles(results);
        } else {
            searchResultsList.style.display = 'none';
            noResults.style.display = 'block';
        }
    }
    
    // 根据类别过滤结果
    function filterResults(category) {
        // 隐藏所有文章
        const articles = document.querySelectorAll('.search-result-item');
        
        if (category === 'all') {
            // 显示所有文章
            articles.forEach(article => {
                article.style.display = 'block';
            });
        } else {
            // 只显示匹配类别的文章
            articles.forEach(article => {
                const articleCategory = article.getAttribute('data-category');
                if (articleCategory === category) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        }
        
        // 检查是否有可见的文章
        const visibleArticles = document.querySelectorAll('.search-result-item[style="display: block;"]');
        if (visibleArticles.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // 渲染文章列表
    function renderArticles(articles) {
        searchResultsList.innerHTML = '';
        
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.className = 'search-result-item article-card animate-on-scroll';
            articleElement.setAttribute('data-category', article.category);
            
            articleElement.innerHTML = `
                <div class="article-card-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <h2>${article.title}</h2>
                <p>${article.excerpt}</p>
                <div class="article-meta">
                    <span><i class="far fa-clock"></i> ${article.date}</span>
                    <span><i class="far fa-comment"></i> ${article.comments} 评论</span>
                    <span class="article-category"><i class="fas fa-tag"></i> ${getCategoryName(article.category)}</span>
                </div>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                </div>
            `;
            
            searchResultsList.appendChild(articleElement);
        });
        
        // 添加点击事件，模拟文章链接
        const articleItems = document.querySelectorAll('.search-result-item');
        articleItems.forEach(item => {
            item.addEventListener('click', () => {
                // 实际应用中应该跳转到文章页面
                console.log('文章被点击');
            });
        });
    }
    
    // 获取分类名称
    function getCategoryName(category) {
        const categoryMap = {
            'frontend': '前端开发',
            'backend': '后端开发',
            'algorithm': '算法',
            'system': '系统设计',
            'ai': '人工智能'
        };
        
        return categoryMap[category] || category;
    }
    
    // 在DOM加载完成后初始化
    document.addEventListener('DOMContentLoaded', initializeSearchPage);
})();
