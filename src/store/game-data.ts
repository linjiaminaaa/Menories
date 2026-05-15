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
        text: '老陈把记忆球放在柜台上。球体发出柔和的紫色光芒，但仔细看，光芒中夹杂着暗红色的丝线...',
      },
    ],
    consequenceA: '几天后，你在新闻上看到：一位老人用汇来的钱试图联系女儿，但对方拒收了。钱被退回，老人独自坐在公园长椅上发呆。',
    consequenceB: '你拒绝了交易。老陈沉默了很久，收起记忆球离开了。你不知道他后来去了哪里，但那双颤抖的手让你至今难忘。',
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
        text: '小雨将记忆球放在柜台上。球体散发着温暖的金黄色光芒，但光芒的边缘像水一样不断流淌变形，核心似乎有什么东西在挣扎...',
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
        text: '周老板将记忆球放在柜台上。球体闪烁着喜庆的金红色光芒，但光芒深处隐约可见一些暗影在游走——那些不该出现在庆功记忆里的东西...',
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
        text: '阿光小心翼翼地放下记忆球。球体绽放出绚烂的金色光芒，像是黎明前的曙光。但光芒的核心，有一团暗色的阴影——那是另一张脸的轮廓...',
      },
    ],
    consequenceA: '一个月后，阿光的新画展开幕了——评价是"灵气全无"。失去了那段记忆的他，再也找不回创作的激情。而那幅"杰作"的真正创作者，在墓地里无人知晓。',
    consequenceB: '你拒绝了交易。阿光沉默地收起记忆球离开了。后来你在一本艺术杂志上看到他的专访，他说："我最近在画一些关于赎罪的东西。"',
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
      hiddenTruth: '这是一段伪造的记忆。真实的情况是：林姐在值班时犯了一个致命的用药错误，导致患者死亡。她无法承受这个事实，在心理防御机制的作用下，将记忆篡改为"拯救成功"。记忆球里的"监护仪跳动声"实际上是仪器的报警声。',
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
        text: '林姐将记忆球轻轻放在柜台上。球体散发出温暖的金黄色光芒，但光芒在某个频率下会突然变成冰冷的蓝色——像监护仪报警的颜色。空气中隐约能闻到消毒水的气味...',
      },
    ],
    consequenceA: '两周后，你在报纸的社会版看到：一名前护士在卖掉记忆后向医院自首，承认了三年前的一起医疗事故。文章说她"终于选择了面对真相"。',
    consequenceB: '你拒绝了交易。林姐沉默良久，然后轻轻说："也许我还不准备好放手。"她收起记忆球离开了。你不确定她是否真的准备好了。',
    consequenceC: '你威胁要向医疗委员会举报。林姐当场瘫坐在地上，反复说着"我不是故意的"。第二天你得知她去了警局自首。你做了一件"正确"的事，但代价是一个人的余生。',
  },
}

export function getCustomerById(id: string): Customer | undefined {
  return customers[id]
}

export function getAllCustomerIds(): string[] {
  return Object.keys(customers)
}
