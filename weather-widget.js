/**
 * Weather Widget for Blog
 * Gets weather information based on the visitor's IP address
 * Using IP-API.com for geolocation and Open-Meteo for weather data
 */

(function() {
    "use strict";

    // Configuration
    const config = {
        ipApiUrl: 'https://api.ipify.org?format=json', // 使用安全的HTTPS API获取IP
        ipGeoUrl: 'https://api.ipgeolocation.io/ipgeo?apiKey=d5952a7f1e584097b2925d02acbd91b2', // 免费的IP地理位置API
        weatherApiUrl: 'https://api.open-meteo.com/v1/forecast', // Free weather API
        weatherParams: 'current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code&timezone=auto',
        containerSelector: '.weather-widget-container',
        refreshInterval: 30 * 60 * 1000, // 30 minutes in milliseconds
        defaultLocation: { // 添加默认位置，当无法获取地理位置时使用
            latitude: 39.9042,
            longitude: 116.4074,
            city: '北京',
            country: '中国'
        }
    };

    // Weather code to description and icon mapping
    const weatherCodes = {
        0: { description: '晴朗', icon: 'fa-sun' },
        1: { description: '大部晴朗', icon: 'fa-sun' },
        2: { description: '部分多云', icon: 'fa-cloud-sun' },
        3: { description: '多云', icon: 'fa-cloud' },
        45: { description: '雾', icon: 'fa-smog' },
        48: { description: '雾凇', icon: 'fa-smog' },
        51: { description: '小毛毛雨', icon: 'fa-cloud-rain' },
        53: { description: '毛毛雨', icon: 'fa-cloud-rain' },
        55: { description: '大毛毛雨', icon: 'fa-cloud-rain' },
        56: { description: '冻毛毛雨', icon: 'fa-cloud-rain' },
        57: { description: '大冻毛毛雨', icon: 'fa-cloud-rain' },
        61: { description: '小雨', icon: 'fa-cloud-rain' },
        63: { description: '雨', icon: 'fa-cloud-rain' },
        65: { description: '大雨', icon: 'fa-cloud-showers-heavy' },
        66: { description: '冻雨', icon: 'fa-cloud-rain' },
        67: { description: '大冻雨', icon: 'fa-cloud-showers-heavy' },
        71: { description: '小雪', icon: 'fa-snowflake' },
        73: { description: '雪', icon: 'fa-snowflake' },
        75: { description: '大雪', icon: 'fa-snowflake' },
        77: { description: '冰粒', icon: 'fa-snowflake' },
        80: { description: '小阵雨', icon: 'fa-cloud-rain' },
        81: { description: '阵雨', icon: 'fa-cloud-rain' },
        82: { description: '强阵雨', icon: 'fa-cloud-showers-heavy' },
        85: { description: '小阵雪', icon: 'fa-snowflake' },
        86: { description: '阵雪', icon: 'fa-snowflake' },
        95: { description: '雷阵雨', icon: 'fa-bolt' },
        96: { description: '雷阵雨伴有冰雹', icon: 'fa-cloud-meatball' },
        99: { description: '强雷阵雨伴有冰雹', icon: 'fa-cloud-meatball' }
    };

    /**
     * Fetch the user's location based on their IP address
     */
    async function fetchLocation() {
        try {
            // 简化地理位置获取过程，直接使用免费API
            const geoUrl = 'https://ipapi.co/json/';
            console.log('Fetching location from:', geoUrl);
            
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            
            console.log('Location API response:', geoData);
            
            if (geoResponse.ok && geoData.latitude && geoData.longitude) {
                return {
                    latitude: geoData.latitude,
                    longitude: geoData.longitude,
                    city: geoData.city || '未知城市',
                    country: geoData.country_name || geoData.country || '未知国家'
                };
            } else {
                console.warn('Geolocation API error:', geoData);
                return config.defaultLocation;
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            return config.defaultLocation; // 出错时使用默认位置
        }
    }

    /**
     * Fetch weather data based on latitude and longitude
     */
    async function fetchWeather(latitude, longitude) {
        try {
            const url = `${config.weatherApiUrl}?latitude=${latitude}&longitude=${longitude}&${config.weatherParams}`;
            console.log('Fetching weather from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Weather API response:', data);
            
            if (data.current) {
                return data;
            } else if (data.error) {
                throw new Error(`Weather API error: ${data.reason || 'Unknown error'}`);
            } else {
                throw new Error('Failed to get weather data: Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    }

    /**
     * Create the weather widget HTML
     */
    function createWeatherWidget(location, weather) {
        const weatherContainer = document.querySelector(config.containerSelector);
        if (!weatherContainer) return;

        const currentWeather = weather.current;
        const weatherCode = currentWeather.weather_code;
        const weatherInfo = weatherCodes[weatherCode] || { description: '未知', icon: 'fa-question' };
        
        const temperature = Math.round(currentWeather.temperature_2m);
        const humidity = Math.round(currentWeather.relative_humidity_2m);
        const windSpeed = Math.round(currentWeather.wind_speed_10m);
        
        const widgetHTML = `
            <div class="weather-widget">
                <div class="weather-header">
                    <div class="weather-location">
                        <i class="fas fa-map-marker-alt"></i> ${location.city}, ${location.country}
                    </div>
                    <div class="weather-refresh">
                        <button class="refresh-btn" aria-label="刷新天气">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="weather-body">
                    <div class="weather-icon">
                        <i class="fas ${weatherInfo.icon}"></i>
                    </div>
                    <div class="weather-info">
                        <div class="weather-temp">${temperature}°C</div>
                        <div class="weather-desc">${weatherInfo.description}</div>
                    </div>
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
        
        // 缓存天气小部件的HTML内容
        localStorage.setItem('weatherWidgetHTML', widgetHTML);
        // 更新最后更新时间戳
        localStorage.setItem('weatherLastUpdate', Date.now().toString());
        
        // Add event listener for refresh button
        const refreshBtn = weatherContainer.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', initWeatherWidget);
        }
    }

    /**
     * Show error message in the widget container
     */
    function showError(message) {
        const weatherContainer = document.querySelector(config.containerSelector);
        if (!weatherContainer) return;
        
        weatherContainer.innerHTML = `
            <div class="weather-widget weather-error">
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                </div>
                <button class="refresh-btn" aria-label="重试">
                    <i class="fas fa-sync-alt"></i> 重试
                </button>
            </div>
        `;
        
        // Add event listener for refresh button
        const refreshBtn = weatherContainer.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', initWeatherWidget);
        }
    }

    /**
     * Initialize the weather widget
     */
    async function initWeatherWidget() {
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
            
            // Fetch location data
            const location = await fetchLocation();
            if (!location) {
                throw new Error('无法获取位置信息');
            }
            
            // Fetch weather data
            const weather = await fetchWeather(location.latitude, location.longitude);
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
        const lastUpdate = localStorage.getItem('weatherLastUpdate');
        if (!lastUpdate) return true;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - parseInt(lastUpdate, 10);
        
        return timeSinceLastUpdate > config.refreshInterval;
    }

    /**
     * Initialize the module when DOM is ready
     */
    function init() {
        // Check if weather widget container exists
        const weatherContainer = document.querySelector(config.containerSelector);
        if (!weatherContainer) {
            console.warn('Weather widget container not found');
            return;
        }
        
        // 初始化天气切换按钮功能
        initToggleButton();
        
        // Load weather data if needed
        if (shouldRefreshWeather()) {
            initWeatherWidget();
        } else {
            // Try to use cached data if available, otherwise fetch new data
            const cachedHTML = localStorage.getItem('weatherWidgetHTML');
            if (cachedHTML) {
                weatherContainer.innerHTML = cachedHTML;
                
                // Add event listener for refresh button
                const refreshBtn = weatherContainer.querySelector('.refresh-btn');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', initWeatherWidget);
                }
            } else {
                initWeatherWidget();
            }
        }
    }
    
    /**
     * 初始化天气小部件的显示/隐藏功能
     */
    function initToggleButton() {
        const toggleBtn = document.querySelector('.weather-toggle-btn');
        const weatherContainer = document.querySelector(config.containerSelector);
        
        if (!toggleBtn || !weatherContainer) return;
        
        // 检查本地存储中的显示状态
        const isHidden = localStorage.getItem('weatherWidgetHidden') === 'true';
        
        // 初始状态
        if (isHidden) {
            weatherContainer.classList.add('hidden');
            toggleBtn.classList.add('hidden');
        }
        
        // 点击切换按钮时的行为
        toggleBtn.addEventListener('click', () => {
            weatherContainer.classList.toggle('hidden');
            toggleBtn.classList.toggle('hidden');
            
            // 保存状态到本地存储
            const isCurrentlyHidden = weatherContainer.classList.contains('hidden');
            localStorage.setItem('weatherWidgetHidden', isCurrentlyHidden.toString());
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 