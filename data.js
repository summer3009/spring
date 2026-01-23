// 游戏数据
let gameData = {
    agent: {
        name: "天才经纪人",
        studioName: "春日工作室",
        money: 5000,
        energy: 10,
        attributes: {
            谈判技巧: 50,
            社交能力: 50,
            魅力: 50,
            声望: 50
        },
        contacts: []
    },
    time: {
        year: 1,
        season: "冬转会期",
        day: 1
    },
    letters: {
        shownLetterIds: [],  // 进度数据：已显示的信件ID
        generatedLetters: [],  // 动态生成的转会期总结报告
        generatedStartLetters: []  // 动态生成的赛季开始信件
    },
    publishedNews: [],  // 👈 新增：用于存放所有已发布的动态新闻
    specialDialogues: [], // 👈 新增：用于存放特殊对话触发记录
    dialogueHistory: {},  // 👈 新增：用于存放对话历史
    settings: {
        musicEnabled: true  // 添加音乐设置
    },
    // 👉 新增：赛季统计数据，用于记录每个赛季的声望和金钱增加
    seasonStats: {
        currentSeasonKey: null, // 当前赛季标识 如 "1-春赛季"
        seasons: {} // 存储每个赛季的统计数据 {"1-春赛季": {reputationGain: 0, moneyGain: 0}}
    },
    // 核心动态数据（初始为空数组）
    players: [],          // ← 空数组，等待 initNewGameData 或 loadGame 填充
    teams: [],            // ← 空数组
};

