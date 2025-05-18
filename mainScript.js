document.addEventListener('DOMContentLoaded', function() {
    // Core app state
    const state = {
        maxLevel: 0,
        currentLevel: 0,
        levelStartTime: null,
        levelHistory: [],
        userName: 'Study Master',
        examName: '',
        examDate: '',
        streak: 0,
        lastStudyDate: null,
        notes: '',
        goals: [],
        achievements: {
            firstLevel: false,
            threeStreak: false,
            speedDemon: false,
            halfway: false,
            timeMaster: false,
            goalCrusher: false
        },
        pomodoroCompleted: 0,
        settings: {
            theme: 'dark',
            animations: true,
            sounds: true,
            reminders: false
        },
        visualizationType: 0 // 0 = mountain, 1 = spiral, 2 = path
    };

    // DOM Elements
    const elements = {
        maxLevelInput: document.getElementById('max-level'),
        setMaxBtn: document.getElementById('set-max-btn'),
        levelUpBtn: document.getElementById('level-up-btn'),
        currentLevelDisplay: document.getElementById('current-level'),
        progressPercentage: document.getElementById('progress-percentage'),
        levelFraction: document.getElementById('level-fraction'),
        timeRemaining: document.getElementById('time-remaining'),
        progressRing: document.querySelector('.progress-ring__circle'),
        historyContainer: document.getElementById('history-container'),
        avatarPlaceholder: document.getElementById('avatar-placeholder'),
        usernameDisplay: document.getElementById('username'),
        usernameInput: document.getElementById('username-input'),
        userStreak: document.querySelector('.streak-display'),
        examNameInput: document.getElementById('exam-name'),
        examDateInput: document.getElementById('exam-date'),
        notesArea: document.getElementById('notes-area'),
        saveNotesBtn: document.getElementById('save-notes-btn'),
        expandExtrasBtn: document.getElementById('expand-extras-btn'),
        extrasContainer: document.getElementById('extras-container'),
        goalsContainer: document.getElementById('goals-container'),
        addGoalBtn: document.getElementById('add-goal-btn'),
        themeSelector: document.getElementById('theme-selector'),
        themeSelect: document.getElementById('theme-select'),
        settingsBtn: document.getElementById('settings-btn'),
        closeSettings: document.getElementById('close-settings'),
        settingsModal: document.getElementById('settings-modal'),
        saveSettingsBtn: document.getElementById('save-settings-btn'),
        animationToggle: document.getElementById('animation-toggle'),
        soundToggle: document.getElementById('sound-toggle'),
        reminderToggle: document.getElementById('reminder-toggle'),
        resetDataBtn: document.getElementById('reset-data-btn'),
        exportDataBtn: document.getElementById('export-data-btn'),
        importDataBtn: document.getElementById('import-data-btn'),
        addGoalModal: document.getElementById('add-goal-modal'),
        closeGoalModal: document.getElementById('close-goal-modal'),
        goalTitle: document.getElementById('goal-title'),
        goalDescription: document.getElementById('goal-description'),
        goalDeadline: document.getElementById('goal-deadline'),
        goalPriority: document.getElementById('goal-priority'),
        addGoalSubmit: document.getElementById('add-goal-submit'),
        achievementsContainer: document.getElementById('achievements-container'),
        achievementPopup: document.getElementById('achievement-popup'),
        closeAchievement: document.getElementById('close-achievement'),
        achievementIcon: document.getElementById('achievement-icon'),
        achievementTitle: document.getElementById('achievement-title'),
        achievementDescription: document.getElementById('achievement-description'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        notificationToast: document.getElementById('notification-toast'),
        notificationTitle: document.getElementById('notification-title'),
        notificationMessage: document.getElementById('notification-message'),
        notificationIcon: document.getElementById('notification-icon'),
        notificationBtn: document.getElementById('notification-btn'),
        notificationBadge: document.getElementById('notification-badge'),
        avgTime: document.getElementById('avg-time'),
        projectedCompletion: document.getElementById('projected-completion'),
        fastestLevel: document.getElementById('fastest-level'),
        currentStreak: document.getElementById('current-streak'),
        analyticsInsight: document.getElementById('analytics-insight'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        chartTabs: document.querySelectorAll('.chart-tab'),
        aiRecommendations: document.getElementById('ai-recommendations'),
        canvasContainer: document.getElementById('canvas-container'),
        resetCameraBtn: document.getElementById('reset-camera-btn'),
        prevVisualBtn: document.getElementById('prev-visual-btn'),
        nextVisualBtn: document.getElementById('next-visual-btn'),
        pomodoroTimer: document.getElementById('pomodoro-timer'),
        pomodoroStatus: document.getElementById('pomodoro-status'),
        workTime: document.getElementById('work-time'),
        breakTime: document.getElementById('break-time'),
        workTimeDisplay: document.getElementById('work-time-display'),
        breakTimeDisplay: document.getElementById('break-time-display'),
        startPomodoro: document.getElementById('start-pomodoro'),
        pausePomodoro: document.getElementById('pause-pomodoro'),
        resetPomodoro: document.getElementById('reset-pomodoro'),
        // Flashcard Elements
        flashcardIntro: document.getElementById('flashcard-intro'),
        tryFlashcardsBtn: document.getElementById('try-flashcards-btn'),
        flashcardViewer: document.getElementById('flashcard-viewer'),
        flashcard: document.getElementById('flashcard'),
        flashcardFrontContent: document.getElementById('flashcard-front-content'),
        flashcardBackContent: document.getElementById('flashcard-back-content'),
        knowBtn: document.getElementById('know-btn'),
        dontKnowBtn: document.getElementById('dont-know-btn'),
        revealAnswerBtn: document.getElementById('reveal-answer-btn'),
        // Add Flashcard Form Elements
        addFlashcardForm: document.getElementById('add-flashcard-form'),
        toggleAddFlashcardBtn: document.getElementById('toggle-add-flashcard'),
        newFlashcardFrontInput: document.getElementById('new-flashcard-front'),
        newFlashcardBackInput: document.getElementById('new-flashcard-back'),
        addFlashcardBtn: document.getElementById('add-flashcard-btn'),
        // Flashcard Management Elements
        flashcardListContainer: document.getElementById('flashcard-list-container'),
        openAddFlashcardModalBtn: document.getElementById('open-add-flashcard-modal-btn')
    };

    // Initialize charts
    let timeAnalysisChart;
    let progressTrendChart;
    let performanceChart;

    function initCharts() {
        // Time Analysis Bar Chart
        const timeCtx = document.getElementById('time-analysis-chart').getContext('2d');
        timeAnalysisChart = new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: [], // Will be filled with level numbers
                datasets: [{
                    label: 'Time Per Level (minutes)',
                    data: [], // Will be filled with time data
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });

        // Progress Trend Radar Chart
        const radarCtx = document.getElementById('progress-trend-chart').getContext('2d');
        progressTrendChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Consistency', 'Efficiency', 'Completion Rate', 'Focus', 'Speed'],
                datasets: [{
                    label: 'Current Performance',
                    data: [50, 50, 50, 50, 50],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });

        // Performance Pie Chart
        const pieCtx = document.getElementById('performance-chart-canvas').getContext('2d');
        performanceChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [
                        'rgba(79, 70, 229, 0.6)',
                        'rgba(255, 255, 255, 0.1)'
                    ],
                    borderColor: [
                        'rgba(79, 70, 229, 1)',
                        'rgba(255, 255, 255, 0.2)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    // Initialize 3D visualization
    let scene, camera, renderer, objects = [];
    let animationFrameId;

    function init3DVisualization() {
        if (renderer) {
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            scene = null;
            camera = null;
            renderer = null;
            objects = [];
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, elements.canvasContainer.clientWidth / elements.canvasContainer.clientHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(elements.canvasContainer.clientWidth, elements.canvasContainer.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Clear previous renderer
        while (elements.canvasContainer.firstChild) {
            elements.canvasContainer.removeChild(elements.canvasContainer.firstChild);
        }
        
        elements.canvasContainer.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        scene.add(directionalLight);

        switch (state.visualizationType) {
            case 0:
                createMountainVisualization();
                break;
            case 1:
                createSpiralVisualization();
                break;
            case 2:
                createPathVisualization();
                break;
        }

        animate();
    }

    function createMountainVisualization() {
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        
        // Create mountain base
        const mountainGeometry = new THREE.ConeGeometry(5, 7, 4);
        const mountainMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4f46e5,
            wireframe: false,
            transparent: true,
            opacity: 0.7,
            emissive: 0x4f46e5,
            emissiveIntensity: 0.2
        });
        const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        mountain.rotation.y = Math.PI / 4;
        scene.add(mountain);
        objects.push(mountain);
        
        // Add flag at the top
        const flagPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
        const flagPoleMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
        const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
        flagPole.position.set(0, 4, 0);
        scene.add(flagPole);
        objects.push(flagPole);
        
        const flagGeometry = new THREE.PlaneGeometry(1, 0.6);
        const flagMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff5722,
            side: THREE.DoubleSide,
            emissive: 0xff5722,
            emissiveIntensity: 0.3
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(0.5, 4.5, 0);
        scene.add(flag);
        objects.push(flag);
        
        // Add checkpoints
        if (state.maxLevel > 0) {
            const maxCheckpoints = Math.min(state.maxLevel, 10); // Max 10 visible checkpoints
            for (let i = 1; i <= maxCheckpoints; i++) {
                const ratio = i / state.maxLevel;
                const height = ratio * 3.5;
                const radius = 5 - ratio * 5;
                const angle = ratio * Math.PI * 2;
                
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;
                
                const checkpointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                const checkpointMaterial = new THREE.MeshPhongMaterial({ 
                    color: i <= state.currentLevel ? 0x10b981 : 0xcccccc,
                    emissive: i <= state.currentLevel ? 0x10b981 : 0x666666,
                    emissiveIntensity: 0.3
                });
                const checkpoint = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
                checkpoint.position.set(x, height, z);
                scene.add(checkpoint);
                objects.push(checkpoint);
            }
        }
        
        // Add climber avatar at current position
        if (state.currentLevel > 0 && state.maxLevel > 0) {
            const ratio = state.currentLevel / state.maxLevel;
            const height = ratio * 3.5;
            const radius = 5 - ratio * 5;
            const angle = ratio * Math.PI * 2;
            
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            const climberGeometry = new THREE.SphereGeometry(0.25, 16, 16);
            const climberMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xf97316,
                emissive: 0xf97316,
                emissiveIntensity: 0.5
            });
            const climber = new THREE.Mesh(climberGeometry, climberMaterial);
            climber.position.set(x, height, z);
            scene.add(climber);
            objects.push(climber);
        }
    }

    function createSpiralVisualization() {
        camera.position.set(0, 10, 15);
        camera.lookAt(0, 0, 0);
        
        // Create spiral platform
        const spiralGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
        const spiralMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4f46e5,
            transparent: true,
            opacity: 0.7,
            emissive: 0x4f46e5,
            emissiveIntensity: 0.2
        });
        const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial);
        spiral.rotation.x = Math.PI / 2;
        scene.add(spiral);
        objects.push(spiral);
        
        // Add levels as spheres along the spiral
        if (state.maxLevel > 0) {
            const maxCheckpoints = Math.min(state.maxLevel, 20); // Max 20 visible checkpoints
            for (let i = 1; i <= maxCheckpoints; i++) {
                const ratio = i / state.maxLevel;
                const angle = ratio * Math.PI * 2 * 2; // Two full rotations
                const height = ratio * 4;
                
                const x = Math.sin(angle) * 5;
                const z = Math.cos(angle) * 5;
                
                const checkpointGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const checkpointMaterial = new THREE.MeshPhongMaterial({ 
                    color: i <= state.currentLevel ? 0x10b981 : 0xcccccc,
                    emissive: i <= state.currentLevel ? 0x10b981 : 0x666666,
                    emissiveIntensity: 0.3
                });
                const checkpoint = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
                checkpoint.position.set(x, height, z);
                scene.add(checkpoint);
                objects.push(checkpoint);
            }
            
            // Add progress path
            if (state.currentLevel > 0) {
                const points = [];
                for (let i = 0; i <= state.currentLevel; i++) {
                    const ratio = i / state.maxLevel;
                    const angle = ratio * Math.PI * 2 * 2;
                    const height = ratio * 4;
                    
                    const x = Math.sin(angle) * 5;
                    const z = Math.cos(angle) * 5;
                    
                    points.push(new THREE.Vector3(x, height, z));
                }
                
                const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const pathMaterial = new THREE.LineBasicMaterial({ 
                    color: 0xf97316,
                    linewidth: 2
                });
                const path = new THREE.Line(pathGeometry, pathMaterial);
                scene.add(path);
                objects.push(path);
            }
            
            // Add avatar at current position
            if (state.currentLevel > 0) {
                const ratio = state.currentLevel / state.maxLevel;
                const angle = ratio * Math.PI * 2 * 2;
                const height = ratio * 4;
                
                const x = Math.sin(angle) * 5;
                const z = Math.cos(angle) * 5;
                
                const avatarGeometry = new THREE.SphereGeometry(0.4, 16, 16);
                const avatarMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0xf97316,
                    emissive: 0xf97316,
                    emissiveIntensity: 0.5
                });
                const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
                avatar.position.set(x, height, z);
                scene.add(avatar);
                objects.push(avatar);
            }
        }
    }

    function createPathVisualization() {
        camera.position.set(0, 5, 15);
        camera.lookAt(0, 0, 0);
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(20, 10);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1e293b,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2;
        ground.position.y = -1;
        scene.add(ground);
        objects.push(ground);
        
        // Create path
        if (state.maxLevel > 0) {
            const pathWidth = 18;
            const pathStart = -pathWidth / 2;
            const stepSize = pathWidth / state.maxLevel;
            
            for (let i = 0; i <= state.maxLevel; i++) {
                // Path segments
                if (i < state.maxLevel) {
                    const x = pathStart + i * stepSize;
                    const pathSegmentGeometry = new THREE.BoxGeometry(stepSize * 0.9, 0.1, 1);
                    const pathSegmentMaterial = new THREE.MeshPhongMaterial({ 
                        color: i < state.currentLevel ? 0x10b981 : 0x4f46e5,
                        transparent: true,
                        opacity: 0.7,
                        emissive: i < state.currentLevel ? 0x10b981 : 0x4f46e5,
                        emissiveIntensity: 0.2
                    });
                    const pathSegment = new THREE.Mesh(pathSegmentGeometry, pathSegmentMaterial);
                    pathSegment.position.set(x + stepSize / 2, -0.95, 0);
                    scene.add(pathSegment);
                    objects.push(pathSegment);
                }
                
                // Milestone markers
                if (i > 0) {
                    const x = pathStart + i * stepSize;
                    const milestoneGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
                    const milestoneMaterial = new THREE.MeshPhongMaterial({ 
                        color: i <= state.currentLevel ? 0x10b981 : 0xcccccc,
                        emissive: i <= state.currentLevel ? 0x10b981 : 0x666666,
                        emissiveIntensity: 0.3
                    });
                    const milestone = new THREE.Mesh(milestoneGeometry, milestoneMaterial);
                    milestone.position.set(x, -0.75, 0);
                    scene.add(milestone);
                    objects.push(milestone);
                    
                    // Level numbers
                    if (i % Math.ceil(state.maxLevel / 10) === 0 || i === state.maxLevel) {
                        const levelMarkerGeometry = new THREE.SphereGeometry(0.25, 16, 16);
                        const levelMarkerMaterial = new THREE.MeshPhongMaterial({ 
                            color: i <= state.currentLevel ? 0xf97316 : 0xcccccc,
                            emissive: i <= state.currentLevel ? 0xf97316 : 0x666666,
                            emissiveIntensity: 0.3
                        });
                        const levelMarker = new THREE.Mesh(levelMarkerGeometry, levelMarkerMaterial);
                        levelMarker.position.set(x, -0.3, 0);
                        scene.add(levelMarker);
                        objects.push(levelMarker);
                    }
                }
            }
            
            // Avatar position
            if (state.currentLevel > 0) {
                const x = pathStart + state.currentLevel * stepSize;
                const avatarGeometry = new THREE.SphereGeometry(0.4, 16, 16);
                const avatarMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0xf97316,
                    emissive: 0xf97316,
                    emissiveIntensity: 0.5
                });
                const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
                avatar.position.set(x, 0, 0);
                scene.add(avatar);
                objects.push(avatar);
            }
            
            // Start and finish flags
            const startFlagGeometry = new THREE.ConeGeometry(0.3, 0.8, 32);
            const startFlagMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x10b981,
                emissive: 0x10b981,
                emissiveIntensity: 0.3
            });
            const startFlag = new THREE.Mesh(startFlagGeometry, startFlagMaterial);
            startFlag.position.set(pathStart, 0, 0);
            scene.add(startFlag);
            objects.push(startFlag);
            
            const finishFlagGeometry = new THREE.ConeGeometry(0.3, 0.8, 32);
            const finishFlagMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xf97316,
                emissive: 0xf97316,
                emissiveIntensity: 0.3
            });
            const finishFlag = new THREE.Mesh(finishFlagGeometry, finishFlagMaterial);
            finishFlag.position.set(pathStart + pathWidth, 0, 0);
            scene.add(finishFlag);
            objects.push(finishFlag);
        }
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        // Rotate and animate objects
        objects.forEach((obj, i) => {
            if (i === 0 && state.visualizationType === 1) { // Rotate the spiral
                obj.rotation.z += 0.002;
            }
        });
        
        renderer.render(scene, camera);
    }

    // Responsive handling for 3D visualization
    function handleResize() {
        if (camera && renderer && elements.canvasContainer) {
            camera.aspect = elements.canvasContainer.clientWidth / elements.canvasContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(elements.canvasContainer.clientWidth, elements.canvasContainer.clientHeight);
        }
    }

    window.addEventListener('resize', handleResize);

    // Pomodoro Timer Functionality
    class PomodoroTimer {
        constructor() {
            this.workTime = 25 * 60; // 25 minutes in seconds
            this.breakTime = 5 * 60; // 5 minutes in seconds
            this.timeLeft = this.workTime;
            this.isRunning = false;
            this.isPaused = false;
            this.mode = 'work'; // 'work' or 'break'
            this.interval = null;
            this.startTime = null;
            this.pauseTime = null;

            // Initialize UI
            this.initializeUI();
        }

        initializeUI() {
            // Set initial values
            elements.workTime.value = '25';
            elements.breakTime.value = '5';
            elements.workTimeDisplay.textContent = '25 min';
            elements.breakTimeDisplay.textContent = '5 min';
            
            // Add event listeners
            elements.startPomodoro.addEventListener('click', () => this.start());
            elements.pausePomodoro.addEventListener('click', () => this.pause());
            elements.resetPomodoro.addEventListener('click', () => this.reset());
            
            elements.workTime.addEventListener('input', (e) => {
                const minutes = parseInt(e.target.value);
                elements.workTimeDisplay.textContent = `${minutes} min`;
                this.setWorkTime(minutes);
            });
            
            elements.breakTime.addEventListener('input', (e) => {
                const minutes = parseInt(e.target.value);
                elements.breakTimeDisplay.textContent = `${minutes} min`;
                this.setBreakTime(minutes);
            });

            // Initial display
            this.updateDisplay();
            this.updateStatus();
        }

        start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.isPaused = false;
            this.startTime = Date.now();
            
            elements.startPomodoro.disabled = true;
            elements.pausePomodoro.disabled = false;
            elements.resetPomodoro.disabled = false;
            
            this.updateDisplay();
            this.updateStatus();
            
            this.interval = setInterval(() => this.tick(), 1000);
        }

        pause() {
            if (!this.isRunning) return;
            
            if (!this.isPaused) {
                this.isPaused = true;
                this.pauseTime = Date.now();
                clearInterval(this.interval);
                elements.pausePomodoro.innerHTML = '<i class="fas fa-play mr-2"></i> Resume';
                elements.pomodoroStatus.textContent = 'Paused';
            } else {
                this.isPaused = false;
                const pauseDuration = Math.floor((Date.now() - this.pauseTime) / 1000);
                this.startTime += pauseDuration * 1000;
                this.interval = setInterval(() => this.tick(), 1000);
                elements.pausePomodoro.innerHTML = '<i class="fas fa-pause mr-2"></i> Pause';
                this.updateStatus();
            }
        }

        reset() {
            clearInterval(this.interval);
            this.isRunning = false;
            this.isPaused = false;
            this.mode = 'work';
            this.timeLeft = this.workTime;
            
            elements.startPomodoro.disabled = false;
            elements.pausePomodoro.disabled = true;
            elements.resetPomodoro.disabled = true;
            elements.pausePomodoro.innerHTML = '<i class="fas fa-pause mr-2"></i> Pause';
            elements.pomodoroStatus.textContent = 'Ready to start';
            elements.pomodoroTimer.classList.add('text-primary');
            elements.pomodoroTimer.classList.remove('text-green-500');
            
            this.updateDisplay();
        }

        tick() {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timeLeft = Math.max(0, (this.mode === 'work' ? this.workTime : this.breakTime) - elapsed);
            
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.switchMode();
            }
        }

        switchMode() {
            clearInterval(this.interval);
            
            if (this.mode === 'work') {
                this.mode = 'break';
                this.timeLeft = this.breakTime;
                this.startTime = Date.now();
                
                // Increment pomodoro completed count
                state.pomodoroCompleted++;
                updateStorage();
                
                // Check for Time Master achievement
                if (state.pomodoroCompleted >= 5 && !state.achievements.timeMaster) {
                    state.achievements.timeMaster = true;
                    showAchievement('Time Master', 'You completed 5 Pomodoro cycles!', 'fa-clock');
                    updateAchievementDisplay();
                }
                
                // Show notification and play sound
                showNotification('Break Time!', 'Good job! Take a short break now.', 'fa-coffee');
                if (state.settings.sounds) {
                    playSound('timer');
                }
            } else {
                this.mode = 'work';
                this.timeLeft = this.workTime;
                this.startTime = Date.now();
                
                // Show notification and play sound
                showNotification('Focus Time!', 'Break is over. Time to get back to work!', 'fa-brain');
                if (state.settings.sounds) {
                    playSound('timer');
                }
            }
            
            this.updateDisplay();
            this.updateStatus();
            this.interval = setInterval(() => this.tick(), 1000);
        }

        updateDisplay() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            elements.pomodoroTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        updateStatus() {
            if (this.mode === 'work') {
                elements.pomodoroStatus.textContent = 'Focus time';
                elements.pomodoroTimer.classList.add('text-primary');
                elements.pomodoroTimer.classList.remove('text-green-500');
            } else {
                elements.pomodoroStatus.textContent = 'Break time';
                elements.pomodoroTimer.classList.add('text-green-500');
                elements.pomodoroTimer.classList.remove('text-primary');
            }
        }

        setWorkTime(minutes) {
            this.workTime = minutes * 60;
            if (!this.isRunning) {
                this.timeLeft = this.workTime;
                this.updateDisplay();
            }
        }

        setBreakTime(minutes) {
            this.breakTime = minutes * 60;
        }
    }

    // Initialize Pomodoro Timer when DOM is loaded
    const pomodoroTimer = new PomodoroTimer();

    // Event Listeners
    elements.startPomodoro.addEventListener('click', () => pomodoroTimer.start());
    elements.pausePomodoro.addEventListener('click', () => pomodoroTimer.pause());
    elements.resetPomodoro.addEventListener('click', () => pomodoroTimer.reset());

    elements.workTime.addEventListener('input', function() {
        const minutes = parseInt(this.value);
        elements.workTimeDisplay.textContent = `${minutes} min`;
        pomodoroTimer.setWorkTime(minutes);
    });

    elements.breakTime.addEventListener('input', function() {
        const minutes = parseInt(this.value);
        elements.breakTimeDisplay.textContent = `${minutes} min`;
        pomodoroTimer.setBreakTime(minutes);
    });

    // Progress Ring Functionality
    function setProgress(percent) {
        const circle = elements.progressRing;
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Local Storage Functionality
    function loadFromStorage() {
        const savedData = localStorage.getItem('examProgressData');
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            Object.assign(state, parsed);
            
            // Update UI based on loaded data
            elements.maxLevelInput.value = state.maxLevel;
            elements.currentLevelDisplay.textContent = state.currentLevel;
            elements.usernameInput.value = state.userName || '';
            elements.examNameInput.value = state.examName || '';
            elements.examDateInput.value = state.examDate || '';
            elements.notesArea.value = state.notes || '';
            elements.userStreak.textContent = state.streak || 0;
            elements.usernameDisplay.textContent = state.userName || 'Study Master';
            elements.themeSelector.value = state.settings.theme || 'dark';
            elements.themeSelect.value = state.settings.theme || 'dark';
            elements.animationToggle.checked = state.settings.animations !== false;
            elements.soundToggle.checked = state.settings.sounds !== false;
            elements.reminderToggle.checked = state.settings.reminders === true;
            
            // Update avatar
            if (state.userName) {
                const initials = state.userName.split(' ').map(name => name[0]).join('').toUpperCase();
                elements.avatarPlaceholder.textContent = initials;
            }
            
            // Update UI elements
            updateLevelDisplay();
            updateHistoryDisplay();
            updateAchievementDisplay();
            updateGoalsDisplay();
            updateAnalytics();
            applyTheme(state.settings.theme || 'dark');
        }
        
        // Check if we need to reset the daily streak
        checkDailyStreak();
    }

    function updateStorage() {
        localStorage.setItem('examProgressData', JSON.stringify(state));
    }

    function updateLevelDisplay() {
        if (state.maxLevel > 0) {
            const progressPercent = (state.currentLevel / state.maxLevel) * 100;
            setProgress(progressPercent);
            elements.progressPercentage.textContent = `${Math.round(progressPercent)}%`;
            elements.levelFraction.textContent = `${state.currentLevel}/${state.maxLevel}`;
            
            // Update performance chart
            if (performanceChart) {
                performanceChart.data.datasets[0].data = [state.currentLevel, state.maxLevel - state.currentLevel];
                performanceChart.update();
            }
            
            // Update time remaining
            if (state.examDate) {
                const examDate = new Date(state.examDate);
                const today = new Date();
                const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                
                if (daysLeft > 0) {
                    elements.timeRemaining.textContent = `Time left: ${daysLeft} days`;
                } else if (daysLeft === 0) {
                    elements.timeRemaining.textContent = `Exam is today!`;
                } else {
                    elements.timeRemaining.textContent = `Exam date has passed`;
                }
            } else {
                elements.timeRemaining.textContent = ``;
            }
        }
    }

    function updateHistoryDisplay() {
        if (state.levelHistory.length === 0) {
            elements.historyContainer.innerHTML = `
                <div class="text-center text-gray-400 py-6">
                    <i class="fas fa-history text-3xl mb-2"></i>
                    <p>Your level history will appear here</p>
                </div>
            `;
            return;
        }
        
        let historyHTML = '';
        
        state.levelHistory.slice().reverse().forEach((level, index) => {
            const reversedIndex = state.levelHistory.length - index;
            const timeTaken = formatTime(level.timeTaken);
            const date = new Date(level.completedAt);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            historyHTML += `
                <div class="glass-light bg-opacity-10 p-3 rounded-lg mb-3">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium">Level ${reversedIndex}</div>
                            <div class="text-xs text-gray-400">${formattedDate}</div>
                        </div>
                        <div class="text-right">
                            <div class="font-medium">${timeTaken}</div>
                            <div class="text-xs text-gray-400">Time Taken</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        elements.historyContainer.innerHTML = historyHTML;
    }

    function updateAchievementDisplay() {
        const achievements = elements.achievementsContainer.querySelectorAll('.achievement');
        
        // First Level achievement
        if (state.achievements.firstLevel) {
            achievements[0].classList.remove('opacity-50');
            achievements[0].querySelector('i').classList.add('text-yellow-400');
            achievements[0].querySelector('i').classList.remove('text-gray-400');
        }
        
        // 3-Day Streak achievement
        if (state.achievements.threeStreak) {
            achievements[1].classList.remove('opacity-50');
            achievements[1].querySelector('i').classList.add('text-yellow-400');
            achievements[1].querySelector('i').classList.remove('text-gray-400');
        }
        
        // Speed Demon achievement
        if (state.achievements.speedDemon) {
            achievements[2].classList.remove('opacity-50');
            achievements[2].querySelector('i').classList.add('text-yellow-400');
            achievements[2].querySelector('i').classList.remove('text-gray-400');
        }
        
        // Halfway There achievement
        if (state.achievements.halfway) {
            achievements[3].classList.remove('opacity-50');
            achievements[3].querySelector('i').classList.add('text-yellow-400');
            achievements[3].querySelector('i').classList.remove('text-gray-400');
        }
        
        // Time Master achievement
        if (state.achievements.timeMaster) {
            achievements[4].classList.remove('opacity-50');
            achievements[4].querySelector('i').classList.add('text-yellow-400');
            achievements[4].querySelector('i').classList.remove('text-gray-400');
        }
        
        // Goal Crusher achievement
        if (state.achievements.goalCrusher) {
            achievements[5].classList.remove('opacity-50');
            achievements[5].querySelector('i').classList.add('text-yellow-400');
            achievements[5].querySelector('i').classList.remove('text-gray-400');
        }
    }

    function updateGoalsDisplay() {
        if (state.goals.length === 0) {
            elements.goalsContainer.innerHTML = `
                <div class="text-center text-gray-400 py-4">
                    <i class="fas fa-bullseye text-3xl mb-2"></i>
                    <p>Add your study goals here</p>
                </div>
            `;
            return;
        }
        
        let goalsHTML = '';
        
        state.goals.forEach((goal, index) => {
            const priorityColor = goal.priority === 'high' ? 'text-red-500' : (goal.priority === 'medium' ? 'text-yellow-500' : 'text-green-500');
            const deadlineText = goal.deadline ? `Deadline: ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline';
            
            goalsHTML += `
                <div class="glass-light bg-opacity-10 p-3 rounded-lg mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <div class="font-medium">${goal.title}</div>
                        <div class="flex space-x-2">
                            <div class="text-xs ${priorityColor} uppercase">${goal.priority}</div>
                            <button class="goal-complete-btn text-gray-400 hover:text-green-500" data-index="${index}">
                                <i class="fas fa-check-circle"></i>
                            </button>
                            <button class="goal-delete-btn text-gray-400 hover:text-red-500" data-index="${index}">
                                <i class="fas fa-times-circle"></i>
                            </button>
                        </div>
                    </div>
                    ${goal.description ? `<div class="text-sm mb-2">${goal.description}</div>` : ''}
                    <div class="text-xs text-gray-400">${deadlineText}</div>
                </div>
            `;
        });
        
        elements.goalsContainer.innerHTML = goalsHTML;
        
        // Add event listeners to goal buttons
        document.querySelectorAll('.goal-complete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                completeGoal(index);
            });
        });
        
        document.querySelectorAll('.goal-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteGoal(index);
            });
        });
    }

    function completeGoal(index) {
        showNotification('Goal Completed!', `You've completed: ${state.goals[index].title}`, 'fa-check-circle');
        state.goals.splice(index, 1);
        updateGoalsDisplay();
        updateStorage();
    }

    function deleteGoal(index) {
        state.goals.splice(index, 1);
        updateGoalsDisplay();
        updateStorage();
    }

    function updateAnalytics() {
        if (state.levelHistory.length === 0) {
            return;
        }
        
        // Calculate average time per level
        const totalTime = state.levelHistory.reduce((sum, level) => sum + level.timeTaken, 0);
        const avgTimeSeconds = totalTime / state.levelHistory.length;
        elements.avgTime.textContent = formatTime(avgTimeSeconds);
        
        // Find fastest level
        const fastestLevel = state.levelHistory.reduce((fastest, level, index) => {
            return level.timeTaken < fastest.time ? {index: index + 1, time: level.timeTaken} : fastest;
        }, {index: 0, time: Infinity});
        
        if (fastestLevel.index > 0) {
            elements.fastestLevel.textContent = `Level ${fastestLevel.index}`;
        }
        
        // Update streak display
        elements.currentStreak.textContent = `${state.streak} days`;
        
        // Calculate projected completion
        if (state.maxLevel > state.currentLevel) {
            const remainingLevels = state.maxLevel - state.currentLevel;
            const projectedTimeSeconds = avgTimeSeconds * remainingLevels;
            const now = new Date();
            const projectedDate = new Date(now.getTime() + projectedTimeSeconds * 1000);
            
            elements.projectedCompletion.textContent = projectedDate.toLocaleDateString();
        }
        
        // Update charts
        updateCharts();
        
        // Generate AI insight
        generateAIInsight();
    }

    function updateCharts() {
        // Time Analysis Chart
        if (timeAnalysisChart && state.maxLevel > 0) {
            let labels = [];
            let data = [];
            if (state.currentLevel > 0) {
                // Dummy data for Time Analysis after first level up
                labels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
                data = [15, 18, 12, 20, 17]; // Dummy times in minutes
            } else {
                labels = state.levelHistory.map((_, i) => `Level ${i + 1}`);
                data = state.levelHistory.map(level => (level.timeTaken / 60).toFixed(1)); // Convert to minutes
            }

            timeAnalysisChart.data.labels = labels;
            timeAnalysisChart.data.datasets[0].data = data;
            timeAnalysisChart.update();
        }

        // Progress Trend Chart
        if (progressTrendChart && state.maxLevel > 0) {
            let radarData = [50, 50, 50, 50, 50]; // Default or initial data
            if (state.currentLevel > 0) {
                // Dummy data for Progress Trends after first level up
                radarData = [
                    Math.min(calculateConsistency(), 100), // Keep consistency calculation
                    Math.min(calculateEfficiency(), 100), // Keep efficiency calculation
                    Math.min((state.currentLevel / state.maxLevel) * 100, 100), // Keep completion rate
                    Math.min(state.pomodoroCompleted * 15, 100), // Dummy focus based on pomodoro
                    Math.min(calculateSpeed() * 1.2, 100) // Dummy speed increase
                ];
            } else {
                 // Calculate metrics for initial state if needed or keep defaults
                 const consistency = calculateConsistency();
                 const efficiency = calculateEfficiency();
                 const completionRate = (state.currentLevel / state.maxLevel) * 100;
                 const focus = state.pomodoroCompleted * 10;
                 const speed = calculateSpeed();
                 radarData = [
                     Math.min(consistency, 100),
                     Math.min(efficiency, 100),
                     Math.min(completionRate, 100),
                     Math.min(focus, 100),
                     Math.min(speed, 100)
                 ];
            }

            progressTrendChart.data.datasets[0].data = radarData;
            progressTrendChart.update();
        }

        // Performance Chart (already updated in updateLevelDisplay)
    }

    function calculateConsistency() {
        if (state.levelHistory.length <= 1) return 50;
        
        const timestamps = state.levelHistory.map(level => new Date(level.completedAt).getTime());
        let totalVariance = 0;
        
        for (let i = 1; i < timestamps.length; i++) {
            const timeDiff = Math.abs(timestamps[i] - timestamps[i-1]);
            const averageTime = 24 * 60 * 60 * 1000; // One day in milliseconds
            const variance = Math.min(timeDiff, averageTime) / averageTime;
            totalVariance += (1 - variance);
        }
        
        return (totalVariance / (timestamps.length - 1)) * 100;
    }

    function calculateEfficiency() {
        if (state.levelHistory.length === 0) return 50;
        
        const times = state.levelHistory.map(level => level.timeTaken);
        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const expectedTime = 30 * 60; // Expected time: 30 minutes
        
        const efficiency = (expectedTime / avgTime) * 100;
        return Math.min(Math.max(efficiency, 0), 100);
    }

    function calculateSpeed() {
        if (state.levelHistory.length === 0) return 50;
        
        const timestamps = state.levelHistory.map(level => new Date(level.completedAt).getTime());
        const firstTimestamp = timestamps[0];
        const lastTimestamp = timestamps[timestamps.length - 1];
        const totalDays = (lastTimestamp - firstTimestamp) / (24 * 60 * 60 * 1000);
        
        const levelsPerDay = state.levelHistory.length / Math.max(totalDays, 1);
        const expectedLevelsPerDay = 2; // Expected: 2 levels per day
        
        const speed = (levelsPerDay / expectedLevelsPerDay) * 100;
        return Math.min(Math.max(speed, 0), 100);
    }

    function generateAIInsight() {
        if (state.levelHistory.length === 0) {
            return;
        }
        
        let insights = [];
        
        // Calculate metrics
        const avgTimeSeconds = state.levelHistory.reduce((sum, level) => sum + level.timeTaken, 0) / state.levelHistory.length;
        const recentLevels = state.levelHistory.slice(-3);
        const recentAvg = recentLevels.reduce((sum, level) => sum + level.timeTaken, 0) / recentLevels.length;
        const trend = recentAvg < avgTimeSeconds ? 'improving' : 'slowing';
        const consistency = calculateConsistency();
        const progress = (state.currentLevel / state.maxLevel) * 100;
        
        // Progress-based insights
        if (progress < 25) {
            insights.push("You're making good initial progress. Try to maintain a consistent study schedule to build momentum.");
        } else if (progress < 50) {
            insights.push("You're making steady progress. Consider reviewing earlier material to reinforce your learning.");
        } else if (progress < 75) {
            insights.push("You've covered more than half the material. This is a good time to start practice exams to identify knowledge gaps.");
        } else {
            insights.push("You're in the final stretch! Focus on practice tests and reviewing difficult topics.");
        }
        
        // Time trend insights
        if (trend === 'improving') {
            insights.push("Your completion time is improving! Your study efficiency appears to be increasing.");
        } else {
            insights.push("Your recent levels are taking longer to complete. This could indicate more complex material or a need to refresh your study techniques.");
        }
        
        // Consistency insights
        if (consistency < 40) {
            insights.push("Your study schedule has been irregular. Try to establish a more consistent daily routine.");
        } else if (consistency > 70) {
            insights.push("Your consistent study schedule is excellent. Maintaining this routine will help with long-term retention.");
        }
        
        // Pomodoro insights
        if (state.pomodoroCompleted > 0) {
            insights.push(`You've completed ${state.pomodoroCompleted} Pomodoro sessions. This focused study technique is proven to improve learning efficiency.`);
        }
        
        // Select two random insights
        const shuffled = insights.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);
        
        elements.analyticsInsight.textContent = selected.join(' ');
        
        // Update AI recommendations
        let aiHTML = '';
        
        // Add personalized recommendations
        if (state.levelHistory.length > 0) {
            if (trend === 'improving') {
                aiHTML += `
                    <div class="ai-suggestion p-3 pl-4 rounded-lg glass-light bg-opacity-10 mb-3">
                        <div class="flex items-start">
                            <i class="fas fa-chart-line text-primary mt-1 mr-3"></i>
                            <div>
                                <p class="text-sm">Your efficiency is improving! You're completing levels faster than your average, which suggests your study methods are working well.</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (consistency < 40) {
                aiHTML += `
                    <div class="ai-suggestion p-3 pl-4 rounded-lg glass-light bg-opacity-10 mb-3">
                        <div class="flex items-start">
                            <i class="fas fa-calendar-alt text-primary mt-1 mr-3"></i>
                            <div>
                                <p class="text-sm">I've noticed your study pattern is a bit irregular. Research shows that studying at consistent times each day improves retention by up to 30%. Try setting a regular schedule.</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (state.levelHistory.length >= 3) {
                aiHTML += `
                    <div class="ai-suggestion p-3 pl-4 rounded-lg glass-light bg-opacity-10">
                        <div class="flex items-start">
                            <i class="fas fa-brain text-primary mt-1 mr-3"></i>
                            <div>
                                <p class="text-sm">Based on your progress pattern, I recommend using spaced repetition to review material from levels ${Math.max(1, state.currentLevel - 2)} and ${Math.max(1, state.currentLevel - 1)} before advancing further.</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        elements.aiRecommendations.innerHTML = aiHTML;
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    function levelUp() {
        if (state.currentLevel >= state.maxLevel) {
            showNotification('Maximum Level Reached', 'You have already reached your maximum level!', 'fa-trophy');
            return;
        }
        
        if (state.maxLevel === 0) {
            showNotification('Set Max Level First', 'Please set your maximum level before leveling up.', 'fa-exclamation-circle');
            return;
        }
        
        const now = new Date();
        
        // If this is the first level up, record the start time
        if (state.currentLevel === 0) {
            state.levelStartTime = now.getTime();
        }
        
        // Calculate time taken for this level
        const timeTaken = state.levelStartTime ? (now.getTime() - state.levelStartTime) / 1000 : 0;
        
        // Update current level
        state.currentLevel++;
        
        // Add to history
        state.levelHistory.push({
            level: state.currentLevel,
            timeTaken: timeTaken,
            completedAt: now.toISOString()
        });
        
        // Reset level start time for next level
        state.levelStartTime = now.getTime();
        
        // Update streak
        updateStreak();
        
        // Update UI
        elements.currentLevelDisplay.textContent = state.currentLevel;
        updateLevelDisplay();
        updateHistoryDisplay();
        updateAnalytics();
        
        // Save to local storage
        updateStorage();
        
        // Trigger confetti if animations are enabled
        if (state.settings.animations) {
            triggerConfetti();
        }
        
        // Play sound if enabled
        if (state.settings.sounds) {
            playSound('levelUp');
        }
        
        // Check for achievements
        checkAchievements();
        
        // Update 3D visualization
        init3DVisualization();
        
        // Show notification
        showNotification('Level Up!', `Congratulations! You've advanced to Level ${state.currentLevel}`, 'fa-arrow-up');
        
        // Generate new AI recommendation
        addAIRecommendation();
    }

    function addAIRecommendation() {
        if (state.levelHistory.length < 2) return;
        
        const lastLevel = state.levelHistory[state.levelHistory.length - 1];
        const previousLevel = state.levelHistory[state.levelHistory.length - 2];
        
        let recommendation = '';
        
        if (lastLevel.timeTaken < previousLevel.timeTaken) {
            recommendation = `
                <div class="ai-suggestion p-3 pl-4 rounded-lg glass-light bg-opacity-10">
                    <div class="flex items-start">
                        <i class="fas fa-tachometer-alt text-primary mt-1 mr-3"></i>
                        <div>
                            <p class="text-sm">Great improvement! You completed Level ${state.currentLevel} faster than the previous level. Your study efficiency is increasing.</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (lastLevel.timeTaken > previousLevel.timeTaken * 1.5) {
            recommendation = `
                <div class="ai-suggestion p-3 pl-4 rounded-lg glass-light bg-opacity-10">
                    <div class="flex items-start">
                        <i class="fas fa-lightbulb text-primary mt-1 mr-3"></i>
                        <div>
                            <p class="text-sm">I noticed Level ${state.currentLevel} took you longer than previous levels. This might indicate challenging material. Consider using the Pomodoro technique for better focus.</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const nextLevelTips = [
                "Try summarizing what you've learned so far before moving to the next level. This helps consolidate knowledge.",
                "Consider taking a 10-minute break before starting the next level to refresh your mind.",
                "Review your notes from previous levels to maintain connections between concepts.",
                "As you progress, try teaching the material to someone else—it's one of the best ways to test your understanding."
            ];
            
            const randomTip = nextLevelTips[Math.floor(Math.random() * nextLevelTips.length)];
            
            recommendation = `
                <div class="ai-suggestion p-3 pl-4 rounded-lg glass-light bg-opacity-10">
                    <div class="flex items-start">
                        <i class="fas fa-lightbulb text-primary mt-1 mr-3"></i>
                        <div>
                            <p class="text-sm">${randomTip}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        elements.aiRecommendations.innerHTML = recommendation + elements.aiRecommendations.innerHTML;
        
        // Limit to 3 recommendations
        const recommendations = elements.aiRecommendations.querySelectorAll('.ai-suggestion');
        if (recommendations.length > 3) {
            recommendations[recommendations.length - 1].remove();
        }
    }

    function checkAchievements() {
        // First Level achievement
        if (state.currentLevel >= 1 && !state.achievements.firstLevel) {
            state.achievements.firstLevel = true;
            showAchievement('First Level', 'You completed your first level!', 'fa-flag-checkered');
        }
        
        // Halfway There achievement
        if (state.currentLevel >= state.maxLevel / 2 && !state.achievements.halfway) {
            state.achievements.halfway = true;
            showAchievement('Halfway There', 'You reached 50% of your goal!', 'fa-award');
        }
        
        // Goal Crusher achievement
        if (state.currentLevel >= state.maxLevel && !state.achievements.goalCrusher) {
            state.achievements.goalCrusher = true;
            showAchievement('Goal Crusher', 'Congratulations! You completed all levels!', 'fa-trophy');
        }
        
        // Speed Demon achievement
        if (state.levelHistory.length >= 2) {
            const lastLevel = state.levelHistory[state.levelHistory.length - 1];
            const fastTime = 10 * 60; // 10 minutes in seconds
            
            if (lastLevel.timeTaken < fastTime && !state.achievements.speedDemon) {
                state.achievements.speedDemon = true;
                showAchievement('Speed Demon', 'You completed a level in record time!', 'fa-tachometer-alt');
            }
        }
        
        updateAchievementDisplay();
        updateStorage();
    }

    function showAchievement(title, description, icon) {
        elements.achievementTitle.textContent = title;
        elements.achievementDescription.textContent = description;
        elements.achievementIcon.className = `fas ${icon} text-6xl text-yellow-400`;
        elements.achievementPopup.classList.remove('hidden');
        
        // Play achievement sound if enabled
        if (state.settings.sounds) {
            playSound('achievement');
        }
    }

    function triggerConfetti() {
        elements.confettiCanvas.classList.remove('hidden');
        
        const confettiSettings = {
            target: 'confetti-canvas',
            max: 200,
            size: 1.5,
            animate: true,
            props: ['circle', 'square', 'triangle', 'line'],
            colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
            clock: 25,
            interval: null,
            rotate: true,
            width: window.innerWidth,
            height: window.innerHeight,
            start_from_edge: true,
            respawn: true
        };
        
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        
        setTimeout(() => {
            confetti.clear();
            elements.confettiCanvas.classList.add('hidden');
        }, 3000);
    }

    function checkDailyStreak() {
        const today = new Date().setHours(0, 0, 0, 0);
        
        if (state.lastStudyDate) {
            const lastStudy = new Date(state.lastStudyDate).setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayDate = yesterday.setHours(0, 0, 0, 0);
            
            // If last study was before yesterday, reset streak
            if (lastStudy < yesterdayDate) {
                state.streak = 0;
                updateStorage();
            }
        }
    }

    function updateStreak() {
        const today = new Date().setHours(0, 0, 0, 0);
        
        if (state.lastStudyDate) {
            const lastStudy = new Date(state.lastStudyDate).setHours(0, 0, 0, 0);
            
            // Only increment streak if last study was yesterday or earlier (not today)
            if (lastStudy < today) {
                state.streak++;
                
                // Check for 3-day streak achievement
                if (state.streak >= 3 && !state.achievements.threeStreak) {
                    state.achievements.threeStreak = true;
                    showAchievement('3-Day Streak', 'You studied for 3 days in a row!', 'fa-fire');
                    updateAchievementDisplay();
                }
            }
        } else {
            state.streak = 1;
        }
        
        state.lastStudyDate = new Date().toISOString();
        elements.userStreak.textContent = state.streak;
    }

    function showNotification(title, message, icon) {
        elements.notificationTitle.textContent = title;
        elements.notificationMessage.textContent = message;
        elements.notificationIcon.innerHTML = `<i class="fas ${icon}"></i>`;
        elements.notificationToast.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            elements.notificationToast.classList.add('hidden');
        }, 5000);
    }

    function applyTheme(theme) {
        document.getElementById('app').className = `theme-${theme} min-h-screen p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out`;
        
        // Update chart colors based on theme
        const chartBackgroundColor = theme === 'light' || theme === 'minimalist' || theme === 'nature' ? 
            'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
            
        const chartTextColor = theme === 'light' || theme === 'minimalist' || theme === 'nature' ? 
            'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
        
        if (timeAnalysisChart) {
            timeAnalysisChart.options.scales.y.grid.color = chartBackgroundColor;
            timeAnalysisChart.options.scales.x.grid.color = chartBackgroundColor;
            timeAnalysisChart.options.scales.y.ticks.color = chartTextColor;
            timeAnalysisChart.options.scales.x.ticks.color = chartTextColor;
            timeAnalysisChart.options.plugins.legend.labels.color = chartTextColor;
            timeAnalysisChart.update();
        }
        
        if (progressTrendChart) {
            progressTrendChart.options.scales.r.angleLines.color = chartBackgroundColor;
            progressTrendChart.options.scales.r.grid.color = chartBackgroundColor;
            progressTrendChart.options.scales.r.pointLabels.color = chartTextColor;
            progressTrendChart.options.scales.r.ticks.color = chartTextColor;
            progressTrendChart.options.plugins.legend.labels.color = chartTextColor;
            progressTrendChart.update();
        }
        
        if (performanceChart) {
            performanceChart.options.plugins.legend.labels.color = chartTextColor;
            performanceChart.update();
        }
    }

    function playSound(type) {
        let sound;
        
        switch (type) {
            case 'levelUp':
                sound = new Audio('https://cdn.jsdelivr.net/gh/freeCodeCamp/testable-projects-fcc@master/build/audio/drum-kit/boom.wav');
                break;
            case 'achievement':
                sound = new Audio('https://cdn.jsdelivr.net/gh/freeCodeCamp/testable-projects-fcc@master/build/audio/drum-kit/ride.wav');
                break;
            case 'timer':
                sound = new Audio('https://cdn.jsdelivr.net/gh/freeCodeCamp/testable-projects-fcc@master/build/audio/clock-alarm.wav');
                break;
            default:
                sound = new Audio('https://cdn.jsdelivr.net/gh/freeCodeCamp/testable-projects-fcc@master/build/audio/drum-kit/snare.wav');
        }
        
        sound.volume = 0.5;
        sound.play().catch(() => console.log('Audio playback was prevented by the browser.'));
    }
    
    // Button Events
    elements.setMaxBtn.addEventListener('click', function() {
        const maxLevel = parseInt(elements.maxLevelInput.value);
        
        if (isNaN(maxLevel) || maxLevel <= 0) {
            showNotification('Invalid Input', 'Please enter a valid maximum level greater than 0.', 'fa-exclamation-circle');
            return;
        }
        
        state.maxLevel = maxLevel;
        
        // Reset progress if reducing max level below current level
        if (state.currentLevel > state.maxLevel) {
            state.currentLevel = state.maxLevel;
            elements.currentLevelDisplay.textContent = state.currentLevel;
        }
        
        updateLevelDisplay();
        updateStorage();
        
        // Initialize 3D visualization
        init3DVisualization();
        
        showNotification('Max Level Set', `Your maximum level has been set to ${maxLevel}.`, 'fa-check-circle');
    });
    
    elements.levelUpBtn.addEventListener('click', levelUp);
    
    elements.usernameInput.addEventListener('input', function() {
        state.userName = this.value;
        elements.usernameDisplay.textContent = state.userName || 'Study Master';
        
        // Update avatar
        if (state.userName) {
            const initials = state.userName.split(' ').map(name => name[0]).join('').toUpperCase();
            elements.avatarPlaceholder.textContent = initials;
        } else {
            elements.avatarPlaceholder.textContent = '';
        }
        
        updateStorage();
    });
    
    elements.examNameInput.addEventListener('input', function() {
        state.examName = this.value;
        updateStorage();
    });
    
    elements.examDateInput.addEventListener('input', function() {
        state.examDate = this.value;
        updateLevelDisplay();
        updateStorage();
    });
    
    elements.saveNotesBtn.addEventListener('click', function() {
        state.notes = elements.notesArea.value;
        updateStorage();
        showNotification('Notes Saved', 'Your study notes have been saved.', 'fa-save');
    });
    
    elements.expandExtrasBtn.addEventListener('click', function() {
        const isHidden = elements.extrasContainer.classList.contains('hidden');
        
        if (isHidden) {
            elements.extrasContainer.classList.remove('hidden');
            this.innerHTML = `<span>Hide Goals & Notes</span><i class="fas fa-chevron-up ml-2"></i>`;
        } else {
            elements.extrasContainer.classList.add('hidden');
            this.innerHTML = `<span>Show Goals & Notes</span><i class="fas fa-chevron-down ml-2"></i>`;
        }
    });
    
    elements.addGoalBtn.addEventListener('click', function() {
        elements.addGoalModal.classList.remove('hidden');
    });
    
    elements.closeGoalModal.addEventListener('click', function() {
        elements.addGoalModal.classList.add('hidden');
    });
    
    elements.addGoalSubmit.addEventListener('click', function() {
        const title = elements.goalTitle.value.trim();
        
        if (!title) {
            showNotification('Goal Title Required', 'Please enter a title for your goal.', 'fa-exclamation-circle');
            return;
        }
        
        const newGoal = {
            title: title,
            description: elements.goalDescription.value.trim(),
            deadline: elements.goalDeadline.value,
            priority: elements.goalPriority.value
        };
        
        state.goals.push(newGoal);
        updateGoalsDisplay();
        updateStorage();
        
        // Reset form
        elements.goalTitle.value = '';
        elements.goalDescription.value = '';
        elements.goalDeadline.value = '';
        elements.goalPriority.value = 'medium';
        
        // Close modal
        elements.addGoalModal.classList.add('hidden');
        
        showNotification('Goal Added', 'Your new study goal has been added.', 'fa-check-circle');
    });
    
    elements.themeSelector.addEventListener('change', function() {
        const theme = this.value;
        applyTheme(theme);
        state.settings.theme = theme;
        elements.themeSelect.value = theme;
        updateStorage();
    });
    
    elements.themeSelect.addEventListener('change', function() {
        const theme = this.value;
        applyTheme(theme);
        state.settings.theme = theme;
        elements.themeSelector.value = theme;
        updateStorage();
    });
    
    elements.settingsBtn.addEventListener('click', function() {
        elements.settingsModal.classList.remove('hidden');
    });
    
    elements.closeSettings.addEventListener('click', function() {
        elements.settingsModal.classList.add('hidden');
    });
    
    elements.resetDataBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.removeItem('examProgressData');
            location.reload();
        }
    });
    
    elements.saveSettingsBtn.addEventListener('click', function() {
        state.settings.animations = elements.animationToggle.checked;
        state.settings.sounds = elements.soundToggle.checked;
        state.settings.reminders = elements.reminderToggle.checked;
        state.settings.theme = elements.themeSelect.value;
        
        updateStorage();
        elements.settingsModal.classList.add('hidden');
        
        showNotification('Settings Saved', 'Your settings have been updated.', 'fa-check-circle');
    });
    
    elements.closeAchievement.addEventListener('click', function() {
        elements.achievementPopup.classList.add('hidden');
    });
    
    elements.exportDataBtn.addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "exam_progress_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
    
    elements.importDataBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        localStorage.setItem('examProgressData', JSON.stringify(importedData));
                        showNotification('Data Imported', 'Your data has been imported successfully. Reloading...', 'fa-check-circle');
                        
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } catch (err) {
                        showNotification('Import Error', 'There was an error importing your data.', 'fa-exclamation-circle');
                    }
                };
                
                reader.readAsText(file);
            }
        };
        
        input.click();
    });
    
    // Tab functionality
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all tabs
            elements.tabBtns.forEach(btn => {
                btn.classList.remove('tab-active');
                btn.classList.add('text-gray-400');
            });
            
            // Hide all tab content
            elements.chartTabs.forEach(tab => {
                tab.classList.add('hidden');
            });

            // Show the selected tab content
            document.getElementById(tabId).classList.remove('hidden');

            // Add active class to the clicked tab
            this.classList.add('tab-active');
            this.classList.remove('text-gray-400');
        });
    });

    // Flashcard Functionality
    let flashcards = [
        { front: 'What is the capital of France?', back: 'Paris' },
        { front: 'What is the square root of 144?', back: '12' },
        { front: 'What is the chemical symbol for water?', back: 'H2O' },
        { front: 'Who wrote Hamlet?', back: 'William Shakespeare' },
        { front: 'What is the largest planet in our solar system?', back: 'Jupiter' }
    ];
    let currentFlashcardIndex = 0;

    function showFlashcard(index) {
        if (index < 0 || index >= flashcards.length) {
            // Handle end of flashcards (e.g., show completion message or loop)
            elements.flashcardFrontContent.textContent = 'End of Flashcards!';
            elements.flashcardBackContent.textContent = 'Great Job!';
            elements.knowBtn.disabled = true;
            elements.dontKnowBtn.disabled = true;
            elements.revealAnswerBtn.disabled = true;
            return;
        }
        
        const card = flashcards[index];
        elements.flashcardFrontContent.textContent = card.front;
        elements.flashcardBackContent.textContent = card.back;
        
        // Hide navigation buttons and show reveal button initially
        elements.knowBtn.classList.add('hidden');
        elements.dontKnowBtn.classList.add('hidden');
        elements.revealAnswerBtn.classList.remove('hidden');
    }

    elements.tryFlashcardsBtn.addEventListener('click', function() {
        elements.flashcardIntro.classList.add('hidden');
        elements.flashcardViewer.classList.remove('hidden');
        currentFlashcardIndex = 0;
        showFlashcard(currentFlashcardIndex);
    });

    // Add event listener for Reveal Answer button
    elements.revealAnswerBtn.addEventListener('click', function() {
        elements.flashcard.classList.add('is-flipped'); // Add class to trigger flip
        // Hide reveal button and show navigation buttons
        elements.revealAnswerBtn.classList.add('hidden');
        elements.knowBtn.classList.remove('hidden');
        elements.dontKnowBtn.classList.remove('hidden');
    });

    elements.knowBtn.addEventListener('click', function() {
        currentFlashcardIndex++;
        showFlashcard(currentFlashcardIndex);
        elements.flashcard.classList.remove('is-flipped'); // Remove class for next card
    });

    elements.dontKnowBtn.addEventListener('click', function() {
        // For simplicity, 'Don't Know' also moves to the next card for now
        // In a real app, you might move it to a 'review' pile or similar
        currentFlashcardIndex++;
        showFlashcard(currentFlashcardIndex);
        elements.flashcard.classList.remove('is-flipped'); // Remove class for next card
    });

    // Add Flashcard Form Functionality
    elements.toggleAddFlashcardBtn.addEventListener('click', function() {
        elements.addFlashcardForm.classList.toggle('hidden');
    });

    elements.addFlashcardBtn.addEventListener('click', function() {
        const front = elements.newFlashcardFrontInput.value.trim();
        const back = elements.newFlashcardBackInput.value.trim();
        
        if (front && back) {
            flashcards.push({ front, back });
            showNotification('Flashcard Added', 'Your new flashcard has been added.', 'fa-check-circle');
            
            // Clear form
            elements.newFlashcardFrontInput.value = '';
            elements.newFlashcardBackInput.value = '';
            
            // Optionally hide form
            elements.addFlashcardForm.classList.add('hidden');
            
            // If currently viewing flashcards, reset to show the first card (including the new one)
            if (!elements.flashcardViewer.classList.contains('hidden')) {
                currentFlashcardIndex = 0;
                showFlashcard(currentFlashcardIndex);
            }
            renderFlashcardList(); // Update the list in the management section
        } else {
            showNotification('Input Required', 'Please enter both a question and an answer.', 'fa-exclamation-circle');
        }
    });

    // Flashcard Management Functionality
    function renderFlashcardList() {
        const container = elements.flashcardListContainer;
        container.innerHTML = ''; // Clear current list
        
        if (flashcards.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-400 py-4">
                    <i class="fas fa-cards text-3xl mb-2"></i>
                    <p>Your custom flashcards will appear here</p>
                </div>
            `;
            return;
        }
        
        flashcards.forEach((card, index) => {
            const flashcardElement = document.createElement('div');
            flashcardElement.classList.add('glass-light', 'bg-opacity-10', 'p-3', 'rounded-lg', 'mb-2', 'text-sm');
            flashcardElement.innerHTML = `
                <div class="font-semibold mb-1">Q: ${card.front}</div>
                <div class="text-gray-700">A: ${card.back}</div>
                <div class="flex justify-end space-x-2 mt-2">
                    <button class="edit-flashcard-btn text-primary hover:text-primary-light" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-flashcard-btn text-red-500 hover:text-red-600" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(flashcardElement);
        });
        
        // Add event listeners for edit and delete buttons
        container.querySelectorAll('.edit-flashcard-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                // TODO: Implement edit functionality (e.g., populate form, open modal)
                showNotification('Edit', `Edit flashcard at index ${index}`, 'fa-edit');
            });
        });
        
        container.querySelectorAll('.delete-flashcard-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteFlashcard(index);
            });
        });
    }

    function deleteFlashcard(index) {
        if (confirm('Are you sure you want to delete this flashcard?')) {
            flashcards.splice(index, 1);
            showNotification('Flashcard Deleted', 'The flashcard has been removed.', 'fa-trash');
            renderFlashcardList();
            // TODO: Also update the main flashcard viewer if necessary
        }
    }

    elements.openAddFlashcardModalBtn.addEventListener('click', function() {
        // For now, just toggle the existing add flashcard form
        elements.addFlashcardForm.classList.toggle('hidden');
        // In a more complex app, you might open a dedicated modal here
    });

    // Initial render of flashcard list on page load
    renderFlashcardList();
});