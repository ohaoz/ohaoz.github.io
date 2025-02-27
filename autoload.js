// 使用相对路径，适合http-server环境
const live2d_path = "./";
let live2dLoaded = false; // 跟踪是否已加载Live2D资源

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

// 延迟加载Live2D资源，改为按需加载而不是自动加载
function loadLive2D() {
	// 如果已经加载过，则不再重复加载
	if (live2dLoaded) {
		console.log("Live2D资源已加载，无需重复加载");
		return;
	}
	
	// 只在桌面设备上加载Live2D
	if (screen.width >= 768 && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
		console.log("开始加载Live2D资源...");
		
		Promise.all([
			loadExternalResource(live2d_path + "waifu.css", "css"),
			loadExternalResource(live2d_path + "live2d.min.js", "js")
		]).then(() => {
			// 确保live2d.min.js加载完成后再加载waifu-tips.js
			loadExternalResource(live2d_path + "waifu-tips.js", "js").then(() => {
				// 确保所有资源都加载完成后再初始化
				console.log("所有Live2D资源加载完成，开始初始化...");
				live2dLoaded = true;
				
				// 显示看板娘
				const waifu = document.getElementById("waifu");
				if (waifu) {
					waifu.style.display = "block";
					
					// 初始化Live2D模型
					initModel();
				}
			});
		}).catch(error => {
			console.error("加载Live2D资源失败:", error);
		});
	} else {
		console.log("移动设备上不加载Live2D以节省内存");
	}
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
		
		// 添加内存优化：页面不可见时隐藏看板娘
		document.addEventListener('visibilitychange', () => {
			const waifu = document.getElementById("waifu");
			if (!waifu) return;
			
			if (document.hidden) {
				// 页面不可见时隐藏看板娘以节省内存
				waifu.style.visibility = 'hidden';
			} else {
				// 页面可见时显示看板娘
				waifu.style.visibility = 'visible';
			}
		});
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

// 创建看板娘加载按钮
function createLive2DToggle() {
	// 检查是否已存在toggle按钮
	if (document.getElementById("waifu-toggle")) return;
	
	const toggle = document.createElement("div");
	toggle.id = "waifu-toggle";
	toggle.innerHTML = "看板娘 <span>↓</span>";
	toggle.style.cssText = `
		position: fixed;
		bottom: 20px;
		right: 20px;
		padding: 8px 12px;
		background-color: var(--primary-color, #FF6B9A);
		color: white;
		border-radius: 20px;
		cursor: pointer;
		z-index: 100;
		font-size: 14px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
		transition: all 0.3s ease;
	`;
	
	document.body.appendChild(toggle);
	
	// 点击按钮时加载Live2D
	toggle.addEventListener("click", () => {
		loadLive2D();
		// 加载后隐藏按钮
		toggle.style.display = "none";
	});
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
	console.log("页面加载完成，创建Live2D加载按钮");
	
	// 移动设备检测
	if (screen.width < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		console.log("移动设备上不显示Live2D加载按钮");
		return;
	}
	
	// 创建加载按钮而不是自动加载
	createLive2DToggle();
});

// 监控网络错误，在控制台输出更多信息
window.addEventListener('error', function(e) {
	if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
		console.error('资源加载失败:', e.target.src || e.target.href);
	}
}, true);
