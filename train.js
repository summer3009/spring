// ==============================
// 网友培训系统（分阶段进度制）
// ==============================

// 阶段配置：从当前等级到下一等级所需点数
const STAGE_REQUIREMENTS = {
    'S': { next: null, points: 0 },
    'A+': { next: null, points: 0 },
    'D': { next: 'C', points: 50 },
    'C': { next: 'B', points: 100 },
    'B': { next: 'B+', points: 300 },
    'B+': { next: 'A', points: 500 },
    'A': { next: null, points: 0 }
};

// 4 个培训课程（效果不同，消耗不同）
const netizenTrainingCourses = [
    {
        id: 'course_1',
        name: '荣耀网吧特训',
        description: '在烟雾缭绕的网吧里，边吃泡面边练基础操作，体验最真实的职业选手入门期。',
        cost: { money: 800, energy: 1 },
        skillRange: { min: 3, max: 5 } // 性价比：800/(3-5) = 160-267金钱/点
    },
    {
        id: 'course_2',
        name: '野图BOSS特训',
        description: '带着网友去抢野图BOSS，在激烈的争夺中磨练团队意识和手速，还有机会爆到稀有材料！',
        cost: { money: 1200, energy: 2 },
        skillRange: { min: 5, max: 8 } // 性价比：1200/(5-8) = 150-240金钱/点
    },
    {
        id: 'course_3',
        name: '全明星陪练套餐',
        description: '托关系找来全明星选手当陪练，虽然价格昂贵但效果显著，网友直呼"这波血赚"。',
        cost: { money: 1800, energy: 3 },
        skillRange: { min: 8, max: 12 } // 性价比：1800/(8-12) = 150-225金钱/点
    },
    {
        id: 'course_4',
        name: '叶修の魔鬼特训',
        description: '请来荣耀教科书叶修亲自指导，训练强度极大，但学成后基本可以吊打职业选手了。',
        cost: { money: 2500, energy: 5 },
        skillRange: { min: 12, max: 18 } // 性价比最高：2500/(12-18) = 139-208金钱/点
    }
];