// 初始委托配置
const INITIAL_COMMISSIONS = [

    //第1年 冬转会期 （8赛季中）
    {
        id: "commission-001",
        team: "嘉世",
        type: "main",
        // 时间属性
        newsTime: { year: 1, season: "冬转会期", day: 2 },
        startTime: { year: 1, season: "冬转会期", day: 4 },
        acceptDeadline: { year: 1, season: "冬转会期", day: 12 },
        negotiationDeadline: { year: 1, season: "冬转会期", day: 16 },
        endTime: { year: 1, season: "冬转会期", day: 28 },
        // 资金属性
        deposit: 1000,
        reward: 20000,
        // 时间记录
        acceptedTime: null,      // 接受时间
        negotiationStartTime: null, // 协商开始时间
        completedTime: null,     // 完成时间
        failureTime: null,       // 失败时间（使用failureTime）
        // 失败信息
        failureReason: null,     // 失败原因
        // 委托要求
        requirements: {
            谈判技巧: 60,
            声望: 60
        },
        playerReq: {
            职业: "战斗法师",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】嘉世有意向招募战斗法师选手，要求经纪人谈判技巧>60且声望>60。",
        // 选手信息
        primaryPlayer: "孙翔",
        backupPlayers: [],
        assignedPlayer: null,    // 分配/选择的选手
        // 状态和数据
        status: "available",     // available, accepted, negotiating, completed, failed, expired
        negotiationData: null    // 协商数据
    },

    // 第2年春赛季  兴欣招 唐柔 包子 魏琛
    {
        id: "commission-004-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "春赛季", day: 3 },
        startTime: { year: 2, season: "春赛季", day: 5 },
        acceptDeadline: { year: 2, season: "春赛季", day: 12 },
        negotiationDeadline: { year: 2, season: "春赛季", day: 20 },
        endTime: { year: 2, season: "春赛季", day: 26 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 110,
            社交能力: 95
        },
        playerReq: {
            职业: "战斗法师",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】很新但是很厉害的兴欣战队正在寻找优秀的战斗法师加入，需谈判技巧>110且社交能力>95。",
        // 选手信息
        primaryPlayer: "唐柔",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    {
        id: "commission-005-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "春赛季", day: 6 },
        startTime: { year: 2, season: "春赛季", day: 8 },
        acceptDeadline: { year: 2, season: "春赛季", day: 13 },
        negotiationDeadline: { year: 2, season: "春赛季", day: 21 },
        endTime: { year: 2, season: "春赛季", day: 27 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            社交能力: 98,
            魅力: 92
        },
        playerReq: {
            职业: "流氓",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】冉冉升起的兴欣战队希望找到一名顶级的流氓选手，需要经纪人具备社交能力>98和魅力>92。",
        // 选手信息
        primaryPlayer: "包荣兴",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    {
        id: "commission-008-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "春赛季", day: 14 },
        startTime: { year: 2, season: "春赛季", day: 15 },
        acceptDeadline: { year: 2, season: "春赛季", day: 19 },
        negotiationDeadline: { year: 2, season: "春赛季", day: 23 },
        endTime: { year: 2, season: "春赛季", day: 28 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 80,
            魅力: 75
        },
        playerReq: {
            职业: "术士",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】兴欣需要一名经验丰富的术士（越老越好），要求经纪人具备谈判技巧>80和魅力值>75。",
        // 选手信息
        primaryPlayer: "魏琛",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    // 第2年夏转会期，嘉世肖时钦、霸图林敬言 张佳乐、呼啸唐昊招人

    //唐昊
    {
        id: "commission-005-hx",
        team: "呼啸",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "夏转会期", day: 2 },
        startTime: { year: 2, season: "夏转会期", day: 4 },
        acceptDeadline: { year: 2, season: "夏转会期", day: 12 },
        negotiationDeadline: { year: 2, season: "夏转会期", day: 22 },
        endTime: { year: 2, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 2200,
        reward: 40000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            声望: 130,
            魅力: 100
        },
        playerReq: {
            职业: "流氓",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】呼啸有意向招募顶尖流氓选手，要求经纪人声望>130且魅力>100。",
        // 选手信息
        primaryPlayer: "唐昊",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    // 肖时钦
    {
        id: "commission-002-js",
        team: "嘉世",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "夏转会期", day: 1 },
        startTime: { year: 2, season: "夏转会期", day: 3 },
        acceptDeadline: { year: 2, season: "夏转会期", day: 10 },
        negotiationDeadline: { year: 2, season: "夏转会期", day: 20 },
        endTime: { year: 2, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 4000,
        reward: 60000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 110,
            社交能力: 100
        },
        playerReq: {
            职业: "机械师",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】嘉世有意向招募机械师选手，要求经纪人谈判技巧>90且社交能力>100。",
        // 选手信息
        primaryPlayer: "肖时钦",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    // 林敬言   
    {
        id: "commission-003-bt",
        team: "霸图",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "夏转会期", day: 10 },
        startTime: { year: 2, season: "夏转会期", day: 12 },
        acceptDeadline: { year: 2, season: "夏转会期", day: 16 },
        negotiationDeadline: { year: 2, season: "夏转会期", day: 26 },
        endTime: { year: 2, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 2300,
        reward: 35000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 100,
            魅力: 100
        },
        playerReq: {
            职业: "流氓",
            级别: "A+"
        },
        newscontent: "【⭐重磅招募】霸图有意向招募有丰富经验的流氓选手，要求经纪人谈判技巧>100且魅力>100。",
        // 选手信息
        primaryPlayer: "林敬言",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    // 张佳乐
    {
        id: "commission-004-bt",
        team: "霸图",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "夏转会期", day: 7 },
        startTime: { year: 2, season: "夏转会期", day: 9 },
        acceptDeadline: { year: 2, season: "夏转会期", day: 15 },
        negotiationDeadline: { year: 2, season: "夏转会期", day: 25 },
        endTime: { year: 2, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 2500,
        reward: 35000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 90,
            声望: 120
        },
        playerReq: {
            职业: "弹药专家",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】霸图有意向招募顶尖弹药专家，要求经纪人谈判技巧>90且声望>120。",
        // 选手信息
        primaryPlayer: "张佳乐",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    //雷霆 刘皓
    {
        id: "commission-001-lt",
        team: "雷霆",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "夏转会期", day: 17 },
        startTime: { year: 2, season: "夏转会期", day: 19 },
        acceptDeadline: { year: 2, season: "夏转会期", day: 22 },
        negotiationDeadline: { year: 2, season: "夏转会期", day: 28 },
        endTime: { year: 2, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 2000,
        reward: 30000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 140,
            社交能力: 90
        },
        playerReq: {
            职业: "魔剑士",
            级别: "B+"
        },
        newscontent: "【⭐重磅招募】雷霆有意向招募魔剑士选手，要求经纪人谈判技巧>140且社交能力>90。",
        // 选手信息
        primaryPlayer: "刘皓",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },



    //第2年秋赛季

    //安文逸
    {
        id: "commission-007-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "秋赛季", day: 5 },
        startTime: { year: 2, season: "秋赛季", day: 7 },
        acceptDeadline: { year: 2, season: "秋赛季", day: 15 },
        negotiationDeadline: { year: 2, season: "秋赛季", day: 23 },
        endTime: { year: 2, season: "秋赛季", day: 28 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            声望: 125,
            社交能力: 80
        },
        playerReq: {
            职业: "牧师",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】人越来越多的兴欣需要一名可靠的牧师（最好出身霸图公会），要求经纪人具备声望>125和社交能力>80。",
        // 选手信息
        primaryPlayer: "安文逸",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    //罗辑
    {
        id: "commission-009-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "秋赛季", day: 5 },
        startTime: { year: 2, season: "秋赛季", day: 7 },
        acceptDeadline: { year: 2, season: "秋赛季", day: 15 },
        negotiationDeadline: { year: 2, season: "秋赛季", day: 25 },
        endTime: { year: 2, season: "秋赛季", day: 28 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 75,
            魅力: 70
        },
        playerReq: {
            职业: "召唤师",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】水平很高的兴欣需要一名有潜力的召唤师（最好会微积分），要求经纪人具备谈判技巧>75和魅力值>70。",
        // 选手信息
        primaryPlayer: "罗辑",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    //罗辑
    {
        id: "commission-010-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "秋赛季", day: 15 },
        startTime: { year: 2, season: "秋赛季", day: 17 },
        acceptDeadline: { year: 2, season: "秋赛季", day: 25 },
        negotiationDeadline: { year: 2, season: "秋赛季", day: 27 },
        endTime: { year: 2, season: "秋赛季", day: 28 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 95,
            魅力: 90
        },
        playerReq: {
            职业: "忍者",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】从不欺负人的兴欣需要一名有潜力的忍者（要求丰富网游经验），要求经纪人具备谈判技巧>95和魅力值>90。",
        // 选手信息
        primaryPlayer: "莫凡",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    //孙哲平
    {
        id: "commission-015-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "秋赛季", day: 16 },
        startTime: { year: 2, season: "秋赛季", day: 18 },
        acceptDeadline: { year: 2, season: "秋赛季", day: 23 },
        negotiationDeadline: { year: 2, season: "秋赛季", day: 26 },
        endTime: { year: 2, season: "秋赛季", day: 29 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 120,
            声望: 160
        },
        playerReq: {
            职业: "狂剑士",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】运气爆棚的兴欣有意向招募顶尖狂剑士（2赛季出道的最佳），要求经纪人谈判技巧>120且声望>160。",
        // 选手信息
        primaryPlayer: "孙哲平",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },



    //第2年冬转会期：许斌，乔一帆，李亦辉，苏沐橙

    //乔一帆
    {
        id: "commission-011-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "冬转会期", day: 2 },
        startTime: { year: 2, season: "冬转会期", day: 4 },
        acceptDeadline: { year: 2, season: "冬转会期", day: 15 },
        negotiationDeadline: { year: 2, season: "冬转会期", day: 20 },
        endTime: { year: 2, season: "冬转会期", day: 24 },
        // 资金属性
        deposit: 0,
        reward: 1000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 120,
            社交能力: 160
        },
        playerReq: {
            职业: "鬼剑士",
            级别: "B"
        },
        newscontent: "【⭐战队招募啦！】马上也要成为大厂的兴欣需要一名强力的鬼剑士（有北上广大厂工作经历最佳），要求经纪人具备谈判技巧>120和社交能力>160。",
        // 选手信息
        primaryPlayer: "乔一帆",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    // 于锋
    {
        id: "commission-006-bh",
        team: "百花",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "冬转会期", day: 14 },
        startTime: { year: 2, season: "冬转会期", day: 15 },
        acceptDeadline: { year: 2, season: "冬转会期", day: 21 },
        negotiationDeadline: { year: 2, season: "冬转会期", day: 27 },
        endTime: { year: 2, season: "冬转会期", day: 28 },
        // 资金属性
        deposit: 3400,
        reward: 55000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 130,
            魅力: 100
        },
        playerReq: {
            职业: "狂剑士",
            级别: "A+"
        },
        newscontent: "【⭐重磅招募】百花有意向招募顶尖狂剑士选手，要求经纪人谈判技巧>100且魅力>95。",
        // 选手信息
        primaryPlayer: "于锋",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    //许斌
    {
        id: "commission-011-wc",
        team: "微草",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "冬转会期", day: 6 },
        startTime: { year: 2, season: "冬转会期", day: 8 },
        acceptDeadline: { year: 2, season: "冬转会期", day: 13 },
        negotiationDeadline: { year: 2, season: "冬转会期", day: 19 },
        endTime: { year: 2, season: "冬转会期", day: 28 },
        // 资金属性
        deposit: 3400,
        reward: 50000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 170,
            魅力: 125
        },
        playerReq: {
            职业: "骑士",
            级别: "A"
        },
        newscontent: "【⭐重磅招募】微草有意向招募顶尖骑士，要求经纪人谈判技巧>170且魅力>125。",
        // 选手信息
        primaryPlayer: "许斌",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    //李亦辉
    {
        id: "commission-012-sly",
        team: "三零一",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "冬转会期", day: 14 },
        startTime: { year: 2, season: "冬转会期", day: 16 },
        acceptDeadline: { year: 2, season: "冬转会期", day: 19 },
        negotiationDeadline: { year: 2, season: "冬转会期", day: 22 },
        endTime: { year: 2, season: "冬转会期", day: 28 },
        // 资金属性
        deposit: 4200,
        reward: 50000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 130,
            魅力: 150
        },
        playerReq: {
            职业: "柔道家",
            级别: "A"
        },
        newscontent: "【⭐重磅招募】三零一有意向招募柔道家，要求经纪人谈判技巧>130且魅力>150。",
        // 选手信息
        primaryPlayer: "李亦辉",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    //苏沐橙
    {
        id: "commission-006-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 2, season: "冬转会期", day: 13 },
        startTime: { year: 2, season: "冬转会期", day: 15 },
        acceptDeadline: { year: 2, season: "冬转会期", day: 20 },
        negotiationDeadline: { year: 2, season: "冬转会期", day: 26 },
        endTime: { year: 2, season: "冬转会期", day: 28 },
        // 资金属性
        deposit: 2000,
        reward: 30000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 130,
            魅力: 130
        },
        playerReq: {
            职业: "枪炮师",
            级别: "S"
        },
        newscontent: "【⭐战队招募啦！】宇宙第一的兴欣战队需要一名强力的枪炮师（只要苏沐橙）需要经纪人具备谈判技巧>110和魅力值>110。",
        // 选手信息
        primaryPlayer: "苏沐橙",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },


    //第3年春赛季：舒可欣，舒可怡
    //舒可欣
    {
        id: "commission-016-yy",
        team: "烟雨",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "春赛季", day: 17 },
        startTime: { year: 3, season: "春赛季", day: 22 },
        acceptDeadline: { year: 3, season: "春赛季", day: 25 },
        negotiationDeadline: { year: 3, season: "春赛季", day: 27 },
        endTime: { year: 3, season: "春赛季", day: 28 },
        // 资金属性
        deposit: 5200,
        reward: 60000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 125,
            魅力: 130
        },
        playerReq: {
            职业: "神枪手",
            级别: "B+"
        },
        newscontent: "【⭐重磅招募】烟雨有意向招募神枪手1，要求经纪人谈判技巧>125且魅力>130。",
        // 选手信息
        primaryPlayer: "舒可欣",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    //舒可怡
    {
        id: "commission-017-yy",
        team: "烟雨",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "春赛季", day: 17 },
        startTime: { year: 3, season: "春赛季", day: 22 },
        acceptDeadline: { year: 3, season: "春赛季", day: 24 },
        negotiationDeadline: { year: 3, season: "春赛季", day: 26 },
        endTime: { year: 3, season: "春赛季", day: 28 },
        // 资金属性
        deposit: 5200,
        reward: 60000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            声望: 140,
            社交能力: 110
        },
        playerReq: {
            职业: "神枪手",
            级别: "B+"
        },
        newscontent: "【⭐重磅招募】烟雨有意向再招募一个神枪手2，要求经纪人声望>140且社交能力>110。",
        // 选手信息
        primaryPlayer: "舒可怡",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },


    //第3 年 夏转会期 轮回孙翔 雷霆肖时钦，三零一白庶，兴欣方锐,呼啸刘皓
    // 轮回孙翔
    {
        id: "commission-012-lh",
        team: "轮回",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "夏转会期", day: 2 },
        startTime: { year: 3, season: "夏转会期", day: 4 },
        acceptDeadline: { year: 3, season: "夏转会期", day: 12 },
        negotiationDeadline: { year: 3, season: "夏转会期", day: 18 },
        endTime: { year: 3, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 6800,
        reward: 80000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 165,
            社交能力: 180
        },
        playerReq: {
            职业: "战斗法师",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】轮回有意向招募顶尖战斗法师，要求经纪人谈判技巧>125且魅力>130。",
        // 选手信息
        primaryPlayer: "孙翔",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    // 雷霆肖时钦
    {
        id: "commission-013-lt",
        team: "雷霆",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "夏转会期", day: 12 },
        startTime: { year: 3, season: "夏转会期", day: 14 },
        acceptDeadline: { year: 3, season: "夏转会期", day: 20 },
        negotiationDeadline: { year: 3, season: "夏转会期", day: 26 },
        endTime: { year: 3, season: "夏转会期", day: 28 },
        // 资金属性
        deposit: 3600,
        reward: 50000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 200,
            声望: 160
        },
        playerReq: {
            职业: "机械师",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】雷霆有意向招募顶尖机械师，要求经纪人谈判技巧>130且声望>160。",
        // 选手信息
        primaryPlayer: "肖时钦",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },
    {
        id: "commission-014-sly",
        team: "三零一",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "夏转会期", day: 10 },
        startTime: { year: 3, season: "夏转会期", day: 12 },
        acceptDeadline: { year: 3, season: "夏转会期", day: 17 },
        negotiationDeadline: { year: 3, season: "夏转会期", day: 23 },
        endTime: { year: 3, season: "夏转会期", day: 27 },
        // 资金属性
        deposit: 8500,
        reward: 58000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 190,
            魅力: 200
        },
        playerReq: {
            职业: "骑士",
            级别: "A"
        },
        newscontent: "【⭐重磅招募】三零一有意向招募顶尖骑士，要求经纪人谈判技巧>130且魅力>130。",
        // 选手信息
        primaryPlayer: "白庶",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },

    //方锐
    {
        id: "commission-014-xx",
        team: "兴欣",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "夏转会期", day: 18 },
        startTime: { year: 3, season: "夏转会期", day: 20 },
        acceptDeadline: { year: 3, season: "夏转会期", day: 22 },
        negotiationDeadline: { year: 3, season: "夏转会期", day: 25 },
        endTime: { year: 3, season: "夏转会期", day: 27 },
        // 资金属性
        deposit: 5000,
        reward: 40000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 100,
            魅力: 100
        },
        playerReq: {
            职业: "气功师",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】目标是总冠军的兴欣有意向招募气功师，要求经纪人谈判技巧>100且魅力>100。",
        // 选手信息
        primaryPlayer: "方锐",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },



    //第三年冬转会期
    // 呼啸刘皓
    {
        id: "commission-015-hx",
        team: "呼啸",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "冬转会期", day: 11 },
        startTime: { year: 3, season: "冬转会期", day: 13 },
        acceptDeadline: { year: 3, season: "冬转会期", day: 19 },
        negotiationDeadline: { year: 3, season: "冬转会期", day: 26 },
        endTime: { year: 3, season: "冬转会期", day: 28 },
        // 资金属性
        deposit: 5500,
        reward: 55000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 200,
            魅力: 180
        },
        playerReq: {
            职业: "魔剑士",
            级别: "A+"
        },
        newscontent: "【⭐重磅招募】呼啸有意向招募魔剑士，要求经纪人谈判技巧>200且魅力>180。",
        // 选手信息
        primaryPlayer: "刘皓",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    },


    //第3年 冬转会期 兴欣孙哲平
    {
        id: "commission-015-yz",
        team: "义斩",
        type: "main",
        // 时间属性
        newsTime: { year: 3, season: "冬转会期", day: 16 },
        startTime: { year: 3, season: "冬转会期", day: 18 },
        acceptDeadline: { year: 3, season: "冬转会期", day: 23 },
        negotiationDeadline: { year: 3, season: "冬转会期", day: 26 },
        endTime: { year: 3, season: "冬转会期", day: 29 },
        // 资金属性
        deposit: 5000,
        reward: 80000,
        // 时间记录
        acceptedTime: null,
        negotiationStartTime: null,
        completedTime: null,
        failureTime: null,
        // 失败信息
        failureReason: null,
        // 委托要求
        requirements: {
            谈判技巧: 230,
            社交能力: 225
        },
        playerReq: {
            职业: "狂剑士",
            级别: "S"
        },
        newscontent: "【⭐重磅招募】义斩有意向招募顶尖狂剑士，要求经纪人谈判技巧>230且社交能力>225。",
        // 选手信息
        primaryPlayer: "孙哲平",
        backupPlayers: [],
        assignedPlayer: null,
        // 状态和数据
        status: "available",
        negotiationData: null
    }




    //第4年 春赛季 （10赛季决赛，兴欣夺冠）



];


// 在文件顶部添加配置对象
const negotiationFactorsConfig = [
    {
        id: 'contract',
        name: '合同条款协商',
        desc: '争取更好的薪资结构和签约年限',
        icon: '📝',
        color: '#4f46e5',
        cost: 30,        // 降低点数消耗
        successIncrease: 4  // 降低成功率提升
    },
    {
        id: 'welfare',
        name: '入队福利保障',
        desc: '确保住房、交通、训练设施等福利',
        icon: '🎁',
        color: '#10b981',
        cost: 25,        // 降低点数消耗
        successIncrease: 3  // 降低成功率提升
    },
    {
        id: 'main',
        name: '主力位置承诺',
        desc: '确保在战队中的核心地位和出场时间',
        icon: '⭐',
        color: '#f59e0b',
        cost: 50,        // 降低点数消耗
        successIncrease: 5  // 降低成功率提升
    },
    {
        id: 'captain',
        name: '队长职位机会',
        desc: '争取成为团队领袖，获得更多话语权',
        icon: '👑',
        color: '#8b5cf6',
        cost: 80,        // 保持较高点数消耗
        successIncrease: 7  // 较高成功率提升
    },
    {
        id: 'salary',
        name: '顶级薪资待遇',
        desc: '争取行业顶级的薪酬和奖金方案',
        icon: '💎',
        color: '#ef4444',
        cost: 30,        // 中等点数消耗
        successIncrease: 4  // 中等成功率提升
    },
    {
        id: 'sponsorship',  // 新增要素
        name: '商业代言机会',
        desc: '为选手争取额外的商业代言和赞助',
        icon: '🤝',
        color: '#06b6d4',   // 青色系
        cost: 65,           // 较高点数消耗
        successIncrease: 6  // 较高成功率提升
    }
];


// 随机委托生成配置
const randomCommissionConfig = {
    // 职业列表
    jobs: ["战斗法师", "魔道学者", "剑客", "术士", "神枪手",
        "流氓", "机械师", "鬼剑士", "元素法师", "牧师",
        "枪炮师", "驱魔师", "柔道家", "刺客", "狂剑士",
        "气功师", "守护天使", "弹药专家", "忍者", "骑士",
        "召唤师", "拳法家", "魔剑士", "鬼剑士"],

    // 战队列表
    teams: ["霸图", "微草", "蓝雨", "轮回", "百花", "呼啸", "雷霆", "虚空", "烟雨", "越云", "三零一", "嘉世", "兴欣", "义斩"],

    // 级别列表
    levels: ["S", "A+", "A", "B+", "B"],

    // 级别对应的奖励和保证金基数
    levelBaseValues: {
        "S": { reward: 80000, deposit: 8000 },
        "A+": { reward: 60000, deposit: 6000 },
        "A": { reward: 45000, deposit: 4500 },
        "B+": { reward: 30000, deposit: 3000 },
        "B": { reward: 20000, deposit: 2000 }
    }
};

/**
 * 选手转会意愿配置
 */
const negotiationPreferences = {
    playerToTeam: {
        // 原有配置完全保留
        "2-春赛季-唐柔-兴欣": {
            dialogue: "职业选手？听上去很有趣。",
            successBonus: 50
        },
        "2-夏转会期-唐柔-[*]": {
            dialogue: "我选择和果果在一起。",
            successBonus: -1000
        },
        "2-冬转会期-唐柔-[*]": {
            dialogue: "留在兴欣不是更好吗？",
            successBonus: -1000
        },

        // 孙翔线
        "1-冬转会期-孙翔-嘉世": {
            dialogue: "嘉世！三连冠的战队，这才是我该待的地方！",
            successBonus: +50
        },
        "1-冬转会期-孙翔-轮回": {
            dialogue: "轮回确实强，不过……嘉世才是我的目标！",
            successBonus: -1000
        },
        "1-冬转会期-孙翔-兴欣": {
            dialogue: "兴欣？那支新成立的队伍吗？",
            successBonus: -1000
        },
        "1-冬转会期-孙翔-蓝雨": {
            dialogue: "蓝雨的人，他们说话我都听不懂。",
            successBonus: -1000
        },
        "1-冬转会期-孙翔-微草": {
            dialogue: "微草打得太死板，不适合我这种爆发型选手。",
            successBonus: -1000
        },
        "1-冬转会期-孙翔-霸图": {
            dialogue: "霸图都是老将了，如果全部换成新鲜血液我也许会考虑！",
            successBonus: -1000
        },
        "1-冬转会期-孙翔-越云": {
            dialogue: "越云的兄弟们对我不错……但我的目标是更大的舞台！",
            successBonus: -1000
        },
        "2-夏转会期-孙翔-轮回": {
            dialogue: "轮回这赛季表现太强了，确实很有吸引力。",
            successBonus: +20
        },
        "2-夏转会期-孙翔-兴欣": {
            dialogue: "兴欣居然夺冠了...真是没想到。",
            successBonus: -10
        },
        "2-夏转会期-孙翔-蓝雨": {
            dialogue: "蓝雨……",
            successBonus: -5
        },
        // 第3年夏转会期：嘉世解散，孙翔转会轮回
        "3-夏转会期-孙翔-轮回": {
            dialogue: "和一叶之秋一起，去拿个冠军吧。",
            successBonus: +80
        },
        "3-夏转会期-孙翔-[^轮回]": {
            dialogue: "除了轮回，我哪也不想去。",
            successBonus: -1000
        },

        // 其他选手原有配置
        "1-冬转会期-王杰希-轮回": {
            dialogue: "微草是我的队伍，我哪里都不会去。",
            successBonus: -1000
        },
        "1-冬转会期-王杰希-霸图": {
            dialogue: "霸图的风格和我们差异太大了。",
            successBonus: -1000
        },
        "1-冬转会期-黄少天-蓝雨": {
            dialogue: "队长在这里，我就在蓝雨！谁都别想把我挖走！",
            successBonus: -1000
        },
        "1-冬转会期-黄少天-轮回": {
            dialogue: "轮回的小周话那么少，我去了得多无聊啊！",
            successBonus: -200
        },

        // 苏沐橙
        "2-夏转会期-苏沐橙-[^兴欣]": {
            dialogue: "除了兴欣，我对其他战队都没有兴趣。",
            successBonus: -1000
        },
        "2-冬转会期-苏沐橙-[^兴欣]": {
            dialogue: "除了兴欣，我对其他战队都没有兴趣。",
            successBonus: -1000
        },
        // 第3年冬转会期：合同到期加盟兴欣
        "3-冬转会期-苏沐橙-兴欣": {
            dialogue: "终于可以一起战斗了。",
            successBonus: +100
        },

        // 叶修原有配置（完全保留）
        "1-冬转会期-叶修-[*]": {
            dialogue: "我对转会到其他战队没有任何兴趣。",
            successBonus: -1000
        },
        "2-夏转会期-叶修-[*]": {
            dialogue: "我不会去其他战队，我有自己的打算。",
            successBonus: -1000
        },
        "2-冬转会期-叶修-[*]": {
            dialogue: "你还真是坚持啊……",
            successBonus: -1000
        },
        "3-夏转会期-叶修-[*]": {
            dialogue: "呵呵，有这时间还不如帮我把其他人叫来兴欣",
            successBonus: -1000
        },
        "3-冬转会期-叶修-[*]": {
            dialogue: "不如你明年再来问一次",
            successBonus: -1000
        },

        // ========== 新增配置开始 ==========
        // 张佳乐 (第2年夏转会期：百花->霸图)
        "2-夏转会期-张佳乐-霸图": {
            dialogue: "为了冠军，这是我最后的机会。",
            successBonus: +85
        },
        "2-夏转会期-张佳乐-百花": {
            dialogue: "对不起，我已经无法带领百花继续前进了。",
            successBonus: -1000
        },
        "2-夏转会期-张佳乐-[^霸图]": {
            dialogue: "除了霸图，我不会考虑其他邀约。",
            successBonus: -50
        },

        // 林敬言 (第2年夏转会期：呼啸->霸图)
        "2-夏转会期-林敬言-霸图": {
            dialogue: "最后的夺冠机会，我想拼一次。",
            successBonus: +75
        },
        "2-夏转会期-林敬言-呼啸": {
            dialogue: "呼啸需要更年轻的领袖。",
            successBonus: -1000
        },

        // 肖时钦 (第2年夏转会期：雷霆->嘉世；第3年夏：嘉世->雷霆)
        "2-夏转会期-肖时钦-嘉世": {
            dialogue: "嘉世需要改变，我愿意接受这个挑战。",
            successBonus: +70
        },
        "3-夏转会期-肖时钦-雷霆": {
            dialogue: "我回来了，这一次，我会带领雷霆走得更远。",
            successBonus: +100
        },
        "3-夏转会期-肖时钦-[^雷霆]": {
            dialogue: "我的归宿是雷霆。",
            successBonus: -1000
        },

        // 唐昊 (第2年夏转会期：百花->呼啸)
        "2-夏转会期-唐昊-呼啸": {
            dialogue: "是时候成为战队的核心了。",
            successBonus: +90
        },
        "2-夏转会期-唐昊-百花": {
            dialogue: "张佳乐走了，我不想接手这个烂摊子。",
            successBonus: -1000
        },

        // 于锋 (第3年冬转会期：蓝雨->百花)
        "3-冬转会期-于锋-百花": {
            dialogue: "我需要一个以我为核心的舞台。",
            successBonus: +88
        },
        "3-冬转会期-于锋-蓝雨": {
            dialogue: "谢谢蓝雨，但这里已经有夜雨声烦和索克萨尔了。",
            successBonus: -1000
        },

        // 方锐 (第3年夏转会期：呼啸->兴欣)
        "3-夏转会期-方锐-兴欣": {
            dialogue: "老叶说这里缺个气功师？试试转型好像也不错！",
            successBonus: +78
        },
        "3-夏转会期-方锐-呼啸": {
            dialogue: "呼啸的风格已经变了，不再是适合我的地方。",
            successBonus: -1000
        },

        // 兴欣挑战赛成员
        "2-秋赛季-安文逸-兴欣": {
            dialogue: "这是一个证明我能力的机会。",
            successBonus: +75
        },
        "2-秋赛季-罗辑-兴欣": {
            dialogue: "数学和荣耀可以结合得更好。",
            successBonus: +65
        },
        "2-秋赛季-乔一帆-兴欣": {
            dialogue: "微草不需要我，但兴欣给了我新的方向。",
            successBonus: +85
        },
        "2-秋赛季-包荣兴-兴欣": {
            dialogue: "老大在哪我就在哪！",
            successBonus: +100
        },
        "2-秋赛季-魏琛-兴欣": {
            dialogue: "没想到老夫有生之年还能杀回职业圈！",
            successBonus: +90
        },

        // 孙哲平 (第2年秋：复出加入兴欣；第3年冬：兴欣->义斩)
        "2-秋赛季-孙哲平-兴欣": {
            dialogue: "我的手还能打，这就够了。",
            successBonus: +70
        },
        "3-冬转会期-孙哲平-义斩": {
            dialogue: "帮老朋友带带新人。",
            successBonus: +65
        },
        "3-冬转会期-孙哲平-兴欣": {
            dialogue: "我的任务已经完成了。",
            successBonus: -1000
        },

        // 刘皓 (第2年夏：嘉世->雷霆；第3年冬：雷霆->呼啸)
        "2-夏转会期-刘皓-雷霆": {
            dialogue: "换个环境重新开始。",
            successBonus: +60
        },
        "3-冬转会期-刘皓-呼啸": {
            dialogue: "新的环境，新的开始。",
            successBonus: +65
        },
        "3-冬转会期-刘皓-雷霆": {
            dialogue: "是时候寻找新的挑战了。",
            successBonus: -1000
        },

        // 其他战队核心（忠诚）
        "1-冬转会期-韩文清-[*]": {
            dialogue: "霸图就是我的家，我哪里都不去。",
            successBonus: -1000
        },
        "1-冬转会期-周泽楷-[*]": {
            dialogue: "……（摇头）",
            successBonus: -1000
        },
        "1-冬转会期-张新杰-[*]": {
            dialogue: "霸图的战术体系需要我，我不会离开。",
            successBonus: -1000
        },
        "1-冬转会期-喻文州-[*]": {
            dialogue: "蓝雨是我最好的选择。",
            successBonus: -1000
        },

        // 许斌 (第3年冬转会期：三零一->微草)
        "3-冬转会期-许斌-微草": {
            dialogue: "微草需要新的防守核心。",
            successBonus: +82
        },
        "3-冬转会期-许斌-三零一": {
            dialogue: "是时候寻求新的挑战了。",
            successBonus: -1000
        },

        // 李亦辉 (第3年冬转会期：微草->三零一)
        "3-冬转会期-李亦辉-三零一": {
            dialogue: "希望在三零一重新找回状态。",
            successBonus: +75
        },
        "3-冬转会期-李亦辉-微草": {
            dialogue: "微草有了新的骑士。",
            successBonus: -1000
        },

        // 烟雨姐妹 (第4/5年春赛季)
        "4-春赛季-舒可欣-烟雨": {
            dialogue: "终于等到这个机会了！",
            successBonus: +85
        },
        "5-春赛季-舒可怡-烟雨": {
            dialogue: "和妹妹一起战斗！",
            successBonus: +88
        },

        // 白庶 (第3年夏转会期：海外->三零一)
        "3-夏转会期-白庶-三零一": {
            dialogue: "听说三零一需要骑士选手。",
            successBonus: +80
        }
    },

    teamToPlayer: {
        // 原有配置
        "1-冬转会期-嘉世-孙翔": {
            dialogue: "越云的新人？数据不错，有潜力，是不错的人选。",
            successBonus: +15
        },
        "1-冬转会期-轮回-孙翔": {
            dialogue: "这个新人的表现一直很亮眼，轮回很欢迎。",
            successBonus: +15
        },
        "1-冬转会期-微草-孙翔": {
            dialogue: "个人能力突出，但团队意识存疑。",
            successBonus: -5
        },
        "1-冬转会期-霸图-孙翔": {
            dialogue: "非常不错的新人，欢迎来到霸图。",
            successBonus: +10
        },
        "2-夏转会期-霸图-孙翔": {
            dialogue: "我们需要新鲜血液，孙翔是合适的人选。",
            successBonus: +25
        },
        "2-夏转会期-轮回-孙翔": {
            dialogue: "这个赛季的表现证明了他有成为核心的潜力。",
            successBonus: +25
        },
        "2-夏转会期-兴欣-孙翔": {
            dialogue: "实力很强，但性格可能需要磨合。",
            successBonus: +8
        },

        // ========== 新增配置开始 ==========
        // 第3年夏转会期：轮回天价收购孙翔
        "3-夏转会期-轮回-孙翔": {
            dialogue: "一叶之秋和它的操作者，都值得这个价格。",
            successBonus: +95
        },

        // 霸图对老将的需求
        "2-夏转会期-霸图-张佳乐": {
            dialogue: "他的加入，是我们冲击冠军的最后拼图。",
            successBonus: +90
        },
        "2-夏转会期-霸图-林敬言": {
            dialogue: "经验丰富的老将，能稳定军心。",
            successBonus: +75
        },

        // 嘉世对战术大师的需求
        "2-夏转会期-嘉世-肖时钦": {
            dialogue: "只有战术大师，才能拯救现在的嘉世。",
            successBonus: +85
        },
        // 雷霆迎回队长
        "3-夏转会期-雷霆-肖时钦": {
            dialogue: "欢迎回家，队长。",
            successBonus: +100
        },

        // 呼啸对核心的需求
        "2-夏转会期-呼啸-唐昊": {
            dialogue: "我们需要一个年轻的核心带领队伍。",
            successBonus: +92
        },

        // 百花重建核心
        "3-冬转会期-百花-于锋": {
            dialogue: "我们需要一个崭新的核心。",
            successBonus: +90
        },

        // 兴欣对各成员的需求
        "2-春赛季-兴欣-唐柔": {
            dialogue: "手速惊人的新人，值得培养。",
            successBonus: +60
        },
        "2-秋赛季-兴欣-安文逸": {
            dialogue: "治疗冷静，判断准确，潜力很大。",
            successBonus: +70
        },
        "2-秋赛季-兴欣-罗辑": {
            dialogue: "数学天才，战术理解能力极强。",
            successBonus: +65
        },
        "3-冬转会期-兴欣-乔一帆": {
            dialogue: "从微草弃将到阵鬼天才，我们看到了你的潜力。",
            successBonus: +80
        },
        "2-秋赛季-兴欣-包荣兴": {
            dialogue: "很有特色的选手，虽然不稳定。",
            successBonus: +55
        },
        "2-秋赛季-兴欣-魏琛": {
            dialogue: "我们需要老将的经验。",
            successBonus: +70
        },
        "2-秋赛季-兴欣-孙哲平": {
            dialogue: "曾经的百花核心，实力仍在。",
            successBonus: +72
        },
        "3-夏转会期-兴欣-方锐": {
            dialogue: "全明星选手，能极大增强我们的实力。",
            successBonus: +85
        },
        "3-冬转会期-兴欣-苏沐橙": {
            dialogue: "最强枪炮师的组合，将在兴欣实现。",
            successBonus: +100
        },

        // 雷霆/呼啸对刘皓的需求
        "2-夏转会期-雷霆-刘皓": {
            dialogue: "我们需要填补肖时钦离开后的空缺。",
            successBonus: +65
        },
        "3-冬转会期-呼啸-刘皓": {
            dialogue: "他的经验能帮助战队稳定局面。",
            successBonus: +68
        },

        // 微草对许斌的需求
        "3-冬转会期-微草-许斌": {
            dialogue: "骑士职业的顶尖选手，能加强我们的防守。",
            successBonus: +82
        },

        // 三零一对选手的需求
        "3-冬转会期-三零一-李亦辉": {
            dialogue: "前全明星选手，值得一试。",
            successBonus: +75
        },
        "3-夏转会期-三零一-白庶": {
            dialogue: "海外归来的选手，能带来新思路。",
            successBonus: +78
        },

        // 义斩对孙哲平的需求
        "3-冬转会期-义斩-孙哲平": {
            dialogue: "我们需要有经验的选手带领队伍。",
            successBonus: +70
        },

        // 烟雨对姐妹花的需求
        "4-春赛季-烟雨-舒可欣": {
            dialogue: "新生代选手，值得培养。",
            successBonus: +80
        },
        "5-春赛季-烟雨-舒可怡": {
            dialogue: "和妹妹组成双胞胎组合。",
            successBonus: +82
        },

        // 其他战队对核心选手的兴趣（但很难成功）
        "2-夏转会期-轮回-王杰希": {
            dialogue: "如果魔术师能来轮回……但这几乎不可能。",
            successBonus: -1000
        },
        "2-夏转会期-霸图-黄少天": {
            dialogue: "机会主义者很适合霸图的风格，但蓝雨不会放人。",
            successBonus: -1000
        },
        "2-夏转会期-微草-周泽楷": {
            dialogue: "枪王组合……只是个美好的想象。",
            successBonus: -1000
        }
    }
};

/**
 * 随机动态新闻（按时间排序）
 */
const RANDOM_NEWS = [
    // 游戏系统指引
    { content: "【温馨提示】每个赛季/转会期持续30天，请合理规划时间。", type: "game_guide" },
    { content: "【温馨提示】经纪人每日拥有10点能量，与选手互动、谈判、学习都会消耗能量。", type: "game_guide" },
    { content: "【温馨提示】合理安排每日行动：春、秋赛季专注于比赛和选手培养；夏、冬转会期进行转会操作。", type: "game_guide" },

    // 能量管理指引
    { content: "【温馨提示】谈话消耗1点能量，送礼物消耗2点能量，合理安排能量使用。", type: "game_guide" },
    { content: "【温馨提示】经纪人培训学习消耗都将消耗一定能量，但能永久提升您的谈判能力。", type: "game_guide" },
    { content: "【温馨提示】每日休息后能量恢复至10点，劳逸结合才是人生真谛。", type: "game_guide" },

    // 谈判系统指引
    { content: "【温馨提示】谈判成功率越高越可能成功，但即使成功率95%也有失败的可能。", type: "game_guide" },
    { content: "【温馨提示】获取选手联系方式后，可以在转会期随时进行谈判。", type: "game_guide" },
    { content: "【温馨提示】接受委托需缴纳保证金，若商谈失败保证金不退，请谨慎接受委托。", type: "game_guide" },
    { content: "【温馨提示】接受委托前请预留足够保证金，避免因资金不足影响其他操作。", type: "game_guide" },
    { content: "【温馨提示】委托保证金的数额与选手级别相关，S级选手的保证金通常较高。", type: "game_guide" },
    { content: "【温馨提示】委托商谈失败时保证金将作为违约金扣除，请评估成功率后再接受委托。", type: "game_guide" }

];

// 预设动态新闻（按时间排序）
const PRESET_TIMED_NEWS = [
    // === 冬转会期 ===
    {
        id: "news_1_win_2_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 2 },
        content: "嘉世状态持续下滑，昔日王者光环不再。",
        publisher: "荣耀八卦周刊",
        ismust: true
    },
    {
        id: "news_1_win_3_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 3 },
        content: "独家爆料！嘉世内部矛盾升级，队长叶修状态引争议，俱乐部或将有重大变动？",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_1_win_4_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 4 },
        content: "百花缭乱已散？张佳乐退役后百花战队一蹶不振，队魂缺失成致命伤！",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_1_win_5_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 5 },
        content: "最佳新人！孙翔横空出世，新人赛季场均击杀率惊人，或成下一个荣耀之星？",
        publisher: "电竞观察",
        ismust: false
    },
    {
        id: "news_1_win_6_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 6 },
        content: "百花二年级生唐昊表现抢眼，继承张佳乐衣钵？知情人士：打法比前辈更激进！",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_1_win_7_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 7 },
        content: "微草秘密武器！王杰希接班人高英杰训练赛数据惊人，魔术师打法后继有人？",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_1_win_8_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 8 },
        content: "转会市场暗流涌动！知情人士透露：嘉世高层有意冬季补强，目标瞄准新生代王牌",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_1_win_9_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 9 },
        content: "舆论漩涡！嘉世粉丝分裂：叶修该背锅还是俱乐部管理层决策失误？战队灵魂何去何从？",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_1_win_10_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 10 },
        content: "轮回战队强势崛起！周泽楷+江波涛双核驱动，常规赛表现碾压，夺冠热门预定？",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_1_win_11_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 11 },
        content: "内部人士爆料：嘉世训练基地气氛凝重，叶修与部分队员关系紧张，管理问题浮出水面",
        publisher: "电竞消息",
        ismust: false
    },
    {
        id: "news_1_win_12_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 12 },
        content: "新老交替进行时！联盟调查显示：第八赛季新生代选手表现力压老将，荣耀要变天了？",
        publisher: "荣耀研究",
        ismust: false
    },
    {
        id: "news_1_win_13_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 13 },
        content: "孙翔vs唐昊：谁才是第八赛季最强新人？数据对比引争议，粉丝团隔空互怼！",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_1_win_14_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 14 },
        content: "转会期重磅传闻！多家战队有意越云孙翔，报价高达千万！",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_1_win_15_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 15 },
        content: "嘉世危机升级！赞助商撤资传闻四起，若战绩再无起色，俱乐部恐面临重组",
        publisher: "电竞观察",
        ismust: false
    },
    {
        id: "news_1_win_16_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 16 },
        content: "轮回周泽楷商业价值飙升！代言费赶超韩文清，联盟新门面人物诞生？",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_1_win_17_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 17 },
        content: "微草高英杰被过度保护？王杰希：给他成长空间。粉丝：我们需要更多上场机会！",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_1_win_18_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 18 },
        content: "独家专访叶修：嘉世的问题需要时间解决。但知情人士透露：俱乐部已失去耐心",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_1_win_19_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 19 },
        content: "百花重建之路艰难！唐昊虽有天赋但经验不足，战队青黄不接成最大困境",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_1_win_20_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 20 },
        content: "转会市场地震预警！多名选手合同即将到期，第八赛季结束后或将迎来最大规模转会潮",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_1_win_21_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 21 },
        content: "轮回战队内部和谐度调查全联盟第一！江波涛成最佳粘合剂，战队化学反应完美",
        publisher: "荣耀研究",
        ismust: false
    },
    {
        id: "news_1_win_23_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 23 },
        content: "烟雨楚云秀状态分析：联盟第一女选手数据稳定，但战队整体支援不足",
        publisher: "数据分析",
        ismust: false
    },
    {
        id: "news_1_win_24_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 24 },
        content: "三零一杨聪刺客教学视频爆火！'舍命一击'技巧引发全网学习热潮",
        publisher: "荣耀教学",
        ismust: false
    },
    {
        id: "news_1_win_26_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 28 },
        content: "转会窗即将关闭！各战队最后补强机会，经纪人忙碌季到来",
        publisher: "经纪人协会",
        ismust: false
    },
    {
        id: "news_1_win_27_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 27 },
        content: "雷霆肖时钦薪资分析：性价比最高的全明星选手？战队以他为核心重建",
        publisher: "电竞经济",
        ismust: false
    },
    {
        id: "news_1_win_29_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 29 },
        content: "【转会截止日倒计时】最后24小时！多笔交易仍在谈判中，经纪人通宵工作",
        publisher: "转会风向标",
        ismust: true
    },
    {
        id: "news_1_win_30_01",
        type: "news",
        time: { year: 1, season: "冬转会期", day: 30 },
        content: "冬季转会窗正式关闭！多笔交易官宣，战队阵容调整完成，备战新赛季！",
        publisher: "荣耀官方",
        ismust: true
    },

    // === 春赛季 ===
    {
        id: "news_2_spri_1_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 1 },
        content: "【重磅官宣❗】嘉世宣布叶修退役！官方声明：队长引咎辞职，一代斗神谢幕！",
        publisher: "荣耀官方",
        ismust: true
    },
    {
        id: "news_2_spri_2_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 2 },
        content: "全网哀悼！叶修退役消息引爆荣耀圈，粉丝痛哭：青春结束了！微博话题#叶修退役#阅读量破亿",
        publisher: "电竞头条",
        ismust: false
    },
    {
        id: "news_2_spri_3_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 3 },
        content: "第十区惊现神秘散人玩家，连破多个副本记录，各大公会束手无策，引发全网热议",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_spri_5_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 4 },
        content: "嘉世战绩三连败，新队长与队员配合生疏，战术执行混乱",
        publisher: "电竞观察",
        ismust: false
    },
    {
        id: "news_2_spri_7_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 5 },
        content: "嘉世战术真空！粉丝吐槽：没有叶修指挥，比赛打得像路人局，完全看不出战术体系",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_spring_6",
        type: "news",
        time: { year: 2, season: "春赛季", day: 6 },
        content: "百花客场惨败虚空，唐昊孤军奋战难挽败局，团队配合出现严重脱节",
        publisher: "荣耀周刊",
        ismust: false
    },

    {
        id: "news_2_spring_7",
        type: "news",
        time: { year: 2, season: "春赛季", day: 7 },
        content: "传闻嘉世俱乐部高层紧急约谈战队全体成员，试图解决内部矛盾",
        publisher: "荣耀周刊",
        ismust: true
    },

    {
        id: "news_spring_fan_7",
        type: "news",
        time: { year: 2, season: "春赛季", day: 8 },
        content: "百花粉丝论坛热帖引爆网络：《张佳乐走了，百花还能撑多久？》发帖人细数战队核心离队后的颓势，数千跟帖共鸣，要求俱乐部给出明确重建计划",
        publisher: "荣耀观察",
        ismust: false
    },
    {
        id: "spring_day23-23",
        type: "news",
        time: { year: 2, season: "春赛季", day: 9 },
        content: "网游中散人教学视频点击量破百万，荣耀官方考虑推出散人专题",
        publisher: "文化现象",
        ismust: false
    },
    {
        id: "news_jias_tactical_chaos",
        type: "news",
        time: { year: 2, season: "春赛季", day: 10 },
        content: "【战术观察】嘉世近期比赛暴露严重战术缺陷，场上缺乏有效指挥，攻防两端如同一盘散沙。资深评论员指出，在失去原核心指挥后，队伍宛如失去大脑，个人能力无法弥补体系漏洞。",
        publisher: "荣耀观察",
        ismust: false
    },

    {
        id: "news_praise_samsara",
        type: "news",
        time: { year: 2, season: "春赛季", day: 11 },
        content: "评论员盛赞轮回战队本赛季表现，称其‘进攻如水银泻地，防守似铜墙铁壁’，团队执行力与个人能力结合已达全新高度。",
        publisher: "荣耀观察",
        ismust: false
    },


    {
        id: "news_jias_sunxiang_sick",
        type: "news",
        time: { year: 2, season: "春赛季", day: 12 },
        content: "【战队公告】嘉世俱乐部官方宣布，队长孙翔因身体不适将缺席接下来数场比赛，具体复出时间待定。",
        publisher: "战队前线",
        ismust: true
    },

    {
        id: "news_jias_relegation_final",
        type: "news",
        time: { year: 2, season: "春赛季", day: 13 },
        content: "【重磅战报】第八赛季常规赛落幕，曾三夺联盟总冠军的嘉世战队爆冷位列第19名，确认降级。传统王朝的陨落震惊全联盟。",
        publisher: "荣耀观察",
        ismust: true
    },

    {
        id: "news_fans_demand_yexiu_forum",
        type: "news",
        time: { year: 2, season: "春赛季", day: 13 },
        content: "【现场直播】嘉世降级新闻发布不到一小时，俱乐部已被悲愤粉丝包围！更有情绪激动的粉丝试图冲击大门，与保安形成对峙。荣耀论坛热帖标题：‘没有叶神的第100天，想他，救救嘉世！’",
        publisher: "荣耀周刊",
        ismust: true
    },
    {
        id: "spring_day5-16",
        type: "news",
        time: { year: 2, season: "春赛季", day: 16 },
        content: "散人玩法在网游中引发模仿热潮，大量玩家尝试多职业搭配，转职导师处排起长队",
        publisher: "网游现象",
        ismust: false
    },
    {
        id: "news_rumor_junmoxiao_bounty",
        type: "news",
        time: { year: 2, season: "春赛季", day: 17 },
        content: "【网游快讯】神秘高手‘君莫笑’因持续刷新副本纪录、扰乱材料市场，疑遭多家大型公会联合悬赏，游戏内追杀令已扩散至全服。",
        publisher: "荣耀观察",
        ismust: false
    },

    {
        id: "news_2_spri_18_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 18 },
        content: "荣耀挑战赛正式开赛！报名队伍数量创历史新高，草根战队跃跃欲试",
        publisher: "荣耀官方",
        ismust: false
    },
    {
        id: "news_howling_crisis",
        type: "news",
        time: { year: 2, season: "春赛季", day: 19 },
        content: "【战队危机】呼啸战绩持续低迷，俱乐部高层震怒，或将进行重大人员调整。",
        publisher: "荣耀观察",
        ismust: false
    },

    {
        id: "news_rumor_zhangjiale",
        type: "news",
        time: { year: 2, season: "春赛季", day: 20 },
        content: "【网游传闻】多名玩家发帖称，疑似在荣耀网游中偶遇已退役的顶尖弹药专家'浅花迷人'，操作手法神似前百花王牌张佳乐，引发全网猜测。",
        publisher: "荣耀观察",
        ismust: false
    },

    {
        id: "news_2_spri_20_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 21 },
        content: "第十区火爆异常！神秘玩家'君莫笑'搅动全区，散人职业引发热议，疑似职业选手小号",
        publisher: "网游现象",
        ismust: true  // 关键剧情节点
    },
    {
        id: "news_2_spri_30_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 22 },
        content: "季后赛名单基本确定！轮回、蓝雨、霸图、微草锁定前四，嘉世跌出前八",
        publisher: "荣耀官方",
        ismust: false
    },

    {
        id: "news_broker_rumor",
        type: "news",
        time: { year: 2, season: "春赛季", day: 23 },
        content: "据消息人士透露，近日有知名经纪人频繁往来于呼啸与百花俱乐部之间，疑似就核心选手的交易进行初步接触，引发外界对夏窗重磅转会的猜测。",
        publisher: "荣耀周刊",
        ismust: true
    },

    {
        id: "news_2_spri_24_01",
        type: "news",
        time: { year: 2, season: "春赛季", day: 24 },
        content: "微草培养体系受肯定！多名新人均有亮眼表现",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_rumor_ye_xiu_bargain",
        type: "news",
        time: { year: 2, season: "春赛季", day: 25 },
        content: "【网游观察】玩家反馈，账号‘君莫笑’自称叶修，以‘为战队做贡献’为由，对稀有材料进行史诗级砍价，引发热议。",
        publisher: "荣耀前线",
        ismust: false
    },
    {
        id: "news_fan_keyboard_oath",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 26 },
        content: "针对张佳乐转会霸图传闻，百花核心粉在论坛立下flag：“这要能成真，我直播啃机械键盘！立帖为证，不吞就是狗！” 引发大规模围观打卡。",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_jias_thunder_contact",
        type: "news",
        time: { year: 2, season: "春赛季", day: 27 },
        content: "近日，有经纪人被多次目击出入嘉世与雷霆俱乐部，双方闭门会议频繁。圈内分析，这或与战术体系的重大人员调整有关，夏转市场暗流涌动。",
        publisher: "战队动态",
        ismust: true
    },
    {
        id: "news_final_result",
        type: "news",
        time: { year: 2, season: "春赛季", day: 29 },
        content: "【巅峰对决】第八赛季总决赛战罢，蓝雨战队鏖战至最后一刻，惜败于轮回。轮回加冕新王，联盟格局改写。",
        publisher: "荣耀观察",
        ismust: true
    },
    {
        id: "news_season8_final",
        type: "news",
        time: { year: 2, season: "春赛季", day: 30 },
        content: "【新王加冕】第八赛季总决赛落幕，轮回战队力克强敌，首夺联盟总冠军！周泽楷获封总决赛MVP，联盟正式进入‘轮回王朝’时间。",
        publisher: "荣耀观察",
        ismust: true
    },

    // === 第二年夏转会期 ===
    {
        id: "news_2_summer_1_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 1 },
        content: "【夏转会窗开启】荣耀联盟转会期正式开始！各战队经理忙碌季到来",
        publisher: "荣耀官方",
        ismust: true
    },
    {
        id: "news_2_summer_2_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 2 },
        content: "嘉世战绩分析：俱乐部或将有大动作补强阵容",
        publisher: "电竞观察",
        ismust: false
    },
    {
        id: "news_2_summer_3_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 3 },
        content: "网游十区持续火热！君莫笑打破冰霜森林副本记录，各大公会会长头疼不已",
        publisher: "网游风云",
        ismust: false
    },
    {
        id: "news_2_summer_4_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 4 },
        content: "雷霆肖时钦价值评估：战术大师带队能力获肯定，转会市场香饽饽",
        publisher: "转会分析",
        ismust: false
    },
    {
        id: "news_2_summer_5_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 5 },
        content: "呼啸队长危机！林敬言状态下滑引争议，俱乐部或考虑调整队长人选",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: " news_2_summer_6_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 6 },
        content: "线上挑战赛表现抢眼！某网吧队一路领先，神秘队长引各方猜测",
        publisher: "挑战赛快报",
        ismust: false
    },
    {
        id: "news_2_summer_7_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 7 },
        content: "网游人才涌现！第十区多名玩家展现职业级操作，各大战队星探忙碌",
        publisher: "新秀观察",
        ismust: false
    },
    {
        id: "news_2_summer_8_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 8 },
        content: "霸图引援计划曝光！韩文清力荐老将加盟，欲组建经验丰富阵容",
        publisher: "电竞头条",
        ismust: false
    },
    {
        id: "news_2_summer_9_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 9 },
        content: "君莫笑再创记录！一线峡谷副本首杀引轰动，散人职业打法引职业选手关注",
        publisher: "网游风云",
        ismust: false
    },
    {
        id: "news_2_summer_10_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 10 },
        content: "转会传闻：嘉世与雷霆接触频繁，肖时钦转会可能性大增",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_2_summer_11_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 11 },
        content: "百花唐昊转会风声！新一代流氓之王或离队，呼啸成最有可能下家",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_summer_12_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 12 },
        content: "网游公会战白热化！兴欣四处抢BOSS，三大公会联合围剿效果不佳",
        publisher: "网游风云",
        ismust: false
    },
    {
        id: "news_2_summer_13_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 13 },
        content: "张佳乐复出传闻升级！前百花核心训练照流出，状态保持良好",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_2_summer_14_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 14 },
        content: "夏休期开启，第十区与神之领域近日异常热闹。多位职业选手的小号被眼尖玩家认出并截图，‘求偶遇’、‘求合影’成为论坛热帖，玩家调侃：‘这游戏体验堪比全明星周末现场。",
        publisher: "网游前线",
        ismust: false
    },
    {
        id: "news_2_summer_15_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 15 },
        content: "轮回秘密训练成果显著！周泽楷枪体术更上一层楼，卫冕冠军信心十足",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_summer_16_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 16 },
        content: "转会市场升温！多名选手进入合同年，经纪人忙碌季到来",
        publisher: "经纪人协会",
        ismust: false
    },
    {
        id: "news_2_summer_17_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 17 },
        content: "君莫笑带队攻克埋骨之地！打法独特引职业圈研究，散人战术价值被重估",
        publisher: "网游风云",
        ismust: false
    },
    {
        id: "news_xiaoshiqin_rumor",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 18 },
        content: "【重磅传闻】据多个渠道交叉印证，一位拥有‘战术大师’头衔的联盟顶级核心选手，疑似已与刚刚降级的嘉世战队达成加盟意向，不日将正式官宣。引发‘不理解’与‘震惊’的广泛讨论。",
        publisher: "荣耀观察",
        ismust: true
    },
    {
        id: "news_2_summer_19_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 19 },
        content: "网游人才争夺战！各大战队派职业选手入驻十区，挖掘潜力新人",
        publisher: "新秀观察",
        ismust: false
    },
    {
        id: "news_2_summer_20_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 20 },
        content: "霸图俱乐部的消息人士透露，战队高层正在与一名联盟知名老将进行实质性接触。如谈判顺利，这位经验丰富的老兵或将在职业生涯的后期，于霸图开启全新篇章。",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_rumor_inside_conflict",
        type: "news",
        time: { year: 2, season: "夏休期", day: 21 },
        content: "近期，关于‘叶修（叶秋）被迫离开嘉世实为俱乐部内部权力斗争结果’的传言甚嚣尘上。嘉世俱乐部今日发布官方声明，坚决否认此说法，称选手退役纯属个人决定，呼吁粉丝勿信谣传谣。",
        publisher: "荣耀观察",
        ismust: false
    },
    {
        id: "news_2_summer_22_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 22 },
        content: "挑战赛8强战！兴欣将对阵职业队诛仙，黑马能否继续前进？",
        publisher: "挑战赛快报",
        ismust: false
    },
    {
        id: "news_howling_overhaul",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 23 },
        content: "据内部人士透露，为彻底扭转颓势，呼啸战队将进行‘大换血’式重组。除引进新核心外，部分原有主力也被告知可自寻下家，一场阵容地震即将到来。",
        publisher: "荣耀观察",
        ismust: true
    },
    {
        id: "news_2_summer_24_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 24 },
        content: "针对‘张佳乐或将复出加盟某豪门’的爆炸性传闻，百花粉丝在各大平台坚决否认，称‘绝无可能’，‘乐神的心永远属于百花’，并将此斥为恶意炒作",
        publisher: "荣耀周刊",
        ismust: true
    },
    {
        id: "news_2_summer_25_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 25 },
        content: "关于‘君莫笑’是某退役大神的猜测愈演愈烈。记者向各位职业大神打探口风，结果众人纷纷露出‘神秘微笑’，集体进入‘沉默是金’模式。",
        publisher: "网游风云",
        ismust: false
    },
    {
        id: "news_2_summer_26_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 26 },
        content: "降级豪门嘉世战队本季转会细节曝光！是机会还是陷阱？！",
        publisher: "转会分析",
        ismust: false
    },
    {
        id: "news_batur_new_plan",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 27 },
        content: "据业内人士分析，霸图战队近期转会动作频频，疑似在接触多名顶尖老将。同时，有消息称俱乐部正投入重金，为潜在的新核心量身打造全新的顶级账号卡，展现了其在新赛季不容有失的夺冠野心。",
        publisher: "荣耀观察",
        ismust: true
    },
    {
        id: "news_rumor_broker_truth",
        type: "news",
        time: { year: 2, season: "夏休期", day: 28 },
        content: "此前盛传‘知名经纪人在嘉世俱乐部周边频繁出没，疑有重磅转会’。经查实，该人士实为前往嘉世正对面的兴欣网吧上网，与转会事宜无关。一场引发诸多猜测的‘转会大戏’，竟以如此戏剧性的方式收场。",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_summer_29_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 29 },
        content: "【转会截止日倒计时】最后时刻多笔交易同时进行，转会市场疯狂24小时",
        publisher: "转会风向标",
        ismust: true
    },
    {
        id: "news_2_summer_30_01",
        type: "news",
        time: { year: 2, season: "夏转会期", day: 30 },
        content: "夏转会窗正式关闭！联盟新格局形成",
        publisher: "荣耀官方",
        ismust: true
    },


    // === 第二年秋赛季（9赛季上半） ===
    {
        id: "news_2_autumn_1_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 1 },
        content: "新赛季正式打响！各战队迎来首秀，比赛现场一票难求",
        publisher: "荣耀官方",
        ismust: false
    },
    {
        id: "news_2_autumn_2_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 2 },
        content: "轮回赛季开门红！周泽楷展现惊人技巧，枪体术更上一层楼",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_2_autumn_3_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 3 },
        content: "嘉世挑战赛首秀意外成了草根队伍的‘追星现场’。对手战队难掩兴奋，直言‘打比赛是其次，见到本尊才是真赚到’。",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_autumn_4_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 4 },
        content: "轮回技能点疑云！训练赛数据显示整体技能点大幅提升，技术团队或有突破",
        publisher: "数据分析",
        ismust: true
    },
    {
        id: "news_2_autumn_5_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 5 },
        content: "嘉世粉丝怀念叶修：'如果叶神还在...'论坛热帖引共鸣，俱乐部压力山大",
        publisher: "粉丝声音",
        ismust: false
    },
    {
        id: "news_2_autumn_6_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 6 },
        content: "百花战队在今夏失去核心主力后，新赛季前景蒙上阴影。现队长在公开露面中已显疲态，坦言‘需要时间重新构建体系’。",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_2_autumn_7_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 7 },
        content: "霸图战队的新核心组合在近期训练赛中亮相，其表现被评价为‘极度稳健’。他们展现了卓越的比赛节奏控制能力，稳扎稳打，展现出成熟的冠军气质",
        publisher: "电竞观察",
        ismust: false
    },
    {
        id: "news_2_autumn_8_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 8 },
        content: "嘉世队长孙翔面对媒体关于‘出战挑战赛的心理调整’的提问时，神情严肃，未予置评，发布会因此提前中断",
        publisher: "荣耀周刊",
        ismust: true
    },
    {
        id: "news_2_autumn_9_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 9 },
        content: "轮回技能点优势明显！全员高技能点配置，装备属性碾压对手",
        publisher: "数据分析",
        ismust: false
    },

    {
        id: "news_2_autumn_2",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 10 },
        content: "网游第十区‘兴欣公会’昨日再破一个五人本纪录，效率数据引发职业选手在直播中讨论：‘这打法有点意思’。",
        publisher: "网游风云",
        ismust: false
    },

    {
        "id": "news_2_autumn_7",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 11 },
        "content": "蓝雨战队主场轻取对手，队内年轻核心表现出色，被解说赞为‘联盟未来门面之一’。",
        "publisher": "荣耀观察",
        "ismust": false
    },
    {
        "id": "news_2_autumn_12",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 12 },
        "content": "完成换血的呼啸战队取得连胜，全新核心驱动下的激进打法，吸引大量年轻粉丝。",
        "publisher": "战队聚焦",
        "ismust": false
    },
    {
        "id": "news_2_autumn_21",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 13 },
        "content": "挑战赛中兴欣战队遇强敌，但其散人选手凭借千机伞多变形态惊艳全场，视频片段疯传。",
        "publisher": "挑战赛速递",
        "ismust": false
    },
    {
        id: "news_2_autumn_14_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 14 },
        content: "轮回全员技能点暴涨！据传俱乐部重金投入备研究取得突破，夺冠概率大幅提升",
        publisher: "数据分析",
        ismust: false
    },
    {
        "id": "news_2_autumn_36",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 15 },
        "content": "第十区材料市场因兴欣公会大量收购行为出现价格波动，生活玩家抱怨'被卷哭'。",
        "publisher": "网游经济",
        "ismust": false
    },

    {
        "id": "news_2_autumn_micrograss_controversy",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 16 },
        "content": "微草连胜背后引热议：评论员指出，其战术高度依赖队长‘一言堂’式指挥，核心选手的个人状态几乎直接决定比赛胜负，团队容错率引发业内担忧。",
        "publisher": "战术分析",
        "ismust": false
    },

    {
        "id": "news_2_autumn_howling_problem",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 17 },
        "content": "呼啸战队新赛季开局不利，队内全新核心阵容被指‘各自为战’，战术配合生疏，在关键团战中多次出现致命脱节，磨合问题已成为制约其战绩的最大瓶颈。",
        "publisher": "战队观察",
        "ismust": false
    },
    {
        "id": "news_2_autumn_rain_firepower",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 18 },
        "content": "传闻烟雨因缺乏攻坚手致成绩不佳，引高层不满。粉丝反应激烈：‘不补强就看不到未来’。",
        "publisher": "深度分析",
        "ismust": false
    },
    {
        "id": "news_2_autumn_void_improve",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 20 },
        "content": "虚空战队本赛季表现抢眼，其标志性的‘双鬼拍阵’战术体系日臻成熟，团队协同达到新高度，战绩稳步提升，被视作季后赛的有力竞争者。",
        "publisher": "战队观察",
        "ismust": false
    },

    {
        "id": "news_2_autumn_xinxing_victory",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 21 },
        "content": "挑战赛最大黑马、网吧队兴欣保持全胜。兴欣网吧已成粉丝打卡点，常有粉丝慕名前往观赛。",
        "publisher": "挑战赛速递",
        "ismust": true
    },

    {
        id: "news_2_autumn_22_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 22 },
        content: "微草新人成长迅速！王杰希接班人获肯定",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_2_autumn_23_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 23 },
        content: "蓝雨新人表现抢眼！卢瀚文刷新最年轻选手记录，黄少天后继有人",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_2_autumn_24_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 24 },
        content: "呼啸队内矛盾升级！新老队员关系紧张，战术执行出现问题",
        publisher: "电竞前线",
        ismust: false
    },

    {
        "id": "news_rumor_jias_internet",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 25 },
        "content": "【什么情况？】有姐妹拍到嘉世经理从对面兴欣网吧出来！咱嘉世大楼是又断网了吗？官博快来解释一下啊，不然我们可要造谣了（不是）。",
        "publisher": "粉丝前线",
        "ismust": false
    },

    {
        "id": "news_challenge_yizhan_vip",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 26 },
        "content": "【挑战赛奇观】新军义斩战队全员账号装备流光溢彩，被眼尖玩家鉴定为清一色‘SSVIP’顶级氪金外观，其土豪做派在挑战赛草根队伍中格外醒目，被网友戏称为‘人民币战队’、‘来体验生活的少爷团’。",
        "publisher": "挑战赛速递",
        "ismust": false
    },

    {
        id: "news_2_autumn_28_01",
        type: "news",
        time: { year: 2, season: "秋赛季", day: 28 },
        content: "轮回统治力显现！常规赛冠军基本锁定，技能点优势无人能敌",
        publisher: "数据分析",
        ismust: false
    },

    {
        "id": "news_2_autumn_regular_season_result",
        "type": "news",
        "time": { "year": 2, "season": "秋赛季", "day": 30 },
        "content": "【常规赛收官】第九赛季常规赛落幕，轮回战队成功卫冕常规赛冠军，霸图、蓝雨、微草等强队锁定前列席位，季后赛对阵形势正式出炉。",
        "publisher": "荣耀观察",
        "ismust": true
    },

    // === 第2年冬转会期 ===


    {
        "id": "news_2_winter_1",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 1 },
        "content": "冬季转会窗口于今日0时正式开启，联盟各战队进入为期一个月的阵容调整期。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_2_winter_2",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 2 },
        "content": "荣耀网游年度圣诞活动上线，大量玩家涌入，游戏内各大主城节日气氛浓厚。",
        "publisher": "网游快讯",
        "ismust": false
    },
    {
        "id": "news_2_winter_3",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 3 },
        "content": "转会市场出现首笔交易，某战队引入一名辅助型选手，旨在增强团队的稳定性。",
        "publisher": "转会速报",
        "ismust": false
    },
    {
        "id": "news_2_winter_4",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 4 },
        "content": "有消息称，微草战队正与一位风格稳健的防守型选手接触，或为完善其战术体系。",
        "publisher": "战队观察",
        "ismust": false
    },
    {
        "id": "news_2_winter_5",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 5 },
        "content": "百花战队正式官宣，成功签下一名顶级攻坚手，此举被外界视为其重建攻击体系的核心一步。",
        "publisher": "荣耀观察",
        "ismust": true
    },
    {
        "id": "news_2_winter_6",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 6 },
        "content": "网游圣诞活动中的限时副本竞争激烈，兴欣公会表现突出，其战术指挥引发其他公会关注。",
        "publisher": "网游风云",
        "ismust": false
    },
    {
        "id": "news_2_winter_7",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 7 },
        "content": "全明星周末投票今日开启，众多明星选手与潜力新人均在票选名单之中。",
        "publisher": "荣耀官方",
        "ismust": false
    },
    {
        "id": "news_2_winter_8",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 8 },
        "content": "微草战队官宣新援，一位擅长控制节奏的防守专家加入，以强化其阵容的均衡性。",
        "publisher": "战队官宣",
        "ismust": false
    },
    {
        "id": "news_2_winter_9",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 9 },
        "content": "传闻三零一战队有意引入一位近战能力突出的选手，以弥补其阵容上的特定短板。",
        "publisher": "转会风声",
        "ismust": false
    },

    {
        "id": "news_2_winter_7_allstar_short",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 11 },
        "content": "【全明星投票开启】荣耀联盟全明星周末投票通道现已开启，各战队选手将根据本赛季表现与粉丝人气，角逐最终表演赛席位。",
        "publisher": "荣耀官方",
        "ismust": false
    },
    {
        "id": "news_2_winter_12",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 12 },
        "content": "三零一战队官宣，签下一位拥有全明星资历的柔道选手，旨在增强团队的瞬间控场能力。",
        "publisher": "荣耀观察",
        "ismust": false
    },
    {
        "id": "news_2_winter_13",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 13 },
        "content": "荣耀元旦线上玩家赛事报名火热，据悉有多支队伍背景神秘，实力不俗。",
        "publisher": "玩家赛事",
        "ismust": false
    },
    {
        "id": "news_2_winter_14",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 14 },
        "content": "兴欣战队完成关键引援，一位联盟顶尖的远程火力输出选手正式转会加入。",
        "publisher": "深夜快讯",
        "ismust": true
    },
    {
        "id": "news_2_winter_15",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 15 },
        "content": "全明星投票进入最后阶段，多位选手票数接近，竞争激烈。",
        "publisher": "荣耀周刊",
        "ismust": false
    },

    {
        "id": "news_2_winter_17",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 17 },
        "content": "网游元旦活动开启，稀有奖励刺激了新一轮的玩家活跃高峰。",
        "publisher": "网游热闻",
        "ismust": false
    },
    {
        "id": "news_2_winter_18",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 18 },
        "content": "评论员指出，本次冬窗转会以针对性补强为主，百花、微草等队实力得到有效补充。",
        "publisher": "战术分析",
        "ismust": true
    },
    {
        "id": "news_2_winter_19",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 19 },
        "content": "关于嘉世俱乐部的一些旧闻再次被提及，但未引起广泛讨论。",
        "publisher": "边缘资讯",
        "ismust": false
    },
    {
        "id": "news_2_winter_20",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 20 },
        "content": "全明星周末最终阵容及新秀挑战赛名单由联盟官方正式公布。",
        "publisher": "荣耀官方",
        "ismust": false
    },
    {
        "id": "news_2_winter_21",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 21 },
        "content": "有传言称，新秀挑战赛中可能出现颇具看点的对决安排。",
        "publisher": "赛事前瞻",
        "ismust": false
    },
    {
        "id": "news_2_winter_22",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 22 },
        "content": "联盟发布公告，将对近期网游内的异常交易行为进行调查。",
        "publisher": "官方公告",
        "ismust": false
    },
    {
        "id": "news_2_winter_23",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 23 },
        "content": "某俱乐部及选手本人发表联合声明，否认了近期出现的转会谣言。",
        "publisher": "权威澄清",
        "ismust": false
    },
    {
        "id": "news_2_winter_24",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 24 },
        "content": "平安夜，多支战队通过官方渠道向粉丝发布了节日问候。",
        "publisher": "俱乐部动态",
        "ismust": false
    },
    {
        "id": "news_2_winter_25",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 25 },
        "content": "荣耀圣诞活动期间，有玩家根据操作判断，疑似有职业选手使用小号参与副本挑战。",
        "publisher": "网游观察",
        "ismust": false
    },
    {
        "id": "news_2_winter_26",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 26 },
        "content": "挑战赛在短暂休整后，将于近日重启。积分靠前的队伍已陆续恢复训练。",
        "publisher": "挑战赛通知",
        "ismust": false
    },
    {
        "id": "news_2_winter_27",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 27 },
        "content": "冬季转会窗口进入最后三天，市场普遍平静，预计不会出现重大变动。",
        "publisher": "转会市场",
        "ismust": true
    },

    {
        "id": "news_2_winter_29",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 29 },
        "content": "今日有几笔涉及替补或训练营选手的小型交易在联盟完成登记。",
        "publisher": "最终公告",
        "ismust": false
    },
    {
        "id": "news_2_winter_30",
        "type": "news",
        "time": { "year": 2, "season": "冬转会期", "day": 30 },
        "content": "第2年冬季转会窗口于今晚24时平静关闭。各战队阵容基本确定，将全力迎接后续赛事。",
        "publisher": "荣耀观察",
        "ismust": true

    },


    //第3年春赛季        
    {
        "id": "news_3_spring_1",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 1 },
        "content": "【比赛打响】第九赛季常规赛后半于今日正式开战，顶尖队伍将向季后赛资格发起冲击。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_spring_2",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 2 },
        "content": "烟雨战队官宣，从训练营提拔一位年轻的神枪手选手进入战队主力阵容。",
        "publisher": "战队官宣",
        "ismust": false
    },
    {
        "id": "news_3_spring_3",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 3 },
        "content": "烟雨战队紧接着宣布引入第二位神枪手选手。评论认为，这对姐妹花将极大增强其核心战术的深度与变化。",
        "publisher": "战术前瞻",
        "ismust": false
    },
    {
        "id": "news_3_spring_4",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 4 },
        "content": "季后赛首轮战罢，轮回、霸图、蓝雨、微草四支强队顺利晋级，会师半决赛。",
        "publisher": "赛事简报",
        "ismust": false
    },
    {
        "id": "news_3_spring_5",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 5 },
        "content": "联盟公布，挑战赛总决赛定于本月下旬在B市的荣耀体育馆举行，将开放线下观赛。",
        "publisher": "官方公告",
        "ismust": true
    },
    {
        "id": "news_3_spring_6",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 6 },
        "content": "嘉世战队结束最后备战，启程前往B市。俱乐部对外表示，对挑战赛决赛‘充满信心’。",
        "publisher": "战队动态",
        "ismust": false
    },
    {
        "id": "news_3_spring_7",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 7 },
        "content": "兴欣战队全员抵达B市，其随行的庞大粉丝团在机场引发一阵小规模轰动。",
        "publisher": "现场花絮",
        "ismust": false
    },
    {
        "id": "news_3_spring_8",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 8 },
        "content": "季后赛半决赛对阵抽签完成：轮回对阵微草，霸图对阵蓝雨。强强对话备受期待。",
        "publisher": "赛程发布",
        "ismust": false
    },
    {
        "id": "news_3_spring_9",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 9 },
        "content": "【总决赛门票秒空】第九赛季职业联赛总决赛门票今日开售，在数分钟内被抢购一空，可见其超高热度。",
        "publisher": "票务新闻",
        "ismust": false
    },
    {
        "id": "news_3_spring_10",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 10 },
        "content": "挑战赛决赛前，B市赛场外已开始聚集前来应援的粉丝，相关周边产品热销。",
        "publisher": "城市见闻",
        "ismust": false
    },
    {
        "id": "news_3_spring_11",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 11 },
        "content": "半决赛首回合结束，轮回与霸图分别取胜，在系列赛中占得先机。",
        "publisher": "战果速递",
        "ismust": false
    },
    {
        "id": "news_3_spring_12",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 12 },
        "content": "【商业动态】多家赞助商宣布与进入决赛阶段的战队加深合作，季后赛的商业价值持续凸显。",
        "publisher": "电竞商业",
        "ismust": false
    },
    {
        "id": "news_3_spring_13",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 13 },
        "content": "蓝雨与微草在背水一战中扳回一城，将各自的半决赛拖入最终决胜局。",
        "publisher": "赛事快讯",
        "ismust": false
    },
    {
        "id": "news_3_spring_14",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 14 },
        "content": "挑战赛决赛前最后一场新闻发布会举行，双方队长出席，场面平静但暗藏机锋。",
        "publisher": "赛前动态",
        "ismust": false
    },
    {
        "id": "news_3_spring_15",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 15 },
        "content": "【总决赛队伍出炉】轮回战队战胜微草，率先挺进总决赛。另一场半决赛，霸图惜败于蓝雨，老将们的冠军梦再次延期。",
        "publisher": "荣耀头条",
        "ismust": true
    },
    {
        "id": "news_3_spring_16",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 16 },
        "content": "第九赛季总决赛对阵：轮回 vs 蓝雨。这将是矛与盾、个人英雄主义与团队智慧的终极较量。",
        "publisher": "荣耀头条",
        "ismust": false
    },
    {
        "id": "news_3_spring_17",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 17 },
        "content": "嘉世俱乐部被拍到有资产管理公司人员出入，引发外界关于其财务状况的短暂猜测，但未获官方回应。",
        "publisher": "财经观察",
        "ismust": false
    },
    {
        "id": "news_3_spring_18",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 18 },
        "content": "【挑战赛倒计时】距离B市挑战赛决赛仅剩一周，所有筹备工作进入最后检查阶段。",
        "publisher": "荣耀头条",
        "ismust": false
    },
    {
        "id": "news_3_spring_19",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 19 },
        "content": "荣耀联盟主席接受采访，称赞本赛季竞技水平与关注度创下新高，并对挑战赛的独立发展表示肯定。",
        "publisher": "荣耀头条",
        "ismust": false
    },
    {
        "id": "news_3_spring_20",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 20 },
        "content": "总决赛与挑战赛决赛的媒体证件申请截止，申请数量远超往年，报道阵容空前强大。",
        "publisher": "荣耀头条",
        "ismust": false
    },
    {
        "id": "news_3_spring_21",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 21 },
        "content": "多家数据机构发布季后赛选手各项数据排行，轮回核心选手在多项关键数据上领跑全联盟。",
        "publisher": "数据分析",
        "ismust": false
    },
    {
        "id": "news_3_spring_22",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 22 },
        "content": "【巅峰对决】第九赛季职业联赛总决赛于今日晚间正式开战，轮回与蓝雨展开首回合较量。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_spring_23",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 23 },
        "content": "总决赛首回合，轮回主场先下一城，展现了其强大的进攻火力。",
        "publisher": "战果速递",
        "ismust": false
    },
    {
        "id": "news_3_spring_24",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 24 },
        "content": "总决赛移师蓝雨主场进行次回合，蓝雨凭借主场优势成功扳平总比分。",
        "publisher": "赛事简报",
        "ismust": false
    },
    {
        "id": "news_3_spring_25",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 25 },
        "content": "【挑战赛决赛日】备受瞩目的挑战赛总决赛于今日在B市荣耀体育馆举行，兴欣与嘉世争夺最后的晋级名额。",
        "publisher": "挑战赛官方",
        "ismust": true
    },
    {
        "id": "news_3_spring_26",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 26 },
        "content": "【新王诞生】挑战赛总决赛落幕，兴欣战队战胜嘉世，赢得最终胜利，成功获得进入职业联赛的资格！",
        "publisher": "荣耀头条",
        "ismust": true
    },
    {
        "id": "news_3_spring_27",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 27 },
        "content": "嘉世战队在冲击职业联赛失败后，俱乐部内部传出不稳定消息，其未来走向引发广泛关注。",
        "publisher": "深度追踪",
        "ismust": false
    },
    {
        "id": "news_3_spring_28",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 28 },
        "content": "【王朝加冕】第九赛季总决赛决胜局，轮回战队击败蓝雨，成功卫冕，建立起联盟新的王朝！",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_spring_29",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 29 },
        "content": "赛后有传闻称，失利的嘉世俱乐部资金链可能出现严重问题，或将面临重大变故，联盟表示已介入了解。",
        "publisher": "财经传闻",
        "ismust": false
    },
    {
        "id": "news_3_spring_30",
        "type": "news",
        "time": { "year": 3, "season": "春赛季", "day": 30 },
        "content": "【赛季落幕】第九赛季随着轮回的夺冠正式落下帷幕。与此同时，新科挑战赛冠军兴欣的加入，以及嘉世不确定的未来，都预示着下个赛季的联盟格局将迎来巨变。",
        "publisher": "赛季总结",
        "ismust": true
    },



    // === 第3年夏转会期 ===
    {
        id: "news_3_summer_1_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 1 },
        content: "【重磅地震】嘉世宣布破产！三届冠军豪门陨落，荣耀联盟最大变故",
        publisher: "荣耀官方",
        ismust: true
    },
    {
        id: "news_3_summer_2_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 2 },
        content: "去向成谜！斗神一叶之秋账号卡引各大战队疯抢，轮回开出天价",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_3_summer_3_01",
        type: "news",
        time: { year: 3, season: "冬转会期", day: 3 },
        content: "传言轮回将豪掷千金！或造就双神组合成型，联盟格局面临颠覆",
        publisher: "电竞头条",
        ismust: true
    },
    {
        id: "news_3_summer_4_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 4 },
        content: "原有选手何去何从？！嘉世战队俱乐部破产引广泛关注",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_3_summer_5_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 5 },
        content: "【官宣】兴欣获得职业联盟正式资格！草根逆袭神话，新赛季搅局者登场",
        publisher: "荣耀官方",
        ismust: true
    },
    {
        id: "news_3_summer_6_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 6 },
        content: "某战队成员微博发文'累感不爱'引热议！呼啸队内矛盾彻底爆发",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_3_summer_7_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 7 },
        content: "叶修秘密接触气功师选手！疑似想复刻当年'战斗法师+气功师'经典组合",
        publisher: "战术分析",
        ismust: true
    },
    {
        id: "news_3_summer_8_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 8 },
        content: "微草高层闭门会议频繁！王杰希培养体系或调整，刘小别等人前途未卜",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_3_summer_9_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 9 },
        content: "轮回签约孙翔接近完成！一叶之秋+一枪穿云，史上最强双核即将诞生",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_3_summer_10_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 10 },
        content: "嘉世剩余选手何去何从？苏沐橙去向引关注，豪门解散引联盟反思",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_3_summer_11_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 11 },
        content: "方锐转会传闻坐实！呼啸黄金一代彻底解体，唐昊独木难支",
        publisher: "电竞头条",
        ismust: false
    },
    {
        id: "news_3_summer_12_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 12 },
        content: "叶修瞄准呼啸方锐？气功师转会市场稀缺，兴欣补强计划曝光",
        publisher: "战术分析",
        ismust: false
    },
    {
        id: "news_3_summer_13_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 13 },
        content: "微草选手超市开张！多名选手挂牌交易，王杰希培养体系迎来改革",
        publisher: "转会风向标",
        ismust: false
    },
    {
        id: "news_3_summer_14_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 14 },
        content: "据传轮回天价购买一叶之秋，意欲双神合体震动联盟",
        publisher: "荣耀官方",
        ismust: true
    },
    {
        id: "news_3_summer_15_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 15 },
        content: "战术大师何去何从，肖时钦前途未卜",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_3_summer_16_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 16 },
        content: "兴欣转会策略曝光！叶修专挖墙角，各大战队核心成其目标",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_3_summer_17_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 17 },
        content: "选手转会传闻不断！各大战队争夺核心选手，转会市场异常火爆",
        publisher: "转会风向标",
        ismust: true
    },
    {
        id: "news_3_summer_18_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 18 },
        content: "微草交易完成！王杰希领衔年轻化阵容，魔术师培养体系升级",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_3_summer_19_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 19 },
        content: "苏沐橙转会去向！多家战队争抢第一枪炮师，兴欣成最大热门",
        publisher: "电竞头条",
        ismust: false
    },
    {
        id: "news_3_summer_20_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 20 },
        content: "轮回超级战舰启航！新赛季夺冠无悬念？",
        publisher: "数据分析",
        ismust: false
    },
    {
        id: "news_3_summer_21_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 21 },
        content: "雷霆重建方案公布！俱乐部直言下赛季目标：季后赛",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_3_summer_22_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 22 },
        content: "兴欣战队日益壮大，网游新人崛起",
        publisher: "荣耀官方",
        ismust: true
    },
    {
        id: "news_3_summer_23_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 23 },
        content: "呼啸彻底重建！下克上的胜利还是失败？",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_3_summer_24_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 24 },
        content: "微草新阵容亮相！王杰希领衔年轻化阵容，魔术师培养体系升级",
        publisher: "战队观察",
        ismust: false
    },
    {
        id: "news_3_summer_25_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 25 },
        content: "轮回薪资结构曝光！深度商业模式利弊分析",
        publisher: "电竞经济",
        ismust: false
    },
    {
        id: "news_3_summer_26_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 26 },
        content: "兴欣完整阵容公布！叶神精选阵容，联盟最强配置",
        publisher: "新队观察",
        ismust: false
    },
    {
        id: "news_3_summer_27_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 27 },
        content: "嘉世剩余选手分配！邱非留队重组，嘉世精神薪火相传",
        publisher: "荣耀周刊",
        ismust: false
    },
    {
        id: "news_3_summer_28_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 28 },
        content: "【转会截止日疯狂】多笔交易同时宣布，联盟格局大洗牌",
        publisher: "转会风向标",
        ismust: true
    },
    {
        id: "news_3_summer_29_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 29 },
        content: "各战队新赛季阵容最终确定！轮回vs兴欣-联盟第一人的对决",
        publisher: "电竞前线",
        ismust: false
    },
    {
        id: "news_3_summer_30_01",
        type: "news",
        time: { year: 3, season: "夏转会期", day: 30 },
        content: "冬转会窗关闭！嘉世时代终结，兴欣新时代开启",
        publisher: "荣耀官方",
        ismust: true
    },


    //第3年秋赛季  第十赛季上半


    {
        "id": "news_3_autumn_1",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 1 },
        "content": "【第十赛季开幕】新赛季大幕今日拉开！焦点揭幕战：新科挑战赛冠军兴欣，客场挑战卫冕冠军轮回。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_autumn_2",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 2 },
        "content": "【王者之师】揭幕战战报：轮回主场以10比0的压倒性比分横扫兴欣，给新军上了深刻一课。",
        "publisher": "电竞之家",
        "ismust": true
    },
    {
        "id": "news_3_autumn_3",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 3 },
        "content": "雷霆战队在核心指挥回归后首战告捷，战术运转行云流水，展现黑马潜质。",
        "publisher": "荣耀周刊",
        "ismust": false
    },
    {
        "id": "news_3_autumn_4",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 4 },
        "content": "【纪录伊始】兴欣队长叶修在第二轮个人赛中，使用散人‘君莫笑’拿下回归后首胜，开启连胜。",
        "publisher": "电竞前线",
        "ismust": false
    },
    {
        "id": "news_3_autumn_5",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 5 },
        "content": "赛后采访中，多位选手表示散人‘千机伞’形态多变，在个人赛中极难针对，需要全新研究。",
        "publisher": "选手专访",
        "ismust": false
    },
    {
        "id": "news_3_autumn_6",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 6 },
        "content": "轮回轻取对手，收获两连胜。新核心融入顺畅，王朝底蕴尽显。",
        "publisher": "荣耀观察",
        "ismust": false
    },
    {
        "id": "news_3_autumn_7",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 7 },
        "content": "【王牌归来】兴欣对阵轻裁，全明星级枪炮师账号‘沐雨橙风’于团队赛中重装登场，火力覆盖惊艳全场。",
        "publisher": "电竞之家",
        "ismust": true
    },
    {
        "id": "news_3_autumn_8",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 8 },
        "content": "雷霆取得三连胜，稳居积分榜前列。其战术体系的稳定性获得广泛认可。",
        "publisher": "战术论坛",
        "ismust": false
    },
    {
        "id": "news_3_autumn_9",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 9 },
        "content": "叶修个人赛连胜已达五场，散人打法持续成为联赛热议的战术难题。",
        "publisher": "数据分析",
        "ismust": false
    },
    {
        "id": "news_3_autumn_10",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 10 },
        "content": "兴欣团队赛状态回暖，凭借更整体的配合拿下一轮胜利，止住连败势头。",
        "publisher": "荣耀周刊",
        "ismust": false
    },
    {
        "id": "news_3_autumn_11",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 11 },
        "content": "‘沐雨橙风’与‘君莫笑’的经典搭档在团队赛中重现，其默契配合令对手防线顾此失彼。",
        "publisher": "经典回顾",
        "ismust": false
    },
    {
        "id": "news_3_autumn_12",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 12 },
        "content": "联盟赛事委员会发布通告，称将关注非标准职业在比赛中的数据，确保竞技公平。",
        "publisher": "荣耀官方",
        "ismust": false
    },
    {
        "id": "news_3_autumn_13",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 13 },
        "content": "轮回继续领跑积分榜，各位置实力均衡，冠军相十足。",
        "publisher": "电竞前线",
        "ismust": false
    },
    {
        "id": "news_3_autumn_14",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 14 },
        "content": "【追平纪录】叶修击败对手，个人赛连胜场次达到十场，追平联盟历史开局连胜纪录。",
        "publisher": "电竞之家",
        "ismust": true
    },
    {
        "id": "news_3_autumn_15",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 15 },
        "content": "雷霆核心选手凭借卓越领导力，当选第三周最佳选手。",
        "publisher": "荣耀官方",
        "ismust": false
    },
    {
        "id": "news_3_autumn_16",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 16 },
        "content": "兴欣阵中一位经历转型阵痛的选手，近期贡献多次关键发挥，成为团队X因素。",
        "publisher": "深度观察",
        "ismust": false
    },
    {
        "id": "news_3_autumn_17",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 17 },
        "content": "【新纪录！】叶修战胜强敌，将个人赛开局连胜纪录刷新至十一场，独享历史第一！",
        "publisher": "荣耀头条",
        "ismust": true
    },
    {
        "id": "news_3_autumn_18",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 18 },
        "content": "全明星周末投票首日数据出炉，兴欣多位选手凭借高光表现人气飙升。",
        "publisher": "荣耀周刊",
        "ismust": false
    },
    {
        "id": "news_3_autumn_19",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 19 },
        "content": "沐雨橙风的稳定炮火支援，已成为兴欣团队战术体系中不可或缺的一环。",
        "publisher": "战术分析",
        "ismust": false
    },
    {
        "id": "news_3_autumn_20",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 20 },
        "content": "【十五连胜】叶修的连胜脚步无人能挡，击败又一位名将，将纪录扩大至十五场。",
        "publisher": "电竞前线",
        "ismust": false
    },
    {
        "id": "news_3_autumn_21",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 21 },
        "content": "雷霆稳居积分榜前三，其扎实的团队风格被评论员誉为‘联赛最稳定的力量’。",
        "publisher": "荣耀观察",
        "ismust": false
    },
    {
        "id": "news_3_autumn_22",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 22 },
        "content": "【封神一刻】兴欣与贺武的团队赛中，方锐操作‘海无量’以一记绝妙的‘猥琐流’偷袭奠定胜局，此战封神！",
        "publisher": "电竞之家",
        "ismust": true
    },
    {
        "id": "news_3_autumn_23",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 23 },
        "content": "兴欣战绩持续攀升，凭借一波连胜冲至积分榜中游，彻底摆脱开赛时的低迷。",
        "publisher": "荣耀周刊",
        "ismust": false
    },
    {
        "id": "news_3_autumn_24",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 24 },
        "content": "轮回继续高歌猛进，统治力依旧，是半程冠军最有力争夺者。",
        "publisher": "电竞前线",
        "ismust": false
    },
    {
        "id": "news_3_autumn_25",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 25 },
        "content": "【二十连胜！传奇继续】叶修击败三零一队长杨聪，将个人赛连胜纪录提升至惊世骇俗的二十场！",
        "publisher": "荣耀官方",
        "isMust": true
    },
    {
        "id": "news_3_autumn_26",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 26 },
        "content": "雷霆战队用战绩证明，其复兴并非偶然，已成为联盟格局中不可忽视的一极。",
        "publisher": "深度分析",
        "ismust": false
    },
    {
        "id": "news_3_autumn_27",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 27 },
        "content": "兴欣从开赛两连败到如今稳居中游，其惊人的成长速度成为本赛季最大话题之一。",
        "publisher": "赛季黑马",
        "ismust": false
    },
    {
        "id": "news_3_autumn_28",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 28 },
        "content": "联盟称，针对散人的研讨会将在全明星周末期间举行，听取各战队意见。",
        "publisher": "官方公告",
        "ismust": false
    },
    {
        "id": "news_3_autumn_29",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 29 },
        "content": "【焦点预告】半程收官战，兴欣将再度客场挑战轮回，‘复仇之战’万众瞩目。",
        "publisher": "赛事预告",
        "ismust": true
    },
    {
        "id": "news_3_autumn_30",
        "type": "news",
        "time": { "year": 3, "season": "秋赛季", "day": 30 },
        "content": "第十赛季上半程结束。轮回强势领跑，雷霆稳居前列，而兴欣以一波强劲势头，上演了从谷底到中游的完美逆袭。",
        "publisher": "半程总结",
        "ismust": true
    },

    //第3年冬转会期


    {
        "id": "news_3_winter_1",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 1 },
        "content": "【冬窗开启】冬季转会窗口今日开启，各战队将针对上半程暴露的问题进行阵容调整。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_winter_2",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 2 },
        "content": "网游新年庆典活动预热，全新内容引发玩家期待。",
        "publisher": "网游快讯",
        "ismust": false
    },
    {
        "id": "news_3_winter_3",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 3 },
        "content": "兴欣战队商业合作海报铺开，其草根逆袭的形象深受大众品牌青睐。",
        "publisher": "市场观察",
        "ismust": false
    },
    {
        "id": "news_3_winter_4",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 4 },
        "content": "全明星周末首轮投票开始，叶神重现引发热议，票数增长迅速。",
        "publisher": "荣耀周刊",
        "ismust": false
    },
    {
        "id": "news_3_winter_5",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 5 },
        "content": "呼啸战队官宣引入一位魔剑士选手，旨在补强团队的中场策应能力。",
        "publisher": "战队官宣",
        "ismust": false
    },
    {
        "id": "news_3_winter_6",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 6 },
        "content": "全明星投票持续，叶修票数已稳居前列，其回归成为本届最大话题。",
        "publisher": "电竞之家",
        "ismust": false
    },
    {
        "id": "news_3_winter_7",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 7 },
        "content": "网游新年活动正式上线，全服在线人数迎来高峰。",
        "publisher": "网游热闻",
        "ismust": false
    },
    {
        "id": "news_3_winter_8",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 8 },
        "content": "义斩战队官宣：顶尖狂剑士选手孙哲平正式加盟。",
        "publisher": "战队官宣",
        "ismust": true
    },
    {
        "id": "news_3_winter_9",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 9 },
        "content": "多位本赛季表现出色的新秀在全明星投票中排名靠前。",
        "publisher": "新星观察",
        "ismust": false
    },
    {
        "id": "news_3_winter_10",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 10 },
        "content": "新年活动进入白热化，稀有材料争夺激烈。",
        "publisher": "网游风云",
        "ismust": false
    },
    {
        "id": "news_3_winter_11",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 11 },
        "content": "【投票冲刺】全明星投票进入最后三天，各选手票数竞争激烈。",
        "publisher": "荣耀官方",
        "ismust": false
    },
    {
        "id": "news_3_winter_12",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 12 },
        "content": "呼啸新援已开始随队训练，积极融入战术体系。",
        "publisher": "训练报道",
        "ismust": false
    },
    {
        "id": "news_3_winter_13",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 13 },
        "content": "叶修接受采访，谈及可能重返全明星舞台时表示“随缘”。",
        "publisher": "人物专访",
        "ismust": false
    },
    {
        "id": "news_3_winter_14",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 14 },
        "content": "【投票截止】全明星周末投票通道于今晚24时正式关闭。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_winter_15",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 15 },
        "content": "【全明星阵容公布】第十赛季全明星周末24人正赛名单及新秀挑战赛名单正式公布！",
        "publisher": "荣耀头条",
        "ismust": true
    },
    {
        "id": "news_3_winter_16",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 16 },
        "content": "全明星周末举办地S市进入最后准备阶段。",
        "publisher": "现场直击",
        "ismust": false
    },
    {
        "id": "news_3_winter_17",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 17 },
        "content": "义斩新援在训练中展现出极强的单兵作战能力。",
        "publisher": "战队聚焦",
        "ismust": false
    },
    {
        "id": "news_3_winter_18",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 18 },
        "content": "参加全明星的选手与嘉宾陆续抵达S市。",
        "publisher": "行程动态",
        "ismust": false
    },
    {
        "id": "news_3_winter_19",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 19 },
        "content": "媒体聚焦全明星周末，预热各项趣味环节与对决。",
        "publisher": "赛前前瞻",
        "ismust": false
    },
    {
        "id": "news_3_winter_20",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 20 },
        "content": "【全明星启幕】荣耀第十赛季全明星周末于今日在S市荣耀体育馆盛大开幕！",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_3_winter_21",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 21 },
        "content": "全明星新秀挑战赛精彩落幕，多位年轻选手表现出色，未来可期。",
        "publisher": "赛事速递",
        "ismust": false
    },
    {
        "id": "news_3_winter_22",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 22 },
        "content": "全明星正赛欢乐上演，大神们齐聚一堂，奉献了一场娱乐性十足的表演。",
        "publisher": "欢乐盛典",
        "ismust": false
    },
    {
        "id": "news_3_winter_23",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 23 },
        "content": "全明星周末圆满结束，为下半赛季进行了完美预热。",
        "publisher": "活动总结",
        "ismust": false
    },
    {
        "id": "news_3_winter_24",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 24 },
        "content": "转会市场消息，除已官宣交易外，各队引援意愿平淡。",
        "publisher": "转会观察",
        "ismust": false
    },
    {
        "id": "news_3_winter_25",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 25 },
        "content": "网游新年活动进入尾声。",
        "publisher": "网游简报",
        "ismust": false
    },
    {
        "id": "news_3_winter_26",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 26 },
        "content": "各战队结束假期，恢复训练，备战下半程。",
        "publisher": "备战动态",
        "ismust": false
    },
    {
        "id": "news_3_winter_27",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 27 },
        "content": "【窗口最后阶段】冬季转会窗口将于三日后关闭。",
        "publisher": "转会提醒",
        "ismust": false
    },
    {
        "id": "news_3_winter_28",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 28 },
        "content": "转会市场平静，预计将以平淡收场。",
        "publisher": "市场预测",
        "ismust": false
    },
    {
        "id": "news_3_winter_29",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 29 },
        "content": "窗口关闭前日，无重要交易发生。",
        "publisher": "最终动态",
        "ismust": false
    },
    {
        "id": "news_3_winter_30",
        "type": "news",
        "time": { "year": 3, "season": "冬转会期", "day": 30 },
        "content": "【窗口关闭】冬季转会窗口于今日24时正式关闭。各战队阵容就此锁定，全力冲刺下半赛季。",
        "publisher": "荣耀官方",
        "ismust": true
    },

    //第4年春赛季  第十赛季下半，兴欣夺冠

    {
        "id": "news_4_spring_1",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 1 },
        "content": "【终极冲刺】第十赛季下半程常规赛重燃战火！季后赛席位与最终排名的争夺进入最后也是最残酷的阶段。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_4_spring_2",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 2 },
        "content": "兴欣延续了上半赛季末的火热状态，在强强对话中取胜，稳固了其季后赛席位。",
        "publisher": "荣耀观察",
        "ismust": false
    },
    {
        "id": "news_4_spring_3",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 3 },
        "content": "轮回轻取对手，继续以巨大优势领跑积分榜，其核心选手领跑MVP榜单。",
        "publisher": "赛况速递",
        "ismust": false
    },
    {
        "id": "news_4_spring_4",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 4 },
        "content": "雷霆、蓝雨、霸图等强队均取得胜利，季后赛上半区的竞争异常激烈。",
        "publisher": "战队战报",
        "ismust": false
    },
    {
        "id": "news_4_spring_5",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 5 },
        "content": "【焦点对决】兴欣客场挑战蓝雨，以精妙的团队配合险胜，被评论为“战术执行力”的胜利。",
        "publisher": "深度分析",
        "ismust": true
    },
    {
        "id": "news_4_spring_6",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 6 },
        "content": "常规赛收官轮结束，季后赛八强及对阵全部确定：轮回第一，兴欣位列第六。",
        "publisher": "荣耀官方",
        "ismust": true
    },
    {
        "id": "news_4_spring_7",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 7 },
        "content": "【季后赛启幕】第十赛季季后赛今日正式打响！首轮：轮回对八，霸图对七，蓝雨对六（兴欣），微草对五。",
        "publisher": "荣耀头条",
        "ismust": true
    },
    {
        "id": "news_4_spring_8",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 8 },
        "content": "轮回毫无悬念横扫对手，率先晋级四强，展现王者实力。",
        "publisher": "速胜",
        "ismust": false
    },
    {
        "id": "news_4_spring_9",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 9 },
        "content": "【以下克上】季后赛首轮最大冷门！兴欣在团队赛中发挥出色，以3比1战胜蓝雨，挺进四强！",
        "publisher": "黑马狂奔",
        "ismust": true
    },
    {
        "id": "news_4_spring_10",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 10 },
        "content": "霸图与微草分别战胜各自对手，季后赛四强全部诞生：轮回、霸图、兴欣、微草。",
        "publisher": "四强出炉",
        "ismust": false
    },
    {
        "id": "news_4_spring_11",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 11 },
        "content": "半决赛抽签：轮回 vs 兴欣，霸图 vs 微草。新王挑战旧主，老将再抗豪强。",
        "publisher": "宿命对决",
        "ismust": true
    },
    {
        "id": "news_4_spring_12",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 12 },
        "content": "【半决赛首战】轮回主场迎战兴欣。个人赛中，叶修击败孙翔，将其个人连胜纪录定格在37场，举世皆惊。",
        "publisher": "纪录永恒",
        "ismust": true
    },
    {
        "id": "news_4_spring_13",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 13 },
        "content": "尽管叶修创下神迹，但轮回凭借强大的整体实力，仍在首回合以较大优势战胜兴欣。",
        "publisher": "实力差距",
        "ismust": false
    },
    {
        "id": "news_4_spring_14",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 14 },
        "content": "另一场半决赛，霸图老将们力克微草，先拔头筹。",
        "publisher": "老兵不死",
        "ismust": false
    },
    {
        "id": "news_4_spring_15",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 15 },
        "content": "【绝地反击】半决赛次回合，背水一战的兴欣在团队赛中爆发出惊人能量，逆转战胜轮回，将总比分扳平！",
        "publisher": "逆转奇迹",
        "ismust": true
    },
    {
        "id": "news_4_spring_16",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 16 },
        "content": "微草绝境中扳回一城，将霸图拖入决胜局。",
        "publisher": "魔术师的韧性",
        "ismust": false
    },
    {
        "id": "news_4_spring_17",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 17 },
        "content": "【决胜局】轮回与兴欣的半决赛进入最终决战，双方鏖战至最后一刻，兴欣以微弱的团队优势惊险胜出，闯入总决赛！",
        "publisher": "新王登基？",
        "ismust": true
    },
    {
        "id": "news_4_spring_18",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 18 },
        "content": "霸图在另一场决胜局中力克微草，韩文清率队再次杀入总决赛！",
        "publisher": "十年宿命",
        "ismust": true
    },
    {
        "id": "news_4_spring_19",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 19 },
        "content": "总决赛对阵：兴欣 vs 霸图。这将是联盟历史上最具故事性的总决赛：草根新王 vs 悲情老兵，叶修 vs 韩文清。",
        "publisher": "终极预告",
        "ismust": false
    },
    {
        "id": "news_4_spring_20",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 20 },
        "content": "总决赛门票一秒售罄，这场充满情怀与热血的决赛吸引了全联盟的目光。",
        "publisher": "一票难求",
        "ismust": false
    },
    {
        "id": "news_4_spring_21",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 21 },
        "content": "【总决赛首战】兴欣主场迎战霸图。双方毫无保留，最终兴欣凭借多变的战术和年轻选手的冲劲，先下一城。",
        "publisher": "旗开得胜",
        "ismust": true
    },
    {
        "id": "news_4_spring_22",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 22 },
        "content": "次回合移师霸图主场，老将们凭借钢铁般的意志和丰富的经验扳回一城，总比分1:1。",
        "publisher": "老将的尊严",
        "ismust": false
    },
    {
        "id": "news_4_spring_23",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 23 },
        "content": "总决赛第三场，兴欣再次取胜，总比分2:1领先，拿到赛点。",
        "publisher": "冠军点",
        "ismust": false
    },
    {
        "id": "news_4_spring_24",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 24 },
        "content": "背水一战的霸图爆发出全部能量，将总比分顽强地扳成2:2平。总决赛进入最终决战。",
        "publisher": "绝境逢生",
        "ismust": true
    },
    {
        "id": "news_4_spring_25",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 25 },
        "content": "【荣耀加冕！】第十赛季总决赛最终战落幕！兴欣战队以无可争议的表现，战胜了伟大的对手霸图，赢得了最终的总冠军！",
        "publisher": "荣耀头条",
        "ismust": true
    },
    {
        "id": "news_4_spring_26",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 26 },
        "content": "叶修荣获总决赛MVP。从被退役到率新队夺冠，他完成了荣耀史上最传奇的归来。",
        "publisher": "传奇本人",
        "ismust": true
    },
    {
        "id": "news_4_spring_27",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 27 },
        "content": "霸图战队再次屈居亚军，韩文清等老将赛后向观众致意，其坚持与悲情赢得全场最热烈的掌声。",
        "publisher": "伟大的失败者",
        "ismust": false
    },
    {
        "id": "news_4_spring_28",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 28 },
        "content": "兴欣夺冠游行在H市举行，全城荣耀玩家为之沸腾，网吧队的神话照进现实。",
        "publisher": "全城狂欢",
        "ismust": false
    },
    {
        "id": "news_4_spring_29",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 29 },
        "content": "联盟主席冯宪君在颁奖典礼上高度评价本赛季，称兴欣的夺冠是“荣耀精神最好的诠释”。",
        "publisher": "官方定调",
        "ismust": false
    },
    {
        "id": "news_4_spring_30",
        "type": "news",
        "time": { "year": 4, "season": "春赛季", "day": 30 },
        "content": "【赛季终章】第十赛季，以一支网吧队的终极逆袭落下帷幕。兴欣的冠军，不仅改写了联盟格局，更点燃了无数平凡玩家的梦想。一个时代结束了，而新的传奇，刚刚开始。",
        "publisher": "赛季总结",
        "ismust": true
    }


];


