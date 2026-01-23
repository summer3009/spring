function getEligibleTeams() {
    const { year, season } = gameData.time;
    return gameData.teams.filter(team => {
        if (team.name === "荣耀网游") return false; // 永远排除
        if ((year <= 2 || (year == 3 && season === "春赛季"))&& team.name === "兴欣") return false; // 第1\2年排除兴欣
        if ((year <= 2 || (year == 3 && season === "春赛季")) && team.name === "义斩") return false; // 第1、2年或第3年春赛季排除义斩
        if ((year >= 3 || (year == 2 && season === "秋赛季"))  && team.name === "嘉世") return false; // 2秋-3春是挑战赛
        if ((year <= 5) && team.name === "新嘉世") return false; // 5年后可参赛
        return true; // 其他全部参赛，无视 unlocked
    });
}

function getPlayersByTeamName(teamName) {
    return gameData.players.filter(p => p.team === teamName);
}

function getLevelPower(levelStr) {
    const map = {
        'S': 90,
        'A+': 80,
        'A': 70,
        'B+': 60,
        'B': 50,
        'C+': 40,
        'C': 30
    };
    return map[levelStr] || 30;
}

// 从玩家数组中随机选择指定数量的玩家
function getRandomPlayers(players, count) {
    if (players.length <= count) {
        return players;
    }
    
    // 创建副本并随机打乱
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    
    // 返回前count个
    return shuffled.slice(0, count);
}



/**
 * 生成本赛季所有唯一对阵（无重复）
 */
function generateSeasonMatchups(teams) {
    const matchups = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matchups.push({ teamA: teams[i], teamB: teams[j] });
        }
    }
    // 打乱顺序，增加随机性
    return matchups.sort(() => Math.random() - 0.5);
}

/**
 * 模拟并显示今日比赛
 */
function simulateDailyMatch() {
    const { season, year } = gameData.time;
    const matchSection = document.getElementById('matchLiveSection');

    //非赛季：隐藏
    if (season !== '春赛季' && season !== '秋赛季') {
        matchSection.classList.add('hidden');
        return;
    }


    // === 关键修复：确保 seasonSchedule 存在 ===
    if (!gameData.seasonSchedule) {
        gameData.seasonSchedule = {
            currentSeasonKey: null,
            matchups: [],
            nextMatchIndex: 0
        };
    }

    // ===================================


    const seasonKey = `${year}_${season}`;
    const schedule = gameData.seasonSchedule;

    // 新赛季：重建赛程
    if (schedule.currentSeasonKey !== seasonKey) {
        const eligibleTeams = getEligibleTeams();
        if (eligibleTeams.length < 2) {
            matchSection.classList.add('hidden');
            return;
        }
        schedule.currentSeasonKey = seasonKey;
        schedule.matchups = generateSeasonMatchups(eligibleTeams);
        schedule.nextMatchIndex = 0;
    }

    // 所有比赛已打完
    if (schedule.nextMatchIndex >= schedule.matchups.length) {
        matchSection.classList.add('hidden');
        return;
    }

    // 查找下一场有效比赛（队员非空）
    let match = null;
    while (schedule.nextMatchIndex < schedule.matchups.length) {
        match = schedule.matchups[schedule.nextMatchIndex];
        schedule.nextMatchIndex++;

        const playersA = getPlayersByTeamName(match.teamA.name);
        const playersB = getPlayersByTeamName(match.teamB.name);

        if (playersA.length > 0 && playersB.length > 0) {
            renderAndProcessMatch(match.teamA, playersA, match.teamB, playersB);
            return;
        }
    }

    // 无有效比赛
    matchSection.classList.add('hidden');
}

/**
 * 渲染比赛并处理胜负/奖励
 */
/**
 * 渲染比赛并处理胜负/奖励
 */
