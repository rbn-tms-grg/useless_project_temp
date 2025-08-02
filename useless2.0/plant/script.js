// Plant state
let waterCount = 0;
let sunCount = 0;
let lastWatered = Date.now();
let lastSunned = Date.now();
let currentRoast = "Oh look, another human seeking validation from a plant. How original.";
let plantMood = 'neutral';
let achievements = [];
let sessionClicks = 0;
let sessionSuns = 0;
let lastActivityTime = Date.now();

// Roast messages
const roasts = {
    effort: [
        "Wow... one click. Truly the peak of human achievement.",
        "Two whole clicks? Don't strain yourself.",
        "Three clicks in and I'm already disappointed.",
        "Four clicks. At this rate, you'll achieve mediocrity by next year.",
        "Keep it up and you might earn the title of 'Professional Button Presser'.",
        "Oh look, we're at double digits. Should I be impressed?",
        "Fifteen clicks of pure, unadulterated effort. Revolutionary.",
        "Twenty clicks of... whatever this is supposed to be.",
        "Congrats, you've achieved nothing... but consistently.",
        "Your dedication to meaningless tasks is truly inspiring."
    ],
    timing: {
        tooSoon: [
            "Desperate much? I don't need this much attention.",
            "Clingy human detected. Give me space.",
            "Again? Already? Do you have nothing better to do?",
            "I'm starting to think you have attachment issues."
        ],
        tooLate: [
            "Oh, look who finally remembered me. I almost wrote a will.",
            "Did you forget I existed? Classic human behavior.",
            "Thanks for the neglect. Really felt the love there.",
            "I was starting to enjoy the silence, actually."
        ]
    },
    sun: {
        tooMuch: [
            "Are you trying to cook me? I'm a plant, not a barbecue.",
            "This isn't tanning, it's torture. Dial it back, sunshine.",
            "I asked for light, not a solar flamethrower.",
            "You're literally frying my brain. What little I had left.",
            "Is this your idea of care? I'm crispy now.",
            "I'm not a potato. Stop trying to bake me.",
            "This is plant abuse. I'm calling the authorities... if I could."
        ],
        balance: [
            "Oh wow, you actually found the balance. Beginner's luck?",
            "Finally, some decent light management. Don't let it go to your head.",
            "Not terrible, but I've seen houseplants do better math.",
            "You managed not to kill me with light. Congratulations?"
        ],
        drought: [
            "A sun drought? In this economy? How very 2020 of you.",
            "I'm paler than your social life right now.",
            "Some light would be nice. I'm not a mushroom.",
            "Photosynthesis requires actual photons, genius."
        ]
    },
    combinations: [
        "Too much water AND sun? Are you making plant soup?",
        "Drowning me while frying me. Efficient cruelty.",
        "You've somehow made me both soggy AND crispy. Impressive.",
        "This is like being in a humid desert. Thanks for nothing.",
        "Perfect balance of neglect and over-attention. Classic human."
    ],
    random: [
        "Stop clicking. I can feel the boredom radiating through the screen.",
        "Are you raising me or lowering my expectations of humanity?",
        "I've seen houseplants with more personality than you.",
        "This is somehow both too much and not enough effort.",
        "Your life choices concern me, and I'm just a plant.",
        "I'm judging you. Silently. Constantly.",
        "At least real plants don't have to watch humans disappoint them.",
        "Your clicking technique needs work. Everything needs work, really."
    ],
    recovery: [
        "Oh, you're finally leaving me alone? How refreshing.",
        "I'm slowly recovering from your 'care'. Don't take credit.",
        "Time heals all wounds, even the ones you inflicted.",
        "I'm getting better despite your best efforts to ruin me.",
        "Finally, some peace and quiet to recover from your chaos.",
        "I'm healing naturally. No thanks to you.",
        "This is what I look like when you're NOT trying to help."
    ]
};

