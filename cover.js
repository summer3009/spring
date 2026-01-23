
// 创建大正方体浮动效果的函数
function createFloatingCube() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    // 清除可能存在的旧元素
    container.innerHTML = '';

    // 创建一个大正方体
    const cube = document.createElement('div');
    cube.className = 'floating-cube';

    // 设置正方体样式
    cube.style.width = '120px';
    cube.style.height = '120px';
    
    container.appendChild(cube);
    
}

// 页面加载完成后创建粒子



// 页面加载完成后只创建大正方体
document.addEventListener('DOMContentLoaded', function () {
    createFloatingCube();

    // 窗口大小改变时重新创建大正方体
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(createFloatingCube, 250);
    });

    // 只检查存档，不重复绑定事件
    const savedData = localStorage.getItem('agentData') || localStorage.getItem('glory_manager_autosave');
    const startBtn = document.getElementById('startGame');

    if (savedData && startBtn) {
        startBtn.innerHTML = '<span class="btn-icon">🚀</span><span>继续游戏</span>';
    }
});



// 切换标签页
function switchTab(tabName) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) activeButton.classList.add('active');

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.classList.add('active');

    switch (tabName) {
        case 'square':
            renderSquarePage();
            break;
        case 'commission':
            renderCommissionPage();
            break;
        case 'negotiation':
            renderNegotiationPage();
            break;
        case 'office':
            renderOfficePage();
            break;
    }
}

// 更新状态栏
function updateStatusBar() {
    document.getElementById('money').textContent = gameData.agent.money;
    document.getElementById('time').textContent = `Y${gameData.time.year} ${gameData.time.season} D${gameData.time.day}`;
    document.getElementById('energy').textContent = gameData.agent.energy;
}


// 刷新地图
// 刷新地图
function renderTeamMap() {
    const teamEntries = document.getElementById('teamEntries');
    if (!teamEntries) return;

    teamEntries.innerHTML = '';

    // 定义每个战队的固定坐标
    const teamPositions = {
        '新嘉世': { x: 60, y: 60 },
        '嘉世': { x: 60, y: 60 },
        '霸图': { x: 82, y: 17 },
        '微草': { x: 55, y: 5 },
        '蓝雨': { x: 80, y: 80 },
        '轮回': { x: 80, y: 50 },
        '百花': { x: 10, y: 70 },
        '越云': { x: 25, y: 48 },
        '呼啸': { x: 75, y: 35 },
        '雷霆': { x: 40, y: 50 },
        '虚空': { x: 10, y: 35 },
        '烟雨': { x: 40, y: 70 },
        '三零一': { x: 70, y: 2 },
        '义斩': { x: 40, y: 5 },
        '兴欣': { x: 60, y: 45 },
        '荣耀网游': { x: 30, y: 20 }
    };

    const unlockedTeams = gameData.teams.filter(team => team.unlocked);

    // 按坐标排序，确保显示顺序稳定
    unlockedTeams.sort((a, b) => {
        const posA = teamPositions[a.name] || { x: 0, y: 0 };
        const posB = teamPositions[b.name] || { x: 0, y: 0 };
        return posA.x - posB.x || posA.y - posB.y;
    });

    unlockedTeams.forEach((team) => {
        // ✅ 关键修改：从 players 实时统计人数
        const memberCount = gameData.players.filter(player => player.team === team.name).length;

        // 获取该战队的固定坐标，如果没有则使用默认位置
        const pos = teamPositions[team.name] || { x: 50, y: 50 };

        const emojiIcon = getTeamIcon(team.name);
        const localIcon = getTeamLocalIcon(team.name);

        const teamPoint = document.createElement('div');
        teamPoint.className = 'team-map-point';
        teamPoint.dataset.team = team.name;
        teamPoint.style.left = `${pos.x}%`;
        teamPoint.style.top = `${pos.y}%`;

        // 直接设置内容
        teamPoint.innerHTML = `
            ${localIcon ?
                `<img src="${localIcon}" alt="${team.name}" class="team-point-img" onerror="this.replaceWith(getFallbackIcon('${team.name}'));">` :
                `<div class="team-point-icon">${emojiIcon}</div>`}
            <div class="team-point-name">${team.name}</div>
           ${team.name === '荣耀网游' ? '' : `<div class="team-point-count">${memberCount}</div>`}
        `;

        teamPoint.addEventListener('click', (e) => {
            e.stopPropagation();
            if (team.name === '荣耀网游') {
                showRandomNetizenPlayerCard(team.name);
            } else {
                showRandomPlayerCard(team.name);
            }
        });

        teamEntries.appendChild(teamPoint);
    });
}

// 辅助函数：创建默认图标元素
function getFallbackIcon(teamName) {
    const div = document.createElement('div');
    div.className = 'team-point-icon';
    div.textContent = getTeamIcon(teamName);
    return div;
}
// 获取本地图片路径
function getTeamLocalIcon(teamName) {
    const localIconMap = {
        '嘉世': './images/teams/jiashi.png',
        '霸图': './images/teams/batu.png',
        '微草': './images/teams/weicao.png',
        '蓝雨': './images/teams/lanyu.png',
        '轮回': './images/teams/lunhui.png',
        '百花': './images/teams/baihua.png',
        '越云': './images/teams/yueyun.jpg',
        '呼啸': './images/teams/huxiao.png',
        '雷霆': './images/teams/leiting.png',
        '虚空': './images/teams/xukong.png',
        '烟雨': './images/teams/yanyu.png',
        '三零一': './images/teams/301.png',
        '义斩': './images/teams/yizhan.jpg',
        '新嘉世': './images/teams/jiashi.png',
        '兴欣': './images/teams/xingxin.jpg',
        '荣耀网游': './images/teams/glory.png'

    };

    // 检查图片是否存在（可选）
    // 如果确定图片都存在，可以直接返回路径
    return localIconMap[teamName] || null;
}