function renderAndProcessMatch(teamA, playersA, teamB, playersB) {
    const section = document.getElementById('matchLiveSection');
    section.classList.remove('hidden');

    // === 1. 随机抽取队员（最多6人）===
    let selectedPlayersA = playersA;
    let selectedPlayersB = playersB;
    
    if (playersA.length > 6) {
        selectedPlayersA = getRandomPlayers(playersA, 6);
    }
    
    if (playersB.length > 6) {
        selectedPlayersB = getRandomPlayers(playersB, 6);
    }

    // === 2. 基础战力（带 ±5% 随机扰动）===
    const basePowerA = selectedPlayersA.reduce((s, p) => s + getLevelPower(p.级别), 0);
    const basePowerB = selectedPlayersB.reduce((s, p) => s + getLevelPower(p.级别), 0);

    const powerA = Math.floor(basePowerA * (0.95 + Math.random() * 0.1));
    const powerB = Math.floor(basePowerB * (0.95 + Math.random() * 0.1));

    // === 2. 新增：临场发挥加成（0~20 的整数）===
    const clutchBonusA = Math.floor(Math.random() * 31); // 0 到 20
    const clutchBonusB = Math.floor(Math.random() * 31);

    const finalPowerA = powerA + clutchBonusA;
    const finalPowerB = powerB + clutchBonusB;

    // === 3. 决定胜者（基于最终战力）===
    let winner;
    if (finalPowerA > finalPowerB) {
        winner = 'A';
    } else if (finalPowerB > finalPowerA) {
        winner = 'B';
    } else {
        winner = Math.random() > 0.5 ? 'A' : 'B'; // 平局时随机
    }

    // === 4. 渲染UI（传入新参数）===
    renderMatchUI(
        teamA, selectedPlayersA, powerA, clutchBonusA, finalPowerA,
        teamB, selectedPlayersB, powerB, clutchBonusB, finalPowerB,
        winner
    );

    // === 5. 处理胜方与玩家相关的转会选手 ===
    const winningPlayers = winner === 'A' ? selectedPlayersA : selectedPlayersB;
    const transferredPlayers = winningPlayers.filter(p => p.transferredByPlayer);
    const hasPlayerTransferred = transferredPlayers.length > 0;
    const transferredPlayerNames = transferredPlayers.map(p => p.name); // ← 提取姓名！

    // === 6. 保存赛事记录（新增日期和选手名）===
   // === 6. 保存完整的比赛回放数据 ===
const { year, season, day } = gameData.time;
const dateLabel = `第${year}年 ${season} 第${day}天`;
const winningTeamName = winner === 'A' ? teamA.name : teamB.name;

gameData.matchHistory.push({
    dateLabel,
    date: { year, season, day }, // 用于匹配

    // 👇 完整回放所需数据（全部深拷贝）
    teamA: JSON.parse(JSON.stringify(teamA)),
    playersA: JSON.parse(JSON.stringify(playersA)), // 所有队员
    selectedPlayersA: JSON.parse(JSON.stringify(selectedPlayersA)), // 实际参与比赛的队员
    powerA,
    clutchBonusA,
    finalPowerA,

    teamB: JSON.parse(JSON.stringify(teamB)),
    playersB: JSON.parse(JSON.stringify(playersB)), // 所有队员
    selectedPlayersB: JSON.parse(JSON.stringify(selectedPlayersB)), // 实际参与比赛的队员
    powerB,
    clutchBonusB,
    finalPowerB,

    winner, // 'A' or 'B'
    winningTeamName,

    // 转会选手信息（用于新闻/声望，也可用于高亮）
    hasPlayerTransferred,
    transferredPlayerNames
});

    // === 7. 添加比赛结果新闻 ===
    const matchWinningTeamName = winner === 'A' ? teamA.name : teamB.name;
    createMatchResultNews(teamA, teamB, matchWinningTeamName, finalPowerA, finalPowerB);
    
    // === 8. 声望 & 转会新闻（保留原有逻辑）===
    if (hasPlayerTransferred) {
        const reputationGain = 5;
        const moneyGain = 2000;
        
        gameData.agent.attributes.声望 = (gameData.agent.attributes.声望 || 0) + reputationGain;
        gameData.agent.money = (gameData.agent.money || 0) + moneyGain;
        
        // 👉 立即更新状态栏显示
        updateStatusBar();
        
        // 👉 统计当前赛季的声望和金钱增加
        const { year, season } = gameData.time;
        const seasonKey = `${year}-${season}`;
        
        // 初始化seasonStats结构（兼容旧存档）
        if (!gameData.seasonStats) {
            gameData.seasonStats = {
                currentSeasonKey: null,
                seasons: {}
            };
        }
        
        // 如果赛季变化，重置当前赛季统计
        if (gameData.seasonStats.currentSeasonKey !== seasonKey) {
            gameData.seasonStats.currentSeasonKey = seasonKey;
            gameData.seasonStats.seasons[seasonKey] = {
                reputationGain: 0,
                moneyGain: 0
            };
        }
        
        // 累加当前赛季的统计数据
        if (!gameData.seasonStats.seasons[seasonKey]) {
            gameData.seasonStats.seasons[seasonKey] = {
                reputationGain: 0,
                moneyGain: 0
            };
        }
        gameData.seasonStats.seasons[seasonKey].reputationGain += reputationGain;
        gameData.seasonStats.seasons[seasonKey].moneyGain += moneyGain;
        
       // alert(gameData.agent.reputation);
        createTransferSuccessNews(transferredPlayers); // 注意：这里传的是 filtered 数组
    }
}

