// Live2D Widget Autoload Script
// https://github.com/stevenjoezhang/live2d-widget
// Modified for GitHub Pages

// Set the path to the Live2D widget directory
// Use relative path for GitHub Pages
const live2d_path = "./live2d-widget/dist/";

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
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}

// Main function to load the Live2D widget
function initWidget(config) {
    document.addEventListener("DOMContentLoaded", async () => {
        // Load CSS first
        await loadExternalResource(`${live2d_path}waifu.css`, "css");
        
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
        
        // Load JavaScript files
        Promise.all([
            loadExternalResource(`${live2d_path}live2d.min.js`, "js"),
            loadExternalResource(`${live2d_path}waifu-tips.js`, "js")
        ]).then(() => {
            // Initialize the widget with configuration
            window.initWidget?.(config, live2d_path);
        });
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