/**
 * 初始战队数据（按解锁状态排序）
 */
const INITIAL_TEAMS = [

    { id: "jiashi", name: "嘉世", unlocked: true },
    { id: "batu", name: "霸图", unlocked: true },
    { id: "weicao", name: "微草", unlocked: true },
    { id: "lanyu", name: "蓝雨", unlocked: true },
    { id: "lunhui", name: "轮回", unlocked: true },
    { id: "baihua", name: "百花", unlocked: false },
    { id: "yueyun", name: "越云", unlocked: true },
    { id: "haoxiao", name: "呼啸", unlocked: false },
    { id: "leiting", name: "雷霆", unlocked: false },
    { id: "xukong", name: "虚空", unlocked: false }, // 初始未解锁
    { id: "yanyu", name: "烟雨", unlocked: false },  // 初始未解锁
    { id: "sanlingyi", name: "三零一", unlocked: false }, // 初始未解锁
    { id: "yizhan", name: "义斩", unlocked: false }, // 初始未解锁
    { id: "xingxin", name: "兴欣", unlocked: false }, // 初始未解锁
    { id: "xinjiashi", name: "新嘉世", unlocked: false }, // 初始未解锁
    { id: "rongyao", name: "荣耀网游", unlocked: false } // 默认解锁


];

