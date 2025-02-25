/**
 * 看板娘全局配置文件
 * 为主站和测试工具提供统一的配置
 */

// 全局配置对象
window.LIVE2D_CONFIG = {
    // 基础路径 - 使用根相对路径确保在GitHub Pages上正常工作
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
    
    // 调试模式
    debug: false,
    
    // 版本信息
    version: "1.0.0"
};

// 初始化函数 - 在页面加载完成后调用
window.initLive2D = function() {
    console.log("初始化看板娘...");
    
    // 检查必要的DOM元素
    const waifuElement = document.getElementById("waifu");
    const live2dCanvas = document.getElementById("live2d");
    
    if (!waifuElement) {
        console.error("错误: 未找到#waifu元素");
        return false;
    }
    
    if (!live2dCanvas) {
        console.error("错误: 未找到#live2d画布");
        return false;
    }
    
    // 检查必要的函数
    if (typeof loadlive2d !== "function") {
        console.error("错误: loadlive2d函数未定义");
        return false;
    }
    
    try {
        // 加载模型
        loadlive2d("live2d", window.LIVE2D_CONFIG.model.jsonPath);
        console.log("看板娘模型加载成功");
        return true;
    } catch (error) {
        console.error("加载看板娘时发生错误:", error);
        return false;
    }
};

// 导出配置供其他模块使用
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = window.LIVE2D_CONFIG;
}