// Achievements list
const achievementsList = [
    {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Watered once',
        roast: 'You did the bare minimum. A true visionary.',
        condition: () => waterCount >= 1
    },
    {
        id: 'tryhard',
        name: 'Tryhard',
        description: '50 waters in one session',
        roast: 'Imagine if you applied this persistence anywhere else in life.',
        condition: () => sessionClicks >= 50
    },
    {
        id: 'sunburner',
        name: 'Solar Enthusiast',
        description: 'Gave 30+ sun rays',
        roast: 'You turned me into plant jerky. Congratulations.',
        condition: () => sunCount >= 30
    },
    {
        id: 'balanced',
        name: 'Accidentally Competent',
        description: 'Equal water and sun (10+)',
        roast: 'You stumbled into balance. Don\'t expect a medal.',
        condition: () => waterCount >= 10 && sunCount >= 10 && Math.abs(waterCount - sunCount) <= 2
    },
    {
        id: 'consistent',
        name: 'Consistently Mediocre',
        description: '25 total actions',
        roast: 'Mediocrity achieved with stunning regularity.',
        condition: () => (waterCount + sunCount) >= 25
    },
    {
        id: 'obsessed',
        name: 'Obsessed',
        description: '100 actions in one session',
        roast: 'This level of dedication to pointless tasks is concerning.',
        condition: () => (sessionClicks + sessionSuns) >= 100
    },
    {
        id: 'torturer',
        name: 'Plant Torturer',
        description: 'Extreme water + sun (50+ each)',
        roast: 'You\'ve mastered the art of loving something to death.',
        condition: () => waterCount >= 50 && sunCount >= 50
    }
];

// Utility functions
function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getPlantCondition() {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;
    const recoveryHours = timeSinceLastActivity / (100 * 60 * 60);
    
    const recoveryFactor = Math.min(recoveryHours * 120, 0.8); // Max 80% recovery after 30 seconds
    const effectiveWater = Math.max(0, waterCount * (1 - recoveryFactor * 0.3));
    const effectiveSun = Math.max(0, sunCount * (1 - recoveryFactor * 0.3));
    const totalCare = effectiveWater + effectiveSun;
    
    if (effectiveSun > effectiveWater + 10) return 'fried';
    if (effectiveWater > effectiveSun + 10) return 'drowned';
    if (totalCare > 40) return 'overwhelmed';
    if (totalCare < 5 || recoveryFactor > 0.5) return 'healthy';
    if (Math.abs(effectiveWater - effectiveSun) <= 3 && totalCare <= 20) return 'balanced';
    return 'stressed';
}

function updateBackground() {
    const container = document.getElementById('app');
    const condition = getPlantCondition();
    
    // Remove all background classes
    container.className = 'app-container';
    
    // Add the appropriate background class
    container.classList.add(`bg-${condition}`);
}

function updateSunIcon() {
    const sunIcon = document.getElementById('sun-icon');
    
    if (sunCount === 0) {
        sunIcon.textContent = '☀️';
        sunIcon.className = 'sun-icon';
    } else if (sunCount <= 10) {
        sunIcon.textContent = '☀️';
        sunIcon.className = 'sun-icon active';
    } else if (sunCount <= 25) {
        sunIcon.textContent = '🔥';
        sunIcon.className = 'sun-icon hot';
    } else {
        sunIcon.textContent = '🔥';
        sunIcon.className = 'sun-icon burning';
    }
}

