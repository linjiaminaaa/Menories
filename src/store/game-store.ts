import { create } from 'zustand'
import { getCustomerById } from './game-data'

// ===== 类型定义 =====
export type EmotionType = 'sadness' | 'anger' | 'joy' | 'fear' | 'nostalgia' | 'guilt'
export type GamePhase = 'hub' | 'dialog' | 'appraisal' | 'trading' | 'result' | 'storage'
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

export interface Impurity {
  id: string
  x: number
  y: number
  size: number
  removed: boolean
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

  // 鉴定状态
  frequencyTarget: number
  frequencyCurrent: number
  impurities: Impurity[]
  appraisalPurity: number
  appraisalCompleteness: number
  impurityMisses: number

  // 交易状态
  negotiatedPrice: number
  finalAction: TradeAction | null

  // 库存
  inventory: InventoryMemory[]

  // 日志
  log: LogEntry[]

  // 已完成的顾客
  completedCustomerIds: string[]
  dayConsequences: string[]

  // 顾客队列
  customerQueue: string[]
  queueIndex: number

  // Actions
  setPhase: (phase: GamePhase) => void
  addLog: (text: string, type: LogType) => void
  startNextCustomer: () => void
  advanceDialog: (choiceIndex?: number) => void
  setFrequencyCurrent: (value: number) => void
  removeImpurity: (id: string) => void
  missImpurity: () => void
  completeAppraisal: () => void
  setNegotiatedPrice: (price: number) => void
  executeTrade: (action: TradeAction) => void
  addToInventory: (memory: Memory) => void
  removeFromInventory: (id: string) => void
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

  frequencyTarget: 50,
  frequencyCurrent: 0,
  impurities: [],
  appraisalPurity: 0,
  appraisalCompleteness: 100,
  impurityMisses: 0,

  negotiatedPrice: 0,
  finalAction: null,

  inventory: [],

  log: [],
  completedCustomerIds: [],
  dayConsequences: [],

  customerQueue: ['lao-chen', 'xiao-yu', 'boss-zhou', 'a-guang', 'sister-lin'],
  queueIndex: 0,

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
    const { customerQueue, queueIndex } = state
    if (queueIndex >= customerQueue.length) {
      set({ phase: 'hub' })
      get().addLog('今天没有更多顾客了。', 'info')
      return
    }
    const customerId = customerQueue[queueIndex]
    const customer = getCustomerById(customerId)
    if (!customer) return

    // Generate impurities for appraisal
    const impurityCount = 3 + Math.floor(customer.memory.corruptionLevel / 25)
    const impurities: Impurity[] = []
    for (let i = 0; i < impurityCount; i++) {
      impurities.push({
        id: `imp-${i}`,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        size: 8 + Math.random() * 12,
        removed: false,
      })
    }

    set({
      phase: 'dialog',
      currentCustomer: customer,
      dialogIndex: 0,
      revealedTruth: false,
      frequencyTarget: 30 + Math.random() * 40,
      frequencyCurrent: 0,
      impurities,
      appraisalPurity: customer.memory.purity,
      appraisalCompleteness: 100,
      impurityMisses: 0,
      negotiatedPrice: 0,
      finalAction: null,
      queueIndex: queueIndex + 1,
    })
    get().addLog(`${customer.name}走进了典当行...`, 'info')
  },

  advanceDialog: (choiceIndex) => {
    const state = get()
    const { currentCustomer, dialogIndex } = state
    if (!currentCustomer) return

    const currentStep = currentCustomer.dialog[dialogIndex]
    if (!currentStep) {
      // Dialog ended, move to appraisal
      set({ phase: 'appraisal' })
      get().addLog('开始鉴定记忆...', 'info')
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

  setFrequencyCurrent: (value) => {
    const state = get()
    set({ frequencyCurrent: value })
    // Calculate purity based on frequency match
    const diff = Math.abs(value - state.frequencyTarget)
    const matchScore = Math.max(0, 100 - diff * 2)
    const basePurity = state.currentCustomer?.memory.purity ?? 50
    const newPurity = Math.round(basePurity * (0.5 + matchScore / 200))
    set({ appraisalPurity: newPurity })

    if (diff < 5 && !state.revealedTruth) {
      set({ revealedTruth: true })
      get().addLog('频谱完美匹配！检测到隐藏的情感波动...', 'success')
    }
  },

  removeImpurity: (id) => {
    const state = get()
    const newImpurities = state.impurities.map((imp) =>
      imp.id === id ? { ...imp, removed: true } : imp
    )
    const removedCount = newImpurities.filter((i) => i.removed).length
    const totalCount = newImpurities.length
    const corruptionReduction = (removedCount / totalCount) * state.currentCustomer!.memory.corruptionLevel

    set({
      impurities: newImpurities,
      appraisalPurity: Math.min(100, state.currentCustomer!.memory.purity + corruptionReduction * 0.5),
    })
    get().addLog('清除了一处精神污染', 'success')
  },

  missImpurity: () => {
    const state = get()
    const newMisses = state.impurityMisses + 1
    const completenessLoss = newMisses * 5
    set({
      impurityMisses: newMisses,
      appraisalCompleteness: Math.max(20, 100 - completenessLoss),
    })
    get().addLog('误触记忆本体，完整度下降！', 'danger')
  },

  completeAppraisal: () => {
    const state = get()
    const purity = state.appraisalPurity
    const completeness = state.appraisalCompleteness
    const rarity = state.currentCustomer?.memory.rarity ?? 1
    const marketRate = 0.8 + Math.random() * 0.4
    const basePrice = state.currentCustomer?.memory.basePrice ?? 100
    const price = Math.round((purity / 100) * (completeness / 100) * rarity * basePrice * marketRate)

    set({
      phase: 'trading',
      negotiatedPrice: price,
    })
    get().addLog(`鉴定完成 — 纯度: ${Math.round(purity)}%, 完整度: ${Math.round(completeness)}%`, 'info')
    get().addLog(`估价: ${price} 元`, 'info')
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

  removeFromInventory: (id) => {
    set((state) => ({
      inventory: state.inventory.filter((m) => m.id !== id),
    }))
    get().addLog('出售了一段记忆', 'info')
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

    // Check for events
    const events: string[] = []
    if (state.totalNegativeEnergy > 60) {
      events.push('店铺内的负面能量过强...灯光突然熄灭了几秒钟。')
    }
    if (state.reputation < 20) {
      events.push('你的声誉跌至谷底，街坊们开始对你指指点点。')
    }

    set({
      phase: 'hub',
      day: state.day + 1,
      inventory: agedInventory,
      dayConsequences: events,
      totalNegativeEnergy: Math.max(0, state.totalNegativeEnergy - 10),
      currentCustomer: null,
    })

    get().addLog(`—— 第 ${state.day} 天结束 ——`, 'info')
  },

  startNewDay: () => {
    set({
      dayConsequences: [],
    })
    get().addLog(`第 ${get().day} 天开始了`, 'info')
  },

  showStorage: () => set({ phase: 'storage' }),

  returnToHub: () => set({ phase: 'hub' }),
}))