// 保留原有的表情图标作为备用
function getTeamIcon(teamName) {
    const iconMap = {
        '荣耀网游': '🏆',
        '嘉世': '⚔️',
        '新嘉世': '⚔️',
        '霸图': '🛡️',
        '微草': '🌿',
        '蓝雨': '🌧️',
        '轮回': '🌀',
        '百花': '🌸',  // 百花盛开
        '越云': '⚔️',  // 云朵，对应"越云"
        '呼啸': '💨',  // 风，对应呼啸
        '雷霆': '⚡',  // 闪电
        '虚空': '👻',  // 鬼魂，对应双鬼
        '烟雨': '🌫️',  // 雾气
        '三零一': '🎯',  // 靶心，对应刺客
        '皇风': '👑',  // 皇冠
        '义斩': '⚒️',  // 锤子和镐，对应义斩（有矿）
        '神奇': '🔮',  // 水晶球
        '兴欣': '🔥'   // 火焰，代表新生和热情
    };
    return iconMap[teamName] || '🏆';
}



// 检查并解锁战队地图
function checkAndUnlockTeams() {
    const currentTime = gameData.time;

    // 第一年冬转会期第二天：解锁兴欣和网游
    if (currentTime.year === 2 &&
        currentTime.season === "春赛季" &&
        currentTime.day === 1) {
        const xingxin = gameData.teams.find(t => t.name === "兴欣");
        if (xingxin) xingxin.unlocked = true;

        const wangyou = gameData.teams.find(t => t.name === "荣耀网游");
        if (wangyou) wangyou.unlocked = true;
    }


    // 第2年冬转会期
    if (currentTime.year === 2 &&
        currentTime.season === "夏转会期" &&
        currentTime.day === 1) {
        const leiting = gameData.teams.find(t => t.name === "雷霆");
        if (leiting) leiting.unlocked = true;
       const baihua = gameData.teams.find(t => t.name === "百花");
        if (baihua) baihua.unlocked = true;
        const huxiao = gameData.teams.find(t => t.name === "呼啸");
        if (huxiao) huxiao.unlocked = true;
    }

    // 第二年冬转会期
    if (currentTime.year === 2 &&
        currentTime.season === "冬转会期" &&
        currentTime.day === 1) {

        const sanlingyi = gameData.teams.find(t => t.name === "三零一");
        if (sanlingyi) sanlingyi.unlocked = true;

        const yanyu = gameData.teams.find(t => t.name === "烟雨");
        if (yanyu) yanyu.unlocked = true;

        const xukong = gameData.teams.find(t => t.name === "虚空");
        if (xukong) xukong.unlocked = true;

        const yizhan = gameData.teams.find(t => t.name === "义斩");
        if (yizhan) yizhan.unlocked = true;



    }

    // 第三年夏转会期第29天：嘉世战队解散，锁定战队
    if (currentTime.year === 3 &&
        currentTime.season === "夏转会期" &&
        currentTime.day === 29) {
        const jiashi = gameData.teams.find(t => t.name === "嘉世");
        if (jiashi) {
            jiashi.unlocked = false;
            console.log('第3年夏转会期：嘉世战队已解散并锁定');
        }
    }

    // 第三年冬转会期第一天：新嘉世状态解锁
    if (currentTime.year === 3 &&
        currentTime.season === "冬转会期" &&
        currentTime.day === 1) {
        const xinjiashi = gameData.teams.find(t => t.name === "新嘉世");
        if (xinjiashi) {
            xinjiashi.unlocked = true;
            console.log('第3年冬转会期：新嘉世已解锁');
        }
    }
}


// 显示随机选手卡片
function showRandomPlayerCard(teamName) {
    // 从 players 数组中筛选属于该队伍的选手
    const teamPlayers = gameData.players.filter(player => player.team === teamName);

    if (teamPlayers.length === 0) {
        console.log(`队伍 ${teamName} 没有选手`);
        return;
    }

    // 随机选择一个选手
    const randomIndex = Math.floor(Math.random() * teamPlayers.length);
    const randomPlayer = teamPlayers[randomIndex];

    if (randomPlayer) {
        renderPlayerCard(randomPlayer);
        playerCardModal.style.display = 'flex';
    }
}

