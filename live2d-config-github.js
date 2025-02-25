/**
 * 看板娘GitHub Pages专用配置文件
 * 解决在GitHub Pages环境下的路径和加载问题
 */

// 全局配置对象
window.LIVE2D_CONFIG = {
    // 基础路径 - 使用绝对路径确保在GitHub Pages上正常工作
    // 如果你的GitHub Pages不是部署在根目录，请修改为 "/your-repo-name/"
    basePath: "/",
    
    // 模型配置
    model: {
        jsonPath: "/live2d_models/shizuku/shizuku.model.json",
        scale: 1.0,
        hHeadPos: 0.5,
        vHeadPos: 0.618,
    },
    
    // 提示信息配置
    tips: {
        jsonPath: "/waifu-tips.json",
        showHitokoto: true,
    },
    
    // 工具栏配置
    tools: [
        "hitokoto", "switch-model", "switch-texture", 
        "photo", "info", "quit"
    ],
    
    // 调试模式 - 在GitHub Pages环境中启用以便排查问题
    debug: true,
    
    // 版本信息
    version: "1.0.1-github"
};

// 初始化函数 - 在页面加载完成后调用
window.initLive2D = function() {
    console.log("初始化看板娘(GitHub Pages版本)...");
    
    // 检查必要的DOM元素
    const waifuElement = document.getElementById("waifu");
    const live2dCanvas = document.getElementById("live2d");
    
    if (!waifuElement) {
        console.error("错误: 未找到#waifu元素");
        // 尝试创建waifu元素
        createWaifuElement();
        return false;
    }
    
    if (!live2dCanvas) {
        console.error("错误: 未找到#live2d画布");
        return false;
    }
    
    // 检查必要的函数
    if (typeof loadlive2d !== "function") {
        console.error("错误: loadlive2d函数未定义");
        console.log("尝试重新加载live2d.min.js...");
        loadScript("/live2d.min.js", function() {
            console.log("live2d.min.js重新加载完成，再次尝试初始化...");
            initLive2D();
        });
        return false;
    }
    
    try {
        // 加载模型 - 使用绝对路径
        const modelPath = window.LIVE2D_CONFIG.basePath + window.LIVE2D_CONFIG.model.jsonPath.replace(/^\//, "");
        console.log("加载看板娘模型:", modelPath);
        loadlive2d("live2d", modelPath);
        console.log("看板娘模型加载成功");
        return true;
    } catch (error) {
        console.error("加载看板娘时发生错误:", error);
        return false;
    }
};

// 创建waifu元素
function createWaifuElement() {
    console.log("创建waifu元素...");
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
    console.log("waifu元素创建成功");
    
    // 设置基本样式
    waifuDiv.style.position = "fixed";
    waifuDiv.style.right = "0";
    waifuDiv.style.bottom = "0";
    waifuDiv.style.zIndex = "999";
    waifuDiv.style.width = "300px";
    waifuDiv.style.height = "300px";
    
    // 重新尝试初始化
    setTimeout(function() {
        window.initLive2D();
    }, 100);
}

// 辅助函数：加载脚本
function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    script.onerror = function() {
        console.error("加载脚本失败:", url);
    };
    document.head.appendChild(script);
}

// 页面加载完成后自动初始化
document.addEventListener("DOMContentLoaded", function() {
    console.log("页面加载完成，准备初始化GitHub Pages版看板娘...");
    // 延迟初始化，确保其他资源已加载
    setTimeout(function() {
        window.initLive2D();
    }, 500);
});

// 导出配置供其他模块使用
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = window.LIVE2D_CONFIG;
} 