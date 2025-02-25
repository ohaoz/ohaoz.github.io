/**
 * Weather Widget Debug Tool
 * This script helps capture and display error logs from the weather widget
 */

(function() {
    "use strict";

    // Store original console methods
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };

    // Log storage
    const logs = {
        all: [],
        errors: []
    };

    // Override console methods to capture logs
    console.log = function(...args) {
        logs.all.push({
            type: 'log',
            timestamp: new Date().toISOString(),
            message: args
        });
        originalConsole.log.apply(console, args);
    };

    console.warn = function(...args) {
        logs.all.push({
            type: 'warn',
            timestamp: new Date().toISOString(),
            message: args
        });
        originalConsole.warn.apply(console, args);
    };

    console.error = function(...args) {
        const logEntry = {
            type: 'error',
            timestamp: new Date().toISOString(),
            message: args
        };
        logs.all.push(logEntry);
        logs.errors.push(logEntry);
        originalConsole.error.apply(console, args);
    };

    // Capture fetch errors
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        try {
            const response = await originalFetch.apply(this, args);
            // Log successful requests
            console.log(`Fetch request to ${args[0]} completed with status: ${response.status}`);
            return response;
        } catch (error) {
            // Log failed requests
            console.error(`Fetch request to ${args[0]} failed:`, error);
            throw error;
        }
    };

    // Create debug UI
    function createDebugUI() {
        const debugContainer = document.createElement('div');
        debugContainer.className = 'weather-debug-container';
        debugContainer.innerHTML = `
            <div class="weather-debug-panel">
                <div class="debug-header">
                    <h3>Weather Widget Debug</h3>
                    <div class="debug-controls">
                        <button id="debug-toggle-btn">Hide</button>
                        <button id="debug-clear-btn">Clear Logs</button>
                        <button id="debug-test-btn">Test APIs</button>
                    </div>
                </div>
                <div class="debug-body">
                    <div class="debug-tabs">
                        <button class="debug-tab-btn active" data-tab="all">All Logs</button>
                        <button class="debug-tab-btn" data-tab="errors">Errors</button>
                        <button class="debug-tab-btn" data-tab="network">Network</button>
                    </div>
                    <div class="debug-content">
                        <div id="debug-all-logs" class="debug-tab-content active"></div>
                        <div id="debug-errors" class="debug-tab-content"></div>
                        <div id="debug-network" class="debug-tab-content">
                            <div class="api-test-results">
                                <h4>API Test Results</h4>
                                <div id="ip-api-test-ipapi-co">IP API (ipapi.co): Not tested</div>
                                <div id="ip-api-test-ipify-org">IP API (ipify.org): Not tested</div>
                                <div id="ip-api-test-geolocation-db">IP API (geolocation-db): Not tested</div>
                                <div id="weather-test-result">Weather API: Not tested</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(debugContainer);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .weather-debug-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 600px;
                width: 90%;
                font-family: monospace;
            }
            .weather-debug-panel {
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            .debug-header {
                padding: 10px;
                background: #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .debug-header h3 {
                margin: 0;
                font-size: 16px;
            }
            .debug-controls {
                display: flex;
                gap: 5px;
            }
            .debug-controls button {
                background: #555;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            .debug-controls button:hover {
                background: #777;
            }
            .debug-body {
                max-height: 300px;
                overflow: auto;
            }
            .debug-tabs {
                display: flex;
                background: #222;
            }
            .debug-tab-btn {
                background: none;
                border: none;
                color: #aaa;
                padding: 8px 15px;
                cursor: pointer;
                font-size: 14px;
            }
            .debug-tab-btn.active {
                background: #444;
                color: white;
            }
            .debug-tab-content {
                display: none;
                padding: 10px;
                font-size: 12px;
            }
            .debug-tab-content.active {
                display: block;
            }
            .log-entry {
                margin-bottom: 8px;
                border-bottom: 1px solid #333;
                padding-bottom: 8px;
            }
            .log-entry-time {
                color: #888;
                font-size: 11px;
            }
            .log-entry-type {
                display: inline-block;
                padding: 2px 5px;
                border-radius: 3px;
                margin-right: 5px;
                font-size: 11px;
            }
            .log-type-log {
                background: #2c5282;
                color: white;
            }
            .log-type-warn {
                background: #c05621;
                color: white;
            }
            .log-type-error {
                background: #c53030;
                color: white;
            }
            .log-entry-message {
                word-break: break-all;
            }
            .api-test-results {
                padding: 10px;
            }
            .api-test-results h4 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .api-test-success {
                color: #48bb78;
            }
            .api-test-error {
                color: #f56565;
            }
            .minimized .debug-body {
                display: none;
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        setupDebugEventListeners();
        updateLogDisplay();
    }

    // Setup event listeners for debug UI
    function setupDebugEventListeners() {
        // Toggle debug panel
        const toggleBtn = document.getElementById('debug-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const panel = document.querySelector('.weather-debug-panel');
                panel.classList.toggle('minimized');
                this.textContent = panel.classList.contains('minimized') ? 'Show' : 'Hide';
            });
        }

        // Clear logs
        const clearBtn = document.getElementById('debug-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                logs.all = [];
                logs.errors = [];
                updateLogDisplay();
            });
        }

        // Tab switching
        const tabBtns = document.querySelectorAll('.debug-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all tab content
                const tabContents = document.querySelectorAll('.debug-tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Show selected tab content
                const tabName = this.getAttribute('data-tab');
                document.getElementById(`debug-${tabName}`).classList.add('active');
            });
        });

        // Test APIs button
        const testBtn = document.getElementById('debug-test-btn');
        if (testBtn) {
            testBtn.addEventListener('click', testAPIs);
        }
    }

    // Update log display
    function updateLogDisplay() {
        // Update all logs tab
        const allLogsContainer = document.getElementById('debug-all-logs');
        if (allLogsContainer) {
            allLogsContainer.innerHTML = logs.all.map(createLogEntryHTML).join('');
        }
        
        // Update errors tab
        const errorsContainer = document.getElementById('debug-errors');
        if (errorsContainer) {
            errorsContainer.innerHTML = logs.errors.length > 0 
                ? logs.errors.map(createLogEntryHTML).join('')
                : '<p>No errors logged yet.</p>';
        }
    }

    // Create HTML for a log entry
    function createLogEntryHTML(log) {
        const time = new Date(log.timestamp).toLocaleTimeString();
        const typeClass = `log-type-${log.type}`;
        const message = typeof log.message[0] === 'string' 
            ? log.message[0]
            : JSON.stringify(log.message[0], null, 2);
            
        return `
            <div class="log-entry">
                <div class="log-entry-header">
                    <span class="log-entry-time">${time}</span>
                    <span class="log-entry-type ${typeClass}">${log.type.toUpperCase()}</span>
                </div>
                <div class="log-entry-message">${message}</div>
            </div>
        `;
    }

    // Test APIs
    async function testAPIs() {
        // Get IP APIs from the weather widget script
        const ipApis = [
            { name: 'ipapi.co', url: 'https://ipapi.co/json' },
            { name: 'ipify.org', url: 'https://api.ipify.org?format=json' },
            { name: 'geolocation-db', url: 'https://geolocation-db.com/json/' }
        ];
        
        // Create or update IP API test results container
        const networkTab = document.getElementById('debug-network');
        const apiTestResults = networkTab.querySelector('.api-test-results');
        
        // Clear existing IP API test results
        const existingIpResults = apiTestResults.querySelectorAll('[id^="ip-api-test-"]');
        existingIpResults.forEach(el => el.remove());
        
        // Add new IP API test results elements
        let ipResultsHTML = '';
        ipApis.forEach(api => {
            ipResultsHTML += `<div id="ip-api-test-${api.name.replace(/\./g, '-')}">IP API (${api.name}): Not tested</div>`;
        });
        
        // Insert IP API test results before weather test result
        const weatherTestResult = document.getElementById('weather-test-result');
        weatherTestResult.insertAdjacentHTML('beforebegin', ipResultsHTML);
        
        // Test each IP API
        for (const api of ipApis) {
            const apiResultElement = document.getElementById(`ip-api-test-${api.name.replace(/\./g, '-')}`);
            apiResultElement.textContent = `IP API (${api.name}): Testing...`;
            apiResultElement.className = '';
            
            try {
                const response = await fetch(api.url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (api.name === 'ipapi.co' && data.ip) {
                    apiResultElement.textContent = `IP API (${api.name}): Success (IP: ${data.ip}, Location: ${data.city || 'Unknown'})`;
                    apiResultElement.className = 'api-test-success';
                } else if (api.name === 'ipify.org' && data.ip) {
                    apiResultElement.textContent = `IP API (${api.name}): Success (IP: ${data.ip})`;
                    apiResultElement.className = 'api-test-success';
                } else if (api.name === 'geolocation-db' && data.IPv4) {
                    apiResultElement.textContent = `IP API (${api.name}): Success (IP: ${data.IPv4}, Country: ${data.country_name || 'Unknown'})`;
                    apiResultElement.className = 'api-test-success';
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                apiResultElement.textContent = `IP API (${api.name}): Error - ${error.message}`;
                apiResultElement.className = 'api-test-error';
                console.error(`${api.name} API test failed:`, error);
            }
        }
        
        // Test Weather API
        const weatherResult = document.getElementById('weather-test-result');
        weatherResult.textContent = 'Weather API: Testing...';
        weatherResult.className = '';
        
        try {
            // Use Beijing coordinates for testing
            const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code_max&timezone=auto';
            const weatherResponse = await fetch(weatherUrl);
            
            if (!weatherResponse.ok) {
                throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
            }
            
            const weatherData = await weatherResponse.json();
            
            if (weatherData && weatherData.current && weatherData.current.temperature_2m !== undefined) {
                weatherResult.textContent = `Weather API: Success (Temp: ${weatherData.current.temperature_2m}°C)`;
                weatherResult.className = 'api-test-success';
            } else {
                throw new Error(weatherData.reason || 'Invalid response format');
            }
        } catch (error) {
            weatherResult.textContent = `Weather API: Error - ${error.message}`;
            weatherResult.className = 'api-test-error';
            console.error('Weather API test failed:', error);
        }
    }

    // Initialize debug tool
    function init() {
        // Create debug UI after a short delay to ensure the page is loaded
        setTimeout(createDebugUI, 1000);
        
        // Log initial information
        console.log('Weather Debug Tool initialized');
        console.log('User Agent:', navigator.userAgent);
        console.log('Page URL:', window.location.href);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 