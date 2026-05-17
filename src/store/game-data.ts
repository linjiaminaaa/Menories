import type { Customer } from './game-store'

// ===== 顾客数据 =====
const customers: Record<string, Customer> = {
  'lao-chen': {
    id: 'lao-chen',
    name: '老陈',
    title: '缺席的父亲',
    appearance: '穿着整洁的旧西装，但鞋子明显磨损。花白头发梳理得一丝不苟，双手微微颤抖。',
    urgency: 60,
    concealment: 70,
    defense: 50,
    memory: {
      id: 'mem-lao-chen',
      name: '女儿的婚礼',
      emotion: 'nostalgia',
      hiddenEmotion: 'guilt',
      purity: 45,
      completeness: 70,
      rarity: 2,
      basePrice: 300,
      description: '一段温暖的婚礼记忆，新娘穿着白色婚纱，父亲牵着女儿的手走向新郎。',
      hiddenTruth: '这段记忆是伪造的。老陈因为酗酒问题没有参加女儿的婚礼，他用想象填补了缺席的遗憾。记忆中"牵着女儿的手"的触感异常模糊，婚礼现场的宾客面目不清。',
      coreStory: '老陈多年来一直活在自责中。他卖掉这段记忆，是为了忘记自己缺席的痛苦——即使这段记忆本身也是假的。',
      isCorrupted: true,
      corruptionLevel: 60,
      daysStored: 0,
    },
    dialog: [
      {
        speaker: 'narrator',
        text: '门铃响了。一个穿着旧西装的老人缓步走进店里，他的目光在柜台上的天平上停留了一秒。',
      },
      {
        speaker: 'customer',
        text: '你好...我想当掉一段记忆。是我女儿的婚礼，很珍贵的回忆，但...我实在需要钱。',
        microExpression: '说话时眼神躲闪，手指不停摩挲左手无名指',
        choices: [
          { text: '婚礼记忆应该很珍贵，你为什么舍得卖？', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2, revealInfo: '他似乎对这段记忆的情感反应不太自然' },
          { text: '先让我看看成色再说。', defenseChange: 5, urgencyChange: -5, priceModifier: 0.9, nextStep: 3 },
          { text: '最近像你这样卖美好记忆的人不少。', defenseChange: 0, urgencyChange: 5, priceModifier: 1.0, nextStep: 3, revealInfo: '他听到这话明显松了一口气' },
        ],
      },
      {
        speaker: 'customer',
        text: '我...我需要用钱。女儿跟我断绝了联系，我想给她汇一笔钱，算是补偿。把这段记忆当掉，也算是一种...放下吧。',
        microExpression: '声音哽咽，但眼眶异常干燥——像是哭不出来的悲伤',
      },
      {
        speaker: 'customer',
        text: '你鉴定的吧，我很信任你。那段婚礼...是我在这个世上最美好的回忆了。',
        microExpression: '提到婚礼时，嘴角上扬的弧度不太自然，像是练习过很多次',
      },
      {
        speaker: 'narrator',
        text: '老陈点了点头，闭上了眼睛。你启动神经链接装置，示波器上跳动的波形泛着柔和的紫色，但仔细看，波峰之间夹杂着暗红色的杂波...',
      },
    ],
    consequenceA: '几天后，你在新闻上看到：一位老人用汇来的钱试图联系女儿，但对方拒收了。钱被退回，老人独自坐在公园长椅上发呆。',
    consequenceB: '你拒绝了交易。老陈沉默了很久，收起记忆离开了。你不知道他后来去了哪里，但那双颤抖的手让你至今难忘。',
    consequenceC: '你威胁要揭露记忆的真相。老陈跪在地上求你不要告诉任何人——他宁愿带着谎言活着，也不愿面对真实的自己。',
  },

  'xiao-yu': {
    id: 'xiao-yu',
    name: '小雨',
    title: '执念的囚徒',
    appearance: '年轻女性，化着精致妆容但眼圈发黑。穿着时髦但有点皱，像是好几天没换衣服。',
    urgency: 80,
    concealment: 85,
    defense: 65,
    memory: {
      id: 'mem-xiao-yu',
      name: '完美的爱情',
      emotion: 'joy',
      hiddenEmotion: 'fear',
      purity: 30,
      completeness: 50,
      rarity: 3,
      basePrice: 500,
      description: '一段甜蜜的恋爱记忆，在海边散步，对方温柔地说着什么，夕阳洒在两人身上。',
      hiddenTruth: '这不是爱情。这是一段执念——对方从未回应过她的感情。记忆中的"温柔低语"其实是风声，"十指紧扣"是她在梦中编织的触感。整段记忆被她的潜意识严重扭曲。',
      coreStory: '小雨患有一种罕见的记忆扭曲症，她无法区分幻想与现实。这段"完美爱情"是她精神世界坍塌前最后的支柱。',
      isCorrupted: true,
      corruptionLevel: 80,
      daysStored: 0,
    },
    dialog: [
      {
        speaker: 'narrator',
        text: '推门进来的是个年轻女孩，她环顾四周的方式像是在确认这里是否安全。',
      },
      {
        speaker: 'customer',
        text: '我听说这里可以...交易记忆？我有一段很珍贵的恋爱记忆想卖。和他在一起的日子，是我人生唯一的光。',
        microExpression: '说起"他"的时候，瞳孔微微放大，但手指在桌面下不停扣着',
        choices: [
          { text: '你说"唯一的光"——除了这段记忆，其他都是黑暗吗？', defenseChange: -15, urgencyChange: 15, priceModifier: 1.2, nextStep: 2, revealInfo: '她的防线出现裂痕，似乎很久没人这样问过她' },
          { text: '恋爱记忆通常情感浓度高，但杂质也多。你得接受鉴定结果。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 3 },
          { text: '既然那么珍贵，为什么要卖？', defenseChange: -5, urgencyChange: 10, priceModifier: 1.1, nextStep: 2 },
        ],
      },
      {
        speaker: 'customer',
        text: '因为...我需要钱去看医生。我最近总是分不清哪些事是真的，哪些是我梦到的。医生说如果继续这样，我可能会...但我不能没有这段记忆啊。',
        microExpression: '双手开始颤抖，频繁看手表，像是赶时间',
      },
      {
        speaker: 'customer',
        text: '求你了，给我一个好价钱吧。他对我真的很好...很好...',
        microExpression: '重复"很好"时，眼神空洞地望向柜台上的天平',
      },
      {
        speaker: 'narrator',
        text: '小雨将手指轻轻按在神经链接器上。示波器泛起温暖的金黄色波形，但波形的边缘像水一样不断流淌变形，核心频率似乎有什么东西在挣扎...',
      },
    ],
    consequenceA: '一周后，一个陌生男人来到店里，说小雨卖掉记忆后精神完全崩溃了。他不是小雨的恋人，只是她的同事。"她一直活在自己的世界里，"男人叹了口气，"我不知道该怎么帮她。"',
    consequenceB: '你拒绝了交易，并建议她去看医生。小雨愣了很久，最后轻声说了句"谢谢"便离开了。你不知道她后来是否接受了治疗。',
    consequenceC: '你威胁要公开她的病历信息。小雨当场崩溃大哭，她跑出店门，此后再也没有人见过她。你赚到了钱，但夜里总会想起她空洞的眼神。',
  },

  'boss-zhou': {
    id: 'boss-zhou',
    name: '周老板',
    title: '危险的交易',
    appearance: '体态微胖的中年男性，戴着金表，西装笔挺但领带松垮。眼神锐利，嘴角挂着习惯性的微笑。',
    urgency: 40,
    concealment: 90,
    defense: 75,
    memory: {
      id: 'mem-boss-zhou',
      name: '一笔大生意',
      emotion: 'joy',
      hiddenEmotion: 'anger',
      purity: 35,
      completeness: 60,
      rarity: 4,
      basePrice: 800,
      description: '一场庆功宴的记忆，觥筹交错，众人举杯庆祝。主角站在人群中央，意气风发。',
      hiddenTruth: '这不是普通的庆功宴。这笔"大生意"涉及非法的资金转移。周老板是洗钱链条的关键人物，他在卖掉记忆的同时，也在销毁证据。记忆中那些"合作伙伴"的面孔，是警方一直在追查的对象。',
      coreStory: '周老板不是来卖记忆的——他是来销毁证据的。如果你买下这段记忆，你就成了窝藏证据的共犯。',
      isCorrupted: true,
      corruptionLevel: 70,
      daysStored: 0,
    },
    dialog: [
      {
        speaker: 'narrator',
        text: '一个气度不凡的中年男人推门而入，他的步伐自信得像是走进自家客厅。',
      },
      {
        speaker: 'customer',
        text: '老板，我有一段生意成功的记忆想卖。价码好商量。咱们都是生意人，爽快一点。',
        microExpression: '笑容职业化，眼神却在快速扫描店内的一切——像在评估风险',
        choices: [
          { text: '生意成功的记忆？通常这种记忆纯度不高，人总是会把运气当成实力。', defenseChange: -10, urgencyChange: 5, priceModifier: 0.85, nextStep: 2, revealInfo: '他的笑容僵了一瞬——你触碰到了什么' },
          { text: '出价之前需要先鉴定，规矩你懂的。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 3 },
          { text: '爽快？越是急着出手的东西，越要仔细看。', defenseChange: -15, urgencyChange: 15, priceModifier: 1.15, nextStep: 2, revealInfo: '他的手不自觉地摸向西装内袋——那里似乎装着什么' },
        ],
      },
      {
        speaker: 'customer',
        text: '你说话挺有意思。行吧，随便你怎么鉴定，反正就是一段普通的庆功记忆，没什么特别的。',
        microExpression: '说"没什么特别"时，右手食指不自觉地敲击桌面——这是焦虑的表现',
      },
      {
        speaker: 'customer',
        text: '价钱嘛，我出双倍市场价收购也行，或者你直接买断。总之，这段记忆我今天必须处理掉。',
        microExpression: '无意间说出"必须"二字后，他的表情闪过一丝紧张',
      },
      {
        speaker: 'narrator',
        text: '周老板将手按在神经链接器上。示波器闪烁出喜庆的金红色波形，但信号深处隐约可见一些暗影在游走——那些不该出现在庆功记忆里的东西...',
      },
    ],
    consequenceA: '三天后，警方突然造访你的店铺。原来那段记忆里记录了洗钱链条的关键信息，你作为知情人被列入了调查名单。你的店铺被迫停业整顿。',
    consequenceB: '你拒绝了交易并暗示他找错了地方。周老板脸色一变，匆匆离去。当晚你发现店铺门口被人泼了红漆。',
    consequenceC: '你用记忆中的信息威胁他。周老板先是沉默，然后掏出一沓现金放在桌上："聪明人。"你拿到了钱，但你知道你手上已经沾了洗不掉的东西。',
  },

  'a-guang': {
    id: 'a-guang',
    name: '阿光',
    title: '偷来的灵感',
    appearance: '消瘦的年轻人，穿着沾满颜料的旧T恤，手指缝里嵌着洗不掉的油彩。头发蓬乱，但眼睛里有一种奇异的光。',
    urgency: 50,
    concealment: 65,
    defense: 40,
    memory: {
      id: 'mem-a-guang',
      name: '杰作的诞生',
      emotion: 'joy',
      hiddenEmotion: 'guilt',
      purity: 40,
      completeness: 65,
      rarity: 3,
      basePrice: 450,
      description: '一段创作的巅峰体验记忆——灵感如泉涌，画笔在画布上飞舞，一件伟大的作品在手中诞生。',
      hiddenTruth: '这个灵感不是他的。他最好的朋友——同样是一个画家——在死前把未完成的作品和创作思路告诉了他。阿光在朋友死后盗用了这些想法，并以自己的名义发表。这段"创作"记忆的内核，是朋友临终时信任的眼神。',
      coreStory: '阿光的名声建立在偷来的灵感之上。他卖掉这段记忆，是为了摆脱那双临终前的眼睛——那双信任他、却被他背叛的眼睛。',
      isCorrupted: true,
      corruptionLevel: 55,
      daysStored: 0,
    },
    dialog: [
      {
        speaker: 'narrator',
        text: '一个瘦削的年轻人推门进来，身上的颜料味先他一步到达。',
      },
      {
        speaker: 'customer',
        text: '嘿，我是个画家...呃，艺术家。我想卖掉一段创作的记忆——我最好的作品诞生那一刻。那段体验太...太沉重了，我需要释放一些空间。',
        microExpression: '说到"最好的作品"时，眼神闪烁，像是在回避什么',
        choices: [
          { text: '创作是你灵魂的一部分，连这个都要卖？', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2, revealInfo: '他低下头，回避了你的目光' },
          { text: '艺术家的记忆通常情感浓度极高，开价也不会低。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 3 },
          { text: '"沉重"？创作的喜悦怎么会沉重？', defenseChange: -15, urgencyChange: 15, priceModifier: 1.2, nextStep: 2, revealInfo: '他明显被戳中了——手不自觉地握紧了拳头' },
        ],
      },
      {
        speaker: 'customer',
        text: '你不明白...当你背负着...当你知道自己不够好的时候，那点喜悦就会被愧疚淹没。我只是想...解脱。',
        microExpression: '声音突然变小，手指无意识地在桌面上画着什么——是一个未完成的螺旋图案',
      },
      {
        speaker: 'customer',
        text: '算了，你鉴定吧。不管值多少钱，我都要卖。',
        microExpression: '频繁看向门口，像是害怕有人会跟进来',
      },
      {
        speaker: 'narrator',
        text: '阿光颤抖着将手指放在神经链接器上。示波器绽放出绚烂的金色波形，像是黎明前的曙光。但信号的核心，有一团暗色的杂波——那是另一张脸的轮廓...',
      },
    ],
    consequenceA: '一个月后，阿光的新画展开幕了——评价是"灵气全无"。失去了那段记忆的他，再也找不回创作的激情。而那幅"杰作"的真正创作者，在墓地里无人知晓。',
    consequenceB: '你拒绝了交易。阿光沉默地收起记忆离开了。后来你在一本艺术杂志上看到他的专访，他说："我最近在画一些关于赎罪的东西。"',
    consequenceC: '你威胁要揭露真相。阿光当场崩溃，跪在地上请求你保密。第二天，他匿名向死者家属支付了一大笔赔偿金——这是你没想到的结局。',
  },

  'sister-lin': {
    id: 'sister-lin',
    name: '林姐',
    title: '白衣的谎言',
    appearance: '三十岁左右的女性，穿着朴素的便装，但站姿笔直得像穿着护士服。面容疲倦但温和，左手腕上有一道淡淡的疤痕。',
    urgency: 70,
    concealment: 75,
    defense: 55,
    memory: {
      id: 'mem-sister-lin',
      name: '拯救生命的那一刻',
      emotion: 'joy',
      hiddenEmotion: 'sadness',
      purity: 35,
      completeness: 45,
      rarity: 3,
      basePrice: 550,
      description: '一段抢救成功的记忆——病床旁，心电监护仪从平线恢复跳动，患者家属喜极而泣。',
      hiddenTruth: '这是一段伪造的记忆。真实的情况是：林姐在值班时犯了一个致命的用药错误，导致患者死亡。她无法承受这个事实，在心理防御机制的作用下，将记忆篡改为"拯救成功"。记忆中的"监护仪跳动声"实际上是仪器的报警声。',
      coreStory: '林姐卖掉这段记忆不是为了钱，而是想让自己彻底忘记。如果连这段伪造的安慰都不存在了，她也许就能面对真相——或者彻底崩溃。',
      isCorrupted: true,
      corruptionLevel: 75,
      daysStored: 0,
    },
    dialog: [
      {
        speaker: 'narrator',
        text: '一个穿着朴素的女性走了进来，她的步伐沉稳但眼中有难以掩饰的疲惫。',
      },
      {
        speaker: 'customer',
        text: '你好，我是...我曾经是一名护士。我想卖掉一段工作中的记忆——一次成功的抢救。那是我职业生涯最有意义的时刻。',
        microExpression: '说到"成功"时，嘴唇微微颤抖，像是在努力维持一个表情',
        choices: [
          { text: '最有意义的时刻？通常人们卖掉的是痛苦，不是意义。', defenseChange: -15, urgencyChange: 10, priceModifier: 1.15, nextStep: 2, revealInfo: '她的瞳孔急剧收缩——你触碰到了她最深处的防线' },
          { text: '护士的记忆很罕见，让我看看成色。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 3 },
          { text: '你"曾经"是护士？现在不是了？', defenseChange: -10, urgencyChange: 15, priceModifier: 1.1, nextStep: 2, revealInfo: '她下意识遮住了左手腕上的疤痕' },
        ],
      },
      {
        speaker: 'customer',
        text: '我...辞职了。压力太大。那段时间...我经常做噩梦。但那段抢救的记忆是真实的美好，我想把它交给能珍惜的人。',
        microExpression: '声音在"真实的美好"处出现了微妙的颤抖，像是说了一个自己都想相信的谎',
      },
      {
        speaker: 'customer',
        text: '拜托了，请认真鉴定。这段记忆对我来说...很重要。我需要知道它到底值多少。',
        microExpression: '眼角泛红但强忍着不让泪水落下，呼吸变得急促',
      },
      {
        speaker: 'narrator',
        text: '林姐将手指轻轻按在神经链接器上。示波器泛起温暖的金黄色波形，但在某个频率下会突然跳变成冰冷的蓝色——像监护仪报警的颜色。空气中隐约能闻到消毒水的气味...',
      },
    ],
    consequenceA: '两周后，你在报纸的社会版看到：一名前护士在卖掉记忆后向医院自首，承认了三年前的一起医疗事故。文章说她"终于选择了面对真相"。',
    consequenceB: '你拒绝了交易。林姐沉默良久，然后轻轻说："也许我还不准备好放手。"她收起记忆离开了。你不确定她是否真的准备好了。',
    consequenceC: '你威胁要向医疗委员会举报。林姐当场瘫坐在地上，反复说着"我不是故意的"。第二天你得知她去了警局自首。你做了一件"正确"的事，但代价是一个人的余生。',
  },

  // ===== 支线顾客 =====
  'street-poet': {
    id: 'street-poet', name: '流浪诗人', title: '霓虹下的吟游者',
    appearance: '披着荧光涂鸦的旧风衣，头发染成褪色的紫，手指上缠着写满诗句的绷带。',
    urgency: 45, concealment: 40, defense: 35,
    memory: {
      id: 'mem-street-poet', name: '最后一首诗', emotion: 'nostalgia', hiddenEmotion: 'sadness',
      purity: 50, completeness: 65, rarity: 2, basePrice: 200,
      description: '一段在雨中创作的记忆，诗句像雨水一样从脑海中倾泻而出。',
      hiddenTruth: '这不是创作，是哀悼。诗中描写的"远去的爱人"其实是他去世的猫。',
      coreStory: '他靠出卖记忆换取墨水钱，好在霓虹灯下继续写无人阅读的诗。',
      isCorrupted: false, corruptionLevel: 25, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '门被一阵风推开，一个浑身湿透的年轻人站在门口，手里攥着一本防水笔记本。' },
      { speaker: 'customer' as const, text: '我有一首诗的记忆——我最好的作品。卖掉它，我就能买一年的墨水了。', choices: [
        { text: '诗的灵感能卖钱？有意思。', defenseChange: -5, urgencyChange: 5, priceModifier: 1.0, nextStep: 2 },
        { text: '我鉴定一下再说。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他把笔记本翻到某一页推过来，纸张被雨水打湿但字迹依然清晰——那是关于一只猫的诗。' },
    ],
    consequenceA: '后来偶尔会在雨天的霓虹灯下看到他，仍然在写诗，只是诗里再也听不见雨声。',
    consequenceB: '他收起笔记本离开了。走过的地方留下了几个湿漉漉的脚印。',
    consequenceC: '你威胁要毁掉他的笔记本。他抢回来冲进了雨里，再也没有出现过。',
  },

  'gambler-wang': {
    id: 'gambler-wang', name: '王赌徒', title: '最后一注',
    appearance: '手指被烟熏得焦黄，西装袖口有线头。说话时眼球快速扫视四周，嘴角有一道旧伤疤。',
    urgency: 75, concealment: 55, defense: 60,
    memory: {
      id: 'mem-gambler-wang', name: '翻盘时刻', emotion: 'joy', hiddenEmotion: 'guilt',
      purity: 30, completeness: 55, rarity: 2, basePrice: 350,
      description: '一场赌局大翻盘的记忆，从只剩一个筹码到赢得全场，心脏在胸腔里狂跳。',
      hiddenTruth: '翻盘的关键不是运气——他出千了。记忆中"牌友的惊呼"其实是愤怒的呼喊。',
      coreStory: '他卖掉这段记忆是想洗掉作弊的负罪感，但记忆一卖他就忘了为什么不该再去赌场。',
      isCorrupted: true, corruptionLevel: 50, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '门开了，一个眼神飘忽的中年男人探头进来，确认店里没有其他人后才走进来。' },
      { speaker: 'customer' as const, text: '我有一段绝地翻盘的记忆。赌博用的，但你可以鉴定里面的...心理状态。我需要换点钱继续用。', choices: [
        { text: '你确定卖了这个不会再去赌？', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2 },
        { text: '让我看看。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他将手指按在神经链接器上。示波器上的波形紊乱而破碎——像是被反复翻找过很多次。' },
    ],
    consequenceA: '几天后听说他又进了赌场，用你付的钱。没有那段翻盘记忆的支撑，他输得比以往都惨。',
    consequenceB: '他叹了口气说也许是时候戒赌了，但你看到他离开时往赌场的方向走去。',
    consequenceC: '你威胁要告诉赌场他出千的事。他脸色惨白，丢下记忆跑了——你白得了一段记忆。',
  },

  'model-blue': {
    id: 'model-blue', name: '蓝羽', title: '镜中人',
    appearance: '身材高挑，穿着简洁的灰色套装，面容精致但被一块轻薄的蓝纱遮掩，只露出一双疲惫的眼睛。',
    urgency: 55, concealment: 60, defense: 45,
    memory: {
      id: 'mem-model-blue', name: '完美的自己', emotion: 'joy', hiddenEmotion: 'fear',
      purity: 40, completeness: 60, rarity: 3, basePrice: 400,
      description: '一段在镜中看到完美的自己的记忆——完美的妆容、完美的微笑、完美的自信。',
      hiddenTruth: '镜子里的不是自信，是恐惧。她每天花两小时化妆不是因为爱美，而是害怕别人看到她真实的样子。',
      coreStory: '她想卖掉的不是美，而是对不美的恐惧。',
      isCorrupted: true, corruptionLevel: 45, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '一个戴着面纱的女子轻轻推开门，她走路时几乎不发出声音，像一片落叶。' },
      { speaker: 'customer' as const, text: '我想卖掉一段...关于美的记忆。每天早上照镜子时我会感到一瞬间的完美，但那感觉很快就消失了。', choices: [
        { text: '你在害怕镜子里的那个人不够好吗？', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2 },
        { text: '鉴定会看到你的真实一面。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '她将手指按在神经链接器上。示波器表面镀着一层银色的光泽，但光泽在接通神经链接的瞬间褪去了大半。' },
    ],
    consequenceA: '后来看到一则整容广告，代言人长得很像她，眼神空洞地望着镜头。',
    consequenceB: '她收回了记忆，说还需要它。你没收一分钱，但她离开时你看到她的面纱掉在门口。',
    consequenceC: '你说没有买不走的记忆。她沉默片刻，将记忆推给你，离开时解下了面纱。',
  },

  'security-lao': {
    id: 'security-lao', name: '老保安', title: '三十年的夜班',
    appearance: '矮个子老人，穿着洗得发白的保安制服，腰带上挂着一大串钥匙——走起路来叮叮当当响。',
    urgency: 35, concealment: 30, defense: 25,
    memory: {
      id: 'mem-security-lao', name: '最后一次巡逻', emotion: 'nostalgia', hiddenEmotion: 'sadness',
      purity: 55, completeness: 75, rarity: 1, basePrice: 150,
      description: '三十年来最后一趟夜间巡逻的记忆，手电筒扫过空无一人的走廊，每一步都像在跟老建筑告别。',
      hiddenTruth: '他不是在告别建筑，而是在告别他的三十岁——三十年前他第一天上班时，有个姑娘在走廊等他。',
      coreStory: '卖掉这段记忆后，他就能安心退休了——或者说，他就能忘记那些等待了。',
      isCorrupted: false, corruptionLevel: 15, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '钥匙碰撞声先于本人抵达。一个矮个老人走了进来，手里还在转着一把铜钥匙。' },
      { speaker: 'customer' as const, text: '我明天就要退休了，想卖掉最后一次巡逻的记忆。三十年了，每晚走同样的路，我觉得够了。', choices: [
        { text: '三十年的记忆一定很厚重。', defenseChange: -5, urgencyChange: 5, priceModifier: 1.1, nextStep: 2 },
        { text: '来看看成色。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他将手指按在神经链接器上。示波器上浮现的波形平静而稳定，像一颗温热的鹅卵石——没有光芒四射，但看着很踏实。' },
    ],
    consequenceA: '一周后的夜晚，你路过他曾经工作的大楼。新保安的钥匙声陌生而清脆。老保安大概已经在南方晒太阳了。',
    consequenceB: '他想了想说还是留着吧，说不定老了能在摇椅上慢慢回想。他临走时送了你一把旧钥匙扣。',
    consequenceC: '你暗示可以联系他的前雇主了解情况。他一句话没说，把记忆推给你，放下钥匙走了。',
  },

  'dj-echo': {
    id: 'dj-echo', name: '回声', title: '失聪的DJ',
    appearance: '年轻女性，脖子上挂着一副坏掉的耳机。手指不停地打着节拍，每个关节都能发出清脆的响声。',
    urgency: 60, concealment: 50, defense: 40,
    memory: {
      id: 'mem-dj-echo', name: '最后一次演出', emotion: 'joy', hiddenEmotion: 'fear',
      purity: 35, completeness: 50, rarity: 3, basePrice: 450,
      description: '地下俱乐部的最后一晚——低音炮震得酒杯里的酒都在跳，她戴着耳机在人群的尖叫中打出完美的drop。',
      hiddenTruth: '她的听力正在逐渐消失。记忆中那些"震耳欲聋的bass"其实已经失真了——这是她最后一次真正听见音乐。',
      coreStory: '卖掉这段记忆后她将彻底忘记音乐是什么感觉。她用这笔钱买了一套助听设备，然后从头开始学听。',
      isCorrupted: true, corruptionLevel: 55, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '店门被推开时带进一阵低音——准确地说，是门口的人在用手机放一首只有低频的歌。' },
      { speaker: 'customer' as const, text: '我快要听不见了。想卖掉最后一次完整演出的记忆——那段bass太美了，美到我现在听什么都觉得是噪音。', choices: [
        { text: '你卖的不只是音乐，是最后还能听见的自己。', defenseChange: -10, urgencyChange: 10, priceModifier: 1.15, nextStep: 2 },
        { text: '音乐人的记忆很特别，来鉴定。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '她将手指按在神经链接器上。示波器上出现有节奏的振动波形——像心跳一样，但频率正在缓慢下降。' },
    ],
    consequenceA: '三个月后你去了一家新开的club，DJ台后面是个戴助听器的女生——她用另一种方式在听音乐。',
    consequenceB: '她说也许卖掉记忆不等于失去音乐。她走时在门口哼了一段旋律，你听出那是她记忆里的节奏。',
    consequenceC: '你威胁要告诉圈内人她是假DJ。她愣了几秒，然后大笑起来——她说她从来不在乎别人怎么说，然后在你的柜台上狠狠敲了一段beat。',
  },

  'mute-child': {
    id: 'mute-child', name: '小默', title: '不会说话的孩子',
    appearance: '约莫十岁的小男孩，穿着不合身的旧校服。他一个字都不说，只用手势和写字板与人交流。',
    urgency: 80, concealment: 20, defense: 15,
    memory: {
      id: 'mem-mute-child', name: '妈妈的声音', emotion: 'sadness', hiddenEmotion: 'nostalgia',
      purity: 70, completeness: 85, rarity: 2, basePrice: 250,
      description: '一段关于妈妈的记忆——她的声音在电话那头轻轻哼着摇篮曲，每一个字都像羽毛落在水面上。',
      hiddenTruth: '他的妈妈已经不在了。这段记忆是一通永远不会再打来的电话的录音，他在脑中反复播放了很多年，现在磁带快要碎了。',
      coreStory: '卖记忆不是为了忘记，是为了记住。他想把这段记忆存到更安全的介质上——你的典当行。',
      isCorrupted: true, corruptionLevel: 30, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '一个瘦小的男孩蹲在门口，他不说话，只是用明亮的眼睛看着你，然后举起一块小白板。上面写着：你们这里收记忆吗？' },
      { speaker: 'customer' as const, text: '（他在白板上写道）我想卖妈妈的记忆。她的声音我记得最清楚了，但最近好像越来越模糊。我怕有一天完全记不得了。', choices: [
        { text: '（对着孩子蹲下来）好。我会帮你好好保管。', defenseChange: -10, urgencyChange: 15, priceModifier: 1.0, nextStep: 2 },
        { text: '（看他的写字板）你一个人来的？', defenseChange: 0, urgencyChange: 5, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他小心地伸出手指按在神经链接器上。示波器上浮现的波形非常微弱——像是很远的地方传来的一段断断续续的哼唱声。' },
    ],
    consequenceA: '小男孩每周五放学后都会来你的店门口坐一会儿，在写字板上画一棵树，然后离开。你从来没听他说过一个字。',
    consequenceB: '你把记忆还给了他。他不知道是该失落还是开心，在白板上画了一个很大的问号。你在他面前蹲下来，说你应该留着它。',
    consequenceC: '你用极低的价格收下了这段记忆。小男孩离开时回头看了你一眼，那个眼神让你后背发凉——像是看穿了你。',
  },

  'drunk-doctor': {
    id: 'drunk-doctor', name: '酒徒医生', title: '手术刀的重量',
    appearance: '穿着皱巴巴的白大褂，身上有淡淡的消毒水味。眼镜片有一个角裂开，他用胶布粘着。',
    urgency: 65, concealment: 70, defense: 55,
    memory: {
      id: 'mem-drunk-doctor', name: '最后一场手术', emotion: 'fear', hiddenEmotion: 'guilt',
      purity: 25, completeness: 45, rarity: 3, basePrice: 500,
      description: '深夜急诊手术室的记忆——灯光明亮，护士递上手术刀，他的手指在微微颤抖，但刀落下去的瞬间稳如磐石。',
      hiddenTruth: '手术前半小时他刚喝了半瓶廉价威士忌。不是因为他没办法，是因为不喝就下不了刀——每一次握刀都像在摸死神的手指。',
      coreStory: '他卖了这段记忆试图证明自己是清醒的。但忘记不会让手变稳。',
      isCorrupted: true, corruptionLevel: 70, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '门被推开时带进一股医院的气味——不是药水，是那种铁锈和酒精混合的微苦味道。' },
      { speaker: 'customer' as const, text: '我是个外科医生...至少曾经是。我想卖掉一场手术的记忆。那场手术很...成功。但它缠着我。', choices: [
        { text: '医生卖手术？你是想忘记什么？', defenseChange: -15, urgencyChange: 15, priceModifier: 1.2, nextStep: 2 },
        { text: '先鉴定吧，看看你怎么定义"成功"。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他将手指按在神经链接器上。示波器折射出一种异常的琥珀色波形——是酒的颜色，也是血的颜色。' },
    ],
    consequenceA: '三个月后，市区某医院爆出医生醉酒手术的丑闻。你没去确认是不是他，但每次看到那篇新闻都不由地想起那段琥珀色的记忆。',
    consequenceB: '你拒绝了他。他愣了一下，把白大褂脱下来叠好放在你的柜台上，走了。白大褂口袋里掉出一张罚单和一枚十年的戒酒徽章。',
    consequenceC: '你威胁要向医院举报。他说："你举报吧，我已经没有行医资格了。"但他还是多付了你一笔封口费，用口袋里皱巴巴的纸币。',
  },

  'tattoo-cat': {
    id: 'tattoo-cat', name: '猫刺青', title: '墨水的重量',
    appearance: '全身可见皮肤几乎都被刺青覆盖——从手背蔓延到脖颈。每张图都代表一段她不愿保留的往事。',
    urgency: 50, concealment: 55, defense: 40,
    memory: {
      id: 'mem-tattoo-cat', name: '第一滴墨', emotion: 'fear', hiddenEmotion: 'anger',
      purity: 45, completeness: 60, rarity: 2, basePrice: 300,
      description: '第一次刺青的记忆——针尖划破皮肤的瞬间，血珠混着墨汁渗出来，她咬破了嘴唇但一滴眼泪都没流。',
      hiddenTruth: '那不是因为勇敢。而是因为当时她正用肉体的痛去覆盖另一种更深的痛——她想把一个人的名字从皮下的脂肪里碾碎。',
      coreStory: '每一张刺青都是一个人。卖掉第一张之后，身体上的其他图案就失去了归属感。',
      isCorrupted: true, corruptionLevel: 40, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '门只是动了一下——进来的女人动作很轻，但皮肤上密麻的墨色图案使她像一座行走的壁画。' },
      { speaker: 'customer' as const, text: '我想卖掉第一次纹身的记忆。它像一根刺扎在别的地方——不是皮肤，是这儿。', choices: [
        { text: '你可以卖记忆，但刺青还是会在。', defenseChange: -10, urgencyChange: 5, priceModifier: 1.1, nextStep: 2 },
        { text: '先鉴定里面的情感含量。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '她将手指按在神经链接器上——手背上的刺青和墨水颜色一样深。示波器上浮现的波形带着一种尖锐的刺痛感。' },
    ],
    consequenceA: '后来在街头偶然遇见她，她向你展示了一条新的空白皮肤——在右前臂上，一根细长的银钩正在上方轻摇。',
    consequenceB: '她说不用你的钱。她需要知道这段记忆值得被收购——意味着它值得被遗忘。你看到她的眼神平静了很多。',
    consequenceC: '你用极低的价格收走了她的记忆。一周后你听说她在隔壁街上开了自己的纹身店，招牌上写着你店的名字，后面跟着一个问号。',
  },

  'hacker-zero': {
    id: 'hacker-zero', name: '零', title: '无痕的信使',
    appearance: '连帽衫遮住大半张脸，只露出下巴和微微上扬的嘴唇。手上戴着无指手套，指尖焦黄——更多的是电路板灼伤而非香烟。',
    urgency: 70, concealment: 95, defense: 70,
    memory: {
      id: 'mem-hacker-zero', name: '终极密码', emotion: 'joy', hiddenEmotion: 'fear',
      purity: 25, completeness: 40, rarity: 4, basePrice: 700,
      description: '一段破解终极防火墙的记忆——屏幕上数据像瀑布一样滚动，手指在键盘上飞舞，最后一道防线在0.3秒内崩溃。',
      hiddenTruth: '这不是黑客攻击。她在逃跑——从自己创建的系统里，把自己的痕迹抹去。成功的那一瞬意味着她彻底消失在了网络世界里。',
      coreStory: '她卖掉记忆不是为了钱，是为了忘记自己的数字指纹。这样一来，即使她自己想找回原来的身份，也无法做到。',
      isCorrupted: true, corruptionLevel: 65, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '防弹玻璃门被推开，一个戴着连帽衫的人影在门口扫了一眼店内的监控摄像头。' },
      { speaker: 'customer' as const, text: '我有一段破解密码的记忆需要从我的意识中安全移除，你不需要知道它是什么密码，你只需要确定它能被处理。', choices: [
        { text: '我的鉴定器能看到你不想让人看到的东西。', defenseChange: -10, urgencyChange: 15, priceModifier: 1.15, nextStep: 2 },
        { text: '成交，我不管密码的内容。', defenseChange: 0, urgencyChange: -10, priceModifier: 0.9, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '她将手指按在神经链接器上。示波器没有发出光芒——它在吸收周围的信号，像一个正在读写的数据黑洞。' },
    ],
    consequenceA: '三天后，你的店铺的所有电子系统被清除了任何与这段记忆相关的记录——包括鉴定器的缓存、监控视频、甚至你的个人笔记。她真的消失了。',
    consequenceB: '你拒绝了她。她沉默地看着你，然后说:"你刚刚通过了我设计的信任测试。"她从胸前的口袋掏出一枚硬币递给你:"如果哪天你需要逃跑，它就是你的。硬币上是一个0。"',
    consequenceC: '你威胁要公开这段破解记忆的数据。她微微一笑:"请便。24小时内你将无法证明这些数据曾经存在——系统已经在上传记忆时启动了自毁程序。当你说完时她就不见了。',
  },

  'baker-liu': {
    id: 'baker-liu', name: '刘面点师', title: '甜的重量',
    appearance: '胖胖的中年女性，手指沾着面粉，围裙口袋露出一截擀面杖。笑起来很暖，但眼睛从来不跟着嘴巴一起笑。',
    urgency: 40, concealment: 35, defense: 30,
    memory: {
      id: 'mem-baker-liu', name: '第一炉面包', emotion: 'joy', hiddenEmotion: 'nostalgia',
      purity: 60, completeness: 70, rarity: 1, basePrice: 180,
      description: '清晨三点烤出生命中第一炉全麦面包的记忆——蒸汽在窗玻璃上凝结成水珠，面包从烤箱筛出的金黄色光把她的脸照得软软的。',
      hiddenTruth: '第一个闻到那炉面包的不是她，而是她夭折的女儿——她一直相信女儿在面包房的气味里跟着她生活了很多年。',
      coreStory: '她想卖掉记忆是因为最近那炉面包的香味变了——她不再能闻到女儿了。',
      isCorrupted: false, corruptionLevel: 20, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '这次来的顾客是先闻到的——整个店里突然充满了新出炉面包的气息温暖而甘甜。' },
      { speaker: 'customer' as const, text: '我想卖掉第一炉面包的记忆。那是二十八年前的事了...最近我烤面包的时候，闻到的味道好像不太对了。', choices: [
        { text: '你卖的不是面包的香气，对吧？', defenseChange: -10, urgencyChange: 5, priceModifier: 1.1, nextStep: 2 },
        { text: '二十八年前的记忆成色一定很好。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '她将手指轻轻按在神经链接器上。示波器上浮现的波形带着一种柔软的暖意——还真像刚烤的面包，表面尚有余温。' },
    ],
    consequenceA: '几周后，你路过她的面包店买了一根法棍——酥皮一咬就碎，闻起来是普通的面包香气，非常完美，非常标准。',
    consequenceB: '她收了回来，说也许她需要接受气味的变化。她请你吃了一个牛角包。在嘴里化开时你好像闻到了她女儿。',
    consequenceC: '你说可以用声望去抵押收购记忆，她答应后你反手向她店铺索要分红的权利。她第二天就在门口贴上了"停业转让"。',
  },

  'clockmaker': {
    id: 'clockmaker', name: '老钟表匠', title: '时间的齿轮',
    appearance: '瘦得像一根发条，手指却异常沉稳。戴着一只没有镜片的金丝眼镜架，口袋里不断传出细微的滴答声。',
    urgency: 45, concealment: 60, defense: 50,
    memory: {
      id: 'mem-clockmaker', name: '完美的计时', emotion: 'nostalgia', hiddenEmotion: 'guilt',
      purity: 55, completeness: 80, rarity: 2, basePrice: 280,
      description: '二十分钟内修复了一台中断二十年的古董钟——零件在指尖滑入正确的位置，当那二十年前就该响起的钟声重新敲响时，他哭了。',
      hiddenTruth: '他不是在修钟。他修的是出走的妻子二十年前最后一次转动的发条——她曾说他是个停不下来的人。钟停了二十年后他决定把它修好，但修好之后它将继续停着。',
      coreStory: '卖掉记忆后他就能把钟彻底停掉，不用再听那永远快进二十分钟的指针。',
      isCorrupted: true, corruptionLevel: 42, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '店内的挂钟突然齐刷刷地停了一秒——然后恢复了滴答声。一个拿着工具箱的老人站在门口。' },
      { speaker: 'customer' as const, text: '我想卖掉一分钟的记忆——不是我的一分钟，是我救回来的一个钟的百年来第一分钟。它很重。', choices: [
        { text: '一分钟能装多少东西？', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2 },
        { text: '鉴定不会让时间快进的。', defenseChange: 0, urgencyChange: 0, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他缓缓打开一个小锡盒，里面躺着一根秒针——精细到你能看到秒针顶端有一个极小的名字。他将手指按在神经链接器上，波形像钟摆一样精确地来回摆动。' },
    ],
    consequenceA: '他的钟表店第二天照常开了，但橱窗里最大的那台古董钟停了——然后停在同一天的上午。你路过时发现他正在拆卸另一台钟。',
    consequenceB: '他说修好了这钟已经是值得的，不用卖。你把他的锡盒合上，推了一个下午的报废时钟——你帮他换掉了老化的发条。',
    consequenceC: '你用极低的价钱收走了那枚秒针，当夜你店里的所有钟表都停在了同一个时间——她的名字烫在老钟表匠的妻子出生年份上。',
  },

  'taxi-qian': {
    id: 'taxi-qian', name: '钱司机', title: '城市的地下河',
    appearance: '穿着深蓝色制服外套，胸口的出租标志已经磨损了一半。帽子压得很低，挡风玻璃反光在他脸上留下一道长长的痕迹。',
    urgency: 65, concealment: 45, defense: 35,
    memory: {
      id: 'mem-taxi-qian', name: '午夜最后一趟', emotion: 'fear', hiddenEmotion: 'sadness',
      purity: 40, completeness: 55, rarity: 2, basePrice: 220,
      description: '下着大雨的夜晚最后一趟客单的记忆——后座坐着一个从头到尾没说话的女人。开到目的地时他从后视镜发现后座没人。但坐垫是湿的。',
      hiddenTruth: '那不是鬼故事。那个女人曾在大雨的河边拦下了他的车，失魂落魄——他不知道她走后去了哪儿，但第二天报纸的河岸版面上有一块下雨夜被发现的遗书。',
      coreStory: '他只知道女人的姓氏，卖了记忆他就不用记起后座上那摊雨的重量。',
      isCorrupted: true, corruptionLevel: 50, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '车停在店门口——引擎没熄火。一个出租车司机推门进来时外面正下着小雨，你看到他制服的右肩全是雨水。' },
      { speaker: 'customer' as const, text: '我想卖掉一个乘客的记忆——就一个乘客，就一趟跑完，后座是空的但我开了全程，一直在说话你知道吗？', choices: [
        { text: '她在说什么？', defenseChange: -15, urgencyChange: 10, priceModifier: 1.2, nextStep: 2 },
        { text: '开车跑过的路别留着不开的车窗。', defenseChange: 0, urgencyChange: 5, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他将手指按在神经链接器上。示波器上的波形像泡在雨水中的街灯，光映在墙上晃得不正常。' },
    ],
    consequenceA: '几天夜里你路过他以前常停车的街角，看到出租车队换了一代新车——他的车已经不在那里了。',
    consequenceB: '他想了想说不用卖了，也许记住一个人没那么可怕。走之前给了你一把印着出租车公司标志的旧打火机。',
    consequenceC: '你威胁把行车记录译成公共档案。他把记忆往你的柜台上一放，拿起钥匙慢慢转身——走出去坐进驾驶座，发动了，雨刮器来回刷了一整夜。',
  },

  'shadow-yao': {
    id: 'shadow-yao', name: '影子药贩', title: '黑暗中的药方',
    appearance: '脸色苍白，瞳孔不自然地对光反应缓慢——长期使用某种地下神经抑制剂的副作用。衣服口袋鼓鼓囊囊，但装着的是空药瓶。',
    urgency: 85, concealment: 80, defense: 50,
    memory: {
      id: 'mem-shadow-yao', name: '遗忘的药方', emotion: 'fear', hiddenEmotion: 'guilt',
      purity: 20, completeness: 35, rarity: 3, basePrice: 550,
      description: '一段地下药房的记忆——刺鼻的甲醇气味，黑暗中递过来的药瓶，标签上写着"永远忘掉一切"——他当场打开，倒出三粒在手心，然后犹豫了。',
      hiddenTruth: '他是来卖犹豫的，不是来卖空瓶。他没有吃药，是因为一旦忘记他曾经卖过的那些药，就再也没有理由停止制药。',
      coreStory: '卖掉这一段犹豫，他就能毫无愧意地继续制售神经抑制剂——成为真正的药贩而不是罪人。',
      isCorrupted: true, corruptionLevel: 80, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '浓重的化学甜味比本人先进门。一个人影猫着腰走了进来，口袋里的空药瓶碰撞出奇怪的音调。' },
      { speaker: 'customer' as const, text: '我有一段犹豫的记忆——不是一瓶药，而是一瞬间的...算了我怎么说你也不会懂。我要把它卖掉，让它停。', choices: [
        { text: '犹豫比药值钱，你知道的。', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2 },
        { text: '我鉴定后会知道你的犹豫是为了什么。', defenseChange: 0, urgencyChange: 10, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他放在柜台上的是一个空的棕色药瓶——里面没有药片，但你听到它嗡鸣了一声，像是里面有活的液体。' },
    ],
    consequenceA: '几周后报纸上报道了一处非法地下药房被端，主谋在逃。你认出警方公布的药瓶——和柜台上那个一模一样。他没有犹豫就跑了。',
    consequenceB: '你把空药瓶推回给他。他低头看着瓶子，"也许我还需要这个犹豫。"他把瓶子放回口袋，推门出去时口袋不再响了。',
    consequenceC: '你威胁向警方匿名举报——不仅举报他，还举报他的顾客名单。他在你写举报电话时把一整沓钞票放在你面前，然后抓起药瓶冲进雨里。',
  },

  'copier-aji': {
    id: 'copier-aji', name: '阿纪', title: '复印机前的幽灵',
    appearance: '带着名片到处分发但一张也发不完的年轻人，内袋里揣着一台便携复印机——每次复印都会发出很轻的咔哒声。',
    urgency: 55, concealment: 40, defense: 30,
    memory: {
      id: 'mem-copier-aji', name: '四千次复印', emotion: 'sadness', hiddenEmotion: 'fear',
      purity: 50, completeness: 65, rarity: 2, basePrice: 260,
      description: '第一天上班的记忆——复印机咔哒咔哒的声音像子弹，他被指派在大办公室角落复印四千份文件。灯从头顶照下来，文件越复印越重。',
      hiddenTruth: '他复印的不是文件——是另一个人的合同。他偷偷记下了上面的数字，下载成一个梦，每晚在呼吸的咔哒声中重新尝试谈判。',
      coreStory: '卖掉这段记忆他就能彻底放弃——不去想那笔他永远拿不回来的提成。',
      isCorrupted: false, corruptionLevel: 30, daysStored: 0,
    },
    dialog: [
      { speaker: 'narrator' as const, text: '咔哒——咔哒——你听见复印机的声音从门口传来。一个年轻人站在那，还在不停地按口袋里的便携复印机。' },
      { speaker: 'customer' as const, text: '这是一段关于复印的记忆——一共四千次复印，四千张纸。我想卖掉它们，这样我就能停掉复印机的声音。', choices: [
        { text: '四千份文件里有没有你自己的？', defenseChange: -10, urgencyChange: 10, priceModifier: 1.1, nextStep: 2 },
        { text: '记忆就是不断复印的声音也挺烦的。', defenseChange: 0, urgencyChange: 5, priceModifier: 1.0, nextStep: 2 },
      ]},
      { speaker: 'narrator' as const, text: '他从复印机里抽出一张刚复印出来的卡片——纸上复印着一段记忆波形的影像，墨还没干。' },
    ],
    consequenceA: '几天后你的店门口出现了一份未署名的复印文件——上面列着他从那些合同里偷看到的全部数字，排成一个笑脸。',
    consequenceB: '他把复印件收回去，说也许复印机的声音有一天会自己停。临走时把便携复印机留在你柜台上——里面还有最后一张空白纸。',
    consequenceC: '你威胁说他的公司会知道那些复印下的数字。他低头把口袋里的名片全掏出来给了你——"这些都给你，你打电话的时候帮我发一下吧。"',
  },
}

export function getCustomerById(id: string): Customer | undefined {
  return customers[id]
}

export function getAllCustomerIds(): string[] {
  return Object.keys(customers)
}
