import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore } from '@/store/game-store'

export function HubScreen() {
  const day = useGameStore((s) => s.day)
  const money = useGameStore((s) => s.money)
  const reputation = useGameStore((s) => s.reputation)
  const totalNegative = useGameStore((s) => s.totalNegativeEnergy)
  const inventory = useGameStore((s) => s.inventory)
  const dayConsequences = useGameStore((s) => s.dayConsequences)
  const completedCustomerIds = useGameStore((s) => s.completedCustomerIds)
  const customerQueue = useGameStore((s) => s.customerQueue)
  const queueIndex = useGameStore((s) => s.queueIndex)
  const startNextCustomer = useGameStore((s) => s.startNextCustomer)
  const showStorage = useGameStore((s) => s.showStorage)
  const endDay = useGameStore((s) => s.endDay)
  const startNewDay = useGameStore((s) => s.startNewDay)

  const hasMoreCustomers = queueIndex < customerQueue.length
  const allDone = completedCustomerIds.length >= customerQueue.length

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
              <Text className="block text-sm text-[#8888aa]">柜台上的台灯发出昏黄的光</Text>
            </View>

            {/* 柜台物品 */}
            <View className="flex flex-row gap-3 mb-3">
              <View className="flex-1 bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a2e]">
                <Text className="block text-xs text-[#444466] mb-1">黄铜天平</Text>
                <Text className="block text-xs text-[#8888aa]">静待记忆...</Text>
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

      {/* 底部操作区 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 16px',
          paddingBottom: '24px',
          backgroundColor: '#0a0a0f',
          borderTop: '1px solid #1a1a2e',
          zIndex: 100,
        }}
      >
        {hasMoreCustomers ? (
          <Button
            className="w-full bg-[#00f0ff] hover:bg-[#00c8d4] text-[#0a0a0f] font-semibold"
            onClick={startNextCustomer}
          >
            <Text className="text-[#0a0a0f] font-semibold">下一位顾客</Text>
          </Button>
        ) : allDone ? (
          <View className="bg-[#141420] rounded-lg p-3 border border-[#2a2a40] text-center">
            <Text className="block text-sm text-[#8888aa]">所有顾客都已光临</Text>
            <Text className="block text-xs text-[#444466] mt-1">故事已完结</Text>
          </View>
        ) : null}

        <View className="flex flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 border-[#2a2a40] text-[#8888aa]"
            onClick={showStorage}
          >
            <Text className="text-[#8888aa] text-xs">存储柜</Text>
          </Button>
          {hasMoreCustomers && (
            <Button
              variant="outline"
              className="flex-1 border-[#2a2a40] text-[#8888aa]"
              onClick={() => {
                endDay()
                startNewDay()
              }}
            >
              <Text className="text-[#8888aa] text-xs">结束今天</Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}
