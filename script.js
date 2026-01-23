// DOM元素
const gameCover = document.getElementById('gameCover');
const gameMain = document.getElementById('gameMain');
const startGameBtn = document.getElementById('startGame');
const restartGameBtn = document.getElementById('restartGame');
const tabButtons = document.querySelectorAll('.tab-button');
const restButton = document.getElementById('restButton');
const playerCardModal = document.getElementById('playerCardModal');
const commissionDetailModal = document.getElementById('commissionDetailModal');
const negotiationDetailModal = document.getElementById('negotiationDetailModal');
const closeButtons = document.querySelectorAll('.close');

// 分页配置
const pageSize = 5;
let currentPage = 1;

// 在文件顶部添加变量记录当前选中的选手
let currentPlayerCard = null;
//let currentPlayerDialogue = null;

// 时间比较函数
function compareTimes(time1, time2) {
    const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];

    if (time1.year > time2.year) return 1;
    if (time1.year < time2.year) return -1;

    const season1 = seasons.indexOf(time1.season);
    const season2 = seasons.indexOf(time2.season);

    if (season1 > season2) return 1;
    if (season1 < season2) return -1;

    if (time1.day > time2.day) return 1;
    if (time1.day < time2.day) return -1;

    return 0;
}

function isTimeBetween(checkTime, startTime, endTime) {
    return compareTimes(checkTime, startTime) >= 0 &&
        compareTimes(checkTime, endTime) <= 0;
}


// 判断选手是否在当前转会期（夏/冬）已转会
function hasTransferredInCurrentPeriod(player, currentTime) {
    if (!['夏转会期', '冬转会期'].includes(currentTime.season)) {
        return false; // 非转会期不限制
    }
    if (!Array.isArray(player.transferHistory)) return false;
    return player.transferHistory.some(record =>
        record.time.year === currentTime.year &&
        record.time.season === currentTime.season
    );
}



// 获取当前时间字符串
function getCurrentTimeString() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 渲染委托页面
function renderCommissionPage() {
    renderAvailableCommissions();
    renderAcceptedCommissions();
    renderCompletedCommissions();
    renderFailedCommissions();
}

// 计算剩余天数
function calculateDaysLeft(deadlineTime) {
    if (gameData.time.year === deadlineTime.year &&
        gameData.time.season === deadlineTime.season) {
        const daysLeft = deadlineTime.day - gameData.time.day;
        return daysLeft >= 0 ? daysLeft : 0;
    }
    return 0;
}

// 渲染待接受委托
// 渲染待接受委托
function renderAvailableCommissions() {
    const availableList = document.getElementById('availableCommissions');
    if (!availableList) return;

    const availableCommissions = gameData.commissions.filter(comm =>
        comm.status === 'available' &&
        isTimeBetween(gameData.time, comm.startTime, comm.acceptDeadline) &&
        meetsRequirements(comm.requirements)
    );

    if (availableCommissions.length === 0) {
        availableList.innerHTML = '<div class="commission-card">暂无待接受的委托</div>';
        return;
    }

    availableList.innerHTML = availableCommissions.map(comm => {
        const daysLeft = calculateDaysLeft(comm.acceptDeadline);
        const timeWarning = daysLeft <= 2 ? `<span style="color: #f56565;">仅剩${daysLeft}天</span>` : `剩余${daysLeft}天`;

        // 动态生成要求描述
        const requirementsText = Object.entries(comm.requirements)
            .map(([attr, value]) => `${attr}>${value}`)
            .join(', ');

        return `
        <div class="commission-card" style="background-color:rgb(220, 249, 211);">
            <div class="commission-header">
                <div class="commission-title">${comm.type === 'main' ? '⭐ ' : ''}${comm.team} - 招募${comm.playerReq.职业}</div>
                <div class="commission-actions">                   
                    <button class="btn btn-secondary2" onclick="showCommissionDetail('${comm.id}')">接受委托</button>
                </div>
            </div>
            <div>奖励: ${comm.reward} 元</div>
            <div>要求: ${requirementsText}</div>
            <div>保证金: ${comm.deposit} 元</div>
            <div>接受期限: ${timeWarning}</div>
        </div>
    `}).join('');
}

// 渲染已接受委托
function renderAcceptedCommissions() {
    const acceptedList = document.getElementById('acceptedCommissions');
    if (!acceptedList) return;

    const acceptedCommissions = gameData.commissions.filter(comm => comm.status === 'accepted');

    if (acceptedCommissions.length === 0) {
        acceptedList.innerHTML = '<div class="commission-card">暂无已接受的委托</div>';
        return;
    }

    acceptedList.innerHTML = acceptedCommissions.map(comm => {
        const daysLeft = calculateDaysLeft(comm.negotiationDeadline);
        const timeWarning = daysLeft <= 2 ? `<span style="color: #f56565;">仅剩${daysLeft}天</span>` : `剩余${daysLeft}天`;

        return `
    <div class="commission-card" style="background-color:rgb(188, 225, 248); ">
        <div class="commission-header">
            <div class="commission-title">${comm.type === 'main' ? '⭐ ' : ''}${comm.team} - 招募${comm.playerReq.职业}</div>
            <div class="commission-actions">               
                <button class="btn btn-secondary1" onclick="showCommissionDetail('${comm.id}')">确认选手</button>
            </div>
        </div>
        <div>状态: 已接受</div>
        <div>保证金: ${comm.deposit} 元</div>
        <div>协商截止: ${timeWarning}</div>
    </div>
    `;
    }).join('');
}

// 渲染已完成委托
function renderCompletedCommissions() {
    const completedList = document.getElementById('completedCommissions');
    if (!completedList) return;

    const completedCommissions = gameData.commissions.filter(comm => comm.status === 'completed');

    if (completedCommissions.length === 0) {
        completedList.innerHTML = '<div class="commission-card">暂无已完成的委托</div>';
        return;
    }

    completedList.innerHTML = completedCommissions.map(comm => `
        <div class="commission-card" style="background-color: #f6ecb4; ">
            <div class="commission-header">
                <div class="commission-title">${comm.type === 'main' ? '⭐ ' : ''}${comm.team} - 招募${comm.playerReq.职业}</div>
                <div class="commission-actions">
                    <button class="btn btn-secondary4" onclick="showCommissionDetail('${comm.id}')">查看详情</button>
                </div>
            </div>
            <div>状态: 已完成</div>
            <div>招募选手: ${comm.assignedPlayer || '未指定'}</div>
            <div>奖励: ${comm.reward} 元</div>
            <div>保证金: 已退还${comm.deposit}元</div>
        </div>
    `).join('');
}

// 统一为已完成委托的结构
function renderFailedCommissions() {
    const failedList = document.getElementById('failedCommissionsList');
    const failedCommissions = gameData.commissions.filter(commission =>
        commission.status === 'failed'
    );

    if (failedCommissions.length === 0) {
        failedList.innerHTML = '<div class="commission-card">暂无失败委托</div>';
        return;
    }

    // 定义失败原因映射表
    const reasonMap = {
        'negotiation_timeout': '协商超时',
        'player_rejected': '选手拒绝',
        'deadline_expired': '截止日期过期',
        'no_suitable_player': '无合适选手',
        'negotiation_failed': '协商失败'
    };

    failedList.innerHTML = failedCommissions.map(commission => {
        const reason = reasonMap[commission.failureReason] || commission.failureReason || '委托失败';

        return `
        <div class="commission-card" style="background-color: #d2d1cd;">
            <div class="commission-header">
                <div class="commission-title">${commission.type === 'main' ? '⭐ ' : ''}${commission.team} - 招募${commission.playerReq.职业}</div>
                <div class="commission-actions">
                    <button class="btn btn-secondary5" onclick="event.stopPropagation(); showCommissionDetail('${commission.id}')">
                        查看详情
                    </button>
                </div>
            </div>
            <div>失败原因: <span style="color: #dc2626;">${reason}</span></div>
            <div>状态: <span style="color: #dc2626;">已失败</span></div>
            <div>意向选手: ${commission.assignedPlayer || '未指定'}</div>
            <div>保证金: <span style="color: #dc2626;">${commission.deposit}元（已扣除）</span></div>
        </div>
        `;
    }).join('');
}

// 获取失败教训提示
function getFailureLesson(reason) {
    const lessons = {
        'negotiation_timeout': '合理安排协商时间，避免超时',
        'transfer_period_end': '注意转会期截止时间，提前完成协商',
        'negotiation_failed': '提升谈判技巧和属性，提高成功率',
        'default': '委托失败会扣除保证金，请谨慎选择'
    };

    return lessons[reason] || lessons.default;
}

// 渲染协商页面
function renderNegotiationPage() {
    const negotiationList = document.getElementById('negotiationList');
    if (!negotiationList) return;

    const negotiatingCommissions = gameData.commissions.filter(comm => comm.status === 'negotiating');

    if (negotiatingCommissions.length === 0) {
        negotiationList.innerHTML = '<div class="commission-card">暂无正在协商的委托</div>';
        return;
    }

    negotiationList.innerHTML = negotiatingCommissions.map(comm => {
        const daysLeft = calculateDaysLeft(comm.negotiationDeadline);
        const timeWarning = daysLeft <= 2 ? `<span style="color: #f56565;">仅剩${daysLeft}天</span>` : `剩余${daysLeft}天`;
        const assignedPlayer = comm.assignedPlayer || '未指定';

        // 获取当前成功率
        const successRate = comm.negotiationData?.successRate || 0;

        return `
<div class="commission-card" style="background: linear-gradient(to right, #fff3e0, #ffe0b2); border-left: 4px solid #ff9800;">
    <div class="commission-header">
        <div class="commission-title">${comm.type === 'main' ? '⭐ ' : ''}${comm.team} - 招募${comm.playerReq.职业}</div>
        <div class="commission-actions">
            <button class="btn btn-secondary3" onclick="event.stopPropagation(); showNegotiationDetail('${comm.id}')">
                协商进度
            </button>
        </div>
    </div>
    <div>意向选手: ${assignedPlayer}</div>
    <div>当前成功率: 
        <span style="color: ${successRate >= 70
                ? '#22c55e'
                : successRate >= 40
                    ? '#f97316'
                    : '#dc2626'
            }; font-weight: bold;">
            ${successRate < 0 ? '0' : successRate}%
        </span>
    </div>
    <div>委托报酬: 
        <span style="color: #22c55e; font-weight: bold;">
            ¥${comm.reward.toLocaleString()}
        </span>
    </div>
    <div>保证金: ${comm.deposit}元</div>
    <div>协商截止: ${timeWarning}</div>
</div>`;
    }).join('');
}

// 渲染工作室页面
function renderOfficePage() {
    const officeMenu = document.querySelector('.office-menu');
    if (officeMenu) {
        officeMenu.classList.remove('hidden');
    }

    // 确保所有功能内容区域都处于隐藏状态
    document.querySelectorAll('.office-content').forEach(content => {
        content.classList.remove('active');
    });

    // 重新添加菜单点击事件
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const menuName = card.dataset.menu;
            switchOfficeMenu(menuName);
        });
    });
}

// 渲染通讯录
// 渲染通讯录
function renderContacts() {
    const teamsList = document.getElementById('teamsList');
    const teamMembersList = document.getElementById('teamMembersList');
    const currentTeamName = document.getElementById('currentTeamName');
    const membersCount = document.getElementById('membersCount');

    if (!teamsList || !teamMembersList) return;

    teamsList.innerHTML = '';
    teamMembersList.innerHTML = '';
    if (currentTeamName) currentTeamName.textContent = '请选择战队';
    if (membersCount) membersCount.textContent = '';

    // 获取所有有联系方式选手的战队（去重）
    const teamsWithContacts = new Set(
        gameData.players
            .filter(p => p.联系方式)
            .map(p => p.team)
    );

    // ✅ 按 INITIAL_TEAMS 的原始顺序筛选出有联系方式的队伍
    const orderedTeams = INITIAL_TEAMS
        .map(team => team.name)               // 提取 name: ["嘉世", "霸图", ...]
        .filter(name => teamsWithContacts.has(name)); // 只保留有联系方式的

    orderedTeams.forEach(team => {
        const teamTab = document.createElement('button');
        teamTab.className = 'team-tab';
        teamTab.textContent = team;
        teamTab.dataset.team = team;

        teamTab.addEventListener('click', function () {
            document.querySelectorAll('.team-tab').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            renderTeamMembers(team);
        });

        teamsList.appendChild(teamTab);
    });
}

// 渲染指定战队的队员列表
function renderTeamMembers(team) {
    const teamMembersList = document.getElementById('teamMembersList');
    const currentTeamName = document.getElementById('currentTeamName');
    const membersCount = document.getElementById('membersCount');

    if (!teamMembersList || !currentTeamName) return;

    teamMembersList.innerHTML = '';
    currentTeamName.textContent = team;

    // 获取该战队中有联系方式的队员
    const members = gameData.players.filter(player =>
        player.team === team && player.联系方式
    );

    members.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

    if (membersCount) membersCount.textContent = `${members.length} 人`;

    members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';

        memberItem.innerHTML = `
            <div class="member-avatar">${member.name.charAt(0)}</div>
            <div class="member-info">
                <div class="member-name-row">
                    <h4 class="member-name">${member.name}(等级：${member.级别})</h4>
                    <span class="member-favor">${member.好感度}好感</span>
                </div>
                <div class="member-details">
                    <span class="member-job">${member.职业}</span>
                    <span class="member-contact"></span>
                </div>
            </div>
        `;

        // 在 renderTeamMembers 函数中修改成员点击事件：
        memberItem.addEventListener('click', () => {
            //alert("000");
            showPlayerDialogue(member.name);
        });

        teamMembersList.appendChild(memberItem);
    });
}

// 检查是否满足委托要求
function meetsRequirements(requirements) {
    for (const [attr, value] of Object.entries(requirements)) {
        if (gameData.agent.attributes[attr] < value) {
            return false;
        }
    }
    return true;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        available: '待接受',
        accepted: '已接受',
        negotiating: '协商中',
        completed: '已完成',
        failed: '失败',
        expired: '已过期'
    };
    return statusMap[status] || status;
}

