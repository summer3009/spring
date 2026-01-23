// 添加初始随机新闻
// 添加初始随机新闻
function addInitialRandomNews() {
    for (let i = 0; i < 2; i++) {
        // ✅ 关键修改：从 RANDOM_NEWS 读取，而不是 gameData.randomNews
        const randomNewsItem = RANDOM_NEWS[Math.floor(Math.random() * RANDOM_NEWS.length)];

        const initialNews = {
            id: 'randnews_' + gameData.publishedNews.length + 1, // 👈 注意：应该是 publishedNews.length
            type: 'random',
            time: { ...gameData.time },
            content: randomNewsItem.content,
            completed: false,
            views: Math.floor(Math.random() * 200) + 50,
            likes: Math.floor(Math.random() * 50) + 10,
            comments: Math.floor(Math.random() * 20) + 5,
            publisher: "经纪公会"
        };
        gameData.publishedNews.push(initialNews);
    }
}

// 渲染广场页面
// 渲染广场页面
function renderSquarePage() {
    renderNews();//渲染新闻
    renderTeamMap();//渲染地图

    // 检查今天是否有比赛记录，如果有，完整回放
    const currentMatch = gameData.matchHistory.find(r =>
        r.date?.year === gameData.time.year &&
        r.date?.season === gameData.time.season &&
        r.date?.day === gameData.time.day
    );

    if (currentMatch) {
        replayMatchFromRecord(currentMatch);
    } else {
        hideMatchLiveSection(); // 确保干净
    }
}

function hideMatchLiveSection() {
    const el = document.getElementById('matchLiveSection');
    if (el) el.classList.add('hidden');
}



// 时间比较函数
function compareTimesEquel(time1, time2) {
    const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];

    if (time1.year !== time2.year) return -1;

    const season1 = seasons.indexOf(time1.season);
    const season2 = seasons.indexOf(time2.season);

    if (season1 !== season2) return -1;

    if (time1.day !== time2.day) return -1;

    return 1; // 只有年、赛季、天都完全相等才返回1
}

// 渲染新闻
// 渲染新闻
function renderNews(page = 1) {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;

    // ✅ 只从 publishedNews 读取！
    const allNews = [...gameData.publishedNews]
        .filter(news => news.time && compareTimes(news.time, gameData.time) <= 0)
        .sort((a, b) => {
            if (a.time.year !== b.time.year) return b.time.year - a.time.year;
            const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];
            const idxA = seasons.indexOf(a.time.season);
            const idxB = seasons.indexOf(b.time.season);
            if (idxA !== idxB) return idxB - idxA;
            if (a.time.day !== b.time.day) return b.time.day - a.time.day;
            // 同一天内按ID中的时间戳排序，确保按事件发生顺序显示
            const idA = a.id || '';
            const idB = b.id || '';

            // 尝试从ID中提取时间戳，支持多种格式
            let timeA = 0, timeB = 0;

            // 匹配 pub_时间戳_随机数 格式
            const matchA = idA.match(/pub_(\d+)_/);
            const matchB = idB.match(/pub_(\d+)_/);

            if (matchA) timeA = parseInt(matchA[1]);
            if (matchB) timeB = parseInt(matchB[1]);

            // 如果没有匹配到 pub_格式，尝试其他格式
            if (!matchA) {
                // 匹配其他可能的时间戳格式
                const otherMatchA = idA.match(/(\d{13}|\d{10})/); // 匹配13位或10位时间戳
                if (otherMatchA) timeA = parseInt(otherMatchA[1]);
            }
            if (!matchB) {
                const otherMatchB = idB.match(/(\d{13}|\d{10})/); // 匹配13位或10位时间戳
                if (otherMatchB) timeB = parseInt(otherMatchB[1]);
            }

            return timeB - timeA; // 新的新闻在前
        });
    const filteredNews = allNews; // 直接使用全部符合条件的新闻
    const totalPages = Math.ceil(filteredNews.length / pageSize);
    currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * pageSize;
    const pageNews = filteredNews.slice(startIndex, startIndex + pageSize);


    if (pageNews.length === 0) {
        newsList.innerHTML = '<div class="news-item">暂无新闻</div>';
    } else {
        newsList.innerHTML = pageNews.map(news => {
            // 根据新闻类型确定背景色
            let backgroundColor = '';

            if (news.type === 'commission') {
                // 委托相关新闻
                if (news.content.includes('失败') || news.content.includes('被其他经纪人接走') ||
                    news.content.includes('未能达成一致') || news.content.includes('未能成功招募')) {
                    // 失败的委托新闻 - 浅灰色
                    backgroundColor = 'background-color: #f5f5f5;';
                } else if (news.content.includes('成功') || news.content.includes('完成委托')) {
                    // 成功的委托新闻 - 浅绿色
                    backgroundColor = 'background-color: #f0fff4;';
                } else {
                    // 普通的委托新闻（发布、接受等）- 浅红色
                    backgroundColor = 'background-color: #fff5f5;';
                }
            } else if (news.type === 'news') {
                // news类型新闻 - 浅蓝色
                backgroundColor = 'background-color:rgb(233, 246, 254);';
            } else if (news.type === 'match') {
                // match类型新闻 - 光泽红蓝渐变（简洁版）
                backgroundColor = 'background: linear-gradient(135deg, #dbeafe 0%, #fca5a5 100%), radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 70%); background-blend-mode: overlay;';
            } else if (news.type === 'random') {
                // random类型新闻 - 浅紫色
                backgroundColor = 'background-color: #faf5ff;';
            } else if (news.type === 'transfer') {
                // random类型新闻 - 浅紫色
                backgroundColor = 'background-color:rgb(237, 251, 242);';
            } else {
                // 其他类型 - 默认样式
                backgroundColor = '';
            }

            // 添加边框区分
            let borderStyle = '';
            if (news.type === 'commission') {
                if (news.content.includes('失败')) {
                    borderStyle = 'border-left: 0px solid #94a3b8;'; // 灰色边框
                } else if (news.content.includes('成功')) {
                    borderStyle = 'border-left: 0px solid #10b981;'; // 绿色边框
                } else {
                    borderStyle = 'border-left: 0px solid #f56565;'; // 红色边框
                }
            } else if (news.type === 'news') {
                borderStyle = 'border-left: 0px solid #0ea5e9;'; // news用蓝色边框
            } else if (news.type === 'match') {
                borderStyle = 'border-left: 0px solid #3b82f6;'; // match用蓝色边框
            } else if (news.type === 'random') {
                borderStyle = 'border-left: 0px solid #8b5cf6;'; // random用紫色边框
            } else {
                borderStyle = 'border-left: 0px solid #667eea;'; // 其他用默认蓝色边框
            }

            return `
            <div class="news-item" style="${backgroundColor} ${borderStyle}">
                <div class="news-header">
                    <div class="news-title">Y${news.time.year} ${news.time.season} D${news.time.day}</div>
                    <div class="news-meta">
                        <span><i>👤</i>${news.publisher || '未知发布者'}</span>
                        ${news.type === 'commission' ?
                    `<span style="margin-left: 8px; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; 
                              background-color: ${news.content.includes('失败') ? '#e5e7eb' :
                        news.content.includes('成功') ? '#d1fae5' : '#fee2e2'};
                              color: ${news.content.includes('失败') ? '#6b7280' :
                        news.content.includes('成功') ? '#047857' : '#dc2626'};">
                                ${news.content.includes('失败') ? '❌ 委托失败' :
                        news.content.includes('成功') ? '✅ 委托成功' : '📋 委托动态'}
                            </span>` :
                    news.type === 'news' ?
                        `<span style="margin-left: 8px; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; 
                              background-color: #e0f2fe; color: #0284c7;">
                                📰 行业动态
                            </span>` :
                        news.type === 'match' ?
                            `<span style="margin-left: 8px; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; 
                              background-color: #dbeafe; color: #1d4ed8;">
                                🏆 比赛结果
                            </span>` :
                            `<span style="margin-left: 8px; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; 
                              background-color: #f3e8ff; color: #7c3aed;">
                                💡 游戏指引
                            </span>`
                }
                    </div>
                </div>
                <div class="news-content">${news.content}</div>
                <div class="news-footer">
                    <div class="news-stats">
                        <span><i>👁️</i>${news.views || 0}</span>
                        <span><i>❤️</i>${news.likes || 0}</span>
                        <span><i>💬</i>${news.comments || 0}</span>
                    </div>
                </div>
            </div>
        `}).join('');
    }

    renderPagination(totalPages);
}