/**
 * 渲染比赛UI
 */
function renderMatchUI(
    teamA, allPlayersA, basePowerA, bonusA, totalPowerA,
    teamB, allPlayersB, basePowerB, bonusB, totalPowerB,
    winner
) {
    // 更新标题（不变）
    //document.getElementById('match-vs-text').textContent = `${teamA.name} vs ${teamB.name}`;

    // === 内部渲染函数：支持显示三项战力 ===
    const renderTeam = (team, originalPlayers, basePower, bonus, totalPower, isWinner, isBlue) => {
        const card = document.createElement('div');
        card.className = `team-card ${isBlue ? 'blue-side' : 'red-side'}${isWinner ? ' winner' : ''}`;

        // === 战队名称 + 图标（完全保留你的逻辑）===
        const nameContainer = document.createElement('div');
        nameContainer.className = 'team-name';

        const localIcon = getTeamLocalIcon(team.name);
        const fallbackEmoji = getTeamIcon(team.name);

        if (localIcon) {
            const img = document.createElement('img');
            img.src = localIcon;
            img.alt = team.name;
            img.className = 'team-logo-small';
            img.onerror = function () {
                this.replaceWith(document.createTextNode(fallbackEmoji + ' '));
            };
            nameContainer.appendChild(img);
        } else {
            nameContainer.innerHTML = `${fallbackEmoji} `;
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = team.name;
        if (isWinner) {
            nameSpan.innerHTML += ' 🏆';
        }
        nameContainer.appendChild(nameSpan);
        card.appendChild(nameContainer);
        // === 名称结束 ===

        // === 成员列表（完全保留）===
        const list = document.createElement('ul');
        list.className = 'team-members';
        originalPlayers.forEach(p => {
            const li = document.createElement('li');
            li.className = 'team-member';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'name-part';
            nameSpan.textContent = p.name;
            const levelSpan = document.createElement('span');
            levelSpan.textContent = p.级别;

            if (p.transferredByPlayer) {
                nameSpan.style.color = '#fde047';
                nameSpan.style.fontWeight = '700';
                const star = document.createElement('span');
                star.textContent = '🌟 ';
                star.style.marginRight = '4px';
                nameSpan.prepend(star);
            }

            li.appendChild(nameSpan);
            li.appendChild(levelSpan);
            list.appendChild(li);
        });
        card.appendChild(list);

        // === 战力显示（增强版）===
        const powerEl = document.createElement('div');
        powerEl.className = 'team-power';
        // 显示三行：基础 / 临场 / 总计
        powerEl.innerHTML = `
            <div>基础战力: ${basePower}</div>
            <div>临场发挥: +${bonus}</div>
            <div><strong>总战力: ${totalPower}</strong></div>
        `;
        card.appendChild(powerEl);

        return card;
    };

    // === 渲染两队（传入新参数）===
    const container = document.querySelector('.match-teams');
    container.innerHTML = '';

    container.appendChild(renderTeam(teamA, allPlayersA, basePowerA, bonusA, totalPowerA, winner === 'A', true));

    const vs = document.createElement('div');
    vs.className = 'vs-divider';
    vs.textContent = 'VS';
    container.appendChild(vs);

    container.appendChild(renderTeam(teamB, allPlayersB, basePowerB, bonusB, totalPowerB, winner === 'B', false));

    // === 结果摘要（完全不变）===
    const resultEl = document.getElementById('match-result');
    const winningTeam = winner === 'A' ? teamA : teamB;
    const winningPlayers = winner === 'A' ? allPlayersA : allPlayersB;
    const hasPlayerInvolved = winningPlayers.some(p => p.transferredByPlayer);

    let text = `${winningTeam.name} 获胜！`;
    if (hasPlayerInvolved) {
        text += ` 选手大放异彩！`;
    }
    resultEl.textContent = text;
    resultEl.classList.remove('hidden');
}

/**
 * 生成比赛结果新闻
 */
function createMatchResultNews(teamA, teamB, winningTeamName, finalPowerA, finalPowerB) {
    const news = {
        id: 'match_' + Date.now(),
        type: 'match',
        time: { ...gameData.time },
        content: `[🏆赛事速递]第${gameData.time.year}年${gameData.time.season}第${gameData.time.day}日战报：${teamA.name}(${finalPowerA}) vs ${teamB.name}(${finalPowerB})，最终${winningTeamName}战队技高一筹获得胜利！`,
        publisher: "荣耀前线",
        views: Math.floor(Math.random() * 300) + 150,
        likes: Math.floor(Math.random() * 80) + 20,
        comments: Math.floor(Math.random() * 30) + 10,
        relatedId: 'match_result_' + Date.now()
    };
    gameData.publishedNews.push(news);
}

/**
 * 选手大放异彩成功新闻
 */
function createTransferSuccessNews(transferredPlayers) {
    const names = transferredPlayers.map(p => p.name).join('、');
    const news = {
        id: 'pub_' + Date.now(),
        type: 'news',
        time: { ...gameData.time },
        content: `[快讯！]知名经纪人 <span style="font-weight: bold; color: #10b981;">${gameData.agent.name}</span> 力荐的选手 <span style="font-weight: bold; color: #f97316;">${names}</span> 在今日关键战役中大放异彩，助力战队取胜！（经纪人声望+5，金钱+2000）`,
        publisher: "荣耀观察家",
        views: Math.floor(Math.random() * 500) + 200,
        likes: Math.floor(Math.random() * 100) + 30,
        comments: Math.floor(Math.random() * 40) + 15,
        relatedId: 'transfer_success_' + Date.now()
    };
    gameData.publishedNews.push(news);
}



/**
 * 用历史记录完整重放一场比赛的 UI（和当时看到的完全一致）
 */
function replayMatchFromRecord(record) {
    const section = document.getElementById('matchLiveSection');
    if (!section) return;

    section.classList.remove('hidden');

    // 直接调用原有的 renderMatchUI！
    renderMatchUI(
        record.teamA,
        record.selectedPlayersA || record.playersA, // 使用实际参与比赛的队员，如果没有则使用所有队员（兼容旧数据）
        record.powerA,
        record.clutchBonusA,
        record.finalPowerA,

        record.teamB,
        record.selectedPlayersB || record.playersB, // 使用实际参与比赛的队员，如果没有则使用所有队员（兼容旧数据）
        record.powerB,
        record.clutchBonusB,
        record.finalPowerB,
        record.winner
    );


}