// 支付保证金接受委托
function acceptCommissionWithDeposit(commissionId) {
    const commission = gameData.commissions.find(c => c.id === commissionId);

    if (!commission || commission.status !== 'available') {
        showToast('委托不可用', 'error');
        return;
    }

    // 检查是否在可接受时间内
    if (!isTimeBetween(gameData.time, commission.startTime, commission.acceptDeadline)) {
        showToast('不在可接受时间内', 'error');
        return;
    }

    // 检查保证金
    if (gameData.agent.money < commission.deposit) {
        showToast(`保证金不足，需要${commission.deposit}元`, 'error');
        return;
    }

    // 检查是否满足要求
    if (!meetsRequirements(commission.requirements)) {
        showToast('不满足委托要求', 'error');
        return;
    }

    // 确认支付保证金
    Swal.fire({
        title: '确认接受委托',
        html: `
            <div style="text-align: center;">
                <div style="font-size: 0.9rem; margin-bottom: 10px;">
                    <p>接受此委托需要支付保证金：</p>
                    <div style="font-size: 1.2rem; color: #f56565; font-weight: bold;">
                        ${commission.deposit}元
                    </div>
                    <p style="margin-top: 10px; color: #666; font-size: 0.85rem;">
                        委托失败将扣除保证金<br>
                        成功完成可获得${commission.reward}元奖励
                    </p>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '支付',
        cancelButtonText: '取消',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#dc2626',
        width: '300px'
    }).then((result) => {
        if (result.isConfirmed) {
            // 扣除保证金
            gameData.agent.money -= commission.deposit;

            // 更新委托状态
            commission.status = 'accepted';
            commission.acceptedTime = { ...gameData.time };

            // 添加新闻
            // 添加新闻 → 统一推送到 publishedNews
            const acceptedNews = {
                id: 'pub_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                type: 'commission',
                time: { ...gameData.time },
                content: `[快讯！]<span style="font-weight: bold; color: #10b981;">${gameData.agent.name}</span>接受了<span style="font-weight: bold; color: #f97316;">${commission.team}</span>战队的${commission.playerReq.职业}招募委托。`,
                relatedCommission: commission.id,
                views: Math.floor(Math.random() * 200) + 50,
                likes: Math.floor(Math.random() * 50) + 10,
                comments: Math.floor(Math.random() * 20) + 5,
                publisher: "经纪公会"
            };
            gameData.publishedNews.push(acceptedNews);

            // 更新界面
            renderCommissionPage();
            renderSquarePage();
            updateStatusBar();

            // 如果有模态框打开，关闭它
            if (commissionDetailModal.style.display === 'flex') {
                commissionDetailModal.style.display = 'none';
            }

            showToast(`已支付保证金${commission.deposit}元，委托接受成功！`, 'success');
        }
    });
}

// ========== 选手匹配相关函数 ==========
// 重置匹配状态
function resetPlayerMatchState(jobIcon, jobText, levelIcon, levelText, playerInfo, button) {
    // 隐藏图标
    if (jobIcon) {
        jobIcon.style.display = 'none';
        jobIcon.textContent = '';
    }
    if (levelIcon) {
        levelIcon.style.display = 'none';
        levelIcon.textContent = '';
    }

    // 清空文本
    if (jobText) jobText.textContent = '';
    if (levelText) levelText.textContent = '';

    // 隐藏选手信息
    if (playerInfo) playerInfo.style.display = 'none';

    // 禁用按钮
    if (button) {
        button.disabled = true;
        button.style.backgroundColor = '';
        button.innerHTML = '🚀 开始转会协商';
    }
}

// 更新匹配显示
// 更新匹配显示 - 支持多种状态
function updateMatchDisplay(iconElement, textElement, matchInfo, label, currentValue, requiredValue) {
    if (!iconElement || !textElement) return;

    // matchInfo 应该是一个对象，包含匹配状态信息
    // 对于等级匹配：{ isMatch: true/false, isBetterThanRequired: true/false, text: '优于需求'/'符合'/'不足', color: '#10b981'/'#22c55e'/'#dc2626' }
    // 对于职业匹配：{ isMatch: true/false, text: '匹配'/'不匹配', color: '#22c55e'/'#dc2626' }

    if (matchInfo.isMatch || matchInfo.text === '匹配') {
        if (matchInfo.isBetterThanRequired) {
            // 优于需求状态
            iconElement.innerHTML = '<span style="color:#10b981; font-weight:bold;">⭐</span>';
            iconElement.style.display = 'inline';
            textElement.innerHTML = `<span style="color:#10b981; font-size: 0.75rem;">（${matchInfo.text}）</span>`;
        } else {
            // 普通匹配状态
            iconElement.innerHTML = '<span style="color:#22c55e; font-weight:bold;">✓</span>';
            iconElement.style.display = 'inline';
            textElement.innerHTML = `<span style="color:#22c55e; font-size: 0.75rem;">（${matchInfo.text}）</span>`;
        }
    } else {
        // 不匹配状态
        iconElement.innerHTML = '<span style="color:#dc2626; font-weight:bold;">✗</span>';
        iconElement.style.display = 'inline';
        textElement.innerHTML = `<span style="color:#dc2626; font-size: 0.75rem;">（当前：${currentValue}）</span>`;
    }
}

// 更新选手信息显示
function updatePlayerInfoDisplay(infoElement, player) {
    if (!infoElement || !player) return;

    infoElement.innerHTML = `
        <div style="font-weight: 500; color: #1e293b;">已选择选手：</div>
        <div style="margin-top: 0.3rem;">
            <strong>${player.name}</strong> 
            <span style="color:#64748b; font-size:0.8em;">(${player.team})</span>
        </div>
        <div style="font-size:0.8rem; color:#64748b; margin-top:0.2rem;">
            职业：${player.职业} | 等级：Lv.${player.级别} 
            ${player.好感度 ? `| 好感度：${player.好感度}` : ''}
        </div>
    `;
    infoElement.style.display = 'block';
}

// 更新协商按钮
function updateNegotiateButton(button, isJobMatch, isLevelMatch) {
    if (!button) return;

    button.disabled = false;

    if (isJobMatch && isLevelMatch) {
        // 完全匹配
        button.style.backgroundColor = '#22c55e';
        button.innerHTML = '🚀 开始转会协商（完全匹配）';
    } else {
        // 有风险
        button.style.backgroundColor = '#f97316';
        button.innerHTML = '🚀 开始转会协商（有风险）';
    }
}

// 选手选择变化处理函数
function handlePlayerSelectChange(event) {
    const selectElement = event.target;
    const selectedValue = selectElement.value;

    // 获取委托要求
    const requiredJob = selectElement.dataset.requiredJob;
    const requiredLevel = selectElement.dataset.requiredLevel;

    // 获取DOM元素
    const jobIcon = document.getElementById('jobMatchIcon');
    const jobText = document.getElementById('jobMatchText');
    const levelIcon = document.getElementById('levelMatchIcon');
    const levelText = document.getElementById('levelMatchText');
    const selectedPlayerInfo = document.getElementById('selectedPlayerInfo');
    const negotiateBtn = document.getElementById('negotiateBtn');

    // 如果没有选择选手，重置状态
    if (!selectedValue) {
        resetPlayerMatchState(jobIcon, jobText, levelIcon, levelText, selectedPlayerInfo, negotiateBtn);
        return;
    }

    // 查找选中的选手
    const player = gameData.players.find(p => p.name === selectedValue);
    if (!player) return;

    // 定义等级顺序
    const levelOrder = ['D', 'C', 'B', 'B+', 'A', 'A+', 'S'];
    const playerLevelIndex = levelOrder.indexOf(player.级别);
    const requiredLevelIndex = levelOrder.indexOf(requiredLevel);

    // 职业匹配信息
    const jobMatchInfo = {
        isMatch: player.职业 === requiredJob,
        text: player.职业 === requiredJob ? '匹配' : '不匹配',
        color: player.职业 === requiredJob ? '#22c55e' : '#dc2626'
    };

    // 等级匹配信息
    let levelMatchInfo = {
        isMatch: false,
        isBetterThanRequired: false,
        text: '不足',
        color: '#dc2626'
    };

    if (playerLevelIndex > requiredLevelIndex) {
        levelMatchInfo = {
            isMatch: true,
            isBetterThanRequired: true,
            text: '优于需求',
            color: '#10b981'
        };
    } else if (playerLevelIndex === requiredLevelIndex) {
        levelMatchInfo = {
            isMatch: true,
            isBetterThanRequired: false,
            text: '符合',
            color: '#22c55e'
        };
    }

    // 更新职业匹配显示
    updateMatchDisplay(jobIcon, jobText, jobMatchInfo, '职业', player.职业, requiredJob);

    // 更新级别匹配显示
    updateMatchDisplay(levelIcon, levelText, levelMatchInfo, '级别', player.级别, requiredLevel);

    // 显示选手信息
    updatePlayerInfoDisplay(selectedPlayerInfo, player);

    // 更新协商按钮状态
    negotiateBtn.disabled = false;
}

// 创建独立的事件处理函数
function setupPlayerSelectListener() {
    const playerSelect = document.getElementById('playerSelect');
    if (!playerSelect) return;

    playerSelect.addEventListener('change', handlePlayerSelectChange);
}

// 显示委托详情
function showCommissionDetail(commissionId) {
    const commission = gameData.commissions.find(c => c.id === commissionId);
    if (!commission) return;

    const detail = document.getElementById('commissionDetail');
    if (!detail) return;

    const formatTime = (timeObj) => {
        return timeObj ? `Y${timeObj.year} ${timeObj.season} D${timeObj.day}` : '未开始';
    };

    // 计算剩余天数
    const calculateDaysLeft = (deadlineTime) => {
        if (!deadlineTime) return Infinity;

        const current = gameData.time;
        const deadline = deadlineTime;

        if (deadline.year !== current.year) {
            return -1;
        }

        const currentDays = current.day;
        const deadlineDays = deadline.day;

        return deadlineDays - currentDays;
    };

    // 时间状态显示
    const getTimeStatus = (daysLeft, isDeadline = false) => {
        if (daysLeft === Infinity) return '<span style="color: #94a3b8;">无限制</span>';
        if (daysLeft < 0) return '<span style="color: #f56565;">已过期</span>';
        if (daysLeft === 0) {
            return isDeadline
                ? '<span style="color: #f59e0b;">今天截止</span>'
                : '<span style="color: #22c55e;">最后一天</span>';
        }
        if (daysLeft <= 2) return `<span style="color: #f56565;">仅剩${daysLeft}天</span>`;
        return `<span style="color: #22c55e;">剩余${daysLeft}天</span>`;
    };

    // 计算剩余时间
    const acceptDaysLeft = calculateDaysLeft(commission.acceptDeadline);
    const negotiateDaysLeft = calculateDaysLeft(commission.negotiationDeadline);

    // 失败原因转换
    const reasonMap = {
        'negotiation_timeout': '协商超时',
        'player_rejected': '选手拒绝',
        'deadline_expired': '截止日期过期',
        'no_suitable_player': '无合适选手',
        'negotiation_failed': '协商失败'
    };
    const failureReason = reasonMap[commission.failureReason] || commission.failureReason || '委托失败';

    // 根据状态显示不同的操作按钮
    let actionSection = '';

    if (commission.status === 'available') {
        actionSection = `
            <div class="detail-section">
                <h3>💼 接受委托</h3>
                <div style="text-align: center; padding: 1rem;">
                    <button class="btn btn-primary" onclick="acceptCommissionWithDeposit('${commission.id}')" 
                            style="width: 100%; padding: 0.8rem; font-size: 1rem;">
                        💰 支付保证金 ${commission.deposit}元并接受
                    </button>
                    <p style="font-size: 0.8rem; color: #ef1616ff; margin-top: 0.5rem;">
                        接受后需要在${formatTime(commission.negotiationDeadline)}前完成协商
                    </p>
                </div>
            </div>
        `;
    } else if (commission.status === 'accepted') {
        // 获取所有有联系方式的选手
        // 获取所有有联系方式的选手（排除未职业注册的网友）
        const contactPlayers = gameData.players.filter(player => {
            // 1. 必须有联系方式
            if (!player.联系方式) return false;

            // 2. 排除与委托发布方同队的选手
            if (player.team === commission.team) return false;

            // 3. 如果是荣耀网游的选手（网友），检查职业注册状态
            if (player.team === "荣耀网游") {
                // 只有已职业注册的网友才显示
                return player.debutStatus === '已职业注册';
            }

            // 4. 其他战队选手正常显示
            return true;
        });

        if (contactPlayers.length > 0) {
            // 统计符合要求的选手数量
            let eligibleCount = 0;
            let ineligibleCount = 0;

            contactPlayers.forEach(player => {
                const isJobMatch = player.职业 === commission.playerReq.职业;
                const isLevelMatch = player.级别 === commission.playerReq.级别;
                if (isJobMatch && isLevelMatch) {
                    eligibleCount++;
                } else {
                    ineligibleCount++;
                }
            });

            // 修改 actionSection 部分：
            actionSection = `
                <div class="detail-section" data-commission-id="${commission.id}">
                    <h3>🚀 开始协商</h3>
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">
                        选择一名选手开始转会协商（${formatTime(commission.negotiationDeadline)}前完成）
                        <br>
                        <small style="color: ${eligibleCount > 0 ? '#22c55e' : '#f56565'}">
                            🟢 ${eligibleCount}名选手符合要求 🔴 ${ineligibleCount}名选手不符合要求
                        </small>
                    </p>
                    <select id="playerSelect" 
                            data-required-job="${commission.playerReq.职业}"
                            data-required-level="${commission.playerReq.级别}"
                            style="width: 100%; padding: 0.5rem 0.8rem; font-size: 0.85rem; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; background-color: white; margin: 0.5rem 0;">
                        <option value="">-- 请选择选手 --</option>
                    ${contactPlayers.map(player => {
                const alreadyTransferred = hasTransferredInCurrentPeriod(player, gameData.time);

                if (alreadyTransferred) {
                    return `
            <option value="${player.name}" disabled
                    style="color: #94a3b8; background-color: #f1f5f9;"
                    title="${player.name} 在 ${gameData.time.year} 年 ${gameData.time.season} 已完成转会">
                ${player.name} (${player.team}) - ${player.职业} Lv.${player.级别} （本赛季已转会）
            </option>
        `;
                } else {
                    // 即使不符合要求，也允许选择 → 正常显示
                    return `
            <option value="${player.name}">
                ${player.name} (${player.team}) - ${player.职业} Lv.${player.级别}
            </option>
        `;
                }
            }).join('')}
                    </select>
                    
                    <div style="text-align: center; padding: 0.5rem 0 0; margin-top: 0.5rem;">
                        <button class="btn btn-primary" onclick="startNegotiationWithPlayer('${commission.id}')" id="negotiateBtn" disabled>
                            🚀 开始转会协商
                        </button>
                        <p style="font-size: 0.75rem; color: #f56565; margin-top: 0.3rem;">
                            ⚠️ 警告：选择不符合要求的选手可能导致协商失败！
                        </p>
                    </div>
                </div>
            `;
        } else {
            actionSection = `
                <div class="detail-section">
                    <h3>🚀 开始协商</h3>
                    <div style="font-size: 0.8rem; color: #94a3b8; padding: 1rem; text-align: center; background: #f8fafc; border-radius: 8px;">
                        📭 暂无可联系的选手<br>
                        <small style="color: #94a3b8;">去广场获取更多联系方式才能开始协商</small>
                    </div>
                </div>
            `;
        }
    }

    detail.innerHTML = `
    <div class="detail-section">
        <h3>📋 委托概览</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <div>
                <h4 style="margin: 0; font-size: 1.1rem; color: #1e293b;">${commission.team}</h4>
                <span style="background: ${commission.status === 'completed' ? '#dcfce7' : commission.status === 'accepted' ? '#fff1d6' : commission.status === 'failed' ? '#fee2e2' : '#e0f2fe'}; 
                      color: ${commission.status === 'completed' ? '#166534' : commission.status === 'accepted' ? '#92400e' : commission.status === 'failed' ? '#dc2626' : '#0284c7'};
                      padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-left: 0.5rem;">
                    ${getStatusText(commission.status)}
                </span>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 1.2rem; font-weight: bold; color: #4CAF50;">¥${commission.reward}</div>
                <div style="font-size: 0.7rem; color: #64748b;">奖励</div>
            </div>
        </div>
    </div>

    <div class="detail-section">
        <h3>⏰ 时间安排</h3>
        <div class="time-grid">
            <div class="time-label">新闻发布：</div>
            <div class="time-value">${formatTime(commission.newsTime)}</div>
            
            ${commission.status === 'available' ? `
                <div class="time-label">可接受时间：</div>
                <div class="time-value-group">
                    <div>${formatTime(commission.startTime)} - ${formatTime(commission.acceptDeadline)}</div>
                    <div class="time-status">${getTimeStatus(acceptDaysLeft)}</div>
                </div>
            ` : `
                <div class="time-label">接受时间：</div>
                <div class="time-value">${formatTime(commission.acceptedTime) || '—'}</div>
            `}
            
            <div class="time-label">协商截止：</div>
            <div class="time-value-group">
                <div>${formatTime(commission.negotiationDeadline)}</div>
                <div class="time-status">${getTimeStatus(negotiateDaysLeft, true)}</div>
            </div>
            
            <div class="time-label">转会期结束：</div>
            <div class="time-value">${formatTime(commission.endTime)}</div>
        </div>
    </div>

    <div class="detail-section">
        <h3>💰 资金信息</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0;">
                <span style="font-weight: 500; color: #475569; font-size: 0.85rem;">委托报酬：</span>
                <span style="font-weight: 600; font-size: 0.9rem; color: #4CAF50;">+${commission.reward}元</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0;">
                <span style="font-weight: 500; color: #475569; font-size: 0.85rem;">保证金：</span>
                <span style="font-weight: 600; font-size: 0.9rem; color: ${commission.status === 'failed' ? '#dc2626' : '#f97316'};">${commission.deposit}元</span>
            </div>
            ${commission.status === 'accepted' ? `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0;">
                    <span style="font-weight: 500; color: #475569; font-size: 0.85rem;">保证金状态：</span>
                    <span style="font-weight: 600; font-size: 0.9rem; color: #f59e0b;">已支付（成功退还）</span>
                </div>
            ` : ''}
            ${commission.status === 'completed' ? `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0;">
                    <span style="font-weight: 500; color: #475569; font-size: 0.85rem;">保证金状态：</span>
                    <span style="font-weight: 600; font-size: 0.9rem; color: #22c55e;">已退还</span>
                </div>
            ` : ''}
            ${commission.status === 'failed' ? `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0;">
                    <span style="font-weight: 500; color: #475569; font-size: 0.85rem;">保证金状态：</span>
                    <span style="font-weight: 600; font-size: 0.9rem; color: #dc2626;">已扣除</span>
                </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0;">
                <span style="font-weight: 500; color: #475569; font-size: 0.85rem;">资金流程：</span>
                <span style="font-size: 0.8rem; color: #6b7280; text-align: right;">
                    接受时支付 → 成功退还+奖励<br>
                    失败则不退还
                </span>
            </div>
        </div>
    </div>

    <div class="detail-section">
        <h3>🎯 经纪人要求</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
            ${Object.entries(commission.requirements).map(([attr, value]) => `
                <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.2rem;">${attr}</div>
                    <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">>${value}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="detail-section">
        <h3>🕵️ 选手要求</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
            <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.3rem;">
                    职业
                    <span id="jobMatchIcon" style="display: none;"></span>
                </div>
                <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">
                    ${commission.playerReq.职业}
                    <span id="jobMatchText" style="font-size: 0.8rem; margin-left: 0.3rem;"></span>
                </div>
            </div>
            <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.3rem;">
                    级别
                    <span id="levelMatchIcon" style="display: none;"></span>
                </div>
                <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">
                    ${commission.playerReq.级别}
                    <span id="levelMatchText" style="font-size: 0.8rem; margin-left: 0.3rem;"></span>
                </div>
            </div>
        </div>
        <div id="selectedPlayerInfo" style="font-size: 0.85rem; padding: 0.5rem; background-color: #f8fafc; border-radius: 6px; margin: 0.5rem 0; display: none;"></div>
    </div>

    ${commission.status === 'completed' || commission.status === 'failed' ? `
        <div class="detail-section">
            <h3>${commission.status === 'completed' ? '✅ 委托结果' : '❌ 委托结果'}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
                <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.2rem;">招募选手</div>
                    <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">${commission.assignedPlayer || '未指定'}</div>
                </div>
                ${commission.status === 'completed' ? `
                    <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.2rem;">耗时</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">${commission.completedTime && commission.negotiationStartTime ?
                    `${commission.completedTime.day - commission.negotiationStartTime.day + 1}天` : '—'}</div>
                    </div>
                ` : `
                    <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.2rem;">失败时间</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">
                            ${commission.failureTime ? formatTime(commission.failureTime) : '未知时间'}
                        </div>
                    </div>
                `}
            </div>
        </div>
    ` : ''}

    ${actionSection}
    `;

    commissionDetailModal.style.display = 'flex';

    // 设置选手选择监听器
    setTimeout(() => {
        setupPlayerSelectListener();
    }, 100);
}


// 开始协商（选择选手后）
// 开始协商（选择选手后）
function startNegotiationWithPlayer(commissionId) {
    const commission = gameData.commissions.find(c => c.id === commissionId);
    if (commission && commission.status === 'accepted') {
        const playerSelect = document.getElementById('playerSelect');
        if (playerSelect) {
            const selectedPlayer = playerSelect.value;

            if (!selectedPlayer) {
                Swal.fire({
                    title: '请选择选手',
                    text: '需要选择一名选手才能开始协商',
                    icon: 'warning',
                    confirmButtonText: '知道了',
                    confirmButtonColor: '#6b7280',
                    width: '320px'
                });
                return;
            }

            const player = gameData.players.find(p => p.name === selectedPlayer);
            if (!player) return;

            const teamName = commission.team;

            // 判断职业是否匹配
            const isJobMatch = player.职业 === commission.playerReq.职业;

            // 定义等级顺序：D < C < B < B+ < A < A+ < S
            const levelOrder = ['D', 'C', 'B', 'B+', 'A', 'A+', 'S'];
            const playerLevelIndex = levelOrder.indexOf(player.级别);
            const requiredLevelIndex = levelOrder.indexOf(commission.playerReq.级别);

            // 判断等级匹配情况
            let isLevelMatch = false;
            let levelMatchText = '';
            let levelMatchColor = '#dc2626';

            if (playerLevelIndex !== -1 && requiredLevelIndex !== -1) {
                if (playerLevelIndex >= requiredLevelIndex) {
                    isLevelMatch = true;
                    if (playerLevelIndex > requiredLevelIndex) {
                        // 选手等级优于需求
                        levelMatchText = '✅ 优于需求';
                        levelMatchColor = '#10b981'; // 绿色
                    } else {
                        // 刚好符合需求
                        levelMatchText = '✅ 符合';
                        levelMatchColor = '#22c55e'; // 浅绿色
                    }
                } else {
                    // 等级不足
                    levelMatchText = '❌ 不足';
                }
            }

            // 1. 基础成功率
            let baseSuccessRate = 30;
            if (!isJobMatch) baseSuccessRate -= 20;
            if (!isLevelMatch) baseSuccessRate -= 10;

            // 2. 偏好加成（使用新的时间维度偏好查找）
            const preference = getNegotiationPreference(selectedPlayer, teamName, gameData.time);
            const playerBonus = preference.playerBonus;
            const teamBonus = preference.teamBonus;
            const playerDialogue = preference.playerDialogue;
            const teamDialogue = preference.teamDialogue;
            const isRandomPreference = preference.isRandomPreference || false;
            const randomPlayerValue = preference.randomPlayerValue || 0;
            const randomTeamValue = preference.randomTeamValue || 0;

            console.log("Selected player:", selectedPlayer);
            console.log("Team name:", teamName);
            console.log("Player object:", player);
            console.log("Player level:", player.级别);
            console.log("Required level:", commission.playerReq.级别);
            console.log("Is level match:", isLevelMatch);
            console.log("Level match text:", levelMatchText);
            console.log("playerBonus:", playerBonus);
            console.log("teamBonus:", teamBonus);

            const totalPreferenceBonus = playerBonus + teamBonus;
            baseSuccessRate += totalPreferenceBonus;

            // 3. 绝对拒绝判断
            const isPlayerAbsolutelyRefusing = playerBonus <= -1000;
            const isTeamAbsolutelyRefusing = teamBonus <= -1000;
            const isImpossible = isPlayerAbsolutelyRefusing || isTeamAbsolutelyRefusing;

            // 4. 更新委托状态
            commission.status = 'negotiating';
            commission.assignedPlayer = selectedPlayer;
            commission.negotiationStartTime = { ...gameData.time };

            // 5. 初始化协商数据
            const attributes = gameData.agent.attributes;
            commission.negotiationData = {
                successRate: baseSuccessRate,
                totalPoints: attributes.谈判技巧 + attributes.社交能力 + attributes.魅力 + attributes.声望,
                usedPoints: 0,
                completedFactors: [],
                preferenceBonus: totalPreferenceBonus,
                playerDialogue: playerDialogue,
                teamDialogue: teamDialogue,
                playerMood: playerBonus <= -1000 ? 'negative' : playerBonus > 0 ? 'positive' : 'neutral',
                teamMood: teamBonus <= -1000 ? 'negative' : teamBonus > 0 ? 'positive' : 'neutral',
                isRandomPreference: isRandomPreference,
                randomPlayerValue: randomPlayerValue,
                randomTeamValue: randomTeamValue,
                // 添加等级匹配信息用于显示
                levelMatchInfo: {
                    playerLevel: player.级别,
                    requiredLevel: commission.playerReq.级别,
                    isMatch: isLevelMatch,
                    isBetterThanRequired: playerLevelIndex > requiredLevelIndex,
                    matchText: levelMatchText
                }
            };

            // 6. 弹窗提示
            Swal.fire({
                title: '开始协商',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 40px; margin-bottom: 10px;">🚀</div>
                        <div style="font-size: 0.9rem;">
                            <p>已选择选手 <strong style="color: #4f46e5;">${selectedPlayer}</strong></p>
                            
                            <div style="margin: 8px 0; padding: 6px; background-color: #f8fafc; border-radius: 6px; font-size: 0.85rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                    <span style="color: #64748b;">职业匹配：</span>
                                    <span style="font-weight: bold; color: ${isJobMatch ? '#22c55e' : '#dc2626'}">
                                        ${isJobMatch ? '✅ 匹配' : '❌ 不匹配'}
                                    </span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #64748b;">等级匹配：</span>
                                    <span style="font-weight: bold; color: ${levelMatchColor}">
                                        ${levelMatchText}
                                    </span>
                                </div>
                                <div style="margin-top: 4px; font-size: 0.8rem; color: #6b7280; text-align: right;">
                                    （要求：${commission.playerReq.级别}，当前：${player.级别}）
                                </div>
                            </div>

                            ${isImpossible ?
                        `<div style="margin: 10px 0; padding: 8px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
                        <p style="margin: 0; color: #dc2626; font-weight: bold;">⚠️ 协商几乎不可能成功！</p>
                        <p style="margin: 5px 0 0 0; color: #991b1b; font-size: 0.85rem;">
                            ${isPlayerAbsolutelyRefusing ? '选手坚决不愿加入该战队' : ''}
                            ${isTeamAbsolutelyRefusing ? '战队明确拒绝该选手' : ''}
                        </p>
                    </div>` :
                        totalPreferenceBonus < -30 ?
                            `<div style="margin: 10px 0; padding: 8px; background-color: #fff7ed; border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; color: #92400e; font-weight: bold;">⚠️ 双方意愿较低</p>
                            <p style="margin: 5px 0 0 0; color: #92400e; font-size: 0.85rem;">
                                成功率受到显著影响（偏好加成：${totalPreferenceBonus}%）
                            </p>
                        </div>` :
                            totalPreferenceBonus > 20 ?
                                `<div style="margin: 10px 0; padding: 8px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
                                <p style="margin: 0; color: #166534; font-weight: bold;">✅ 双方意愿积极！</p>
                              
                            </div>` :
                                ''
                    }

                           

                            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                                <p style="color: ${baseSuccessRate >= 50 ? '#22c55e' : baseSuccessRate >= 20 ? '#f97316' : '#dc2626'}; font-weight: bold;">
                                    ${baseSuccessRate >= 50 ? '✅ 协商前景乐观' :
                        baseSuccessRate >= 20 ? '⚠️ 协商存在风险' : '❌ 协商极难成功'}
                                </p>
                                <p style="font-size: 0.8rem; color: #6b7280;">
                                    需在 ${commission.negotiationDeadline.year}年 
                                    ${commission.negotiationDeadline.season} 
                                    第${commission.negotiationDeadline.day}天前完成
                                </p>
                            </div>
                        </div>
                    </div>
                `,
                confirmButtonText: '进入协商',
                confirmButtonColor: '#4CAF50',
                width: '320px',
                showCancelButton: true,
                cancelButtonText: '再考虑一下',
                cancelButtonColor: '#dc2626'
            }).then((result) => {
                if (result.isConfirmed) {
                    renderCommissionPage();
                    renderNegotiationPage();
                    if (commissionDetailModal.style.display === 'flex') {
                        commissionDetailModal.style.display = 'none';
                    }
                    Swal.fire({
                        title: '协商已开始',
                        html: `
                            <div style="text-align: center;">
                                <div style="font-size: 40px; margin-bottom: 10px;">🎯</div>
                                <div style="font-size: 0.9rem;">
                                    <p>已开始为 <strong>${commission.team}</strong> 协商转会</p>
                                    <div style="margin: 10px 0; padding: 8px; background-color: #f0f9ff; border-radius: 6px;">
                                        <p style="margin: 0; color: #0284c7;"><strong>意向选手：</strong>${selectedPlayer}</p>
                                    </div>
                                    <div style="margin: 10px 0; padding: 6px; background-color: #f8fafc; border-radius: 6px; font-size: 0.85rem;">
                                        <p style="margin: 0;"><strong>等级要求：</strong>${commission.playerReq.级别}</p>
                                        <p style="margin: 0;"><strong>选手等级：</strong>${player.级别} 
                                            ${playerLevelIndex > requiredLevelIndex ? '⭐ 优于需求' :
                                playerLevelIndex === requiredLevelIndex ? '✅ 符合' : '❌ 不足'}
                                        </p>
                                    </div>
                                    <div style="margin-top: 15px; font-size: 0.8rem; color: #6b7280;">
                                        <p>✅ 可在"谈判协商"中查看进度</p>
                                        <p>📝 记得在截止日期前完成协商哦</p>
                                    </div>
                                </div>
                            </div>
                        `,
                        confirmButtonText: '协商进度',
                        confirmButtonColor: '#4CAF50',
                        width: '320px'
                    }).then(() => {
                        switchTab('negotiation');
                        showNegotiationDetail(commissionId);
                    });
                } else {
                    commission.status = 'accepted';
                    commission.assignedPlayer = null;
                    commission.negotiationStartTime = null;
                    commission.negotiationData = null;
                    renderCommissionPage();
                    renderNegotiationPage();
                }
            });
        }
    }
}