// 新增辅助函数：基于种子和新闻ID的固定随机选择
function seededRandomSelect(seed, newsId, selectRatio = 3) {
    // 简单的哈希函数，确保同一周期内相同新闻ID返回相同结果
    let hash = 0;
    for (let i = 0; i < newsId.length; i++) {
        hash = ((hash << 5) - hash) + newsId.charCodeAt(i);
        hash = hash & hash; // 转换为32位整数
    }

    // 结合种子和哈希值
    const combined = (seed * 31 + Math.abs(hash)) % 1000000;

    // 固定算法：每个新闻在第几个周期显示
    const cycle = combined % selectRatio;

    // 每个周期只显示1/selectRatio的新闻
    return cycle === 0;
}

// 渲染分页控件
function renderPagination(totalPages) {
    let paginationContainer = document.getElementById('newsPagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'newsPagination';
        paginationContainer.className = 'news-pagination';
        const newsSection = document.querySelector('.news-section');
        if (newsSection) newsSection.appendChild(paginationContainer);
    }

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '<div class="pagination-info">第1页 / 共1页</div>';
    } else {
        paginationContainer.innerHTML = `
            <div class="pagination-info">第${currentPage}页 / 共${totalPages}页</div>
            <div class="pagination-buttons">
                <button class="btn btn-secondary" onclick="renderNews(${Math.max(1, currentPage - 1)})" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
                <button class="btn btn-secondary" onclick="renderNews(${Math.min(totalPages, currentPage + 1)})" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>
            </div>
        `;
    }
}

// 生成随机新闻
function generateRandomNews() {
    const randomChance = Math.random();
    if (randomChance < 0.6) {
        const randomNewsItem = RANDOM_NEWS[Math.floor(Math.random() * RANDOM_NEWS.length)];
        const newNews = {
            id: 'randnews_' + gameData.publishedNews.length + 1,
            type: 'random',
            time: { ...gameData.time },
            content: randomNewsItem.content,
            completed: false,
            views: Math.floor(Math.random() * 200) + 50,
            likes: Math.floor(Math.random() * 50) + 10,
            comments: Math.floor(Math.random() * 20) + 5,
            publisher: "经纪人公会"
        };
        gameData.publishedNews.push(newNews);
        return newNews;
    }
    return null;
}

