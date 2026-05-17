import { create } from 'zustand'
import { getCustomerById, getAllCustomerIds } from './game-data'

// ===== 类型定义 =====
export type EmotionType = 'sadness' | 'anger' | 'joy' | 'fear' | 'nostalgia' | 'guilt'
export type GamePhase = 'hub' | 'dialog' | 'tuning' | 'purify' | 'trading' | 'result' | 'storage' | 'closing'
export type TradeAction = 'buy' | 'refuse' | 'blackmail' | 'tamper'
export type LogType = 'info' | 'success' | 'warning' | 'danger'

export const EMOTION_COLORS: Record<EmotionType, string> = {
  sadness: '#4488ff',
  anger: '#ff3344',
  joy: '#ffcc00',
  fear: '#44ff88',
  nostalgia: '#cc66ff',
  guilt: '#880044',
}

export const EMOTION_LABELS: Record<EmotionType, string> = {
  sadness: '悲伤',
  anger: '愤怒',
  joy: '快乐',
  fear: '恐惧',
  nostalgia: '怀念',
  guilt: '罪恶',
}

export interface Memory {
  id: string
  name: string
  emotion: EmotionType
  hiddenEmotion: EmotionType
  purity: number
  completeness: number
  rarity: number
  basePrice: number
  description: string
  hiddenTruth: string
  coreStory: string
  isCorrupted: boolean
  corruptionLevel: number
  daysStored: number
}

export interface DialogChoice {
  text: string
  defenseChange: number
  urgencyChange: number
  priceModifier: number
  nextStep: number
  revealInfo?: string
}

export interface DialogStep {
  speaker: 'customer' | 'narrator' | 'system'
  text: string
  choices?: DialogChoice[]
  microExpression?: string
}

export interface Customer {
  id: string
  name: string
  title: string
  appearance: string
  urgency: number
  concealment: number
  defense: number
  memory: Memory
  dialog: DialogStep[]
  consequenceA: string
  consequenceB: string
  consequenceC: string
}

export interface LogEntry {
  id: string
  text: string
  type: LogType
  timestamp: number
}

export interface InventoryMemory extends Memory {
  acquiredDay: number
  slotIndex: number
}

// ===== 游戏状态 =====
interface GameState {
  phase: GamePhase
  day: number
  money: number
  reputation: number
  totalNegativeEnergy: number

  // 当前顾客
  currentCustomer: Customer | null
  dialogIndex: number
  revealedTruth: boolean

  // 鉴定状态 — 脑波调频 (Phase 1)
  tuningTargetFreq: number       // 基准波频率 (0-100)
  tuningTargetAmp: number        // 基准波振幅 (0-100)
  tuningProbeFreq: number        // 探针波频率 (0-100)
  tuningProbeAmp: number         // 探针波振幅 (0-100)
  tuningMatchProgress: number    // 匹配进度 (0-100)
  tuningStableFrames: number     // 稳定帧数 (需达180帧=3秒)
  tuningIsActive: boolean        // 是否已接入
  tuningDifficulty: number       // 基准波漂移幅度 (0-5)
  tuningPhase: number            // 基准波当前相位偏移
  tuningBestProgress: number     // 最佳匹配进度

  // 鉴定状态 — 光影显形 (Phase 2)
  purifyImpurities: Array<{
    id: string
    x: number; y: number         // 位置百分比 (0-100)
    size: number                 // 半径
    health: number               // 当前生命 (0-100)
    maxHealth: number
    type: 'tar' | 'mold'         // 视觉类型
    speed: number                // 向核心移动速度
  }>
  purifyLanternActive: boolean
  purifyLanternX: number
  purifyLanternY: number
  purifyCoreHealth: number       // 核心物体生命 (0-100)
  purifyTotalImpurities: number
  purifyClearedImpurities: number
  purifySceneDesc: string        // 记忆场景描述

  // 鉴定结果
  appraisalPurity: number
  appraisalCompleteness: number

  // 交易状态
  negotiatedPrice: number
  finalAction: TradeAction | null

  // 库存
  inventory: InventoryMemory[]

  // 日志
  log: LogEntry[]

  // 已完成的顾客 & 当日记录
  completedCustomerIds: string[]
  abortedCustomerId: string | null   // 当前中断的顾客（可恢复）
  dayConsequences: string[]

  // 当日顾客队列（由 startNewDay 生成）
  dailyQueue: string[]
  dailyQueueIndex: number

