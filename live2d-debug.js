/**
 * 看板娘调试工具
 * 用于诊断GitHub Pages环境中的看板娘加载问题
 */

// 立即执行函数，避免污染全局命名空间
(function() {
    // 调试信息容器
    let debugInfo = {
        browser: navigator.userAgent,
        screen: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        domReady: false,
        resourcesLoaded: {
            css: false,
            live2dJs: false,
            waifuTipsJs: false,
            configJs: false
        },
        domElements: {
            waifu: false,
            waifuTips: false,
            live2dCanvas: false,
            waifuTool: false
        },
        errors: []
    };
    
    // 记录错误
    function logError(message, error) {
        console.error(message, error);
        debugInfo.errors.push({
            time: new Date().toISOString(),
            message: message,
            details: error ? (error.message || error.toString()) : "未知错误"
        });
        updateDebugPanel();
    }
    
    // 检查DOM元素
    function checkDomElements() {
        debugInfo.domElements.waifu = !!document.getElementById("waifu");
        debugInfo.domElements.waifuTips = !!document.getElementById("waifu-tips");
        debugInfo.domElements.live2dCanvas = !!document.getElementById("live2d");
        debugInfo.domElements.waifuTool = !!document.getElementById("waifu-tool");
        updateDebugPanel();
    }
    
    // 检查资源加载状态
    function checkResources() {
        // 检查CSS
        const cssLoaded = Array.from(document.styleSheets).some(sheet => 
            sheet.href && sheet.href.includes("waifu.css"));
        debugInfo.resourcesLoaded.css = cssLoaded;
        
        // 检查JS
        debugInfo.resourcesLoaded.live2dJs = typeof loadlive2d === "function";
        debugInfo.resourcesLoaded.waifuTipsJs = typeof showMessage === "function";
        debugInfo.resourcesLoaded.configJs = !!window.LIVE2D_CONFIG;
        
        updateDebugPanel();
    }
    
    // 创建调试面板
    function createDebugPanel() {
        const panel = document.createElement("div");
        panel.id = "live2d-debug-panel";
        panel.style.position = "fixed";
        panel.style.top = "10px";
        panel.style.left = "10px";
        panel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        panel.style.color = "#00ff00";
        panel.style.padding = "10px";
        panel.style.borderRadius = "5px";
        panel.style.zIndex = "9999";
        panel.style.maxWidth = "400px";
        panel.style.maxHeight = "300px";
        panel.style.overflow = "auto";
        panel.style.fontSize = "12px";
        panel.style.fontFamily = "monospace";
        panel.innerHTML = "<h3>看板娘调试面板</h3><div id='debug-content'></div>";
        
        // 添加关闭按钮
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "关闭";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "5px";
        closeBtn.style.right = "5px";
        closeBtn.style.padding = "2px 5px";
        closeBtn.addEventListener("click", function() {
            panel.style.display = "none";
        });
        panel.appendChild(closeBtn);
        
        // 添加修复按钮
        const fixBtn = document.createElement("button");
        fixBtn.textContent = "尝试修复";
        fixBtn.style.marginTop = "10px";
        fixBtn.style.padding = "5px";
        fixBtn.addEventListener("click", attemptFix);
        panel.querySelector("#debug-content").after(fixBtn);
        
        document.body.appendChild(panel);
    }
    
    // 更新调试面板内容
    function updateDebugPanel() {
        const content = document.getElementById("debug-content");
        if (!content) return;
        
        content.innerHTML = `
            <p><strong>浏览器:</strong> ${debugInfo.browser}</p>
            <p><strong>屏幕尺寸:</strong> ${debugInfo.screen.width}x${debugInfo.screen.height}</p>
            <p><strong>DOM就绪:</strong> ${debugInfo.domReady ? "✅" : "❌"}</p>
            
            <h4>资源加载:</h4>
            <ul>
                <li>CSS: ${debugInfo.resourcesLoaded.css ? "✅" : "❌"}</li>
                <li>live2d.min.js: ${debugInfo.resourcesLoaded.live2dJs ? "✅" : "❌"}</li>
                <li>waifu-tips.js: ${debugInfo.resourcesLoaded.waifuTipsJs ? "✅" : "❌"}</li>
                <li>配置: ${debugInfo.resourcesLoaded.configJs ? "✅" : "❌"}</li>
            </ul>
            
            <h4>DOM元素:</h4>
            <ul>
                <li>#waifu: ${debugInfo.domElements.waifu ? "✅" : "❌"}</li>
                <li>#waifu-tips: ${debugInfo.domElements.waifuTips ? "✅" : "❌"}</li>
                <li>#live2d: ${debugInfo.domElements.live2dCanvas ? "✅" : "❌"}</li>
                <li>#waifu-tool: ${debugInfo.domElements.waifuTool ? "✅" : "❌"}</li>
            </ul>
            
            <h4>错误 (${debugInfo.errors.length}):</h4>
            <ul>
                ${debugInfo.errors.map(err => `<li>${err.time}: ${err.message} - ${err.details}</li>`).join("")}
            </ul>
        `;
    }
    
    // 尝试修复问题
    function attemptFix() {
        console.log("尝试修复看板娘问题...");
        
        // 1. 检查并创建DOM元素
        if (!debugInfo.domElements.waifu) {
            console.log("创建#waifu元素");
            const waifuDiv = document.createElement("div");
            waifuDiv.id = "waifu";
            waifuDiv.innerHTML = `
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
            document.body.appendChild(waifuDiv);
            
            // 设置基本样式
            waifuDiv.style.position = "fixed";
            waifuDiv.style.right = "0";
            waifuDiv.style.bottom = "0";
            waifuDiv.style.zIndex = "999";
            waifuDiv.style.width = "300px";
            waifuDiv.style.height = "300px";
        }
        
        // 2. 重新加载资源
        if (!debugInfo.resourcesLoaded.css) {
            console.log("加载waifu.css");
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "waifu.css";
            document.head.appendChild(link);
        }
        
        if (!debugInfo.resourcesLoaded.live2dJs) {
            console.log("加载live2d.min.js");
            const script = document.createElement("script");
            script.src = "live2d.min.js";
            document.head.appendChild(script);
        }
        
        if (!debugInfo.resourcesLoaded.waifuTipsJs) {
            console.log("加载waifu-tips.js");
            const script = document.createElement("script");
            script.src = "waifu-tips.js";
            document.head.appendChild(script);
        }
        
        // 3. 重新初始化
        setTimeout(function() {
            console.log("重新初始化看板娘");
            if (window.initLive2D && typeof window.initLive2D === "function") {
                window.initLive2D();
            } else if (window.initWidget && typeof window.initWidget === "function") {
                window.initWidget({
                    waifuPath: "waifu-tips.json",
                    apiPath: "https://live2d.fghrsh.net/api/",
                    tools: ["hitokoto", "switch-model", "switch-texture", "photo", "info", "quit"]
                });
            }
            
            // 更新调试信息
            checkDomElements();
            checkResources();
        }, 1000);
    }
    
    // 监听资源加载错误
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
            logError(`资源加载失败: ${e.target.src || e.target.href}`, e);
        }
    }, true);
    
    // 页面加载完成后初始化调试工具
    document.addEventListener("DOMContentLoaded", function() {
        debugInfo.domReady = true;
        console.log("DOM加载完成，初始化看板娘调试工具");
        
        // 创建调试面板
        createDebugPanel();
        
        // 检查DOM元素和资源
        setTimeout(function() {
            checkDomElements();
            checkResources();
        }, 500);
    });
    
    // 暴露调试API
    window.Live2DDebug = {
        getInfo: function() {
            return debugInfo;
        },
        checkElements: checkDomElements,
        checkResources: checkResources,
        attemptFix: attemptFix
    };
})(); 