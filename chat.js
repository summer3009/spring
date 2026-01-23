// 对话配置数组 - 按时间、选手、条件预置
const playerDialogues = {
    "叶修": [
        // ====== 通用金钱帮助 ======
        {
            id: "ye_xiu_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 叶哥，最近资金有点紧张，能帮个忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 2000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "啧，你怎么知道我刚发工资了？" },
                        { speaker: "player", text: "啊哈哈真不好意思……最近开销有点大……", isPlayerOption: true },
                        { speaker: "npc", text: "行吧，拿去应急。不过事业要想长久发展，资金管理也是很重要的环节。" },
                        { speaker: "player", text: "明白了……", isPlayerOption: true },
                        { speaker: "player", text: "谢谢叶哥！我一定会还的！", isPlayerOption: true },
                        { speaker: "npc", text: "不用这么客气。" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 1800,
                        redPacketMessage: "江湖救急，不用还了！"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第1年冬转会期 早期 <= 15  ======
        {
            id: "ye_xiu_season1_winter_early_low",
            condition: (time, player) => {
                return time.year === 1 &&
                    time.season === "冬转会期" &&
                    time.day >= 1 && time.day <= 15;
            },
            playerOptions: [
                {
                    text: "⭐叶神，又见面了。",
                    condition: (player) => {
                        if (!gameData.specialDialogues) gameData.specialDialogues = [];
                        const hasTriggered = gameData.specialDialogues.some(d =>
                            d.id === "ye_xiu_101" && d.triggered === true
                        );
                        return player.好感度 >= 80 && !hasTriggered;
                    },
                    isSpecial: true,
                    specialId: "ye_xiu_101",
                    responseChain: [
                        { speaker: "npc", text: "最近经常看到你，是想来我们嘉世挖人吗？" },
                        { speaker: "player", text: "哈……", isPlayerOption: true }
                    ],
                    afterEffects: { showBranchChoice: true },
                    branchOptions: [
                        {
                            id: "branch_ye_xiu_10101",
                            text: "客气回应",
                            responseChain: [
                                { speaker: "player", text: "当然啦，我要来嘉世多多向您学习嘛！", isPlayerOption: true },
                                { speaker: "npc", text: "羊毛也不能总在一只羊身上薅，也多去其他战队看看吧。" },
                                { speaker: "npc", text: "做转会经纪人，社交能力和谈判技巧一样重要。" },
                                { speaker: "player", text: "我知道了，谢谢叶神！", isPlayerOption: true }
                            ],
                            afterEffects: { updateFavorability: 2 }
                        },
                        {
                            id: "branch_ye_xiu_10102",
                            text: "实话实说",
                            responseChain: [
                                { speaker: "player", text: "其实……", isPlayerOption: true },
                                { speaker: "player", text: "嘉世有一笔转会委托，所以我想来了解一下情况。", isPlayerOption: true },
                                { speaker: "npc", text: "我听说了，俱乐部想招募越云战队的孙翔。我看过他的资料，还不错。" },
                                { speaker: "player", text: "可是嘉世招募的是战斗法师选手……你不怕他抢了你的位置吗？", isPlayerOption: true },
                                { speaker: "npc", text: "哈，放心，“我的位置”也没那么容易被抢的。" },
                                { speaker: "npc", text: "不过如果他的到来能让嘉世变得更强大，那也未尝不是一件好事。" },
                                { speaker: "player", text: "这样吗……", isPlayerOption: true },

                            ],
                            afterEffects: { updateFavorability: 5 }
                        }
                    ],
                    postBranchResponseChain: [
                        { speaker: "npc", text: "我先去忙了，有机会再聊。" },
                        { speaker: "player", text: "好，叶神再见。", isPlayerOption: true }
                    ]

                },
                {
                    text: "冬转会期开始了，叶神有什么想法吗？",
                    responseChain: [
                        { speaker: "npc", text: "抓紧时间训练，为后半赛季做好准备。" },
                        { speaker: "player", text: "额……叶神，你不考虑随便转个会帮帮我的生意吗？", isPlayerOption: true },
                        { speaker: "npc", text: "哈，你这想法挺好。" },
                        { speaker: "npc", text: "不过我没有这个考虑。" },
                        { speaker: "player", text: "如果以后叶神有了任何“想法”，一定要找我！", isPlayerOption: true },
                        { speaker: "player", text: "我会为叶神选择最好的转会方案！", isPlayerOption: true },
                        { speaker: "npc", text: "行，记住你了。" }
                    ],
                    afterEffects: { updateFavorability: 2 },
                    nextDialogueId: null
                },
                {
                    text: "我刚做经纪人，叶神有什么建议吗？",
                    responseChain: [
                        { speaker: "npc", text: "建议？多看多听少说话。" },
                        { speaker: "player", text: "具体该怎么做呢？", isPlayerOption: true },
                        { speaker: "npc", text: "了解每个选手的性格和需求，转会不是买卖商品。" },
                        { speaker: "player", text: "那怎么判断转会能不能成功？", isPlayerOption: true },
                        { speaker: "npc", text: "看双方的需求是否匹配，强扭的瓜不甜，对战队和选手的发展也没有好处。" },
                        { speaker: "player", text: "嗯……有道理。", isPlayerOption: true }
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                }
            ]
        },

        // ====== 第1年冬转会期 后期 (大于15) ======
        {
            id: "ye_xiu_season1_winter_late_medium",
            condition: (time, player) => {
                return time.year === 1 &&
                    time.season === "冬转会期" &&
                    time.day > 15;
            },
            playerOptions: [
                {
                    text: "⭐嘉世招募战斗法师的委托我顺利完成了",
                    condition: (player) => {
                        const isCommission001Completed = gameData.commissions.some(comm =>
                            comm.id === "commission-001" &&
                            comm.status === "completed"
                        );
                        if (!gameData.specialDialogues) gameData.specialDialogues = [];
                        const hasTriggered = gameData.specialDialogues.some(d =>
                            d.id === "ye_xiu_102" && d.triggered === true
                        );
                        return player.好感度 >= 100 && isCommission001Completed && !hasTriggered;
                    },
                    isSpecial: true,
                    specialId: "ye_xiu_102",
                    responseChain: [
                        { speaker: "npc", text: "恭喜！这段时间的忙碌有了收获，干得不错" },
                        { speaker: "player", text: "多亏了叶哥的帮助，我才能这么顺利！", isPlayerOption: true },
                        { speaker: "npc", text: "应该说“多亏了你自己的努力”才对。" },

                    ],
                    afterEffects: { showBranchChoice: true },
                    branchOptions: [
                        {
                            id: "branch_ye_xiu_10201",
                            text: "我想请你吃饭",
                            responseChain: [
                                { speaker: "npc", text: "这么客气？不用啦" },
                                { speaker: "npc", text: "最近队里比较忙，时间上不太方便" },
                                { speaker: "player", text: "这样……那下次一定！", isPlayerOption: true },
                                { speaker: "npc", text: "好，下次一定。" }
                            ],
                            afterEffects: { updateFavorability: 3 }
                        },
                        {
                            id: "branch_ye_xiu_10202",
                            text: "我想请你来工作室参观",
                            responseChain: [
                                { speaker: "player", text: "拿到委托金我第一时间就把工作室好好布置了一番，欢迎叶哥莅临指导！", isPlayerOption: true },
                                { speaker: "npc", text: "很有干劲嘛。" },
                                { speaker: "npc", text: "好，有时间一定去拜访。" },
                                { speaker: "player", text: "那就这么说定了！", isPlayerOption: true }
                            ],
                            afterEffects: { updateFavorability: 5 }
                        }
                    ],
                    postBranchResponseChain: [
                        { speaker: "npc", text: "那我先去忙了，继续加油吧。" },
                        { speaker: "player", text: "我会的！我会继续抢下一百个委托，完成一百个转会的！", isPlayerOption: true },
                        { speaker: "npc", text: "哈……还真是有干劲" }
                    ]
                },

                {
                    text: "叶哥，你为什么从来不参加商业活动？",
                    responseChain: [
                        { speaker: "npc", text: "嗯……没时间。" },
                        { speaker: "player", text: "只是因为没时间么？", isPlayerOption: true },
                        { speaker: "npc", text: "那些活动对打荣耀也没帮助啊。" },
                        { speaker: "player", text: "但能赚钱啊！", isPlayerOption: true },
                        { speaker: "npc", text: "钱够用就行，荣耀不是赚钱的工具。" },
                        { speaker: "player", text: "可是我想买个叶哥亲自代言的鼠标，一定很好用！", isPlayerOption: true },
                        { speaker: "npc", text: "?" },
                        { speaker: "npc", text: "那我直接送你一个好了" },
                        { speaker: "player", text: "哇那我就不客气了！谢谢叶哥！", isPlayerOption: true },
                        { speaker: "npc", text: "回头找我来拿就行" },
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                },
                {
                    text: "怎么才能和选手打好关系？",
                    responseChain: [
                        { speaker: "npc", text: "设身处地，想想他们需要什么。" },
                        { speaker: "player", text: "比如呢？", isPlayerOption: true },
                        { speaker: "npc", text: "年轻选手缺机会，老将缺理解，核心选手缺支持。" },
                        { speaker: "player", text: "那要是选手自己都不知道需要什么怎么办……", isPlayerOption: true },
                        { speaker: "npc", text: "那就帮他们看清自己。这也是经纪人的价值。" },
                        { speaker: "player", text: "明白了，谢谢叶哥！", isPlayerOption: true },
                        { speaker: "npc", text: "嗯，慢慢来，关系是处出来的。" },
                        { speaker: "player", text: "我会和叶哥好好相处的！✊✊", isPlayerOption: true },
                        { speaker: "npc", text: "😊" }

                    ],
                    afterEffects: { updateFavorability: 2 },
                    nextDialogueId: null
                },
                {
                    text: "职业选手的日常怎么样？",
                    responseChain: [
                        { speaker: "npc", text: "对我来说和训练日也没太大区别。" },
                        { speaker: "player", text: "你不休息吗？", isPlayerOption: true },
                        { speaker: "npc", text: "休息？荣耀就是最好的休息。" },
                        { speaker: "player", text: "能把爱好就作为工作，一定很开心吧。", isPlayerOption: true },
                        { speaker: "npc", text: "是啊，你不也一样吗？" },
                        { speaker: "player", text: "没错！抢到委托就是我最快乐的事！", isPlayerOption: true }
                    ],
                    afterEffects: { updateFavorability: 2 },
                    nextDialogueId: null
                }

            ]
        },

        // ====== 第2年春赛季 早期 (特殊道歉) ======
        {
            id: "ye_xiu_season2_spring_mid_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "春赛季" && time.day <= 15 &&
                    player.好感度 >= 80;
            },
            playerOptions: [
                {
                    text: "⭐叶哥，孙翔转会嘉世的事我很抱歉……",
                    condition: (player) => {
                        const isCommission001Completed = gameData.commissions.some(comm =>
                            comm.id === "commission-001" && comm.status === "completed" &&
                            comm.assignedPlayer === "孙翔"
                        );
                        if (!gameData.specialDialogues) gameData.specialDialogues = [];
                        const hasTriggered = gameData.specialDialogues.some(d =>
                            d.id === "ye_xiu_apology_dialogue" && d.triggered === true
                        );
                        return player.好感度 >= 100 && isCommission001Completed && !hasTriggered;
                    },
                    isSpecial: true,
                    specialId: "ye_xiu_apology_dialogue",
                    responseChain: [
                        { speaker: "npc", text: "嗯？为什么？" },
                        { speaker: "player", text: "我不知道嘉世会做出这样的事，如果我不接这个委托……", isPlayerOption: true },
                        { speaker: "npc", text: "和你没有关系，没有你也会有其他经纪人来，不是孙翔，也会有张翔李翔" },
                        { speaker: "npc", text: "那是俱乐部的决定，你不要想太多。" },
                        { speaker: "player", text: "可是，你不生气吗？", isPlayerOption: true },
                        { speaker: "player", text: "明明嘉世因为有你才会有今天，现在却……", isPlayerOption: true },
                        { speaker: "npc", text: "生气？当然了，足足气了五分钟呢" },                       
                        { speaker: "player", text: "可惜你退役了，不然一定有很多战队会选择你。", isPlayerOption: true },
                         { speaker: "npc", text: "现在我在兴欣也挺好的，从零开始的感觉，很不错。" },
                        { speaker: "player", text: "如果我做些什么就好了……", isPlayerOption: true },
                        { speaker: "npc", text: "既然这样，那你以后在业务上能不能给我点优惠？" }
                    ],
                    afterEffects: { showBranchChoice: true },
                    branchOptions: [
                        {
                            id: "branch_ye_xiu_apology_free",
                            text: "完全免费",
                            responseChain: [
                                { speaker: "npc", text: "哈哈，那怎么好意思。" },
                                { speaker: "player", text: "放心，以后叶哥的事就是我的事！", isPlayerOption: true },
                                { speaker: "npc", text: "发现好苗子记得优先推荐给我就行。" }
                            ],
                            afterEffects: { updateFavorability: 5 }
                        },
                        {
                            id: "branch_ye_xiu_apology_cost",
                            text: "只收成本费",
                            responseChain: [
                                { speaker: "npc", text: "对我这么优惠？以后就要多麻烦你了。" },
                                { speaker: "player", text: "那就这么说定了！", isPlayerOption: true },
                                { speaker: "npc", text: "好，一言为定！合作愉快。" }
                            ],
                            afterEffects: { updateFavorability: 3 }
                        }
                    ],
                    postBranchResponseChain: [
                        // { speaker: "npc", text: "好了，不说这个了。最近兴欣的训练情况还不错。" },
                        // { speaker: "player", text: "是的，看得出来大家状态都很好。", isPlayerOption: true },
                        // { speaker: "npc", text: "那就好，有什么好苗子记得多交流。" }
                    ]
                },
                {
                    text: "叶哥，最近在忙什么？",
                    responseChain: [
                        { speaker: "npc", text: "当当网管，组组战队。" },
                        { speaker: "player", text: "新战队吗？太好了！", isPlayerOption: true },
                        { speaker: "player", text: "真期待在比赛中能看到叶哥", isPlayerOption: true },
                        { speaker: "npc", text: "刚刚开始而已，离进入职业联赛还有很长的路要走" },
                        { speaker: "player", text: "旅途虽远，行则将至。", isPlayerOption: true },
                        { speaker: "player", text: "叶哥你的目标一定会顺利实现的！", isPlayerOption: true },
                        { speaker: "npc", text: "说的没错，谢啦" }
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                },
                {
                    text: "新十区那个厉害的散人玩家是不是你？",
                    responseChain: [
                        { speaker: "npc", text: "嗯？你看出来了？" },
                        { speaker: "player", text: "其实我一直在关注网游中的优秀玩家，他们也许能够成为好的资源……", isPlayerOption: true },
                        { speaker: "npc", text: "很有想法。不过网游玩家经过系统的学习和培训后才能获得注册资格，这可需要大量的时间和金钱。" },
                        { speaker: "player", text: "没错，职业化的训练很关键。", isPlayerOption: true },
                        { speaker: "player", text: "所以我在考虑筹建一个训练室，叶哥有没有兴趣来做教练？", isPlayerOption: true },
                        { speaker: "npc", text: "哈，上课没问题，不过有好苗子我也不会客气的。" },
                        { speaker: "player", text: "那就太好了！", isPlayerOption: true }

                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                }
            ]
        },

        // ====== 第2年春赛季 大于15 ======
        {
            id: "ye_xiu_season2_spring_mid_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "春赛季" && time.day > 15 &&
                    player.好感度 >= 80;
            },
            playerOptions: [
                {
                    text: "⭐唐柔选手注册的手续已经顺利完成啦",
                    condition: (player) => {
                        const isCommission001Completed = gameData.commissions.some(comm =>
                            comm.id === "commission-004-xx" && comm.status === "completed" &&
                            comm.assignedPlayer === "唐柔"
                        );
                        if (!gameData.specialDialogues) gameData.specialDialogues = [];
                        const hasTriggered = gameData.specialDialogues.some(d =>
                            d.id === "ye_xiu_trzc_dialogue" && d.triggered === true
                        );
                        return player.好感度 >= 110 && isCommission001Completed && !hasTriggered;
                    },
                    isSpecial: true,
                    specialId: "ye_xiu_trzc_dialogue",
                    responseChain: [
                        { speaker: "npc", text: "谢了，帮了我的大忙" },
                        { speaker: "player", text: "她学得快能力又强，叶哥推荐来的人果然很不一般呢", isPlayerOption: true },
                        { speaker: "npc", text: "其实她也是兴欣的网管" },
                        { speaker: "player", text: "咦？！这个网吧如此藏龙卧虎么！", isPlayerOption: true }
                    ],
                    afterEffects: { showBranchChoice: true },
                    branchOptions: [
                        {
                            id: "branch_ye_xiu_2spring02",
                            text: "还有没有其他的网管可推荐？",
                            responseChain: [
                                { speaker: "npc", text: "网管暂时是没有了……" },
                                { speaker: "npc", text: "不过联系到一位老朋友，不久也会来加入兴欣" },
                                { speaker: "player", text: "他也是职业选手吗？", isPlayerOption: true },
                                { speaker: "npc", text: "对。如假包换板上钉钉的职业选手。" },
                                { speaker: "npc", text: "他不需要进行职业注册。有机会让你们见见" },
                                { speaker: "player", text: "太期待了", isPlayerOption: true }
                            ],
                            afterEffects: { updateFavorability: 5 }
                        },
                        {
                            id: "branch_ye_xiu_2spring01",
                            text: "明天我就去网吧门口蹲守",
                            responseChain: [
                                { speaker: "player", text: "一定要再抓住十个八个的优质选手……", isPlayerOption: true },
                                { speaker: "npc", text: "……你这样会吓跑我们客人吧" },
                                { speaker: "npc", text: "不过说起来，我在网游中确实认识了一个很有潜力的流氓玩家，对加入战队很有兴趣" },
                                { speaker: "npc", text: "到时候注册手续还要麻烦你" },
                                { speaker: "player", text: "尽管放马过来，这业务我最熟了！", isPlayerOption: true },
                                { speaker: "npc", text: "不错，越来越有经纪人的气势了。" },
                                { speaker: "player", text: "我会继续努力的！", isPlayerOption: true }
                            ],
                            afterEffects: { updateFavorability: 5 }
                        }
                    ],
                    postBranchResponseChain: [
                        // { speaker: "npc", text: "好了，不说这个了。最近兴欣的训练情况还不错。" },
                        // { speaker: "player", text: "是的，看得出来大家状态都很好。", isPlayerOption: true },
                        // { speaker: "npc", text: "那就好，有什么好苗子记得多交流。" }
                    ]
                },
                {
                    text: "这个赛季谁能夺冠？",
                    responseChain: [
                        { speaker: "npc", text: "想听客观分析还是主观愿望？" },
                        { speaker: "player", text: "先来客观分析！", isPlayerOption: true },
                        { speaker: "npc", text: "轮回。阵容完整，周泽楷状态正盛，是目前实力最强的队伍。" },
                        { speaker: "player", text: "和我想的一样！", isPlayerOption: true },
                        { speaker: "player", text: "那主观意愿呢，叶哥更希望哪家战队获胜？", isPlayerOption: true },
                        { speaker: "npc", text: "……" },
                        { speaker: "npc", text: "嘉世。" },
                        { speaker: "player", text: "……可是，嘉世已经退级到挑战赛了……", isPlayerOption: true },
                        { speaker: "npc", text: "所以才只是‘希望’" },
                        { speaker: "npc", text: "我……希望他能赢。" },
                        { speaker: "player", text: "叶哥……", isPlayerOption: true },
                        { speaker: "npc", text: "这样，我们挑战赛才能少一个劲敌嘛" },
                        { speaker: "player", text: "原来是这样吗…", isPlayerOption: true }
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                },
                {
                    "text": "应该为下个转会期做哪些准备？",
                    "responseChain": [
                        {
                            "speaker": "npc",
                            "text": "现在的战队对经纪人的要求越来越高，抓紧提升自己的各项能力才行。"
                        },
                        {
                            "speaker": "player",
                            "text": "我会的。",
                            "isPlayerOption": true
                        },
                        {
                            "speaker": "npc",
                            "text": "光有能力还不够，还得摸清各支战队的心思。选对目标，才能事半功倍。"
                        },
                        {
                            "speaker": "player",
                            "text": "心思……比如呢？",
                            "isPlayerOption": true
                        },
                        {
                            "speaker": "npc",
                            "text": "拿嘉世来说吧，他们现在最缺的，是一位有实战经验的战队指导。"
                        },
                        {
                            "speaker": "player",
                            "text": "战术方面的？他们会考虑招募战术大师吗？真有人愿意去降级队？",
                            "isPlayerOption": true
                        },
                        {
                            "speaker": "npc",
                            "text": "再看霸图——据我得到的消息，他们正在全面重组队伍架构，动作不小。"
                        },
                        {
                            "speaker": "player",
                            "text": "原来如此……",
                            "isPlayerOption": true
                        },
                        {
                            "speaker": "npc",
                            "text": "还有些老牌战队正打算更新换代，建议你多留意最近的官方公告和业内新闻。"
                        },
                        {
                            "speaker": "player",
                            "text": "明白了，谢谢！",
                            "isPlayerOption": true
                        }
                    ],
                    "afterEffects": {
                        "updateFavorability": 3
                    },
                    "nextDialogueId": null
                }
            ]
        },


        // ====== 第2年夏转会期 (15前) ======
        {
            id: "ye_xiu_season2_summer_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "听说苏沐橙也来兴欣了？",
                    condition: () => {
                        const suMucheng = gameData.players.find(p => p.name === "苏沐橙");
                        return suMucheng && suMucheng.team === "兴欣";
                    },
                    responseChain: [
                        { speaker: "npc", text: "嗯，沐橙能来，战队实力提升不少。" },
                        { speaker: "player", text: "你们配合应该很默契吧？", isPlayerOption: true },
                        { speaker: "npc", text: "还行，老搭档了。" },
                        { speaker: "player", text: "魏琛前辈和她相处得怎么样？", isPlayerOption: true },
                        { speaker: "npc", text: "老魏挺照顾她的，毕竟是前辈。" }
                    ],
                    afterEffects: { updateFavorability: 4 },
                    nextDialogueId: null
                },
                {
                    text: "兴欣现在条件改善了吗？",
                    responseChain: [
                        { speaker: "npc", text: "换了台新电脑，网速快了点。" },
                        { speaker: "player", text: "还是网吧训练吗？", isPlayerOption: true },
                        { speaker: "npc", text: "嗯，老板娘说等有钱了再建训练室。" },
                        { speaker: "player", text: "那得等到什么时候？", isPlayerOption: true },
                        { speaker: "npc", text: "不急，慢慢来。" }
                    ],
                    afterEffects: { updateFavorability: 5 },
                    nextDialogueId: null
                },
                {
                    text: "最近在玩什么新战术？",
                    responseChain: [
                        { speaker: "npc", text: "在研究一些新的配合。" },
                        { speaker: "player", text: "和魏琛前辈一起研究吗？", isPlayerOption: true },
                        { speaker: "npc", text: "嗯，老魏经验丰富，给了不少建议。" },
                        { speaker: "player", text: "听起来很有趣。", isPlayerOption: true },
                        { speaker: "npc", text: "还行，荣耀就是不断尝试新的东西。" }
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                }
            ]
        },

    ],
    "韩文清": [
        // ====== 通用金钱帮助 ======
        {
            id: "han_wenqing_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 韩队，最近资金有点紧张，能帮个忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 5000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "资金紧张？这可不像个合格的经纪人该有的状态。" },
                        { speaker: "player", text: "最近投资了一些项目，实在周转不开……", isPlayerOption: true },
                        { speaker: "npc", text: "创业不是容易的事，需要耐心和坚持。不要担心，钱能解决的问题都不是问题。" },
                        { speaker: "npc", text: "下次要提前规划好资金，有困难尽管找我。" },
                        { speaker: "player", text: "我明白了，谢谢韩队！", isPlayerOption: true }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 5000,
                        redPacketMessage: "拿去应急，有困难就说。"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 通用基础对话 (基础档 0-60) ======
        {
            id: "han_wenqing_general_low",
            condition: (time, player) => player.好感度 <= 60,
            playerOptions: [
                {
                    text: "霸图这个赛季的目标是什么？",
                    responseChain: [
                        { speaker: "npc", text: "当然是冠军！" },
                        { speaker: "npc", text: "我们每一场比赛都要全力以赴。" },
                        { speaker: "npc", text: "为这个目标，我们会拼尽全力。" }
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                },
                {
                    text: "作为队长有什么压力？",
                    responseChain: [
                        { speaker: "npc", text: "压力就是动力。" },
                        { speaker: "npc", text: "要对得起队长的职责。" },
                        { speaker: "npc", text: "也要对得起队友的信任。" }
                    ],
                    afterEffects: { updateFavorability: 2 },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第2年夏转会期 早期 (基础档 0-60) ======
        {
            id: "han_wenqing_year2_summer_early_low",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    time.day >= 1 && time.day <= 10 &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "霸图这个夏天好像很活跃？",
                    responseChain: [
                        { speaker: "npc", text: "为了冠军，必须有所行动。" },
                        { speaker: "player", text: "能透露一点目标吗？", isPlayerOption: true },
                        { speaker: "npc", text: "合适的选手，经验丰富的老将。" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        },
        // ====== 第2年夏转会期 中期 (友好档 61-120) ======
        {
            id: "han_wenqing_year2_summer_mid_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    time.day >= 11 && time.day <= 20 &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "新来的队员，你觉得能适应霸图的节奏吗？",
                    responseChain: [
                        { speaker: "npc", text: "林敬言和张佳乐都是老将，适应不是问题。" },
                        { speaker: "npc", text: "问题在于，如何把他们的经验融入霸图的体系。" },
                        { speaker: "player", text: "听起来你对他们很有信心？", isPlayerOption: true },
                        { speaker: "npc", text: "我看中的选手，不会错。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 第2年秋赛季 晚期 (亲密档 121-200，情感对话) ======
        {
            id: "han_wenqing_year2_autumn_late_high",
            condition: (time, player) => {
                return time.year === 2 && time.season === "秋赛季" &&
                    time.day >= 21 &&
                    player.好感度 >= 121;
            },
            playerOptions: [
                {
                    text: "韩队，你总是这么严肃，不累吗？",
                    responseChain: [
                        { speaker: "npc", text: "累？习惯了。霸图需要这样的队长。" },
                        { speaker: "player", text: "那你自己呢？有没有想放松的时候？", isPlayerOption: true },
                        { speaker: "npc", text: "...有。比如现在，和你说话的时候。" },
                        { speaker: "player", text: "真的吗？那我以后要常来。", isPlayerOption: true },
                        { speaker: "npc", text: "嗯。随时欢迎。" }
                    ],
                    afterEffects: { updateFavorability: 8 }
                },
                {
                    text: "除了训练，你还有什么喜欢做的事吗？",
                    condition: (player) => player.好感度 >= 150,
                    responseChain: [
                        { speaker: "npc", text: "健身。保持状态。" },
                        { speaker: "player", text: "还有呢？比如...看电影？", isPlayerOption: true },
                        { speaker: "npc", text: "偶尔。动作片。" },
                        { speaker: "player", text: "下次一起去看？", isPlayerOption: true },
                        { speaker: "npc", text: "...好。我请客。" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "孙翔": [
        // ====== 第1年冬转会期 特殊条件 (友好档 61-120) ======
        {
            id: "sun_xiang_special_condition_medium",
            condition: (time, player) => {
                return time.year === 1 && time.season === "冬转会期" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "听说你最近加入了嘉世，感觉怎么样？",
                    condition: (player) => {
                        const yeXiu = gameData.players.find(p => p.name === "叶修");
                        const yeXiuNotInJiaShi = !yeXiu || yeXiu.team !== "嘉世";
                        return player.team === "嘉世" && yeXiuNotInJiaShi;
                    },
                    responseChain: [
                        { speaker: "npc", text: "哈哈，现在嘉世可是我的舞台了！没有叶秋那老头子挡路，我终于可以证明自己才是最强的战斗法师！" },
                        { speaker: "player", text: "这么说你对叶修很不服气？", isPlayerOption: true },
                        { speaker: "npc", text: "哼，他不过是个过气的选手罢了。现在荣耀是属于我们这些年轻人的！" },
                        { speaker: "player", text: "有自信是好事，但也要尊重前辈吧？", isPlayerOption: true },
                        { speaker: "npc", text: "尊重？等我带领嘉世拿回冠军，那就是对他最好的尊重！" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 1000,
                        redPacketMessage: "哈哈，这是给你的奖励，继续支持我！"
                    },
                    nextDialogueId: null
                },
                {
                    text: "作为嘉世的新队长，压力大吗？",
                    condition: (player) => {
                        const yeXiu = gameData.players.find(p => p.name === "叶修");
                        const yeXiuNotInJiaShi = !yeXiu || yeXiu.team !== "嘉世";
                        return player.team === "嘉世" && yeXiuNotInJiaShi;
                    },
                    responseChain: [
                        { speaker: "npc", text: "压力？那是什么？我只感受到无穷的动力！现在嘉世在我手里，一定会重现辉煌！" },
                        { speaker: "npc", text: "虽然有些老队员可能还不太服气，但我相信用实力说话是最好的办法。" },
                        { speaker: "player", text: "有信心是好事，但团队合作也很重要。", isPlayerOption: true },
                        { speaker: "npc", text: "当然！我会让所有人看到，我孙翔不仅个人实力强，更能带领团队走向胜利！" }
                    ],
                    afterEffects: { updateFavorability: 3 },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第1年冬转会期 早期 (基础档 0-60) ======
        {
            id: "sun_xiang_year1_winter_early_low",
            condition: (time, player) => {
                return time.year === 1 && time.season === "冬转会期" &&
                    time.day >= 1 && time.day <= 10 &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "刚来嘉世，感觉怎么样？",
                    condition: (player) => player.team === "嘉世",
                    responseChain: [
                        { speaker: "npc", text: "很好！一叶之秋在手，冠军迟早是我的！" },
                        { speaker: "player", text: "口气不小啊。", isPlayerOption: true },
                        { speaker: "npc", text: "实力摆在这里！" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        },
        // ====== 第2年夏转会期 中期 (友好档 61-120) ======
        {
            id: "sun_xiang_year2_summer_mid_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    time.day >= 11 && time.day <= 20 &&
                    player.team === "嘉世" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "在嘉世当队长也有一段时间了，感觉如何？",
                    responseChain: [
                        { speaker: "npc", text: "哼，比想象中麻烦一点。有些人总是不听指挥。" },
                        { speaker: "player", text: "但战绩好像还不错？", isPlayerOption: true },
                        { speaker: "npc", text: "那是当然！有我在，嘉世怎么可能差！" }
                    ],
                    afterEffects: { updateFavorability: 4 }
                }
            ]
        },
        // ====== 第3年夏转会期 晚期 (亲密档 121-200，情感对话) ======
        {
            id: "sun_xiang_year3_summer_late_high",
            condition: (time, player) => {
                return time.year === 3 && time.season === "夏转会期" &&
                    time.day >= 21 &&
                    player.好感度 >= 121;
            },
            playerOptions: [
                {
                    text: "去了轮回，一切都会好起来的。",
                    condition: (player) => player.team === "轮回",
                    responseChain: [
                        { speaker: "npc", text: "...嗯。这次，我不会再搞砸了。" },
                        { speaker: "player", text: "你其实一直都很努力，我都知道。", isPlayerOption: true },
                        { speaker: "npc", text: "你...你怎么突然说这个。" },
                        { speaker: "player", text: "因为我想让你知道，有人一直在看着你进步。", isPlayerOption: true },
                        { speaker: "npc", text: "...谢了。下次比赛，来看吗？" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "王杰希": [
        // ====== 通用金钱帮助 ======
        {
            id: "wang_jiexi_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 王队，最近资金有点紧张，能帮个忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 3000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "资金紧张？是工作的原因还是个人的事情？" },
                        { speaker: "player", text: "最近在扩展业务，所以资金暂时有点紧张...", isPlayerOption: true },
                        { speaker: "npc", text: "嗯，扩展业务是好事，但要控制好风险。这点钱拿去应急。" },
                        { speaker: "player", text: "谢谢王队！", isPlayerOption: true },
                        { speaker: "npc", text: "不客气，朋友之间应该的。" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 3000,
                        redPacketMessage: "祝工作顺利。"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第1年冬转会期 (基础档 0-60) ======
        {
            id: "wang_jiexi_year1_winter_low",
            condition: (time, player) => {
                return time.year === 1 && time.season === "冬转会期" &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "王队，微草这赛季的目标是？",
                    responseChain: [
                        { speaker: "npc", text: "冠军。这是微草每个赛季不变的目标。" },
                        { speaker: "player", text: "听起来很有信心？", isPlayerOption: true },
                        { speaker: "npc", text: "信心源于准备。" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                },
                {
                    text: "你的魔术师打法很独特。",
                    responseChain: [
                        { speaker: "npc", text: "只是适合我的风格。" },
                        { speaker: "player", text: "现在还会用吗？", isPlayerOption: true },
                        { speaker: "npc", text: "根据团队需要调整。" }
                    ],
                    afterEffects: { updateFavorability: 2 }
                }
            ]
        },
        // ====== 第2年春赛季 (友好档 61-120) ======
        {
            id: "wang_jiexi_year2_spring_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "春赛季" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "听说你很关注高英杰的成长？",
                    responseChain: [
                        { speaker: "npc", text: "他是微草的未来，天赋和努力都值得培养。" },
                        { speaker: "player", text: "你为他改变了自己的打法？", isPlayerOption: true },
                        { speaker: "npc", text: "这是队长的责任。个人风格要为团队让路。" },
                        { speaker: "player", text: "你为微草付出了很多。", isPlayerOption: true },
                        { speaker: "npc", text: "值得。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 第3年秋赛季 (亲密档 121-200，情感对话) ======
        {
            id: "wang_jiexi_year3_autumn_high",
            condition: (time, player) => {
                return time.year === 3 && time.season === "秋赛季" &&
                    player.好感度 >= 121;
            },
            playerOptions: [
                {
                    text: "你总是一个人扛着微草，不累吗？",
                    responseChain: [
                        { speaker: "npc", text: "累是常态。但习惯了。" },
                        { speaker: "player", text: "那...有没有想过依赖一下别人？比如我？", isPlayerOption: true },
                        { speaker: "npc", text: "你...是在关心我？" },
                        { speaker: "player", text: "很明显吧。不只关心，还想多了解你赛场之外的样子。", isPlayerOption: true },
                        { speaker: "npc", text: "...我除了比赛，大概只剩下养盆栽这个爱好了。" },
                        { speaker: "player", text: "那下次让我看看你的盆栽吧？", isPlayerOption: true },
                        { speaker: "npc", text: "好。不过要选个合适的时间...我是说，我们都有空的时候。" }
                    ],
                    afterEffects: { updateFavorability: 8 }
                },
                {
                    text: "你的眼睛很特别，我一直觉得...很好看。",
                    condition: (player) => player.好感度 >= 150,
                    responseChain: [
                        { speaker: "npc", text: "...突然说这个？" },
                        { speaker: "player", text: "因为突然想告诉你。以后可能还会常说。", isPlayerOption: true },
                        { speaker: "npc", text: "你总是说些让人意外的话。" },
                        { speaker: "player", text: "那你喜欢听吗？", isPlayerOption: true },
                        { speaker: "npc", text: "...不讨厌。" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "肖时钦": [
        {
            id: "xiao_shi_qin_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 肖队，最近资金有点紧张，能帮个忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 2000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "资金紧张？我理解，创业初期确实不容易。" },
                        { speaker: "player", text: "最近有几笔投资暂时还没回笼资金...", isPlayerOption: true },
                        { speaker: "npc", text: "这点钱先拿去应急，有需要再开口。" },
                        { speaker: "player", text: "谢谢肖队！我会尽快还的！", isPlayerOption: true },
                        { speaker: "npc", text: "不要担心这些，能帮到你就最好了。" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 2500,
                        redPacketMessage: "恭喜发财。"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第2年夏转会期 早期 (基础档 0-60) ======
        {
            id: "xiao_shi_qin_year2_summer_early_low",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    time.day >= 1 && time.day <= 5 &&
                    player.team === "雷霆" &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "肖队，雷霆这赛季成绩不错啊。",
                    responseChain: [
                        { speaker: "npc", text: "嗯，队友们都很努力，配合也越来越好。" },
                        { speaker: "player", text: "都是你这个队长的功劳吧？", isPlayerOption: true },
                        { speaker: "npc", text: "是团队的功劳。我只是做好战术安排。" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        },
        // ====== 第2年夏转会期 中期 (友好档 61-120，考虑转会) ======
        {
            id: "xiao_shi_qin_year2_summer_mid_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    time.day >= 11 && time.day <= 20 &&
                    player.team === "雷霆" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "听说嘉世在接触你？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-002-bt");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "...嗯。这是一个很重要的选择。" },
                        { speaker: "player", text: "你会考虑离开雷霆吗？", isPlayerOption: true },
                        { speaker: "npc", text: "从战术角度，嘉世的平台更大。但从感情上..." }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 第3年夏转会期 晚期 (亲密档 121-200，情感对话，回归雷霆) ======
        {
            id: "xiao_shi_qin_year3_summer_late_high",
            condition: (time, player) => {
                return time.year === 3 && time.season === "夏转会期" &&
                    time.day >= 21 &&
                    player.team === "雷霆" &&
                    player.好感度 >= 121;
            },
            playerOptions: [
                {
                    text: "欢迎回来，肖队。回到雷霆感觉好吗？",
                    responseChain: [
                        { speaker: "npc", text: "很好...就像从未离开过。" },
                        { speaker: "player", text: "看到你回来，大家都很开心吧？", isPlayerOption: true },
                        { speaker: "npc", text: "嗯。但我最高兴的是...你也在这里。" },
                        { speaker: "player", text: "我？", isPlayerOption: true },
                        { speaker: "npc", text: "在我最犹豫的时候，是你一直支持我。谢谢你。" }
                    ],
                    afterEffects: { updateFavorability: 12 }
                }
            ]
        }
    ],
    "喻文州": [
        {
            id: "yu_wenzhou_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 喻队，最近资金有点紧张，能帮个忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 2000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "没问题。需要多少？" },
                        { speaker: "player", text: "最近在谈几个大单子，资金暂时周转不开...咦，你不问我借钱做什么用吗？", isPlayerOption: true },
                        { speaker: "npc", text: "哈，你借钱肯定有你的原因。这点钱先拿去应急，有需要直接开口不要客气。" },
                        { speaker: "player", text: "谢谢喻队！", isPlayerOption: true },
                        { speaker: "npc", text: "不用谢" },
                        { speaker: "npc", text: "正好有几个转会规程上的问题想请教你呢，方便电话吗？" },
                        { speaker: "player", text: "没问题！", isPlayerOption: true }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 3000,
                        redPacketMessage: "拿去应急，以后多合作。"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第3年冬转会期 早期 (基础档 0-60，于锋转会前) ======
        {
            id: "yu_wenzhou_year3_winter_early_low",
            condition: (time, player) => {
                return time.year === 3 && time.season === "冬转会期" &&
                    time.day >= 1 && time.day <= 10 &&
                    player.team === "蓝雨" &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "喻队，蓝雨这赛季的团队配合还是那么默契。",
                    responseChain: [
                        { speaker: "npc", text: "谢谢。团队合作是蓝雨的基石。" },
                        { speaker: "player", text: "于锋选手好像成长很快？", isPlayerOption: true },
                        { speaker: "npc", text: "嗯，他是个非常优秀的选手。" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        },
        // ====== 第3年冬转会期 中期 (友好档 61-120，于锋可能转会) ======
        {
            id: "yu_wenzhou_year3_winter_mid_medium",
            condition: (time, player) => {
                return time.year === 3 && time.season === "冬转会期" &&
                    time.day >= 11 && time.day <= 20 &&
                    player.team === "蓝雨" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "听说于锋有转会的想法？",
                    responseChain: [
                        { speaker: "npc", text: "他有他的追求。在蓝雨，核心的光芒有时会遮盖其他人。" },
                        { speaker: "player", text: "你会觉得可惜吗？", isPlayerOption: true },
                        { speaker: "npc", text: "会。但我尊重他的选择，也祝福他。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 通用亲密档 (121-200，情感对话) ======
        {
            id: "yu_wenzhou_high_favor_high",
            condition: (time, player) => player.好感度 >= 121,
            playerOptions: [
                {
                    text: "都说你算无遗策，那...算到我会来找你聊天了吗？",
                    responseChain: [
                        { speaker: "npc", text: "呵，没有算。但一直在等。" },
                        { speaker: "player", text: "在等我？为什么？", isPlayerOption: true },
                        { speaker: "npc", text: "因为和你说话，不需要计算，很轻松。就像现在这样。" },
                        { speaker: "player", text: "那我以后要常来打扰了。", isPlayerOption: true },
                        { speaker: "npc", text: "随时欢迎。" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "周泽楷": [
        {
            id: "zhou_zekai_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 小周，最近资金有点紧张，能帮个忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 2000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "可以的" },
                        { speaker: "player", text: "只需要2000就好了，过几天就还你", isPlayerOption: true },
                        { speaker: "npc", text: "...不要还，拿去用吧。" },
                        { speaker: "player", text: "谢谢小周！", isPlayerOption: true },
                        { speaker: "npc", text: "...不客气。" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 3000,
                        redPacketMessage: "祝开心。"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第3年夏转会期 (友好档 61-120，孙翔加盟) ======
        {
            id: "zhou_zekai_year3_summer_medium",
            condition: (time, player) => {
                return time.year === 3 && time.season === "夏转会期" &&
                    player.team === "轮回" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "孙翔要来轮回了，期待吗？",
                    responseChain: [
                        { speaker: "npc", text: "嗯。" },
                        { speaker: "player", text: "觉得能配合好吗？", isPlayerOption: true },
                        { speaker: "npc", text: "...试试。很强。" },
                        { speaker: "player", text: "你们俩的组合，感觉会无敌呢。", isPlayerOption: true },
                        { speaker: "npc", text: "...希望。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 通用亲密档 (121-200，情感对话) ======
        {
            id: "zhou_zekai_high_favor_high",
            condition: (time, player) => player.好感度 >= 121,
            playerOptions: [
                {
                    text: "小周，你不说话的时候，都在想什么呢？",
                    responseChain: [
                        { speaker: "npc", text: "...想比赛。战术。" },
                        { speaker: "player", text: "还有呢？", isPlayerOption: true },
                        { speaker: "npc", text: "...想你。" },
                        { speaker: "player", text: "想我什么？", isPlayerOption: true },
                        { speaker: "npc", text: "...下次，什么时候来。" },
                        { speaker: "player", text: "你想我来，我就来。", isPlayerOption: true },
                        { speaker: "npc", text: "...嗯。等你。" }
                    ],
                    afterEffects: { updateFavorability: 12 }
                }
            ]
        }
    ],
    "黄少天": [
        // ====== 第3年冬转会期 (友好档 61-120，于锋转会) ======
        {
            id: "huang_shao_tian_year3_winter_medium",
            condition: (time, player) => {
                return time.year === 3 && time.season === "冬转会期" &&
                    player.team === "蓝雨" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "于锋要走了，你会舍不得吗？",
                    responseChain: [
                        { speaker: "npc", text: "当然会啊！虽然那小子平时话不多，但也是并肩作战的队友啊！不过他要去百花当核心，我也是能理解的！" },
                        { speaker: "player", text: "听起来你很支持他？", isPlayerOption: true },
                        { speaker: "npc", text: "废话！是朋友当然要支持！等他到了百花我第一个去给他加油！不过比赛遇到了我可不会手下留情！" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 通用基础档 (0-60) ======
        {
            id: "huang_shao_tian_general_low",
            condition: (time, player) => player.好感度 <= 60,
            playerOptions: [
                {
                    text: "黄少，今天话也挺多啊？",
                    responseChain: [
                        { speaker: "npc", text: "那是！本剑圣心情好！话当然多！" },
                        { speaker: "player", text: "因为赢了比赛？", isPlayerOption: true },
                        { speaker: "npc", text: "对啊！而且队长夸我今天战术执行得好！" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        },
        // ====== 通用亲密档 (121-200，情感对话) ======
        {
            id: "huang_shao_tian_high_favor_high",
            condition: (time, player) => player.好感度 >= 121,
            playerOptions: [
                {
                    text: "黄少，你话这么多，会有人嫌你吵吗？",
                    responseChain: [
                        { speaker: "npc", text: "喂喂喂！你怎么也这么说我！队长都没嫌我！" },
                        { speaker: "npc", text: "不过...如果是你的话，我可以考虑稍微安静一点点！" },
                        { speaker: "player", text: "为什么对我特别？", isPlayerOption: true },
                        { speaker: "npc", text: "因为...因为和你说话特别开心啊！这还用问！" },
                        { speaker: "player", text: "那我以后要天天来找你说话。", isPlayerOption: true },
                        { speaker: "npc", text: "好啊！说定了！不准反悔！" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "张新杰": [
        // ====== 第2年夏转会期 (基础档 0-60) ======
        {
            id: "zhang_xinjie_year2_summer_low",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    player.team === "霸图" &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "张副队，新赛季战术准备得怎么样了？",
                    responseChain: [
                        { speaker: "npc", text: "按计划进行。新队员的数据分析已完成73%。" },
                        { speaker: "player", text: "好精确...", isPlayerOption: true },
                        { speaker: "npc", text: "数据是制定战术的基础。" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        },
        // ====== 通用亲密档 (121-200，情感对话) ======
        {
            id: "zhang_xinjie_high_favor_high",
            condition: (time, player) => player.好感度 >= 121,
            playerOptions: [
                {
                    text: "你的时间表那么精确，不会觉得累吗？",
                    responseChain: [
                        { speaker: "npc", text: "规律带来效率和掌控感。" },
                        { speaker: "player", text: "那...和我聊天，在你的时间表里吗？", isPlayerOption: true },
                        { speaker: "npc", text: "在。而且是...优先级较高的非训练事项。" },
                        { speaker: "player", text: "只是‘较高’？", isPlayerOption: true },
                        { speaker: "npc", text: "...修正。是最优先的非训练事项。" }
                    ],
                    afterEffects: { updateFavorability: 8 }
                }
            ]
        }
    ],
    "张佳乐": [
        {
            id: "zhang_jiale_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 张队，最近资金周转有点问题...",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 2000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "哎呀，做经纪人这么难吗？" },
                        { speaker: "player", text: "创业初期确实不容易...", isPlayerOption: true },
                        { speaker: "npc", text: "那好吧，我赞助你一点，就当投资了！" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 3500,
                        redPacketMessage: "拿去创业吧，要加油啊！"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第2年夏转会期 (友好档 61-120，转会前) ======
        {
            id: "zhang_jiale_year2_summer_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    player.team === "百花" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "真的要离开百花吗？那里有那么多你的粉丝。",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-004-bt");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "...别说了。百花是我的家，但冠军...是我无论如何都想触摸一次的东西。" },
                        { speaker: "player", text: "就算背负骂名？", isPlayerOption: true },
                        { speaker: "npc", text: "嗯。就算被骂是叛徒...我也认了。这是我自己的选择。" }
                    ],
                    afterEffects: { updateFavorability: 8 }
                }
            ]
        },
        // ====== 第2年秋赛季 (亲密档 121-200，情感对话，刚转会霸图) ======
        {
            id: "zhang_jiale_year2_autumn_high",
            condition: (time, player) => {
                return time.year === 2 && time.season === "秋赛季" &&
                    player.team === "霸图" &&
                    player.好感度 >= 121;
            },
            playerOptions: [
                {
                    text: "在霸图，压力还大吗？",
                    responseChain: [
                        { speaker: "npc", text: "大...但和百花时不一样。这里的压力，更像是动力。" },
                        { speaker: "player", text: "看到你慢慢适应，我就放心了。", isPlayerOption: true },
                        { speaker: "npc", text: "谢谢你...每次我觉得快撑不住的时候，想想还有你在支持我，就好多了。" },
                        { speaker: "player", text: "我会一直支持你的，不管你在哪里。", isPlayerOption: true },
                        { speaker: "npc", text: "嗯...说好了。" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "林敬言": [
        {
            id: "lin_jingyan_general_money_help",
            condition: (time, player) => true,
            playerOptions: [
                {
                    text: "💰 林队，最近手头有点紧，能帮帮忙吗？",
                    condition: (player) => {
                        return player.好感度 >= 80 && gameData.agent.money < 2000;
                    },
                    responseChain: [
                        { speaker: "npc", text: "资金困难？经验告诉我，做经纪人确实需要些启动资金。" },
                        { speaker: "player", text: "是啊，最近开销有点大...", isPlayerOption: true },
                        { speaker: "npc", text: "那我这个老前辈就帮帮你吧，年轻人创业不容易。" }
                    ],
                    afterEffects: {
                        showRedPacket: true,
                        redPacketAmount: 2800,
                        redPacketMessage: "老前辈的一点心意，加油！"
                    },
                    nextDialogueId: null
                }
            ]
        },
        // ====== 第2年夏转会期 (友好档 61-120，转会考虑) ======
        {
            id: "lin_jingyan_year2_summer_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    player.team === "呼啸" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "从呼啸的核心到霸图的拼图，心态上能调整好吗？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-003-bt");
                        return commission && commission.status === "negotiating";
                    },
                    responseChain: [
                        { speaker: "npc", text: "在呼啸是带队冲锋，在霸图是辅助韩队...确实需要转变。" },
                        { speaker: "npc", text: "但这就是老将的价值，为了冠军，可以做出任何调整。" },
                        { speaker: "player", text: "很让人敬佩。", isPlayerOption: true },
                        { speaker: "npc", text: "没什么好敬佩的，只是一个不想留下遗憾的选择。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 通用亲密档 (121-200，情感对话) ======
        {
            id: "lin_jingyan_high_favor_high",
            condition: (time, player) => player.好感度 >= 121,
            playerOptions: [
                {
                    text: "林队，你总是这么温柔体贴，是习惯吗？",
                    responseChain: [
                        { speaker: "npc", text: "算是吧。年纪大了，总想多照顾一下年轻人。" },
                        { speaker: "player", text: "那...你对我也只是对‘年轻人’的照顾吗？", isPlayerOption: true },
                        { speaker: "npc", text: "对你...可能不太一样。" },
                        { speaker: "npc", text: "更像是，想多看看你，多和你说说话的那种...照顾。" }
                    ],
                    afterEffects: { updateFavorability: 8 }
                }
            ]
        }
    ],
    "苏沐橙": [
        // ====== 第2年夏转会期 (友好档 61-120，转会考虑) ======
        {
            id: "su_mucheng_year2_summer_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" && time.day >= 6 &&
                    player.team === "嘉世" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "兴欣想要你加入，你知道吗？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-006-xx");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "叶修在兴欣，对吗？" },
                        { speaker: "player", text: "是的，所以他才希望你去。", isPlayerOption: true },
                        { speaker: "npc", text: "......在嘉世这么多年，确实该换个环境了。" },
                        { speaker: "player", text: "但嘉世可能不会轻易放人？", isPlayerOption: true },
                        { speaker: "npc", text: "我会想办法的，毕竟...我想和他继续并肩作战。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        },
        // ====== 第3年冬转会期 (亲密档 121-200，情感对话，刚转会兴欣) ======
        {
            id: "su_mucheng_year3_winter_high",
            condition: (time, player) => {
                return time.year === 3 && time.season === "冬转会期" &&
                    player.team === "兴欣" &&
                    player.好感度 >= 121;
            },
            playerOptions: [
                {
                    text: "终于来兴欣了，现在开心吗？",
                    responseChain: [
                        { speaker: "npc", text: "嗯！虽然条件不如以前，但感觉...更自在了。" },
                        { speaker: "player", text: "看到你开心，我也很开心。", isPlayerOption: true },
                        { speaker: "npc", text: "谢谢你一直以来的支持。要不是你，我可能不会这么快下定决心。" },
                        { speaker: "player", text: "因为我想看到你真正的笑容。", isPlayerOption: true },
                        { speaker: "npc", text: "那...以后也请一直看着我吧。" }
                    ],
                    afterEffects: { updateFavorability: 10 }
                }
            ]
        }
    ],
    "唐柔": [
        // ====== 第2年春赛季 (友好档 61-120，招募) ======
        {
            id: "tang_rou_year2_spring_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "春赛季" && time.day >= 5 &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "兴欣在招募战斗法师，你知道吗？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-004-xx");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "兴欣？是叶修前辈在的那个战队吗？" },
                        { speaker: "player", text: "是的，他们正在组建队伍，需要战斗法师选手。", isPlayerOption: true },
                        { speaker: "npc", text: "我听说过叶修前辈的事迹...能和他一起战斗吗？" },
                        { speaker: "player", text: "如果加入，你就能直接跟斗神学习！", isPlayerOption: true },
                        { speaker: "npc", text: "听起来...很有挑战性。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        }
    ],
    "包荣兴": [
        // ====== 第2年春赛季 (友好档 61-120，招募) ======
        {
            id: "bao_rongxing_year2_spring_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "春赛季" && time.day >= 7 &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "兴欣需要流氓选手，你有兴趣吗？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-005-xx");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "兴欣？听起来很酷啊！" },
                        { speaker: "player", text: "但你现在是格斗家，要转职业哦？", isPlayerOption: true },
                        { speaker: "npc", text: "转职业？听起来更有意思了！老大说我是天才，什么职业都能玩！" },
                        { speaker: "player", text: "你老大是谁？", isPlayerOption: true },
                        { speaker: "npc", text: "叶修前辈啊！他打荣耀超厉害的！" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        }
    ],
    "魏琛": [
        // ====== 第2年春赛季 (基础档 0-60) ======
        {
            id: "wei_chen_year2_spring_low",
            condition: (time, player) => {
                return time.year === 2 && time.season === "春赛季" &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "魏琛前辈，复出的感觉如何？",
                    condition: (player) => player.team === "兴欣",
                    responseChain: [
                        { speaker: "npc", text: "哈哈，感觉骨头都年轻了几岁！就是抽烟被老板娘管得严。" },
                        { speaker: "player", text: "能回到赛场很开心吧？", isPlayerOption: true },
                        { speaker: "npc", text: "那当然！老夫还能再战十年！" }
                    ],
                    afterEffects: { updateFavorability: 3 }
                }
            ]
        }
    ],
    "方锐": [
        // ====== 第3年夏转会期 (友好档 61-120，转会考虑) ======
        {
            id: "fang_rui_year3_summer_medium",
            condition: (time, player) => {
                return time.year === 3 && time.season === "夏转会期" && time.day >= 12 &&
                    player.team === "呼啸" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "兴欣在寻找气功师，考虑过吗？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-014-xx");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "兴欣？那个去年刚组建就杀进季后赛的队伍？" },
                        { speaker: "player", text: "是的，叶修在那里，需要你这样经验丰富的老将。", isPlayerOption: true },
                        { speaker: "npc", text: "从盗贼转气功师...又要转职业啊。" },
                        { speaker: "player", text: "但能和叶修一起冲击冠军，不是吗？", isPlayerOption: true },
                        { speaker: "npc", text: "这倒是...和他一起打比赛，应该会很有趣。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        }
    ],
    "唐昊": [
        // ====== 第2年夏转会期 (友好档 61-120，转会考虑) ======
        {
            id: "tang_hao_year2_summer_medium",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" && time.day >= 8 &&
                    player.team === "百花" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "听说呼啸想要你？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-005-hx");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "哼，终于有人看到我的实力了。" },
                        { speaker: "player", text: "如果林敬言前辈离开，你就是呼啸的新核心？", isPlayerOption: true },
                        { speaker: "npc", text: "就算他不离开，我也迟早会成为核心！" },
                        { speaker: "player", text: "很有自信啊！", isPlayerOption: true },
                        { speaker: "npc", text: "实力说话，这是我的一贯原则。" }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        }
    ],
    "于锋": [
        // ====== 第3年冬转会期 (友好档 61-120，转会考虑) ======
        {
            id: "yu_feng_year3_winter_medium",
            condition: (time, player) => {
                return time.year === 3 && time.season === "冬转会期" && time.day >= 14 &&
                    player.team === "蓝雨" &&
                    player.好感度 >= 61 && player.好感度 <= 120;
            },
            playerOptions: [
                {
                    text: "百花在寻找狂剑士，你有兴趣吗？",
                    condition: () => {
                        const commission = gameData.commissions.find(c => c.id === "commission-006-bh");
                        return commission && commission.status === "available";
                    },
                    responseChain: [
                        { speaker: "npc", text: "百花吗...张佳乐前辈刚刚离开..." },
                        { speaker: "player", text: "这正是你成为核心的机会啊！", isPlayerOption: true },
                        { speaker: "npc", text: "确实，在蓝雨我始终活在黄少天和喻队的阴影下..." },
                        { speaker: "player", text: "去百花能成为真正的队长和核心！", isPlayerOption: true },
                        { speaker: "npc", text: "这确实是个诱人的机会..." }
                    ],
                    afterEffects: { updateFavorability: 5 }
                }
            ]
        }
    ],
    "刘皓": [
        // ====== 第2年夏转会期 (基础档 0-60) ======
        {
            id: "liu_hao_year2_summer_low",
            condition: (time, player) => {
                return time.year === 2 && time.season === "夏转会期" &&
                    player.team === "嘉世" &&
                    player.好感度 <= 60;
            },
            playerOptions: [
                {
                    text: "刘副队，在嘉世还顺利吗？",
                    responseChain: [
                        { speaker: "npc", text: "还行吧。就是队里现在气氛有点...微妙。" },
                        { speaker: "player", text: "是因为新队长吗？", isPlayerOption: true },
                        { speaker: "npc", text: "有些事，不好多说。" }
                    ],
                    afterEffects: { updateFavorability: 2 }
                }
            ]
        }
    ]
};

// ========== 聊天系统核心函数 ==========

// 对话历史存储（包含普通消息和红包）
// 使用 getter 函数确保始终引用 gameData.dialogueHistory 的当前值
const getDialogueHistory = () => gameData.dialogueHistory;

// 初始化对话历史（确保在存档恢复后能正确引用）
function initDialogueHistory() {
    console.log('初始化对话历史系统');
    if (!gameData.dialogueHistory) {
        gameData.dialogueHistory = {};
        console.log('创建新的对话历史对象');
    }
    console.log('对话历史系统初始化完成，当前历史:', getDialogueHistory());
}

// 当前对话上下文
let currentPlayerDialogue = null;

// 显示选手对话界面
function showPlayerDialogue(playerName) {
    const player = gameData.players.find(p => p.name === playerName);
    if (!player) return;

    // 获取所有可用的对话选项
    const allAvailableOptions = getAllAvailableDialogueOptions(playerName);

    if (allAvailableOptions.length === 0) {
        // 如果没有可用选项，显示默认对话
        showDefaultDialogue(player);
        return;
    }

    // 显示包含所有可用选项的对话
    showAllOptionsDialogue(playerName, allAvailableOptions);
}

// 获取当前可用的对话
function getAvailableDialogues(playerName) {
    const dialogues = playerDialogues[playerName];
    if (!dialogues) return [];

    // 获取对应的玩家对象
    const player = gameData.players.find(p => p.name === playerName);

    return dialogues.filter(dialogue => {
        if (!dialogue.condition) return true;
        return dialogue.condition(gameData.time, player);
    });
}

// 获取当前可用的所有对话选项
function getAllAvailableDialogueOptions(playerName) {
    const availableDialogues = getAvailableDialogues(playerName);
    let allOptions = [];

    availableDialogues.forEach(dialogue => {
        // 检查对话中的每个选项是否符合条件
        if (dialogue.playerOptions && Array.isArray(dialogue.playerOptions)) {
            dialogue.playerOptions.forEach(option => {
                // 检查选项的条件
                const player = gameData.players.find(p => p.name === playerName);

                // 对于特殊对话，额外检查是否已触发
                let shouldInclude = true;

                if (option.condition) {
                    shouldInclude = option.condition(player);
                }

                // 如果是特殊对话，确保只显示一次
                if (shouldInclude && option.isSpecial && option.specialId) {
                    // 确保 specialDialogues 数组存在
                    if (!gameData.specialDialogues) {
                        gameData.specialDialogues = [];
                    }

                    console.log('检查特殊对话', option.specialId, '是否已触发，当前特殊对话列表:', gameData.specialDialogues);

                    // 检查是否已触发
                    const hasTriggered = gameData.specialDialogues.some(d =>
                        d.id === option.specialId && d.triggered === true
                    );

                    console.log('特殊对话', option.specialId, '已触发:', hasTriggered);

                    if (hasTriggered) {
                        shouldInclude = false;
                    }
                }

                if (shouldInclude) {
                    allOptions.push({
                        ...option,
                        dialogueId: dialogue.id
                    });
                }
            });
        }
    });

    return allOptions;
}

// 显示包含所有选项的对话
function showAllOptionsDialogue(playerName, options) {
    const player = gameData.players.find(p => p.name === playerName);
    if (!player) return;

    console.log('打开对话界面，玩家:', playerName);

    const modal = document.getElementById('dialogueModal');
    const content = document.getElementById('dialogueContent');

    // 初始化对话历史
    console.log('初始化对话历史，玩家:', playerName, '当前历史:', getDialogueHistory()[playerName]);
    if (!getDialogueHistory()[playerName]) {
        getDialogueHistory()[playerName] = [];
        console.log('创建新的对话历史数组');
    } else {
        console.log('对话历史已存在，长度:', getDialogueHistory()[playerName].length);
    }

    content.innerHTML = `
        <div class="npc-dialogue-container">
            <div class="npc-dialogue-header">
                <div class="npc-dialogue-avatar">
                    <img src="images/players/${player.id}.png" 
                         alt="${player.name}"
                         style="display:none;" 
                         onload="this.style.display='block'; this.nextElementSibling.style.display='none'"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <span style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                        ${player.name.charAt(0)}
                    </span>
                </div>

                <div class="npc-dialogue-info">
                    <h3 class="npc-dialogue-name">${player.name}</h3>
                    <p class="npc-dialogue-details">
                        ${player.team} · ${player.职业}
                        ${player.好感度 ? `<span class="npc-dialogue-favor">${player.好感度}好感</span>` : ''}
                    </p>
                </div>
                <button class="npc-dialogue-close" onclick="closeDialogue()">×</button>
            </div>
            
            <!-- 消息区域 -->
            <div class="npc-dialogue-messages" id="npcDialogueMessages">
                <!-- 历史消息将通过 renderDialogueHistory 渲染 -->
            </div>
            
            <!-- 微信风格输入框 -->
            <div class="dialogue-input-container">
                <div class="dialogue-input-box" id="dialogueInputBox">
                    <div class="dialogue-input-placeholder">点击选择对话内容...</div>
                </div>
                <!-- 选项浮层 -->
                <div class="dialogue-options-overlay" id="dialogueOptionsOverlay" style="display: none;">
                    ${options.map((option, index) => `
                        <div class="npc-dialogue-option" onclick="selectGeneralDialogueOption('${playerName}', '${option.dialogueId}', ${index})">
                            ${option.text}
                        </div>
                    `).join('')}
                    <div class="npc-dialogue-option" onclick="endChat('${playerName}')">
                        今天先聊到这里吧。
                    </div>
                </div>
            </div>
        </div>
    `;

    // 设置输入框点击事件
    const inputBox = document.getElementById('dialogueInputBox');
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');

    if (inputBox && optionsOverlay) {
        inputBox.addEventListener('click', function (e) {
            e.stopPropagation();
            optionsOverlay.style.display = optionsOverlay.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方关闭浮层
        document.addEventListener('click', function (event) {
            if (!optionsOverlay.contains(event.target) && !inputBox.contains(event.target)) {
                optionsOverlay.style.display = 'none';
            }
        });
    }

    modal.style.display = 'flex';
    currentPlayerDialogue = {
        playerName: playerName,
        dialogueId: null  // 由于显示多个选项，不指定特定对话ID
    };

    // 渲染对话历史
    setTimeout(() => {
        renderDialogueHistory(playerName);
    }, 50);
}

// 显示默认对话
function showDefaultDialogue(player) {
    console.log('打开默认对话界面，玩家:', player.name);

    const modal = document.getElementById('dialogueModal');
    const content = document.getElementById('dialogueContent');

    // 初始化对话历史
    console.log('初始化默认对话历史，玩家:', player.name, '当前历史:', getDialogueHistory()[player.name]);
    if (!getDialogueHistory()[player.name]) {
        getDialogueHistory()[player.name] = [];
        console.log('创建新的对话历史数组');
    } else {
        console.log('对话历史已存在，长度:', getDialogueHistory()[player.name].length);
    }

    content.innerHTML = `
        <div class="npc-dialogue-container">
            <div class="npc-dialogue-header">
                <div class="npc-dialogue-avatar">${player.name.charAt(0)}</div>
                <div class="npc-dialogue-info">
                    <h3 class="npc-dialogue-name">${player.name}</h3>
                    <p class="npc-dialogue-details">
                        ${player.team} · ${player.职业}
                        ${player.好感度 ? `<span class="npc-dialogue-favor">${player.好感度}好感</span>` : ''}
                    </p>
                </div>
                <button class="npc-dialogue-close" onclick="closeDialogue()">×</button>
            </div>
            
            <!-- 消息区域 -->
            <div class="npc-dialogue-messages" id="npcDialogueMessages">
                <!-- 历史消息将通过 renderDialogueHistory 渲染 -->
            </div>
            
            <!-- 微信风格输入框 -->
            <div class="dialogue-input-container">
                <div class="dialogue-input-box" id="dialogueInputBox">
                    <div class="dialogue-input-placeholder">点击输入消息...</div>
                </div>
                <!-- 选项浮层 -->
                <div class="dialogue-options-overlay" id="dialogueOptionsOverlay" style="display: none;">
                    <div class="npc-dialogue-option" onclick="simpleGreet('${player.name}')">
                        没什么特别的事，就是打个招呼。
                    </div>
                    <div class="npc-dialogue-option" onclick="simpleAskTransfer('${player.name}')">
                        想了解一下你对转会的看法。
                    </div>
                    <div class="npc-dialogue-option" onclick="endChat('${player.name}')">
                        今天先聊到这里吧。
                    </div>
                </div>
            </div>
        </div>
    `;

    // 设置输入框点击事件
    const inputBox = document.getElementById('dialogueInputBox');
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');

    if (inputBox && optionsOverlay) {
        inputBox.addEventListener('click', function (e) {
            e.stopPropagation();
            optionsOverlay.style.display = optionsOverlay.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方关闭浮层
        document.addEventListener('click', function (event) {
            if (!optionsOverlay.contains(event.target) && !inputBox.contains(event.target)) {
                optionsOverlay.style.display = 'none';
            }
        });
    }

    modal.style.display = 'flex';

    // 渲染对话历史
    renderDialogueHistory(player.name);

    // 设置当前对话上下文
    currentPlayerDialogue = {
        playerName: player.name,
        dialogueId: null
    };
}

// 显示对话（预置对话）
function showDialogue(playerName, dialogue) {
    const player = gameData.players.find(p => p.name === playerName);
    const modal = document.getElementById('dialogueModal');
    const content = document.getElementById('dialogueContent');

    // 初始化对话历史
    console.log('初始化预置对话历史，玩家:', playerName, '当前历史:', getDialogueHistory()[playerName]);
    if (!getDialogueHistory()[playerName]) {
        getDialogueHistory()[playerName] = [];
        console.log('创建新的对话历史数组');
    } else {
        console.log('对话历史已存在，长度:', getDialogueHistory()[playerName].length);
    }

    // 过滤选项，只显示符合条件的选项
    const availableOptions = dialogue.playerOptions.filter(option => {
        if (!option.condition) return true;
        const playerData = gameData.players.find(p => p.name === playerName);
        return option.condition(playerData);
    });

    content.innerHTML = `
        <div class="npc-dialogue-container">
            <div class="npc-dialogue-header">                
                 <div class="npc-dialogue-avatar">
                    <img src="images/players/${player.id}.png" 
                         alt="${player.name}"
                         style="display:none;" 
                         onload="this.style.display='block'; this.nextElementSibling.style.display='none'"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <span style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                        ${player.name.charAt(0)}
                    </span>
                </div>

                <div class="npc-dialogue-info">
                    <h3 class="npc-dialogue-name">${player.name}</h3>
                    <p class="npc-dialogue-details">
                        ${player.team} · ${player.职业}
                        ${player.好感度 ? `<span class="npc-dialogue-favor">${player.好感度}好感</span>` : ''}
                    </p>
                </div>
                <button class="npc-dialogue-close" onclick="closeDialogue()">×</button>
            </div>
            
            <!-- 消息区域 -->
            <div class="npc-dialogue-messages" id="npcDialogueMessages">
                <!-- 历史消息将通过 renderDialogueHistory 渲染 -->
            </div>
            
            <!-- 微信风格输入框 -->
            <div class="dialogue-input-container">
                <div class="dialogue-input-box" id="dialogueInputBox">
                    <div class="dialogue-input-placeholder">点击选择对话内容...</div>
                </div>
                <!-- 选项浮层 -->
                <div class="dialogue-options-overlay" id="dialogueOptionsOverlay" style="display: none;">
                    ${availableOptions.map((option, index) => `
                        <div class="npc-dialogue-option" onclick="selectDialogueOption('${playerName}', '${dialogue.id}', ${index})">
                            ${option.text}
                        </div>
                    `).join('')}
                    <div class="npc-dialogue-option" onclick="endChat('${playerName}')">
                        今天先聊到这里吧。
                    </div>
                </div>
            </div>
        </div>
    `;

    // 设置输入框点击事件
    const inputBox = document.getElementById('dialogueInputBox');
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');

    if (inputBox && optionsOverlay) {
        inputBox.addEventListener('click', function (e) {
            e.stopPropagation();
            optionsOverlay.style.display = optionsOverlay.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方关闭浮层
        document.addEventListener('click', function (event) {
            if (!optionsOverlay.contains(event.target) && !inputBox.contains(event.target)) {
                optionsOverlay.style.display = 'none';
            }
        });
    }

    modal.style.display = 'flex';
    currentPlayerDialogue = {
        playerName: playerName,
        dialogueId: dialogue.id
    };

    // 渲染对话历史
    setTimeout(() => {
        renderDialogueHistory(playerName);
    }, 50);
}

// 渲染对话历史（统一处理普通消息和红包）
function renderDialogueHistory(playerName) {
    console.log('渲染对话历史，玩家:', playerName);
    console.log('当前dialogueHistory内容:', getDialogueHistory());

    const messagesContainer = document.getElementById('npcDialogueMessages');
    if (!messagesContainer) {
        console.log('未找到消息容器');
        return;
    }

    // 清空容器
    messagesContainer.innerHTML = '';

    console.log('检查玩家', playerName, '的对话历史:', getDialogueHistory()[playerName]);

    // 如果有历史记录，渲染所有消息
    if (getDialogueHistory()[playerName] && getDialogueHistory()[playerName].length > 0) {
        console.log('找到', getDialogueHistory()[playerName].length, '条历史消息');
        getDialogueHistory()[playerName].forEach(item => {
            //console.log('渲染历史项:', item);
            messagesContainer.innerHTML += item.html || item;
        });
    } else {
        console.log('没有找到该玩家的历史消息或历史为空');
    }

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 选择对话选项
function selectDialogueOption(playerName, dialogueId, optionIndex) {
    const dialogue = playerDialogues[playerName]?.find(d => d.id === dialogueId);
    if (!dialogue) return;

    const option = dialogue.playerOptions[optionIndex];
    if (!option) return;

    // 检查选项条件（再次检查，防止直接调用）
    const player = gameData.players.find(p => p.name === playerName);
    if (option.condition && !option.condition(player)) {
        alert("条件不满足，无法选择此选项");
        return;
    }

    // 隐藏选项区域
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');
    if (optionsOverlay) {
        optionsOverlay.style.display = 'none';
    }

    // 添加玩家的发言
    addDialogueMessage(option.text, true);



    // 显示对话链
    setTimeout(() => {
        displayDialogueChain(playerName, option.responseChain, option.afterEffects, 0, null);
    }, 1500);
}

// 从所有可用选项中选择对话选项
function selectGeneralDialogueOption(playerName, dialogueId, optionIndex) {
    // 获取所有可用选项
    const allAvailableOptions = getAllAvailableDialogueOptions(playerName);

    const targetOption = allAvailableOptions[optionIndex];

    if (!targetOption) return;

    // 检查选项条件（再次检查，防止直接调用）
    const player = gameData.players.find(p => p.name === playerName);
    if (targetOption.condition && !targetOption.condition(player)) {
        alert("条件不满足，无法选择此选项");
        return;
    }

    // 检查是否为特殊对话，如果是则立即标记为已触发并重新渲染选项
    if (targetOption.isSpecial && targetOption.specialId) {
        console.log('触发特殊对话:', targetOption.specialId, '当前特殊对话列表:', gameData.specialDialogues);

        // 确保 specialDialogues 数组存在
        if (!gameData.specialDialogues) {
            gameData.specialDialogues = [];
        }

        // 检查是否已经记录过
        const existingIndex = gameData.specialDialogues.findIndex(d => d.id === targetOption.specialId);
        if (existingIndex === -1) {
            // 记录特殊对话已触发
            gameData.specialDialogues.push({
                id: targetOption.specialId,
                triggered: true,
                timestamp: Date.now(),
                playerName: playerName,
                dialogueId: dialogueId
            });
            console.log('新增特殊对话记录:', targetOption.specialId);
        } else {
            // 更新为已触发状态
            gameData.specialDialogues[existingIndex].triggered = true;
            gameData.specialDialogues[existingIndex].timestamp = Date.now();
            console.log('更新特殊对话记录:', targetOption.specialId);
        }

        console.log('触发后特殊对话列表:', gameData.specialDialogues);

        // 立即重新加载对话选项，移除已触发的特殊对话
        console.log('重新加载后可用选项数量:', getAllAvailableDialogueOptions(playerName).length);
        updateDialogueOptions(playerName);
    }

    // 隐藏选项区域
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');
    if (optionsOverlay) {
        optionsOverlay.style.display = 'none';
    }



    // 添加玩家的发言
    addDialogueMessage(targetOption.text, true);

    // 设置当前对话上下文，用于分支选择
    currentPlayerDialogue = {
        playerName: playerName,
        dialogueId: dialogueId,
        optionIndex: optionIndex
    };

    // 检查这个选项是否有分支选项
    const dialogues = playerDialogues[playerName];
    if (dialogues) {
        const dialogue = dialogues.find(d => d.id === dialogueId);
        if (dialogue && dialogue.playerOptions && dialogue.playerOptions[optionIndex]) {
            const option = dialogue.playerOptions[optionIndex];
            if (option.branchOptions) {
                // 将分支数据保存到当前上下文
                currentPlayerDialogue.branchOptions = option.branchOptions;
                currentPlayerDialogue.postBranchResponseChain = option.postBranchResponseChain;
            }
        }
    }

    // 显示对话链
    setTimeout(() => {
        displayDialogueChain(playerName, targetOption.responseChain, targetOption.afterEffects, 0, null);
    }, 2000);
}

// 显示对话链
// 显示对话链 - 修复版本
function displayDialogueChain(playerName, responseChain, afterEffects, index = 0, nextResponseChain = null, continueOriginalDialogue = false) {
    if (index >= responseChain.length) {
        // 对话链结束，应用效果
        applyDialogueEffects(playerName, afterEffects);

        // 调试日志
        console.log('Dialogue chain ended:', {
            playerName,
            hasAfterEffects: !!afterEffects,
            showBranchChoice: afterEffects?.showBranchChoice,
            currentDialogue: currentPlayerDialogue,
            dialogueId: currentPlayerDialogue?.dialogueId
        });

        // 检查是否有分支选项需要显示 - 修复逻辑
        if (currentPlayerDialogue && afterEffects && afterEffects.showBranchChoice) {
            console.log('Branch selection should show for:', currentPlayerDialogue);

            // 延迟显示分支选择，确保UI更新完成
            setTimeout(() => {
                // 尝试从对话数据中查找分支选项
                const dialogueId = currentPlayerDialogue.dialogueId;
                const targetDialogue = findDialogueWithBranch(playerName, dialogueId);

                if (targetDialogue && targetDialogue.branchOptions) {
                    console.log('Found branch options:', targetDialogue.branchOptions);
                    showBranchChoice(
                        targetDialogue,
                        playerName
                    );
                } else {
                    console.error('Cannot find branch options for dialogue:', dialogueId);
                    console.log('Searching in all dialogues for player:', playerName);

                    // 如果按ID找不到，尝试查找第一个有分支选项的对话
                    const allDialogues = playerDialogues[playerName];
                    if (allDialogues) {
                        for (const dialogue of allDialogues) {
                            if (dialogue.playerOptions) {
                                for (const option of dialogue.playerOptions) {
                                    if (option.branchOptions && option.branchOptions.length > 0) {
                                        console.log('Found alternative dialogue with branch options:', dialogue.id);
                                        const branchData = {
                                            dialogueId: dialogue.id,
                                            dialogue: dialogue,
                                            option: option,
                                            branchOptions: option.branchOptions,
                                            postBranchResponseChain: option.postBranchResponseChain
                                        };
                                        showBranchChoice(
                                            branchData,
                                            playerName
                                        );
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    // 如果还是找不到，检查具体的对话数据
                    console.log('All dialogues for', playerName, ':',
                        allDialogues?.map(d => ({
                            id: d.id,
                            hasBranch: !!d.branchOptions,
                            branchCount: d.branchOptions?.length
                        }))
                    );
                }
            }, 1600);
        } else {
            // 如果有后续对话链，则继续执行
            if (nextResponseChain && nextResponseChain.length > 0) {
                setTimeout(() => {
                    displayDialogueChain(playerName, nextResponseChain, {}, 0, null, continueOriginalDialogue);
                }, 2000);
            } else {
                // 如果需要继续原对话，则继续
                if (continueOriginalDialogue && currentPlayerDialogue && currentPlayerDialogue.originalResponseChain) {
                    // 恢复到原对话的下一个位置
                    setTimeout(() => {
                        const originalIndex = currentPlayerDialogue.currentOriginalIndex || 0;
                        const remainingChain = currentPlayerDialogue.originalResponseChain.slice(originalIndex);
                        if (remainingChain.length > 0) {
                            displayDialogueChain(playerName, remainingChain, {}, 0, null, true);
                        }
                    }, 2000);
                } else {
                    // 对话完全结束，更新选项列表
                    updateOptionsAfterDialogue(playerName);
                }
            }
        }
        return;
    }

    const response = responseChain[index];

    // 根据speaker判断左右位置
    const isPlayer = response.speaker === 'player';
    addDialogueMessage(response.text, isPlayer);

    // 执行 onShow 回调（如果存在）
    if (response.onShow && typeof response.onShow === 'function') {
        response.onShow();
    }

    // 等待后显示下一条
    const delay = response.isPlayerOption ? 800 : 2000;
    setTimeout(() => {
        displayDialogueChain(playerName, responseChain, afterEffects, index + 1, nextResponseChain, continueOriginalDialogue);
    }, delay);
}

// 辅助函数：查找包含分支选项的对话
function findDialogueWithBranch(playerName, dialogueId) {
    if (!playerDialogues[playerName]) {
        console.error('No dialogues for player:', playerName);
        return null;
    }

    // 首先按ID精确查找对话
    let dialogue = playerDialogues[playerName].find(d => d.id === dialogueId);
    let foundOption = null;

    if (dialogue && dialogue.playerOptions) {
        // 查找包含分支选项的选项
        for (const option of dialogue.playerOptions) {
            if (option.branchOptions && option.branchOptions.length > 0) {
                console.log('Found branch options in option:', option.text);
                foundOption = option;
                break;
            }
        }
    }

    if (!foundOption && dialogueId) {
        // 模糊匹配查找
        const matchingDialogue = playerDialogues[playerName].find(d =>
            d.id && (d.id.includes(dialogueId) || (dialogueId.includes && dialogueId.includes(d.id)))
        );

        if (matchingDialogue && matchingDialogue.playerOptions) {
            for (const option of matchingDialogue.playerOptions) {
                if (option.branchOptions && option.branchOptions.length > 0) {
                    console.log('Found branch options in option (fuzzy match):', matchingDialogue.id);
                    foundOption = option;
                    dialogue = matchingDialogue;
                    break;
                }
            }
        }
    }

    if (foundOption) {
        return {
            dialogueId: dialogue.id,
            dialogue: dialogue,
            option: foundOption,
            branchOptions: foundOption.branchOptions,
            postBranchResponseChain: foundOption.postBranchResponseChain
        };
    }

    return null;
}

// 更新对话框中的选项（重新加载可用选项）
function updateDialogueOptions(playerName) {
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');
    if (!optionsOverlay) return;

    // 重新获取所有可用选项（特殊对话会因已触发而被过滤）
    const newOptions = getAllAvailableDialogueOptions(playerName);

    // 重新构建选项HTML
    let optionsHTML = newOptions.map((option, index) => `
        <div class="npc-dialogue-option" onclick="selectGeneralDialogueOption('${playerName}', '${option.dialogueId}', ${index})">
            ${option.text}
        </div>
    `).join('');

    // 添加结束聊天选项
    optionsHTML += `
        <div class="npc-dialogue-option" onclick="endChat('${playerName}')">
            今天先聊到这里吧。
        </div>
    `;

    optionsOverlay.innerHTML = optionsHTML;
}

// 在对话结束后更新选项列表
function updateOptionsAfterDialogue(playerName) {
    setTimeout(() => {
        updateDialogueOptions(playerName);
    }, 200);
}

// 添加一个函数来更新对话框中的选项
function updateDialogueOptionsOld(playerName, newOptions) {
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');
    if (!optionsOverlay) return;

    // 重新构建选项HTML
    let optionsHTML = newOptions.map((option, index) => `
        <div class="npc-dialogue-option" onclick="selectGeneralDialogueOption('${playerName}', '${option.dialogueId}', ${index})">
            ${option.text}
        </div>
    `).join('');

    // 添加结束聊天选项
    optionsHTML += `
        <div class="npc-dialogue-option" onclick="endChat('${playerName}')">
            今天先聊到这里吧。
        </div>
    `;

    optionsOverlay.innerHTML = optionsHTML;
}



// 特殊对话状态现在通过主存档系统自动加载，无需单独处理
// 所有特殊对话状态会随主游戏数据一起加载

// 直接显示分支选择（备选方案）
function showBranchChoiceDirectly(playerName, options, postChain) {
    console.log('showBranchChoiceDirectly called:', { playerName, options, postChain });

    if (options && options.length > 0) {
        const branchData = {
            dialogueId: currentPlayerDialogue?.dialogueId || 'unknown',
            branchOptions: options,
            postBranchResponseChain: postChain
        };
        showBranchChoice(branchData, playerName);
    } else {
        console.error('No branch options provided to showBranchChoiceDirectly');

        // 尝试从当前对话上下文中查找
        if (currentPlayerDialogue) {
            const dialogueId = currentPlayerDialogue.dialogueId;
            const dialogue = findDialogueWithBranch(playerName, dialogueId);

            if (dialogue && dialogue.branchOptions) {
                console.log('Found branch options via current dialogue context');
                showBranchChoice(dialogue, playerName);
            }
        }
    }
}

// 应用对话效果，红包效果和好感度更新
function applyDialogueEffects(playerName, effects) {
    if (!effects) return;

    // 处理红包效果
    if (effects.showRedPacket && typeof effects.redPacketAmount === 'number') {
        const player = gameData.players.find(p => p.name === playerName);
        if (!player) return;

        const rpId = `rp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        // 读取自定义消息，如果没有则用默认
        const messageText = effects.redPacketMessage || "江湖救急，不用还啦。";

        const redPacketMsg = {
            type: 'redpacket',
            sender: playerName,
            amount: effects.redPacketAmount,
            text: messageText,
            id: rpId,
            status: 'unread'
        };

        // 添加红包到聊天
        addRedPacketMessageToChat(redPacketMsg, playerName);

        // 保存红包数据到玩家对象
        if (!player._redPackets) player._redPackets = {};
        player._redPackets[rpId] = {
            amount: effects.redPacketAmount,
            claimed: false,
            text: messageText,
            time: getCurrentTimeString()
        };

        // 更新借钱统计数据
        if (!player.borrowingStats) {
            player.borrowingStats = { count: 0, totalAmount: 0 };
        }
        player.borrowingStats.count++;
        player.borrowingStats.totalAmount += effects.redPacketAmount;
    }

    // 处理好感度更新
    if (effects.updateFavorability && typeof effects.updateFavorability === 'number') {
        updateFavorability(playerName, effects.updateFavorability);
    }

    // 在处理完红包和好感度后，刷新对话选项（基于新的游戏状态）
    // 延迟执行确保金钱等状态已更新
    setTimeout(() => {
        updateDialogueOptions(playerName);
    }, 300);
}

// 添加红包消息到聊天
function addRedPacketMessageToChat(rpMsg, playerName) {
    const container = document.getElementById('npcDialogueMessages');
    if (!container) return;

    const player = gameData.players.find(p => p.name === playerName);
    const rpId = rpMsg.id;

    // 检查红包是否已领取
    let isUnread = true;
    if (player && player._redPackets && player._redPackets[rpId]) {
        isUnread = !player._redPackets[rpId].claimed;
    }

    const timeStr = getCurrentTimeString();
    const bgColor = isUnread ? '#e74c3c' : '#c0392b'; // 红色背景：未领取亮红，已领取暗红
    const textColor = isUnread ? '#f1c40f' : '#bdc3c7'; // 金色/灰色文字
    const cursor = isUnread ? 'pointer' : 'default';

    // 生成红包HTML - 红底金字，金额单独一行
    const rpHTML = `
    <div class="npc-message npc-message-left" id="redpacket-${rpId}">
        <div class="npc-message-content redpacket-content" 
             style="background-color: ${bgColor}; cursor: ${cursor};"
             ${isUnread ? `onclick="claimRedPacket('${playerName}', '${rpId}')"` : ''}>
            <div class="redpacket-header">
                <span class="redpacket-icon">🧧</span>
                <span class="redpacket-title" style="color: ${textColor};">${isUnread ? '恭喜发财，大吉大利！' : '红包已领取'}</span>
            </div>
            <div class="redpacket-amount" style="color: #f1c40f;">
                ¥${rpMsg.amount}
            </div>
            <div class="redpacket-message" style="color: #f8c471;">${rpMsg.text}</div>
            <div class="npc-message-time redpacket-time">${timeStr}</div>
        </div>
    </div>
`;

    // 添加到DOM
    container.innerHTML += rpHTML;
    container.scrollTop = container.scrollHeight;

    // 保存到历史记录
    if (playerName && getDialogueHistory()[playerName]) {
        getDialogueHistory()[playerName].push({
            type: 'redpacket',
            id: rpId,
            html: rpHTML,
            data: {
                playerName: playerName,
                rpId: rpId,
                amount: rpMsg.amount,
                text: rpMsg.text,
                isUnread: isUnread,
                time: timeStr
            }
        });
    }
}

// 领取红包
function claimRedPacket(playerName, rpId) {
    const player = gameData.players.find(p => p.name === playerName);
    if (!player || !player._redPackets || player._redPackets[rpId]?.claimed) {
        return;
    }

    const { amount, text } = player._redPackets[rpId];

    // 1. 更新红包状态
    player._redPackets[rpId].claimed = true;
    player._redPackets[rpId].claimTime = getCurrentTimeString();

    // 2. 更新游戏数据
    gameData.agent.money += amount;
    updateStatusBar();

    // 3. 更新页面上的红包元素
    updateRedPacketElement(playerName, rpId);

    // 4. 添加玩家确认消息
    addPlayerRedPacketConfirmation(amount, rpId, playerName);

    // 5. 更新历史记录中的红包状态
    updateHistoryRedPacketStatus(playerName, rpId);

    // 6. 轻提示
    Swal.fire({
        title: '红包已领取',
        html: `<div style="font-size:1.2rem; color:#10b981;">+${amount} 元</div>`,
        icon: 'success',
        timer: 800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });

    // 7. 刷新对话选项（因为金钱增加后可能改变条件评估）
    setTimeout(() => {
        updateDialogueOptions(playerName);
    }, 200);
}

// 更新红包元素状态
function updateRedPacketElement(playerName, rpId) {
    const rpElement = document.getElementById(`redpacket-${rpId}`);
    if (!rpElement) return;

    const player = gameData.players.find(p => p.name === playerName);
    if (!player || !player._redPackets || !player._redPackets[rpId]) return;

    const rpData = player._redPackets[rpId];

    // 更新红包显示为已领取状态
    rpElement.innerHTML = `
        <div class="npc-message-content" 
             style="background-color: #e0e0e0; padding: 10px 14px; border-radius: 18px; cursor: default;min-width: 250px;">
            <div style="font-weight: bold; color: #666;">🧧 红包（已领取）</div>
            <div style="font-size: 0.85rem; margin-top: 4px; color: #555;">${rpData.text}</div>
            <div class="npc-message-time">${rpData.time || getCurrentTimeString()}</div>
        </div>
    `;
}

// 添加玩家侧的红包确认消息
function addPlayerRedPacketConfirmation(amount, rpId, playerName = null) {
    if (!playerName && currentPlayerDialogue) {
        playerName = currentPlayerDialogue.playerName;
    }
    if (!playerName) return;

    const messagesContainer = document.getElementById('npcDialogueMessages');
    if (!messagesContainer) return;

    const timeStr = getCurrentTimeString();
    const messageHTML = `
        <div class="npc-message npc-message-right" id="redpacket-confirm-${rpId}">
            <div class="npc-message-content" 
                 style="background-color: #d0f0c0; padding: 10px 14px; border-radius: 18px;">
                <div style="font-weight: bold; color: #2d5016;">✅ 已领取红包</div>
                <div style="font-size: 0.85rem; margin-top: 4px; color: #2d5016;">
                    收到 ${amount} 元，谢谢老板！
                </div>
                <div class="npc-message-time">${timeStr}</div>
            </div>
        </div>
    `;

    messagesContainer.innerHTML += messageHTML;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 保存到历史记录
    if (playerName && getDialogueHistory()[playerName]) {
        getDialogueHistory()[playerName].push({
            type: 'redpacket-confirm',
            html: messageHTML,
            data: {
                amount: amount,
                rpId: rpId,
                time: timeStr
            }
        });
    }
}

// 更新历史记录中的红包状态
function updateHistoryRedPacketStatus(playerName, rpId) {
    if (!getDialogueHistory()[playerName]) return;

    getDialogueHistory()[playerName] = getDialogueHistory()[playerName].map(item => {
        if (item.type === 'redpacket' && item.data.rpId === rpId) {
            // 更新红包状态为已领取
            const newHtml = `
                <div class="npc-message npc-message-left" id="redpacket-${rpId}">
                    <div class="npc-message-content" 
                         style="background-color: #e0e0e0; padding: 10px 14px; border-radius: 18px; cursor: default;">
                        <div style="font-weight: bold; color: #666;">🧧 红包（已领取）</div>
                        <div style="font-size: 0.85rem; margin-top: 4px; color: #555;">${item.data.text}</div>
                        <div class="npc-message-time">${item.data.time}</div>
                    </div>
                </div>
            `;

            return {
                ...item,
                html: newHtml,
                data: {
                    ...item.data,
                    isUnread: false
                }
            };
        }
        return item;
    });
}

// 添加对话消息
function addDialogueMessage(message, isPlayer = true) {
    const messagesContainer = document.getElementById('npcDialogueMessages');
    if (!messagesContainer) return;

    let playerName = null;
    if (currentPlayerDialogue && currentPlayerDialogue.playerName) {
        playerName = currentPlayerDialogue.playerName;
    }
    if (!playerName) return;

    const timeStr = getCurrentTimeString();
    const messageClass = isPlayer ? 'npc-message-right' : 'npc-message-left';
    const messageHTML = `
        <div class="npc-message ${messageClass}">
            <div class="npc-message-content">
                <p>${message}</p>
                <div class="npc-message-time">${timeStr}</div>
            </div>
        </div>
    `;

    // 添加到DOM
    messagesContainer.innerHTML += messageHTML;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 保存到历史记录
    //  console.log('添加对话消息，玩家:', playerName, '消息:', message);
    if (playerName && getDialogueHistory()[playerName]) {
        getDialogueHistory()[playerName].push({
            type: 'message',
            html: messageHTML,
            data: {
                message: message,
                isPlayer: isPlayer,
                time: timeStr
            }
        });
        // console.log('消息已添加，当前历史长度:', getDialogueHistory()[playerName].length);
    } else {
        // console.log('无法添加消息，playerName或dialogueHistory[playerName]不存在');
    }
}

// 添加对话框中的通知消息（如好感度变化）
function addDialogueNotice(playerName, noticeText) {
    const messagesContainer = document.getElementById('npcDialogueMessages');
    const timeStr = getCurrentTimeString();
    const noticeHTML = `
        <div class="npc-message-system" style="text-align: center; margin: 10px 0; width: 100%; clear: both;">
            <span style="background: rgba(0,0,0,0.05); color: #888; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block;">
                ${noticeText}
            </span>
        </div>
    `;

    // 如果是当前正在交谈的对象，则立即显示
    if (messagesContainer && currentPlayerDialogue && currentPlayerDialogue.playerName === playerName) {
        messagesContainer.innerHTML += noticeHTML;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 保存到历史记录
    if (playerName && getDialogueHistory()[playerName]) {
        getDialogueHistory()[playerName].push({
            type: 'system',
            html: noticeHTML,
            data: {
                message: noticeText,
                time: timeStr
            }
        });
    }
}

// 获取当前时间字符串
function getCurrentTimeString() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 简单问候
function simpleGreet(playerName) {
    addDialogueMessage("没什么特别的事，就是打个招呼。", true);
    setTimeout(() => addDialogueMessage("嗯，保持联系。", false), 2000);
    hideOptionsOverlay();
}

// 询问转会看法
function simpleAskTransfer(playerName) {
    addDialogueMessage("想了解一下你对转会的看法。", true);
    setTimeout(() => {
        addDialogueMessage("转会是很重要的事情，需要慎重考虑。", false);
    }, 2000);
    hideOptionsOverlay();
}

// 结束聊天
function endChat(playerName) {
    addDialogueMessage("今天先聊到这里吧。", true);
    setTimeout(() => {
        addDialogueMessage("好的，下次再聊。", false);
    }, 2000);
    hideOptionsOverlay();
}

// 隐藏选项浮层
function hideOptionsOverlay() {
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');
    if (optionsOverlay) {
        optionsOverlay.style.display = 'none';
    }
}

// 继续对话
function continueDialogue(playerName) {
    const player = gameData.players.find(p => p.name === playerName);
    if (!player) {
        closeDialogue();
        return;
    }

    const availableDialogues = getAvailableDialogues(playerName);
    if (availableDialogues.length > 0) {
        showDialogue(playerName, availableDialogues[0]);
    } else {
        showDefaultDialogue(player);
    }
}

// 关闭对话
function closeDialogue() {
    const modal = document.getElementById('dialogueModal');
    modal.style.display = 'none';
    currentPlayerDialogue = null;
}

// 更新好感度
function updateFavorability(playerName, amount) {
    const player = gameData.players.find(p => p.name === playerName);
    if (player) {
        if (!player.好感度) player.好感度 = 0;

        player.好感度 += amount;
        player.好感度 = Math.max(0, player.好感度);

        if (amount !== 0) {
            const noticeText = `好感度 ${amount > 0 ? '+' : ''}${amount}`;
            addDialogueNotice(playerName, noticeText);
        }

        // 更新通讯录显示
        renderContacts();

        // 更新对话框中的好感度显示
        const favorElement = document.querySelector('.npc-dialogue-favor');
        if (favorElement && currentPlayerDialogue && currentPlayerDialogue.playerName === playerName) {
            favorElement.textContent = `${player.好感度}好感`;
        }
    }
}

// 弹出分支选择
function showBranchChoice(branchData, playerName) {
    console.log('showBranchChoice called with data:', branchData);

    if (!branchData || !branchData.branchOptions || branchData.branchOptions.length === 0) {
        console.error('Invalid branch data:', branchData);
        return;
    }

    // 创建弹窗容器
    let branchModal = document.getElementById('branchChoiceModal');
    if (!branchModal) {
        branchModal = document.createElement('div');
        branchModal.id = 'branchChoiceModal';
        branchModal.className = 'branch-choice-modal';
        branchModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        document.body.appendChild(branchModal);
    }

    // 构建弹窗内容
    let content = `
        <div class="branch-choice-content" style="
            background: white;
            padding: 20px;
            border-radius: 12px;
            min-width: 320px;
            max-width: 480px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #333; font-size: 1.1rem;">请选择你的回应方式</h3>
            <div class="branch-options-container">
    `;

    branchData.branchOptions.forEach((option, index) => {
        content += `
            <div class="branch-option-item" style="
                margin: 8px 0;
            ">
                <button class="branch-choice-option" 
                        onclick="selectBranchOption('${playerName}', '${branchData.dialogueId}', '${option.id || index}')" 
                        style="
                    display: block;
                    width: 100%;
                    padding: 12px 16px;
                    margin: 0;
                    border: 1px solid #e1e4e8;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                    color: #333;
                "
                onmouseover="this.style.background='linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(66, 165, 245, 0.2)';"
                onmouseout="this.style.background='linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    ${option.text}
                </button>
            </div>
        `;
    });

    content += `
            </div>
        </div>
    `;

    branchModal.innerHTML = content;
    branchModal.style.display = 'flex';

    // 保存分支数据到全局变量
    window._currentBranchData = branchData;
}

// 选择分支选项
function selectBranchOption(playerName, dialogueId, branchId) {
    console.log('selectBranchOption called:', { playerName, dialogueId, branchId });

    // 隐藏弹窗
    const branchModal = document.getElementById('branchChoiceModal');
    if (branchModal) {
        branchModal.style.display = 'none';
    }

    // 从全局变量获取分支数据
    const branchData = window._currentBranchData;
    if (!branchData) {
        console.error('No branch data found');
        return;
    }

    // 查找选中的分支选项
    let selectedBranch = null;
    if (branchId) {
        // 通过id查找
        selectedBranch = branchData.branchOptions.find(opt => opt.id === branchId);
    }

    if (!selectedBranch) {
        // 通过索引查找（兼容旧代码）
        const index = parseInt(branchId);
        if (!isNaN(index) && index >= 0 && index < branchData.branchOptions.length) {
            selectedBranch = branchData.branchOptions[index];
        }
    }

    if (!selectedBranch) {
        console.error('Branch option not found:', branchId);
        return;
    }

    console.log('Selected branch:', selectedBranch);

    // 添加玩家选择到对话历史
    addDialogueMessage(selectedBranch.text, true);

    // 显示分支对话链
    setTimeout(() => {
        displayDialogueChain(
            playerName,
            selectedBranch.responseChain,
            selectedBranch.afterEffects,
            0,
            branchData.postBranchResponseChain
        );
    }, 2000);

    // 清理全局变量
    window._currentBranchData = null;

    // 分支对话结束后更新选项列表
    setTimeout(() => {
        updateOptionsAfterDialogue(playerName);
    }, 2000); // 给分支对话链一些时间完成
}

// 添加一些CSS样式到页面中
function addBranchChoiceStyles() {
    if (!document.querySelector('#branchChoiceStyles')) {
        const styleHTML = `
            <style id="branchChoiceStyles">
                .branch-choice-modal {
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .branch-choice-content {
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .branch-option-item {
                    position: relative;
                }
                
                .branch-option-item:before {
                    content: '→';
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #42a5f5;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .branch-option-item:hover:before {
                    opacity: 1;
                }
                
                .branch-choice-option {
                    padding-left: 28px !important;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styleHTML);
    }
}

// 在页面加载时添加样式
document.addEventListener('DOMContentLoaded', function () {
    addBranchChoiceStyles();
});

// 修改显示对话链的部分，确保能正确处理有分支选项的对话
// 在 selectGeneralDialogueOption 函数中，添加分支数据到当前对话上下文
function selectGeneralDialogueOption(playerName, dialogueId, optionIndex) {
    // 获取所有可用选项
    const allAvailableOptions = getAllAvailableDialogueOptions(playerName);

    const targetOption = allAvailableOptions[optionIndex];

    if (!targetOption) return;

    // 检查选项条件（再次检查，防止直接调用）
    const player = gameData.players.find(p => p.name === playerName);
    if (targetOption.condition && !targetOption.condition(player)) {
        alert("条件不满足，无法选择此选项");
        return;
    }

    // 检查是否为特殊对话，如果是则立即标记为已触发并重新渲染选项
    if (targetOption.isSpecial && targetOption.specialId) {
        // 确保 specialDialogues 数组存在
        if (!gameData.specialDialogues) {
            gameData.specialDialogues = [];
        }

        // 检查是否已经记录过
        const existingIndex = gameData.specialDialogues.findIndex(d => d.id === targetOption.specialId);
        if (existingIndex === -1) {
            // 记录特殊对话已触发
            gameData.specialDialogues.push({
                id: targetOption.specialId,
                triggered: true,
                timestamp: Date.now(),
                playerName: playerName,
                dialogueId: dialogueId
            });
        } else {
            // 更新为已触发状态
            gameData.specialDialogues[existingIndex].triggered = true;
            gameData.specialDialogues[existingIndex].timestamp = Date.now();
        }

        // 立即重新加载对话选项，移除已触发的特殊对话
        updateDialogueOptions(playerName);
    }

    // 隐藏选项区域
    const optionsOverlay = document.getElementById('dialogueOptionsOverlay');
    if (optionsOverlay) {
        optionsOverlay.style.display = 'none';
    }



    // 添加玩家的发言
    addDialogueMessage(targetOption.text, true);

    // 设置当前对话上下文，用于分支选择
    currentPlayerDialogue = {
        playerName: playerName,
        dialogueId: dialogueId,
        optionIndex: optionIndex  // 添加选项索引
    };

    // 检查这个选项是否有分支选项
    const dialogues = playerDialogues[playerName];
    if (dialogues) {
        const dialogue = dialogues.find(d => d.id === dialogueId);
        if (dialogue && dialogue.playerOptions && dialogue.playerOptions[optionIndex]) {
            const option = dialogue.playerOptions[optionIndex];
            if (option.branchOptions) {
                // 将分支数据保存到当前上下文
                currentPlayerDialogue.branchOptions = option.branchOptions;
                currentPlayerDialogue.postBranchResponseChain = option.postBranchResponseChain;
            }
        }
    }

    // 显示对话链
    setTimeout(() => {
        displayDialogueChain(playerName, targetOption.responseChain, targetOption.afterEffects, 0, null);
    }, 2000);
}

// ========== 红包容器相关（保持原有功能） ==========
function createRedPacketContainer() {
    if (!document.querySelector('#redPacketContainer')) {
        const redPacketHTML = `
            <div id="redPacketContainer" class="red-packet-container">
                <div class="red-packet-content">                   
                    <div class="red-packet-icon">🧧</div>
                    <div class="red-packet-sender" id="redPacketSender"></div>
                    <div class="red-packet-amount" id="redPacketAmount">¥0</div>
                    <div class="red-packet-message" id="redPacketMessage">恭喜发财，大吉大利！</div>
                    <button class="red-packet-button" onclick="receiveRedPacket()">开</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', redPacketHTML);
    }
}

function showRedPacket(senderName, amount, message = "恭喜发财，大吉大利！") {
    createRedPacketContainer();

    const container = document.getElementById('redPacketContainer');
    const senderElement = document.getElementById('redPacketSender');
    const amountElement = document.getElementById('redPacketAmount');
    const messageElement = document.getElementById('redPacketMessage');

    senderElement.textContent = `${senderName}`;
    amountElement.textContent = `¥${amount}`;
    messageElement.textContent = message;

    container.style.display = 'flex';
}

function receiveRedPacket() {
    const container = document.getElementById('redPacketContainer');
    container.style.display = 'none';
}