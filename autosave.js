
// ==============================
// 简化自动加载系统
// ==============================

// 存档槽位数量
const SAVE_SLOT_COUNT = 9;
// 存档键名前缀
const SAVE_SLOT_PREFIX = 'glory_manager_slot_';
// 自动存档键名
const AUTO_SAVE_KEY = 'glory_manager_autosave';

// 当前存档模式: 'save' 或 'load'
let currentSaveMode = 'save';

/**
 * 显示存档槽位界面
 * @param {string} mode - 'save' 或 'load'
 */
function showSaveSlots(mode) {
    currentSaveMode = mode;
    const container = document.getElementById('saveSlotContainer');
    const menuButtons = document.getElementById('saveMenuButtons');
    const title = document.getElementById('saveSlotTitle');
    const grid = document.getElementById('saveSlotGrid');
    
    if (!container || !title || !grid) return;
    
    // 隐藏三个按钮
    if (menuButtons) menuButtons.style.display = 'none';
    
    // 更新标题
    title.textContent = mode === 'save' ? '选择存档位' : '选择读取的存档';
    
    // 渲染9个存档槽位
    grid.innerHTML = '';
    
    for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
        const slotData = getSaveSlotData(i);
        const slotElement = createSlotElement(i, slotData, mode);
        grid.appendChild(slotElement);
    }
    
    // 显示容器
    container.style.display = 'block';
}

/**
 * 隐藏存档槽位界面
 */
function hideSaveSlots() {
    const container = document.getElementById('saveSlotContainer');
    const menuButtons = document.getElementById('saveMenuButtons');
    
    if (container) {
        container.style.display = 'none';
    }
    // 显示三个按钮
    if (menuButtons) menuButtons.style.display = 'flex';
}

/**
 * 获取指定槽位的存档数据
 * @param {number} slotIndex - 槽位索引 (1-9)
 * @returns {object|null}
 */
function getSaveSlotData(slotIndex) {
    try {
        const key = SAVE_SLOT_PREFIX + slotIndex;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error(`读取存档槽位${slotIndex}失败:`, e);
        return null;
    }
}

/**
 * 创建存档槽位元素
 * @param {number} index - 槽位索引
 * @param {object|null} data - 存档数据
 * @param {string} mode - 'save' 或 'load'
 * @returns {HTMLElement}
 */
function createSlotElement(index, data, mode) {
    const slot = document.createElement('div');
    slot.className = 'save-slot';
    
    if (data) {
        // 有存档数据
        slot.classList.add('has-data');
        if (mode === 'load') slot.classList.add('load-mode');
        
        const timeInfo = data.time ? `Y${data.time.year} ${data.time.season} D${data.time.day}` : '未知';
        const agentName = data.agent?.name || '未命名';
        const money = data.agent?.money || 0;
        const saveTime = data.saveTime ? formatSaveTime(data.saveTime) : '未知时间';
        
        slot.innerHTML = `
            <div class="save-slot-number">存档 ${index}</div>
            <div class="save-slot-icon">💾</div>
            <div class="save-slot-info">
                <div><strong>${agentName}</strong></div>
                <div>${timeInfo}</div>
                <div>💰 ${money}元</div>
            </div>
            <div class="save-slot-time">${saveTime}</div>
        `;
        
        slot.onclick = () => handleSlotClick(index, data, mode);
    } else {
        // 空槽位
        slot.classList.add('empty');
        if (mode === 'save') slot.classList.add('save-mode');
        
        slot.innerHTML = `
            <div class="save-slot-number">存档 ${index}</div>
            <div class="save-slot-icon">➕</div>
            <div class="save-slot-empty-text">空槽位</div>
        `;
        
        if (mode === 'save') {
            slot.onclick = () => handleSlotClick(index, null, mode);
        } else {
            // 读档模式下空槽位不可点击
            slot.style.opacity = '0.5';
            slot.style.cursor = 'not-allowed';
        }
    }
    
    return slot;
}