// 辅助函数：根据时间查找偏好
function getNegotiationPreference(playerName, teamName, currentTime) {
    // 格式化时间键：如 "1-冬转会期"
    const timeKey = `${currentTime.year}-${currentTime.season}`;
    console.log("getNegotiationPreference called:", playerName, teamName, timeKey);

    // 构建查找键
    const exactPlayerKey = `${timeKey}-${playerName}-${teamName}`;
    const exactTeamKey = `${timeKey}-${teamName}-${playerName}`;

    console.log("Looking for exact key:", exactPlayerKey);

    // 尝试精确时间匹配
    let playerPreference = negotiationPreferences?.playerToTeam?.[exactPlayerKey];
    let teamPreference = negotiationPreferences?.teamToPlayer?.[exactTeamKey];

    if (playerPreference) {
        console.log("Found exact match:", playerPreference);
    } else {
        console.log("No exact match found");
    }

    // 如果没有精确匹配，尝试通配模式：选手对多个战队的态度
    if (!playerPreference) {




        // 检查是否有通配多个战队的设置，例如："2-秋赛季-唐柔-[*]" 表示唐柔对所有战队的态度
        const wildcardTeamKey = `${timeKey}-${playerName}-[*]`;
        console.log("Looking for wildcard key:", wildcardTeamKey);
        playerPreference = negotiationPreferences?.playerToTeam?.[wildcardTeamKey];

        if (playerPreference) {
            console.log("Found wildcard match:", playerPreference);
        } else {
            console.log("No wildcard match found");
        }

        // 如果没有通配所有战队的设置，检查该选手对特定战队列表的态度
        if (!playerPreference) {
            // 查找该选手在该时间段对多个特定战队的设置
            for (const key in negotiationPreferences?.playerToTeam || {}) {
                if (key.startsWith(`${timeKey}-${playerName}-`) && key !== exactPlayerKey) {
                    const keyParts = key.split('-');
                    if (keyParts.length >= 3) {
                        const keyTeam = keyParts.slice(2).join('-'); // 处理战队名中可能包含'-'的情况
                        if (keyTeam === teamName) {
                            playerPreference = negotiationPreferences.playerToTeam[key];
                            break;
                        }
                        // 检查是否是列表格式，如 "2-秋赛季-选手-[战队1,战队2,战队3]"
                        else if (keyTeam.startsWith('[') && keyTeam.endsWith(']')) {
                            const teamsList = keyTeam.substring(1, keyTeam.length - 1).split(',');
                            if (teamsList.includes(teamName)) {
                                playerPreference = negotiationPreferences.playerToTeam[key];
                                break;
                            }
                        }
                        // 检查是否是排除格式，如 "2-秋赛季-选手-[^战队1,战队2]" 表示对除了战队1和战队2之外的所有战队的态度
                        else if (keyTeam.startsWith('[^') && keyTeam.endsWith(']')) {
                            const excludedTeams = keyTeam.substring(2, keyTeam.length - 1).split(',');
                            if (!excludedTeams.includes(teamName)) {
                                playerPreference = negotiationPreferences.playerToTeam[key];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    // 如果精确匹配失败，尝试通配时间匹配
    if (!playerPreference) {
        // 查找所有时间下的该选手对该战队偏好
        for (const key in negotiationPreferences?.playerToTeam || {}) {
            if (key.endsWith(`-${playerName}-${teamName}`)) {
                playerPreference = negotiationPreferences.playerToTeam[key];
                break;
            }
        }
    }

    if (!teamPreference) {
        // 查找所有时间下的该战队对该选手偏好
        for (const key in negotiationPreferences?.teamToPlayer || {}) {
            if (key.endsWith(`-${teamName}-${playerName}`)) {
                teamPreference = negotiationPreferences.teamToPlayer[key];
                break;
            }
        }
    }

    // 返回结果
    const result = {
        playerPreference,
        teamPreference,
        playerBonus: playerPreference?.successBonus ?? 0,
        teamBonus: teamPreference?.successBonus ?? 0,
        playerDialogue: playerPreference?.dialogue || "",
        teamDialogue: teamPreference?.dialogue || "",
        isRandomPreference: false,
        randomPlayerValue: 0,
        randomTeamValue: 0
    };
    
    // 如果没有预置偏好，为选手和战队双方分别生成随机值（-10到10之间），但保留基于匹配情况的对话
    if (!result.playerPreference) {
        result.isRandomPreference = true;
        result.randomPlayerValue = Math.floor(Math.random() * 21) - 10; // -10到10
        // 保留基于匹配情况的对话，只添加随机成功率
        result.playerPreference = { successBonus: result.randomPlayerValue, dialogue: result.playerDialogue || "" };
        result.playerBonus = result.randomPlayerValue;
    }
    if (!result.teamPreference) {
        result.isRandomPreference = true;
        result.randomTeamValue = Math.floor(Math.random() * 21) - 10; // -10到10
        // 保留基于匹配情况的对话，只添加随机成功率
        result.teamPreference = { successBonus: result.randomTeamValue, dialogue: result.teamDialogue || "" };
        result.teamBonus = result.randomTeamValue;
    }

    console.log("getNegotiationPreference returning:", result);

    return result;
}


// 显示协商详情
// 显示协商详情
function showNegotiationDetail(commissionId) {
    const commission = gameData.commissions.find(c => c.id === commissionId);
    if (!commission || !commission.negotiationData) return;

    // 检查是否超过协商截止日期
    if (compareTimes(gameData.time, commission.negotiationDeadline) > 0) {
        handleCommissionFailure(commission, 'negotiation_timeout');
        negotiationDetailModal.style.display = 'none';
        return;
    }

    const negotiationData = commission.negotiationData;
    const player = gameData.players.find(p => p.name === commission.assignedPlayer);

    // ✅ 直接使用已存数据，不再重新计算偏好！
    let requirementComparisonHTML = '';
    let willingnessSectionHTML = '';

    if (player) {
        // 定义等级顺序
        const levelOrder = ['D', 'C', 'B', 'B+', 'A', 'A+', 'S'];
        const playerLevelIndex = levelOrder.indexOf(player.级别);
        const requiredLevelIndex = levelOrder.indexOf(commission.playerReq.级别);

        const jobMatch = player.职业 === commission.playerReq.职业;
        const levelMatch = playerLevelIndex >= requiredLevelIndex; // 改为大于等于
        const fullyMatched = jobMatch && levelMatch;

        // 判断等级匹配状态
        let levelMatchText = levelMatch ? '✅' : '❌';
        let levelColor = '#22c55e'; // 默认匹配颜色

        if (playerLevelIndex > requiredLevelIndex) {
            levelMatchText = '⭐ 优于需求';
            levelColor = '#10b981'; // 优于需求的深绿色
        } else if (playerLevelIndex === requiredLevelIndex) {
            levelMatchText = '✅';
            levelColor = '#22c55e'; // 刚好符合的浅绿色
        } else {
            levelMatchText = '❌';
            levelColor = '#f56565'; // 不足的红色
        }

        requirementComparisonHTML = `
            <div class="detail-section">
                <h3>🎯 招募要求</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem; margin-top: 0.5rem;">
                    <div style="background-color: #f8fafc; padding: 0.6rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 0.85rem; color: #64748b;">职业要求</div>
                        <div style="font-size: 0.95rem; font-weight: 600; color: ${jobMatch ? '#22c55e' : '#f56565'};">
                            ${commission.playerReq.职业} ${jobMatch ? '✅' : '❌'}
                        </div>
                    </div>
                    <div style="background-color: #f8fafc; padding: 0.6rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 0.85rem; color: #64748b;">级别要求</div>
                        <div style="font-size: 0.95rem; font-weight: 600; color: ${levelColor};">
                            ${commission.playerReq.级别} ${levelMatchText}
                        </div>
                    </div>
                </div>
                <div style="margin-top: 0.8rem; padding: 0.6rem; background-color: ${fullyMatched ? '#dcfce7' : '#fee2e2'}; border-radius: 6px;">
                    <strong style="color: ${fullyMatched ? '#166534' : '#dc2626'};">
                        ${fullyMatched ? '🟢 完全符合要求' : '🔴 不符合要求'}
                    </strong>
                    ${playerLevelIndex > requiredLevelIndex ?
                '<div style="margin-top: 0.3rem; font-size: 0.85rem; color: #10b981;">⭐ 选手等级优于要求，成功率不受等级影响</div>' : ''}
                </div>
            </div>
        `;

        // ✅ 直接从 negotiationData 读取，不再查 preferences！
        const totalPreferenceBonus = negotiationData.preferenceBonus || 0;
        const playerMood = negotiationData.playerMood || 'neutral';
        const teamMood = negotiationData.teamMood || 'neutral';
        // const playerDialogue = negotiationData.playerDialogue || "可以考虑一下……";
        // const teamDialogue = negotiationData.teamDialogue || "也许是个机会……";


        // 如果是随机偏好且没有对话，使用基于匹配情况的默认对话
        let playerDialogue;
        let teamDialogue;
        
        if (negotiationData.isRandomPreference) {
            // 如果是随机偏好，使用匹配情况生成的对话
            playerDialogue = negotiationData.playerDialogue || getRandomPlayerDialogue(
                player, commission, jobMatch, levelMatch, playerLevelIndex, requiredLevelIndex
            );
            teamDialogue = negotiationData.teamDialogue || getRandomTeamDialogue(
                player, commission, jobMatch, levelMatch, playerLevelIndex, requiredLevelIndex
            );
        } else {
            // 如果不是随机偏好（有预设偏好），使用预设对话
            playerDialogue = negotiationData.playerDialogue || getRandomPlayerDialogue(
                player, commission, jobMatch, levelMatch, playerLevelIndex, requiredLevelIndex
            );
            teamDialogue = negotiationData.teamDialogue || getRandomTeamDialogue(
                player, commission, jobMatch, levelMatch, playerLevelIndex, requiredLevelIndex
            );
        }
        
        // 获取随机偏好相关信息
        const isRandomPreference = negotiationData.isRandomPreference || false;
        
        // 如果是随机偏好，修改对话文本以包含偏好值
        let modifiedTeamDialogue = teamDialogue;
        let modifiedPlayerDialogue = playerDialogue;
        
        if (isRandomPreference) {
            const randomPlayerValue = negotiationData.randomPlayerValue || 0;
            const randomTeamValue = negotiationData.randomTeamValue || 0;
            modifiedTeamDialogue = teamDialogue + `（偏好${randomTeamValue >= 0 ? '+' : ''}${randomTeamValue}）`;
            modifiedPlayerDialogue = playerDialogue + `（偏好${randomPlayerValue >= 0 ? '+' : ''}${randomPlayerValue}）`;
        }
        
        // 随机偏好提示
        const randomPreferenceNote = isRandomPreference ? `<div style="margin-top: 0.5rem; padding: 0.5rem; background-color: #fffbeb; border-radius: 6px; border-left: 3px solid #f59e0b; font-size: 0.8rem; color: #92400e;"><strong>🎲 随机偏好：</strong>选手偏好增加 ${negotiationData.randomPlayerValue || 0}%，战队偏好增加 ${negotiationData.randomTeamValue || 0}%</div>` : '';
        
        console.log("=== showNegotiationDetail 调试信息 ===");
        console.log("isRandomPreference:", isRandomPreference);
        console.log("playerDialogue:", playerDialogue);
        console.log("teamDialogue:", teamDialogue);
        console.log("modifiedPlayerDialogue:", modifiedPlayerDialogue);
        console.log("modifiedTeamDialogue:", modifiedTeamDialogue);
        console.log("randomPlayerValue:", negotiationData.randomPlayerValue);
        console.log("randomTeamValue:", negotiationData.randomTeamValue);



        willingnessSectionHTML = `
            <div class="detail-section">
                <h3>💬 双方意愿（影响成功率 ${totalPreferenceBonus >= 0 ? '+' : ''}${totalPreferenceBonus}%）${isRandomPreference ? '<span style="color: #f97316; font-size: 0.8rem;">（随机偏好）</span>' : ''}</h3>
                <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 0.5rem;">
                    <div style="padding: 0.6rem; background-color: ${teamMood === 'positive' ? '#dcfce7' : teamMood === 'negative' ? '#fee2e2' : '#f1f5f9'}; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                            <span style="font-weight: bold;">${commission.team}</span>
                            <span style="color: ${teamMood === 'positive' ? '#166534' : teamMood === 'negative' ? '#dc2626' : '#64748b'};">
                                ${teamMood === 'positive' ? '满意 😊' :
                teamMood === 'negative' ? '不满意 😠' : '无特别倾向'}
                            </span>
                        </div>
                        <p style="margin: 0; font-style: italic;">${modifiedTeamDialogue}</p>
                    </div>
                    <div style="padding: 0.6rem; background-color: ${playerMood === 'positive' ? '#dcfce7' : playerMood === 'negative' ? '#fee2e2' : '#f1f5f9'}; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                            <span style="font-weight: bold;">${player.name}</span>
                            <span style="color: ${playerMood === 'positive' ? '#166534' : playerMood === 'negative' ? '#dc2626' : '#64748b'};">
                                ${playerMood === 'positive' ? '非常想去 💫' :
                playerMood === 'negative' ? '不愿加入 🙅' : '持观望态度'}
                            </span>
                        </div>
                        <p style="margin: 0; font-style: italic;">${modifiedPlayerDialogue}</p>
                    </div>
                </div>
                ${totalPreferenceBonus !== 0 ?
                `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: ${totalPreferenceBonus > 0 ? '#22c55e' : '#f56565'};">
                        💡 偏好影响：${totalPreferenceBonus > 0 ? '+' : ''}${totalPreferenceBonus}% 成功率
                    </div>` : ''}
                ${randomPreferenceNote}
            </div>
        `;
    }

    // ✅ 重新计算成功率：只加要素，不重算基础值
    let totalFactorBonus = 0;
    for (const factorId of negotiationData.completedFactors || []) {
        const factor = negotiationFactorsConfig.find(f => f.id === factorId);
        if (factor) totalFactorBonus += factor.successIncrease;
    }

    const recalculatedSuccess = Math.min(100,
        (negotiationData.baseSuccessRate || negotiationData.successRate - totalFactorBonus) + totalFactorBonus
    );

    negotiationData.successRate = recalculatedSuccess;

    // 更新总点数（属性提升）
    const attributes = gameData.agent.attributes;
    const currentTotalPoints = attributes.谈判技巧 + attributes.社交能力 + attributes.魅力 + attributes.声望;
    if (currentTotalPoints > negotiationData.totalPoints) {
        negotiationData.totalPoints = currentTotalPoints;
    }

    // 生成要素 HTML
    const factorsHTML = negotiationFactorsConfig.map(factor => `
        <div class="factor-item ${factor.id}-factor" 
             data-factor="${factor.id}" 
             data-cost="通用点数" 
             data-cost-value="${factor.cost}" 
             data-success="${factor.successIncrease}">
            <div class="factor-icon">${factor.icon}</div>
            <div class="factor-content">
                <h4>${factor.name}</h4>
                <p class="factor-desc">${factor.desc}</p>
                <div class="factor-cost">
                    <span class="cost-points">💰 ${factor.cost}点</span>
                    <span class="success-bonus">🎯 +${factor.successIncrease}%成功率</span>
                </div>
            </div>
            <button class="btn btn-primary factor-btn">开始谈判</button>
        </div>
    `).join('');

    const detail = document.getElementById('negotiationDetail');
    if (!detail) return;

    detail.innerHTML = `
    <div class="detail-section">
        <h3>协商基本信息</h3>
        <div class="detail-row">
            <strong>委托战队:</strong>
            <span>${commission.team}</span>
        </div>
        <div class="detail-row">
            <strong>意向选手:</strong>
            <span>${commission.assignedPlayer}</span>
        </div>
        <div class="detail-row">
            <strong>保证金:</strong>
            <span>${commission.deposit}元</span>
        </div>
        <div class="detail-row">
            <strong>协商截止:</strong>
            <span>${commission.negotiationDeadline.year}年 ${commission.negotiationDeadline.season} 第${commission.negotiationDeadline.day}天</span>
        </div>
    </div>
    ${requirementComparisonHTML}
    ${willingnessSectionHTML}

 <div class="detail-section">
    <h3>协商进度</h3>
    <div class="detail-row">
        <strong>成功率:</strong>
        <span>${negotiationData.successRate < 0 ? 0 : negotiationData.successRate}%</span>
    </div>
    <div class="attribute-bar">
        <div class="attribute-fill" style="width: ${Math.max(0, negotiationData.successRate)}%;">
            <span class="progress-text">${negotiationData.successRate < 0 ? 0 : negotiationData.successRate}%</span>
        </div>
    </div>
    <div class="detail-row">
        <strong>剩余点数:</strong>
        <span>${negotiationData.totalPoints - negotiationData.usedPoints}/${negotiationData.totalPoints}</span>
        <span style="font-size: 0.8rem; color: #666; margin-left: 0.5rem;">
            (总点数会随属性提升而增加)
        </span>
    </div>
</div>
    
    <div class="detail-section">
        <h3>🗂️ 协商要素</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">
            消耗<span style="color: #8b5cf6; font-weight: bold;">通用点数</span>提升成功率（通用点数 = 谈判技巧+社交能力+魅力+声望）
        </p>
        <div class="negotiation-factors three-columns">
            ${factorsHTML}
        </div>
    </div>
    
    <div class="detail-section" style="text-align: center;">
        <button class="btn btn-primary" onclick="finalizeNegotiation('${commission.id}')">提交协商（能量-3）</button>
    </div>
    `;

    // 绑定要素按钮事件
    detail.querySelectorAll('.factor-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const factorItem = this.closest('.factor-item');
            const factor = factorItem.dataset.factor;
            const costValue = parseInt(factorItem.dataset.costValue);
            const successIncrease = parseInt(factorItem.dataset.success);
            const factorConfig = negotiationFactorsConfig.find(f => f.id === factor);
            if (factorConfig) {
                negotiateFactor(commissionId, factor, costValue, successIncrease);
            }
        });
    });

    negotiationDetailModal.style.display = 'flex';
}







// 添加获取随机选手对话的函数
function getRandomPlayerDialogue(player, commission, jobMatch, levelMatch, playerLevelIndex, requiredLevelIndex) {
    const playerName = player.name;
    const newJob = commission.playerReq.职业;
    const oldJob = player.职业;
    const newLevel = commission.playerReq.级别;
    const playerLevel = player.级别;

    // 根据匹配情况选择对话类型
    if (!jobMatch && levelMatch) {
        // 转职业但等级匹配
        const dialogues = [
            `"我做了这么多年${oldJob}，现在要转${newJob}？这...我需要好好考虑。"`,
            `"${newJob}？有意思，其实我私下练习过这个职业。"`,
            `"转职业风险不小啊...但如果是${commission.team}的话，也许值得一试？"`,
            `"${newJob}？早就想试试了！只是怕战队不同意，这下机会来了！"`,
            `"从${oldJob}转${newJob}？这跨度有点大，我得慎重考虑..."`,
            `"如果战队能提供专门的转职训练，我愿意尝试${newJob}。"`,
            `"哈哈，我其实一直偷偷练着${newJob}的小号，这下可以光明正大用了！"`
        ];
        return dialogues[Math.floor(Math.random() * dialogues.length)];
    }

    if (jobMatch && !levelMatch) {
        // 同职业但等级不够
        const levelDiff = requiredLevelIndex - playerLevelIndex;
        if (levelDiff === 1) {
            const dialogues = [
                `"我只是${playerLevel}级${oldJob}，他们想要${newLevel}级...我能胜任吗？"`,
                `"等级差距不大，我相信只要努力训练就能达到要求！"`,
                `"虽然现在只是${playerLevel}级，但我一直在进步，给我机会证明自己！"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        } else {
            const dialogues = [
                `"他们想要${newLevel}级${newJob}，可我只有${playerLevel}级...这差距有点大啊。"`,
                `"我知道自己现在还不够格，但如果有机会，我会加倍努力！"`,
                `"从${playerLevel}级到${newLevel}级...这是个巨大的挑战，我需要勇气。"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        }
    }

    if (!jobMatch && !levelMatch) {
        // 既转职业又等级不够
        const dialogues = [
            `"转${newJob}？而且要从${playerLevel}级努力到${newLevel}级？这太难了..."`,
            `"同时面对转职业和升级的双重挑战，我需要好好想想。"`,
            `"这要求有点高啊...既要换职业，又要提升等级，我得评估自己的能力。"`
        ];
        return dialogues[Math.floor(Math.random() * dialogues.length)];
    }

    if (jobMatch && levelMatch) {
        // 完美匹配
        if (playerLevelIndex > requiredLevelIndex) {
            // 优于要求
            const dialogues = [
                `"${newLevel}级${newJob}？完全没问题！我早就达到这个水平了！"`,
                `"他们需要${newLevel}级？我可是${playerLevel}级，绰绰有余！"`,
                `"终于有战队发现我的价值了！我的实力远超${newLevel}级！"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        } else {
            // 刚好匹配
            const dialogues = [
                `"完美匹配！我就是他们要找的${newLevel}级${newJob}！"`,
                `"这简直是量身定做的机会！我的${newJob}水平正好符合要求！"`,
                `"太棒了！我的职业和等级都完全符合${commission.team}的需求！"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        }
    }

    // 默认对话
    const defaultDialogues = [
        `"我需要时间考虑这个机会..."`,
        `"让我好好想想..."`,
        `"这是个重要的决定，不能草率。"`
    ];
    return defaultDialogues[Math.floor(Math.random() * defaultDialogues.length)];
}

// 添加获取随机战队对话的函数
function getRandomTeamDialogue(player, commission, jobMatch, levelMatch, playerLevelIndex, requiredLevelIndex) {
    const playerName = player.name;
    const newJob = commission.playerReq.职业;
    const oldJob = player.职业;
    const newLevel = commission.playerReq.级别;
    const playerLevel = player.级别;

    // 根据匹配情况选择对话类型
    if (!jobMatch) {
        // 职业不匹配
        const dialogues = [
            `"我们想要的是${newJob}，经纪人却推荐${oldJob}选手${playerName}...这是什么操作？"`,
            `"${playerName}虽然是优秀选手，但他是打${oldJob}的，我们要的是${newJob}啊。"`,
            `"让${oldJob}选手转${newJob}？这风险是不是太大了？"`,
            `"如果${playerName}愿意转型${newJob}，也许可以考虑..."`,
            `"职业不符啊...除非他有转职业的强烈意愿和潜力。"`
        ];
        return dialogues[Math.floor(Math.random() * dialogues.length)];
    }

    if (!levelMatch) {
        // 等级不够
        const levelDiff = requiredLevelIndex - playerLevelIndex;
        if (levelDiff === 1) {
            const dialogues = [
                `"我们需要${newLevel}级，${playerName}是${playerLevel}级...差一点点，但也许可以培养？"`,
                `"${playerName}离${newLevel}级只差一步，有培养价值。"`,
                `"等级要求${newLevel}级，他是${playerLevel}级...勉强接受吧。"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        } else {
            const dialogues = [
                `"我们要的是${newLevel}级${newJob}，${playerName}只有${playerLevel}级，差距太大了！"`,
                `"${playerLevel}级？这和我们要求的${newLevel}级差距不小啊..."`,
                `"等级差距明显，除非他有特别突出的潜力..."`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        }
    }

    if (jobMatch && levelMatch) {
        // 完美匹配
        if (playerLevelIndex > requiredLevelIndex) {
            // 优于要求
            const dialogues = [
                `"太好了！${playerName}是${playerLevel}级${newJob}，远超我们${newLevel}级的要求！"`,
                `"完美！这正是我们想要的人才，而且比预期的还要优秀！"`,
                `"${playerLevel}级${newJob}！比我们要求的${newLevel}级还要好，太棒了！"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        } else {
            // 刚好匹配
            const dialogues = [
                `"职业${newJob}、等级${newLevel}级，完全符合我们的招募要求！"`,
                `"正是我们需要的${newLevel}级${newJob}选手，专业对口！"`,
                `"要求是${newLevel}级${newJob}，${playerName}正好匹配，可以考虑！"`
            ];
            return dialogues[Math.floor(Math.random() * dialogues.length)];
        }
    }

    if (!jobMatch && !levelMatch) {
        // 两者都不匹配
        const dialogues = [
            `"职业不对，等级也不够...为什么要推荐${playerName}？"`,
            `"既不是${newJob}，也不是${newLevel}级，这个推荐让我们困惑。"`,
            `"${oldJob}选手，${playerLevel}级，这和我们的${newLevel}级${newJob}要求差距太大了。"`
        ];
        return dialogues[Math.floor(Math.random() * dialogues.length)];
    }

    // 默认对话
    const defaultDialogues = [
        `"我们会认真考虑这个推荐的..."`,
        `"需要内部讨论一下..."`,
        `"先看看选手的详细资料再做决定。"`
    ];
    return defaultDialogues[Math.floor(Math.random() * defaultDialogues.length)];
}


// 协商要素处理
// 协商要素处理 - 修改为只接收必要的参数
function negotiateFactor(commissionId, factor, costValue, successIncrease) {
    const commission = gameData.commissions.find(c => c.id === commissionId);
    if (!commission) return;

    const negotiationData = commission.negotiationData;

    // 检查能量是否足够（新增）
    if (gameData.agent.energy < 1) {
        Swal.fire({
            title: '能量不足',
            html: `
                <div style="text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">⚡</div>
                    <div style="font-size: 0.9rem;">
                        <p>能量不足，无法进行协商！</p>
                        <div style="margin: 10px 0; padding: 8px; background-color: #fef2f2; border-radius: 6px;">
                            <p style="margin: 0; color: #dc2626;">
                                <strong>需要能量：</strong>1点
                            </p>
                            <p style="margin: 5px 0 0 0; color: #6b7280;">
                                <strong>当前能量：</strong>${gameData.agent.energy}点
                            </p>
                        </div>
                        <div style="margin-top: 15px; font-size: 0.8rem; color: #6b7280;">
                            <p>💡 提示：休息可以恢复能量</p>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '知道了',
            confirmButtonColor: '#6b7280',
            width: '320px'
        });
        return;
    }

    // 重新计算总点数（使用当前属性值）
    const attributes = gameData.agent.attributes;
    const currentTotalPoints = attributes.谈判技巧 + attributes.社交能力 + attributes.魅力 + attributes.声望;

    // 如果总点数增加了，更新总点数
    if (currentTotalPoints > negotiationData.totalPoints) {
        negotiationData.totalPoints = currentTotalPoints;
    }

    if (negotiationData.totalPoints - negotiationData.usedPoints < costValue) {
        // 点数不足提示
        Swal.fire({
            title: '点数不足',
            html: `
                <div style="text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">💰</div>
                    <div style="font-size: 0.9rem;">
                        <p>通用点数不足！</p>
                        <div style="margin: 10px 0; padding: 8px; background-color: #fef2f2; border-radius: 6px;">
                            <p style="margin: 0; color: #dc2626;">
                                <strong>需要点数：</strong>${costValue}点
                            </p>
                            <p style="margin: 5px 0 0 0; color: #6b7280;">
                                <strong>当前剩余：</strong>${negotiationData.totalPoints - negotiationData.usedPoints}点
                            </p>
                        </div>
                        <div style="margin-top: 15px; font-size: 0.8rem; color: #6b7280;">
                            <p>💡 提示：提升任意属性都可以增加总点数</p>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '知道了',
            confirmButtonColor: '#6b7280',
            width: '320px'
        });
        return;
    }

    // 执行协商（消耗1点能量）
    gameData.agent.energy -= 1;
    negotiationData.usedPoints += costValue;
    negotiationData.successRate = Math.min(100, negotiationData.successRate + successIncrease);

    // 获取要素名称用于显示
    const factorConfig = negotiationFactorsConfig.find(f => f.id === factor);
    const factorName = factorConfig ? factorConfig.name : factor;

    // 显示协商成功弹窗
    Swal.fire({
        title: '协商成功',
        html: `
            <div style="text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
                <div style="font-size: 0.9rem;">
                    <p>成功进行<strong style="color: #4f46e5;">${factorName}</strong>协商！</p>
                    <div style="margin: 10px 0; padding: 8px; background-color: #f0f9ff; border-radius: 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <span style="color: #64748b;">消耗点数：</span>
                            <span style="font-weight: bold; color: #f97316;">${costValue}点</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <span style="color: #64748b;">消耗能量：</span>
                            <span style="font-weight: bold; color: #f97316;">1点</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #64748b;">成功率提升：</span>
                            <span style="font-weight: bold; color: #22c55e;">+${successIncrease}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                            <span style="color: #64748b;">当前成功率：</span>
                            <span style="font-weight: bold; color: #4f46e5;">${negotiationData.successRate < 0 ? 0 : negotiationData.successRate}%</span>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 0.8rem;">
                            <strong>剩余点数：</strong>
                            ${negotiationData.totalPoints - negotiationData.usedPoints} / ${negotiationData.totalPoints}
                        </p>
                        <p style="color: #6b7280; font-size: 0.8rem;">
                            <strong>剩余能量：</strong>
                            ${gameData.agent.energy} / 10
                        </p>
                    </div>
                </div>
            </div>
        `,
        confirmButtonText: '继续协商',
        confirmButtonColor: '#4CAF50',
        width: '280px'
    }).then(() => {
        // 更新状态栏显示能量
        updateStatusBar();
        // 刷新协商详情界面
        showNegotiationDetail(commissionId);
    });
}

// 1. 在handleCommissionFailure函数中统一处理所有失败逻辑
function handleCommissionFailure(commission, reason) {
    if (!commission || commission.status === 'failed' || commission.status === 'expired') {
        return;
    }

    const oldStatus = commission.status;
    commission.status = 'failed';

    // 添加失败信息到委托对象本身
    commission.failureReason = reason;
    commission.failureTime = { ...gameData.time };

    // 减少声望（无论哪种失败都减声望）
    gameData.agent.attributes.声望 -= 30;
    // // 确保声望不低于0
    // if (gameData.agent.attributes.声望 < 0) {
    //     gameData.agent.attributes.声望 = 0;
    // }

    // 注意：这里不要扣钱！接受委托时已经支付了保证金

    // 只需要显示失败信息
    let failureMessage = '';
    if (reason === 'negotiation_timeout') {
        failureMessage = `协商超时，委托失败，保证金${commission.deposit}元不予退还，声望-30`;
    } else if (reason === 'transfer_period_end') {
        failureMessage = `转会期结束未完成，委托失败，保证金${commission.deposit}元不予退还，声望-30`;
    } else if (reason === 'negotiation_failed') {
        failureMessage = `协商失败，保证金${commission.deposit}元不予退还，声望-30`;
    } else if (reason === 'player_rejected') {
        failureMessage = `选手拒绝转会，委托失败，保证金${commission.deposit}元不予退还，声望-30`;
    }

    //alert(failureMessage);
    console.log(failureMessage);
    showToast(failureMessage, 'error');

    // 生成失败新闻
    addCommissionExpiredNews(commission, 'negotiation');

    // 更新界面
    renderCommissionPage();
    updateStatusBar();
    // 如果有协商页面也需要更新
    if (document.getElementById('negotiationContent')) {
        renderNegotiationPage();
    }
}

// 2. 在finalizeNegotiation中调用统一函数
// 最终化协商
// 最终化协商
const processingCommissions = new Set(); // 用于跟踪正在处理的委托

function finalizeNegotiation(commissionId) {
    // 防止同一委托重复提交
    if (processingCommissions.has(commissionId)) {
        return;
    }
    
    const commission = gameData.commissions.find(c => c.id === commissionId);
    if (!commission) {
        processingCommissions.delete(commissionId); // 移除处理标记
        return;
    }

    // 检查是否有选定的选手
    if (!commission.assignedPlayer) {
        showToast('未选择选手，无法进行协商！', 'warning');
        processingCommissions.delete(commissionId); // 移除处理标记
        return;
    }

    // 获取选手对象
    const player = gameData.players.find(p => p.name === commission.assignedPlayer);

    // 初始化转会前的状态变量（用于新闻生成）
    let fromTeam = player ? player.team : '';
    let fromRole = player ? player.职业 : '';

    // 检查该选手是否在本季已经转会过
    if (player && hasTransferredInCurrentPeriod(player, gameData.time)) {
        // 选手本季已转会，不能再次转会
        Swal.fire({
            title: '选手无法转会',
            html: `
                <div style="text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">🚫</div>
                    <div style="font-size: 0.9rem;">
                        <p><strong>${player.name}</strong> 在 ${gameData.time.year}年${gameData.time.season}已经转会过了！</p>
                        <div style="margin: 10px 0; padding: 8px; background-color: #fee2e2; border-radius: 6px;">
                            <p style="margin: 0; color: #dc2626;">
                                <strong>联盟规则：</strong>一名选手在同一个转会期内只能转会一次
                            </p>
                        </div>
                        <div style="margin-top: 15px; color: #6b7280; font-size: 0.8rem;">
                            <p>💡 请等待下一个转会期再尝试</p>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '明白了',
            confirmButtonColor: '#6b7280',
            width: '320px'
        }).then(() => {
            // 将委托状态重置为已接受，允许重新选择选手
            commission.status = 'accepted';
            commission.assignedPlayer = null;
            commission.negotiationStartTime = null;
            commission.negotiationData = null;

            // 更新界面
            renderCommissionPage();
            renderNegotiationPage();
            if (negotiationDetailModal.style.display === 'flex') {
                negotiationDetailModal.style.display = 'none';
            }
            
            // 移除处理标记
            processingCommissions.delete(commissionId);
        });
        return;
    }

    // 最低需要 3 点能量（成功/失败都消耗3）
    if (gameData.agent.energy < 3) {
        showToast('能量不足，无法进行协商！', 'warning');
        processingCommissions.delete(commissionId); // 移除处理标记
        return;
    }


    
    const negotiationData = commission.negotiationData;
    const displayRate = negotiationData.successRate;
    let trueSuccessRate = 0;

    // 只有正数才计算平方压缩
    if (displayRate > 50) {
        trueSuccessRate = Math.min(100, (displayRate / 100) ** 2 * 100);
    } else {
        // 负数或0的成功率，真实成功率为0
        trueSuccessRate = 0;
    }
    const randomValue = Math.random() * 100;
    console.log("【调试】显示成功率:", displayRate + "%", "真实成功率:", trueSuccessRate.toFixed(2) + "%", "随机值:", randomValue.toFixed(2));

    if (randomValue <= trueSuccessRate) {
        // ========== 成功逻辑 ==========
        commission.status = 'completed';
        const totalGain = commission.reward + commission.deposit;
        gameData.agent.money += totalGain;
        gameData.agent.attributes.声望 += 10;
        gameData.agent.energy -= 3;
        commission.completedTime = { ...gameData.time };

        // 检查职业是否匹配，如果不匹配则随机调整选手级别
        let levelChangeMessage = '';
        let oldLevel = player.级别; // 保存转会前的级别
        if (player) {
            console.log('调试：检查职业是否匹配', player, commission.playerReq.职业, player.职业);
            if (commission.playerReq.职业 !== player.职业) {
                console.log('调试：职业不匹配，执行级别调整');
                // 定义等级序列，用于调整
                const levelOrder = ['D', 'C', 'B', 'B+', 'A', 'A+', 'S'];

                // 随机决定是升级还是降级（或者保持不变）
                // 60%概率保持不变，25%概率升级，15%概率降级
                const random = Math.random();
                let newLevel = player.级别;

                const currentIndex = levelOrder.indexOf(player.级别);

                if (currentIndex !== -1) {
                    if (random < 0.40 && currentIndex > 0) {
                        // 降级：移动到前一个等级
                        newLevel = levelOrder[currentIndex - 1];
                        levelChangeMessage = `<div style="color: #f44336; font-weight: bold; margin: 5px 0;">⚠️ 职业的变更对选手造成影响，级别下降至 ${newLevel}级</div>`;
                    } else if (random < 0.60 && currentIndex < levelOrder.indexOf('S')) {
                        // 升级：移动到后一个等级（不能超过S级）
                        newLevel = levelOrder[currentIndex + 1];
                        levelChangeMessage = `<div style="color: #4CAF50; font-weight: bold; margin: 5px 0;">💪 职业的变更打开了新思路，选手级别提升至 ${newLevel}级</div>`;
                    } else {
                        levelChangeMessage = `<div style="color: #2196F3; font-weight: bold; margin: 5px 0;">✅ 职业发生变更，但是选手适应能力不错，级别仍保持 ${player.级别}级</div>`;
                    }

                    // 更新选手级别
                    player.级别 = newLevel;

                    // 如果存在currentStage，也更新它
                    if (player.currentStage === player.级别) {
                        player.currentStage = newLevel;
                    }
                }
            }
            else {
                console.log('调试：职业匹配，跳过级别调整');
                console.log('调试：玩家职业为', player.职业, '，委托要求职业为', commission.playerReq.职业);
            }

            // 1. 更新转会前的状态（用于记录）
            fromTeam = player.team;
            fromRole = player.职业; // 这里保存的是调整级别后的职业，如果之前有调整的话

            // 2. 应用新状态（来自委托要求）
            player.team = commission.team;
            player.职业 = commission.playerReq.职业;
            player.transferredByPlayer = true; // 标记由玩家操作

            // 3. 确保 transferHistory 存在（兜底）
            if (!Array.isArray(player.transferHistory)) {
                player.transferHistory = [];
            }

            // 4. 推入本次转会记录
            player.transferHistory.push({
                fromTeam: fromTeam,
                toTeam: commission.team,
                fromRole: fromRole,
                toRole: commission.playerReq.职业,
                fromLevel: oldLevel, // 转会前等级
                toLevel: player.级别, // 转会后等级
                time: { ...gameData.time },
                commissionId: commission.id
            });
        }


        // 生成成功新闻
        // 生成成功新闻 → 统一推送到 publishedNews
        const successNews = {
            id: 'pub_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            type: 'commission',
            time: { ...gameData.time },
            content: `经纪人：<span style="font-weight: bold; color: #10b981;">${gameData.agent.name}</span> 成功为<span style="font-weight: bold; color: #f97316;">${commission.team}</span>战队招募优秀选手 <span style="font-weight: bold; color: #1f51b6ff;">${commission.assignedPlayer}</span>，获得${commission.reward}元报酬，保证金${commission.deposit}元已退还，声望+10。`,
            relatedCommission: commission.id,
            views: Math.floor(Math.random() * 300) + 100,
            likes: Math.floor(Math.random() * 80) + 20,
            comments: Math.floor(Math.random() * 40) + 10,
            publisher: "经纪公会"
        };
        gameData.publishedNews.push(successNews);

        // 生成荣耀观察新闻
        generateGloryObserverNews(player, commission, oldLevel, fromTeam, fromRole);


        renderNegotiationPage();
        renderCommissionPage();
        //renderSquarePage();
        updateStatusBar();
        // renderTeamMap();
        negotiationDetailModal.style.display = 'none';

        // 移除处理标记
        processingCommissions.delete(commissionId);
        
        Swal.fire({
            title: '协商成功！',
            html: `
                <div style="text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">🎉</div>
                    <div style="font-size: 0.9rem;">
                        <p>成功完成委托！</p>
                        <div style="color: #4CAF50; font-weight: bold; margin: 5px 0;">
                            +${commission.reward}元 委托报酬
                        </div>
                        <div style="color: #22c55e; font-weight: bold; margin: 5px 0;">
                            +${commission.deposit}元 保证金退还
                        </div>
                        <div style="color: #8b5cf6; font-weight: bold; margin: 5px 0;">
                            +10 声望
                        </div>
                        ${levelChangeMessage}
                    </div>
                </div>
            `,
            confirmButtonText: '太棒了！',
            confirmButtonColor: '#4CAF50',
            width: '320px'
        });
    } else {
        // ========== 失败逻辑（可重试） ==========
        gameData.agent.energy -= 3;
        updateStatusBar();
        
        // 移除处理标记
        processingCommissions.delete(commissionId);
        
        Swal.fire({
            title: '协商需要更多努力',
            html: `
                <div style="text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">🎯</div>
                    <div style="font-size: 0.9rem;">
                        <p><strong>这次协商没有成功，但还可以继续尝试！</strong></p>
                        <div style="margin: 10px 0; padding: 8px; background-color: #fff7ed; border-radius: 6px;">
                            <p style="margin: 0; color: #dc2626;">
                                <strong>当前成功率：</strong>${displayRate < 0 ? 0 : displayRate}%
                            </p>
                        </div>
                        <div style="margin-top: 15px; color: #6b7280; font-size: 0.8rem;">
                            <p>💡 消耗了 3 能量</p>
                            <p>可以继续提升成功率后再试一次！</p>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '继续努力',
            confirmButtonColor: '#f97316',
            width: '320px'
        });
        // 保持协商状态，可以继续尝试
        showNegotiationDetail(commissionId);
    }
}


// 事件监听 - 重置游戏按钮
restartGameBtn.addEventListener('click', () => {
    if (confirm("确定要重置游戏吗？")) {
        // 清理自动存档
        localStorage.removeItem("glory_manager_autosave");

        // 清理所有存档槽位 (1-9)
        for (let i = 1; i <= 9; i++) {
            localStorage.removeItem("glory_manager_slot_" + i);
        }

        // 重新加载页面
        location.reload();
    }
});

// 标签页切换
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchTab(button.dataset.tab);
    });
});

// 休息按钮
if (restButton) {
    restButton.addEventListener('click', rest);
}

// 关闭模态框
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.style.display = 'none';

        // 清除对话内容
        if (modal.id === 'playerCardModal') {
            currentPlayerDialogue = null;
        }
    });
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';

            // 清除对话内容
            if (modal.id === 'playerCardModal') {
                currentPlayerDialogue = null;
            }
        }
    });
});

