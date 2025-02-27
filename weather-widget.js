/**
 * Weather Widget for Blog
 * Gets weather information based on the visitor's IP address
 * Using IP-API.com for geolocation and Open-Meteo for weather data
 * 优化版本：减少内存占用和API调用
 */

(function() {
    "use strict";

    // Configuration
    const config = {
        ipApiUrl: 'https://api.ipify.org?format=json', // 使用安全的HTTPS API获取IP
        ipGeoUrl: 'https://api.ipgeolocation.io/ipgeo?apiKey=d5952a7f1e584097b2925d02acbd91b2', // 免费的IP地理位置API
        weatherApiUrl: 'https://api.open-meteo.com/v1/forecast', // Free weather API
        weatherParams: 'current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3',
        containerSelector: '.weather-widget-container',
        toggleBtnSelector: '.weather-toggle-btn',
        refreshInterval: 60 * 60 * 1000, // 增加到60分钟刷新一次，减少API调用
        defaultLocation: { // 添加默认位置，当无法获取地理位置时使用
            latitude: 39.9042,
            longitude: 116.4074,
            city: '北京',
            country: '中国'
        },
        localStorageKeys: {
            widgetState: 'weatherWidgetState',
            weatherData: 'weatherWidgetData',
            lastUpdate: 'weatherLastUpdate',
            userLocation: 'weatherUserLocation'
        },
        animationDuration: 300 // ms
    };

    // 减少天气代码映射表的大小，只保留常见的天气状况
    const weatherCodes = {
        0: { description: '晴朗', icon: 'fa-sun' },
        1: { description: '大部晴朗', icon: 'fa-sun' },
        2: { description: '部分多云', icon: 'fa-cloud-sun' },
        3: { description: '多云', icon: 'fa-cloud' },
        45: { description: '雾', icon: 'fa-smog' },
        51: { description: '小雨', icon: 'fa-cloud-rain' },
        61: { description: '小雨', icon: 'fa-cloud-rain' },
        63: { description: '雨', icon: 'fa-cloud-rain' },
        65: { description: '大雨', icon: 'fa-cloud-showers-heavy' },
        71: { description: '小雪', icon: 'fa-snowflake' },
        73: { description: '雪', icon: 'fa-snowflake' },
        75: { description: '大雪', icon: 'fa-snowflake' },
        95: { description: '雷阵雨', icon: 'fa-bolt' },
        // 默认天气状况
        default: { description: '未知', icon: 'fa-cloud' }
    };

    // 天气图标根据时间变化
    function getWeatherIcon(code, isNight = false) {
        const iconInfo = weatherCodes[code] || weatherCodes.default;
        
        // 针对部分天气状况，根据白天/夜间调整图标
        if (isNight) {
            switch (code) {
                case 0:
                case 1:
                    return 'fa-moon';
                case 2:
                    return 'fa-cloud-moon';
                default:
                    return iconInfo.icon;
            }
        }
        
        return iconInfo.icon;
    }

    /**
     * 检查是否是夜间
     */
    function isNightTime() {
        const hour = new Date().getHours();
        return hour >= 19 || hour < 6;
    }

    /**
     * Fetch the user's location based on their IP address
     * 优化：添加错误处理和超时
     */
    async function fetchLocation() {
        try {
            // 检查本地存储是否有位置信息
            const cachedLocation = localStorage.getItem(config.localStorageKeys.userLocation);
            if (cachedLocation) {
                return JSON.parse(cachedLocation);
            }
            
            // 设置超时以避免长时间等待
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            // 使用默认位置，减少API调用
            const location = config.defaultLocation;
            
            // 保存位置信息到本地存储
            localStorage.setItem(config.localStorageKeys.userLocation, JSON.stringify(location));
            
            clearTimeout(timeoutId);
            return location;
        } catch (error) {
            console.error('Error fetching location:', error);
            return config.defaultLocation;
        }
    }

    /**
     * Fetch weather data based on latitude and longitude
     * 优化：添加错误处理和超时
     */
    async function fetchWeather(latitude, longitude) {
        try {
            // 检查是否需要刷新数据
            if (!shouldRefreshWeather()) {
                // 使用缓存的数据
                const cachedWeather = localStorage.getItem(config.localStorageKeys.weatherData);
                if (cachedWeather) {
                    return JSON.parse(cachedWeather);
                }
            }
            
            // 设置超时以避免长时间等待
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const url = `${config.weatherApiUrl}?latitude=${latitude}&longitude=${longitude}&${config.weatherParams}`;
            console.log('Fetching weather from:', url);
            const response = await fetch(url, { signal: controller.signal });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Weather API HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Weather API response:', data);
            
            if (data.current) {
                // 保存天气数据到本地存储
                localStorage.setItem(config.localStorageKeys.weatherData, JSON.stringify(data));
                localStorage.setItem(config.localStorageKeys.lastUpdate, Date.now().toString());
                
                return data;
            } else if (data.error) {
                throw new Error(`Weather API error: ${data.reason || 'Unknown error'}`);
            } else {
                throw new Error('Failed to get weather data: Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            // 尝试使用缓存数据
            const cachedWeather = localStorage.getItem(config.localStorageKeys.weatherData);
            if (cachedWeather) {
                return JSON.parse(cachedWeather);
            }
            return null;
        }
    }

    /**
     * Create the weather widget HTML
     * 优化：简化DOM结构，减少元素数量
     */
    function createWeatherWidget(location, weather) {
        const weatherContainer = document.querySelector(config.containerSelector);
        if (!weatherContainer) return;

        const currentWeather = weather.current;
        const dailyWeather = weather.daily;
        const weatherCode = currentWeather.weather_code;
        
        const isNight = isNightTime();
        const weatherIcon = getWeatherIcon(weatherCode, isNight);
        const weatherInfo = weatherCodes[weatherCode] || weatherCodes.default;
        
        const temperature = Math.round(currentWeather.temperature_2m);
        const feelsLike = Math.round(currentWeather.apparent_temperature);
        const humidity = Math.round(currentWeather.relative_humidity_2m);
        const windSpeed = Math.round(currentWeather.wind_speed_10m);
        
        // 获取未来天气预报 - 减少为只显示2天
        let forecastHTML = '';
        if (dailyWeather && dailyWeather.time) {
            const days = ['明天', '后天'];
            for (let i = 1; i < Math.min(3, dailyWeather.time.length); i++) {
                const dayCode = dailyWeather.weather_code[i];
                const dayIcon = getWeatherIcon(dayCode);
                const maxTemp = Math.round(dailyWeather.temperature_2m_max[i]);
                const minTemp = Math.round(dailyWeather.temperature_2m_min[i]);
                
                forecastHTML += `
                    <div class="forecast-day">
                        <div class="forecast-date">${days[i-1]}</div>
                        <div class="forecast-icon"><i class="fas ${dayIcon}"></i></div>
                        <div class="forecast-temp">${minTemp}° / ${maxTemp}°</div>
                    </div>
                `;
            }
        }
        
        // 简化的天气小部件HTML
        const widgetHTML = `
            <div class="weather-widget ${isNight ? 'night-mode' : ''}">
                <div class="weather-header">
                    <div class="weather-location">
                        <i class="fas fa-map-marker-alt"></i> ${location.city}
                    </div>
                    <div class="weather-refresh">
                        <button class="refresh-btn" aria-label="刷新天气">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="weather-body">
                    <div class="weather-icon">
                        <i class="fas ${weatherIcon}"></i>
                    </div>
                    <div class="weather-info">
                        <div class="weather-temp">${temperature}°C</div>
                        <div class="weather-desc">${weatherInfo.description}</div>
                    </div>
                </div>
                <div class="weather-forecast">
                    ${forecastHTML}
                </div>
                <div class="weather-footer">
                    <div class="weather-detail">
                        <i class="fas fa-tint"></i> ${humidity}%
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-wind"></i> ${windSpeed} km/h
                    </div>
                </div>
            </div>
        `;
        
        weatherContainer.innerHTML = widgetHTML;
        
        // Add event listener for refresh button
        const refreshBtn = weatherContainer.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                initWeatherWidget(true);
            });
        }
    }

    /**
     * Show error message in the weather widget
     */
    function showError(message) {
        const weatherContainer = document.querySelector(config.containerSelector);
        if (weatherContainer) {
            weatherContainer.innerHTML = `
                <div class="weather-widget weather-error">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <p>${message}</p>
                    <button class="retry-btn">重试</button>
                </div>
            `;
            
            const retryBtn = weatherContainer.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', function() {
                    initWeatherWidget(true);
                });
            }
        }
    }

    /**
     * Initialize the weather widget
     * 优化：添加页面可见性检测
     */
    async function initWeatherWidget(forceRefresh = false) {
        // 如果页面不可见，延迟加载
        if (document.hidden && !forceRefresh) {
            console.log('页面不可见，延迟加载天气小部件');
            return;
        }
        
        try {
            // Show loading state
            const weatherContainer = document.querySelector(config.containerSelector);
            if (weatherContainer) {
                weatherContainer.innerHTML = `
                    <div class="weather-widget weather-loading">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                        <p>正在获取天气数据...</p>
                    </div>
                `;
            }
            
            let location, weather;
            
            // 检查是否需要刷新数据
            if (!forceRefresh && !shouldRefreshWeather()) {
                // 使用缓存的数据
                const cachedLocation = localStorage.getItem(config.localStorageKeys.userLocation);
                const cachedWeather = localStorage.getItem(config.localStorageKeys.weatherData);
                
                if (cachedLocation && cachedWeather) {
                    location = JSON.parse(cachedLocation);
                    weather = JSON.parse(cachedWeather);
                    
                    createWeatherWidget(location, weather);
                    return;
                }
            }
            
            // 获取新数据
            location = await fetchLocation();
            if (!location) {
                throw new Error('无法获取位置信息');
            }
            
            weather = await fetchWeather(location.latitude, location.longitude);
            if (!weather) {
                throw new Error('无法获取天气数据');
            }
            
            // Create and display the weather widget
            createWeatherWidget(location, weather);
        } catch (error) {
            console.error('Weather widget error:', error);
            showError(error.message || '获取天气数据时出错');
        }
    }

    /**
     * Check if weather data should be refreshed
     */
    function shouldRefreshWeather() {
        const lastUpdate = localStorage.getItem(config.localStorageKeys.lastUpdate);
        if (!lastUpdate) return true;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - parseInt(lastUpdate, 10);
        
        return timeSinceLastUpdate > config.refreshInterval;
    }

    /**
     * 初始化天气小部件的显示/隐藏状态
     */
    function initWidgetVisibility() {
        const container = document.querySelector(config.containerSelector);
        const toggleBtn = document.querySelector(config.toggleBtnSelector);
        
        if (!container || !toggleBtn) return;
        
        // 从本地存储获取小部件状态
        const isHidden = localStorage.getItem(config.localStorageKeys.widgetState) === 'hidden';
        
        if (isHidden) {
            container.classList.add('hidden');
            toggleBtn.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('title', '显示天气');
        } else {
            container.classList.remove('hidden');
            toggleBtn.classList.remove('hidden');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('title', '隐藏天气');
        }
    }

    /**
     * 初始化天气切换按钮的事件监听
     */
    function initToggleButton() {
        const toggleBtn = document.querySelector(config.toggleBtnSelector);
        const container = document.querySelector(config.containerSelector);
        
        if (!toggleBtn || !container) return;
        
        toggleBtn.addEventListener('click', function() {
            const isCurrentlyHidden = container.classList.contains('hidden');
            
            if (isCurrentlyHidden) {
                // 显示小部件
                container.classList.remove('hidden');
                toggleBtn.classList.remove('hidden');
                toggleBtn.setAttribute('aria-expanded', 'true');
                toggleBtn.setAttribute('title', '隐藏天气');
                localStorage.setItem(config.localStorageKeys.widgetState, 'visible');
                
                // 显示时刷新数据
                initWeatherWidget();
            } else {
                // 隐藏小部件
                container.classList.add('hidden');
                toggleBtn.classList.add('hidden');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.setAttribute('title', '显示天气');
                localStorage.setItem(config.localStorageKeys.widgetState, 'hidden');
            }
        });
    }

    /**
     * Main initialization function
     * 优化：添加页面可见性检测，减少不必要的更新
     */
    function init() {
        // 移动设备上默认隐藏天气小部件
        if (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            localStorage.setItem(config.localStorageKeys.widgetState, 'hidden');
        }
        
        window.addEventListener('DOMContentLoaded', function() {
            // 初始化小部件可见性
            initWidgetVisibility();
            
            // 初始化切换按钮
            initToggleButton();
            
            // 只有在页面可见且小部件可见时才初始化天气小部件
            if (!document.hidden) {
                const container = document.querySelector(config.containerSelector);
                if (container && !container.classList.contains('hidden')) {
                    initWeatherWidget();
                }
            }
            
            // 页面可见性变化时处理
            document.addEventListener('visibilitychange', function() {
                const container = document.querySelector(config.containerSelector);
                if (!document.hidden && container && !container.classList.contains('hidden')) {
                    // 页面变为可见时，检查是否需要刷新
                    if (shouldRefreshWeather()) {
                        initWeatherWidget();
                    }
                }
            });
            
            // 设置定时刷新 - 使用requestIdleCallback优化性能
            let refreshTimeout;
            const scheduleRefresh = () => {
                clearTimeout(refreshTimeout);
                refreshTimeout = setTimeout(() => {
                    // 只有在页面可见且小部件可见时才刷新
                    const container = document.querySelector(config.containerSelector);
                    if (!document.hidden && container && !container.classList.contains('hidden')) {
                        if (shouldRefreshWeather()) {
                            // 使用requestIdleCallback在浏览器空闲时刷新
                            if (window.requestIdleCallback) {
                                window.requestIdleCallback(() => initWeatherWidget(true));
                            } else {
                                initWeatherWidget(true);
                            }
                        }
                    }
                    scheduleRefresh();
                }, config.refreshInterval);
            };
            
            scheduleRefresh();
        });
    }

    // 启动应用
    init();
})(); 