/**
 * 初始选手数据（按战队排序）
 */
const INITIAL_PLAYERS = [
    // 嘉世成员
    { id: "yexiu", name: "叶修", team: "嘉世", 职业: "战斗法师", 级别: "S", 期待: "继续荣耀", 好感度: 0, 联系方式: false },
    { id: "sumucheng", name: "苏沐橙", team: "嘉世", 职业: "枪炮师", 级别: "S", 期待: "稳定发挥", 好感度: 0, 联系方式: false },
    { id: "liuhao", name: "刘皓", team: "嘉世", 职业: "魔剑士", 级别: "B+", 期待: "副队长", 好感度: 0, 联系方式: false },
    { id: "heming", name: "贺铭", team: "嘉世", 职业: "元素法师", 级别: "B+", 期待: "主力位置", 好感度: 0, 联系方式: false },
    { id: "shenjian", name: "申建", team: "嘉世", 职业: "拳法家", 级别: "B", 期待: "站稳轮换", 好感度: 0, 联系方式: false },
    { id: "zhangjiaxing", name: "张家兴", team: "嘉世", 职业: "牧师", 级别: "B+", 期待: "主力治疗", 好感度: 0, 联系方式: false },


    // 新嘉世成员
    { id: "qiufei", name: "邱非", team: "新嘉世", 职业: "战斗法师", 级别: "B+", 期待: "扛起嘉世", 好感度: 0, 联系方式: false },
    { id: "wenli", name: "闻理", team: "新嘉世", 职业: "牧师", 级别: "B+", 期待: "主力治疗", 好感度: 0, 联系方式: false },


    // 霸图战队成员
    { id: "hanwenqing", name: "韩文清", team: "霸图", 职业: "拳法家", 级别: "S", 期待: "再战一年", 好感度: 0, 联系方式: false },
    { id: "zhangxinjie", name: "张新杰", team: "霸图", 职业: "牧师", 级别: "S", 期待: "完美治疗", 好感度: 0, 联系方式: false },
    { id: "baiyanfei", name: "白言飞", team: "霸图", 职业: "元素法师", 级别: "B+", 期待: "轮换主力", 好感度: 0, 联系方式: false },
    { id: "qinmuyun", name: "秦牧云", team: "霸图", 职业: "神枪手", 级别: "B+", 期待: "稳定发挥", 好感度: 0, 联系方式: false },
    { id: "zhengchengfeng", name: "郑乘风", team: "霸图", 职业: "骑士", 级别: "B+", 期待: "防守核心", 好感度: 0, 联系方式: false },
    { id: "songqiying", name: "宋奇英", team: "霸图", 职业: "拳法家", 级别: "B+", 期待: "防守核心", 好感度: 0, 联系方式: false },

    // 微草战队成员
    { id: "wangjiexi", name: "王杰希", team: "微草", 职业: "魔道学者", 级别: "S", 期待: "带领团队", 好感度: 0, 联系方式: false },
    { id: "gaoyingjie", name: "高英杰", team: "微草", 职业: "魔道学者", 级别: "B+", 期待: "快速成长", 好感度: 0, 联系方式: false },
    { id: "liuxiaobie", name: "刘小别", team: "微草", 职业: "剑客", 级别: "B+", 期待: "提升操作", 好感度: 0, 联系方式: false },
    { id: "yuanbaiqing", name: "袁柏清", team: "微草", 职业: "牧师", 级别: "B+", 期待: "主力治疗", 好感度: 0, 联系方式: false },
    { id: "liufei", name: "柳非", team: "微草", 职业: "神枪手", 级别: "B+", 期待: "稳定输出", 好感度: 0, 联系方式: false },
    { id: "qiaoyifan", name: "乔一帆", team: "微草", 职业: "刺客", 级别: "B+", 期待: "留在战队", 好感度: 0, 联系方式: false },
    { id: "liyihui", name: "李亦辉", team: "微草", 职业: "柔道家", 级别: "B+", 期待: "保持状态", 好感度: 0, 联系方式: false },
    { id: "xiaoYun", name: "肖云", team: "微草", 职业: "战斗法师", 级别: "B+", 期待: "不被取代", 好感度: 0, 联系方式: false },
    { id: "zhangyebai", name: "周烨柏", team: "微草", 职业: "鬼剑士", 级别: "B+", 期待: "成为主力", 好感度: 0, 联系方式: false },

    // 蓝雨战队成员
    { id: "yuwenzhou", name: "喻文州", team: "蓝雨", 职业: "术士", 级别: "S", 期待: "团队胜利", 好感度: 0, 联系方式: false },
    { id: "huangshaotian", name: "黄少天", team: "蓝雨", 职业: "剑客", 级别: "S", 期待: "更多出场机会", 好感度: 0, 联系方式: false },
    { id: "zhengxuan", name: "郑轩", team: "蓝雨", 职业: "弹药专家", 级别: "B+", 期待: "轻松比赛", 好感度: 0, 联系方式: false },
    { id: "xujingxi", name: "徐景熙", team: "蓝雨", 职业: "守护天使", 级别: "B+", 期待: "稳定治疗", 好感度: 0, 联系方式: false },
    { id: "liyuan", name: "李远", team: "蓝雨", 职业: "召唤师", 级别: "B+", 期待: "上场机会", 好感度: 0, 联系方式: false },
    { id: "songxiao", name: "宋晓", team: "蓝雨", 职业: "气功师", 级别: "B+", 期待: "轮换主力", 好感度: 0, 联系方式: false },
    { id: "yufeng", name: "于锋", team: "蓝雨", 职业: "狂剑士", 级别: "B+", 期待: "核心地位", 好感度: 0, 联系方式: false },

    { id: "luhanwen", name: "卢瀚文", team: "蓝雨", 职业: "剑客", 级别: "B+", 期待: "好好学习", 好感度: 0, 联系方式: false },


    // 轮回战队成员
    { id: "zhouzekai", name: "周泽楷", team: "轮回", 职业: "神枪手", 级别: "S", 期待: "继续发展", 好感度: 0, 联系方式: false },
    { id: "jiangbotao", name: "江波涛", team: "轮回", 职业: "魔剑士", 级别: "B+", 期待: "团队协调", 好感度: 0, 联系方式: false },
    { id: "lvboyuan", name: "吕泊远", team: "轮回", 职业: "柔道家", 级别: "B+", 期待: "进步", 好感度: 0, 联系方式: false },
    { id: "duming", name: "杜明", team: "轮回", 职业: "剑客", 级别: "B+", 期待: "稳定出场", 好感度: 0, 联系方式: false },
    { id: "fangminghua", name: "方明华", team: "轮回", 职业: "牧师", 级别: "B+", 期待: "经验治疗", 好感度: 0, 联系方式: false },
    { id: "wuqi", name: "吴启", team: "轮回", 职业: "刺客", 级别: "B+", 期待: "轮换位置", 好感度: 0, 联系方式: false },

    // 百花战队成员
    { id: "tanghao", name: "唐昊", team: "百花", 职业: "流氓", 级别: "S", 期待: "成为核心", 好感度: 0, 联系方式: false },
    { id: "zouyuan", name: "邹远", team: "百花", 职业: "弹药专家", 级别: "B+", 期待: "证明自己", 好感度: 0, 联系方式: false },
    { id: "zhangwei", name: "张伟", team: "百花", 职业: "魔道学者", 级别: "B+", 期待: "辅助队长", 好感度: 0, 联系方式: false },
    { id: "mochuchen", name: "莫楚辰", team: "百花", 职业: "牧师", 级别: "B+", 期待: "主力治疗", 好感度: 0, 联系方式: false },
    { id: "zhuxiaoping", name: "朱效平", team: "百花", 职业: "驱魔师", 级别: "B+", 期待: "战术作用", 好感度: 0, 联系方式: false },
    { id: "zhouguangyi", name: "周光义", team: "百花", 职业: "刺客", 级别: "B+", 期待: "轮换位置", 好感度: 0, 联系方式: false },

    // 越云战队成员
    { id: "sunxiang", name: "孙翔", team: "越云", 职业: "狂剑士", 级别: "S", 期待: "称霸荣耀", 好感度: 0, 联系方式: false },

    // 呼啸战队成员
    { id: "linjingyan", name: "林敬言", team: "呼啸", 职业: "流氓", 级别: "A+", 期待: "保持状态", 好感度: 0, 联系方式: false },
    { id: "fangrui", name: "方锐", team: "呼啸", 职业: "盗贼", 级别: "S", 期待: "猥琐流大师", 好感度: 0, 联系方式: false },
    { id: "ruanyongbin", name: "阮永彬", team: "呼啸", 职业: "牧师", 级别: "B+", 期待: "主力治疗", 好感度: 0, 联系方式: false },
    { id: "zhaoyuzhe", name: "赵禹哲", team: "呼啸", 职业: "元素法师", 级别: "B+", 期待: "最佳新人", 好感度: 0, 联系方式: false },
    { id: "linfeng", name: "林枫", team: "呼啸", 职业: "盗贼", 级别: "B+", 期待: "最佳新人", 好感度: 0, 联系方式: false },


    // 雷霆战队成员
    { id: "xiaoshiqin", name: "肖时钦", team: "雷霆", 职业: "机械师", 级别: "S", 期待: "战术核心", 好感度: 0, 联系方式: false },
    { id: "fangxuecai", name: "方学才", team: "雷霆", 职业: "刺客", 级别: "B+", 期待: "副队长", 好感度: 0, 联系方式: false },
    { id: "chengtai", name: "程泰", team: "雷霆", 职业: "拳法家", 级别: "B+", 期待: "稳定首发", 好感度: 0, 联系方式: false },
    { id: "mixiuyuan", name: "米修远", team: "雷霆", 职业: "刺客", 级别: "B+", 期待: "进步空间", 好感度: 0, 联系方式: false },
    { id: "daiyanqi", name: "戴妍琦", team: "雷霆", 职业: "元素法师", 级别: "B+", 期待: "出场机会", 好感度: 0, 联系方式: false },
    { id: "luyining", name: "鲁奕宁", team: "雷霆", 职业: "神枪手", 级别: "B+", 期待: "出场机会", 好感度: 0, 联系方式: false },

    // 虚空战队成员
    { id: "lixuan", name: "李轩", team: "虚空", 职业: "鬼剑士", 级别: "S", 期待: "双鬼拍阵", 好感度: 0, 联系方式: false },
    { id: "wuyuce", name: "吴羽策", team: "虚空", 职业: "鬼剑士", 级别: "B+", 期待: "配合李轩", 好感度: 0, 联系方式: false },
    { id: "yanghaoxuan", name: "杨昊轩", team: "虚空", 职业: "枪炮师", 级别: "B+", 期待: "输出支持", 好感度: 0, 联系方式: false },
    { id: "lixun", name: "李迅", team: "虚空", 职业: "刺客", 级别: "B+", 期待: "偷袭机会", 好感度: 0, 联系方式: false },
    { id: "gemolan", name: "葛兆蓝", team: "虚空", 职业: "弹药专家", 级别: "B+", 期待: "成为主力", 好感度: 0, 联系方式: false },
    { id: "tanglisheng", name: "唐礼升", team: "虚空", 职业: "守护天使", 级别: "B+", 期待: "保持状态", 好感度: 0, 联系方式: false },
    { id: "gaiCaiJie", name: "盖才捷", team: "虚空", 职业: "驱魔师", 级别: "B+", 期待: "快速成长", 好感度: 0, 联系方式: false },


    // 烟雨战队成员
    { id: "chuyunxiu", name: "楚云秀", team: "烟雨", 职业: "元素法师", 级别: "S", 期待: "提升战力", 好感度: 0, 联系方式: false },
    { id: "lihua", name: "李华", team: "烟雨", 职业: "忍者", 级别: "B+", 期待: "辅助队长", 好感度: 0, 联系方式: false },
    { id: "baiqi", name: "白祁", team: "烟雨", 职业: "牧师", 级别: "B+", 期待: "主力治疗", 好感度: 0, 联系方式: false },
    { id: "fengxiangming", name: "冯向明", team: "烟雨", 职业: "枪炮师", 级别: "B+", 期待: "远程输出", 好感度: 0, 联系方式: false },
    { id: "sunliang", name: "孙亮", team: "烟雨", 职业: "拳法家", 级别: "B+", 期待: "远程输出", 好感度: 0, 联系方式: false },

    // 三零一战队成员
    { id: "yangcong", name: "杨聪", team: "三零一", 职业: "刺客", 级别: "A+", 期待: "致命一击", 好感度: 0, 联系方式: false },
    { id: "xubin", name: "许斌", team: "三零一", 职业: "骑士", 级别: "B+", 期待: "保护队友", 好感度: 0, 联系方式: false },
    { id: "gaojie", name: "高杰", team: "三零一", 职业: "神枪手", 级别: "B+", 期待: "主力输出", 好感度: 0, 联系方式: false },
    { id: "sunmingjin", name: "孙明进", team: "三零一", 职业: "骑士", 级别: "B+", 期待: "战术防守", 好感度: 0, 联系方式: false },
    { id: "qianwenju", name: "钱文举", team: "三零一", 职业: "魔道学者", 级别: "B+", 期待: "团队配合", 好感度: 0, 联系方式: false },


    // 义斩战队成员
    { id: "louguanning", name: "楼冠宁", team: "义斩", 职业: "狂剑士", 级别: "B+", 期待: "战队老板兼核心", 好感度: 0, 联系方式: false },
    { id: "wenzhili", name: "文客北", team: "义斩", 职业: "战斗法师", 级别: "B+", 期待: "主力攻坚", 好感度: 0, 联系方式: false },
    { id: "guansongyan", name: "顾夕夜", team: "义斩", 职业: "柔道家", 级别: "B+", 期待: "近战控制", 好感度: 0, 联系方式: false },
    { id: "zhongyezi", name: "钟叶离", team: "义斩", 职业: "牧师", 级别: "B+", 期待: "守护队友", 好感度: 0, 联系方式: false },
    { id: "zouyunhai", name: "邹云海", team: "义斩", 职业: "元素法师", 级别: "B+", 期待: "远程火力与控场", 好感度: 0, 联系方式: false },


    // 荣耀网游成员（第八赛季初）
    { id: "tangrou", name: "唐柔", cardname: "寒烟柔", team: "荣耀网游", 职业: "战斗法师", 级别: "C", 期待: "成为职业", 好感度: 0, 联系方式: false },
    { id: "baorongxing", name: "包荣兴", cardname: "包子入侵", team: "荣耀网游", 职业: "流氓", 级别: "C", 期待: "打职业", 好感度: 0, 联系方式: false },
    { id: "luoji", name: "罗辑", cardname: "昧光", team: "荣耀网游", 职业: "召唤师", 级别: "C", 期待: "学习进步", 好感度: 0, 联系方式: false },
    { id: "anwenyi", name: "安文逸", cardname: "小手冰凉", team: "荣耀网游", 职业: "牧师", 级别: "C", 期待: "精准治疗", 好感度: 0, 联系方式: false },
    { id: "weichen", name: "魏琛", cardname: "迎风布阵", team: "荣耀网游", 职业: "术士", 级别: "B+", 期待: "再战一季", 好感度: 0, 联系方式: false, debutStatus: "已职业注册", debutDate: "1赛季" },
    { id: "mofan", name: "莫凡", cardname: "毁人不倦", team: "荣耀网游", 职业: "忍者", 级别: "C", 期待: "沉默高手", 好感度: 0, 联系方式: false },
    { id: "shukexin", name: "舒可欣", cardname: "莫敢回手", team: "荣耀网游", 职业: "神枪手", 级别: "C", 期待: "大放光彩", 好感度: 0, 联系方式: false },
    { id: "shukeyi", name: "舒可怡", cardname: "谁不低头", team: "荣耀网游", 职业: "神枪手", 级别: "C", 期待: "职业巅峰", 好感度: 0, 联系方式: false },
    { id: "baishu", name: "白庶", cardname: "Crusader", team: "荣耀网游", 职业: "骑士", 级别: "B+", 期待: "纵横四海", 好感度: 0, 联系方式: false, debutStatus: "已职业注册", debutDate: "7赛季" },
    { id: "zhangjiale", name: "张佳乐", cardname: "浅花迷人", team: "荣耀网游", 职业: "弹药专家", 级别: "S", 期待: "冠军", 好感度: 0, 联系方式: false, debutStatus: "已职业注册", debutDate: "2赛季" },
    { id: "sunzheping", name: "孙哲平", cardname: "再睡一夏", team: "荣耀网游", 职业: "狂剑士", 级别: "A", 期待: "重返赛场", 好感度: 0, 联系方式: false, debutStatus: "已职业注册", debutDate: "2赛季" }
];