/**
 * 格式化存档时间
 * @param {number} timestamp - 时间戳
 * @returns {string}
 */
function formatSaveTime(timestamp) {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
}

/**
 * 处理槽位点击
 * @param {number} index - 槽位索引
 * @param {object|null} existingData - 现有存档数据
 * @param {string} mode - 'save' 或 'load'
 */
function handleSlotClick(index, existingData, mode) {
    if (mode === 'save') {
        if (existingData) {
            // 覆盖确认
            Swal.fire({
                title: '覆盖存档？',
                text: `存档位 ${index} 已有数据，确定要覆盖吗？`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定覆盖',
                cancelButtonText: '取消',
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#6b7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    saveToSlot(index);
                }
            });
        } else {
            saveToSlot(index);
        }
    } else if (mode === 'load') {
        if (existingData) {
            Swal.fire({
                title: '读取存档？',
                text: `将加载存档位 ${index} 的进度，当前未保存的进度将丢失！`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '确定读取',
                cancelButtonText: '取消',
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    loadFromSlot(index);
                }
            });
        }
    }
}

/**
 * 保存到指定槽位
 * @param {number} slotIndex - 槽位索引
 */
function saveToSlot(slotIndex) {
    try {
        const saveData = {
            agent: { ...gameData.agent },
            time: { ...gameData.time },
            players: JSON.parse(JSON.stringify(gameData.players)),
            teams: JSON.parse(JSON.stringify(gameData.teams)),
            publishedNews: JSON.parse(JSON.stringify(gameData.publishedNews || [])),
            commissions: JSON.parse(JSON.stringify(gameData.commissions)),
            letters: JSON.parse(JSON.stringify(gameData.letters)),
            seasonSchedule: JSON.parse(JSON.stringify(gameData.seasonSchedule || {
                currentSeasonKey: null,
                matchups: [],
                nextMatchIndex: 0
            })),
            matchHistory: JSON.parse(JSON.stringify(gameData.matchHistory || [])),
            specialDialogues: JSON.parse(JSON.stringify(gameData.specialDialogues || [])),
            dialogueHistory: JSON.parse(JSON.stringify(gameData.dialogueHistory || {})),
            negotiations: JSON.parse(JSON.stringify(gameData.negotiations || [])),
            settings: JSON.parse(JSON.stringify(gameData.settings || {})),
            seasonStats: JSON.parse(JSON.stringify(gameData.seasonStats || {
                currentSeasonKey: null,
                seasons: {}
            })),
            saveTime: Date.now(),
            saveVersion: "1.4",
            slotIndex: slotIndex
        };
        
        const key = SAVE_SLOT_PREFIX + slotIndex;
        localStorage.setItem(key, JSON.stringify(saveData));
        
        // 刷新界面
        showSaveSlots('save');
        
        Swal.fire({
            icon: 'success',
            title: '存档成功',
            text: `已保存到存档位 ${slotIndex}`,
            timer: 1500,
            showConfirmButton: false
        });
        
        console.log(`存档到槽位${slotIndex}成功`);
    } catch (error) {
        console.error('存档失败:', error);
        Swal.fire({
            icon: 'error',
            title: '存档失败',
            text: '存档时发生错误，请重试'
        });
    }
}

/**
 * 从指定槽位读取
 * @param {number} slotIndex - 槽位索引
 */
