/**
 * 看板娘GitHub Pages专用加载器
 * 解决在GitHub Pages环境下的路径和加载问题
 */

// 立即执行函数，避免污染全局命名空间
(function() {
    console.log("看板娘GitHub Pages加载器启动");
    
    // 获取当前脚本的基础路径
    const scripts = document.getElementsByTagName("script");
    const currentScript = scripts[scripts.length - 1];
    const scriptPath = currentScript.src;
    const basePath = scriptPath.substring(0, scriptPath.lastIndexOf("/") + 1);
    
    console.log("检测到基础路径:", basePath);
    
    // 配置
    const config = {
        waifuPath: basePath + "waifu-tips.json",
        apiPath: "https://live2d.fghrsh.net/api/",
        cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
        tools: ["hitokoto", "switch-model", "switch-texture", "photo", "info", "quit"]
    };
    
    // 加载资源
    function loadResource(url, type) {
        return new Promise((resolve, reject) => {
            console.log(`尝试加载资源: ${url} (${type})`);
            let tag;
            
            if (type === "css") {
                tag = document.createElement("link");
                tag.rel = "stylesheet";
                tag.href = url;
            } else if (type === "js") {
                tag = document.createElement("script");
                tag.src = url;
            }
            
            if (tag) {
                tag.onload = () => {
                    console.log(`资源加载成功: ${url}`);
                    resolve(url);
                };
                tag.onerror = (e) => {
                    console.error(`资源加载失败: ${url}`, e);
                    reject(e);
                };
                document.head.appendChild(tag);
            }
        });
    }
    
    // 创建DOM结构
    function createDom() {
        console.log("创建看板娘DOM结构");
        
        // 检查是否已存在
        if (document.getElementById("waifu")) {
            console.log("看板娘DOM结构已存在");
            return;
        }
        
        // 创建主容器
        const waifu = document.createElement("div");
        waifu.id = "waifu";
        waifu.innerHTML = `
            <div id="waifu-tips"></div>
            <canvas id="live2d" width="300" height="300"></canvas>
            <div id="waifu-tool">
                <span class="fa fa-lg fa-comment"></span>
                <span class="fa fa-lg fa-paper-plane"></span>
                <span class="fa fa-lg fa-user-circle"></span>
                <span class="fa fa-lg fa-street-view"></span>
                <span class="fa fa-lg fa-camera-retro"></span>
                <span class="fa fa-lg fa-info-circle"></span>
                <span class="fa fa-lg fa-times"></span>
            </div>
        `;
        
        // 设置基本样式
        waifu.style.position = "fixed";
        waifu.style.right = "0";
        waifu.style.bottom = "0";
        waifu.style.zIndex = "999";
        waifu.style.width = "300px";
        waifu.style.height = "300px";
        waifu.style.transition = "all .3s ease-in-out";
        
        // 添加到页面
        document.body.appendChild(waifu);
        console.log("看板娘DOM结构创建完成");
    }
    
    // 初始化看板娘
    function initLive2D() {
        console.log("初始化看板娘");
        
        // 检查必要条件
        if (!document.getElementById("live2d")) {
            console.error("找不到#live2d元素，无法初始化");
            return;
        }
        
        if (typeof loadlive2d !== "function") {
            console.error("loadlive2d函数未定义，无法初始化");
            return;
        }
        
        // 加载默认模型
        try {
            loadlive2d("live2d", basePath + "live2d_models/shizuku/shizuku.model.json");
            console.log("看板娘模型加载成功");
            
            // 显示欢迎消息
            if (typeof showMessage === "function") {
                showMessage("欢迎来到我的博客！", 4000);
            }
        } catch (e) {
            console.error("加载看板娘模型失败:", e);
        }
    }
    
    // 设置工具栏事件
    function setupTools() {
        console.log("设置工具栏事件");
        const waifuTool = document.getElementById("waifu-tool");
        if (!waifuTool) return;
        
        const tools = waifuTool.querySelectorAll("span");
        
        // 设置关闭按钮
        const closeBtn = tools[tools.length - 1];
        if (closeBtn) {
            closeBtn.addEventListener("click", function() {
                document.getElementById("waifu").style.display = "none";
            });
        }
    }
    
    // 主函数
    function main() {
        // 检查屏幕宽度
        if (screen.width < 768) {
            console.log("屏幕宽度小于768px，不加载看板娘");
            return;
        }
        
        // 加载资源
        Promise.all([
            loadResource(basePath + "waifu.css", "css"),
            loadResource(basePath + "live2d.min.js", "js")
        ]).then(() => {
            console.log("基础资源加载完成");
            
            // 创建DOM结构
            createDom();
            
            // 加载waifu-tips.js
            loadResource(basePath + "waifu-tips.js", "js").then(() => {
                console.log("waifu-tips.js加载完成");
                
                // 初始化
                initLive2D();
                setupTools();
            }).catch(error => {
                console.error("加载waifu-tips.js失败:", error);
                // 尝试直接初始化
                initLive2D();
            });
        }).catch(error => {
            console.error("加载基础资源失败:", error);
        });
    }
    
    // 页面加载完成后执行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }
    
    // 监听网络错误
    window.addEventListener("error", function(e) {
        if (e.target.tagName === "SCRIPT" || e.target.tagName === "LINK") {
            console.error("资源加载失败:", e.target.src || e.target.href);
        }
    }, true);
    
    // 暴露API
    window.Live2DGitHubPages = {
        reload: main,
        init: initLive2D
    };
})(); 