// 选手对话数据
const PLAYER_DIALOGS_CONFIG = {
    "sunxiang": {
        byTimeAndTeam: {
            "1-冬转会期-嘉世": [
                "我要让斗神之名再次响彻荣耀！",
                "转会费这么高，我必须证明自己的价值",
                "我要做荣耀第一人！就从嘉世开始",
                "战斗法师才是最強的！",
                "你觉得我比叶秋怎么样？"
            ]
        },
        gift: [
            "谢啦！你是我的粉丝吗？",
            "这个不错，谢了！下次比赛看我表现！",
            "挺会挑礼物的嘛",
            "谢了，我会好好使用的"
        ],
        general: [
            "有事吗？我在训练",
            "找我有什么事？",
            "训练时间很宝贵",
            "你是来谈转会的吗？"
        ]
    },
    "zhouzekai": {
        byTimeAndTeam: {
            "1-冬转会期-轮回": [
                "...准备比赛",
                "...新赛季",
                "...加油",
                "...一起努力"
            ]
        },
        gift: [
            "...谢谢",
            "嗯...谢谢",
            "...好礼物",
            "谢谢"
        ],
        general: [
            "...",
            "...什么事？",
            "嗯...",
            "哦..."
        ]
    },
    "wangjiexi": {
        byTimeAndTeam: {
            "1-冬转会期-微草": [
                "新赛季要有新战术",
                "年轻队员需要更多锻炼机会",
                "微草的目标永远是冠军",
                "魔术师打法？那是过去式了"
            ]
        },
        gift: [
            "谢谢，这很有用",
            "费心了，我会好好使用的",
            "礼物不错，谢了",
            "多谢，这对我有帮助"
        ],
        general: [
            "找我有什么事？",
            "微草的训练很紧张",
            "你是经纪人？",
            "战队管理很重要"
        ]
    },
    "yuwenzhou": {
        byTimeAndTeam: {
            "1-冬转会期-蓝雨": [
                "战术需要仔细研究",
                "团队配合很重要",
                "少天最近状态不错",
                "新赛季要稳扎稳打"
            ]
        },
        gift: [
            "谢谢，很实用的礼物",
            "费心了，我会妥善使用",
            "礼物很贴心，谢谢"
        ],
        general: [
            "你好，有什么事？",
            "战队战术需要不断调整",
            "团队协作是关键"
        ]
    },
    "huangshaotian": {
        byTimeAndTeam: {
            "1-冬转会期-蓝雨": [
                "队长！新赛季我要打更多比赛！",
                "我的剑客操作又进步了，要不要看看？",
                "蓝雨的氛围我最喜欢了，热闹！",
                "比赛就是要多说多打才有趣嘛"
            ]
        },
        gift: [
            "哇！这个我喜欢！谢啦谢啦！",
            "不错不错，下次比赛我会更努力的！",
            "谢了！我就喜欢你这种爽快的经纪人！"
        ],
        general: [
            "找我干嘛？有事快说我很忙的！",
            "训练训练训练！我还可以再练一小时！",
            "你是经纪人？有什么好玩的转会消息吗？"
        ]
    },
    "sumucheng": {
        byTimeAndTeam: {
            "1-冬转会期-嘉世": [
                "嘉世现在需要更多凝聚力，我会努力配合新队长",
                "沐雨橙风的手感越来越好了，这赛季要多研究新战术",
                "天气不错，是个训练的好日子呢",
                "你说孙翔啊...他确实很有天赋，但风格不太一样"
            ]
        },
        gift: [
            "呀，这个好可爱！谢谢你！",
            "很实用的礼物呢，我很喜欢",
            "谢谢你总是这么贴心",
            "这个礼物，我会好好珍惜的"
        ],
        general: [
            "你好呀，今天天气不错呢",
            "找我有什么事吗？",
            "训练虽然累，但也很充实",
            "你对荣耀职业圈有什么想了解的吗？"
        ],
        exchangeContact: [
            "这是我的联系方式，有事随时联系我哦",
            "好的，加个联系方式吧，以后多联系",
            "随时欢迎你找我聊天",
            "保持联系，我会很高兴的"
        ]
    },
    "yexiu": {
        byTimeAndTeam: {
            "1-冬转会期-嘉世": [
                "又要开始新赛季了，抽根烟缓缓",
                "荣耀啊...这游戏挺有意思的",
                "战术？随机应变就好",
                "今天训练状态不错"
            ]
        },
        gift: [
            "烟？哦，不是啊",
            "谢了，不过有烟吗？",
            "多谢，不用破费啦",
            "礼物啊...谢了"
        ],
        general: [
            "有事？",
            "荣耀？这游戏要用心玩",
            "战术这种东西，看对手情况而定",
            "你觉得哪个职业最强？"
        ],
        exchangeContact: [
            "联系方式？好啊！",
            "加个好友吧，以后副本缺人叫你",
            "有事直接可以来找我",
            "我没有电话……加qq吧"
        ]
    },
    "hanwenqing": {
        byTimeAndTeam: {
            "1-冬转会期-霸图": [
                "新赛季，照旧。",
                "霸图的目标，永远只有一个。",
                "战术？把他们都击垮。",
                "状态正好，再多练一会。"
            ]
        },
        gift: [
            "我不需要这些。",
            "拿回去。",
            "谢了。但下不为例。",
            "……放那里吧。"
        ],
        general: [
            "说。",
            "荣耀，不是用来玩的。",
            "最强的职业？让操作者来说话。",
            "霸图，永不言弃。"
        ],
        exchangeContact: [
            "可以。有正事随时找我。",
            "我的电话只谈工作。",
            "记一下。没事别打。",
            "战队事务可以联系俱乐部。"
        ]
    },
    "xiaoshiqin": {
        byTimeAndTeam: {
            "1-冬转会期-雷霆": [
                "雷霆的阵容需要重新调整",
                "战术要结合每个人的特点来制定",
                "这个赛季的目标是进入季后赛",
                "机械师的优势在于远程牵制和团队配合"
            ]
        },
        gift: [
            "很实用的礼物，谢谢",
            "这个对训练有帮助，费心了",
            "礼物不错，我会好好利用",
            "谢了，正好需要这个"
        ],
        general: [
            "找我有什么事？战术方面的吗？",
            "训练计划需要严格执行",
            "你对荣耀战术有什么见解？",
            "团队配合是胜利的关键"
        ],
        exchangeContact: [
            "这是我的联系方式，战术方面可以随时交流",
            "保持联系，有比赛可以一起分析",
            "加个好友，以后多探讨战术",
            "这是我的号码，有需要随时联系"
        ]
    }
};