  // Actions
  setPhase: (phase: GamePhase) => void
  addLog: (text: string, type: LogType) => void
  startNextCustomer: () => void
  abortCustomer: () => void
  resumeCustomer: () => void
  dismissCustomer: () => void
  closeShop: () => void
  advanceDialog: (choiceIndex?: number) => void
  // 脑波调频
  initTuning: () => void
  updateTuningKnobs: (freq: number, amp: number) => void
  startTuningConnect: () => void
  stopTuningConnect: () => void
  tickTuning: (deltaMs: number) => void
  completeTuning: () => void
  // 光影显形
  initPurify: () => void
  updateLantern: (x: number, y: number, active: boolean) => void
  tickPurify: (deltaMs: number) => void
  completePurify: () => void
  // 交易
  bargain: () => void
  setNegotiatedPrice: (price: number) => void
  executeTrade: (action: TradeAction) => void
  addToInventory: (memory: Memory) => void
  removeFromInventory: (id: string, sellPrice?: number) => void
  applyFixative: (id: string) => void
  endDay: () => void
  startNewDay: () => void
  showStorage: () => void
  returnToHub: () => void
}

let logIdCounter = 0

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'hub',
  day: 1,
  money: 500,
  reputation: 50,
  totalNegativeEnergy: 0,

  currentCustomer: null,
  dialogIndex: 0,
  revealedTruth: false,

  tuningTargetFreq: 50,
  tuningTargetAmp: 50,
  tuningProbeFreq: 25,
  tuningProbeAmp: 25,
  tuningMatchProgress: 0,
  tuningStableFrames: 0,
  tuningIsActive: false,
  tuningDifficulty: 2,
  tuningPhase: 0,
  tuningBestProgress: 0,

  purifyImpurities: [],
  purifyLanternActive: false,
  purifyLanternX: 50,
  purifyLanternY: 50,
  purifyCoreHealth: 100,
  purifyTotalImpurities: 0,
  purifyClearedImpurities: 0,
  purifySceneDesc: '',

  appraisalPurity: 0,
  appraisalCompleteness: 100,

  negotiatedPrice: 0,
  finalAction: null,

  inventory: [],

  log: [],
  completedCustomerIds: [],
  abortedCustomerId: null,
  dayConsequences: [],

  dailyQueue: [],
  dailyQueueIndex: 0,

  setPhase: (phase) => set({ phase }),

  addLog: (text, type) => {
    const entry: LogEntry = {
      id: `log-${++logIdCounter}`,
      text,
      type,
      timestamp: Date.now(),
    }
    set((state) => ({ log: [...state.log.slice(-49), entry] }))
  },

  startNextCustomer: () => {
    const state = get()
    // 如果有中断的顾客交互，不能开始新顾客（需先恢复或放弃）
    if (state.abortedCustomerId) {
      get().addLog('请先处理中断的顾客交易', 'warning')
      return
    }
    const { dailyQueue, dailyQueueIndex } = state
    if (dailyQueueIndex >= dailyQueue.length) {
      get().addLog('今天没有更多顾客了，请结束营业', 'info')
      return
    }
    const customerId = dailyQueue[dailyQueueIndex]
    const customer = getCustomerById(customerId)
    if (!customer) return

    const corruption = customer.memory.corruptionLevel
    const difficulty = 1 + Math.floor(corruption / 20)
    const targetFreq = 25 + Math.floor(Math.random() * 51)
    const targetAmp = 25 + Math.floor(Math.random() * 51)

    set({
      phase: 'dialog',
      currentCustomer: customer,
      dialogIndex: 0,
      revealedTruth: false,
      tuningTargetFreq: targetFreq,
      tuningTargetAmp: targetAmp,
      tuningProbeFreq: 25,
      tuningProbeAmp: 25,
      tuningMatchProgress: 0,
      tuningStableFrames: 0,
      tuningIsActive: false,
      tuningDifficulty: difficulty,
      tuningPhase: Math.random() * Math.PI * 2,
      tuningBestProgress: 0,
      purifyImpurities: [],
      purifyLanternActive: false,
      purifyLanternX: 50,
      purifyLanternY: 50,
      purifyCoreHealth: 100,
      purifyTotalImpurities: 0,
      purifyClearedImpurities: 0,
      purifySceneDesc: '',
      appraisalPurity: customer.memory.purity,
      appraisalCompleteness: 100,
      negotiatedPrice: 0,
      finalAction: null,
      abortedCustomerId: null,
      dailyQueueIndex: dailyQueueIndex + 1,
    })
    get().addLog(`${customer.name}走进了典当行...`, 'info')
  },

  abortCustomer: () => {
    const state = get()
    if (!state.currentCustomer) return
    set({
      phase: 'hub',
      abortedCustomerId: state.currentCustomer.id,
    })
    get().addLog(`暂时中止了与 ${state.currentCustomer.name} 的交易`, 'warning')
  },

  resumeCustomer: () => {
    const state = get()
    if (!state.abortedCustomerId) return
    const customer = getCustomerById(state.abortedCustomerId)
    if (!customer) return
    // currentCustomer 和所有鉴定状态已在 store 中保留，直接恢复
    set({ phase: 'dialog', abortedCustomerId: null })
    get().addLog(`继续与 ${customer.name} 的对话...`, 'info')
  },

  dismissCustomer: () => {
    const state = get()
    const customerId = state.abortedCustomerId
    if (!customerId) return
    const customer = getCustomerById(customerId)
    set({
      abortedCustomerId: null,
      currentCustomer: null,
      completedCustomerIds: [...state.completedCustomerIds, customerId],
    })
    get().addLog(`${customer?.name ?? '顾客'}离开了典当行`, 'info')
  },

  closeShop: () => {
    set({ phase: 'closing' })
    get().addLog('打烊了，开始整理今天的收获...', 'info')
  },

  advanceDialog: (choiceIndex) => {
    const state = get()
    const { currentCustomer, dialogIndex } = state
    if (!currentCustomer) return

    const currentStep = currentCustomer.dialog[dialogIndex]
    if (!currentStep) {
      // Dialog ended, move to brainwave tuning
      set({ phase: 'tuning' })
      get().addLog('神经链接已建立，开始脑波调频...', 'info')
      return
    }

    if (choiceIndex !== undefined && currentStep.choices) {
      const choice = currentStep.choices[choiceIndex]
      if (choice) {
        const customer = { ...state.currentCustomer! }
        customer.defense = Math.max(0, customer.defense + choice.defenseChange)
        customer.urgency = Math.max(0, Math.min(100, customer.urgency + choice.urgencyChange))

        if (choice.revealInfo) {
          get().addLog(choice.revealInfo, 'warning')
        }

        set({
          currentCustomer: customer,
          dialogIndex: choice.nextStep,
        })
      }
    } else {
      set({ dialogIndex: dialogIndex + 1 })
    }
  },

  // ===== 脑波调频 =====
  initTuning: () => {
    set({
      tuningProbeFreq: 25,
      tuningProbeAmp: 25,
      tuningMatchProgress: 0,
      tuningStableFrames: 0,
      tuningIsActive: false,
      tuningBestProgress: 0,
      tuningPhase: Math.random() * Math.PI * 2,
    })
  },

  updateTuningKnobs: (freq, amp) => {
    set({ tuningProbeFreq: Math.max(0, Math.min(100, freq)), tuningProbeAmp: Math.max(0, Math.min(100, amp)) })
  },

  startTuningConnect: () => set({ tuningIsActive: true }),
  stopTuningConnect: () => set({ tuningIsActive: false, tuningMatchProgress: 0, tuningStableFrames: 0 }),

  tickTuning: (deltaMs) => {
    const state = get()
    if (!state.tuningIsActive) return

    // 基准波随时间轻微漂移（模拟呼吸感）
    const drift = state.tuningDifficulty * 0.3
    const newPhase = state.tuningPhase + deltaMs * 0.001 * (0.5 + state.tuningDifficulty * 0.15)
    const driftFreq = Math.sin(newPhase * 1.7) * drift
    const driftAmp = Math.cos(newPhase * 1.3) * drift
    const effectiveTargetFreq = state.tuningTargetFreq + driftFreq
    const effectiveTargetAmp = state.tuningTargetAmp + driftAmp

    // 计算匹配度
    const freqDiff = Math.abs(state.tuningProbeFreq - effectiveTargetFreq)
    const ampDiff = Math.abs(state.tuningProbeAmp - effectiveTargetAmp)
    const freqMatch = Math.max(0, 100 - freqDiff * 2.5)
    const ampMatch = Math.max(0, 100 - ampDiff * 2.5)
    const newProgress = Math.round((freqMatch + ampMatch) / 2)

    const best = Math.max(state.tuningBestProgress, newProgress)
    const stableFrames = newProgress >= 90 ? state.tuningStableFrames + 1 : 0

    set({
      tuningMatchProgress: newProgress,
      tuningStableFrames: stableFrames,
      tuningPhase: newPhase,
      tuningBestProgress: best,
    })
  },

  completeTuning: () => {
    const state = get()
    const tuningScore = state.tuningBestProgress
    const purityBonus = Math.round(tuningScore * 0.25)
    const newPurity = Math.min(100, state.appraisalPurity + purityBonus)

    // 生成净化阶段的杂质（基于记忆腐化程度）
    const corruption = state.currentCustomer?.memory.corruptionLevel ?? 50
    const impurityCount = 2 + Math.floor(corruption / 20)
    const impurities: GameState['purifyImpurities'] = []
    const types: Array<'tar' | 'mold'> = ['tar', 'mold']
    for (let i = 0; i < impurityCount; i++) {
      impurities.push({
        id: `imp-${i}`,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        size: 8 + Math.random() * 10,
        health: 100,
        maxHealth: 100,
        type: types[Math.floor(Math.random() * types.length)],
        speed: 0.3 + Math.random() * 0.7,
      })
    }

    set({
      phase: 'purify',
      appraisalPurity: newPurity,
      purifyImpurities: impurities,
      purifyCoreHealth: 100,
      purifyTotalImpurities: impurityCount,
      purifyClearedImpurities: 0,
      purifyLanternActive: false,
      purifyLanternX: 50,
      purifyLanternY: 50,
      purifySceneDesc: state.currentCustomer?.memory.description ?? '',
    })
    get().addLog(`调频完成！匹配度 ${tuningScore}%，纯度 +${purityBonus}%`, 'success')
    get().addLog(`检测到 ${impurityCount} 处记忆杂质，启动光影净化...`, 'info')
  },

  // ===== 光影显形 =====
  initPurify: () => {},

  updateLantern: (x, y, active) => {
    set({ purifyLanternX: x, purifyLanternY: y, purifyLanternActive: active })
  },

  tickPurify: (deltaMs) => {
    const state = get()
    if (state.phase !== 'purify') return
    const impurities = state.purifyImpurities.map((imp) => ({ ...imp }))
    let coreHealth = state.purifyCoreHealth
    const dt = deltaMs / 1000

    let newCleared = 0
    for (const imp of impurities) {
      if (imp.health <= 0) continue

      // 检查是否在灯笼范围内
      if (state.purifyLanternActive) {
        const dx = imp.x - state.purifyLanternX
        const dy = imp.y - state.purifyLanternY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const lanternRadius = 22
        if (dist < lanternRadius) {
          // 灼烧：持续扣血
          imp.health = Math.max(0, imp.health - 55 * dt)
          if (imp.health <= 0) newCleared++
        } else {
          // 回血
          imp.health = Math.min(imp.maxHealth, imp.health + 35 * dt)
        }
      } else {
        // 灯笼未激活，缓慢回血
        imp.health = Math.min(imp.maxHealth, imp.health + 15 * dt)
      }

      // 存活杂质向核心物体缓慢移动
      if (imp.health > 0) {
        const coreX = 50, coreY = 50
        const dx = coreX - imp.x
        const dy = coreY - imp.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 5) {
          imp.x += (dx / dist) * imp.speed * dt
          imp.y += (dy / dist) * imp.speed * dt
        }
        // 到达核心则造成伤害
        if (dist < 8) {
          coreHealth = Math.max(0, coreHealth - 8 * dt)
        }
      }
    }

    const totalCleared = state.purifyClearedImpurities + newCleared
    const allCleared = totalCleared >= state.purifyTotalImpurities

    set({
      purifyImpurities: impurities,
      purifyCoreHealth: coreHealth,
      purifyClearedImpurities: totalCleared,
    })

    if (allCleared && !state.revealedTruth) {
      set({ revealedTruth: true })
      get().addLog('全部杂质已净化！隐藏情感已揭示', 'success')
    }
  },

  completePurify: () => {
    const state = get()
    const purity = state.appraisalPurity
    const purifyRatio = state.purifyTotalImpurities > 0
      ? state.purifyClearedImpurities / state.purifyTotalImpurities
      : 1
    const coreBonus = state.purifyCoreHealth / 100
    const completeness = Math.round(
      Math.min(100, state.appraisalCompleteness * (0.4 + purifyRatio * 0.4 + coreBonus * 0.2))
    )
    const rarity = state.currentCustomer?.memory.rarity ?? 1
    const marketRate = 0.8 + Math.random() * 0.4
    const basePrice = state.currentCustomer?.memory.basePrice ?? 100
    const price = Math.round((purity / 100) * (completeness / 100) * rarity * basePrice * marketRate)

    const defenseReduction = Math.round(purifyRatio * 30 + coreBonus * 15)
    const newDefense = Math.max(5, (state.currentCustomer?.defense ?? 50) - defenseReduction)
    const updatedCustomer = state.currentCustomer
      ? { ...state.currentCustomer, defense: newDefense }
      : null

    set({ phase: 'trading', currentCustomer: updatedCustomer, negotiatedPrice: price, appraisalCompleteness: completeness })
    get().addLog(`鉴定完成 — 纯度: ${Math.round(purity)}%, 完整度: ${Math.round(completeness)}%`, 'info')
    get().addLog(`估价: ${price} 元`, 'info')
    get().addLog(`顾客防线削弱至 ${newDefense}%，可以尝试压低收购价`, 'warning')
  },

  bargain: () => {
    const state = get()
    if (!state.currentCustomer) return
    const defense = state.currentCustomer.defense
    // 讨价成功率 = 100 - 防线值（防线越低越容易）
    const successRate = Math.max(10, 100 - defense)
    const roll = Math.random() * 100

    if (roll < successRate) {
      // 成功：压低收购价 20-35%
      const discount = 0.65 + Math.random() * 0.15 // 65%-80% of original = 20-35% off
      const newPrice = Math.round(state.negotiatedPrice * discount)
      set({ negotiatedPrice: Math.max(1, newPrice) })
      get().addLog(`讨价成功！收购价压至 ${newPrice} 元 (降幅 ${Math.round((1 - discount) * 100)}%)`, 'success')
    } else {
      // 失败：顾客反感，价格回升 10-15%
      const penalty = 1.1 + Math.random() * 0.05
      const newPrice = Math.round(state.negotiatedPrice * penalty)
      const upsetCustomer = state.currentCustomer
        ? { ...state.currentCustomer, urgency: Math.min(100, state.currentCustomer.urgency + 15) }
        : null
      set({ negotiatedPrice: Math.max(1, newPrice), currentCustomer: upsetCustomer })
      get().addLog(`讨价失败！顾客抬价至 ${newPrice} 元，态度变差`, 'danger')
    }
  },

  setNegotiatedPrice: (price) => set({ negotiatedPrice: price }),

  executeTrade: (action) => {
    const state = get()
    const customer = state.currentCustomer
    if (!customer) return

    let moneyChange = 0
    let reputationChange = 0
    let consequence = ''

    switch (action) {
      case 'buy': {
        const price = state.negotiatedPrice
        moneyChange = -price
        reputationChange = 5
        consequence = customer.consequenceA
        get().addToInventory({
          ...customer.memory,
          purity: state.appraisalPurity,
          completeness: state.appraisalCompleteness,
        })
        get().addLog(`以 ${price} 元收购了记忆「${customer.memory.name}」`, 'success')
        break
      }
      case 'refuse': {
        reputationChange = -2
        consequence = customer.consequenceB
        get().addLog(`拒绝了 ${customer.name} 的交易`, 'info')
        break
      }
      case 'blackmail': {
        const blackmailAmount = Math.round(state.negotiatedPrice * 0.5)
        moneyChange = blackmailAmount
        reputationChange = -15
        consequence = customer.consequenceC
        get().addLog(`敲诈了 ${customer.name}，获得 ${blackmailAmount} 元`, 'warning')
        break
      }
      case 'tamper': {
        moneyChange = Math.round(state.negotiatedPrice * 0.3)
        reputationChange = -5
        consequence = customer.consequenceA
        get().addLog(`篡改了记忆并出售，获得 ${Math.round(state.negotiatedPrice * 0.3)} 元`, 'warning')
        break
      }
    }

    set((s) => ({
      phase: 'result',
      finalAction: action,
      money: s.money + moneyChange,
      reputation: Math.max(0, Math.min(100, s.reputation + reputationChange)),
      totalNegativeEnergy: s.totalNegativeEnergy + (customer.memory.hiddenEmotion === 'guilt' || customer.memory.hiddenEmotion === 'anger' ? 20 : 5),
      completedCustomerIds: [...s.completedCustomerIds, customer.id],
      dayConsequences: [...s.dayConsequences, consequence],
      currentCustomer: { ...customer, defense: customer.defense, urgency: customer.urgency },
    }))

    get().addLog(consequence, 'info')
  },

  addToInventory: (memory) => {
    const invMemory: InventoryMemory = {
      ...memory,
      acquiredDay: get().day,
      slotIndex: get().inventory.length,
    }
    set((state) => ({ inventory: [...state.inventory, invMemory] }))
  },

  removeFromInventory: (id, sellPrice) => {
    const mem = get().inventory.find((m) => m.id === id)
    set((state) => ({
      inventory: state.inventory.filter((m) => m.id !== id),
      ...(sellPrice !== undefined ? { money: state.money + sellPrice } : {}),
    }))
    if (sellPrice !== undefined && mem) {
      get().addLog(`出售了「${mem.name}」，获得 ${sellPrice} 元`, 'success')
    }
  },

  applyFixative: (id) => {
    const state = get()
    if (state.money < 50) {
      get().addLog('定影剂费用不足（需要50元）', 'danger')
      return
    }
    set((s) => ({
      money: s.money - 50,
      inventory: s.inventory.map((m) =>
        m.id === id ? { ...m, corruptionLevel: Math.max(0, m.corruptionLevel - 30), daysStored: 0 } : m
      ),
    }))
    get().addLog('使用定影剂，记忆腐化延缓', 'success')
  },

  endDay: () => {
    const state = get()
    // Age memories
    const agedInventory = state.inventory.map((m) => ({
      ...m,
      daysStored: m.daysStored + 1,
      corruptionLevel: Math.min(100, m.corruptionLevel + 5),
      purity: Math.max(0, m.purity - m.daysStored * 2),
    }))

    // Check for overnight events
    const events: string[] = []
    if (state.totalNegativeEnergy > 60) {
      events.push('店铺内的负面能量过强...灯光突然熄灭了几秒钟。')
    }
    if (state.reputation < 20) {
      events.push('你的声誉跌至谷底，街坊们开始对你指指点点。')
    }

    set((s) => ({
      day: s.day + 1,
      inventory: agedInventory,
      dayConsequences: [...s.dayConsequences, ...events],
      totalNegativeEnergy: Math.max(0, s.totalNegativeEnergy - 10),
      currentCustomer: null,
      abortedCustomerId: null,
      completedCustomerIds: [],
      dailyQueue: [],
      dailyQueueIndex: 0,
    }))

    get().addLog(`—— 第 ${state.day} 天结束 ——`, 'info')
  },

  startNewDay: () => {
    const state = get()
    const allIds = getAllCustomerIds()
    const mainIds = ['lao-chen', 'xiao-yu', 'boss-zhou', 'a-guang', 'sister-lin']
    const sideIds = allIds.filter((id) => !mainIds.includes(id))

    // Pick random side customers (1-3)
    const sideCount = 1 + Math.floor(Math.random() * 3)
    const shuffled = [...sideIds].sort(() => Math.random() - 0.5)
    const selectedSide = shuffled.slice(0, sideCount)

    // Add main customer if their story day matches
    const storyDayMap: Record<string, number> = {
      'lao-chen': 1, 'xiao-yu': 2, 'boss-zhou': 3, 'a-guang': 4, 'sister-lin': 5,
    }
    const todayMain: string[] = []
    for (const [id, storyDay] of Object.entries(storyDayMap)) {
      if (state.day === storyDay && allIds.includes(id)) {
        todayMain.push(id)
      }
    }

    // Interleave: main first, then side
    const finalQueue: string[] = [...todayMain]
    for (const sid of selectedSide) {
      // Insert side customers at random positions to mix things up
      const pos = Math.floor(Math.random() * (finalQueue.length + 1))
      finalQueue.splice(pos, 0, sid)
    }

    set({
      phase: 'hub',
      dayConsequences: [],
      dailyQueue: finalQueue,
      dailyQueueIndex: 0,
    })
    get().addLog(`第 ${state.day} 天开始了，今天有 ${finalQueue.length} 位顾客`, 'info')
  },

  showStorage: () => set({ phase: 'storage' }),

  returnToHub: () => set({ phase: 'hub' }),
}))
