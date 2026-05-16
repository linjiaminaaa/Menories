import { useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore } from '@/store/game-store'
import { getCustomerById } from '@/store/game-data'

export function HubScreen() {
  const initRef = useRef(false)
  const day = useGameStore((s) => s.day)
  const money = useGameStore((s) => s.money)
  const reputation = useGameStore((s) => s.reputation)
  const totalNegative = useGameStore((s) => s.totalNegativeEnergy)
  const inventory = useGameStore((s) => s.inventory)
  const dayConsequences = useGameStore((s) => s.dayConsequences)
  const dailyQueue = useGameStore((s) => s.dailyQueue)
  const dailyQueueIndex = useGameStore((s) => s.dailyQueueIndex)
  const abortedCustomerId = useGameStore((s) => s.abortedCustomerId)
  const completedCustomerIds = useGameStore((s) => s.completedCustomerIds)
  const startNextCustomer = useGameStore((s) => s.startNextCustomer)
  const resumeCustomer = useGameStore((s) => s.resumeCustomer)
  const dismissCustomer = useGameStore((s) => s.dismissCustomer)
  const closeShop = useGameStore((s) => s.closeShop)
  const showStorage = useGameStore((s) => s.showStorage)
  const startNewDay = useGameStore((s) => s.startNewDay)

  // Auto-initialize daily queue on first load
  useEffect(() => {
    if (!initRef.current && dailyQueue.length === 0) {
      initRef.current = true
      startNewDay()
    }
  }, [dailyQueue.length, startNewDay])

  const hasMoreCustomers = dailyQueueIndex < dailyQueue.length
  const remainingCount = dailyQueue.length - dailyQueueIndex
  const todayDone = dailyQueue.length > 0 && !hasMoreCustomers
  const abortedCustomer = abortedCustomerId ? getCustomerById(abortedCustomerId) : null

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay vignette">
      {/* 顶部状态栏 */}
      <View className="p-4 pb-2">
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="block text-xs text-[#444466] font-mono">MEMORY PAWNSHOP</Text>
          <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa] text-xs">
            第 {day} 天
          </Badge>
        </View>

        <View className="flex flex-row gap-2 mb-3">
          <View className="flex-1 bg-[#141420] rounded-lg p-3 border border-[#2a2a40]">
            <Text className="block text-xs text-[#8888aa] mb-1">资金</Text>
            <Text className="block text-base font-mono text-[#00ff88]">{money} 元</Text>
          </View>
          <View className="flex-1 bg-[#141420] rounded-lg p-3 border border-[#2a2a40]">
            <Text className="block text-xs text-[#8888aa] mb-1">声望</Text>
            <Text className="block text-base font-mono text-[#00f0ff]">{reputation}</Text>
          </View>
          <View className="flex-1 bg-[#141420] rounded-lg p-3 border border-[#2a2a40]">
            <Text className="block text-xs text-[#8888aa] mb-1">库存</Text>
            <Text className="block text-base font-mono text-[#cc66ff]">{inventory.length}</Text>
          </View>
        </View>

        {/* 负面能量条 */}
        <View className="mb-3">
          <View className="flex flex-row items-center justify-between mb-1">
            <Text className="block text-xs text-[#8888aa]">负面能量</Text>
            <Text className="block text-xs font-mono text-[#ff3344]">{totalNegative}/100</Text>
          </View>
          <View className="h-2 bg-[#141420] rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${totalNegative}%`,
                backgroundColor: totalNegative > 60 ? '#ff3344' : totalNegative > 30 ? '#ffaa00' : '#444466',
                transition: 'width 0.5s ease',
              }}
            />
          </View>
        </View>
      </View>

      {/* 主场景区域 - 典当行柜台 */}
      <View className="px-4 flex-1">
        <Card className="bg-[#141420] border-[#2a2a40] mb-4">
          <CardContent className="p-4">
            {/* 场景描述 */}
            <View className="flex flex-row items-center gap-2 mb-3">
              <View className="w-2 h-2 rounded-full bg-[#ffaa00] breathe" />
              <Text className="block text-sm text-[#8888aa]">
                {remainingCount > 0
                  ? `柜台上的台灯发出昏黄的光，门外还有 ${remainingCount} 位顾客在等待`
                  : todayDone
                  ? '忙碌的一天结束了，是时候打烊了'
                  : '柜台上的台灯发出昏黄的光，静候下一位顾客的光临'}
              </Text>
            </View>

            {/* 柜台物品 */}
            <View className="flex flex-row gap-3 mb-3">
              <View className="flex-1 bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a2e]">
                <Text className="block text-xs text-[#444466] mb-1">黄铜天平</Text>
                <Text className="block text-xs text-[#8888aa]">{completedCustomerIds.length} 笔交易</Text>
              </View>
              <View className="flex-1 bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a2e]">
                <Text className="block text-xs text-[#444466] mb-1">玻璃罐架</Text>
                <Text className="block text-xs text-[#8888aa]">{inventory.length} 瓶记忆</Text>
              </View>
              <View className="flex-1 bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a2e]">
                <Text className="block text-xs text-[#444466] mb-1">电子日历</Text>
                <Text className="block text-xs text-[#8888aa]">Day {day}</Text>
              </View>
            </View>

            {/* 天气/氛围 */}
            <View className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a2e]">
              <Text className="block text-xs text-[#444466]">
                {day <= 2
                  ? '窗外细雨绵绵，霓虹灯在积水中投下模糊的倒影。'
                  : day <= 4
                  ? '雨停了，但天空依旧灰蒙蒙的。远处传来若有若无的电流声。'
                  : '一阵冷风从门缝灌入，老式灯泡忽明忽暗...'}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 日后果报 */}
        {dayConsequences.length > 0 && (
          <Card className="bg-[#1a1a2e] border-[#ffaa00]/30 mb-4 fade-in-up">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#ffaa00] mb-2 font-semibold">今日余波</Text>
              {dayConsequences.map((con, i) => (
                <Text key={i} className="block text-xs text-[#8888aa] mb-1">
                  {con}
                </Text>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 中断的顾客 */}
        {abortedCustomer && (
          <Card className="bg-[#ffaa00]/10 border-[#ffaa00]/30 mb-4 fade-in-up">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#ffaa00] mb-2 font-semibold">
                {abortedCustomer.name} 还在柜台前等待...
              </Text>
              <Text className="block text-xs text-[#8888aa]">
                交易已中止，你可以继续处理或请其离开。
              </Text>
            </CardContent>
          </Card>
        )}

        {/* 灵异事件提示 */}
        {totalNegative > 60 && (
          <Card className="bg-[#ff3344]/5 border-[#ff3344]/30 mb-4">
            <CardContent className="p-3">
              <View className="flex flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-[#ff3344] breathe" />
                <Text className="block text-xs text-[#ff3344]">店铺内阴气弥漫，货架上的玻璃罐发出不安的嗡鸣...</Text>
              </View>
            </CardContent>
          </Card>
        )}
      </View>

      {/* 内容区底部留白 */}
      <View className="content-bottom-spacing" />

      {/* 底部操作区 */}
      <View className="game-bottom-bar">
        {/* 主操作：有中断顾客时显示恢复按钮 */}
        {abortedCustomer ? (
          <View
            className="game-primary-btn"
            style={{ backgroundColor: '#ffaa00', color: '#0a0a0f' }}
            onClick={resumeCustomer}
          >
            <Text style={{ color: '#0a0a0f', fontSize: '16px', fontWeight: 600 }}>继续 {abortedCustomer.name} 的交易</Text>
          </View>
        ) : hasMoreCustomers ? (
          <View
            className="game-primary-btn"
            style={{ backgroundColor: '#00f0ff', color: '#0a0a0f' }}
            onClick={startNextCustomer}
          >
            <Text style={{ color: '#0a0a0f', fontSize: '16px', fontWeight: 600 }}>
              下一位顾客 ({remainingCount}位等待)
            </Text>
          </View>
        ) : todayDone ? (
          <View
            className="game-primary-btn"
            style={{ backgroundColor: '#7b2ff7', color: '#fff' }}
            onClick={closeShop}
          >
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>结束营业</Text>
          </View>
        ) : (
          <View className="bg-[#141420] rounded-lg p-4 border border-[#2a2a40] text-center">
            <Text className="block text-sm text-[#8888aa]">等待顾客...</Text>
            <Text className="block text-xs text-[#444466] mt-1">今日暂无顾客</Text>
          </View>
        )}

        <View className="bottom-bar-row">
          <View className="game-secondary-btn" onClick={showStorage}>
            <Text style={{ color: '#8888aa', fontSize: '14px' }}>存储柜</Text>
          </View>
          {abortedCustomer ? (
            <View className="game-secondary-btn" style={{ borderColor: '#ff334466' }} onClick={dismissCustomer}>
              <Text style={{ color: '#ff3344', fontSize: '14px' }}>赶走 {abortedCustomer.name}</Text>
            </View>
          ) : hasMoreCustomers ? (
            <View className="game-secondary-btn" onClick={closeShop}>
              <Text style={{ color: '#8888aa', fontSize: '14px' }}>结束营业</Text>
            </View>
          ) : (
            <View className="game-secondary-btn" onClick={closeShop}>
              <Text style={{ color: '#8888aa', fontSize: '14px' }}>打烊休息</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
