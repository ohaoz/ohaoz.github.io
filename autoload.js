// 使用相对路径，适合http-server环境
const live2d_path = "./";

// 封装异步加载资源的方法
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
			tag.onerror = (e) => {
				console.error("加载资源失败:", url, e);
				reject(url);
			};
			document.head.appendChild(tag);
		}
	});
}

// 直接加载必要的资源
if (screen.width >= 768) {
	Promise.all([
		loadExternalResource(live2d_path + "waifu.css", "css"),
		loadExternalResource(live2d_path + "live2d.min.js", "js")
	]).then(() => {
		// 确保live2d.min.js加载完成后再加载waifu-tips.js
		loadExternalResource(live2d_path + "waifu-tips.js", "js").then(() => {
			// 确保所有资源都加载完成后再初始化
			console.log("所有Live2D资源加载完成，开始初始化...");
			
			// 显示看板娘
			const waifu = document.getElementById("waifu");
			waifu.style.display = "block";
			
			// 初始化Live2D模型
			initModel();
		});
	}).catch(error => {
		console.error("加载Live2D资源失败:", error);
	});
}

// 初始化模型
function initModel() {
	try {
		// 直接加载默认模型
		loadlive2d("live2d", `${live2d_path}live2d_models/shizuku/shizuku.model.json`);
		console.log("Live2D模型加载完成");
		
		// 设置工具栏按钮事件
		setupTools();
		
		// 设置切换按钮事件
		setupToggle();
	} catch (e) {
		console.error("初始化Live2D模型失败:", e);
	}
}

// 设置工具栏按钮事件
function setupTools() {
	const waifuTool = document.getElementById("waifu-tool");
	if (!waifuTool) return;
	
	const tools = waifuTool.querySelectorAll("span");
	
	// 关闭按钮
	if (tools[3]) {
		tools[3].addEventListener("click", () => {
			document.getElementById("waifu").style.display = "none";
		});
	}
}

// 设置切换按钮事件
function setupToggle() {
	const toggle = document.getElementById("waifu-toggle");
	const waifu = document.getElementById("waifu");
	
	if (toggle && waifu) {
		toggle.addEventListener("click", () => {
			if (waifu.style.display === "none") {
				waifu.style.display = "block";
			} else {
				waifu.style.display = "none";
			}
		});
	}
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
	console.log("页面加载完成，Live2D自动加载脚本已执行");
}); 
	const tools = waifuTool.querySelectorAll("span");
	
	// 关闭按钮
	if (tools[0]) {
		tools[0].addEventListener("click", () => {
            const waifu = document.getElementById("waifu");
            if (waifu) {
                waifu.style.display = "none";
            }
		});
	}
}

// 监控网络错误，在控制台输出更多信息
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
        console.error('资源加载失败:', e.target.src || e.target.href);
    }
}, true);

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
	console.log("页面加载完成，Live2D自动加载脚本已执行");
});