// 渲染已联系的荣耀网友（用于"网友培训"页面）
function renderContactNetizens() {
    const listEl = document.getElementById('contact-netizens-list');
    if (!listEl) return;

    const contacts = gameData.players.filter(p =>
        p.team === "荣耀网游" &&
        p.联系方式 === true
    );

    if (contacts.length === 0) {
        listEl.innerHTML = '<p class="empty-tip">暂无已联系的网友。<br>快去"荣耀网游"里认识新朋友吧！</p>';
        return;
    }

    const html = contacts.map(p => {
        // 确保字段存在（因不兼容旧数据，直接初始化）
        if (p.currentStage === undefined) {
            p.currentStage = p.级别 || 'D'; // 用显示级别初始化训练阶段
            p.stageProgress = 0;

            // 只有当职业注册状态未定义时才设置默认值
            if (p.debutStatus === undefined) {
                p.debutStatus = '未职业注册';
            }

            p.debutDate = p.debutDate || null;

            // 如果初始级别就是B/B+/A+，那么就是可职业注册状态（但仅在当前状态是未职业注册时）
            if (p.debutStatus === '未职业注册' && (p.currentStage === 'B+' || p.currentStage === 'A' || p.currentStage === 'A+' || p.currentStage === 'S')) {
                p.debutStatus = '可职业注册';
            }
        }

        // 确保其他字段存在
        p.stageProgress = p.stageProgress || 0;
        if (p.debutStatus === undefined) {
            p.debutStatus = '未职业注册';
        }
        p.debutDate = p.debutDate || null;

        // 根据 currentStage 更新职业注册状态
        if (p.debutStatus === '未职业注册' && (p.currentStage === 'B+' || p.currentStage === 'A')) {
            p.debutStatus = '可职业注册';
        }

        // 职业注册状态徽章
        let statusBadge = '';
        if (p.debutStatus === '可职业注册') {
            statusBadge = '<div class="debut-badge can-debut" style="margin-top: 4px;">✨ 可职业注册</div>';
        } else if (p.debutStatus === '已职业注册') {
            statusBadge = '<div class="debut-badge debuted" style="margin-top: 4px;">🏆 已职业注册</div>';
        }

        // 职业注册日期显示
        const debutDateInfo = p.debutStatus === '已职业注册' && p.debutDate ?
            `<div style="font-size: 0.7rem; color: #059669; margin-top: 4px;">
                <span style="color: #64748b;">职业注册：</span>${p.debutDate}
            </div>` : '';

        // 生成唯一的按钮ID
        const buttonId = 'train_btn_' + p.id.replace(/[^a-zA-Z0-9]/g, '_');

        return `
            <div class="training-netizen-card" data-player-id="${p.id}" style="display: flex; flex-direction: column; padding: 10px; margin-bottom: 12px; border-radius: 10px; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: flex-start; flex: 1; min-height: 70px;">
                    <div class="tn-avatar" style="width: 45px; height: 45px; font-size: 16px; flex-shrink: 0; margin-right: 10px;">
                        <img src="images/players/${p.id}.png" 
                             alt="${p.name}"
                             style="display:none;" 
                             onload="this.style.display='block'; this.nextElementSibling.style.display='none'"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <span>${p.name.charAt(0)}</span>
                    </div>
                    <div class="tn-info" style="flex: 1; min-width: 0; padding-right: 5px;">
                        <div class="tn-name" style="font-size: 1rem; font-weight: bold; color: #1e3a8a; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${p.name}
                        </div>
                        ${p.cardname ? `<div class="tn-cardname" style="font-size: 0.9rem; color: #64748b; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                           账号卡： ${p.cardname}
                        </div>` : ''}
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px;">
                            <span class="tn-profession" style="font-size: 0.9rem; color: #0d9488; background: #f0fdfa; padding: 1px 6px; border-radius: 8px; white-space: nowrap;">
                               职业： ${p.职业}
                            </span>
                            <span class="tn-level ${p.currentStage}" style="font-size: 0.9rem; color: #1e40af; background: #eff6ff; padding: 1px 6px; border-radius: 8px; white-space: nowrap;">
                               等级： ${p.currentStage}级
                            </span>
                            <span class="tn-favor" style="font-size: 0.9rem; color: #ec4899; background: #fdf2f8; padding: 1px 6px; border-radius: 8px; white-space: nowrap;">
                                好感度：❤️ ${p.好感度 || 0}
                            </span>
                        </div>
                        ${statusBadge}
                        ${debutDateInfo}
                    </div>
                </div>
                <div style="margin-top: 4px; border-top: 1px solid #f1f5f9; padding-top: 4px; display: flex; justify-content: flex-end;">
                    <button id="${buttonId}" class="tn-btn" onclick="showTrainingMenu('${p.id}')" 
                            style="min-width: 80px; padding: 6px 12px; font-size: 0.85rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                        ${p.debutStatus === '已职业注册' ? '查看详情' : '安排培训'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    listEl.innerHTML = html;
}

// 显示培训详情页（替代原弹窗）
function showTrainingMenu(playerId) {
    console.log('showTrainingMenu called with playerId:', playerId);
    const player = gameData.players.find(p => p.id === playerId);
    if (!player) {
        console.error('Player not found with ID:', playerId);
        return;
    }

    // 初始化字段 - 确保与显示级别同步
    if (player.currentStage === undefined) {
        player.currentStage = player.级别 || 'D';
        player.stageProgress = 0;

        // 只有当职业注册状态未定义时才设置默认值
        if (player.debutStatus === undefined) {
            player.debutStatus = '未职业注册';
        }

        player.debutDate = null;

        // 如果初始级别就是B/B+/A+，那么就是可职业注册状态（但仅在当前状态是未职业注册时）
        if (player.debutStatus === '未职业注册' && (player.currentStage === 'B' || player.currentStage === 'B+' || player.currentStage === 'A' || player.currentStage === 'A+' || player.currentStage === 'S')) {
            player.debutStatus = '可职业注册';
        }
    } else {
        // 同步显示级别到训练阶段
        player.级别 = player.currentStage;
    }

    // 根据级别自动更新职业注册状态
    if (player.debutStatus === '未职业注册' && (player.currentStage === 'B' || player.currentStage === 'B+' || player.currentStage === 'A')) {
        player.debutStatus = '可职业注册';
    }

    // 隐藏列表页
    document.getElementById('contact-netizens-page')?.classList.add('page-hidden');

    // 显示详情页
    const detail = document.getElementById('netizen-training-detail-page');
    detail.classList.add('active');
    renderTrainingDetailPage(player);
}

function backToNetizenList() {
    document.getElementById('contact-netizens-page')?.classList.remove('page-hidden');
    // 重新渲染列表以更新状态
    renderContactNetizens();
    document.getElementById('netizen-training-detail-page')?.classList.remove('active');
}

/**
 * 渲染荣耀网友培训详情页 - 改版，与玩家培训保持一致
 * @param {Object} player - 荣耀网友对象
 * @returns 
 */
function renderTrainingDetailPage(player) {
    const page = document.getElementById('netizen-training-detail-page');
    if (!page) return;

    const stageConfig = STAGE_REQUIREMENTS[player.currentStage];
    const isMax = player.currentStage === 'A';

    // 职业注册状态显示
    let debutHtml = '';
    if (player.debutStatus === '可职业注册' && player.currentStage != 'A' && player.currentStage != 'A+' && player.currentStage != 'S') {
        debutHtml = `
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 10px; padding: 12px; margin: 12px 10px; text-align: center; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.1);">
                <div style="font-weight: bold; color: #92400e; margin-bottom: 8px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span>✨</span> 已达到职业注册资格！
                </div>
                <p style="font-size: 0.85rem; color: #92400e; margin: 6px 0; line-height: 1.4;">
                    级别已达 <strong style="color: #d97706;">${player.currentStage}</strong>，可以正式职业注册成为职业选手
                </p>
                <button onclick="confirmDebut('${player.id}')" 
                        style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 8px; padding: 10px 20px; font-size: 0.9rem; font-weight: bold; cursor: pointer; margin-top: 8px; transition: all 0.2s; box-shadow: 0 3px 6px rgba(245, 158, 11, 0.3);">
                    🏆 确认职业注册
                </button>
                <p style="font-size: 0.75rem; color: #92400e; margin-top: 8px; line-height: 1.3;">
                    你可以选择现在职业注册，或者继续培训到A级再职业注册。
                </p>
            </div>
        `;
    } else if (player.debutStatus === '可职业注册') {
        debutHtml = `
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 10px; padding: 12px; margin: 12px 10px; text-align: center; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.1);">
                <div style="font-weight: bold; color: #92400e; margin-bottom: 8px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span>✨</span> 已达到职业注册资格！
                </div>
                <p style="font-size: 0.85rem; color: #92400e; margin: 6px 0; line-height: 1.4;">
                    级别已达 <strong style="color: #d97706;">${player.currentStage}</strong>，可以正式职业注册成为职业选手
                </p>
                <button onclick="confirmDebut('${player.id}')" 
                        style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 8px; padding: 10px 20px; font-size: 0.9rem; font-weight: bold; cursor: pointer; margin-top: 8px; transition: all 0.2s; box-shadow: 0 3px 6px rgba(245, 158, 11, 0.3);">
                    🏆 确认职业注册
                </button>
                <p style="font-size: 0.75rem; color: #92400e; margin-top: 8px; line-height: 1.3;">
                    恭喜！${player.name}已达到职业注册资格！
                </p>
            </div>
        `;
    } else if (player.debutStatus === '已职业注册') {
        debutHtml = `
            <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 2px solid #10b981; border-radius: 10px; padding: 12px; margin: 12px 10px; text-align: center; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);">
                <div style="font-weight: bold; color: #065f46; margin-bottom: 8px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span>🏆</span> 已职业注册选手
                </div>
                <p style="font-size: 0.85rem; color: #065f46; margin: 6px 0; line-height: 1.4;">
                    职业注册时间：<strong style="color: #059669;">${player.debutDate}</strong>
                </p>
                <p style="font-size: 0.85rem; color: #065f46; margin: 6px 0; line-height: 1.4;">
                    级别：<strong style="color: #059669;">${player.currentStage}</strong>
                </p>
                <p style="font-size: 0.8rem; color: #065f46; margin-top: 8px; padding: 6px; background: rgba(255, 255, 255, 0.5); border-radius: 6px;">
                    🎯 现在可以在委托中选择此选手
                </p>
            </div>
        `;
    }

    // 进度显示
    // 进度显示 - 已职业注册的选手不显示进度条
    let progressHtml = '';
    if (!isMax && player.debutStatus !== '已职业注册') {
        const percent = Math.min(100, Math.floor((player.stageProgress / stageConfig.points) * 100));
        progressHtml = `
            <div style="margin: 15px 10px;">
                <div style="font-size: 0.9rem; color: #1e3a8a; font-weight: bold; text-align: center; margin-bottom: 8px;">
                    当前训练进度：${player.currentStage} → ${stageConfig.next}
                </div>
                <div style="height: 20px; margin: 8px 0; border-radius: 10px; overflow: hidden; background: #e2e8f0; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); position: relative;">
                    <div style="width: ${percent}%; height: 100%; background: linear-gradient(to right, #60a5fa, #3b82f6); border-radius: 10px; transition: width 0.4s ease;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-size: 0.8rem;">
                        ${player.stageProgress} / ${stageConfig.points}
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: #64748b; text-align: center; margin-top: 5px;">
                    需要 ${stageConfig.points - player.stageProgress} 点升级到 ${stageConfig.next}
                </div>
            </div>
        `;
    } else if (!isMax && player.debutStatus === '已职业注册') {
        // 已职业注册的选手只显示级别，不显示进度条
        progressHtml = `
            <div style="text-align: center; margin: 15px 10px;">
                <div style="font-size: 0.9rem; color: #1e3a8a; font-weight: bold; margin-bottom: 8px;">
                    当前级别：${player.currentStage}
                </div>               
            </div>
        `;
    } else if (player.currentStage === 'A' && player.debutStatus !== '已职业注册') {
        progressHtml = `
            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #7dd3fc; border-radius: 10px; padding: 15px; margin: 15px 10px; text-align: center;">
                <div style="font-weight: bold; color: #0c4a6e; margin-bottom: 5px; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span>🎉</span> 已达最高级别 A！
                </div>
                <p style="font-size: 0.85rem; color: #0c4a6e; margin: 5px 0;">
                    训练已完成，可以职业注册成为顶级选手
                </p>
            </div>
        `;
    } else if (player.currentStage === 'A' && player.debutStatus === '已职业注册') {
        progressHtml = `
            <div style="text-align: center; margin: 15px 10px;">
                <div style="font-size: 0.9rem; color: #1e3a8a; font-weight: bold; margin-bottom: 8px;">
                    当前级别：A
                </div>
            </div>
        `;
    }

    // 培训课程区域（已职业注册的选手不能继续培训）
    const coursesHtml = (!isMax && player.debutStatus !== '已职业注册') ? `
        <div style="margin-top: 15px; padding: 0 10px;">
            <h3 style="font-size: 1rem; margin-bottom: 12px; color: #1e293b; text-align: center;">选择培训课程</h3>
            <div class="training-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                ${netizenTrainingCourses.map(course => {
        const canAfford = gameData.agent.money >= course.cost.money &&
            gameData.agent.energy >= course.cost.energy;
        const insufficientMoney = gameData.agent.money < course.cost.money;
        const insufficientEnergy = gameData.agent.energy < course.cost.energy;

        // 生成提示信息
        let warningHtml = '';
        if (insufficientMoney) {
            warningHtml = `<div style="color: #f56565; font-size: 0.7rem; margin-top: 3px; text-align: center;">❌ 金钱不足</div>`;
        } else if (insufficientEnergy) {
            warningHtml = `<div style="color: #f56565; font-size: 0.7rem; margin-top: 3px; text-align: center;">❌ 能量不足</div>`;
        }

        return `
                    <div class="training-option" style="padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; min-height: 140px;">
                        <h4 style="font-size: 0.85rem; margin: 0 0 6px 0; color: #1d4ed8; text-align: center;">${course.name}</h4>
                        <p style="font-size: 0.7rem; color: #475569; margin: 0 0 8px 0; line-height: 1.3; flex-grow: 1;">${course.description}</p>
                        <div style="margin: 8px 0; font-size: 0.7rem;">
                            <div style="color: #f56565; margin-bottom: 3px; text-align: center;">💰 ${course.cost.money} ⚡ ${course.cost.energy}</div>
                            <div style="color: #48bb78; text-align: center;">技能点+${course.skillRange.min}~${course.skillRange.max}</div>
                        </div>
                        ${warningHtml}
                        <button onclick="performNetizenTraining('${player.id}', '${course.id}')"
                                ${!canAfford ? 'disabled' : ''}
                                style="padding: 5px 6px; font-size: 0.75rem; margin-top: auto; background: ${canAfford ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#cbd5e1'}; color: white; border: none; border-radius: 6px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; font-weight: 500;">
                            ${canAfford ? '开始培训' : '无法培训'}
                        </button>
                    </div>
                `}).join('')}
            </div>
        </div>
    ` : '';

    page.innerHTML = `
        <div style="position: sticky; top: 0; background: white; z-index: 10; padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="backToNetizenList()" style="background: #dbeafe; border: none; border-radius: 6px; padding: 6px 10px; font-size: 0.85rem; color: #1e40af; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
                    <span>←</span> 返回
                </button>
                <div style="flex-grow: 1; text-align: center;">
                    <div style="font-size: 1.1rem; color: #1a365d; font-weight: bold;">${player.name}</div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
                        ${player.debutStatus === '可职业注册' ? '✨ 可职业注册' : player.debutStatus === '已职业注册' ? '🏆 已职业注册' : '未职业注册'}
                    </div>
                </div>
            </div>
        </div>
        
        <div style="padding: 15px 10px;">
            <div style="background: white; border-radius: 10px; padding: 12px; margin-bottom: 15px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">
                        ${player.name.charAt(0)}
                    </div>
                    <div style="flex-grow: 1;">
                        <div style="font-weight: bold; color: #1e3a8a; margin-bottom: 2px;">${player.name}</div>
                        <div style="font-size: 0.8rem; color: #64748b;">${player.cardname}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px;">
                    <div style="background: #f0fdfa; padding: 6px 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 0.7rem; color: #0f766e; margin-bottom: 2px;">职业</div>
                        <div style="font-size: 0.85rem; color: #0d9488; font-weight: bold;">${player.职业}</div>
                    </div>
                    <div style="background: #eff6ff; padding: 6px 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 0.7rem; color: #1d4ed8; margin-bottom: 2px;">级别</div>
                        <div style="font-size: 0.85rem; color: #1e40af; font-weight: bold;">${player.currentStage}</div>
                    </div>
                    <div style="background: #fdf2f8; padding: 6px 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 0.7rem; color: #db2777; margin-bottom: 2px;">好感度</div>
                        <div style="font-size: 0.85rem; color: #ec4899; font-weight: bold;">${player.好感度 || 0}</div>
                    </div>
                    <div style="background: #fef3c7; padding: 6px 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 0.7rem; color: #92400e; margin-bottom: 2px;">状态</div>
                        <div style="font-size: 0.85rem; color: #d97706; font-weight: bold;">
                            ${player.debutStatus === '可职业注册' ? '可职业注册' :
            player.debutStatus === '已职业注册' ? '已职业注册' : '未职业注册'}
                        </div>
                    </div>
                </div>
            </div>
            
            ${debutHtml}
            ${progressHtml}
            ${coursesHtml}
            
            ${player.debutStatus === '已职业注册' ? `
                <div style="text-align: center; padding: 10px; margin-top: 15px; font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0;">
                    ⚡ 已职业注册的选手不能再进行培训
                </div>
            ` : ''}
        </div>
    `;
}

// 确认职业注册函数
// 确认职业注册函数
// 确认职业注册函数
function confirmDebut(playerId) {
    const player = gameData.players.find(p => p.id === playerId);
    if (!player) return;

    if (player.debutStatus !== '可职业注册') {
        showToast('不符合职业注册条件！', 'warning');
        return;
    }

    // 获取当前游戏时间
    const currentDate = `Y${gameData.time.year} ${gameData.time.season} D${gameData.time.day}`;

    // 更新玩家职业注册状态
    player.debutStatus = '已职业注册';
    player.debutDate = currentDate;

    // 先隐藏详情页，避免遮挡弹窗
    document.getElementById('netizen-training-detail-page')?.classList.remove('active');

    // 显示成功提示
    Swal.fire({
        icon: 'success',
        title: '职业注册成功！',
        html: `
            <div style="font-size: 0.9rem; text-align: center; padding: 5px 0;">
                <div style="color: #10b981; font-weight: bold; margin-bottom: 10px; font-size: 1.1rem;">
                    🏆 ${player.name} 正式职业注册！
                </div>
                <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; margin: 10px 0;">
                    <div style="color: #065f46; margin-bottom: 5px;">
                        <strong>职业注册时间：</strong>${currentDate}
                    </div>
                    <div style="color: #065f46; margin-bottom: 5px;">
                        <strong>当前级别：</strong>${player.currentStage}
                    </div>
                    <div style="color: #065f46;">
                        <strong>职业：</strong>${player.职业}
                    </div>
                </div>
                <div style="color: #047857; font-size: 0.85rem; margin-top: 10px; padding: 8px; background: #ecfdf5; border-radius: 6px;">
                    🎯 现在可以在委托中选择此选手
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: '好的',
        confirmButtonColor: '#10b981',
        width: '320px',
        padding: '1rem'
    }).then(() => {
        // 弹窗关闭后，返回列表并重新渲染
        backToNetizenList();
    });
}

