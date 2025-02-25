// 使用相对路径，适合GitHub Pages环境
const live2d_path = "./";

// 添加调试信息
console.log("Live2D初始化开始，路径:", live2d_path);

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
	console.log(`尝试加载资源: ${url} (${type})`);
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
			tag.onload = () => {
				console.log(`资源加载成功: ${url}`);
				resolve(url);
			};
			tag.onerror = (e) => {
				console.error("加载资源失败:", url, e);
				reject(url);
			};
			document.head.appendChild(tag);
		}
	});
}

// 创建看板娘DOM结构
function createLive2DMarkup() {
	console.log("开始创建Live2D DOM结构");
	
	// 检查是否已存在waifu元素
	if (document.getElementById("waifu")) {
		console.log("Live2D DOM结构已存在，跳过创建");
		return;
	}
	
	const waifuDiv = document.createElement("div");
	waifuDiv.id = "waifu";
	waifuDiv.innerHTML = `
		<div id="waifu-tips"></div>
		<canvas id="live2d" width="300" height="300"></canvas>
		<div id="waifu-tool">
			<span class="fa fa-times"></span>
		</div>
	`;
	document.body.appendChild(waifuDiv);
	
	// 初始样式
	waifuDiv.style.position = "fixed";
	waifuDiv.style.bottom = "0";
	waifuDiv.style.right = "0";
	waifuDiv.style.zIndex = "1000";
	waifuDiv.style.width = "300px";
	waifuDiv.style.height = "300px";
	waifuDiv.style.transition = "all .3s ease-in-out";
	waifuDiv.style.display = "block"; // 确保显示
	
	console.log("Live2D DOM结构已创建完成");
}

// 直接加载必要的资源
if (screen.width >= 768) {
	// 首先创建DOM结构
	document.addEventListener("DOMContentLoaded", () => {
		console.log("页面DOM已加载，开始创建Live2D结构");
		createLive2DMarkup();
		
		Promise.all([
			loadExternalResource(live2d_path + "waifu.css", "css"),
			loadExternalResource(live2d_path + "live2d.min.js", "js")
		]).then(() => {
			console.log("基础资源加载完成，准备加载waifu-tips.js");
			// 确保live2d.min.js加载完成后再加载waifu-tips.js
			loadExternalResource(live2d_path + "waifu-tips.js", "js").then(() => {
				// 确保所有资源都加载完成后再初始化
				console.log("所有Live2D资源加载完成，开始初始化...");
				
				// 显示看板娘
				const waifu = document.getElementById("waifu");
				if (waifu) {
					waifu.style.display = "block";
					console.log("看板娘元素已显示");
				} else {
					console.error("找不到waifu元素!");
				}
				
				// 初始化Live2D模型
				initModel();
			}).catch(error => {
				console.error("加载waifu-tips.js失败:", error);
			});
		}).catch(error => {
			console.error("加载基础Live2D资源失败:", error);
		});
	});
}

// 初始化模型
function initModel() {
	console.log("开始初始化Live2D模型");
	
	// 检查canvas元素是否存在
	const canvas = document.getElementById("live2d");
	if (!canvas) {
		console.error("找不到live2d canvas元素!");
		return;
	}
	
	// 检查loadlive2d函数是否存在
	if (typeof loadlive2d !== "function") {
		console.error("loadlive2d函数未定义! 请确保live2d.min.js已正确加载");
		return;
	}
	
	try {
		// 直接加载默认模型 - 使用本地模型
		const modelPath = `${live2d_path}live2d_models/shizuku/shizuku.model.json`;
		console.log("尝试加载模型:", modelPath);
		loadlive2d("live2d", modelPath);
		console.log("Live2D模型加载完成");
		
		// 设置工具栏按钮事件
		setupTools();
	} catch (e) {
		console.error("初始化Live2D模型失败:", e);
	}
}

// 设置工具栏按钮事件
function setupTools() {
	console.log("设置工具栏按钮事件");
	const waifuTool = document.getElementById("waifu-tool");
	if (!waifuTool) {
		console.error("找不到waifu-tool元素!");
		return;
	}
	
	const tools = waifuTool.querySelectorAll("span");
	console.log(`找到 ${tools.length} 个工具按钮`);
	
	// 关闭按钮
	if (tools[0]) {
		tools[0].addEventListener("click", () => {
			console.log("点击了关闭按钮");
			const waifu = document.getElementById("waifu");
			if (waifu) {
				waifu.style.display = "none";
				console.log("已隐藏看板娘");
			} else {
				console.error("找不到waifu元素!");
			}
		});
	} else {
		console.warn("找不到关闭按钮!");
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