// ==================== 信件配置 ====================
// 静态配置：信件模板数据（不需要存档）
const LETTER_CONFIGS = [
    {
        id: 'welcome-letter',
        triggerYear: 1,
        triggerSeason: '冬转会期',
        triggerDay: 1,
        title: '你的荣耀旅程开始了！',
        content: `
            <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
                <p style="text-indent: 2em;">嘿，未来的金牌经纪人！</p>
                
                <p style="text-indent: 2em;">如同每一个冒险故事的开篇，主角总会收到一封来自命运的邀约。现在，在这个荣耀电竞的世界里，属于你的那封信正在打开。</p>
                
                <p style="text-indent: 2em;">欢迎来到《荣耀经纪人》的世界！在这里，你将扮演一名顶尖的转会经纪人，为战队寻找最合适的选手，为选手争取最佳合约。每一个决定都关乎赛季成败，每一次谈判都是没有硝烟的战争。</p>
                
                <div style="margin: 20px 0; padding: 15px; background: linear-gradient(to right, rgba(226, 183, 20, 0.1), rgba(226, 183, 20, 0.05)); border-left: 4px solid #e2b714; border-radius: 4px;">
                    <p style="margin: 0 0 10px 0; color: #92400e; font-weight: bold;">📌 新手指南：</p>
                    <p style="margin: 5px 0;">1. <strong>广场</strong>：查看新闻和战队动态，了解行业风向</p>
                    <p style="margin: 5px 0;">2. <strong>委托</strong>：接受战队发布的招募任务，赚取佣金</p>
                    <p style="margin: 5px 0;">3. <strong>协商</strong>：与选手谈判转会事宜，提升成功率</p>
                    <p style="margin: 5px 0;">4. <strong>工作室</strong>：管理属性、培养选手、恢复能量</p>
                    <p style="margin: 5px 0;">5. <strong>能量系统</strong>：每次行动消耗能量，记得合理休息！</p>
                </div>
                
                <p style="text-indent: 2em;">你的起始资金：<span style="color: #dc2626; font-weight: bold;">5000元</span>，这是你的第一桶金，记得合理规划。</p>
                
                <p style="text-indent: 2em;">转会期已经开启，各大战队都在寻找新的血液。嘉世、霸图、蓝雨、微草……这些响当当的名字，现在都需要你的专业服务。</p>
                
                <p style="text-indent: 2em;">记住，在这个世界：<span style="color: #92400e; font-weight: bold;">人脉就是资源，眼光就是财富</span>。</p>
                
                <p style="text-indent: 2em;">荣耀的世界从不缺少传奇，现在轮到你来书写了！</p>
                
                <p style="text-indent: 2em;">祝你好运，经纪人！</p>
                
                <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;">
                    <p style="margin: 0; color: #92400e; font-weight: bold;">—— 荣耀经纪公会</p>
                    <p style="margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;">
                        第1年 冬转会期 第1天
                    </p>
                </div>
            </div>
        `,
        style: 'warm',
        animation: 'slide-in',
        priority: 1
    },
    {
        id: 'game-finale-letter',
        triggerYear: 4,
        triggerSeason: '夏转会期',
        triggerDay: 1,
        title: '工作总结',
        content: function () {
            return `
        <div style="font-family: 'SimSun', 'STKaiti', serif; line-height: 1.6;">
            <p style="text-indent: 2em;">尊敬的经纪人 ${gameData.agent.name}，</p>
            
            <p style="text-indent: 2em;">随着荣耀联赛第十赛季落下帷幕，您的工作室同样收获满满：</p>
            
            <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 10px;">
                <h3 style="margin: 0 0 15px 0; color: #92400e; text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
                    📊 工作室业绩报告
                </h3>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                   
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <div style="font-size: 0.85rem; color: #64748b;">成功委托</div>
                        <div style="font-size: 0.85rem; color: #10b981; font-weight: bold;">${gameData.commissions.filter(c => c.status === 'completed').length}项</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <div style="font-size: 0.85rem; color: #64748b;">累计佣金</div>
                        <div style="font-size: 0.85rem; color: #dc2626; font-weight: bold;">${gameData.commissions.filter(c => c.status === 'completed').reduce((sum, c) => sum + (c.reward || 0), 0).toLocaleString()}元</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <div style="font-size: 0.85rem; color: #64748b;">工作室资金</div>
                        <div style="font-size: 0.85rem; color: #dc2626; font-weight: bold;">${gameData.agent.money.toLocaleString()}元</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <div style="font-size: 0.85rem; color: #64748b;">行业声望</div>
                        <div style="font-size: 0.85rem; color: #f97316; font-weight: bold;">${gameData.agent.attributes.声望}点</div>
                    </div>
                </div>
            </div>
            
            <p style="text-indent: 2em;">回顾这段经历：从最初的5000元启动资金，到如今的规模；从第一个委托，到现在的 ${gameData.commissions.filter(c => c.status === 'completed').length} 次成功合作。</p>
            
            <p style="text-indent: 2em;">或许有惊喜，也或许有遗憾，但这就是人生的常态。</p>
            
            <p style="text-indent: 2em;">荣耀旅程告一段落，但您的故事还未结束。您可以选择继续运营工作室，或是重新开始一段新的旅程。</p>
            
            <p style="text-indent: 2em;">祝您玩得开心！</p>
            
            <div style="text-align: right; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #d97706;">
                <p style="margin: 0; color: #92400e; font-weight: bold;">—— 荣耀经纪公会</p>
                <p style="margin: 5px 0 0 0; color: #92400e; opacity: 0.7; font-size: 0.9em;">
                    第4年 夏转会期 第1天
                </p>
            </div>
        </div>
    `;
        },
        style: 'prestige',
        animation: 'glow',
        priority: 3
    }



];