function loadFromSlot(slotIndex) {
    try {
        const key = SAVE_SLOT_PREFIX + slotIndex;
        const savedData = localStorage.getItem(key);
        
        if (!savedData) {
            Swal.fire({
                icon: 'warning',
                title: '读取失败',
                text: '该存档位没有数据'
            });
            return;
        }
        
        const data = JSON.parse(savedData);
        
        // 恢复数据
        gameData.agent = data.agent || gameData.agent;
        gameData.time = data.time || gameData.time;
        gameData.players = data.players || gameData.players;
        gameData.teams = data.teams || gameData.teams;
        gameData.publishedNews = data.publishedNews || [];
        gameData.commissions = data.commissions || gameData.commissions;
        gameData.letters = data.letters || gameData.letters;
        gameData.seasonSchedule = data.seasonSchedule || {
            currentSeasonKey: null,
            matchups: [],
            nextMatchIndex: 0
        };
        gameData.matchHistory = data.matchHistory || [];
        gameData.specialDialogues = data.specialDialogues || [];
        gameData.dialogueHistory = data.dialogueHistory || {};
        gameData.negotiations = data.negotiations || [];
        gameData.settings = { ...gameData.settings, ...data.settings } || {};
        gameData.seasonStats = data.seasonStats || {
            currentSeasonKey: null,
            seasons: {}
        };
        
        // 刷新界面
        hideSaveSlots();
        backToOfficeMenu();
        updateStatusBar();
        refreshGameUI();
        
        Swal.fire({
            icon: 'success',
            title: '读取成功',
            html: `
                <div style="text-align: center;">
                    <div>已加载存档位 ${slotIndex}</div>
                    <div style="margin-top: 0.5rem; color: #64748b; font-size: 0.9rem;">
                        ${data.agent?.name || '经纪人'} - Y${data.time?.year} ${data.time?.season} D${data.time?.day}
                    </div>
                </div>
            `,
            timer: 2000,
            showConfirmButton: false
        });
        
        console.log(`从槽位${slotIndex}读取成功`);
    } catch (error) {
        console.error('读取失败:', error);
        Swal.fire({
            icon: 'error',
            title: '读取失败',
            text: '存档数据损坏或格式错误'
        });
    }
}

/**
 * 退出游戏
 */
function exitGame() {
    Swal.fire({
        title: '退出游戏？',
        text: '将自动保存当前进度并返回主界面',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        confirmButtonColor: '#f56565',
        cancelButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            // 自动保存到自动存档位
            simpleAutoSave();
            
            // 显示保存成功并返回封面
            Swal.fire({
                icon: 'success',
                title: '已保存进度',
                text: '正在返回主界面...',
                timer: 1000,
                showConfirmButton: false
            }).then(() => {
                // 返回封面
                const gameCover = document.getElementById('gameCover');
                const gameMain = document.getElementById('gameMain');
                
                if (gameCover && gameMain) {
                    gameMain.style.display = 'none';
                    gameCover.style.display = 'flex';
                    
                    // 更新开始按钮文本
                    const startBtn = document.getElementById('startGame');
                    if (startBtn) {
                        startBtn.innerHTML = '<span class="btn-icon">🚀</span><span>继续游戏</span>';
                    }
                }
            });
        }
    });
}

/**
 * 刷新游戏界面
 */
function refreshGameUI() {
    // 更新状态栏
    if (typeof updateStatusBar === 'function') {
        updateStatusBar();
    }
    
    // 如果当前在广场页面，刷新新闻和地图
    if (document.querySelector('.tab-button[data-tab="square"].active')) {
        if (typeof renderNews === 'function') renderNews();
        if (typeof renderTeamMap === 'function') renderTeamMap();
    }
    
    // 如果当前在委托页面，刷新委托列表
    if (document.querySelector('.tab-button[data-tab="commission"].active')) {
        if (typeof renderCommissionPage === 'function') renderCommissionPage();
    }
    
    // 如果当前在工作室页面，刷新相关内容
    if (document.querySelector('.tab-button[data-tab="office"].active')) {
        if (typeof renderOfficePage === 'function') renderOfficePage();
    }
    
    // 如果当前在协商页面，刷新协商列表
    if (document.querySelector('.tab-button[data-tab="negotiation"].active')) {
        if (typeof renderNegotiationPage === 'function') renderNegotiationPage();
    }
    
    console.log("游戏界面刷新完成");
}