// 返回工作室菜单
window.backToOfficeMenu = function () {
    document.querySelectorAll('.office-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.menu-card').forEach(card => {
        card.classList.remove('active');
    });

    const officeMenu = document.querySelector('.office-menu');
    if (officeMenu) {
        officeMenu.classList.remove('hidden');
    }
};

// === 新游戏专用初始化 ===
// 游戏初始化
function initGame000() {
    // alert("001");
    checkAndGenerateCommissionNews();
    // 游戏开始时，如果是夏或冬转会期，检查是否需要生成随机委托
    if (gameData.time.season === "夏转会期" || gameData.time.season === "冬转会期") {
        generateRandomCommissions();
        checkAndGenerateCommissionNews(); // 检查新生成委托的新闻
    }

    addInitialRandomNews();
    updateStatusBar();
    renderSquarePage();
    renderCommissionPage();
    renderNegotiationPage();
    renderOfficePage();

    // 自动为所有选手初始化 transferHistory 数组（如果不存在）
    gameData.players.forEach(player => {
        if (!player.transferHistory) {
            player.transferHistory = [];
        }
    });

    if (!gameData.schedule) {
        gameData.schedule = {
            currentSeasonKey: null,
            matches: []
        };
    }

}



// 初始化全新游戏的数据状态
function initNewGameData() {
    // 🔁 深度克隆初始数据，确保完全干净
    gameData.players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
    gameData.teams = JSON.parse(JSON.stringify(INITIAL_TEAMS));
    gameData.commissions = JSON.parse(JSON.stringify(INITIAL_COMMISSIONS));

    // 时间重置
    gameData.time = { year: 1, season: "冬转会期", day: 1 };

    // 清空动态内容
    gameData.publishedNews = [];
    gameData.negotiations = [];

    // 信件：保留配置，清记录
    gameData.letters.shownLetterIds = [];

    // 赛程系统初始化（你已正确写）
    gameData.seasonSchedule = {
        currentSeasonKey: null,
        matchups: [],
        nextMatchIndex: 0
    };
    gameData.matchHistory = []; // ← 新增：清空所有比赛记录

    // 生成初始内容
    generateRandomCommissions();
    addInitialRandomNews();
    checkAndGenerateCommissionNews();
    checkForLetters();
}