function renderPlantLeaves() {
    const leavesContainer = document.getElementById('leaves-container');
    const condition = getPlantCondition();
    
    leavesContainer.innerHTML = '';
    
    if (condition === 'healthy' || condition === 'balanced') {
        // Healthy green leaves
        leavesContainer.innerHTML = `
            <ellipse cx="85" cy="170" rx="15" ry="25" fill="#32CD32" transform="rotate(-30 85 170)"/>
            <ellipse cx="115" cy="165" rx="18" ry="28" fill="#228B22" transform="rotate(25 115 165)"/>
            <ellipse cx="100" cy="145" rx="12" ry="20" fill="#32CD32" transform="rotate(0 100 145)"/>
        `;
    } else if (condition === 'fried') {
        // Burnt, crispy leaves
        leavesContainer.innerHTML = `
            <ellipse cx="82" cy="180" rx="12" ry="20" fill="#8B4513" transform="rotate(-45 82 180)"/>
            <ellipse cx="118" cy="175" rx="15" ry="22" fill="#A0522D" transform="rotate(40 118 175)"/>
            <ellipse cx="105" cy="155" rx="8" ry="15" fill="#654321" transform="rotate(-10 105 155)"/>
            <circle cx="85" cy="180" r="6" fill="#2D1810"/>
            <circle cx="115" cy="172" r="5" fill="#2D1810"/>
            <circle cx="102" cy="158" r="4" fill="#2D1810"/>
            <text x="120" y="150" font-size="12" opacity="0.6">💨</text>
        `;
    } else if (condition === 'drowned') {
        // Soggy, droopy leaves
        leavesContainer.innerHTML = `
            <ellipse cx="78" cy="185" rx="13" ry="20" fill="#2F4F4F" transform="rotate(-60 78 185)"/>
            <ellipse cx="122" cy="182" rx="16" ry="23" fill="#556B2F" transform="rotate(50 122 182)"/>
            <ellipse cx="102" cy="160" rx="10" ry="16" fill="#2F4F4F" transform="rotate(-20 102 160)"/>
            <circle cx="85" cy="190" r="2" fill="#4A90E2" opacity="0.8"/>
            <circle cx="115" cy="185" r="2" fill="#4A90E2" opacity="0.8"/>
            <circle cx="98" cy="165" r="1.5" fill="#4A90E2" opacity="0.8"/>
        `;
    } else if (condition === 'overwhelmed') {
        // Completely devastated
        leavesContainer.innerHTML = `
            <ellipse cx="75" cy="190" rx="8" ry="15" fill="#2D1810" transform="rotate(-70 75 190)"/>
            <ellipse cx="125" cy="185" rx="10" ry="18" fill="#2D1810" transform="rotate(60 125 185)"/>
            <ellipse cx="108" cy="165" rx="6" ry="12" fill="#2D1810" transform="rotate(-25 108 165)"/>
            <circle cx="80" cy="190" r="7" fill="#000"/>
            <circle cx="120" cy="182" r="6" fill="#000"/>
            <circle cx="105" cy="168" r="5" fill="#000"/>
        `;
    } else {
        // Stressed - yellowing and spotting
        leavesContainer.innerHTML = `
            <ellipse cx="82" cy="175" rx="13" ry="22" fill="#DAA520" transform="rotate(-40 82 175)"/>
            <ellipse cx="118" cy="170" rx="16" ry="25" fill="#B8860B" transform="rotate(35 118 170)"/>
            <ellipse cx="102" cy="152" rx="10" ry="18" fill="#DAA520" transform="rotate(-10 102 152)"/>
            <circle cx="88" cy="175" r="3" fill="#8B4513" opacity="0.7"/>
            <circle cx="112" cy="168" r="2.5" fill="#8B4513" opacity="0.7"/>
            <circle cx="98" cy="155" r="2" fill="#8B4513" opacity="0.7"/>
        `;
    }
}

function renderPlantFace() {
    const face = document.getElementById('face');
    
    face.innerHTML = '';
    
    switch(plantMood) {
        case 'annoyed':
            face.innerHTML = `
                <circle cx="-8" cy="-5" r="2" fill="#2F4F4F"/>
                <circle cx="8" cy="-5" r="2" fill="#2F4F4F"/>
                <path d="M -10 5 Q 0 -2 10 5" stroke="#2F4F4F" stroke-width="2" fill="none"/>
            `;
            break;
        case 'disappointed':
            face.innerHTML = `
                <ellipse cx="-6" cy="-3" rx="3" ry="1.5" fill="#2F4F4F"/>
                <ellipse cx="6" cy="-3" rx="3" ry="1.5" fill="#2F4F4F"/>
                <path d="M -8 8 Q 0 12 8 8" stroke="#2F4F4F" stroke-width="2" fill="none"/>
            `;
            break;
        case 'sarcastic':
            face.innerHTML = `
                <circle cx="-8" cy="-8" r="2" fill="#2F4F4F"/>
                <circle cx="8" cy="-2" r="2" fill="#2F4F4F"/>
                <path d="M -6 5 Q 2 2 8 6" stroke="#2F4F4F" stroke-width="2" fill="none"/>
            `;
            break;
        case 'smug':
            face.innerHTML = `
                <path d="M -10 -5 Q -6 -8 -2 -5" stroke="#2F4F4F" stroke-width="2" fill="none"/>
                <path d="M 2 -5 Q 6 -8 10 -5" stroke="#2F4F4F" stroke-width="2" fill="none"/>
                <path d="M -6 5 Q 0 8 6 5" stroke="#2F4F4F" stroke-width="2" fill="none"/>
            `;
            break;
        default:
            face.innerHTML = `
                <circle cx="-6" cy="-3" r="2" fill="#2F4F4F"/>
                <circle cx="6" cy="-3" r="2" fill="#2F4F4F"/>
                <line x1="-6" y1="5" x2="6" y2="5" stroke="#2F4F4F" stroke-width="2"/>
            `;
    }
}