// 检查并生成委托相关新闻
// 检查并生成委托相关新闻
function checkAndGenerateCommissionNews() {
    //alert("0");

    gameData.commissions.forEach(commission => {
        // console.log(`调试: 委托 ${commission.id}`);
        //             console.log(`  - 状态: ${commission.status}`);
        //             console.log(`  - 新闻时间: ${JSON.stringify(commission.newsTime)}`);
        //             console.log(`  - 当前游戏时间: ${JSON.stringify(gameData.time)}`);

        // ✅ 修改1: hasNews 现在检查 publishedNews
        const hasNews = gameData.publishedNews.some(news =>
            news.type === 'commission' && news.relatedCommission === commission.id

        );

        //console.log(`委托 ${commission.id}: newsTime =`, commission.newsTime);
        const compareResult = compareTimes(gameData.time, commission.newsTime);
        //console.log(`比较结果: ${compareResult}, 条件 >=0 为 ${compareResult >= 0}, 已有新闻: ${hasNews}`);

        // 修改这里：使用 >= 0 而不是 == 0，并且确保还没有新闻
        if (!hasNews && compareTimes(gameData.time, commission.newsTime) >= 0) {
            console.log(`为委托 ${commission.id} 生成新闻`);

            const newNews = {
                id: 'pub_' + Date.now() + '_' + Math.floor(Math.random() * 1000), // ✅ 更安全的 ID
                type: 'commission',
                time: { ...gameData.time }, // 使用当前时间（你原逻辑）
                content: `${commission.newscontent}`,
                relatedCommission: commission.id,
                completed: false,
                views: Math.floor(Math.random() * 200) + 50,
                likes: Math.floor(Math.random() * 50) + 10,
                comments: Math.floor(Math.random() * 20) + 5,
                publisher: "经纪人公会"
            };
            gameData.publishedNews.push(newNews);
        }

        // 检查是否过了接受期限
        if (commission.status === 'available' &&
            compareTimes(gameData.time, commission.acceptDeadline) > 0) {
            // 委托被其他经纪人接走
            commission.status = 'expired';
            addCommissionExpiredNews(commission, 'accept');
        }

        // 检查是否过了协商期限
        if ((commission.status === 'accepted' || commission.status === 'negotiating') &&
            compareTimes(gameData.time, commission.negotiationDeadline) > 0) {
            // 协商失败
            handleCommissionFailure(commission, 'negotiation_timeout');
        }

        // 检查是否过了转会期
        if (commission.status !== 'completed' &&
            compareTimes(gameData.time, commission.endTime) > 0) {
            // 转会期结束，委托失败
            handleCommissionFailure(commission, 'transfer_period_end');
        }
    });
}

// 添加委托过期新闻
// 添加委托过期新闻
function addCommissionExpiredNews(commission, type) {
    let content = '';
    if (type === 'accept') {
        content = `${commission.team}的${commission.playerReq.职业}招募委托已被其他经纪人接走。`;
    } else if (type === 'negotiation') {
        content = `${commission.team}与${commission.assignedPlayer || '意向选手'}的转会协商未能达成一致，委托失败。战队表示：就知道这个经纪人不靠谱。（经纪人声望下降30点）`;
    }

    const expiredNews = {
        id: 'pub_' + Date.now() + '_' + Math.floor(Math.random() * 1000), // 
        type: 'commission',
        time: { ...gameData.time },
        content: content,
        relatedCommission: commission.id,
        completed: true,
        views: Math.floor(Math.random() * 200) + 50,
        likes: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 20) + 5,
        publisher: "经纪人公会"
    };

    gameData.publishedNews.push(expiredNews); // ✅ 修正：变量名匹配
}

// 发布所有预置新闻中，ismust 为 true 且 time 匹配当前时间的新闻
function publishDuePresetNewsToday() {
    const today = gameData.time;
    console.log(`🔍 检查预置新闻 - 当前时间: 第${today.year}年 ${today.season} 第${today.day}天`);

    const dueToday = PRESET_TIMED_NEWS.filter(preset => {
        if (preset.type !== 'news') return false;

        // 时间必须完全匹配（包括 year）
        const matchesTime =
            preset.time.year === today.year &&
            preset.time.season === today.season &&
            preset.time.day === today.day;

        if (!matchesTime) {
            // 可选：打印不匹配的（用于调试）
            // console.log(`  ⏭️ [${preset.id}] 时间不匹配`, preset.time, '!=', today);
            return false;
        }

        // 检查：今天是否已经发布过这条新闻？
        const alreadyPublished = gameData.publishedNews.some(pub =>
            pub.relatedId === preset.id &&
            pub.time.year === today.year &&
            pub.time.season === today.season &&
            pub.time.day === today.day
        );

        if (alreadyPublished) {
            console.log(`  ⚠️ [${preset.id}] 今天已发布，跳过`);
            return false;
        }

        return true;
    });

    if (dueToday.length === 0) {
        console.log("📭 今日无待发布的预置新闻");
        return;
    }

    console.log(`📬 发现 ${dueToday.length} 条待发布预置新闻:`);
    dueToday.forEach(n => console.log(`  - [${n.id}] ${n.content}`));

    dueToday.forEach(preset => {
        const isMust = preset.ismust === true;
        const shouldPublish = isMust || (Math.random() < 0.5);

        if (!shouldPublish) {
            console.log(`⏭️ 非必出新闻未触发: ${preset.id}`);
            return;
        }

        const newNews = {
            id: 'pub_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            type: 'news',
            time: { ...today },
            content: preset.content,
            publisher: preset.publisher || "荣耀周刊",
            views: Math.floor(Math.random() * 300) + 100,
            likes: Math.floor(Math.random() * 80) + 20,
            comments: Math.floor(Math.random() * 30) + 10,
            relatedId: preset.id
        };

        gameData.publishedNews.push(newNews);
        console.log(`✅ 已发布: ${preset.id}`);
    });
}



// 获取当前时间-战队的对话数组
function getDialogByTimeAndTeam(playerId, currentTime, teamName) {
    const playerDialog = PLAYER_DIALOGS_CONFIG[playerId];
    if (!playerDialog) return null;

    const timeTeamKey = `${currentTime.year}-${currentTime.season}-${teamName}`;

    // 尝试精确匹配
    if (playerDialog.byTimeAndTeam[timeTeamKey]) {
        return playerDialog.byTimeAndTeam[timeTeamKey];
    }

    // 如果精确匹配失败，尝试模糊匹配
    const seasonTeamKey = `${currentTime.season}-${teamName}`;
    for (const key in playerDialog.byTimeAndTeam) {
        if (key.includes(seasonTeamKey)) {
            return playerDialog.byTimeAndTeam[key];
        }
    }

    // 如果还没有，尝试只匹配战队
    for (const key in playerDialog.byTimeAndTeam) {
        if (key.includes(teamName)) {
            return playerDialog.byTimeAndTeam[key];
        }
    }

    return null;
}