// 2. 统一刷新 UI（无论新游戏 or 读档都用它）
function refreshGameUI() {
    updateStatusBar();
    renderSquarePage();
    renderCommissionPage();
    renderNegotiationPage();
    renderOfficePage();
}

// 3. 启动逻辑 // // 事件监听
// // 事件监听 - 开始游戏按钮
startGameBtn.addEventListener('click', () => {
    const autoSaveString = localStorage.getItem("glory_manager_autosave");

    if (autoSaveString) {
        try {
            const saveData = JSON.parse(autoSaveString);
            if (saveData && gameData) {
                restoreFromAutoSave(saveData); // 恢复动态数据
                console.log("自动存档加载成功");
            }
        } catch (error) {
            console.error("自动存档加载失败:", error);
        }
    } else {
        // 全新游戏：初始化数据
        initNewGameData();
    }

    // 显示界面
    gameCover.style.display = 'none';
    gameMain.style.display = 'block';

    // ✅ 统一刷新 UI（只在这里调用一次）
    refreshGameUI();
});


/**
 * 从自动存档恢复游戏状态
 * @param {Object} saveData - 从 localStorage 解析出的存档对象
 */
function restoreFromAutoSave(saveData) {
    if (!saveData || typeof saveData !== 'object') {
        console.warn("⚠️ 无效存档");
        initNewGameData();
        return;
    }

    // 恢复对象状态
    if (saveData.agent) Object.assign(gameData.agent, saveData.agent);
    if (saveData.time) Object.assign(gameData.time, saveData.time);

    // 恢复数组（深度克隆）
    const clone = arr => Array.isArray(arr) ? JSON.parse(JSON.stringify(arr)) : [];

    gameData.players = clone(saveData.players);
    gameData.teams = clone(saveData.teams);
    gameData.publishedNews = clone(saveData.publishedNews);
    gameData.commissions = clone(saveData.commissions);
    gameData.negotiations = clone(saveData.negotiations);


    // 👇 新增：恢复比赛历史记录
    gameData.matchHistory = clone(saveData.matchHistory); // 自动处理 undefined/null → []

    // 👇 可选但推荐：规范化 transferredPlayerNames 字段（兼容旧存档）
    gameData.matchHistory.forEach(record => {
        if (!Array.isArray(record.transferredPlayerNames)) {
            record.transferredPlayerNames = []; // 统一为空数组，避免后续 .join() 报错
        }
    });

    // 👇 关键修复：恢复 seasonSchedule
    if (saveData.seasonSchedule && typeof saveData.seasonSchedule === 'object') {
        gameData.seasonSchedule = JSON.parse(JSON.stringify(saveData.seasonSchedule));
    } else {
        // 兼容旧存档或缺失情况：初始化默认结构
        gameData.seasonSchedule = {
            currentSeasonKey: null,
            matchups: [],
            nextMatchIndex: 0
        };
    }



    // 恢复信件记录
    if (saveData.letters) {
        gameData.letters.shownLetterIds = clone(saveData.letters.shownLetterIds);
        gameData.letters.generatedLetters = clone(saveData.letters.generatedLetters);
        gameData.letters.generatedStartLetters = clone(saveData.letters.generatedStartLetters);
    }

    // 👇 新增：恢复对话历史
    gameData.dialogueHistory = saveData.dialogueHistory ? JSON.parse(JSON.stringify(saveData.dialogueHistory)) : {};

    // 👇 新增：恢复特殊对话状态
    gameData.specialDialogues = saveData.specialDialogues ? JSON.parse(JSON.stringify(saveData.specialDialogues)) : [];

    // 👇 兼容性处理：确保对话历史键名格式一致
    if (gameData.players && gameData.players.length > 0) {
        // 检查是否需要将 player.name 格式的键转换为 playerName 格式
        const playerNamesMap = {};
        gameData.players.forEach(player => {
            playerNamesMap[player.name] = player.name;
        });

        // 如果需要转换键名格式，可以在这里添加转换逻辑
        // 目前我们统一使用玩家名字作为键名，所以格式应该是一致的
    }

    // 恢复设置
    if (saveData.settings && typeof saveData.settings === 'object') {
        gameData.settings = { ...gameData.settings, ...saveData.settings };
    }

    // 👉 新增：恢复赛季统计数据
    if (saveData.seasonStats && typeof saveData.seasonStats === 'object') {
        gameData.seasonStats = JSON.parse(JSON.stringify(saveData.seasonStats));
    } else {
        // 兼容旧存档：初始化默认结构
        gameData.seasonStats = {
            currentSeasonKey: null,
            seasons: {}
        };
    }

    console.log("✅ 恢复完成，新闻数:", gameData.publishedNews.length, "，比赛记录数:", gameData.matchHistory.length, "，对话历史数:", Object.keys(gameData.dialogueHistory).length);
    console.log("对话历史内容:", gameData.dialogueHistory);
    console.log("赛季统计数据:", gameData.seasonStats);

    // 初始化对话历史系统，确保引用正确
    if (typeof initDialogueHistory === 'function') {
        initDialogueHistory();
    }
}

