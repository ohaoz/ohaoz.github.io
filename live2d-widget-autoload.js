// Live2D Widget Autoload Script
// https://github.com/stevenjoezhang/live2d-widget
// Modified for GitHub Pages

// Set the path to the Live2D widget directory
// Use absolute path for GitHub Pages to ensure correct loading
const live2d_path = "/live2d-widget/dist/";
// 如果你的GitHub Pages不是部署在根目录，请使用下面的路径格式
// const live2d_path = "/your-repo-name/live2d-widget/dist/";

// Load CSS
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;

        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => {
                console.error("Failed to load resource:", url);
                reject(url);
            };
            document.head.appendChild(tag);
        }
    });
}

// Main function to load the Live2D widget
function initWidget(config) {
    document.addEventListener("DOMContentLoaded", async () => {
        console.log("Loading Live2D widget resources...");
        
        // Load CSS first
        try {
            await loadExternalResource(`${live2d_path}waifu.css`, "css");
            console.log("CSS loaded successfully");
            
            // Create widget DOM structure
            const widget = document.createElement("div");
            widget.id = "waifu";
            widget.innerHTML = `
                <div id="waifu-tips"></div>
                <canvas id="live2d" width="800" height="800"></canvas>
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
            document.body.appendChild(widget);
            console.log("Widget DOM created");
            
            // Load JavaScript files
            Promise.all([
                loadExternalResource(`${live2d_path}live2d.min.js`, "js"),
                loadExternalResource(`${live2d_path}waifu-tips.js`, "js")
            ]).then(() => {
                console.log("JS resources loaded successfully");
                // Initialize the widget with configuration
                if (typeof window.initWidget === "function") {
                    window.initWidget(config, live2d_path);
                    console.log("Widget initialized successfully");
                } else {
                    console.error("initWidget function not found!");
                }
            }).catch(error => {
                console.error("Failed to load JS resources:", error);
            });
        } catch (error) {
            console.error("Failed to load CSS:", error);
        }
    });
}

// Configuration
const config = {
    waifuPath: live2d_path + "waifu-tips.json",
    apiPath: "https://live2d.fghrsh.net/api/",
    cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
    tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
};

initWidget(config); 