// 获取随机对话
function getRandomDialog(playerId) {
    const player = gameData.players.find(p => p.id === playerId);
    const playerDialog = PLAYER_DIALOGS_CONFIG[playerId];

    if (!player || !playerDialog) {
        return "你好，有什么事吗？";
    }

    // 优先根据时间和战队获取对话
    const timeTeamDialog = getDialogByTimeAndTeam(
        playerId,
        gameData.time,
        player.team
    );

    if (timeTeamDialog && timeTeamDialog.length > 0) {
        return timeTeamDialog[Math.floor(Math.random() * timeTeamDialog.length)];
    }

    // 如果没有时间-战队对话，使用general对话
    if (playerDialog.general && playerDialog.general.length > 0) {
        return playerDialog.general[Math.floor(Math.random() * playerDialog.general.length)];
    }

    // 默认对话
    return "训练很忙，有事快说。";
}



// 
/**
 * 简单自动存档（保存到localStorage）
 */
// 是否已自动加载过
let hasAutoLoaded = false;
function simpleAutoSave() {
    try {
        const saveData = {
            agent: { ...gameData.agent },
            time: { ...gameData.time },
            players: JSON.parse(JSON.stringify(gameData.players)),
            teams: JSON.parse(JSON.stringify(gameData.teams)),
            publishedNews: JSON.parse(JSON.stringify(gameData.publishedNews || [])),
            commissions: JSON.parse(JSON.stringify(gameData.commissions)),
            letters: JSON.parse(JSON.stringify(gameData.letters)),
            // 👇 关键：保存赛季赛程
            seasonSchedule: JSON.parse(JSON.stringify(gameData.seasonSchedule || {
                currentSeasonKey: null,
                matchups: [],
                nextMatchIndex: 0
            })),
            // 👇 新增：保存所有比赛历史记录！
            matchHistory: JSON.parse(JSON.stringify(gameData.matchHistory || [])),
            // 👇 新增：保存特殊对话状态
            specialDialogues: JSON.parse(JSON.stringify(gameData.specialDialogues || [])),
            // 👇 新增：保存对话历史
            dialogueHistory: JSON.parse(JSON.stringify(gameData.dialogueHistory || {})),
            // 👇 新增：保存协商数据
            negotiations: JSON.parse(JSON.stringify(gameData.negotiations || [])),
            // 👇 新增：保存设置
            settings: JSON.parse(JSON.stringify(gameData.settings || {})),
            // 👇 新增：保存赛季统计数据
            seasonStats: JSON.parse(JSON.stringify(gameData.seasonStats || {
                currentSeasonKey: null,
                seasons: {}
            })),

            saveTime: Date.now(),
            saveVersion: "1.4" // 升级版本号
        };

        localStorage.setItem("glory_manager_autosave", JSON.stringify(saveData));
        console.log("自动存档完成，包含已发布新闻", new Date().toLocaleTimeString());
        return true;
    } catch (error) {
        console.error("自动存档失败:", error);
        return false;
    }
}