// 执行培训
function performNetizenTraining(playerId, courseId) {
    const player = gameData.players.find(p => p.id === playerId);
    const course = netizenTrainingCourses.find(c => c.id === courseId);
    const agent = gameData.agent;

    if (!player || !course || !agent) {
        showToast('数据异常', 'error');
        return;
    }

    // 检查是否已职业注册
    if (player.debutStatus === '已职业注册') {
        showToast('已职业注册的选手不能继续培训！', 'warning');
        return;
    }

    // 满级检查
    if (player.currentStage === 'A') {
        showToast('已是最高级别！', 'info');
        return;
    }

    // 资源检查
    if (agent.money < course.cost.money) {
        showToast(`金币不足！需要 ${course.cost.money}，当前：${agent.money}`, 'warning');
        return;
    }
    if (agent.energy < course.cost.energy) {
        showToast(`能量不足！需要 ${course.cost.energy}，当前：${agent.energy}`, 'warning');
        return;
    }

    // 扣资源
    agent.money -= course.cost.money;
    agent.energy -= course.cost.energy;

    // 获得技能点：根据课程范围随机
    const gained = course.skillRange.min + Math.floor(Math.random() * (course.skillRange.max - course.skillRange.min + 1));
    player.stageProgress += gained;

    // 获取当前阶段配置
    const stageConfig = STAGE_REQUIREMENTS[player.currentStage];
    let leveledUp = false;

    // 检查是否升级
    if (player.stageProgress >= stageConfig.points) {
        player.currentStage = stageConfig.next;
        player.stageProgress = 0;
        leveledUp = true;

        // 升级到B级时自动变为"可职业注册"状态（如果还没职业注册）
        if (player.debutStatus === '未职业注册' && (player.currentStage === 'B' || player.currentStage === 'B+' || player.currentStage === 'A')) {
            player.debutStatus = '可职业注册';
        }
    }

    // 同步显示级别到训练阶段
    player.级别 = player.currentStage;

    // 成功提示
    let message = `${player.name} 获得技能点 +${gained}！<br>当前进度：${Math.min(player.stageProgress, stageConfig.points)} / ${stageConfig.points}`;
    if (leveledUp) {
        message = `<strong style="color:#f6ad55">🎉 ${player.name} 晋升至 ${player.currentStage}！</strong>`;
        if (player.currentStage === 'B' && player.debutStatus === '可职业注册') {
            message += `<br><span style="color:#68d391">✨ 已达到职业注册资格！</span>`;
        }
    }

    // 显示弹窗 - 使用超高 z-index 确保在详情页上方
    Swal.fire({
        icon: 'success',
        title: '培训完成',
        html: `
            <div style="font-size: 0.9rem; text-align: center; padding: 5px 0;">
                <div style="color: #f56565; margin-bottom: 5px;">
                    <strong>消耗:</strong> ${course.cost.money}元, ${course.cost.energy}能量
                </div>
                <div style="color: #48bb78;">
                    <strong>获得:</strong> 技能点+${gained}
                </div>
                <div style="margin-top: 5px; font-size: 0.8rem; color: #f6ad55;">
                    课程效果: ${course.skillRange.min}~${course.skillRange.max}点
                </div>
                ${leveledUp ? `<div style="margin-top: 8px; padding: 6px; background: #fffbeb; border-radius: 6px; color: #92400e; font-size: 0.8rem;">
                    新级别: <strong>${player.currentStage}</strong>
                </div>` : ''}
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
        },
        didOpen: (modal) => {
            // 设置弹窗背景和弹窗本身的 z-index，确保在所有元素上方
            const backdrop = document.querySelector('.swal2-container');
            if (backdrop) {
                backdrop.style.zIndex = '99999';
            }
        }
    }).then(() => {
        // 弹窗关闭后再更新UI
        console.log('[培训弹窗] 用户确认，更新详情页');
        updateStatusBar(); // 更新顶部金钱/能量
        renderTrainingDetailPage(player); // 刷新详情页
    });
}



// ========== 信件系统 ==========


// 生成每年转会期总结报告的函数
// 生成每年转会期总结报告的函数
function generateSeasonEndReports() {
    const reports = [];
    
    // 获取当前游戏时间
    const currentTime = gameData.time;
    
    console.log(`当前时间: 第${currentTime.year}年 ${currentTime.season} 第${currentTime.day}天`);
        
    // 检查是否在转会期的30天生成当期的总结报告
    let targetYear = null;
    let targetSeason = null;
    
    if (currentTime.day === 30) {
        if (currentTime.season === '夏转会期') {
            targetYear = currentTime.year;
            targetSeason = '夏转会期';
        } else if (currentTime.season === '冬转会期') {
            targetYear = currentTime.year;
            targetSeason = '冬转会期';
        }
    }

    if (targetYear && targetSeason) {
        const reportId = `season-end-${targetSeason === '夏转会期' ? 'summer' : 'winter'}-${targetYear}`;

        // 先检查是否已经生成过，避免重复
        const isShown = gameData.letters.shownLetterIds && gameData.letters.shownLetterIds.includes(reportId);
        const isGenerated = gameData.letters.generatedLetters && gameData.letters.generatedLetters.some(l => l.id === reportId);
        
        if (!isShown && !isGenerated) {
            console.log(`生成第${targetYear}年${targetSeason}总结报告 (在第${currentTime.year}年${currentTime.season}的30天生成)`);
            
            reports.push({
                id: reportId,
                triggerYear: currentTime.year,
                triggerSeason: currentTime.season,
                triggerDay: currentTime.day,
                title: '工作结算报告',
                content: function () {
                    // 调用时明确指定结算的年份和赛季
                    const result = calculateSeasonScoreAndRank(targetYear, targetSeason);
                    const { playerScore, playerRank, allAgents, stats } = result;
                    const agent = gameData.agent;
                    
                    return `
                    <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
                        <p style="text-indent: 2em;">尊敬的经纪人 ${agent.name}，您好！</p>
                        
                        <p style="text-indent: 2em;">第${targetYear}年${targetSeason}已经圆满结束，荣耀经纪公会特此为您的表现制作了详细的数据报告：</p>
                        
                        <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 10px;">
                            <h3 style="margin: 0 0 15px 0; color: #92400e; text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
                                📊 ${targetSeason} 数据总结
                            </h3>
                            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">成功委托</div>
                                    <div style="font-size: 0.85rem; color: #10b981; font-weight: bold;">${stats.completedCommissions}次</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">累计佣金</div>
                                    <div style="font-size: 0.85rem; color: #dc2626; font-weight: bold;">${stats.totalReward}元</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">工作室资金</div>
                                    <div style="font-size: 0.85rem; color: #3b82f6; font-weight: bold;">${agent.money}元</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">S级选手</div>
                                    <div style="font-size: 0.85rem; color: #f97316; font-weight: bold;">${stats.sLevelCount}人</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">A级选手</div>
                                    <div style="font-size: 0.85rem; color: #8b5cf6; font-weight: bold;">${stats.aLevelCount}人</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">B级选手</div>
                                    <div style="font-size:  0.85rem; color: #3b82f6; font-weight: bold;">${stats.bLevelCount}人</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                    <div style="font-size: 0.85rem; color: #64748b;">业内声望</div>
                                    <div style="font-size: 0.85rem; color: #10b981; font-weight: bold;">${agent.attributes.声望}</div>
                                </div>
                            </div>
                            <div style="text-align: center; padding: 10px; background: rgba(255, 255, 255, 0.7); border-radius: 8px;">
                                <div style="font-size: 0.9rem; color: #92400e;">综合评分</div>
                                <div style="font-size: 2rem; color: #d97706; font-weight: bold;">${playerScore}</div>
                                <div style="font-size: 0.8rem; color: #92400e; margin-top: 5px;">
                                    (包含：委托${stats.completedCommissions}次×100分 + 佣金${Math.floor(stats.totalReward / 100)}分 + 声望${agent.attributes.声望}×5分 + S级${stats.sLevelCount}人×150分 + A级${stats.aLevelCount}人×80分 + B级${stats.bLevelCount}人×30分)
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #e0f2fe, #bae6fd); border: 2px solid #0ea5e9; border-radius: 10px;">
                            <h3 style="margin: 0 0 15px 0; color: #0c4a6e; text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
                                🏆 经纪人排行榜（第${targetYear}年，共${allAgents.length}人）
                            </h3>
                            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255, 255, 255, 0.9); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; font-weight: bold; color: #0c4a6e;">
                                    <span style="width: 40px;">名次</span>
                                    <span style="flex: 1; text-align: center;">经纪人</span>
                                    <span style="width: 80px; text-align: right;">分数</span>
                                </div>
                            </div>
                            ${allAgents.map((agent, index) => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: ${agent.isPlayer ? 'rgba(245, 158, 11, 0.2)' : index % 2 === 0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)'}; border-radius: 6px; margin-bottom: 5px; border-left: ${agent.isPlayer ? '4px solid #f59e0b' : 'none'};">
                                    <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                                        <span style="font-weight: bold; color: ${index < 3 ? '#dc2626' : agent.isPlayer ? '#92400e' : '#64748b'}; width: 40px; text-align: center;">
                                            ${index + 1}
                                            ${index < 3 ? ['🥇', '🥈', '🥉'][index] : ''}
                                        </span>
                                        <span style="color: ${agent.isPlayer ? '#92400e' : '#1e293b'}; font-weight: ${agent.isPlayer ? 'bold' : 'normal'};">
                                            ${agent.name}
                                        </span>
                                    </div>
                                    <span style="font-weight: bold; color: ${agent.isPlayer ? '#92400e' : '#475569'}; width: 80px; text-align: right;">
                                        ${agent.score}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <p style="text-indent: 2em;">您的当前排名<strong style="color: #92400e;">第${playerRank}名</strong>。</p>
                        
                        ${playerRank <= 3 ?
                            `<p style="text-indent: 2em; color: #dc2626; font-weight: bold;">🎉 恭喜您进入前三名！您的表现非常出色！</p>` :
                            playerRank <= 5 ?
                                `<p style="text-indent: 2em; color: #f59e0b; font-weight: bold;">✨ 排名前五，表现很不错！继续加油！</p>` :
                                playerRank <= 8 ?
                                    `<p style="text-indent: 2em; color: #10b981; font-weight: bold;">📈 排名中游，有很大的进步空间！</p>` :
                                    `<p style="text-indent: 2em; color: #64748b;">这只是开始，相信您下个赛季会取得更好的成绩！</p>`
                        }
                        
                        <p style="text-indent: 2em;">请继续努力，期待在下个转会期看到您更出色的表现！</p>
                        
                        <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;">
                            <p style="margin: 0; color: #92400e; font-weight: bold;">—— 荣耀经纪公会 数据统计部</p>
                            <p style="margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;">
                                第${currentTime.year}年 ${currentTime.season} 的30天
                            </p>
                        </div>
                    </div>
                `;
                },
                style: 'prestige',
                animation: 'glow',
                priority: 2
            });
        }
    }
    
    // 👉 新增：检查是否在春赛季或30天生成当期的分红信件
    if (currentTime.day === 30 && currentTime.season === '春赛季') {
        const dividendReportId = `season-dividend-spring-${currentTime.year}`;
        const isShown = gameData.letters.shownLetterIds && gameData.letters.shownLetterIds.includes(dividendReportId);
        const isGenerated = gameData.letters.generatedLetters && gameData.letters.generatedLetters.some(l => l.id === dividendReportId);
        
        if (!isShown && !isGenerated) {
            console.log(`生成第${currentTime.year}年春赛季分红信件`);
            reports.push({
                id: dividendReportId,
                triggerYear: currentTime.year,
                triggerSeason: currentTime.season,
                triggerDay: currentTime.day,
                title: '赛季选手表现奖金',
                content: function () {
                    const agent = gameData.agent;
                    // 👉 关键修改：使用固定的year值，而不是currentTime（避免时间变化导致数据不匹配）
                    const targetYear = currentTime.year;
                    const seasonKey = `${targetYear}-春赛季`;
                    
                    // 获取当前赛季的统计数据（在信件显示时实时读取）
                    const seasonData = gameData.seasonStats && gameData.seasonStats.seasons && gameData.seasonStats.seasons[seasonKey]
                        ? gameData.seasonStats.seasons[seasonKey]
                        : { reputationGain: 0, moneyGain: 0 };
                    
                    return `
                    <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
                        <p style="text-indent: 2em;">尊敬的经纪人 ${agent.name}，您好！</p>
                        
                        <p style="text-indent: 2em;">第${targetYear}年春赛季已经圆满落幕，您推荐的选手在赛场上表现出色，为战队争得了荣誉！</p>
                        
                        <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 2px solid #3b82f6; border-radius: 10px;">
                            <h3 style="margin: 0 0 15px 0; color: #1e3a8a; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                                🎉 春赛季选手表现奖励
                            </h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255, 255, 255, 0.8); border-radius: 6px;">
                                    <div style="font-size: 0.9rem; color: #475569;">🏆 选手赛场表现分红</div>
                                    <div style="font-size: 1.1rem; color: #dc2626; font-weight: bold;">+${seasonData.moneyGain}元</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255, 255, 255, 0.8); border-radius: 6px;">
                                    <div style="font-size: 0.9rem; color: #475569;">⭐ 业内声望提升</div>
                                    <div style="font-size: 1.1rem; color: #10b981; font-weight: bold;">+${seasonData.reputationGain}点</div>
                                </div>
                            </div>
                        </div>
                        
                        <p style="text-indent: 2em;">感谢您对选手们的精心培养和指导，您的专业能力得到了业界的认可！期待您在下个赛季继续为荣耀赛场输送优秀人才！</p>
                        
                        <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #3b82f6;">
                            <p style="margin: 0; color: #1e3a8a; font-weight: bold;">—— 荣耀联盟 财务部</p>
                            <p style="margin: 5px 0 0 0; color: #1e3a8a; opacity: 0.7; font-size: 0.9em;">
                                第${targetYear}年 春赛季 的30天
                            </p>
                        </div>
                    </div>
                `;
                },
                style: 'prestige',
                animation: 'glow',
                priority: 3
            });
        }
    }
    
    // 👉 新增：检查是否在秋赛季或30天生成当期的分红信件
    if (currentTime.day === 30 && currentTime.season === '秋赛季') {
        const dividendReportId = `season-dividend-autumn-${currentTime.year}`;
        const isShown = gameData.letters.shownLetterIds && gameData.letters.shownLetterIds.includes(dividendReportId);
        const isGenerated = gameData.letters.generatedLetters && gameData.letters.generatedLetters.some(l => l.id === dividendReportId);
        
        if (!isShown && !isGenerated) {
            console.log(`生成第${currentTime.year}年秋赛季分红信件`);
            reports.push({
                id: dividendReportId,
                triggerYear: currentTime.year,
                triggerSeason: currentTime.season,
                triggerDay: currentTime.day,
                title: '赛季选手表现奖金',
                content: function () {
                    const agent = gameData.agent;
                    // 👉 关键修改：使用固定的year值，而不是currentTime（避免时间变化导致数据不匹配）
                    const targetYear = currentTime.year;
                    const seasonKey = `${targetYear}-秋赛季`;
                    
                    // 获取当前赛季的统计数据（在信件显示时实时读取）
                    const seasonData = gameData.seasonStats && gameData.seasonStats.seasons && gameData.seasonStats.seasons[seasonKey]
                        ? gameData.seasonStats.seasons[seasonKey]
                        : { reputationGain: 0, moneyGain: 0 };
                    
                    return `
                    <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
                        <p style="text-indent: 2em;">尊敬的经纪人 ${agent.name}，您好！</p>
                        
                        <p style="text-indent: 2em;">第${targetYear}年秋赛季已经圆满落幕，您推荐的选手在赛场上表现出色，为战队争得了荣誉！</p>
                        
                        <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 10px;">
                            <h3 style="margin: 0 0 15px 0; color: #92400e; text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
                                🎉 秋赛季选手表现奖励
                            </h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255, 255, 255, 0.8); border-radius: 6px;">
                                    <div style="font-size: 0.9rem; color: #475569;">🏆 选手赛场表现分红</div>
                                    <div style="font-size: 1.1rem; color: #dc2626; font-weight: bold;">+${seasonData.moneyGain}元</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255, 255, 255, 0.8); border-radius: 6px;">
                                    <div style="font-size: 0.9rem; color: #475569;">⭐ 业内声望提升</div>
                                    <div style="font-size: 1.1rem; color: #10b981; font-weight: bold;">+${seasonData.reputationGain}点</div>
                                </div>
                            </div>
                        </div>
                        
                        <p style="text-indent: 2em;">感谢您对选手们的精心培养和指导，您的专业能力得到了业界的认可！期待您在下个赛季继续为荣耀赛场输送优秀人才！</p>
                        
                        <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #f59e0b;">
                            <p style="margin: 0; color: #92400e; font-weight: bold;">—— 荣耀联盟 财务部</p>
                            <p style="margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;">
                                第${targetYear}年 秋赛季 的30天
                            </p>
                        </div>
                    </div>
                `;
                },
                style: 'prestige',
                animation: 'glow',
                priority: 3
            });
        }
    }
    
    // 将生成的报告保存到 gameData 中
    if (reports.length > 0) {
        if (!gameData.letters.generatedLetters) {
            gameData.letters.generatedLetters = [];
        }
        // 检查避免重复添加
        reports.forEach(report => {
            const exists = gameData.letters.generatedLetters.some(r => r.id === report.id);
            if (!exists) {
                // 👉 关键修改：对于分红信件，保持content为函数，在显示时才执行
                // 这样能确保获取到最新的seasonStats数据（包括第30天的比赛分红）
                const processedReport = { ...report };
                
                // 只有非分红信件才立即执行函数
                if (typeof processedReport.content === 'function' && 
                    !report.id.includes('season-dividend')) {
                    processedReport.content = processedReport.content();
                }
                // 分红信件的content保持为函数，等待显示时再执行
                
                gameData.letters.generatedLetters.push(processedReport);
            }
        });
    }
    
    // 返回已生成的报告（从 gameData 中读取）
    return gameData.letters.generatedLetters || [];
}


// 生成每年春秋赛季开始第一天的信件函数
function generateSeasonStartLetters() {
    const letters = [];
    
    // 获取当前游戏时间
    const currentTime = gameData.time;
    
    // 在每个赛季/转会期的第1天当天生成对应的信件
    if (currentTime.day === 1) {
        const year = currentTime.year;
        const season = currentTime.season;
        
        console.log(`生成第${year}年${season}的信件`);

        // 春赛季开始信件
        if (season === '春赛季') {
            const seasonNum = year + 6;
            letters.push({
                id: `season-start-spring-${year}`,
                triggerYear: year,
                triggerSeason: '春赛季',
                triggerDay: 1,
                title: '新赛季开始了！',
                content: function () {
                    const agent = gameData.agent;
                    return `
                    <div style=\"font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;\">
                        <p style=\"text-indent: 2em;\">尊敬的经纪人 ${agent.name}，您好！</p>
                                
                        <p style=\"text-indent: 2em;\">第${year}年春赛季开始了！</p>
                            
                        <p style=\"text-indent: 2em;\">之前经由您推荐的选手在比赛中如果发挥出色，工作室会获得声望和奖金。</p>
                                
                        <p style=\"text-indent: 2em;\">祝您在新赛季中取得更好的成绩！</p>
                                
                        <div style=\"text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;\">
                            <p style=\"margin: 0; color: #92400e; font-weight: bold;\">—— 荣耀经纪公会</p>
                            <p style=\"margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;\">
                                第${year}年 春赛季 第1天
                            </p>
                        </div>
                    </div>
                `;
                }
            });
        }

        // 秋赛季开始信件
        if (season === '秋赛季') {
            const seasonNum = year + 7;
            letters.push({
                id: `season-start-autumn-${year}`,
                triggerYear: year,
                triggerSeason: '秋赛季',
                triggerDay: 1,
                title: '新赛季开始了！',
                content: function () {
                    const agent = gameData.agent;
                    return `
                    <div style=\"font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;\">
                        <p style=\"text-indent: 2em;\">尊敬的经纪人 ${agent.name}，您好！</p>
                        
                        <p style=\"text-indent: 2em;\">第${year}年秋赛季开始了！</p>
                        
                        <p style=\"text-indent: 2em;\">之前经由您推荐的选手在比赛中如果发挥出色，工作室会获得声望和奖金。</p>
                        
                        <p style=\"text-indent: 2em;\">祝您在新赛季中取得更好的成绩！</p>
                        
                        <div style=\"text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;\">
                            <p style=\"margin: 0; color: #92400e; font-weight: bold;\">—— 荣耀经纪公会</p>
                            <p style=\"margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;\">
                                第${year}年 秋赛季 第1天
                            </p>
                        </div>
                    </div>
                `;
                }
            });
        }

        // 冬转会期开始信件
        if (season === '冬转会期' && year > 1) {
            const seasonNum = year + 7;
            letters.push({
                id: `transfer-start-winter-${year}`,
                triggerYear: year,
                triggerSeason: '冬转会期',
                triggerDay: 1,
                title: '转会期开始了！',
                content: function () {
                    const agent = gameData.agent;
                    return `
                    <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
                        <p style="text-indent: 2em;">尊敬的经纪人 ${agent.name}，您好：</p>
                        <p style="text-indent: 2em;">第${year}年的冬季转会窗口现已正式开启。</p>
                        <p style="text-indent: 2em;">期待您以风雪般锐利的专业眼光，为俱乐部物色并推荐心仪的合适人选。请留意委托时效，按时完成各项洽谈。</p>
                        <p style="text-indent: 2em;">愿您在本转会期中运筹帷幄，收获满满。</p>                    
                        <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;">
                            <p style="margin: 0; color: #92400e; font-weight: bold;">—— 荣耀经纪公会</p>
                            <p style="margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;">
                                第${year}年 冬转会期 第1天
                            </p>
                        </div>
                    </div>
                `;
                }
            });
        }

        // 夏转会期开始信件
        if (season === '夏转会期') {
            const seasonNum = year + 6;
            letters.push({
                id: `transfer-start-summer-${year}`,
                triggerYear: year,
                triggerSeason: '夏转会期',
                triggerDay: 1,
                title: '转会期开始了！',
                content: function () {
                    const agent = gameData.agent;
                    return `
                    <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
                        <p style="text-indent: 2em;">尊敬的经纪人 ${agent.name}，您好：</p>
                        <p style="text-indent: 2em;">盛夏已至，第${year}年的夏季转会窗口现已火热开启。</p>
                        <p style="text-indent: 2em;">期待您以骄阳般的敏锐眼光，为俱乐部物色并引荐理想人选，为新赛季注入澎湃活力。请留意委托时效，及时推进各项洽谈。</p>
                        <p style="text-indent: 2em;">愿您在本转会期中乘风破浪，如盛夏耕耘，满载而归。</p>
                        
                        <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;">
                            <p style="margin: 0; color: #92400e; font-weight: bold;">—— 荣耀经纪公会</p>
                            <p style="margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;">
                                第${year}年 夏转会期 第1天
                            </p>
                        </div>
                    </div>
                `;
                }
            });
        }
    }

    // 将生成的信件保存到 gameData 中
    if (letters.length > 0) {
        if (!gameData.letters.generatedStartLetters) {
            gameData.letters.generatedStartLetters = [];
        }
        // 检查避免重复添加
        letters.forEach(letter => {
            const exists = gameData.letters.generatedStartLetters.some(l => l.id === letter.id);
            if (!exists) {
                // ✅ 关键修复：在存入 gameData 前先执行 content 函数，将其转为字符串
                // 这样存档时内容才不会丢失（JSON 不支持存储函数）
                const processedLetter = { ...letter };
                if (typeof processedLetter.content === 'function') {
                    processedLetter.content = processedLetter.content();
                }
                gameData.letters.generatedStartLetters.push(processedLetter);
            }
        });
    }
    
    // 返回已生成的信件（从 gameData 中读取）
    return gameData.letters.generatedStartLetters || [];
}


// 检查是否应该显示信件
function checkForLetters() {
    console.log('=== 检查信件开始 ===');
    console.log('当前时间:', gameData.time);
    
    const currentTime = gameData.time;

    // 获取基础信件配置、动态生成的转会期报告和赛季开始信件
    const baseLetters = typeof LETTER_CONFIGS !== 'undefined' ? LETTER_CONFIGS : [];
    console.log('基础信件数量:', baseLetters.length);
    
    const seasonEndReports = generateSeasonEndReports();
    console.log('转会期总结报告数量:', seasonEndReports.length);
    
    const seasonStartLetters = generateSeasonStartLetters();
    console.log('赛季开始信件数量:', seasonStartLetters.length);

    // 合并所有信件配置
    const allLetters = [...baseLetters, ...seasonEndReports, ...seasonStartLetters];
    console.log('总共信件数量:', allLetters.length);

    // 按优先级排序
    const sortedLetters = allLetters.sort((a, b) => (a.priority || 99) - (b.priority || 99));

    // 检查所有信件配置
    sortedLetters.forEach(letter => {
       // console.log('检查信件:', letter.id, '触发时间:', letter.triggerYear, letter.triggerSeason, letter.triggerDay);
        
        // 跳过已显示的信件
        if (gameData.letters.shownLetterIds.includes(letter.id)) {
           // console.log('跳过已显示的信件:', letter.id);
            return;
        }

        // 检查触发条件
        const timeMatches =
            currentTime.year === letter.triggerYear &&
            currentTime.season === letter.triggerSeason &&
            currentTime.day === letter.triggerDay;
            
        // console.log('时间匹配结果:', timeMatches, 
        //       '年份:', currentTime.year === letter.triggerYear,
        //       '赛季:', currentTime.season === letter.triggerSeason,
        //       '日期:', currentTime.day === letter.triggerDay);

        // 检查额外条件（如果有）
        const conditionMatches = !letter.condition || letter.condition();
       // console.log('条件匹配结果:', conditionMatches);

        if (timeMatches && conditionMatches) {
            console.log('满足条件，显示信件:', letter.id, letter.title);
            // 显示信件
            showLetter(letter);
            // 记录已显示
            gameData.letters.shownLetterIds.push(letter.id);

        } else {
            console.log('不满足条件，跳过:', letter.id);
        }
    });
    
    console.log('=== 检查信件结束 ===');
}




// 显示信件
// 显示信件
function showLetter(letter) {
    console.log('显示信件:', letter.id, 'content类型:', typeof letter.content);

    // ✅ 关键修改：立即执行函数获取内容
    let letterContent;
    try {
        if (typeof letter.content === 'function') {
            console.log('执行信件函数...');
            letterContent = letter.content();
        } else {
            letterContent = letter.content;
        }
        console.log('信件内容类型:', typeof letterContent, '长度:', letterContent?.length);
    } catch (error) {
        console.error('执行信件内容失败:', error);
        letterContent = '<div style="color: #dc2626; text-align: center; padding: 20px;">信件内容加载失败</div>';
    }

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'letter-overlay';

    // 创建信封容器
    const envelope = document.createElement('div');
    envelope.className = 'letter-envelope pop-in';

    // 信封关闭状态
    const envelopeClosed = document.createElement('div');
    envelopeClosed.className = 'letter-closed';

    envelopeClosed.innerHTML = `
        <div class="envelope-icon">✉️</div>
        <h3 class="envelope-title">${letter.title}</h3>
        <p class="envelope-subtitle">点击信封查看</p>
    `;

    // 信封打开状态（初始隐藏）
    const envelopeOpen = document.createElement('div');
    envelopeOpen.className = 'letter-open';
    envelopeOpen.style.display = 'none'; // 初始隐藏

    // ✅ 使用 letterContent 而不是 letter.content
    envelopeOpen.innerHTML = `
        <div class="letter-paper">
            <div class="letter-header">
                <h2 class="letter-title">${letter.title}</h2>
            </div>
            
            <div class="letter-content">
                ${letterContent}
            </div>           
            
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button class="letter-close-btn">收起信件</button>
        </div>
    `;

    // 点击信封展开
    envelope.addEventListener('click', function (e) {
        if (e.target.closest('.letter-close-btn')) return;

        if (envelopeOpen.style.display === 'none') {
            // 展开动画
            envelope.classList.remove('pop-in');
            envelope.style.transform = 'scale(1)';
            envelopeClosed.style.display = 'none';
            envelopeOpen.style.display = 'block';
        }
    });

    // 关闭按钮事件
    const closeBtnHandler = function () {
        // 收起动画
        envelopeOpen.classList.add('collapsing');
        setTimeout(() => {
            envelopeOpen.style.display = 'none';
            envelopeClosed.style.display = 'block';
            envelope.style.transform = 'scale(0.9)';
            envelopeOpen.classList.remove('collapsing');
        }, 350);
    };

    // 点击遮罩层关闭（展开状态下）
    const closeOverlay = function () {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    };

    // 添加到DOM
    envelope.appendChild(envelopeClosed);
    envelope.appendChild(envelopeOpen);
    overlay.appendChild(envelope);
    document.body.appendChild(overlay);

    // 关闭按钮事件委托
    envelope.addEventListener('click', function (e) {
        if (e.target.classList.contains('letter-close-btn') || e.target.closest('.letter-close-btn')) {
            closeBtnHandler();
            setTimeout(closeOverlay, 100);
        }
    });

    // 点击遮罩层关闭（展开状态下）
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay && envelopeOpen.style.display === 'block') {
            closeBtnHandler();
            setTimeout(closeOverlay, 100);
        }
    });

    // ESC键关闭
    const escHandler = function (e) {
        if (e.key === 'Escape') {
            if (envelopeOpen.style.display === 'block') {
                closeBtnHandler();
                setTimeout(closeOverlay, 100);
            } else {
                closeOverlay();
            }
            document.removeEventListener('keydown', escHandler);
        }
    };

    document.addEventListener('keydown', escHandler);
}





// 赛季结算计算函数
// 赛季结算计算函数 - 第一名10000分版本
// 在 calculateSeasonScoreAndRank 函数中添加详细的调试信息
// 赛季结算计算函数 - 完整版
function calculateSeasonScoreAndRank(targetYear, targetSeason) {
    const agent = gameData.agent;
    const currentYear = targetYear || gameData.time.year;
    const currentSeason = targetSeason || gameData.time.season;

    console.log('=== calculateSeasonScoreAndRank 开始 ===');
    console.log('目标年份:', currentYear, '目标赛季:', currentSeason);

    // 1. 计算玩家数据 - 统计所有已完成的委托（不再限制于特定年份和赛季）
    const completedCommissions = gameData.commissions.filter(c => {
        return c.status === 'completed';
    });
    console.log('已完成委托数量:', completedCommissions.length);

    let sLevelCount = 0;
    let aLevelCount = 0;
    let bLevelCount = 0;
    let otherLevels = [];

    // 详细统计选手级别
    completedCommissions.forEach((commission, index) => {
        console.log(`\n[委托${index + 1}] ID: ${commission.id}, 战队: ${commission.team}`);
        console.log(`  选手名称: ${commission.assignedPlayer}`);

        const player = gameData.players.find(p => p.name === commission.assignedPlayer);
        if (player) {
            console.log(`  找到选手: ${player.name}, 级别: "${player.级别}"`);

            // 确保级别字段存在
            if (!player.级别) {
                console.log(`  警告: 选手没有级别字段`);
                return;
            }

            const level = String(player.级别).trim();

            if (level === 'S') {
                sLevelCount++;
                console.log(`  → 统计为S级 (累计: ${sLevelCount})`);
            } else if (level === 'A' || level === 'A+') {
                aLevelCount++;
                console.log(`  → 统计为A级 (累计: ${aLevelCount})`);
            } else if (level === 'B' || level === 'B+') {
                bLevelCount++;
                console.log(`  → 统计为B级 (累计: ${bLevelCount})`);
            } else if (level === 'C' || level === 'D') {
                console.log(`  → C/D级选手，不计入高级统计`);
            } else {
                otherLevels.push({ name: player.name, level: level });
                console.log(`  → 未知级别: "${level}"`);
            }
        } else {
            console.log(`  错误: 找不到选手 "${commission.assignedPlayer}"`);
        }
    });

    console.log('\n=== 级别统计结果 ===');
    console.log(`S级选手: ${sLevelCount}人`);
    console.log(`A/A+级选手: ${aLevelCount}人`);
    console.log(`B/B+级选手: ${bLevelCount}人`);
    if (otherLevels.length > 0) {
        console.log('其他级别:', otherLevels);
    }

    const totalReward = completedCommissions.reduce((sum, c) => sum + c.reward, 0);

    // 2. 计算玩家分数
    // 分数构成：
    // - 成功委托：每个50分
    // - 累计佣金：每100元1分
    // - 声望：每点3分
    // - S级选手：每个150分
    // - A级选手：每个80分
    // - B级选手：每个30分
    const playerScore =
        completedCommissions.length * 100 +
        Math.floor(totalReward / 100) +
        agent.attributes.声望 * 5 +
        sLevelCount * 150 +
        aLevelCount * 80 +
        bLevelCount * 30;

    // console.log('\n=== 玩家分数计算 ===');
    // console.log(`委托得分: ${completedCommissions.length} × 50 = ${completedCommissions.length * 50}`);
    // console.log(`佣金得分: ${totalReward} ÷ 100 = ${Math.floor(totalReward / 100)}`);
    // console.log(`声望得分: ${agent.attributes.声望} × 3 = ${agent.attributes.声望 * 3}`);
    // console.log(`S级选手得分: ${sLevelCount} × 150 = ${sLevelCount * 150}`);
    // console.log(`A级选手得分: ${aLevelCount} × 80 = ${aLevelCount * 80}`);
    // console.log(`B级选手得分: ${bLevelCount} × 30 = ${bLevelCount * 30}`);
    // console.log(`总分: ${playerScore}`);

    // 3. 模拟其他经纪人（9个，加上玩家共10个）
    const otherAgentNames = [
        '辉煌经纪人', '星耀工作室', '巅峰联盟', '荣耀之星', '转会大师',
        '金牌转会官', '荣耀猎头', '选手经纪人', '转会专家'
    ];

    // 4. 生成其他经纪人分数（第一名15000分，依次递减1000分）
    const otherAgents = otherAgentNames.map((name, index) => {
        // 第一名15000分，每个名次递减1000分
        const baseScore = 12000 - (index * 1000);

        // 添加随机波动（±500分）
        const randomFluctuation = Math.floor(Math.random() * 1001) - 500;
        let score = Math.max(1000, baseScore + randomFluctuation);

        // 确保分数在合理范围内
        score = Math.min(12000, Math.max(500, score));

        // 模拟其他数据（基于分数比例）
        const scoreRatio = score / 15000;
        const completed = Math.floor(60 * scoreRatio); // 最多60个委托
        const money = Math.floor(80000 * scoreRatio); // 最多8万资金
        const reputation = Math.floor(150 * scoreRatio); // 最多150声望
        const sCount = Math.floor(12 * scoreRatio); // 最多12个S级
        const aCount = Math.floor(25 * scoreRatio); // 最多25个A级

        return {
            name: name,
            completedCommissions: completed,
            totalReward: Math.floor(800000 * scoreRatio),
            money: money,
            reputation: reputation,
            sLevelCount: sCount,
            aLevelCount: aCount,
            bLevelCount: Math.floor(40 * scoreRatio),
            score: score
        };
    });

    // console.log('\n=== 其他经纪人分数 ===');
    // otherAgents.forEach((agent, index) => {
    //     console.log(`${index + 1}. ${agent.name}: ${agent.score}分`);
    // });

    // 5. 将玩家加入列表（使用实际分数，不人为调整）
    const playerAgent = {
        name: `${agent.name}（您）`,
        isPlayer: true,
        completedCommissions: completedCommissions.length,
        totalReward: totalReward,
        money: agent.money,
        reputation: agent.attributes.声望,
        sLevelCount: sLevelCount,
        aLevelCount: aLevelCount,
        bLevelCount: bLevelCount,
        score: playerScore  // 使用实际计算的分数，不进行人为调整
    };

    // 将玩家和其他经纪人合并
    const allAgents = [...otherAgents, playerAgent];

    // 6. 按分数排序（真实排名）
    allAgents.sort((a, b) => b.score - a.score);

    // 7. 计算玩家实际排名
    const playerRank = allAgents.findIndex(a => a.isPlayer) + 1;

    // console.log('\n=== 最终排名结果 ===');
    // console.log(`玩家最终分数: ${targetPlayerScore}`);
    // console.log(`玩家最终排名: 第${playerRank}名`);
    // console.log('\n最终排行榜:');
    allAgents.forEach((agent, index) => {
        const mark = agent.isPlayer ? '★' : '';
       // console.log(`${index + 1}. ${agent.name}${mark}: ${agent.score}分`);
    });

    const result = {
        playerScore: playerAgent.score,
        playerRank: playerRank,
        allAgents: allAgents,
        playerAgent: playerAgent,
        stats: {
            completedCommissions: completedCommissions.length,
            totalReward: totalReward,
            sLevelCount: sLevelCount,
            aLevelCount: aLevelCount,
            bLevelCount: bLevelCount,
            currentYear: currentYear,
            currentSeason: currentSeason
        }
    };

    // console.log('\n=== 返回结果 ===');
    // console.log(result.stats);
    // console.log('====================\n');

    return result;
}

// 辅助函数：根据年份和排名生成激励语
function getEncouragementMessage(year, rank) {
    const messages = {
        1: { // 第一年
            top3: "🎉 作为新人经纪人，第一年就进入前三名，简直是天才！",
            top5: "✨ 第一年就排名前五，未来可期！",
            top8: "📈 不错的开局，继续努力会更好！",
            default: "💪 这是你的第一年，积累了宝贵经验！"
        },
        2: { // 第二年
            top3: "🏆 第二年就进入前三，你正在成为传奇！",
            top5: "🔥 稳居前五，职业道路越走越宽！",
            top8: "🚀 进步明显，离顶尖不远了！",
            default: "📊 持续进步，明年会更好！"
        },
        3: { // 第三年
            top3: "👑 连续三年顶尖，你是业界的标杆！",
            top5: "💎 稳定前五，金牌经纪人实至名归！",
            top8: "🌟 保持中上游，潜力无限！",
            default: "🎯 积累足够，明年冲击更高排名！"
        }
    };

    const yearMessages = messages[year] || messages[3];

    if (rank <= 3) return yearMessages.top3;
    if (rank <= 5) return yearMessages.top5;
    if (rank <= 8) return yearMessages.top8;
    return yearMessages.default;
}