function renderDroppedLeaves() {
    const droppedLeavesContainer = document.getElementById('dropped-leaves');
    const condition = getPlantCondition();
    
    droppedLeavesContainer.innerHTML = '';
    
    let leafCount = 0;
    if (condition === 'overwhelmed') leafCount = 6;
    else if (condition === 'fried' || condition === 'drowned') leafCount = 4;
    else if (condition === 'stressed') leafCount = 2;
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leaf.setAttribute('cx', 60 + i * 15);
        leaf.setAttribute('cy', 240 + Math.sin(i) * 3);
        leaf.setAttribute('rx', '6');
        leaf.setAttribute('ry', '3');
        leaf.setAttribute('opacity', '0.7');
        leaf.classList.add('animate-pulse');
        
        if (condition === 'fried') leaf.setAttribute('fill', '#8B4513');
        else if (condition === 'drowned') leaf.setAttribute('fill', '#2F4F4F');
        else leaf.setAttribute('fill', '#A0522D');
        
        droppedLeavesContainer.appendChild(leaf);
    }
}

function updateSoilAndStem() {
    const soil = document.getElementById('soil');
    const stem = document.getElementById('stem');
    const condition = getPlantCondition();
    
    // Update soil color based on condition
    if (condition === 'drowned') {
        soil.setAttribute('fill', '#4A5568');
    } else if (condition === 'fried') {
        soil.setAttribute('fill', '#D69E2E');
    } else {
        soil.setAttribute('fill', '#8B4513');
    }
    
    // Update stem color
    if (condition === 'fried') {
        stem.setAttribute('fill', '#8B4513');
    } else {
        stem.setAttribute('fill', '#228B22');
    }
}

function updateStats() {
    document.getElementById('stats-text').textContent = `💧 Waters: ${waterCount} | ☀️ Sun: ${sunCount}`;
    document.getElementById('session-text').textContent = `Session: ${sessionClicks + sessionSuns} actions`;
    document.getElementById('status-text').textContent = `Status: ${getPlantCondition()}`;
    document.getElementById('current-status').textContent = getPlantCondition();
    
    // Update recovery indicator
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;
    const recoveryHours = timeSinceLastActivity / (1000 * 60 * 60);
    const recoveryText = document.getElementById('recovery-text');
    
    if (recoveryHours > 0.008) { // Show recovery after 30 seconds
        const recoveryPercent = Math.min(80, Math.round(recoveryHours * 40));
        recoveryText.textContent = `🕐 Recovering: ${recoveryPercent}%`;
        recoveryText.style.display = 'block';
    } else {
        recoveryText.style.display = 'none';
    }
    
    // Update progress indicator
    const progressIndicator = document.getElementById('progress-indicator');
    const progressText = document.getElementById('progress-text');
    
    if ((waterCount + sunCount) > 15) {
        progressIndicator.style.display = 'block';
        progressText.textContent = getPlantCondition() === 'balanced' ? 'Surprisingly not terrible' : 'Still disappointing';
    } else {
        progressIndicator.style.display = 'none';
    }
}

function updateStatusMessage() {
    const statusMessage = document.getElementById('status-message');
    const condition = getPlantCondition();
    
    const messages = {
        'healthy': '🌱 "I suppose you\'re not completely hopeless... or maybe I just recovered despite you."',
        'balanced': '⚖️ "Miraculously, you found balance... or I healed from your chaos."',
        'fried': '🔥 "I\'m crispier than your dating life."',
        'drowned': '💧 "I\'m soggy and my disappointment is immeasurable."',
        'overwhelmed': '💀 "You\'ve successfully killed me with kindness. Congratulations."',
        'stressed': '😰 "Your care style is giving me anxiety."'
    };
    
    statusMessage.innerHTML = `<p>${messages[condition] || messages.stressed}</p>`;
}

function updatePlantDisplay() {
    renderPlantLeaves();
    renderPlantFace();
    renderDroppedLeaves();
    updateSoilAndStem();
    updateBackground();
    updateSunIcon();
    updateStats();
    updateStatusMessage();
}

function checkAchievements() {
    achievementsList.forEach(achievement => {
        if (achievement.condition() && !achievements.find(a => a.id === achievement.id)) {
            achievements.push(achievement);
            
            // Show achievement
            const achievementsContainer = document.getElementById('achievements');
            const achievementsList = document.getElementById('achievements-list');
            
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.innerHTML = `
                <div class="achievement-name">🏆 ${achievement.name}</div>
                <div class="achievement-roast">"${achievement.roast}"</div>
            `;
            
            achievementsList.appendChild(achievementElement);
            achievementsContainer.style.display = 'block';
            
            // Update roast with achievement message
            setTimeout(() => {
                currentRoast = achievement.roast;
                plantMood = 'smug';
                document.getElementById('roast-text').textContent = `"${currentRoast}"`;
                updatePlantDisplay();
            }, 500);
        }
    });
}