// 音乐控制功能
function playBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic && gameData.settings.musicEnabled) {
        bgMusic.volume = 0.5; // 设置音量
        bgMusic.play().catch(e => {
            // 自动播放可能被浏览器阻止，需要用户交互后才能播放
            console.log('音频自动播放被阻止，等待用户交互');
        });
    }
}

function toggleMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    const musicIcon = document.getElementById('musicIcon');
    if (bgMusic) {
        if (gameData.settings.musicEnabled) {
            bgMusic.pause();
            gameData.settings.musicEnabled = false;
            console.log('音乐已关闭');
            // 更新图标为静音
            if (musicIcon) musicIcon.textContent = '🔇';
        } else {
            gameData.settings.musicEnabled = true;
            playBackgroundMusic();
            console.log('音乐已开启');
            // 更新图标为播放
            if (musicIcon) musicIcon.textContent = '🔊';
        }
    }
}

// 页面加载完成后开始播放音乐
window.addEventListener('load', function () {
    // 等待一段时间后尝试播放音乐，确保DOM完全加载
    setTimeout(() => {
        playBackgroundMusic();
        updateMusicIcon();

        // 初始化对话历史系统
        if (typeof initDialogueHistory === 'function') {
            initDialogueHistory();
        }
    }, 1000);
});

// 更新音乐图标
function updateMusicIcon() {
    const musicIcon = document.getElementById('musicIcon');
    if (musicIcon) {
        musicIcon.textContent = gameData.settings.musicEnabled ? '🔊' : '🔇';
    }
}

// 为游戏中的主要交互添加音乐播放功能，以便在用户交互后激活音频
document.addEventListener('click', function () {
    playBackgroundMusic();
}, { once: true }); // 只响应第一次点击

// 战队随机发言功能
// 战队随机发言功能
function getTeamRandomStatement(teamName, transferResult) {
    const positiveStatements = [
        `这次签约让我们发现了选手隐藏的闪光点，原来他还有这么多未开发的潜力！`,
        `有时候最适合的拼图就在不经意间找到，这次转会简直是天作之合！`,
        `选手的到来不仅补强了阵容，更给我们带来了全新的战术灵感！`,
        `惊喜地发现选手的独特风格完美契合我们的体系，这种化学反应太美妙了！`,
        `原本只是常规补强，没想到却挖掘出了一块真正的瑰宝！`
    ];

    const neutralStatements = [
        `发现了一个恰好是我们需要的人选，这次签约感觉很对路！`,
        `选手的特点正好符合我们当前的需求，期待他填补阵容的空缺！`,
        `转会窗里看了很多人，最终选择了最匹配我们战术思路的这位！`,
        `经过仔细评估，这位选手确实是我们当前最合适的选择！`,
        `签下了一个能够立即为我们提供所需能力的选手！`
    ];

    const negativeStatements = [
        `说实话，我们也不知道为啥最后签了这个，可能是会议室空调太舒服？`,
        `经理说‘总得签个人吧’，于是...就这样了。`,
        `签约那天大家都在神游，回过神来已经官宣了...`,
        `大概是转会截止日快到了，闭着眼睛选了一个？`,
        `这个决定做得比点外卖还随意，希望不要后悔...`
    ];

    let statements;
    if (transferResult === 'upgrade') {
        statements = positiveStatements;
    } else if (transferResult === 'downgrade') {
        statements = negativeStatements;
    } else {
        statements = neutralStatements;
    }

    return statements[Math.floor(Math.random() * statements.length)];
}

// 选手随机发言功能
function getPlayerRandomStatement(transferResult) {
    const positiveStatements = [
        `转会之后我才发现，原来这个位置才是我真正擅长的领域！`,
        `新环境唤醒了我隐藏的潜力，终于找到了最适合自己的打法！`,
        `感谢这次转会，让我遇见了能够完全释放我能力的舞台！`,
        `以前总觉得自己有所欠缺，来到新战队后才明白只是没有在对的地方！`,
        `这次转会是职业生涯的转折点，我终于找到了属于自己的位置！`
    ];

    const neutralStatements = [
        `转会恰好让我来到了一个需要我这种特点的队伍！`,
        `感觉新战队看中的正是我的专长，希望能在这里发挥应有作用！`,
        `这次转会机会来得正好，新队伍的打法风格很适合我！`,
        `了解到新战队需要我这样的选手，所以很快就做出了决定！`,
        `感觉自己的特点能够在新战队找到用武之地！`
    ];

    const negativeStatements = [
        `经纪人说我再不转会就要失业了...我能怎么办？`,
        `大概是昨天训练赛输太多，一气之下就同意转会了。`,
        `旧战队网速太卡，新战队保证有光纤...这是主要原因吗？好像不是。`,
        `签约时我在想晚上吃什么，回过神已经按了手印...`,
        `大概是被经纪人的花言巧语骗了，他说新基地有猫可以撸...`
    ];

    let statements;
    if (transferResult === 'upgrade') {
        statements = positiveStatements;
    } else if (transferResult === 'downgrade') {
        statements = negativeStatements;
    } else {
        statements = neutralStatements;
    }

    return statements[Math.floor(Math.random() * statements.length)];
}

// 计算下一天的时间
function getNextDayTime(currentTime) {
    let nextDay = currentTime.day + 1;
    let nextSeason = currentTime.season;
    let nextYear = currentTime.year;

    // 定义赛季顺序
    const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];

    // 如果日期超过30天，则进入下一赛季
    if (nextDay > 30) {
        nextDay = 1;
        const currentSeasonIndex = seasons.indexOf(currentTime.season);

        if (currentSeasonIndex === seasons.length - 1) {
            // 如果是最后一个赛季（冬转会期），则进入下一年的春赛季
            nextSeason = seasons[0];
            nextYear = currentTime.year + 1;
        } else {
            // 否则进入下一个赛季
            nextSeason = seasons[currentSeasonIndex + 1];
        }
    }

    return {
        year: nextYear,
        season: nextSeason,
        day: nextDay
    };
}

// 生成荣耀观察新闻
// 生成荣耀观察新闻
function generateGloryObserverNews(player, commission, oldLevel, fromTeam, fromRole) {
    const nextDayTime = getNextDayTime(gameData.time);
    const { year, season, day } = nextDayTime;

    // 确定等级变化情况
    let levelChangeType = 'no_change';
    if (player.级别 !== oldLevel) {
        const levelOrder = ['D', 'C', 'B', 'B+', 'A', 'A+', 'S'];
        const oldIndex = levelOrder.indexOf(oldLevel);
        const newIndex = levelOrder.indexOf(player.级别);

        if (newIndex > oldIndex) {
            levelChangeType = 'upgrade';
        } else if (newIndex < oldIndex) {
            levelChangeType = 'downgrade';
        }
    }

    // 生成战队发言
    const teamStatement = getTeamRandomStatement(commission.team, player.name, levelChangeType);

    // 生成选手发言
    const playerStatement = getPlayerRandomStatement(player.name, levelChangeType);

    // 生成新闻内容
    const newsContent = `
        <div style="font-weight: bold; color: #1f2d3d; margin-bottom: 8px;">
            【深度采访🎤】 第<span style="color: #4CAF50; font-weight: bold;">${year}</span>年<span style="color: #2196F3; font-weight: bold;">${season}</span>第<span style="color: #FF9800; font-weight: bold;">${day}</span>天，原<span style="color: #9C27B0; font-weight: bold;">${fromTeam}</span>战队的<span style="color: #E91E63; font-weight: bold;">${fromRole}</span>选手<span style="color: #673AB7; font-weight: bold;">${player.name}</span>，转会至<span style="color: #00BCD4; font-weight: bold;">${commission.team}</span>战队成为<span style="color: #FF5722; font-weight: bold;">${commission.playerReq.职业}</span>选手。职业<span style="color: #795548; font-weight: bold;">${fromRole === commission.playerReq.职业 ? '无变化' : '变化'}</span>，等级由<span style="color: #3F51B5; font-weight: bold;">${oldLevel}</span>级转为<span style="color: #009688; font-weight: bold;">${player.级别}</span>级。
        </div>
        <div style="margin: 8px 0;">
            <span style="font-weight: bold; color: #4CAF50;">${commission.team}战队表示：</span>${teamStatement}
        </div>
        <div style="margin: 8px 0;">
            <span style="font-weight: bold; color: #2196F3;">${player.name}选手表示：</span>${playerStatement}
        </div>
    `;

    // 创建新闻对象
    const gloryObserverNews = {
        id: 'glory-observer-' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: 'news',
        time: nextDayTime, // 使用下一天的时间
        content: newsContent,
        publisher: "荣耀观察",
        views: Math.floor(Math.random() * 300) + 100,
        likes: Math.floor(Math.random() * 80) + 20,
        comments: Math.floor(Math.random() * 40) + 10,
        relatedId: 'glory_observer_transfer_news'
    };

    // 推送新闻到已发布新闻列表
    gameData.publishedNews.push(gloryObserverNews);

    // 生成随机八卦新闻（第二天再发布）
    // 检查选手是否来自荣耀网游，如果是则不生成八卦新闻
    if (fromTeam !== "荣耀网游") {
        console.log("-----生成随机八卦新闻");
        const gossipNews = generateGossipNews(player, commission, oldLevel, fromTeam, fromRole, levelChangeType);
        if (gossipNews) {
            gameData.publishedNews.push(gossipNews);
        }
    }

    //指定八卦新闻
    // 针对特定人员的特殊八卦新闻（张佳乐、孙哲平、魏琛）
    const specialGossipPlayers = ['张佳乐', '孙哲平', '魏琛'];
    if (specialGossipPlayers.includes(player.name)) {
        const specialGossipNews = generateSpecialGossipNews(player, commission, oldLevel, fromTeam, fromRole);
        if (specialGossipNews) {
            gameData.publishedNews.push(specialGossipNews);
        }
    }



}

// 生成八卦新闻（多风格混合）
function generateGossipNews(player, commission, oldLevel, fromTeam, fromRole, levelChangeType) {
    const twoDaysLater = getNextDayTime(getNextDayTime(gameData.time));
    const { year, season, day } = twoDaysLater;

    const hasRoleChange = fromRole !== commission.playerReq.职业;
    const randomNum = Math.random();

    let gossipContent = "";
    let publisher = "";
    let style = "";
    let newsData = {};

    // 随机选择发布人和风格
    const styleChoice = Math.random();

    if (styleChoice < 0.2) {
        // 风格一：专业分析类媒体（20%）
        publisher = "荣耀转会观察周刊";
        style = "professional";
        newsData = {
            title: ["转会深度分析", "交易逻辑解读", "市场观察报告"][Math.floor(Math.random() * 3)],
            color: "#1565c0",
            borderColor: "#0d47a1"
        };
    } else if (styleChoice < 0.4) {
        // 风格二：八卦娱乐类媒体（20%）
        publisher = "荣耀八卦前线";
        style = "gossip";
        newsData = {
            title: ["转会内幕大爆料", "圈内秘闻", "知情人士透露"][Math.floor(Math.random() * 3)],
            color: "#c2185b",
            borderColor: "#880e4f"
        };
    } else if (styleChoice < 0.6) {
        // 风格三：网络热议类（20%）
        publisher = "荣耀玩家论坛·热帖";
        style = "netizen";
        newsData = {
            title: ["网友热议", "粉丝看法", "社区观点"][Math.floor(Math.random() * 3)],
            color: "#f57c00",
            borderColor: "#e65100"
        };
    } else if (styleChoice < 0.8) {
        // 风格四：粉丝反应类（20%）
        publisher = Math.random() < 0.5 ? `${fromTeam}粉丝会刊` : `${commission.team}粉丝前线`;
        style = "fans";
        newsData = {
            title: ["粉丝声音", "支持者看法", "后援会表态"][Math.floor(Math.random() * 3)],
            color: publisher.includes(fromTeam) ? "#d32f2f" : "#388e3c",
            borderColor: publisher.includes(fromTeam) ? "#b71c1c" : "#1b5e20"
        };
    } else {
        // 风格五：战队观察类（20%新增）
        publisher = "荣耀战队观察";
        style = "team-review";
        newsData = {
            title: ["战队操作点评", "管理层决策简析", "俱乐部策略观察"][Math.floor(Math.random() * 3)],
            color: "#5d4037",
            borderColor: "#3e2723"
        };
    }

    // 根据风格生成内容
    if (style === "fans") {
        gossipContent = generateFansReactionContent(player, commission, fromTeam, publisher);
    } else if (style === "team-review") {
        gossipContent = generateTeamReviewContent(player, commission, fromTeam, levelChangeType);
    } else if (hasRoleChange) {
        gossipContent = generateRoleChangeContent(player, commission, fromRole, fromTeam, style);
    } else if (levelChangeType !== 'no_change') {
        gossipContent = generateLevelChangeContent(player, commission, oldLevel, levelChangeType, fromTeam, style);
    } else if (randomNum < 0.95) {
        gossipContent = generateGeneralTransferContent(player, commission, fromTeam, style);
    } else {
        return null; // 不生成新闻
    }

    if (!gossipContent) return null;

    const fullContent = `
        <div style="font-family: ${style === 'netizen' ? "'Microsoft YaHei', sans-serif" : "'SimSun', 'STKaiti', serif"};">
            <div style="margin-bottom: 15px; color: ${newsData.color}; font-weight: bold; font-size: ${style === 'netizen' ? '1.1em' : '1em'}; border-left: 4px solid ${newsData.borderColor}; padding-left: 10px;">
                【${publisher}】${newsData.title}：${player.name}转会${getTitleSuffix(style, levelChangeType)}
            </div>
            ${gossipContent}
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ddd; font-size: 0.85em; color: #777;">               
                <div style="color: #999; font-style: italic;">
                    ${getDisclaimer(style)}
                </div>
            </div>
        </div>
    `;

    return {
        id: 'gossip-news-' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: 'news',
        time: twoDaysLater,
        title: `${publisher}：${player.name}转会引发${getTitleAction(style)}`,
        content: fullContent,
        publisher: publisher,
        views: Math.floor(Math.random() * getViewRange(style)) + 200,
        likes: Math.floor(Math.random() * getLikeRange(style)) + 30,
        comments: Math.floor(Math.random() * getCommentRange(style)) + 20,
        relatedId: 'gossip_transfer_news',
        style: style
    };
}

