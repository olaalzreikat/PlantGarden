  // =======================================================
        // Theme System
        // =======================================================
        const themeSystem = {
            currentTheme: 'dark',
            
            // Theme color variables
            themes: {
                dark: {
                    primaryColor: '#5d3fd3',
                    secondaryColor: '#8066dc',
                    accentColor: '#ff5470',
                    backgroundDark: '#0f1c2e',
                    backgroundMedium: '#1f2f47',
                    backgroundLight: '#2f3f57',
                    textLight: '#e2e6fc',
                    textMedium: '#a5afd0',
                    textDark: '#67718d',
                    successColor: '#42caaa',
                    warningColor: '#ffcb47',
                    dangerColor: '#ff5757'
                },
                light: {
                    primaryColor: '#6a4ee3',
                    secondaryColor: '#9580e0',
                    accentColor: '#ff7085',
                    backgroundDark: '#f0f4fa',
                    backgroundMedium: '#e0e6f5',
                    backgroundLight: '#d0d8ed',
                    textLight: '#111827',
                    textMedium: '#374151',
                    textDark: '#6b7280',
                    successColor: '#10b981',
                    warningColor: '#f59e0b',
                    dangerColor: '#ef4444'
                }
            },
            
            // Initialize theme
            init() {
                // Check saved theme preference
                const savedTheme = localStorage.getItem('celestialGardenTheme');
                if (savedTheme) {
                    this.currentTheme = savedTheme;
                } else {
                    // Check system preference
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                        this.currentTheme = 'light';
                    }
                }
                
                // Apply theme
                this.applyTheme();
                
                // Add theme toggle to header
                this.addThemeToggle();
            },
            
            // Apply current theme to document
            applyTheme() {
                const root = document.documentElement;
                const theme = this.themes[this.currentTheme];
                
                // Apply theme variables to CSS
                for (const [key, value] of Object.entries(theme)) {
                    // Convert camelCase to kebab-case for CSS variables
                    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    root.style.setProperty(`--${cssVar}`, value);
                }
                
                // Add theme class to body
                document.body.classList.remove('theme-dark', 'theme-light');
                document.body.classList.add(`theme-${this.currentTheme}`);
                
                // Save theme preference
                localStorage.setItem('celestialGardenTheme', this.currentTheme);
            },
            
            // Toggle between light and dark themes
            toggleTheme() {
                this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme();
            },
            
            // Add theme toggle button to header
            addThemeToggle() {
                const playerInfo = document.querySelector('.player-info');
                
                const themeToggle = document.createElement('button');
                themeToggle.classList.add('theme-toggle');
                themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
                themeToggle.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`;
                
                themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                    themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
                    themeToggle.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`;
                });
                
                playerInfo.appendChild(themeToggle);
            }
        };

        // =======================================================
        // Cookie Consent System
        // =======================================================
        const cookieConsent = {
            consentGiven: false,
            
            init() {
                // Check if consent was previously given
                const consent = localStorage.getItem('celestialGardenCookieConsent');
                
                if (consent === 'accepted') {
                    this.consentGiven = true;
                    return;
                }
                
                this.showConsentPopup();
            },
            
            showConsentPopup() {
                const cookiePopup = document.createElement('div');
                cookiePopup.classList.add('cookie-consent');
                
                cookiePopup.innerHTML = `
                    <div class="cookie-content">
                        <h3>Cookie Consent</h3>
                        <p>We use cookies to save your game progress and settings. By accepting,
                            <p>We use cookies to save your game progress and settings. By accepting, you agree to the use of cookies for these purposes.</p>
                        <div class="cookie-buttons">
                            <button id="accept-cookies" class="cookie-button accept">Accept</button>
                            <button id="decline-cookies" class="cookie-button decline">Decline</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(cookiePopup);
                
                // Add event listeners
                document.getElementById('accept-cookies').addEventListener('click', () => {
                    this.acceptCookies();
                    cookiePopup.remove();
                });
                
                document.getElementById('decline-cookies').addEventListener('click', () => {
                    this.declineCookies();
                    cookiePopup.remove();
                });
            },
            
            acceptCookies() {
                this.consentGiven = true;
                localStorage.setItem('celestialGardenCookieConsent', 'accepted');
                showToast('Cookie consent accepted. Your game progress will be saved.', 'success');
            },
            
            declineCookies() {
                this.consentGiven = false;
                localStorage.setItem('celestialGardenCookieConsent', 'declined');
                showToast('Cookie consent declined. Your game progress will not be saved.', 'warning');
            },
            
            canSave() {
                return this.consentGiven;
            }
        };

        // Game Data Structure
        const gameData = {
            // Player information
            player: {
                name: "Gardener",
                level: 1,
                experience: 0,
                experienceToNextLevel: 100
            },
            
            // Game settings
            settings: {
                soundEnabled: true,
                notificationsEnabled: true,
                debugMode: false
            },
            
            // Game resources
            resources: {
                energy: 50,
                minerals: 30,
                seeds: 200,
                research: 200
            },
            
            // Resource production rates
            resourceRates: {
                energy: 0,
                minerals: 0,
                seeds: 0,
                research: 0
            },
            
            // Garden environment settings
            environment: {
                radiation: 50,
                gravity: 50,
                atmosphere: 50
            },
            
            // Garden plots
            garden: [
                { id: 0, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 1, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 2, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 3, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 4, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 5, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 6, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 },
                { id: 7, plantId: null, growthProgress: 0, plantedTime: null, harvested: 0 }
            ],
            
            // Discovered plants
            discoveredPlants: [],
            
            // Completed research
            completedResearch: [],
            
            // Current selected plant for planting
            selectedPlant: null,
            
            // Current selected garden plot
            selectedPlot: null,
            
            // Last game save time
            lastSaveTime: Date.now(),
            
            // Last time resources were updated
            lastUpdateTime: Date.now(),
            
            // Game version
            version: "1.0.0"
        };
        
        // Plant Database
        const plantDatabase = [
            {
                id: "cosmo_bloom",
                name: "Cosmo Bloom",
                description: "A hardy cosmic flower that thrives in various conditions. Perfect for beginning gardeners.",
                rarity: "common",
                growthTime: 60, // seconds for testing, would be higher in production
                stages: ["seed", "sprout", "growth", "bloom"],
                optimalConditions: {
                    radiation: 50,
                    gravity: 50,
                    atmosphere: 50
                },
                tolerance: 30, // how much deviation from optimal the plant can handle
                yield: {
                    energy: 10,
                    minerals: 5,
                    seeds: 2,
                    research: 1
                },
                yieldMultiplier: 1.0, // base multiplier for resource yield
                unlockLevel: 1,
                seedCost: 5,
                colors: ["#8A2BE2", "#9370DB"],
                svg: `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="20" fill="#8A2BE2" />
                        <circle cx="50" cy="50" r="10" fill="#9370DB" />
                    </svg>
                `
            },
            {
                id: "stellar_fern",
                name: "Stellar Fern",
                description: "A delicate fern-like plant that absorbs cosmic radiation efficiently.",
                rarity: "common",
                growthTime: 90,
                stages: ["seed", "sprout", "growth", "mature"],
                optimalConditions: {
                    radiation: 70,
                    gravity: 30,
                    atmosphere: 60
                },
                tolerance: 25,
                yield: {
                    energy: 15,
                    minerals: 3,
                    seeds: 2,
                    research: 2
                },
                yieldMultiplier: 1.0,
                unlockLevel: 1,
                seedCost: 8,
                colors: ["#3CB371", "#98FB98"],
                svg: `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50,20 Q60,40 50,60 Q40,40 50,20" fill="#3CB371" />
                        <path d="M40,30 Q50,50 40,70 Q30,50 40,30" fill="#3CB371" />
                        <path d="M60,30 Q70,50 60,70 Q50,50 60,30" fill="#3CB371" />
                    </svg>
                `
            },
            {
                id: "lunar_crystalite",
                name: "Lunar Crystalite",
                description: "A crystalline plant that thrives in low gravity. Rich in minerals.",
                rarity: "uncommon",
                growthTime: 120,
                stages: ["seed", "cluster", "formation", "crystal"],
                optimalConditions: {
                    radiation: 40,
                    gravity: 20,
                    atmosphere: 30
                },
                tolerance: 20,
                yield: {
                    energy: 5,
                    minerals: 20,
                    seeds: 1,
                    research: 3
                },
                yieldMultiplier: 1.0,
                unlockLevel: 2,
                seedCost: 12,
                colors: ["#4682B4", "#ADD8E6"],
                svg: `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="50,20 60,40 50,60 40,40" fill="#4682B4" />
                        <polygon points="30,35 40,55 30,75 20,55" fill="#ADD8E6" />
                        <polygon points="70,35 80,55 70,75 60,55" fill="#ADD8E6" />
                    </svg>
                `
            },
            {
                id: "nebula_pod",
                name: "Nebula Pod",
                description: "A mysterious pod that produces an abundance of seeds. Requires special atmospheric conditions.",
                rarity: "uncommon",
                growthTime: 150,
                stages: ["seed", "bulb", "swelling", "pod"],
                optimalConditions: {
                    radiation: 30,
                    gravity: 60,
                    atmosphere: 80
                },
                tolerance: 15,
                yield: {
                    energy: 3,
                    minerals: 5,
                    seeds: 15,
                    research: 2
                },
                yieldMultiplier: 1.0,
                unlockLevel: 3,
                seedCost: 15,
                colors: ["#FF6347", "#FFA07A"],
                svg: `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="50" cy="50" rx="25" ry="20" fill="#FF6347" />
                        <circle cx="40" cy="45" r="5" fill="#FFA07A" />
                        <circle cx="50" cy="55" r="5" fill="#FFA07A" />
                        <circle cx="60" cy="45" r="5" fill="#FFA07A" />
                    </svg>
                `
            },
            {
                id: "void_orchid",
                name: "Void Orchid",
                description: "A rare orchid that thrives in extreme conditions. Produces significant research data.",
                rarity: "rare",
                growthTime: 180,
                stages: ["seed", "seedling", "bud", "bloom"],
                optimalConditions: {
                    radiation: 85,
                    gravity: 15,
                    atmosphere: 40
                },
                tolerance: 10,
                yield: {
                    energy: 8,
                    minerals: 8,
                    seeds: 3,
                    research: 15
                },
                yieldMultiplier: 1.0,
                unlockLevel: 5,
                seedCost: 25,
                colors: ["#800080", "#DDA0DD"],
                svg: `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50,20 C70,30 70,50 50,60 C30,50 30,30 50,20" fill="#800080" />
                        <path d="M40,40 C50,50 60,50 70,40 C60,60 40,60 30,40 C40,30 50,30 40,40" fill="#DDA0DD" />
                    </svg>
                `
            },
            {
                id: "plasma_willow",
                name: "Plasma Willow",
                description: "A highly energetic plant that harnesses cosmic radiation to produce abundant energy.",
                rarity: "rare",
                growthTime: 200,
                stages: ["seed", "sapling", "juvenile", "mature"],
                optimalConditions: {
                    radiation: 90,
                    gravity: 60,
                    atmosphere: 30
                },
                tolerance: 15,
                yield: {
                    energy: 25,
                    minerals: 5,
                    seeds: 2,
                    research: 5
                },
                yieldMultiplier: 1.0,
                unlockLevel: 7,
                seedCost: 30,
                colors: ["#00BFFF", "#87CEFA"],
                svg: `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <line x1="50" y1="20" x2="50" y2="70" stroke="#8B4513" stroke-width="3" />
                        <path d="M50,20 C70,30 80,20 90,25" stroke="#00BFFF" stroke-width="2" fill="none" />
                        <path d="M50,30 C70,40 80,30 90,35" stroke="#00BFFF" stroke-width="2" fill="none" />
                        <path d="M50,40 C70,50 80,40 90,45" stroke="#00BFFF" stroke-width="2" fill="none" />
                        <path d="M50,20 C30,30 20,20 10,25" stroke="#87CEFA" stroke-width="2" fill="none" />
                        <path d="M50,30 C30,40 20,30 10,35" stroke="#87CEFA" stroke-width="2" fill="none" />
                        <path d="M50,40 C30,50 20,40 10,45" stroke="#87CEFA" stroke-width="2" fill="none" />
                    </svg>
                `
            }
        ];
        
        // Research Database
        const researchDatabase = [
            {
                id: "basic_cultivation",
                name: "Basic Cultivation Techniques",
                description: "Fundamental understanding of cosmic plant care.",
                cost: 10,
                benefits: ["Unlocks Stellar Fern", "10% faster growth for all plants"],
                unlocked: true,
                completed: false,
                requiresResearch: []
            },
            {
                id: "mineral_extraction",
                name: "Mineral Extraction",
                description: "Methods to improve mineral yield from cosmic plants.",
                cost: 25,
                benefits: ["Unlocks Lunar Crystalite", "20% increased mineral yield"],
                unlocked: false,
                completed: false,
                requiresResearch: ["basic_cultivation"]
            },
            {
                id: "atmospheric_control",
                name: "Atmospheric Control",
                description: "Advanced techniques for manipulating garden atmosphere.",
                cost: 40,
                benefits: ["Unlocks Nebula Pod", "Atmosphere adjustments 20% more effective"],
                unlocked: false,
                completed: false,
                requiresResearch: ["basic_cultivation"]
            },
            {
                id: "radiation_harnessing",
                name: "Radiation Harnessing",
                description: "Methods to safely increase and utilize cosmic radiation.",
                cost: 60,
                benefits: ["Unlocks Void Orchid", "30% increased energy yield"],
                unlocked: false,
                completed: false,
                requiresResearch: ["basic_cultivation", "atmospheric_control"]
            },
            {
                id: "gravitic_manipulation",
                name: "Gravitic Manipulation",
                description: "Advanced techniques for controlling garden gravity.",
                cost: 75,
                benefits: ["Unlocks Plasma Willow", "Gravity adjustments 30% more effective"],
                unlocked: false,
                completed: false,
                requiresResearch: ["mineral_extraction", "radiation_harnessing"]
            }
        ];
        
        // Achievement Database
        const achievementDatabase = [
            {
                id: "first_plant",
                name: "Cosmic Gardener",
                description: "Plant your first cosmic flora.",
                unlocked: false
            },
            {
                id: "first_harvest",
                name: "First Harvest",
                description: "Successfully harvest your first plant.",
                unlocked: false
            },
            {
                id: "plant_collector",
                name: "Plant Collector",
                description: "Discover 3 different plant species.",
                unlocked: false
            },
            {
                id: "researcher",
                name: "Cosmic Researcher",
                description: "Complete your first research project.",
                unlocked: false
            },
            {
                id: "garden_master",
                name: "Garden Master",
                description: "Have all garden plots filled with plants at once.",
                unlocked: false
            }
        ];


        //Session timer 
        const BASE_SELECTOR = '.session-timer > .digits >';
        const getElement = className => document.querySelector(`${BASE_SELECTOR} .${className}`);
        const hoursContainer = getElement('hours');
        const minutesContainer = getElement('minutes');
        const secondsContainer = getElement('seconds');

        function getTimeComponents(input) {
        const hours = Math.floor(input / (60 * 60));
        const minutesDivisor = input % (60 * 60);
        const minutes = Math.floor(minutesDivisor / 60);
        const secondsDivisor = minutesDivisor % 60;
        const seconds = Math.ceil(secondsDivisor);
        return {
            hours,
            minutes,
            seconds
        };
    }

        const pad = number => (number < 10 ? '0' : '') + number;

        window.addEventListener('DOMContentLoaded', () => {
        const second = 1000;
        let elapsed = 0;
        setInterval(() => {
        elapsed += second;
        const {hours, minutes, seconds} = getTimeComponents(Math.floor(elapsed / 1000));
        hoursContainer.innerHTML = pad(hours);
        minutesContainer.innerHTML = pad(minutes);
        secondsContainer.innerHTML = pad(seconds);
    }, second);
});
        
        // DOM Elements
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingProgressBar = document.getElementById('loading-progress-bar');
        const introModalOverlay = document.getElementById('intro-modal-overlay');
        const startGameBtn = document.getElementById('start-game-btn');
        const navButtons = document.querySelectorAll('.nav-button');
        const views = document.querySelectorAll('.view');
        const playerNameDisplay = document.getElementById('player-name');
        const playerLevelDisplay = document.getElementById('player-level');
        const gardenGrid = document.getElementById('garden-grid');
        const plantCollection = document.getElementById('plant-collection');
        const researchGrid = document.getElementById('research-grid');
        const plantSearch = document.getElementById('plant-search');
        const plantFilter = document.getElementById('plant-filter');
        const environmentSliders = {
            radiation: document.getElementById('radiation-slider'),
            gravity: document.getElementById('gravity-slider'),
            atmosphere: document.getElementById('atmosphere-slider')
        };
        const environmentValues = {
            radiation: document.getElementById('radiation-value'),
            gravity: document.getElementById('gravity-value'),
            atmosphere: document.getElementById('atmosphere-value')
        };
        const resourceValues = {
            energy: document.getElementById('energy-value'),
            minerals: document.getElementById('minerals-value'),
            seeds: document.getElementById('seeds-value'),
            research: document.getElementById('research-value')
        };
        const resourceRates = {
            energy: document.getElementById('energy-rate'),
            minerals: document.getElementById('minerals-rate'),
            seeds: document.getElementById('seeds-rate'),
            research: document.getElementById('research-rate')
        };
        const plantDetailModal = document.getElementById('plant-detail-modal');
        const plantDetailTitle = document.getElementById('plant-detail-title');
        const plantDetailContent = document.getElementById('plant-detail-content');
        const plantDetailCloseBtn = document.getElementById('plant-detail-close');
        const plantDetailCloseBtn2 = document.getElementById('plant-detail-close-btn');
        const plantDetailHarvestBtn = document.getElementById('plant-detail-harvest-btn');
        const plantSelectionModal = document.getElementById('plant-selection-modal');
        const plantSelectionGrid = document.getElementById('plant-selection-grid');
        const plantSelectionClose = document.getElementById('plant-selection-close');
        const plantSelectionCancel = document.getElementById('plant-selection-cancel');
        const plantSelectionConfirm = document.getElementById('plant-selection-confirm');
        const toastContainer = document.getElementById('toast-container');
        const playerNameInput = document.getElementById('player-name-input');
        const soundEnabledCheckbox = document.getElementById('sound-enabled');
        const notificationsEnabledCheckbox = document.getElementById('notifications-enabled');
        const debugModeCheckbox = document.getElementById('debug-mode');
        const saveSettingsBtn = document.getElementById('save-settings');
        const resetSettingsBtn = document.getElementById('reset-settings');
        const resetGameBtn = document.getElementById('reset-game');
        
        // Game state
        let gameInterval;
        let isGamePaused = false;
        
        // Enhanced error handling
        function setupErrorHandling() {
            window.addEventListener('error', (event) => {
                debugLog('Game error:', event.error);
                showToast('An error occurred. Please check the console for details.', 'error');
            });
            
            // Catch unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                debugLog('Unhandled promise rejection:', event.reason);
                showToast('An error occurred in background processing.', 'error');
            });
        }
        
        // Debug logging function
        function debugLog(message, data) {
            if (gameData.settings.debugMode) {
                console.log(`[DEBUG] ${message}`, data);
            }
        }
        
        // Initialize the game
        function initGame() {
            // Set up error handling
            setupErrorHandling();
            
            // Initialize theme system
            themeSystem.init();
            
            // Simulate loading progress
            let progress = 0;
            const loadingInterval = setInterval(() => {
                progress += 5;
                loadingProgressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        loadingOverlay.style.opacity = 0;
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                            introModalOverlay.classList.add('active');
                        }, 500);
                    }, 500);
                }
            }, 100);
            
            // Load game data from local storage
            loadGameData();
            
            // Initialize event listeners
            initEventListeners();
            
            // Render initial game state
            renderGame();
            
            // Initialize cookie consent
            cookieConsent.init();
            
            // Balance game resources
            balanceGameResources();
        }
        
        // Balance game resources for better gameplay
        function balanceGameResources() {
            // Adjust rare plants to make them more valuable but more expensive
            plantDatabase.forEach(plant => {
                if (plant.rarity === 'rare') {
                    // Increase seed cost for rare plants by 20%
                    plant.seedCost = Math.round(plant.seedCost * 1.2);
                    
                    // Increase yields for rare plants by 20%
                    Object.keys(plant.yield).forEach(resource => {
                        plant.yield[resource] = Math.round(plant.yield[resource] * 1.2);
                    });
                }
            });
            
            // Ensure starting resources are balanced
            gameData.resources.seeds = Math.max(gameData.resources.seeds, 20);
            
            debugLog('Game resources balanced', plantDatabase);
        }
        
        // Save game data to local storage
        function saveGameData() {
            gameData.lastSaveTime = Date.now();
            
            // Only save if cookie consent is given
            if (!cookieConsent.consentGiven) {
                debugLog('Game not saved: cookie consent not given');
                return;
            }
            
            try {
                localStorage.setItem('celestialGardenSave', JSON.stringify(gameData));
                debugLog('Game saved successfully', gameData);
            } catch (error) {
                showToast('Failed to save game', 'error');
                debugLog('Save error:', error);
            }
        }
        
        // Load game data from local storage
        function loadGameData() {
            try {
                const savedGame = localStorage.getItem('celestialGardenSave');
                
                if (savedGame) {
                    const parsedData = JSON.parse(savedGame);
                    
                    // Check for game version and apply data migrations if necessary
                    if (parsedData.version !== gameData.version) {
                        // Apply data migrations here if needed
                        debugLog('Game version mismatch, applying migrations...', {
                            oldVersion: parsedData.version,
                            newVersion: gameData.version
                        });
                    }
                    
                    // Merge saved data with default game data
                    Object.assign(gameData, parsedData);
                    
                    // Calculate offline progress
                    const currentTime = Date.now();
                    const offlineTime = currentTime - gameData.lastUpdateTime;
                    
                    if (offlineTime > 5000) { // 5 seconds minimum for offline progress
                        calculateOfflineProgress(offlineTime);
                    }
                    
                    gameData.lastUpdateTime = currentTime;
                    
                    showToast('Game loaded successfully', 'success');
                } else {
                    // First time playing
                    startNewGame();
                }
            } catch (error) {
                showToast('Failed to load game', 'error');
                debugLog('Load error:', error);
                startNewGame();
            }
        }
        
        // Start a new game
        function startNewGame() {
            // Add first plant to discovered plants
            addPlantToDiscovery('cosmo_bloom');
            
            // Mark first research as available
            updateResearchAvailability();
            
            // Save initial game state
            saveGameData();
        }
        
        // Calculate offline progress
        function calculateOfflineProgress(offlineTime) {
            const offlineSeconds = offlineTime / 1000;
            
            // Calculate resource generation from plants
            let offlineResources = {
                energy: 0,
                minerals: 0,
                seeds: 0,
                research: 0
            };
            
            // Process garden growth and resource generation
            gameData.garden.forEach(plot => {
                if (plot.plantId) {
                    const plant = getPlantById(plot.plantId);
                    if (!plant) return;
                    
                    // Calculate growth progress
                    const totalGrowthNeeded = plant.growthTime;
                    let newGrowthProgress = plot.growthProgress + (offlineSeconds / totalGrowthNeeded) * 100;
                    
                    // If plant was ready for harvest
                    if (newGrowthProgress >= 100) {
                        newGrowthProgress = 100;
                        
                        // Calculate resources generated (at reduced rate for offline)
                        const offlineMultiplier = 0.5; // 50% efficiency when offline
                        const environmentMultiplier = calculateEnvironmentMultiplier(plant);
                        const totalMultiplier = plant.yieldMultiplier * environmentMultiplier * offlineMultiplier;
                        
                        Object.entries(plant.yield).forEach(([resource, amount]) => {
                            offlineResources[resource] += amount * totalMultiplier;
                        });
                    }
                    
                    // Update plot growth progress
                    plot.growthProgress = newGrowthProgress;
                }
            });
            
            // Add offline resources
            Object.entries(offlineResources).forEach(([resource, amount]) => {
                if (amount > 0) {
                    gameData.resources[resource] += Math.floor(amount);
                }
            });
            
            // Show offline progress toast
            let offlineMessage = 'While you were away: ';
            let resourcesGenerated = false;
            
            Object.entries(offlineResources).forEach(([resource, amount]) => {
                if (amount > 0) {
                    offlineMessage += `+${Math.floor(amount)} ${resource}, `;
                    resourcesGenerated = true;
                }
            });
            
            if (resourcesGenerated) {
                offlineMessage = offlineMessage.slice(0, -2); // Remove trailing comma and space
                showToast(offlineMessage, 'success');
            }
            
            debugLog('Offline progress calculated', {
                offlineTime: offlineSeconds,
                resources: offlineResources
            });
        }
        
        // Initialize event listeners
        function initEventListeners() {
            // Start game button
            startGameBtn.addEventListener('click', () => {
                introModalOverlay.classList.remove('active');
                startGameLoop();
            });
            
            // Navigation buttons
            navButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const viewId = button.dataset.view;
                    
                    // Update active button
                    navButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Show selected view
                    views.forEach(view => view.classList.remove('active'));
                    document.getElementById(`${viewId}-view`).classList.add('active');
                });
            });
            
            // Environment sliders
            Object.entries(environmentSliders).forEach(([env, slider]) => {
                slider.addEventListener('input', () => {
                    const value = slider.value;
                    gameData.environment[env] = parseInt(value);
                    environmentValues[env].textContent = `${value}%`;
                    
                    // Update plant growth rates based on new environment
                    updateResourceRates();
                    
                    // Save environment changes
                    saveGameData();
                });
            });
            
            // Plant search and filter
            plantSearch.addEventListener('input', renderPlantCollection);
            plantFilter.addEventListener('change', renderPlantCollection);
            
            // Plant detail modal close buttons
            plantDetailCloseBtn.addEventListener('click', () => {
                plantDetailModal.classList.remove('active');
            });
            
            plantDetailCloseBtn2.addEventListener('click', () => {
                plantDetailModal.classList.remove('active');
            });
            
            // Plant detail harvest button
            plantDetailHarvestBtn.addEventListener('click', () => {
                harvestPlant(gameData.selectedPlot);
                plantDetailModal.classList.remove('active');
            });
            
            // Plant selection modal close buttons
            plantSelectionClose.addEventListener('click', () => {
                plantSelectionModal.classList.remove('active');
                gameData.selectedPlot = null;
            });
            
            plantSelectionCancel.addEventListener('click', () => {
                plantSelectionModal.classList.remove('active');
                gameData.selectedPlot = null;
            });
            
            // Plant selection confirm button
            plantSelectionConfirm.addEventListener('click', () => {
                if (gameData.selectedPlant && gameData.selectedPlot !== null) {
                    plantSeed(gameData.selectedPlot, gameData.selectedPlant);
                    plantSelectionModal.classList.remove('active');
                } else {
                    showToast('Please select a plant first', 'warning');
                }
            });
            
            // Settings form
            playerNameInput.value = gameData.player.name;
            soundEnabledCheckbox.checked = gameData.settings.soundEnabled;
            notificationsEnabledCheckbox.checked = gameData.settings.notificationsEnabled;
            debugModeCheckbox.checked = gameData.settings.debugMode;
            
            saveSettingsBtn.addEventListener('click', () => {
                // Update settings
                gameData.player.name = playerNameInput.value.trim() || "Cosmic Gardener";
                gameData.settings.soundEnabled = soundEnabledCheckbox.checked;
                gameData.settings.notificationsEnabled = notificationsEnabledCheckbox.checked;
                gameData.settings.debugMode = debugModeCheckbox.checked;
                
                // Update UI
                playerNameDisplay.textContent = gameData.player.name;
                
                // Save settings
                saveGameData();
                showToast('Settings saved successfully', 'success');
            });
            
            resetSettingsBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset settings to default?')) {
                    gameData.player.name = "Cosmic Gardener";
                    gameData.settings.soundEnabled = true;
                    gameData.settings.notificationsEnabled = true;
                    gameData.settings.debugMode = false;
                    
                    // Update form
                    playerNameInput.value = gameData.player.name;
                    soundEnabledCheckbox.checked = gameData.settings.soundEnabled;
                    notificationsEnabledCheckbox.checked = gameData.settings.notificationsEnabled;
                    debugModeCheckbox.checked = gameData.settings.debugMode;
                    
                    // Update UI
                    playerNameDisplay.textContent = gameData.player.name;
                    
                    // Save settings
                    saveGameData();
                    showToast('Settings reset to default', 'success');
                }
            });
            
            // Game data controls
            resetGameBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
                    localStorage.removeItem('celestialGardenSave');
                    showToast('Game has been reset'),
                    showToast('Game has been reset', 'success');
                    
                    // Reload the page to start fresh
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });
        }
        
        // Start the game loop
        function startGameLoop() {
            // Update initial UI
            updateResourceDisplay();
            updateEnvironmentSliders();
            renderGarden();
            renderPlantCollection();
            renderResearch();
            renderAchievements();
            
            // Start the game interval
            gameInterval = setInterval(() => {
                if (!isGamePaused) {
                    updateGame();
                }
            }, 1000); // Update every second
            
            // Set up autosave every minute
            setInterval(() => {
                if (!isGamePaused) {
                    saveGameData();
                }
            }, 60000);
            
            debugLog('Game loop started');
        }
        
        // Main game update function
        function updateGame() {
            const currentTime = Date.now();
            const deltaTime = (currentTime - gameData.lastUpdateTime) / 1000; // Convert to seconds
            gameData.lastUpdateTime = currentTime;
            
            // Update garden growth
            updateGardenGrowth(deltaTime);
            
            // Update resources
            updateResources(deltaTime);
            
            // Update display
            updateResourceDisplay();
            renderGarden();
            
            // Check for achievements
            checkAchievements();
        }
        
        // Update garden growth
        function updateGardenGrowth(deltaTime) {
            for (let i = 0; i < gameData.garden.length; i++) {
                const plot = gameData.garden[i];
                
                if (plot.plantId) {
                    const plant = getPlantById(plot.plantId);
                    if (!plant) continue;
                    
                    // Calculate growth rate based on environment
                    const environmentMultiplier = calculateEnvironmentMultiplier(plant);
                    const growthRate = (deltaTime / plant.growthTime) * 100 * environmentMultiplier;
                    
                    // Update growth progress
                    plot.growthProgress = Math.min(100, plot.growthProgress + growthRate);
                    
                    // Update resource production rates if plant is mature
                    if (plot.growthProgress >= 100) {
                        // Plants that have reached maturity continue to produce at reduced rate
                        Object.entries(plant.yield).forEach(([resource, amount]) => {
                            const productionRate = (amount * environmentMultiplier * plant.yieldMultiplier) / 60; // Per second
                            gameData.resourceRates[resource] += productionRate;
                        });
                    }
                }
            }
        }
        
        // Update resources
        function updateResources(deltaTime) {
            // Add resources based on production rates
            Object.entries(gameData.resourceRates).forEach(([resource, rate]) => {
                gameData.resources[resource] += rate * deltaTime;
            });
            
            // Reset production rates (will be recalculated in growth update)
            Object.keys(gameData.resourceRates).forEach(resource => {
                gameData.resourceRates[resource] = 0;
            });
        }
        
        // Update resource rates
        function updateResourceRates() {
            // Reset production rates
            Object.keys(gameData.resourceRates).forEach(resource => {
                gameData.resourceRates[resource] = 0;
            });
            
            // Calculate production from mature plants
            const maturePlots = gameData.garden.filter(plot => 
                plot.plantId && plot.growthProgress >= 100
            );
            
            maturePlots.forEach(plot => {
                const plant = getPlantById(plot.plantId);
                if (!plant) return;
                
                // Calculate production multiplier based on environment
                const environmentMultiplier = calculateEnvironmentMultiplier(plant);
                
                // Update resource rates
                Object.entries(plant.yield).forEach(([resource, amount]) => {
                    const productionRate = (amount * environmentMultiplier * plant.yieldMultiplier) / 60; // Per second
                    gameData.resourceRates[resource] += productionRate;
                });
            });
            
            debugLog('Resource rates updated', gameData.resourceRates);
        }
        
        // Calculate environment multiplier for a plant
        function calculateEnvironmentMultiplier(plant) {
            // Calculate how close the environment is to optimal for the plant
            let radiationDiff = Math.abs(gameData.environment.radiation - plant.optimalConditions.radiation);
            let gravityDiff = Math.abs(gameData.environment.gravity - plant.optimalConditions.gravity);
            let atmosphereDiff = Math.abs(gameData.environment.atmosphere - plant.optimalConditions.atmosphere);
            
            // Convert differences to percentages (0-100)
            radiationDiff = (radiationDiff / 100) * 100;
            gravityDiff = (gravityDiff / 100) * 100;
            atmosphereDiff = (atmosphereDiff / 100) * 100;
            
            // Average difference as percentage
            const avgDiff = (radiationDiff + gravityDiff + atmosphereDiff) / 3;
            
            // Calculate multiplier (1.0 if perfect, down to 0.2 if completely wrong)
            let multiplier;
            if (avgDiff <= plant.tolerance) {
                // Within tolerance - full efficiency to slight reduction
                multiplier = 1.0 - (avgDiff / plant.tolerance) * 0.2;
            } else {
                // Outside tolerance - reduced efficiency
                multiplier = 0.8 * (1 - Math.min(1, (avgDiff - plant.tolerance) / (100 - plant.tolerance)));
            }
            
            return Math.max(0.2, multiplier);
        }
        
        // Plant a seed in a garden plot
        function plantSeed(plotIndex, plantId) {
            const plant = getPlantById(plantId);
            if (!plant) return false;
            
            // Check if we have enough seeds
            if (gameData.resources.seeds < plant.seedCost) {
                showToast(`Not enough seeds. Need ${plant.seedCost}`, 'error');
                return false;
            }
            
            // Check if the plot is empty
            if (gameData.garden[plotIndex].plantId !== null) {
                showToast('This plot already has a plant', 'error');
                return false;
            }
            
            // Plant the seed
            gameData.garden[plotIndex].plantId = plantId;
            gameData.garden[plotIndex].growthProgress = 0;
            gameData.garden[plotIndex].plantedTime = Date.now();
            gameData.garden[plotIndex].harvested = 0;
            
            // Deduct seeds
            gameData.resources.seeds -= plant.seedCost;
            
            // Update display
            updateResourceDisplay();
            renderGarden();
            
            // Add to discovered plants if not already there
            addPlantToDiscovery(plantId);
            
            // Check achievement for first plant
            checkAchievement('first_plant');
            
            // Save game
            saveGameData();
            
            showToast(`Planted ${plant.name}`, 'success');
            debugLog('Plant seed', { plotIndex, plantId, plant });
            return true;
        }
        
        // Harvest a plant
        function harvestPlant(plotIndex) {
            const plot = gameData.garden[plotIndex];
            
            if (!plot.plantId || plot.growthProgress < 100) {
                showToast('Plant is not ready for harvest', 'warning');
                return false;
            }
            
            const plant = getPlantById(plot.plantId);
            if (!plant) return false;
            
            // Calculate yield based on environment
            const environmentMultiplier = calculateEnvironmentMultiplier(plant);
            const totalMultiplier = plant.yieldMultiplier * environmentMultiplier;
            
            // Add resources
            let harvestMessage = `Harvested ${plant.name}:<br>`;
            let harvestedResources = {};
            
            Object.entries(plant.yield).forEach(([resource, amount]) => {
                const yieldAmount = Math.floor(amount * totalMultiplier);
                gameData.resources[resource] += yieldAmount;
                harvestMessage += `+${yieldAmount} ${resource}<br>`;
                harvestedResources[resource] = yieldAmount;
            });
            
            // Clear plot
            plot.plantId = null;
            plot.growthProgress = 0;
            plot.plantedTime = null;
            plot.harvested++;
            
            // Update display
            updateResourceDisplay();
            renderGarden();
            
            // Check achievement for first harvest
            checkAchievement('first_harvest');
            
            // Save game
            saveGameData();
            
            showToast(harvestMessage, 'success');
            debugLog('Plant harvested', { plotIndex, plant, harvestedResources });
            return true;
        }
        
        // Add a plant to the discovered plants list
        function addPlantToDiscovery(plantId) {
            if (!gameData.discoveredPlants.includes(plantId)) {
                gameData.discoveredPlants.push(plantId);
                showToast(`New plant discovered: ${getPlantById(plantId).name}`, 'success');
                
                // Check achievement for plant collection
                if (gameData.discoveredPlants.length >= 3) {
                    checkAchievement('plant_collector');
                }
                
                // Render plant collection to show new plant
                renderPlantCollection();
                
                debugLog('Plant discovered', { plantId, discoveredPlants: gameData.discoveredPlants });
            }
        }
        
        // Update research availability based on completed research
        function updateResearchAvailability() {
            for (const research of researchDatabase) {
                if (!research.completed) {
                    // Check if all required research is completed
                    const requirementsMet = research.requiresResearch.every(reqId => {
                        return gameData.completedResearch.includes(reqId);
                    });
                    
                    research.unlocked = requirementsMet;
                }
            }
            
            // Render research grid to reflect changes
            renderResearch();
            
            debugLog('Research availability updated', researchDatabase.filter(r => r.unlocked));
        }
        
        // Complete a research project
        function completeResearch(researchId) {
            const research = getResearchById(researchId);
            if (!research) return false;
            
            // Check if already completed
            if (research.completed) {
                showToast('Research already completed', 'warning');
                return false;
            }
            
            // Check if unlocked
            if (!research.unlocked) {
                showToast('Research not available yet', 'error');
                return false;
            }
            
            // Check if enough research points
            if (gameData.resources.research < research.cost) {
                showToast(`Not enough research points. Need ${research.cost}`, 'error');
                return false;
            }
            
            // Complete research
            gameData.resources.research -= research.cost;
            gameData.completedResearch.push(researchId);
            research.completed = true;
            
            // Apply research benefits
            applyResearchBenefits(research);
            
            // Update research availability
            updateResearchAvailability();
            
            // Update display
            updateResourceDisplay();
            renderResearch();
            
            // Check achievement
            checkAchievement('researcher');
            
            // Save game
            saveGameData();
            
            showToast(`Completed research: ${research.name}`, 'success');
            debugLog('Research completed', { researchId, research });
            return true;
        }
        
        // Apply research benefits
        function applyResearchBenefits(research) {
            // Apply specific benefits based on research ID
            switch(research.id) {
                case "basic_cultivation":
                    // Unlock Stellar Fern
                    addPlantToDiscovery('stellar_fern');
                    
                    // 10% faster growth for all plants
                    plantDatabase.forEach(plant => {
                        plant.growthTime = Math.round(plant.growthTime * 0.9);
                    });
                    break;
                    
                case "mineral_extraction":
                    // Unlock Lunar Crystalite
                    addPlantToDiscovery('lunar_crystalite');
                    
                    // 20% increased mineral yield
                    plantDatabase.forEach(plant => {
                        plant.yield.minerals = Math.round(plant.yield.minerals * 1.2);
                    });
                    break;
                    
                case "atmospheric_control":
                    // Unlock Nebula Pod
                    addPlantToDiscovery('nebula_pod');
                    
                    // Atmosphere adjustments 20% more effective
                    // This is handled in the environment multiplier calculation
                    break;
                    
                case "radiation_harnessing":
                    // Unlock Void Orchid
                    addPlantToDiscovery('void_orchid');
                    
                    // 30% increased energy yield
                    plantDatabase.forEach(plant => {
                        plant.yield.energy = Math.round(plant.yield.energy * 1.3);
                    });
                    break;
                    
                case "gravitic_manipulation":
                    // Unlock Plasma Willow
                    addPlantToDiscovery('plasma_willow');
                    
                    // Gravity adjustments 30% more effective
                    // This is handled in the environment multiplier calculation
                    break;
            }
            
            showToast(`Research benefits applied: ${research.benefits.join(', ')}`, 'success');
            debugLog('Research benefits applied', { research, benefits: research.benefits });
        }
        
        // Check achievements
        function checkAchievements() {
            // Check garden master achievement
            let allPlotsFilled = true;
            for (const plot of gameData.garden) {
                if (plot.plantId === null) {
                    allPlotsFilled = false;
                    break;
                }
            }
            
            if (allPlotsFilled) {
                checkAchievement('garden_master');
            }
        }
        
        // Check and unlock a specific achievement
        function checkAchievement(achievementId) {
            const achievement = getAchievementById(achievementId);
            if (!achievement) return;
            
            if (!achievement.unlocked) {
                achievement.unlocked = true;
                showToast(`Achievement unlocked: ${achievement.name}`, 'success');
                renderAchievements();
                
                debugLog('Achievement unlocked', { achievementId, achievement });
            }
        }
        
        // Render the entire game state
        function renderGame() {
            playerNameDisplay.textContent = gameData.player.name;
            playerLevelDisplay.textContent = `Level ${gameData.player.level}`;
            
            updateResourceDisplay();
            updateEnvironmentSliders();
            renderGarden();
            renderPlantCollection();
            renderResearch();
            renderAchievements();
        }
        
        // Update resource display
        function updateResourceDisplay() {
            Object.entries(gameData.resources).forEach(([resource, value]) => {
                resourceValues[resource].textContent = Math.floor(value);
                resourceRates[resource].textContent = `+${gameData.resourceRates[resource].toFixed(1)}/s`;
            });
        }
        
        // Update environment sliders
        function updateEnvironmentSliders() {
            Object.entries(gameData.environment).forEach(([env, value]) => {
                environmentSliders[env].value = value;
                environmentValues[env].textContent = `${value}%`;
            });
        }
        
        // Render garden
        function renderGarden() {
            gardenGrid.innerHTML = '';
            
            for (let i = 0; i < gameData.garden.length; i++) {
                const plot = gameData.garden[i];
                const plotElement = document.createElement('div');
                plotElement.classList.add('plot');
                plotElement.dataset.id = i;
                
                if (plot.plantId === null) {
                    // Empty plot
                    plotElement.classList.add('empty');
                    plotElement.innerHTML = `
                        <div class="plot-content">
                            <div>Click to plant</div>
                        </div>
                    `;
                    
                    plotElement.addEventListener('click', () => {
                        gameData.selectedPlot = i;
                        openPlantSelectionModal();
                    });
                } else {
                    // Plot with plant
                    const plant = getPlantById(plot.plantId);
                    if (!plant) continue;
                    
                    // Calculate current growth stage
                    const stageIndex = Math.min(
                        Math.floor(plot.growthProgress / (100 / plant.stages.length)),
                        plant.stages.length - 1
                    );
                    const currentStage = plant.stages[stageIndex];
                    
                    // Calculate environment compatibility for visual cue
                    const environmentMultiplier = calculateEnvironmentMultiplier(plant);
                    let compatibilityClass = '';
                    
                    if (environmentMultiplier >= 0.9) {
                        compatibilityClass = 'excellent';
                    } else if (environmentMultiplier >= 0.7) {
                        compatibilityClass = 'good';
                    } else if (environmentMultiplier >= 0.4) {
                        compatibilityClass = 'fair';
                    } else {
                        compatibilityClass = 'poor';
                    }
                    
                    plotElement.innerHTML = `
                        <div class="plot-content">
                            <div class="plant-image ${compatibilityClass}">
                                ${plant.svg}
                            </div>
                            <div class="plant-info">
                                <div class="plant-name">${plant.name}</div>
                                <div class="plant-stage">${currentStage}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${plot.growthProgress}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="plot-background"></div>
                    `;
                    
                    // Set click handler to show plant detail
                    plotElement.addEventListener('click', () => {
                        gameData.selectedPlot = i;
                        openPlantDetailModal(plot.plantId, i);
                    });
                }
                
                gardenGrid.appendChild(plotElement);
            }
        }
        
        // Render plant collection
        function renderPlantCollection() {
            plantCollection.innerHTML = '';
            
            // Filter plants based on search and filter
            const searchTerm = plantSearch.value.toLowerCase();
            const filterType = plantFilter.value;
            
            const filteredPlants = plantDatabase.filter(plant => {
                // Only show discovered plants
                if (!gameData.discoveredPlants.includes(plant.id)) {
                    return false;
                }
                
                // Apply search filter
                if (searchTerm && !plant.name.toLowerCase().includes(searchTerm) && 
                    !plant.description.toLowerCase().includes(searchTerm)) {
                    return false;
                }
                
                // Apply category filter
                if (filterType !== 'all') {
                    switch (filterType) {
                        case 'rare':
                            return plant.rarity === 'rare';
                        case 'energy':
                            return plant.yield.energy >= 15;
                        case 'minerals':
                            return plant.yield.minerals >= 15;
                        case 'seeds':
                            return plant.yield.seeds >= 10;
                        default:
                            return true;
                    }
                }
                
                return true;
            });
            
            if (filteredPlants.length === 0) {
                plantCollection.innerHTML = '<div class="no-results">No plants found matching your criteria</div>';
                return;
            }
            
            // Create plant collection cards
            filteredPlants.forEach(plant => {
                const card = document.createElement('div');
                card.classList.add('collection-card');
                
                card.innerHTML = `
                    <div class="collection-card-image">
                        ${plant.svg}
                    </div>
                    <div class="collection-card-content">
                        <div class="collection-card-title">
                            <span>${plant.name}</span>
                            <span class="collection-card-rarity">${plant.rarity}</span>
                        </div>
                        <div>${plant.description.substring(0, 80)}${plant.description.length > 80 ? '...' : ''}</div>
                        <div class="collection-card-stats">
                            <div class="collection-card-stat">
                                <span class="collection-card-stat-label">Energy:</span>
                                <span>${plant.yield.energy}</span>
                            </div>
                            <div class="collection-card-stat">
                                <span class="collection-card-stat-label">Minerals:</span>
                                <span>${plant.yield.minerals}</span>
                            </div>
                            <div class="collection-card-stat">
                                <span class="collection-card-stat-label">Seeds:</span>
                                <span>${plant.yield.seeds}</span>
                            </div>
                            <div class="collection-card-stat">
                                <span class="collection-card-stat-label">Research:</span>
                                <span>${plant.yield.research}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    openPlantDetailModal(plant.id);
                });
                
                plantCollection.appendChild(card);
            });
        }
        
        // Render research
        function renderResearch() {
            researchGrid.innerHTML = '';
            
            // Filter to show only unlocked research
            const availableResearch = researchDatabase.filter(research => 
                research.unlocked && !research.completed
            );
            
            if (availableResearch.length === 0) {
                researchGrid.innerHTML = '<div class="no-results">No research available at this time</div>';
                return;
            }
            
            // Create research cards
            availableResearch.forEach(research => {
                const card = document.createElement('div');
                card.classList.add('research-card');
                
                const canAfford = gameData.resources.research >= research.cost;
                
                card.innerHTML = `
                    <div class="research-card-header">
                        <span class="research-card-title">${research.name}</span>
                        <span class="research-card-cost">${research.cost} 🔬</span>
                    </div>
                    <div class="research-card-description">${research.description}</div>
                    <div class="research-card-benefits">
                        ${research.benefits.map(benefit => 
                            `<div class="research-benefit">${benefit}</div>`
                        ).join('')}
                    </div>
                    <button class="research-card-button" ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? 'Research' : 'Not enough points'}
                    </button>
                `;
                
                const researchButton = card.querySelector('.research-card-button');
                researchButton.addEventListener('click', () => {
                    if (canAfford) {
                        completeResearch(research.id);
                    } else {
                        showToast(`Need ${research.cost} research points`, 'warning');
                    }
                });
                
                researchGrid.appendChild(card);
            });
            
            // Add completed research (collapsed)
            if (gameData.completedResearch.length > 0) {
                const completedSection = document.createElement('div');
                completedSection.classList.add('completed-research-section');
                completedSection.innerHTML = `
                    <h3>Completed Research (${gameData.completedResearch.length})</h3>
                    <div class="completed-research-list">
                        ${gameData.completedResearch.map(id => {
                            const research = getResearchById(id);
                            return `<div class="completed-research-item">${research ? research.name : id}</div>`;
                        }).join('')}
                    </div>
                `;
                
                researchGrid.appendChild(completedSection);
            }
        }
        
        // Render achievements
        function renderAchievements() {
            const achievementsGrid = document.getElementById('achievements-grid');
            if (!achievementsGrid) return;
            
            achievementsGrid.innerHTML = '';
            
            achievementDatabase.forEach(achievement => {
                const card = document.createElement('div');
                card.classList.add('achievement-card');
                
                if (achievement.unlocked) {
                    card.classList.add('unlocked');
                }
                
                card.innerHTML = `
                    <div class="achievement-icon">🏆</div>
                    <div class="achievement-content">
                        <div class="achievement-title">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                    </div>
                `;
                
                achievementsGrid.appendChild(card);
            });
        }
        
        // Open plant detail modal
        function openPlantDetailModal(plantId, plotIndex = null) {
            const plant = getPlantById(plantId);
            if (!plant) return;
            
            const plot = plotIndex !== null ? gameData.garden[plotIndex] : null;
            
            plantDetailTitle.textContent = plant.name;
            
            // Create modal content
            let detailContent = `
                <div class="plant-detail-header">
                    <div class="plant-detail-image">
                        ${plant.svg}
                    </div>
                    <div class="plant-detail-info">
                        <div class="plant-detail-name">${plant.name}</div>
                        <div class="plant-detail-type">${plant.rarity.charAt(0).toUpperCase() + plant.rarity.slice(1)} Plant</div>
                        <div class="plant-detail-stats">
                            <div class="plant-detail-stat">
                                <span class="plant-detail-stat-label">Growth Time:</span>
                                <span>${Math.floor(plant.growthTime / 60)} min ${plant.growthTime % 60} sec</span>
                            </div>
                            <div class="plant-detail-stat">
                                <span class="plant-detail-stat-label">Seed Cost:</span>
                                <span>${plant.seedCost}</span>
                            </div>
                            <div class="plant-detail-stat">
                                <span class="plant-detail-stat-label">Optimal Radiation:</span>
                                <span>${plant.optimalConditions.radiation}%</span>
                            </div>
                            <div class="plant-detail-stat">
                                <span class="plant-detail-stat-label">Optimal Gravity:</span>
                                <span>${plant.optimalConditions.gravity}%</span>
                            </div>
                            <div class="plant-detail-stat">
                                <span class="plant-detail-stat-label">Optimal Atmosphere:</span>
                                <span>${plant.optimalConditions.atmosphere}%</span>
                            </div>
                            <div class="plant-detail-stat">
                                <span class="plant-detail-stat-label">Tolerance:</span>
                                <span>±${plant.tolerance}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="plant-detail-description">
                    ${plant.description}
                </div>
                <div class="plant-detail-yields">
                    <div class="plant-detail-yields-title">Resource Yields:</div>
                    <div class="plant-detail-yields-list">
                        <div class="plant-yield">
                            <div class="resource-icon energy">⚡</div>
                            <span>${plant.yield.energy} Energy</span>
                        </div>
                        <div class="plant-yield">
                            <div class="resource-icon minerals">🔷</div>
                            <span>${plant.yield.minerals} Minerals</span>
                        </div>
                        <div class="plant-yield">
                            <div class="resource-icon seeds">🌱</div>
                            <span>${plant.yield.seeds} Seeds</span>
                        </div>
                        <div class="plant-yield">
                            <div class="resource-icon research">🔬</div>
                            <span>${plant.yield.research} Research</span>
                        </div>
                    </div>
                </div>
                <div class="plant-detail-stages">
                    <div class="plant-detail-stages-title">Growth Stages:</div>
                    <div class="stage-timeline">
                        ${plant.stages.map((stage, index) => {
                            const isActive = plot && plot.growthProgress >= (index * (100 / plant.stages.length));
                            return `<div class="stage-point ${isActive ? 'active' : ''}"></div>`;
                        }).join('<div class="stage-connector"></div>')}
                    </div>
                    <div class="stage-labels">
                        ${plant.stages.map(stage => 
                            `<div class="stage-label">${stage}</div>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            plantDetailContent.innerHTML = detailContent;
            
            // Show/hide harvest button based on plant readiness
            if (plot && plot.plantId === plantId) {
                plantDetailHarvestBtn.style.display = plot.growthProgress >= 100 ? 'block' : 'none';
            } else {
                plantDetailHarvestBtn.style.display = 'none';
            }
            
            // Show modal
            plantDetailModal.classList.add('active');
        }
        
        // Open plant selection modal
        function openPlantSelectionModal() {
            plantSelectionGrid.innerHTML = '';
            
            // Filter plants that the player can plant using array methods
            const availablePlants = filterAvailablePlants();
            
            if (availablePlants.length === 0) {
                plantSelectionGrid.innerHTML = '<div class="no-results">No plants available to plant. Collect more seeds!</div>';
                gameData.selectedPlant = null;
                plantSelectionConfirm.disabled = true;
            } else {
                // Create plant selection items
                availablePlants.forEach(plant => {
                    const selectionItem = document.createElement('div');
                    selectionItem.classList.add('plant-selection-item');
                    selectionItem.dataset.id = plant.id;
                    
                    selectionItem.innerHTML = `
                        <div class="plant-selection-image">
                            ${plant.svg}
                        </div>
                        <div class="plant-selection-name">${plant.name}</div>
                        <div class="plant-selection-cost">
                            <div class="resource-icon seeds">🌱</div>
                            <span>${plant.seedCost}</span>
                        </div>
                    `;
                    
                    selectionItem.addEventListener('click', () => {
                        // Update selected plant
                        gameData.selecte// Update selected plant
                        gameData.selectedPlant = plant.id;
                        
                        // Update UI
                        document.querySelectorAll('.plant-selection-item').forEach(item => {
                            item.classList.remove('selected');
                        });
                        selectionItem.classList.add('selected');
                        
                        // Enable confirm button
                        plantSelectionConfirm.disabled = false;
                    });
                    
                    plantSelectionGrid.appendChild(selectionItem);
                }
                )}
            
            // Show modal
            plantSelectionModal.classList.add('active');
        }
        
        // Filter available plants using array methods
        function filterAvailablePlants() {
            return plantDatabase.filter(plant => 
                gameData.discoveredPlants.includes(plant.id) && 
                gameData.resources.seeds >= plant.seedCost
            );
        }
        
        // Show toast notification
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.classList.add('toast', type);
            
            let icon = '';
            switch (type) {
                case 'success':
                    icon = '✅';
                    break;
                case 'warning':
                    icon = '⚠️';
                    break;
                case 'error':
                    icon = '❌';
                    break;
                default:
                    icon = 'ℹ️';
            }
            
            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span>${message}</span>
            `;
            
            toastContainer.appendChild(toast);
            
            // Play sound if enabled
            if (gameData.settings.soundEnabled) {
                playSound(type);
            }
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
        
        // Play sound effects
        function playSound(type) {
            // This would be implemented with actual sounds in a production game
            debugLog('Playing sound', { type });
        }
        
        // Helper function to get plant by ID using find
        function getPlantById(plantId) {
            return plantDatabase.find(plant => plant.id === plantId);
        }
        
        // Helper function to get research by ID using find
        function getResearchById(researchId) {
            return researchDatabase.find(research => research.id === researchId);
        }
        
        // Helper function to get achievement by ID using find
        function getAchievementById(achievementId) {
            return achievementDatabase.find(achievement => achievement.id === achievementId);
        }
        
        // Handle window visibility change (pause/resume game)
        document.addEventListener('visibilitychange', () => {
            isGamePaused = document.hidden;
            
            if (!isGamePaused) {
                // Calculate offline progress when resuming
                const currentTime = Date.now();
                const offlineTime = currentTime - gameData.lastUpdateTime;
                
                if (offlineTime > 5000) { // 5 seconds minimum for offline progress
                    calculateOfflineProgress(offlineTime);
                }
                
                gameData.lastUpdateTime = currentTime;
            }
        });
        
        // Initialize the game when page loads
        window.addEventListener('load', initGame);

        