// 渲染选手卡片
function renderPlayerCard(player) {
    const playerCard = document.getElementById('playerCard');
    if (!playerCard) return;

    // 记录当前选手
    currentPlayerCard = player;

    // 获取好感度百分比
    const favorPercent = Math.min(player.好感度, 100);
    const displayPercent = Math.max(0, favorPercent);

    // 确定好感度提示
    let favorTip = '';
    let tipClass = '';
    if (player.好感度 < 30) {
        favorTip = '好感度30可交换联系方式';
        tipClass = 'low';
    } else if (!player.联系方式) {
        favorTip = '可交换联系方式';
        tipClass = 'medium';
    } else {
        favorTip = '关系良好';
        tipClass = 'medium';
    }

    playerCard.innerHTML = `
        <div class="player-card-header">
            <div class="player-avatar-section">
                <div class="player-avatar">
                    <img src="images/players/${player.id}.png" 
                         alt="${player.name}"
                         style="display:none;" 
                         onload="this.style.display='block'; this.nextElementSibling.style.display='none'"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <span style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                        ${player.name.charAt(0)}
                    </span>
                </div>
                <div class="player-level">${player.级别}</div>
            </div>
            
            <div class="player-info-section">
                <div class="player-name-row">
                    <h2 class="player-name">${player.name}</h2>
                    <div class="player-profession">${player.职业}</div>
                </div>
                <div class="info-row player-team">${player.team}战队</div>
                <div class="info-row player-expect">期待：${player.期待}</div>
                <div class="info-row player-contact">
                    联系：<span class="contact-status ${player.联系方式 ? 'has-contact' : 'no-contact'}">
                        ${player.联系方式 ? '已获取' : '未获取'}
                    </span>
                </div>
            </div>
        </div>
        
        <div id="dialogueSection" class="player-dialogue-section">
            <div class="dialogue-header">
                <div class="dialogue-label">最新对话</div>
                <div id="dialogueTime" class="dialogue-time">刚刚</div>
            </div>
            <div id="dialogueContent" class="dialogue-content">
                ${currentPlayerDialogue || "点击交谈按钮开始对话..."}
            </div>
        </div>
        
        <div class="player-details">
            <div class="favor-bar-container">
                <div class="favor-text">
                    <span>好感度</span>
                    <span>${player.好感度}</span>
                </div>
                <div class="favor-bar">
                    <div class="favor-fill" style="width: ${displayPercent}%;"></div>
                </div>
                <div class="favor-tip ${tipClass}">${favorTip}</div>
            </div>
        </div>
        
        <div class="player-actions">
            <button id="talkButton" class="action-button" data-player-id="${player.id}">
                交谈 (+2)
            </button>
            <button id="giftButton" class="action-button" data-player-id="${player.id}">
                送礼 (+5)
            </button>
            ${player.好感度 >= 30 && !player.联系方式 ?
            `<button id="exchangeContactButton" class="action-button" data-player-id="${player.id}">
                    获取联系方式
                </button>` :
            ''
        }
        </div>
    `;

    // 绑定按钮事件
    const talkButton = document.getElementById('talkButton');
    const giftButton = document.getElementById('giftButton');
    const exchangeButton = document.getElementById('exchangeContactButton');

    if (talkButton) talkButton.addEventListener('click', talkToPlayer);
    if (giftButton) giftButton.addEventListener('click', giftToPlayer);
    if (exchangeButton) exchangeButton.addEventListener('click', exchangeContact);

    // 如果有之前的对话，显示对话区域
    if (currentPlayerDialogue) {
        showDialogueSection();
    }
}

// 显示对话区域
function showDialogueSection() {
    const dialogueSection = document.getElementById('dialogueSection');
    if (dialogueSection) {
        dialogueSection.classList.add('dialogue-visible');
    }
}

// 更新对话内容
function updateDialogueContent(dialogueText) {
    const dialogueContent = document.getElementById('dialogueContent');
    const dialogueTime = document.getElementById('dialogueTime');

    if (dialogueContent) {
        dialogueContent.textContent = dialogueText;
    }

    if (dialogueTime) {
        dialogueTime.textContent = getCurrentTimeString();
    }

    // 显示对话区域
    showDialogueSection();
}