function waterPlant() {
    const now = Date.now();
    const timeSinceLastWater = now - lastWatered;
    
    waterCount++;
    sessionClicks++;
    lastWatered = now;
    lastActivityTime = now;
    
    // Animation
    const plantWrapper = document.getElementById('plant-wrapper');
    plantWrapper.classList.add('watering');
    setTimeout(() => plantWrapper.classList.remove('watering'), 500);
    
    // Determine roast and mood
    let newRoast = '';
    let newMood = 'neutral';
    const condition = getPlantCondition();
    
    if (condition === 'drowned') {
        newRoast = "I'm not a fish! Stop trying to drown me in your love.";
        newMood = 'disappointed';
    } else if (waterCount > sunCount + 5) {
        newRoast = getRandomFromArray(roasts.combinations);
        newMood = 'annoyed';
    } else if (timeSinceLastWater < 2000) {
        newRoast = getRandomFromArray(roasts.timing.tooSoon);
        newMood = 'annoyed';
    } else if (timeSinceLastWater > 300000) {
        newRoast = getRandomFromArray(roasts.timing.tooLate);
        newMood = 'disappointed';
    } else if (condition === 'balanced') {
        newRoast = "Wow, balanced care. Are you feeling okay?";
        newMood = 'sarcastic';
    } else if (Math.random() < 0.3) {
        newRoast = getRandomFromArray(roasts.random);
        newMood = 'sarcastic';
    } else {
        const effortIndex = Math.min(Math.floor(waterCount / 2), roasts.effort.length - 1);
        newRoast = roasts.effort[effortIndex];
        newMood = waterCount > 20 ? 'smug' : 'sarcastic';
    }
    
    currentRoast = newRoast;
    plantMood = newMood;
    
    document.getElementById('roast-text').textContent = `"${currentRoast}"`;
    updatePlantDisplay();
    checkAchievements();
}

function giveSun() {
    const now = Date.now();
    const timeSinceLastSun = now - lastSunned;
    
    sunCount++;
    sessionSuns++;
    lastSunned = now;
    lastActivityTime = now;
    
    // Animation
    const plantWrapper = document.getElementById('plant-wrapper');
    const sunIcon = document.getElementById('sun-icon');
    
    plantWrapper.classList.add('sunning');
    sunIcon.classList.add('animating');
    
    setTimeout(() => {
        plantWrapper.classList.remove('sunning');
        sunIcon.classList.remove('animating');
    }, 500);
    
    // Determine roast and mood
    let newRoast = '';
    let newMood = 'neutral';
    const condition = getPlantCondition();
    
    if (condition === 'fried') {
        newRoast = getRandomFromArray(roasts.sun.tooMuch);
        newMood = 'annoyed';
    } else if (sunCount > waterCount + 3) {
        newRoast = getRandomFromArray(roasts.combinations);
        newMood = 'disappointed';
    } else if (timeSinceLastSun < 2000) {
        newRoast = "Easy there, solar panel. I'm not trying to achieve nuclear fusion.";
        newMood = 'sarcastic';
    } else if (condition === 'balanced') {
        newRoast = getRandomFromArray(roasts.sun.balance);
        newMood = 'smug';
    } else {
        newRoast = getRandomFromArray(roasts.random);
        newMood = 'sarcastic';
    }
    
    currentRoast = newRoast;
    plantMood = newMood;
    
    document.getElementById('roast-text').textContent = `"${currentRoast}"`;
    updatePlantDisplay();
    checkAchievements();
}

// Recovery system
function checkRecovery() {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;
    
    // If it's been more than 30 seconds since last activity, show recovery message
    if (timeSinceLastActivity > 30 * 1000) {
        const prevCondition = getPlantCondition();
        
        // Check if condition improved after time calculation
        setTimeout(() => {
            const newCondition = getPlantCondition();
            if (newCondition !== prevCondition && (newCondition === 'healthy' || newCondition === 'balanced')) {
                currentRoast = getRandomFromArray(roasts.recovery);
                plantMood = 'smug';
                document.getElementById('roast-text').textContent = `"${currentRoast}"`;
                updatePlantDisplay();
            }
        }, 100);
    }
}

// Initialize the app
function init() {
    // Set up event listeners
    document.getElementById('water-btn').addEventListener('click', waterPlant);
    document.getElementById('sun-btn').addEventListener('click', giveSun);
    
    // Initial render
    updatePlantDisplay();
    
    // Set up recovery check interval
    setInterval(checkRecovery, 30000); // Check every 30 seconds
    
    // Update display every second for recovery percentage
    setInterval(updateStats, 1000);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);