// 休息功能
function rest() {
    console.log('开始执行休息功能，当前对话历史:', gameData.dialogueHistory);
    // console.log('叶修对话历史长度:', gameData.dialogueHistory && gameData.dialogueHistory['叶修'] ? gameData.dialogueHistory['叶修'].length : 'undefined');

    // 获取当前能量显示值
    const oldEnergy = gameData.agent.energy;

    // 直接执行休息逻辑
    gameData.agent.energy = 10;
    advanceTime();
    checkAndGenerateCommissionNews();

    // 如果是新赛季的第1天，生成随机委托
    if (gameData.time.day === 1) {
        if (gameData.time.season === "夏转会期" || gameData.time.season === "冬转会期") {
            generateRandomCommissions();
            // 再次检查新生成委托的新闻
            checkAndGenerateCommissionNews();
        }
    }

    generateRandomNews();//生成随机新闻
    publishDuePresetNewsToday();//发布今天的预设新闻
    updateStatusBar();//更新状态条
    renderSquarePage();//渲染广场页面
    renderCommissionPage();//渲染委托页面
    renderNegotiationPage();//渲染协商页面
    checkAndUnlockTeams();//检查地图解锁

    // 更新休息页面的能量显示
    const restEnergyDisplay = document.getElementById('restEnergyDisplay');
    if (restEnergyDisplay) {
        restEnergyDisplay.textContent = gameData.agent.energy;
    }

    simulateDailyMatch();//比赛检查

    // 自动存档
    console.log('休息功能执行完毕，准备自动存档，对话历史:', gameData.dialogueHistory);
    // console.log('叶修对话历史长度:', gameData.dialogueHistory && gameData.dialogueHistory['叶修'] ? gameData.dialogueHistory['叶修'].length : 'undefined');
    simpleAutoSave();


    // 显示休息完成提示
    const newTime = `${gameData.time.year}年 ${gameData.time.season} 第${gameData.time.day}天`;

    Swal.fire({
        title: '休息完成',
        html: `
            <div style="text-align: center; padding: 5px 0;">
                <div style="font-size: 40px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 0.85rem; color: #666;">
                    <div style="margin-bottom: 5px;"><strong>新的一天开始了！</strong></div>
                    <div style="color: var(--primary-color); font-weight: 600;">${newTime}</div>
                    <div style="margin-top: 8px; font-size: 0.8rem;">
                        能量恢复：<span style="color: #4CAF50; font-weight: 600;">${oldEnergy} → ${gameData.agent.energy}/10</span>
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: '好的',
        confirmButtonColor: '#667eea',
        width: '280px',
        padding: '1rem',
        showCloseButton: false
    });
}

// 时间前进
function advanceTime() {
    gameData.time.day++;
    if (gameData.time.day > 30) {
        gameData.time.day = 1;
        const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];
        const currentSeasonIndex = seasons.indexOf(gameData.time.season);
        if (currentSeasonIndex === seasons.length - 1) {
            gameData.time.season = seasons[0];
            gameData.time.year++;
        } else {
            gameData.time.season = seasons[currentSeasonIndex + 1];
        }


    }

    // 检查主线委托自动完成，检查特殊事件
    checkMainCommissionAutoComplete();


    // 时间推进后立即检查信件
    checkForLetters();
}


/**
 * 检查主线委托自动完成
 * 在赛季结束时调用，只处理当前转会期的主线委托
 * 同时处理特殊剧情：第2年春赛季第1天叶修转会兴欣
 */
function checkMainCommissionAutoComplete() {
    const currentTime = gameData.time;
    console.log(`[调试] 第${currentTime.year}年 ${currentTime.season} 第${currentTime.day}天 - 检查叶修自动完成`);

    // 检查特殊剧情：第2年春赛季第1天，叶修转会到兴欣
    if (currentTime.year === 2 && currentTime.season === '春赛季' && currentTime.day === 1) {
        transferYeXiuToXingXin();

    }
    
    // 检查特殊剧情：第2年夏转会期第29天，如果林敬言的team还是呼啸 则林敬言的team改为 荣耀网游，状态为已职业注册
    if (currentTime.year === 2 && currentTime.season === '夏转会期' && currentTime.day === 29) {
        const linJingyan = gameData.players.find(p => p.name === '林敬言');
        if (linJingyan && linJingyan.team === '呼啸') {
            transferLinJingyanToOnlineGame();
        }
    }

    // 检查特殊剧情：第3年夏转会期第29天，team是嘉世的人，都转移到荣耀网游中，状态为已职业注册
    if (currentTime.year === 3 && currentTime.season === '夏转会期' && currentTime.day === 29) {
        const jiaShiPlayers = gameData.players.filter(p => p.team === '嘉世');
        
        // 如果嘉世还有孙翔和肖时钦，则将他们转到各自的新队伍
        const sunXiang = jiaShiPlayers.find(p => p.name === '孙翔');
        const xiaoShiQin = jiaShiPlayers.find(p => p.name === '肖时钦');
        
        if (sunXiang) {
            sunXiang.team = '轮回';
            // 👉 重要修复：清除transferredByPlayer标记，因为这不是玩家完成的转会
            delete sunXiang.transferredByPlayer;
            
            // 添加孙翔转会新闻
            const sunXiangNews = {
                id: `sun-xiang-transfer-${Date.now()}`,
                type: 'news',
                time: { year: 3, season: "夏转会期", day: 29 },
                content: `【转会消息】嘉世解散后，王牌选手孙翔正式加盟轮回战队，继续征战荣耀赛场！`,
                publisher: "电竞日报",
                views: Math.floor(Math.random() * 400) + 200,
                likes: Math.floor(Math.random() * 80) + 30,
                comments: Math.floor(Math.random() * 30) + 15,
                relatedId: 'sun_xiang_lunhui_event'
            };
            gameData.publishedNews.push(sunXiangNews);
        }
        
        if (xiaoShiQin) {
            xiaoShiQin.team = '雷霆';
            // 👉 重要修复：清除transferredByPlayer标记，因为这不是玩家完成的转会
            delete xiaoShiQin.transferredByPlayer;
            
            // 添加肖时钦转会新闻
            const xiaoShiQinNews = {
                id: `xiao-shiqin-transfer-${Date.now()}`,
                type: 'news',
                time: { year: 3, season: "夏转会期", day: 29 },
                content: `【转会消息】嘉世解散后，肖时钦正式回归母队雷霆，泪洒欢迎会现场！`,
                publisher: "电竞日报",
                views: Math.floor(Math.random() * 400) + 200,
                likes: Math.floor(Math.random() * 80) + 30,
                comments: Math.floor(Math.random() * 30) + 15,
                relatedId: 'xiao_shiqin_leiting_event'
            };
            gameData.publishedNews.push(xiaoShiQinNews);
        }


        // 检查是否只有孙翔和肖时钦
        const hasOtherPlayers = jiaShiPlayers.some(player => player.name !== '孙翔' && player.name !== '肖时钦');
        if (jiaShiPlayers.length > 0 && hasOtherPlayers) {
            transferJiaShiToOnlineGame();
        }

        
    }




  
    // 检查特殊剧情：春赛季或秋赛季的最后一天，对非S级选手进行等级随机调整
    if ((currentTime.season === '春赛季' || currentTime.season === '秋赛季') && currentTime.day === 30) {
        adjustPlayerLevels();
    }

    // 在本季第30天检查本季的主线委托是否需要自动完成
    if (currentTime.day === 30) {
        console.log(`[调试] 第${currentTime.year}年 ${currentTime.season} 第${currentTime.day}天 - 检查主线委托自动完成`);

        const currentYear = currentTime.year;
        const currentSeason = currentTime.season;

        // 统计符合条件的主线委托数量
        const mainCommissions = gameData.commissions.filter(c => c.type === 'main' &&
            c.endTime.year === currentYear && c.endTime.season === currentSeason &&
            c.status !== 'completed' && !c.autoCompleted);

        console.log(`[调试] 当前符合条件的主线委托数量: ${mainCommissions.length}`);

        if (mainCommissions.length > 0) {
            console.log(`[调试] 符合条件的主线委托详情:`);
            mainCommissions.forEach((commission, index) => {
                console.log(`  [${index + 1}] ${commission.id} - 状态: ${commission.status}, 队伍: ${commission.team}, 选手: ${commission.primaryPlayer}`);
            });
        }

        // 遍历所有主线委托
        gameData.commissions.forEach(commission => {
            // 只处理主线委托
            if (commission.type !== 'main') return;

            // 只处理当前赛季的委托
            if (commission.endTime.year !== currentYear || commission.endTime.season !== currentSeason) return;

            // 已经完成的不处理
            if (commission.status === 'completed') return;

            // 已经自动处理过的不重复处理
            if (commission.autoCompleted) return;

            // 委托已过期且未完成，执行自动完成逻辑
            // 包括：available(未接受)、accepted(接受未完成)、negotiating(协商中)、failed(失败)、expired(过期)
            if (['available', 'accepted', 'negotiating', 'failed', 'expired'].includes(commission.status)) {
                autoCompleteMainCommission(commission);
            }
        });
    }
}

/**
 * 叶修转会兴欣
 * 在第2年春赛季第1天触发
 */
function transferYeXiuToXingXin() {
    const yeXiu = gameData.players.find(p => p.name === '叶修');

    if (yeXiu) {
        yeXiu.team = '兴欣';
        yeXiu.职业 = '散人';

        // 添加新闻
        const news = {
            id: `ye-xiu-transfer-${Date.now()}`,
            type: 'news',
            time: { year: 2, season: "春赛季", day: 3 },
            content: `【独家新闻】记者深度追踪叶神去向！！嘉世门卫大爷：总感觉他没走远。`,
            publisher: "八卦周刊",
            views: Math.floor(Math.random() * 600) + 300,
            likes: Math.floor(Math.random() * 120) + 50,
            comments: Math.floor(Math.random() * 50) + 20,
            relatedId: 'ye_xiu_xingxin_event'
        };

        gameData.publishedNews.push(news);

        console.log('叶修已转会到兴欣');
    } else {
        console.log('未找到叶修，无法执行转会');
    }
}

/**
 * 林敬言转会荣耀网游
 * 在第2年夏转会期第1天触发
 */
function transferLinJingyanToOnlineGame() {
    const linJingyan = gameData.players.find(p => p.name === '林敬言');

    if (linJingyan) {
        linJingyan.team = '荣耀网游';
        linJingyan.debutStatus = '已职业注册';
        // 👉 重要修复：清除transferredByPlayer标记，因为这不是玩家完成的转会
        delete linJingyan.transferredByPlayer;

        // 添加新闻
        const news = {
            id: `lin-jingyan-transfer-${Date.now()}`,
            type: 'news',
            time: { year: 2, season: "夏转会期", day: 29 },
            content: `【竞技观察】呼啸战队今日官宣林敬言离队。作为俱乐部元老及战术核心，林敬言的离队标志着呼啸彻底进入重建阶段。分析人士认为，尽管状态有所下滑，但以直接放弃而非交易的方式处理功勋选手，暴露出管理层在人员过渡规划上的缺失。此举或将影响俱乐部未来对成熟选手的吸引力。`,
            publisher: "电竞日报",
            views: Math.floor(Math.random() * 400) + 200,
            likes: Math.floor(Math.random() * 80) + 30,
            comments: Math.floor(Math.random() * 30) + 15,
            relatedId: 'lin_jingyan_online_game_event'
        };

        gameData.publishedNews.push(news);

        console.log('林敬言已转会到荣耀网游');
    } else {
        console.log('未找到林敬言，无法执行转会');
    }
}

/**
 * 嘉世选手全部转入荣耀网游
 * 在第3年夏转会期第29天触发
 */
function transferJiaShiToOnlineGame() {
    const jiaShiPlayers = gameData.players.filter(p => p.team === '嘉世');

    if (jiaShiPlayers.length > 0) {
        const playerNames = jiaShiPlayers.map(p => p.name).join('、');
        
        jiaShiPlayers.forEach(p => {
            p.team = '荣耀网游';
            p.debutStatus = '已职业注册';
            // 👉 重要修复：清除transferredByPlayer标记，因为这不是玩家完成的转会
            delete p.transferredByPlayer;
        });

        // 添加新闻
        const news = {
            id: `jiashi-disband-${Date.now()}`,
            type: 'news',
            time: { year: 3, season: "夏转会期", day: 29 },
            content: `【荣耀时报】昔日豪门嘉世战队今日正式宣告解散。旗下选手 <span style="font-weight: bold; color: #f97316;">${playerNames}</span> 等人已全部转入荣耀网游。曾经的三连冠王朝，终成往事。`,
            publisher: "荣耀时报",
            views: Math.floor(Math.random() * 800) + 500,
            likes: Math.floor(Math.random() * 200) + 100,
            comments: Math.floor(Math.random() * 100) + 50,
            relatedId: 'jiashi_disband_event'
        };

        gameData.publishedNews.push(news);

        console.log('嘉世选手已全部转入荣耀网游');
    } else {
        console.log('未找到嘉世选手，无需转移');
    }
}



/**
 * 自动完成主线委托
 * @param {Object} commission - 委托对象
 */
function autoCompleteMainCommission(commission) {
    console.log(`[调试] 开始自动完成主线委托: ${commission.id}, 状态: ${commission.status}`);

    const primaryPlayerName = commission.primaryPlayer;
    const targetTeam = commission.team;
    const targetJob = commission.playerReq.职业;

    // 查找主要选手
    const player = gameData.players.find(p => p.name === primaryPlayerName);

    if (!player) {
        console.log(`主线委托自动完成: 找不到选手 ${primaryPlayerName}`);
        return;
    }

    console.log(`[调试] 找到选手: ${player.name}, 当前队伍: ${player.team}, 目标队伍: ${targetTeam}`);

    // 获取选手的初始所属战队（从初始数据中获取）
    const initialPlayer = INITIAL_PLAYERS.find(p => p.name === primaryPlayerName);
    const originalTeam = initialPlayer ? initialPlayer.team : null;

    console.log(`[调试] 选手初始队伍: ${originalTeam}`);

    // 情况一：选手仍在原始战队，自动完成转会
    if (player.team === originalTeam) {
        console.log(`[调试] 执行自动转会: ${player.name} 从 ${originalTeam} 转到 ${targetTeam}`);

        // 执行转会
        player.team = targetTeam;
        player.职业 = targetJob;
        // 👉 重要修复：清除transferredByPlayer标记，因为这是自动完成的委托，不是玩家手动操作
        delete player.transferredByPlayer;
        commission.autoCompleted = true; // 标记为自动完成

        // 发布新闻
        const newsContent = `【转会消息】${targetTeam}成功签下${player.级别}级${targetJob}${primaryPlayerName}！据悉，这次转会由其他经纪人促成，期待${primaryPlayerName}在新战队大放异彩！`;

        console.log(`[调试] 生成新闻内容: ${newsContent}`);

        addAutoCompleteNews(newsContent, targetTeam, primaryPlayerName);

        console.log(`主线委托自动完成: ${primaryPlayerName} 从 ${originalTeam} 转会到 ${targetTeam}，职业变更为 ${targetJob}`);

    } else if (player.team !== targetTeam) {
        // // // 情况二：选手已被玩家转会到其他战队，强制完成剧情      
        // // commission.autoCompleted = true;     

        // // // 发布新闻
        // // const newsContent = `【转会消息】${targetTeam}成功引进一名新的${targetJob}选手！据悉，该选手来自联赛其他战队，实力强劲，${targetTeam}对其表现非常满意！`;

        // // addAutoCompleteNews(newsContent, targetTeam, null);

        // // console.log(`主线委托强制完成: ${primaryPlayerName} 已在 ${player.team}，${targetTeam} 引进其他选手`);

        // console.log(`[调试] 情况二: 选手 ${player.name} 已在 ${player.team}，不是目标队伍 ${targetTeam}，当前未处理`);

    } else {
        // 情况三：选手已经在目标战队（玩家已完成）
        // 不做处理，委托应该已经被标记为 completed
        console.log(`主线委托: ${primaryPlayerName} 已在目标战队 ${targetTeam}`);
    }

    console.log(`[调试] 自动完成主线委托结束: ${commission.id}`);
}



/**
 * 添加自动完成新闻
 * @param {string} content - 新闻内容
 * @param {string} team - 相关战队
 * @param {string|null} player - 相关选手
 */
function addAutoCompleteNews(content, team, player) {
    console.log(`[调试] 添加自动完成新闻: ${content}`);

    const news = {
        id: `auto-complete-${Date.now()}`,
        content: content,
        time: { ...gameData.time },
        type: 'transfer',
        publisher: "经纪人公会",
        team: team,
        player: player,
        isAutoComplete: true
    };

    gameData.publishedNews.push(news);  // 添加到末尾，按时间顺序

    console.log(`[调试] 新闻已添加到publishedNews，当前总数: ${gameData.publishedNews.length}`);
}

/**
 * 判断时间是否已过
 * @param {Object} targetTime - 目标时间 {year, season, day}
 * @param {Object} currentTime - 当前时间 {year, season, day}
 * @returns {boolean}
 */
function isTimePassed(targetTime, currentTime) {
    const seasons = ['春赛季', '夏转会期', '秋赛季', '冬转会期'];

    // 年份比较
    if (currentTime.year > targetTime.year) return true;
    if (currentTime.year < targetTime.year) return false;

    // 同年，比较赛季
    const currentSeasonIndex = seasons.indexOf(currentTime.season);
    const targetSeasonIndex = seasons.indexOf(targetTime.season);

    if (currentSeasonIndex > targetSeasonIndex) return true;
    if (currentSeasonIndex < targetSeasonIndex) return false;

    // 同赛季，比较天数
    return currentTime.day > targetTime.day;
}



// 在 news.js 中现有函数后添加

// 生成随机委托
function generateRandomCommissions() {
    // 只在夏或冬转会期生成
    if (gameData.time.season !== "夏转会期" && gameData.time.season !== "冬转会期") {
        return;
    }

    const currentYear = gameData.time.year;
    const currentSeason = gameData.time.season;

    // 检查本赛季是否已经生成了随机委托
    const existingRandomCommissions = gameData.commissions.filter(c =>
        c.type === "random" &&
        c.newsTime.year === currentYear &&
        c.newsTime.season === currentSeason
    );

    // 如果本赛季已有随机委托，不再生成
    if (existingRandomCommissions.length > 0) {
        return;
    }

    // 生成4-6个随机委托
    const numCommissions = Math.floor(Math.random() * 3) + 6; // 6-8个

    for (let i = 0; i < numCommissions; i++) {
        const commission = createRandomCommission(currentYear, currentSeason, i + 1);
        if (commission) {
            gameData.commissions.push(commission);
        }
    }

    console.log(`第${currentYear}年${currentSeason}生成了${numCommissions}个随机委托`);
}

// 创建单个随机委托
function createRandomCommission(year, season, index) {
    // 1. 确定委托起始时间（第2-5天之间随机，避免第1天立即出现）
    const minNewsDay = 2;
    const maxNewsDay = 19;
    const newsDay = Math.floor(Math.random() * (maxNewsDay - minNewsDay + 1)) + minNewsDay;

    // 调整新闻日：如果当前时间已经过了预定日，设置为明天或后天
    const currentDay = gameData.time.day;
    let adjustedNewsDay = newsDay;
    if (currentDay >= newsDay) {
        adjustedNewsDay = currentDay + Math.floor(Math.random() * 2) + 1;
        if (adjustedNewsDay > 30) adjustedNewsDay = 30;
    }

    // 2. 计算各个时间节点（确保不超过第30天）
    const acceptDeadlineDay = Math.min(30, adjustedNewsDay + Math.floor(Math.random() * 6) + 4); // 4-9天接受期
    const negotiationDeadlineDay = Math.min(30, acceptDeadlineDay + Math.floor(Math.random() * 6) + 6); // 5-10天协商期

    // 3. 随机选择战队 - 只选择已解锁且不是"荣耀网游"的战队
    const availableTeams = gameData.teams.filter(team =>
        team.unlocked && team.name !== "荣耀网游"
    );

    if (availableTeams.length === 0) {
        console.log("没有可用的战队生成委托");
        return null;
    }

    const randomTeamIndex = Math.floor(Math.random() * availableTeams.length);
    const team = availableTeams[randomTeamIndex].name;

    // 4. 随机选择职业
    const job = randomCommissionConfig.jobs[Math.floor(Math.random() * randomCommissionConfig.jobs.length)];

    // 5. 随机选择级别
    const level = randomCommissionConfig.levels[Math.floor(Math.random() * randomCommissionConfig.levels.length)];
    const levelBase = randomCommissionConfig.levelBaseValues[level];

    // 6. 随机选择2个属性要求
    const allAttributes = ["谈判技巧", "社交能力", "魅力", "声望"];
    const availableAttributes = [...allAttributes];
    const selectedAttributes = [];

    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * availableAttributes.length);
        selectedAttributes.push(availableAttributes[randomIndex]);
        availableAttributes.splice(randomIndex, 1);
    }

    // 7. 生成属性要求值（基础值 + 年份加成）
    const yearBonus = (year - 1) * 80;
    const baseRequirement = Math.floor(Math.random() * 100) + 70;     
    const requirementValue = Math.min(baseRequirement + yearBonus, 950); //

    const requirements = {};
    selectedAttributes.forEach(attr => {
        requirements[attr] = requirementValue;
    });

    // 8. 计算奖励和保证金
    const yearRewardBonus = (year - 1) * 5000;
    const yearDepositBonus = (year - 1) * 500;

    const reward = levelBase.reward + Math.floor(Math.random() * 1000) - 500 + yearRewardBonus;
    const deposit = levelBase.deposit + Math.floor(Math.random() * 200) - 100 + yearDepositBonus;

    // 确保最小值为正
    const finalReward = Math.max(reward, 1000);
    const finalDeposit = Math.max(deposit, 100);

    // 9. 生成新闻内容
    const requirementsText = Object.entries(requirements)
        .map(([attr, value]) => `${attr}>${value}`)
        .join('且');
    const newscontent = `${team}有意向招募${job}选手，要求经纪人${requirementsText}。`;

    // 10. 创建委托对象
    const commissionId = `random-${year}-${season}-${Date.now()}-${index}`;

    return {
        id: commissionId,
        team: team,
        type: "random",
        // 时间属性
        newsTime: {
            year: year,
            season: season,
            day: adjustedNewsDay
        },
        startTime: {
            year: year,
            season: season,
            day: adjustedNewsDay + 1
        },
        acceptDeadline: {
            year: year,
            season: season,
            day: acceptDeadlineDay
        },
        negotiationDeadline: {
            year: year,
            season: season,
            day: negotiationDeadlineDay
        },
        endTime: {
            year: year,
            season: season,
            day: 30
        },
        // 资金属性
        deposit: finalDeposit,
        reward: finalReward,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        newscontent: newscontent,
        // 委托要求
        requirements: requirements,
        playerReq: {
            职业: job,
            级别: level
        },
        // 选手信息
        primaryPlayer: null,
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    };
}

/**
 * 每个季度最后一天对非S级选手进行等级随机调整
 */
function adjustPlayerLevels() {
    // 定义等级序列（按顺序）
    const levelOrder = ['D', 'C', 'B', 'B+', 'A', 'A+', 'S'];

    // 找出所有非S级且非荣耀网游的选手
    const nonSPlayers = gameData.players.filter(player => {
        return player.级别 && player.级别 !== 'S' && player.team !== '荣耀网游';
    });
    
    // 随机选择一部分选手进行等级调整，数量在5-15之间
    const numToAdjust = 8 + Math.floor(Math.random() * 10); // 8 + (0-10) = 8-18
    
    // 打乱数组并截取前numToAdjust个元素
    const shuffled = [...nonSPlayers].sort(() => 0.5 - Math.random());
    const playersToAdjust = shuffled.slice(0, Math.min(numToAdjust, nonSPlayers.length));

    const adjustedPlayers = [];

    nonSPlayers.forEach(player => {
        const currentIndex = levelOrder.indexOf(player.级别);
        if (currentIndex === -1) return; // 不在序列中，跳过

        const random = Math.random();
        let newIndex = currentIndex; // 默认不变

        if (random < 0.15 && currentIndex > 0) {
            // 降级：向下移动一位（15%概率）
            newIndex = currentIndex - 1;
        } else if (random < 0.40 && currentIndex < levelOrder.length - 1) {
            // 升级：向上移动一位（25%概率）
            newIndex = currentIndex + 1;
        }
        // 否则保持原等级（60%概率）

        // 如果等级确实发生了变化
        if (newIndex !== currentIndex) {
            const oldLevel = player.级别;
            const newLevel = levelOrder[newIndex];
            player.级别 = newLevel;

            // 更新训练阶段，如果存在
            if (player.currentStage && player.currentStage === oldLevel) {
                player.currentStage = newLevel;
            }

            adjustedPlayers.push({
                name: player.name,
                oldLevel: oldLevel,
                newLevel: newLevel,
                isUpgrade: newIndex > currentIndex // 正确判断升降
            });
        }
    });

    // 如果有选手等级发生变化，生成新闻
    if (adjustedPlayers.length > 0) {
        let content = "【赛季总结】随着本赛季结束，部分选手在比赛中获得成长或状态下滑，等级发生调整：";

        adjustedPlayers.forEach((adjustment, index) => {
            const action = adjustment.isUpgrade ? "提升" : "下滑";
            content += ` ${adjustment.name}(${adjustment.oldLevel}级→${adjustment.newLevel}级)${action}`;
            if (index < adjustedPlayers.length - 1) content += '，';
        });

        const news = {
            id: `player-levels-adjustment-${Date.now()}`,
            type: 'news',
            time: { ...gameData.time },
            content: content,
            publisher: "荣耀观察家",
            views: Math.floor(Math.random() * 600) + 300,
            likes: Math.floor(Math.random() * 120) + 50,
            comments: Math.floor(Math.random() * 50) + 20,
            relatedId: 'player_levels_adjustment'
        };

        gameData.publishedNews.push(news);

        console.log(`赛季末等级调整: ${adjustedPlayers.length}名选手等级发生变化`);

        // 调试信息：显示每个选手的具体变化
        console.log("详细调整列表:");
        adjustedPlayers.forEach(adj => {
            console.log(`  ${adj.name}: ${adj.oldLevel}(${levelOrder.indexOf(adj.oldLevel)}) → ${adj.newLevel}(${levelOrder.indexOf(adj.newLevel)}) [${adj.isUpgrade ? '提升' : '下滑'}]`);
        });
    }
}