// 切换办公室菜单
function switchOfficeMenu(menuName) {
    // 更新菜单卡片激活状态
    document.querySelectorAll('.menu-card').forEach(card => {
        card.classList.remove('active');
    });
    const activeCard = document.querySelector(`.menu-card[data-menu="${menuName}"]`);
    if (activeCard) activeCard.classList.add('active');

    // 更新内容区域显示
    document.querySelectorAll('.office-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeContent = document.getElementById(menuName);
    if (activeContent) activeContent.classList.add('active');

    // 隐藏工作室菜单
    const officeMenu = document.querySelector('.office-menu');
    if (officeMenu) {
        officeMenu.classList.add('hidden');
    }

    // 根据菜单重新渲染内容
    switch (menuName) {
        case 'notebook':
            renderNotebookContent();
            break;
        case 'contacts':
            renderContacts();
            break;
        case 'profile':
            renderProfile();
            break;
        case 'rest':
            renderRestContent();
            break;
        case 'netizen-training':
            renderContactNetizens(); // ← 调用我们之前定义的渲染函数
            break;
        case 'borrowing-book':
            renderBorrowingBook(); // ← 调用小账本渲染函数
            break;
        case 'save-manager':
            // 存档管理页面初始化，隐藏槽位显示，显示按钮
            hideSaveSlots();
            const menuButtons = document.getElementById('saveMenuButtons');
            if (menuButtons) menuButtons.style.display = 'flex';
            break;
    }
}

// 渲染记事本内容
function renderNotebookContent() {
    renderAttributes();
    renderTrainingSection();
}

// 渲染属性
function renderAttributes() {
    const attributesList = document.getElementById('attributesList');
    if (!attributesList) return;

    const attributes = gameData.agent.attributes;
    const MAX_VALUE = 1000; // 定义最大值

    attributesList.innerHTML = Object.entries(attributes).map(([key, value]) => {
        const percentage = (value / MAX_VALUE) * 100;
        return `
        <div class="attribute-item">
            <div>${key}: ${value}</div>
            <div class="attribute-bar">
                <div class="attribute-fill" style="width: ${percentage}%;">${value}</div>
            </div>
        </div>
        `;
    }).join('');
}

// 培训选项
const trainingOptions = [
    {
        id: 'gloryHistory',
        name: '荣耀战史研修',
        description: '研究叶修、韩文清等传奇选手的转会案例，学习顶尖谈判策略',
        cost: { money: 300, energy: 2 },
        gains: { '谈判技巧': 4, '社交能力': 2 }
    },


    {
        id: 'contractMaster',
        name: '合同条款精研',
        description: '深入研究电竞合同的各种条款陷阱，掌握法律武器保护选手利益',
        cost: { money: 450, energy: 3 },
        gains: { '谈判技巧': 5, '社交能力': 3 }
    },

    {
        id: 'matchAnalysis',
        name: '经典比赛分析',
        description: '深度复盘总决赛级对决，从战术层面理解选手价值与战队需求',
        cost: { money: 200, energy: 1 },
        gains: { '社交能力': 3, '声望': 2 }
    },
    {
        id: 'mockNegotiation',
        name: '高压模拟谈判',
        description: '模拟与最难缠选手和战队的谈判场景，锻炼临场应变能力',
        cost: { money: 400, energy: 3 },
        gains: { '谈判技巧': 6 }
    },
    {
        id: 'mediaInterview',
        name: '媒体应对特训',
        description: '学习如何在采访中为选手造势，提升市场价值和谈判筹码',
        cost: { money: 350, energy: 2 },
        gains: { '魅力': 4, '声望': 2 }
    },
    {
        id: 'allStarParty',
        name: '全明星酒会交际',
        description: '在全明星周末的派对中，与各战队经理和选手建立人脉关系',
        cost: { money: 500, energy: 4 },
        gains: { '魅力': 5, '声望': 3 }
    }
];

// 兼职打工选项
const partTimeJobs = [
    {
        id: 'delivery',
        name: '送外卖',
        description: '穿梭城市街头，为荣耀玩家准时送达泡面和可乐，赚取辛苦费',
        cost: { energy: 2 },
        gains: { money: 150 }
    },
    {
        id: 'rideShare',
        name: '跑滴滴',
        description: '载着职业选手往返训练基地和比赛场馆，顺便打听转会小道消息',
        cost: { energy: 3 },
        gains: { money: 250 }
    }
];

// 渲染培训部分
// 渲染培训与兼职部分
function renderTrainingSection() {
    let trainingSection = document.querySelector('.training-section');
    if (!trainingSection) {
        trainingSection = document.createElement('div');
        trainingSection.className = 'training-section';
        const notebookContent = document.getElementById('notebook');
        if (notebookContent) notebookContent.appendChild(trainingSection);
    }

    // 渲染培训选项
    const trainingHTML = trainingOptions.map(option => {
        const gainsText = Object.entries(option.gains)
            .map(([attr, value]) => `${attr}+${value}`)
            .join(', ');
        return `
      <div class="training-option">
        <h4>${option.name}</h4>
        <p>${option.description}</p>
        <div class="training-cost">
          <span>消耗: ${option.cost.money}元, ${option.cost.energy}能量</span>
          <span>获得: ${gainsText}</span>
        </div>
        <button class="btn btn-primary" onclick="performTraining('${option.id}')">开始培训</button>
      </div>
    `;
    }).join('');

    // 渲染兼职选项
    const partTimeHTML = partTimeJobs.map(job => {
        return `
      <div class="training-option">
        <h4>${job.name}</h4>
        <p>${job.description}</p>
        <div class="training-cost">
          <span>消耗: ${job.cost.energy}能量</span>
          <span>收入: +${job.gains.money}元</span>
        </div>
        <button class="btn btn-success" onclick="performPartTimeJob('${job.id}')">开始打工</button>
      </div>
    `;
    }).join('');

    trainingSection.innerHTML = `
    <h3>培训中心</h3>
    <div class="training-options">
      ${trainingHTML}
    </div>
    <h3 style="margin-top: 2rem;">兼职打工</h3>
    <div class="training-options">
      ${partTimeHTML}
    </div>
  `;
}

// 执行培训
function performTraining(trainingId) {

    // alert("1");
    const option = trainingOptions.find(t => t.id === trainingId);
    if (!option) {
        showToast('培训选项不存在！', 'error');
        return;
    }

    // 检查资源
    if (gameData.agent.money < option.cost.money) {
        showToast(`需要${option.cost.money}元，当前只有${gameData.agent.money}元`, 'warning');
        return;
    }

    if (gameData.agent.energy < option.cost.energy) {
        showToast(`需要${option.cost.energy}能量，当前只有${gameData.agent.energy}能量`, 'warning');
        return;
    }

    // 执行培训
    gameData.agent.money -= option.cost.money;
    gameData.agent.energy -= option.cost.energy;

    for (const [attr, value] of Object.entries(option.gains)) {
        gameData.agent.attributes[attr] += value;
    }

    // 更新界面
    renderAttributes();
    updateStatusBar();

    // 显示成功提示
    Swal.fire({
        icon: 'success',
        title: '培训完成',
        html: `
            <div style="font-size: 0.9rem; text-align: center; padding: 5px 0;">
                <div style="color: #f56565; margin-bottom: 5px;">
                    <strong>消耗:</strong> ${option.cost.money}元, ${option.cost.energy}能量
                </div>
                <div style="color: #48bb78;">
                    <strong>获得:</strong> ${Object.entries(option.gains).map(([attr, value]) => `${attr}+${value}`).join(', ')}
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: '好的',
        confirmButtonColor: '#667eea',
        width: '300px',
        padding: '1rem',
        showCloseButton: true,
        customClass: {
            popup: 'small-swal',
            title: 'small-swal-title',
            htmlContainer: 'small-swal-content'
        }
    });
}


// 执行兼职打工
function performPartTimeJob(jobId) {
    const job = partTimeJobs.find(j => j.id === jobId);
    if (!job) {
        showToast('兼职选项不存在！', 'error');
        return;
    }

    // 检查能量
    if (gameData.agent.energy < job.cost.energy) {
        showToast(`需要${job.cost.energy}能量，当前只有${gameData.agent.energy}能量`, 'warning');
        return;
    }

    // 扣除能量，增加金钱
    gameData.agent.energy -= job.cost.energy;
    gameData.agent.money += job.gains.money;

    // 更新界面
    renderAttributes(); // 虽然金钱不在attributes里，但调用它无害；更准确应调用 updateStatusBar()
    updateStatusBar();

    // 显示成功提示
    Swal.fire({
        icon: 'success',
        title: '打工完成',
        html: `
      <div style="font-size: 0.9rem; text-align: center; padding: 5px 0;">
        <div style="color: #f56565; margin-bottom: 5px;">
          <strong>消耗:</strong> ${job.cost.energy}能量
        </div>
        <div style="color: #48bb78;">
          <strong>收入:</strong> +${job.gains.money}元
        </div>
      </div>
    `,
        showConfirmButton: true,
        confirmButtonText: '好的',
        confirmButtonColor: '#667eea',
        width: '300px',
        padding: '1rem',
        showCloseButton: true,
        customClass: {
            popup: 'small-swal',
            title: 'small-swal-title',
            htmlContainer: 'small-swal-content'
        }
    });
}




// 显示小提示
function showToast(message, icon = 'info') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        width: 'auto',
        padding: '0.75rem',
        customClass: {
            popup: 'toast-swal'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: icon,
        title: message
    });
}

// 渲染休息内容
function renderRestContent() {
    const restEnergyDisplay = document.getElementById('restEnergyDisplay');
    if (restEnergyDisplay) {
        restEnergyDisplay.textContent = gameData.agent.energy;
    }

    // 更新休息信息文本
    const restInfo = document.querySelector('.rest-info');
    if (restInfo) {
        restInfo.innerHTML = `
            <p>当前能量: <span id="restEnergyDisplay">${gameData.agent.energy}</span>/10</p>
            <p>休息后: 能量恢复满，时间前进一天</p>
        `;
    }
}

// 渲染个人档案
function renderProfile() {
    const agentName = document.getElementById('agentName');
    const studioName = document.getElementById('studioName');
    const profileMoney = document.getElementById('profileMoney');
    const profileCompleted = document.getElementById('profileCompleted');
    const profileReputation = document.getElementById('profileReputation');
    const borrowingDetails = document.getElementById('borrowingDetails');
    const borrowingTotalAmount = document.getElementById('borrowingTotalAmount');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    if (agentName) agentName.value = gameData.agent.name;
    if (studioName) studioName.value = gameData.agent.studioName;
    if (profileMoney) profileMoney.textContent = gameData.agent.money;

    const completedCount = gameData.commissions.filter(comm => comm.status === 'completed').length;
    if (profileCompleted) profileCompleted.textContent = completedCount;

    const reputation = gameData.agent.attributes.声望;
    //const reputationLevel = Math.floor(reputation / 20) + 1;
    if (profileReputation) profileReputation.textContent = reputation;
    
    // 计算借钱统计信息
    let peopleCount = 0;
    let totalAmount = 0;
    let borrowingDetailTexts = [];
    
    gameData.players.forEach(player => {
        if (player.borrowingStats && player.borrowingStats.count > 0) {
            peopleCount++;
            totalAmount += player.borrowingStats.totalAmount;
            borrowingDetailTexts.push(`${player.name} 合计${player.borrowingStats.totalAmount}元`);
        }
    });
    
    if (borrowingDetails) {
        if (borrowingDetailTexts.length > 0) {
            borrowingDetails.innerHTML = borrowingDetailTexts.map(detail => '<div>' + detail + '</div>').join('');
        } else {
            borrowingDetails.textContent = '无借款记录';
        }
    }
    if (borrowingTotalAmount) borrowingTotalAmount.textContent = totalAmount;

    if (saveProfileBtn) {
        saveProfileBtn.onclick = saveProfile;
    }
}

// 保存个人档案
function saveProfile() {
    const agentName = document.getElementById('agentName').value.trim();
    const studioName = document.getElementById('studioName').value.trim();

    if (agentName) gameData.agent.name = agentName;
    if (studioName) gameData.agent.studioName = studioName;

    alert('个人信息已保存！');
}


// 交谈功能
function talkToPlayer() {
    const talkButton = document.getElementById('talkButton');
    if (!talkButton) return;

    const playerId = talkButton.dataset.playerId;
    const player = gameData.players.find(p => p.id === playerId);

    if (player) {
        // 消耗能量    

         if (gameData.agent.energy <= 0) {
            Swal.fire({
                icon: 'warning',
                width: '300px',
                text: '能量不足，无法交谈',
                showConfirmButton: false, // 自动关闭时，通常隐藏按钮更美观
                timer: 1200,
                timerProgressBar: true,
            });
            return;
        }

        // 检查好感度上限
        if (player.好感度 >= 100) {
            Swal.fire({
                icon: 'info',
                width: '300px',
                text: '不能再通过谈话或送礼增加好感度了',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
            return;
        }

        // 获取随机对话
        const dialog = getRandomDialog(playerId);

        // 保存当前对话
        currentPlayerDialogue = dialog;

        // 更新卡片上的对话区域
        updateDialogueContent(dialog);

        // 增加好感度
        player.好感度 = Math.min(100, player.好感度 + 2);
        gameData.agent.energy -= 1;

        // 检查是否可以获取联系方式
        if (player.好感度 >= 30 && !player.联系方式) {
            player.联系方式 = true;
            gameData.agent.contacts.push(player.name);

            // 在对话区域添加联系方式获取提示
            const dialogueContent = document.getElementById('dialogueContent');
            if (dialogueContent) {
                dialogueContent.innerHTML = `
                    <div style="margin-bottom: 5px;">"${dialog}"</div>
                    <div style="font-size: 0.8rem; color: #10b981; font-weight: 600;">
                        ✓ 已成功获取${player.name}的联系方式！
                    </div>
                `;
            }
        }

        // 重新渲染卡片以更新好感度等信息
        renderPlayerCard(player);
        updateStatusBar();
        //renderOfficePage();
    }
}

// 送礼功能
function giftToPlayer() {
    const giftButton = document.getElementById('giftButton');
    if (!giftButton) return;

    const playerId = giftButton.dataset.playerId;
    const player = gameData.players.find(p => p.id === playerId);

    if (player) {
        const giftCost = 500;

        if (gameData.agent.energy <= 1) {
            Swal.fire({
                icon: 'warning',
                width: '300px',
                text: '能量不足，无法送礼',
                showConfirmButton: false, // 自动关闭时，通常隐藏按钮更美观
                timer: 1200,
                timerProgressBar: true,
            });
            return;
        }


        if (gameData.agent.money >= giftCost) {
            // 检查好感度上限
            if (player.好感度 >= 100) {
                Swal.fire({
                    icon: 'info',
                    width: '300px',
                    text: '不能再通过谈话或送礼增加好感度了',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
                return;
            }

            // 获取送礼相关台词
            const playerDialog = PLAYER_DIALOGS_CONFIG[playerId];
            let giftDialog = "谢谢你的礼物。";

            if (playerDialog && playerDialog.gift && playerDialog.gift.length > 0) {
                giftDialog = playerDialog.gift[Math.floor(Math.random() * playerDialog.gift.length)];
            }

            // 保存当前对话
            currentPlayerDialogue = giftDialog;

            // 更新卡片上的对话区域
            updateDialogueContent(giftDialog);

            // 执行送礼逻辑
            gameData.agent.money -= giftCost;
            player.好感度 = Math.min(100, player.好感度 + 5);
            gameData.agent.energy -= 2;

            // 重新渲染卡片
            renderPlayerCard(player);
            updateStatusBar();
            //renderOfficePage();
        } else {
            // 资金不足时显示提示
            Swal.fire({
                icon: 'warning',
                width: '300px',
                text: '金钱不足，无法送礼',
                showConfirmButton: false, // 自动关闭时，通常隐藏按钮更美观
                timer: 1200,
                timerProgressBar: true,
            });
            return;
        }
    }
}



// 交换联系方式功能
function exchangeContact() {
    const exchangeButton = document.getElementById('exchangeContactButton');
    if (!exchangeButton) return;

    const playerId = exchangeButton.dataset.playerId;
    const player = gameData.players.find(p => p.id === playerId);

    if (player && player.好感度 >= 30 && !player.联系方式) {
        // gameData.agent.energy -= 1;
        player.联系方式 = true;
        gameData.agent.contacts.push(player.name);

        // 获取交换联系方式时的对话
        const playerDialog = PLAYER_DIALOGS_CONFIG[playerId];
        let contactDialog = "好的，这是我的联系方式。";

        if (playerDialog && playerDialog.general && playerDialog.general.length > 0) {
            contactDialog = playerDialog.general[Math.floor(Math.random() * playerDialog.general.length)];
        }

        // 保存当前对话
        currentPlayerDialogue = contactDialog;

        // 更新卡片上的对话区域
        updateDialogueContent(contactDialog + " ✓ 已交换联系方式");

        // 重新渲染卡片
        renderPlayerCard(player);
        showToast('联系方式已获取！');
        // updateStatusBar();
        // renderOfficePage();
    }
}


// 显示随机网友卡片
// 显示随机网友卡片
function showRandomNetizenPlayerCard(teamName) {
    // 从 players 数组中筛选属于该队伍的选手
    const existingPlayers = gameData.players.filter(player => player.team === teamName);

    // 如果荣耀网游玩家数量少于10个，补充生成
    if (existingPlayers.length < 20) {
        const needCount = 20 - existingPlayers.length;
        const newPlayers = generateRandomNetizenPlayers(needCount);
        // 将新玩家添加到数组
        gameData.players.push(...newPlayers);
    }

    // 重新获取所有荣耀网游玩家（包含新生成的）
    const allNetizenPlayers = gameData.players.filter(player => player.team === teamName);

    if (allNetizenPlayers.length === 0) {
        console.log(`队伍 ${teamName} 没有选手`);
        return;
    }

    // 随机选择一个选手
    const randomIndex = Math.floor(Math.random() * allNetizenPlayers.length);
    const randomPlayer = allNetizenPlayers[randomIndex];

    if (randomPlayer) {
        renderNetizenPlayerCard(randomPlayer);
        playerCardModal.style.display = 'flex';
    }
}

// 生成随机网游玩家（返回玩家数组，不直接添加到gameData）
function generateRandomNetizenPlayers(count) {
    // 账号卡名库
    const cardNames = [
        // 粉丝向
        "叶神我爱你", "蓝雨死忠粉", "霸图铁杆", "微草信徒", "轮回迷弟",
        "荣耀十年老粉", "PK场常客", "副本狂魔", "竞技场高手", "装备收藏家",

        // 古风
        "一剑霜寒", "月下独酌", "青衫烟雨", "醉卧沙场", "沧海一笑",
        "扶摇万里", "落花独立", "古道西风", "烟雨江南", "长安明月",

        // 中二霸气
        "灭神诅咒", "剑指苍穹", "天下无双", "唯我独尊", "暗夜君王",
        "战神归来", "魔王降临", "逆天而行", "傲视群雄",

        // 可爱搞怪
        "今天加油鸭", "喵喵喵", "咕咕咕", "咸鱼一条", "柠檬精",
        "欧皇在此", "非酋不哭", "皮卡丘", "可达鸭",

        // 英文/拼音
        "GloryMaster", "PKKing", "OneLeafFall", "DesertSmoke", "RainSound",
        "NightRain", "BlueRain", "MicroGrass", "Reincarnation",

        // 谐音梗
        "夜雨声烦烦", "一叶知秋秋", "大漠孤烟烟", "王不留行行",
        "君莫笑笑", "索克萨尔尔", "一枪穿云云",

        // 文艺
        "风居住的街道", "云端的歌者", "星辰大海", "时间的旅人",
        "远方的诗", "静谧的夜", "花开的声音"
    ];

    // 全职高手24职业（经过核对的准确版）
    const professions = [
        "战斗法师", "拳法家", "神枪手", "枪炮师", "魔道学者",
        "元素法师", "刺客", "盗贼", "术士", "牧师",
        "守护使者", "骑士", "剑客", "鬼剑士", "魔剑士",
        "忍者", "气功师", "召唤师", "流氓", "弹药专家",
        "机械师", "流氓", "元素法师", "狂剑士"
    ];

    const randomPlayers = [];

    for (let i = 0; i < count; i++) {
        // 随机账号卡名
        const cardName = cardNames[Math.floor(Math.random() * cardNames.length)];

        // 生成ID
        const id = "netizen_" + Date.now() + "_" + i;

        // 随机职业
        const profession = professions[Math.floor(Math.random() * professions.length)];

        // 随机级别（C或B）
        const level = Math.random() > 0.7 ? "D" : "C";

        // 网友加入战队的期待
        const teamExpectations = [
            "证明实力", "学习技术", "职业梦想", "展现才华", "追求荣耀",
            "挑战自我", "团队合作", "赛场历练", "实现价值", "超越极限",
            "舞台发光", "战队荣誉", "高手对决", "战术配合", "冠军梦想"
        ];

        // 随机战队期待
        const teamExpectation = teamExpectations[Math.floor(Math.random() * teamExpectations.length)];

        randomPlayers.push({
            id: id,
            cardname: cardName,
            name: '未知',
            职业: profession,
            级别: level,
            期待: teamExpectation,  // 这是加入战队的期待
            好感度: 0,
            联系方式: false,
            team: "荣耀网游"
        });
    }

    return randomPlayers;
}






// 渲染网友卡片
// 渲染网友卡片
function renderNetizenPlayerCard(player) {
    const playerCard = document.getElementById('playerCard');
    if (!playerCard) return;

    // 记录当前选手
    currentPlayerCard = player;

    // 获取好感度百分比
    const favorPercent = Math.min(player.好感度, 100);
    const displayPercent = Math.max(0, favorPercent);

    // 确定好感度提示
    let favorTip = '';
    let tipClass = '';
    if (player.好感度 < 30) {
        favorTip = '好感度30可交换联系方式';
        tipClass = 'low';
    } else if (!player.联系方式) {
        favorTip = '可交换联系方式';
        tipClass = 'medium';
    } else {
        favorTip = '关系良好';
        tipClass = 'medium';
    }

    playerCard.innerHTML = `
        <div class="player-card-header">
            <div class="player-avatar-section">
                <div class="player-avatar">
                    <img src="images/players/${player.id}.png" 
                         alt="${player.name}"
                         style="display:none;" 
                         onload="this.style.display='block'; this.nextElementSibling.style.display='none'"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <span style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                        ${player.name.charAt(0)}
                    </span>
                </div>
                <div class="player-level">${player.级别}</div>
            </div>
            
            <div class="player-info-section">
                <div class="player-name-row">
                    <h2 class="player-name">${player.name}</h2> <!-- 姓名 -->                  
                </div>
             
                <div class="info-row player-expect">账号：${player.cardname}</div>                 
                <div class="info-row player-team">${player.职业}</div> <!-- 所属战队改为职业 -->
                <div class="info-row player-contact">
                    联系：<span class="contact-status ${player.联系方式 ? 'has-contact' : 'no-contact'}">
                        ${player.联系方式 ? '已获取' : '未获取'}
                    </span>
                </div>
            </div>
        </div>
        
        <div id="dialogueSection" class="player-dialogue-section">
            <div class="dialogue-header">
                <div class="dialogue-label">最新对话</div>
                <div id="dialogueTime" class="dialogue-time">刚刚</div>
            </div>
            <div id="dialogueContent" class="dialogue-content">
                ${currentPlayerDialogue || "点击交谈按钮开始对话..."}
            </div>
        </div>
        
        <div class="player-details">
            <div class="favor-bar-container">
                <div class="favor-text">
                    <span>好感度</span>
                    <span>${player.好感度}</span>
                </div>
                <div class="favor-bar">
                    <div class="favor-fill" style="width: ${displayPercent}%;"></div>
                </div>
                <div class="favor-tip ${tipClass}">${favorTip}</div>
            </div>
        </div>
        
        <div class="player-actions">
            <button id="talkButton" class="action-button" data-player-id="${player.id}">
                交谈 (+5)
            </button>
            <button id="giftButton" class="action-button" data-player-id="${player.id}">
                送礼 (+10)
            </button>
            ${player.好感度 >= 30 && !player.联系方式 ?
            `<button id="exchangeContactButton" class="action-button" data-player-id="${player.id}">
                    获取联系方式
                </button>` :
            ''
        }
        </div>
    `;

    // 绑定按钮事件
    const talkButton = document.getElementById('talkButton');
    const giftButton = document.getElementById('giftButton');
    const exchangeButton = document.getElementById('exchangeContactButton');

    if (talkButton) talkButton.addEventListener('click', talkToNetizenPlayer); // 改为网友交谈
    if (giftButton) giftButton.addEventListener('click', giftToNetizenPlayer); // 改为网友送礼


    if (exchangeButton) {
        exchangeButton.addEventListener('click', exchangeNetizenContact);
    }

    // 如果有之前的对话，显示对话区域
    if (currentPlayerDialogue) {
        showDialogueSection();
    }
}




// 获取网友联系方式
function exchangeNetizenContact() {
    const playerId = this.getAttribute('data-player-id');
    const player = gameData.players.find(p => p.id === playerId) || currentPlayerCard;

    if (!player) return;


    if (player.name && player.name !== '未知') {


        player.联系方式 = true;
        updateNetizenPlayerCard(player);
        showToast('联系方式已获取！');
        return;
    }

    // 如果姓名为空/未知，弹出输入界面
    showNetizenNameInputDialog(player);
}

// 显示网友姓名输入对话框
function showNetizenNameInputDialog(player) {
    Swal.fire({
        title: '获取联系方式',
        html: `
            <div class="name-input-dialog">
                <p>这位网友愿意告诉你他的真实姓名</p>
                <div class="input-group">
                    <label>真实姓名：</label>
                    <input type="text" id="realNameInput" placeholder="请输入真实姓名" autofocus>
                </div>
                <div class="input-group">
                    <label>账号卡名：</label>
                    <input type="text" id="cardNameInput" value="${player.cardname || ''}" placeholder="请输入账号卡名">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        preConfirm: () => {
            const realName = document.getElementById('realNameInput').value.trim();
            const cardName = document.getElementById('cardNameInput').value.trim();

            if (!realName) {
                Swal.showValidationMessage('请输入真实姓名');
                return false;
            }

            return { realName, cardName };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { realName, cardName } = result.value;

            // 更新玩家信息
            player.name = realName;
            if (cardName) {
                player.cardname = cardName;
            }
            player.联系方式 = true;

            // 更新显示
            updateNetizenPlayerCard(player);

            showToast('联系方式已获取，姓名已保存！');
        }
    });
}

// 更新网友卡片显示
function updateNetizenPlayerCard(player) {
    if (currentPlayerCard && currentPlayerCard.id === player.id) {
        renderNetizenPlayerCard(player);
    }
}



// 网友交谈
function talkToNetizenPlayer() {
    const talkButton = document.getElementById('talkButton');
    if (!talkButton) return;

    const playerId = talkButton.dataset.playerId;
    const player = gameData.players.find(p => p.id === playerId);

    if (player) {
        // 消耗能量
        if (gameData.agent.energy <= 0) {
            const dialogueSection = document.getElementById('dialogueSection');
            if (dialogueSection) {
                dialogueSection.classList.add('dialogue-visible');
                updateDialogueContent("（能量不足，无法交谈）");
            }
            return;
        }

        // 网友随机对话
        const netizenDialogs = [
            "最近荣耀更新了新副本，要不要一起去刷？",
            "看你操作不错啊，哪个区的？",
            "我刚研究出一套新连招，要不要试试？",
            "听说职业圈最近有变动，你知道吗？",
            "你这装备搭配很有想法啊",
            "加个好友吧，以后一起组队",
            "我觉得你这职业玩得比我好",
            "最近在冲排名吗？",
            "那个新出的技能特效真炫",
            "你是职业选手的小号吗？操作这么好",
            "你对当前版本有什么看法？",
            "我最近在练新职业，好难上手",
            "竞技场匹配机制是不是又改了？",
            "你的账号卡名挺有意思的",
            "最喜欢哪个职业选手？",
            "荣耀这游戏我能玩一辈子",
            "公会战马上要开始了，紧张",
            "你有没有想过打职业？",
            "装备强化又失败了，心态崩了",
            "最近爆率好低啊，刷不出好东西"
        ];

        const dialog = netizenDialogs[Math.floor(Math.random() * netizenDialogs.length)];

        // 保存当前对话
        currentPlayerDialogue = dialog;

        // 更新卡片上的对话区域
        updateDialogueContent(dialog);

        // 增加好感度
        player.好感度 += 5;
        gameData.agent.energy -= 1;

        // 检查是否可以获取联系方式
        if (player.好感度 >= 30 && !player.联系方式) {
            player.联系方式 = true;
            gameData.agent.contacts.push(player.name);

            // 在对话区域添加联系方式获取提示
            const dialogueContent = document.getElementById('dialogueContent');
            if (dialogueContent) {
                dialogueContent.innerHTML = `
                    <div style="margin-bottom: 5px;">"${dialog}"</div>
                    <div style="font-size: 0.8rem; color: #10b981; font-weight: 600;">
                        ✓ 已成功获取${player.name}的联系方式！
                    </div>
                `;
            }
        }

        // 重新渲染卡片以更新好感度等信息
        renderNetizenPlayerCard(player);
        updateStatusBar();
    }
}

// 网友送礼
function giftToNetizenPlayer() {
    const giftButton = document.getElementById('giftButton');
    if (!giftButton) return;

    const playerId = giftButton.dataset.playerId;
    const player = gameData.players.find(p => p.id === playerId);

    if (player) {
        const giftCost = 500;

        if (gameData.agent.energy <= 0) {
            Swal.fire({
                icon: 'warning',
                width: '300px',
                text: '能量不足，无法送礼',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
            });
            return;
        }


        if (gameData.agent.money >= giftCost) {
            // 网友送礼台词
            const netizenGiftDialogs = [
                "谢谢你的礼物！太客气了",
                "哇，这个礼物我很喜欢！",
                "你怎么知道我一直想要这个？",
                "这份礼物太珍贵了，谢谢你",
                "以后有需要帮忙的尽管说",
                "真是意外的惊喜，太感谢了",
                "你真是个大方的人",
                "这份心意我收下了，谢谢",
                "这礼物太棒了，我会好好用的",
                "哇！你怎么这么懂我？",
                "太感谢了，这对我很有帮助",
                "你真是太好了，这么照顾我",
                "这礼物太及时了，正好需要",
                "谢谢大佬的礼物！",
                "太开心了，收到这么好的礼物",
                "你真是我见过最大方的人",
                "这礼物太实用了，感谢",
                "哇塞，这礼物太酷了！",
                "谢谢，我会珍惜这份礼物的",
                "你对我真好，太感动了"
            ];

            const giftDialog = netizenGiftDialogs[Math.floor(Math.random() * netizenGiftDialogs.length)];

            // 保存当前对话
            currentPlayerDialogue = giftDialog;

            // 更新卡片上的对话区域
            updateDialogueContent(giftDialog);

            // 执行送礼逻辑
            gameData.agent.money -= giftCost;
            player.好感度 += 10;
            gameData.agent.energy -= 1;

            // 重新渲染卡片
            renderNetizenPlayerCard(player);
            updateStatusBar();
        } else {
            // 资金不足时显示提示
            Swal.fire({
                icon: 'warning',
                width: '300px',
                text: '金钱不足，无法送礼',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
            });
            return;
        }
    }
}