// 生成粉丝反应内容
function generateFansReactionContent(player, commission, fromTeam, publisher) {
    const isFromTeamFans = publisher.includes(fromTeam);
    const teamName = isFromTeamFans ? fromTeam : commission.team;

    // 粉丝ID生成
    const fanNames = [
        `${teamName}十年老粉`, `${teamName}后援会会长`, `${player.name}真爱粉`,
        `${teamName}的忠实支持者`, `${player.name}个人站站长`, `荣耀老观众`,
        `${teamName}铁杆粉丝`, `${player.name}守护者`, `${teamName}死忠粉`
    ];

    if (isFromTeamFans) {
        // 原战队粉丝反应
        const reactionType = Math.random();

        if (reactionType < 0.3) {
            // 情况1：愤怒派（30%）
            return generateAngryFansReaction(player, commission, fromTeam, fanNames);
        } else if (reactionType < 0.6) {
            // 情况2：哭着挽留派（30%）
            return generateCryingFansReaction(player, commission, fromTeam, fanNames);
        } else if (reactionType < 0.8) {
            // 情况3：理性祝福派（20%）
            return generateBlessingFansReaction(player, commission, fromTeam, fanNames);
        } else {
            // 情况4：复杂情绪派（20%）
            return generateMixedFansReaction(player, commission, fromTeam, fanNames);
        }

    } else {
        // 新战队粉丝反应
        const newTeamReactions = [
            `🎉'热烈欢迎${player.name}加入${commission.team}大家庭！期待你的精彩表现！' ——@${fanNames[0]}`,
            `🤔'这个转会...有点看不懂。${player.name}真的适合我们队的战术体系吗？' ——@${fanNames[1]}`,
            `✨'如果是原位置${fromRole}还能理解，为什么要转${commission.playerReq.职业}？教练组有特殊安排？' ——@${fanNames[2]}`,
            `🔥'不管怎样，欢迎新队友！相信教练组的眼光，${player.name}加油！' ——@${fanNames[3]}`,
            `📈'这笔交易值不值，得看下赛季表现。但至少增强了阵容深度，支持管理层决策！' ——@${fanNames[4]}`,
            `❓'转会费多少啊？希望不是溢价买入...最近战队资金好像有点紧张。' ——@${fanNames[5]}`
        ];

        const selectedReactions = [];
        const numReactions = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numReactions; i++) {
            selectedReactions.push(newTeamReactions[Math.floor(Math.random() * newTeamReactions.length)]);
        }

        // 计算积极和消极比例
        const positivePercent = Math.floor(Math.random() * 40) + 40; // 40-80%

        return `
            <div style="background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <div style="color: #388e3c; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">👏</span>${commission.team}粉丝热议新援${player.name}加盟
                </div>
                <div style="color: #555; line-height: 1.6;">
                    ${selectedReactions.join('<br><br>')}
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #c8e6c9;">
                    <span style="color: #388e3c; font-weight: bold;">粉丝态度统计：</span>
                    在${commission.team}官方论坛的投票中，${positivePercent}%的粉丝表示支持或谨慎乐观，${100 - positivePercent}%的粉丝持保留态度或质疑。
                </div>
            </div>
        `;
    }
}

// 哭着挽留的粉丝反应
function generateCryingFansReaction(player, commission, fromTeam, fanNames) {
    const cryingReactions = [
        `😭'不要走啊${player.name}！从你青训时期就看着你长大，怎么能说走就走...求求你留下来...' ——@${fanNames[2]}`,
        `💔'看到转会消息我哭了一整晚...床头还贴着你${Math.floor(Math.random() * 5) + 3}年前的海报...为什么要离开${fromTeam}...' ——@${fanNames[5]}`,
        `🥺'后援会好多姐妹都哭了...我们准备了${Math.floor(Math.random() * 3) + 1}年的应援物料怎么办...${player.name}能不能再考虑一下...' ——@${fanNames[1]}`,
        `😢'还记得你第一次上场时紧张的样子...现在你也要离开了吗...${fromTeam}没有你就不完整了...' ——@${fanNames[0]}`,
        `💧'翻看着手机里${Math.floor(Math.random() * 100) + 50}张你的照片，眼泪止不住...求求管理层挽留一下吧...' ——@${fanNames[7]}`,
        `🌧️'下雨天收到这个消息更难受了...明明说好要一起拿更多冠军的...为什么要食言...' ——@${fanNames[3]}`,
        `🫂'后援会群里大家都在哭...有人连夜写了挽留信寄到俱乐部...哪怕只有一线希望...' ——@${fanNames[8]}`
    ];

    const signatureActions = [
        `粉丝自发组织了线上挽留活动，已有${Math.floor(Math.random() * 300) + 100}人参与签名请愿。`,
        `后援会连夜制作了'不要走'的应援视频，播放量已破${Math.floor(Math.random() * 5000) + 2000}次。`,
        `${fromTeam}训练基地外聚集了${Math.floor(Math.random() * 50) + 20}名哭泣的粉丝，手持挽留标语。`,
        `社交媒体上#${player.name}不要走#的话题阅读量已达${Math.floor(Math.random() * 10) + 5}万次。`,
        `粉丝们联名给俱乐部管理层写了${Math.floor(Math.random() * 8) + 3}封挽留信，表达不舍之情。`
    ];

    const selectedReactions = [];
    const numReactions = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numReactions; i++) {
        selectedReactions.push(cryingReactions[Math.floor(Math.random() * cryingReactions.length)]);
    }

    const signatureAction = signatureActions[Math.floor(Math.random() * signatureActions.length)];

    return `
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div style="color: #1976d2; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">😭</span>泪别偶像：${fromTeam}粉丝哭求${player.name}留下
            </div>
            <div style="color: #555; line-height: 1.6;">
                ${selectedReactions.join('<br><br>')}
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(25, 118, 210, 0.1); border-radius: 5px; border: 1px solid #90caf9;">
                <span style="color: #1565c0; font-weight: bold;">💙 粉丝行动：</span>
                <span style="color: #555; font-size: 0.95em;">${signatureAction}</span>
            </div>
            <div style="margin-top: 10px; padding: 8px; background: rgba(255, 255, 255, 0.8); border-radius: 4px; font-size: 0.9em; color: #666;">
                <span style="color: #1565c0;">📊 情绪统计：</span>
                在${fromTeam}官方粉丝群中，关于此事的讨论以"不舍"和"挽留"为主，${Math.floor(Math.random() * 40) + 40}%的粉丝表示难以接受。
            </div>
        </div>
    `;
}

// 愤怒粉丝反应
function generateAngryFansReaction(player, commission, fromTeam, fanNames) {
    const angryReactions = [
        `🔥'走了正好！${player.name}最近状态那么差，早该走了！感谢${commission.team}接盘！' ——@${fanNames[0]}`,
        `😡'忘恩负义！在${fromTeam}培养他这么久，说走就走？以后别想回${fromTeam}！' ——@${fanNames[1]}`,
        `💔'虽然不舍，但尊重选手选择。只是希望${player.name}在新战队能对得起${fromTeam}的培养。' ——@${fanNames[2]}`,
        `👋'慢走不送！正好给新人腾位置，${fromTeam}不需要不忠诚的选手！' ——@${fanNames[3]}`,
        `📉'早就该卖了！状态下滑这么厉害，还能卖出这个价，经纪人厉害啊！' ——@${fanNames[4]}`
    ];

    const selectedReactions = [];
    const numReactions = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numReactions; i++) {
        selectedReactions.push(angryReactions[Math.floor(Math.random() * angryReactions.length)]);
    }

    return `
        <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div style="color: #d32f2f; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">💔</span>${fromTeam}粉丝对${player.name}转会反应激烈
            </div>
            <div style="color: #555; line-height: 1.6;">
                ${selectedReactions.join('<br><br>')}
            </div>
            <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #ffcdd2;">
                <span style="color: #d32f2f; font-weight: bold;">后援会统计：</span>
                在${fromTeam}官方粉丝群中，关于此事的讨论已超过${Math.floor(Math.random() * 500) + 300}条，${Math.floor(Math.random() * 70) + 20}%的粉丝表示不满。
            </div>
        </div>
    `;
}

// 理性祝福派
function generateBlessingFansReaction(player, commission, fromTeam, fanNames) {
    const blessingReactions = [
        `🌹'感谢${player.name}为${fromTeam}的付出，祝你在新战队一切顺利！常回来看看！' ——@${fanNames[2]}`,
        `✨'虽然不舍，但尊重你的选择。希望你在${commission.team}能有更好的发展！' ——@${fanNames[5]}`,
        `🤝'职业选手的黄金期有限，支持你去追求更好的平台。${fromTeam}永远是你的家！' ——@${fanNames[0]}`,
        `🎯'为了职业生涯发展，转会也是正常选择。相信你在新战队能继续发光！' ——@${fanNames[3]}`
    ];

    const selectedReactions = [];
    const numReactions = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numReactions; i++) {
        selectedReactions.push(blessingReactions[Math.floor(Math.random() * blessingReactions.length)]);
    }

    return `
        <div style="background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div style="color: #388e3c; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">🤝</span>理性祝福：${fromTeam}粉丝送别${player.name}
            </div>
            <div style="color: #555; line-height: 1.6;">
                ${selectedReactions.join('<br><br>')}
            </div>
            <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #c8e6c9;">
                <span style="color: #388e3c; font-weight: bold;">粉丝态度：</span>
                大多数粉丝虽有不舍，但理解选手的职业选择，以祝福为主。
            </div>
        </div>
    `;
}

// 复杂情绪派
function generateMixedFansReaction(player, commission, fromTeam, fanNames) {
    const mixedReactions = [
        `😢'心情复杂...既想让你留下，又希望你去更好的地方发展...' ——@${fanNames[2]}`,
        `🤔'说不清是生气还是难过...但${player.name}确实为${fromTeam}付出了很多...' ——@${fanNames[0]}`,
        `🎭'后援会里有人哭有人骂，我什么也说不出来，只是默默收起了应援棒...' ——@${fanNames[5]}`,
        `🌀'爱过，怨过，现在只剩祝福。${player.name}加油吧...' ——@${fanNames[7]}`
    ];

    const selectedReactions = [];
    const numReactions = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numReactions; i++) {
        selectedReactions.push(mixedReactions[Math.floor(Math.random() * mixedReactions.length)]);
    }

    return `
        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div style="color: #7b1fa2; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">🌀</span>五味杂陈：${fromTeam}粉丝心情复杂
            </div>
            <div style="color: #555; line-height: 1.6;">
                ${selectedReactions.join('<br><br>')}
            </div>
            <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #ce93d8;">
                <span style="color: #7b1fa2; font-weight: bold;">情绪分布：</span>
                粉丝群体情绪分化明显，${Math.floor(Math.random() * 30) + 20}%愤怒，${Math.floor(Math.random() * 30) + 20}%悲伤，${Math.floor(Math.random() * 40) + 30}%理解祝福。
            </div>
        </div>
    `;
}

// 生成战队点评内容（聚焦原战队）
function generateTeamReviewContent(player, commission, fromTeam, levelChangeType) {
    const team = fromTeam;
    const toTeam = commission.team;
    const playerName = player.name;

    // 简短点评角度
    const reviewAngle = Math.random();

    let analysisContent = "";
    let conclusion = "";

    if (reviewAngle < 0.4) {
        // 角度1：重建策略（40%）
        analysisContent = `
            <div style="margin: 8px 0;">
                <span style="color: #8b4513; font-weight: bold;">▶ </span>
                ${team}正值${Math.random() < 0.5 ? '新老交替' : '战术转型'}期，放走${playerName}是${Math.random() < 0.5 ? '必要调整' : '阵痛过程'}。腾出薪资空间约为${Math.floor(Math.random() * 12) + 8}%。
            </div>
        `;
        conclusion = `${team}管理层展现了${Math.random() < 0.5 ? '长远眼光' : '重建决心'}，但后续引援需跟上。`;

    } else if (reviewAngle < 0.7) {
        // 角度2：价值判断（30%）
        analysisContent = `
            <div style="margin: 8px 0;">
                <span style="color: #2e8b57; font-weight: bold;">▶ </span>
                ${team}在${playerName}价值${Math.random() < 0.5 ? '高点' : '合理区间'}时出手，战队表示并不会影响现有布局，同期仍有${Math.floor(Math.random() * 2) + 1}名同位置替补可用。
            </div>
        `;
        conclusion = `交易时机${Math.random() < 0.5 ? '把握得当' : '尚可接受'}，但需关注${toTeam}的战绩反衬效应。`;

    } else {
        // 角度3：阵容平衡（30%）
        analysisContent = `
            <div style="margin: 8px 0;">
                <span style="color: #4682b4; font-weight: bold;">▶ </span>
                ${team}在${commission.playerReq.职业}位置${Math.random() < 0.5 ? '人员过剩' : '需调整年龄结构'}，此举优化了${Math.random() < 0.5 ? '战术配置' : '轮换体系'}。
            </div>
        `;
        conclusion = `阵容${Math.random() < 0.5 ? '深度略有削弱' : '结构更加合理'}，期待青训补位。`;
    }

    return `
        <div style="background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%); padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #795548;">
            <div style="color: #5d4037; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center;">
                <span style="margin-right: 6px;">🏛️</span>${team}管理层操作评析
            </div>
            
            <div style="color: #555; line-height: 1.5; font-size: 0.95em; margin-bottom: 8px;">
                ${analysisContent}
            </div>
            
            <div style="margin-top: 8px; padding: 6px 8px; background: #fff; border-radius: 4px; border-left: 2px solid #a1887f;">
                <span style="color: #795548; font-weight: bold;">短评：</span>
                <span style="color: #666; font-size: 0.9em;">${conclusion}</span>
            </div>
        </div>
    `;
}

// 生成转职业内容
function generateRoleChangeContent(player, commission, fromRole, fromTeam, style) {
    const contentMap = {
        professional: () => {
            const analyses = [
                `从职业定位分析，${player.name}选手从${fromRole}转型为${commission.playerReq.职业}，涉及战术体系的重大调整。根据联盟数据，类似转型的平均适应期为${Math.floor(Math.random() * 6) + 3}个月，成功率约为${Math.floor(Math.random() * 30) + 25}%。`,
                `专业观点认为，${fromRole}与${commission.playerReq.职业}在技能要求上存在${Math.random() < 0.5 ? '较高' : '一定'}的兼容性。${commission.team}教练组需要为${player.name}设计专门的转型训练计划，预计需要${Math.floor(Math.random() * 300) + 150}小时的专项训练。`,
                `从战队建设角度看，引进转型选手是一把双刃剑。若转型成功，可为战队带来战术多样性；若失败，则可能导致资源浪费。投资回报率预计在${(Math.random() * 0.7 + 0.3).toFixed(1)}:1左右。`
            ];
            return analyses[Math.floor(Math.random() * analyses.length)];
        },
        gossip: () => {
            const gossips = [
                `🔥独家消息！据${fromTeam}内部人士透露，${player.name}其实早就想转型${commission.playerReq.职业}了，只是原战队一直不同意！这次转会可谓是'得偿所愿'！`,
                `💡小道消息：${commission.team}原本没打算让${player.name}转型，是经纪人强烈推荐的！据说经纪人拍胸脯保证'转型必成'，战队才勉强同意！`,
                `🎯圈内传闻：${player.name}的转型其实是'早有预谋'！有人在半年前就看到他在偷偷练习${commission.playerReq.职业}的操作了！这次转会只是顺水推舟！`,
                `🤫内部人士爆料：${commission.team}对这次转型其实信心不足，但架不住经纪人的三寸不烂之舌！'先签下来再说'是战队高层的原话！`
            ];
            return gossips[Math.floor(Math.random() * gossips.length)];
        },
        netizen: () => {
            const netizenComments = [
                `👤网友'荣耀老司机'：'${player.name}从${fromRole}转${commission.playerReq.职业}？这操作我服！坐等打脸或封神！'`,
                `👤网友'专业喷子'：'又见骚操作！经纪人这是把选手当实验品呢？转型失败谁负责？'`,
                `👤网友'理性分析帝'：'从技术特点看，${player.name}确实有打${commission.playerReq.职业}的潜力，但需要时间适应，保守估计半年吧。'`,
                `👤网友'吃瓜群众'：'不管转不转型，我就想知道转会费多少？经纪人赚翻了吧？'`,
                `👤网友'真爱粉'：'支持${player.name}的一切决定！相信他在新位置上也能发光发热！'`
            ];
            const comments = [];
            for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
                comments.push(netizenComments[Math.floor(Math.random() * netizenComments.length)]);
            }
            return comments.join('<br>');
        }
    };

    const header = style === 'professional'
        ? `<div style="color: #2c3e50; margin-bottom: 10px; text-indent: 2em;">`
        : style === 'gossip'
            ? `<div style="color: #7b1fa2; margin-bottom: 10px; font-weight: bold;">`
            : `<div style="color: #e65100; margin-bottom: 10px;">`;

    const content = contentMap[style]();
    const footer = style === 'professional'
        ? `<div style="margin-top: 10px; color: #546e7a; font-size: 0.9em;">分析仅供参考，实际效果以赛场表现为准。</div>`
        : '';

    return `${header}${content}</div>${footer}`;
}

// 生成等级变化内容
function generateLevelChangeContent(player, commission, oldLevel, levelChangeType, fromTeam, style) {
    const isUpgrade = levelChangeType === 'upgrade';

    const contentMap = {
        professional: () => {
            return isUpgrade
                ? `评级调整分析：${player.name}从${oldLevel}级升至${player.级别}级。根据数据模型，此类评级提升通常基于${Math.random() < 0.5 ? '近期表现数据' : '潜在能力评估'}。转会市场上的评级波动属于正常现象，但需关注评级机构的评估标准一致性。`
                : `评级调整分析：${player.name}从${oldLevel}级降至${player.级别}级。评级调整可能基于${Math.random() < 0.5 ? '年龄因素' : '近期状态'}考虑。转会市场中的评级下调往往影响选手商业价值，需关注后续发展。`;
        },
        gossip: () => {
            return isUpgrade
                ? `📈'升级了？据内部人士透露，这次评级提升和经纪人的'强力推荐'密不可分！据说经纪人拿着${player.name}的训练数据到处游说，硬是把评级给'谈'上去了！'`
                : `📉'降级转会？圈内人都惊呆了！据说${fromTeam}的管理层听到这个消息时，差点笑出声来——'居然还有人要？还降级？'`;
        },
        netizen: () => {
            const comments = isUpgrade ? [
                `👤网友'数据控'：'从${oldLevel}到${player.级别}？这跨度有点大啊，数据支撑够吗？'`,
                `👤网友'阴谋论者'：'评级机构是不是收钱了？这升级理由太牵强！'`,
                `👤网友'乐观派'：'支持评级调整！${player.name}本来就值这个价！'`
            ] : [
                `👤网友'毒舌'：'从${oldLevel}降到${player.级别}？这经纪人谈转会谈出倒贴效果了！'`,
                `👤网友'理性党'：'可能是年龄因素，也可能是状态问题，但降级确实影响身价。'`,
                `👤网友'心疼党'：'唉，选手也不容易，希望在新战队能重新证明自己。'`
            ];

            const selectedComments = [];
            for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
                selectedComments.push(comments[Math.floor(Math.random() * comments.length)]);
            }
            return selectedComments.join('<br>');
        }
    };

    const header = style === 'professional'
        ? `<div style="color: #2c3e50; margin-bottom: 10px; text-indent: 2em;">`
        : style === 'gossip'
            ? `<div style="color: #7b1fa2; margin-bottom: 10px; font-weight: bold;">`
            : `<div style="color: #e65100; margin-bottom: 10px;">`;

    const content = contentMap[style]();
    const footer = style === 'professional'
        ? `<div style="margin-top: 10px; color: #546e7a; font-size: 0.9em;">评级标准可能因机构而异。</div>`
        : '';

    return `${header}${content}</div>${footer}`;
}

// 生成常规转会内容
function generateGeneralTransferContent(player, commission, fromTeam, style) {
    const contentMap = {
        professional: () => {
            return `从市场供需角度分析，${player.name}的转会属于${Math.random() < 0.5 ? '合理的人才流动' : '战略性的阵容补强'}。${commission.team}在${commission.playerReq.职业}位置上需要补充${Math.random() < 0.5 ? '经验丰富的老将' : '有潜力的新鲜血液'}，而${player.name}的职业经历恰好符合这一需求。`;
        },
        gossip: () => {
            const gossips = [
                `💸'据可靠消息，这次转会佣金高达${Math.floor(commission.reward * 0.15)}元！经纪人这一单赚得盆满钵满！'`,
                `🤝'内部消息：${fromTeam}其实不想放人，是${player.name}自己坚持要走！据说和教练组有矛盾！'`,
                `🎯'小道消息：${commission.team}盯${player.name}已经很久了，这次终于得手！据说准备了三个月！'`
            ];
            return gossips[Math.floor(Math.random() * gossips.length)];
        },


        netizen: () => {
            const comments = [
                `👤网友'转会专家'：'这笔交易还算合理，双方各取所需。'`,
                `👤网友'战队粉'：'${commission.team}又补强了，下赛季有看头！'`,
                `👤网友'吃瓜群众'：'转会市场越来越热闹了！坐等更多大新闻！'`,
                `👤网友'数据党'：'从数据看，${player.name}确实能提升${commission.team}的中期节奏。'`,
                `👤网友'老观众'：'还记得他去年在${fromTeam}那波五杀吗？希望新队伍别埋没他！'`,
                `👤网友'毒奶王'：'完了，${commission.team}这下阵容太豪华，怕是要一轮游了……'`,
                `👤网友'路人王'：'说实话，这操作有点溢价，但电竞圈不就图个热度？'`,
                `👤网友'青训观察员'：'放走${player.name}，${fromTeam}是不是该考虑提拔新人了？'`,
                `👤网友'理性分析君'：'合同年限和薪资结构才是关键，表面热闹未必稳。'`
            ];
            const selectedComments = [];
            for (let i = 0; i < 2; i++) {
                selectedComments.push(comments[Math.floor(Math.random() * comments.length)]);
            }
            return selectedComments.join('<br>');
        }
    };

    const header = style === 'professional'
        ? `<div style="color: #2c3e50; margin-bottom: 10px; text-indent: 2em;">`
        : style === 'gossip'
            ? `<div style="color: #7b1fa2; margin-bottom: 10px; font-weight: bold;">`
            : `<div style="color: #e65100; margin-bottom: 10px;">`;

    const content = contentMap[style]();

    return `${header}${content}</div>`;
}

// 辅助函数
function getTitleSuffix(style, levelChangeType) {
    const suffixes = {
        'professional': '事件持续发酵',
        'gossip': '引发圈内热议',
        'netizen': '成为社区焦点',
        'fans': '震动粉丝群体',
        'team-review': '背后的战队博弈'
    };
    return suffixes[style] || '事件持续发酵';
}

function getTitleAction(style) {
    const actions = {
        'professional': '专业分析',
        'gossip': '圈内热议',
        'netizen': '网友讨论',
        'fans': '粉丝震动',
        'team-review': '战略分析'
    };
    return actions[style] || '关注';
}

function getViewRange(style) {
    const ranges = {
        'professional': 400,
        'gossip': 600,
        'netizen': 800,
        'fans': 600,
        'team-review': 500
    };
    return ranges[style] || 400;
}

function getLikeRange(style) {
    const ranges = {
        'professional': 80,
        'gossip': 100,
        'netizen': 150,
        'fans': 120,
        'team-review': 90
    };
    return ranges[style] || 80;
}

function getCommentRange(style) {
    const ranges = {
        'professional': 50,
        'gossip': 80,
        'netizen': 100,
        'fans': 80,
        'team-review': 60
    };
    return ranges[style] || 50;
}

function getDisclaimer(style) {
    const disclaimers = {
        professional: "本文基于公开信息分析，不构成任何投资或转会建议。",
        gossip: "本文内容源于小道消息，请读者自行判断真伪，本刊不对消息真实性负责。",
        netizen: "以上为网友个人观点，不代表本论坛立场，请理性讨论。",
        fans: "以上为粉丝个人观点，不代表战队官方立场，请文明表达支持。",
        'team-review': "本刊观点仅代表观察员个人意见，欢迎业界交流探讨。"
    };
    return disclaimers[style] || "以上内容仅供参考。";
}

// 辅助函数：获取战队随机发言（修正bug）
function getTeamRandomStatement(team, playerName, levelChangeType) {
    const statements = {
        upgrade: [
            `"我们非常看好${playerName}的发展潜力，相信他在我们战队会有更好的表现！"`,
            `"这次转会是我们精心策划的结果，${playerName}的到来将大大增强我们的实力。"`,
            `"我们看到了${playerName}身上独特的天赋，相信在我们的培养下，他能达到新的高度。"`,
            `"${playerName}的加入完美契合我们的战术体系，这将是双赢的合作！"`
        ],
        downgrade: [
            `"虽然${playerName}目前状态有所起伏，但我们相信他能找回最佳状态。"`,
            `"我们看中的是${playerName}的潜力和经验，等级不代表一切。"`,
            `"这次转会是基于长远考虑的，我们愿意给${playerName}时间和空间适应新环境。"`,
            `"每个选手都有低谷期，我们有信心帮助${playerName}重回巅峰。"`
        ],
        no_change: [
            `"${playerName}是我们需要的重要拼图，他的到来让战队更加完整。"`,
            `"欢迎${playerName}加入我们的大家庭，期待他未来的精彩表现！"`,
            `"我们相信${playerName}能快速融入战队，发挥出应有的水平。"`,
            `"这次转会经过深思熟虑，${playerName}的加盟将提升战队整体实力。"`
        ]
    };

    const category = statements[levelChangeType] || statements.no_change;
    return category[Math.floor(Math.random() * category.length)];
}

// ====================
// 小账本功能
// ====================

// 初始化小账本标签页切换
function initBorrowingBookTabs() {
    const tabs = document.querySelectorAll('.borrowing-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.borrowing-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 添加当前active
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById(tabName)?.classList.add('active');
            
            // 渲染对应数据
            if (tabName === 'commission-income') {
                renderCommissionIncome();
            } else if (tabName === 'match-dividend') {
                renderMatchDividend();
            }
        });
    });
}

// 渲染委托金清单
function renderCommissionIncome() {
    const listEl = document.getElementById('commissionIncomeList');
    const totalIncomeEl = document.getElementById('totalCommissionIncome');
    const totalCountEl = document.getElementById('totalCommissionCount');
    
    if (!listEl) return;
    
    // 获取所有已完成的委托
    const completedCommissions = gameData.commissions.filter(c => c.status === 'completed');
    
    if (completedCommissions.length === 0) {
        listEl.innerHTML = '<div class="empty-message">暂无委托收入记录</div>';
        if (totalIncomeEl) totalIncomeEl.textContent = '0';
        if (totalCountEl) totalCountEl.textContent = '0';
        return;
    }
    
    // 计算总收入
    const totalIncome = completedCommissions.reduce((sum, c) => sum + (c.reward || 0), 0);
    
    // 更新总计
    if (totalIncomeEl) totalIncomeEl.textContent = totalIncome;
    if (totalCountEl) totalCountEl.textContent = completedCommissions.length;
    
    // 按时间排序（最新的在前）
    completedCommissions.sort((a, b) => {
        if (!a.completedTime || !b.completedTime) return 0;
        if (a.completedTime.year !== b.completedTime.year) return b.completedTime.year - a.completedTime.year;
        const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];
        const aIdx = seasons.indexOf(a.completedTime.season);
        const bIdx = seasons.indexOf(b.completedTime.season);
        if (aIdx !== bIdx) return bIdx - aIdx;
        return b.completedTime.day - a.completedTime.day;
    });
    
    // 渲染列表
    const html = completedCommissions.map(c => {
        const time = c.completedTime ? `第${c.completedTime.year}年 ${c.completedTime.season} 第${c.completedTime.day}天` : '未知日期';
        const commissionName = `${c.team} - ${c.playerReq.职业}${c.playerReq.级别}级选手`;
        const playerName = c.assignedPlayer || c.primaryPlayer || '未知选手';
        
        return `
            <div class="income-item">
                <div class="income-item-header">
                    <div class="income-commission-name">${commissionName}</div>
                    <div class="income-amount positive">+${c.reward || 0}元</div>
                </div>
                <div class="income-item-details">
                    <span class="income-date">${time}</span>
                    <span class="income-player">选手：${playerName}</span>
                </div>
            </div>
        `;
    }).join('');
    
    listEl.innerHTML = html;
}

// 渲染选手赛事分红
function renderMatchDividend() {
    const listEl = document.getElementById('matchDividendList');
    const totalDividendEl = document.getElementById('totalMatchDividend');
    const totalCountEl = document.getElementById('totalMatchCount');
    
    if (!listEl) return;
    
    // 获取赛季统计数据
    if (!gameData.seasonStats || !gameData.seasonStats.seasons) {
        listEl.innerHTML = '<div class="empty-message">暂无赛事分红记录</div>';
        if (totalDividendEl) totalDividendEl.textContent = '0';
        if (totalCountEl) totalCountEl.textContent = '0';
        return;
    }
    
    const seasons = gameData.seasonStats.seasons;
    const seasonKeys = Object.keys(seasons);
    
    if (seasonKeys.length === 0) {
        listEl.innerHTML = '<div class="empty-message">暂无赛事分红记录</div>';
        if (totalDividendEl) totalDividendEl.textContent = '0';
        if (totalCountEl) totalCountEl.textContent = '0';
        return;
    }
    
    // 计算总分红和总次数
    let totalDividend = 0;
    let totalCount = 0;
    const dividendRecords = [];
    
    seasonKeys.forEach(key => {
        const [year, season] = key.split('-');
        const data = seasons[key];
        
        if (data.moneyGain > 0) {
            totalDividend += data.moneyGain;
            totalCount++;
            dividendRecords.push({
                year: parseInt(year),
                season: season,
                amount: data.moneyGain,
                reputation: data.reputationGain || 0
            });
        }
    });
    
    // 更新总计
    if (totalDividendEl) totalDividendEl.textContent = totalDividend;
    if (totalCountEl) totalCountEl.textContent = totalCount;
    
    if (dividendRecords.length === 0) {
        listEl.innerHTML = '<div class="empty-message">暂无赛事分红记录</div>';
        return;
    }
    
    // 按时间排序（最新的在前）
    dividendRecords.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];
        return seasons.indexOf(b.season) - seasons.indexOf(a.season);
    });
    
    // 渲染列表
    const html = dividendRecords.map(record => {
        return `
            <div class="income-item">
                <div class="income-item-header">
                    <div class="income-commission-name">第${record.year}年 ${record.season} 选手表现奖励</div>
                    <div class="income-amount positive">+${record.amount}元</div>
                </div>
                <div class="income-item-details">
                    <span class="income-player">声望提升：+${record.reputation}点</span>
                </div>
            </div>
        `;
    }).join('');
    
    listEl.innerHTML = html;
}

// 在切换到小账本页面时初始化
function renderBorrowingBook() {
    initBorrowingBookTabs();
    renderCommissionIncome(); // 默认显示委托金清单
    renderBorrowingList(); // 渲染借款清单数据
}

// 渲染借款清单
function renderBorrowingList() {
    const borrowingDetails = document.getElementById('borrowingDetails');
    const borrowingTotalAmount = document.getElementById('borrowingTotalAmount');
    
    if (!borrowingDetails || !borrowingTotalAmount) return;
    
    // 计算借钱统计信息
    let totalAmount = 0;
    let borrowingDetailTexts = [];
    
    gameData.players.forEach(player => {
        if (player.borrowingStats && player.borrowingStats.count > 0) {
            totalAmount += player.borrowingStats.totalAmount;
            borrowingDetailTexts.push(`${player.name} 合计${player.borrowingStats.totalAmount}元`);
        }
    });
    
    // 更新借款明细
    if (borrowingDetailTexts.length > 0) {
        borrowingDetails.innerHTML = borrowingDetailTexts.map(detail => '<div>' + detail + '</div>').join('');
    } else {
        borrowingDetails.textContent = '无借款记录';
    }
    
    // 更新借款总额
    borrowingTotalAmount.textContent = totalAmount;
}

// 生成特定人员的特殊八卦新闻（张佳乐、孙哲平、魏琛）
function generateSpecialGossipNews(player, commission, oldLevel, fromTeam, fromRole) {
    const twoDaysLater = getNextDayTime(getNextDayTime(gameData.time));
    const { year, season, day } = twoDaysLater;

    // 定义特定人员的特殊八卦内容配置
    const specialGossipConfig = {
        '张佳乐': {
            // 预留字段：稍后添加内容
            netizen_content: '', // 热帖内容
            fans_content: ''      // 粉丝反应内容
        },
        '孙哲平': {
            // 预留字段：稍后添加内容
            netizen_content: '', // 热帖内容
            fans_content: ''      // 粉丝反应内容
        },
        '魏琛': {
            // 预留字段：稍后添加内容
            netizen_content: '', // 热帖内容
            fans_content: ''      // 粉丝反应内容
        }
    };

    // 获取该玩家的配置
    const config = specialGossipConfig[player.name];
    if (!config || (!config.netizen_content && !config.fans_content)) {
        return null; // 如果没有定义内容，则不生成新闻
    }

    // 随机选择格式：热帖(50%)或粉丝反应(50%)
    const useNetizen = Math.random() < 0.5;

    let publisher = '';
    let title = '';
    let gossipContent = '';
    let color = '';
    let borderColor = '';

    if (useNetizen) {
        // 热帖格式
        publisher = "荣耀玩家论坛·热帖";
        title = ["网友热议", "粉丝看法", "社区观点"][Math.floor(Math.random() * 3)];
        gossipContent = config.netizen_content;
        color = "#f57c00";
        borderColor = "#e65100";
    } else {
        // 粉丝反应格式
        publisher = Math.random() < 0.5 ? `${fromTeam}粉丝会刊` : `${commission.team}粉丝前线`;
        title = ["粉丝声音", "支持者看法", "后援会表态"][Math.floor(Math.random() * 3)];
        gossipContent = config.fans_content;
        color = publisher.includes(fromTeam) ? "#d32f2f" : "#388e3c";
        borderColor = publisher.includes(fromTeam) ? "#b71c1c" : "#1b5e20";
    }

    if (!gossipContent) {
        return null; // 如果内容为空，不生成新闻
    }

    const fullContent = `
        <div style="font-family: 'Microsoft YaHei', sans-serif;">
            <div style="margin-bottom: 15px; color: ${color}; font-weight: bold; font-size: 1.1em; border-left: 4px solid ${borderColor}; padding-left: 10px;">
                【${publisher}】${title}：${player.name}转会的特殊反应
            </div>
            ${gossipContent}
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ddd; font-size: 0.85em; color: #777;">
                <div style="color: #999; font-style: italic;">
                    ${useNetizen ? "以上为网友个人观点，不代表本论坛立场，请理性讨论。" : "以上为粉丝个人观点，不代表战队官方立场，请文明表达支持。"}
                </div>
            </div>
        </div>
    `;

    return {
        id: 'special-gossip-news-' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: 'news',
        time: twoDaysLater,
        title: `${publisher}：${player.name}转会引发${useNetizen ? '热议' : '粉丝反应'}`,
        content: fullContent,
        publisher: publisher,
        views: Math.floor(Math.random() * 150) + 200,
        likes: Math.floor(Math.random() * 80) + 30,
        comments: Math.floor(Math.random() * 60) + 20,
        relatedId: 'special_gossip_transfer_news',
        style: useNetizen ? 'netizen' : 'fans'
    };
}

// 辅助函数：获取选手随机发言（修正bug）
function getPlayerRandomStatement(playerName, levelChangeType) {
    const statements = {
        upgrade: [
            `"很兴奋能加入新战队，我会用更好的表现回报大家的信任！"`,
            `"这是一个全新的开始，我会努力训练，争取早日融入战队。"`,
            `"感谢新战队给我的机会，我不会辜负这份信任，会全力以赴！"`,
            `"新的环境，新的挑战，我已经迫不及待要开始新的征程了！"`
        ],
        downgrade: [
            `"我会调整好状态，尽快适应新环境，争取早日找回最佳状态。"`,
            `"感谢新战队给我机会，我会用实际行动证明自己的价值。"`,
            `"转会是个新的开始，我会以更低的姿态，更高的标准要求自己。"`,
            `"我会加倍努力训练，尽快适应新战队的战术体系。"`
        ],
        no_change: [
            `"很高兴能加入新战队，期待与队友们的合作！"`,
            `"我会尽快适应新环境，为战队贡献自己的力量。"`,
            `"感谢战队给我这个机会，我会努力证明自己的价值。"`,
            `"新的开始，新的挑战，我已经准备好了！"`
        ]
    };

    const category = statements[levelChangeType] || statements.no_change;
    return category[Math.floor(Math.random() * category.length)];
}