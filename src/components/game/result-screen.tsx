import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'

export function ResultScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const finalAction = useGameStore((s) => s.finalAction)
  const dayConsequences = useGameStore((s) => s.dayConsequences)
  const returnToHub = useGameStore((s) => s.returnToHub)

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]

  const actionLabels: Record<string, string> = {
    buy: '收购了记忆',
    refuse: '拒绝了交易',
    blackmail: '敲诈了顾客',
    tamper: '篡改了记忆',
  }

  const actionColors: Record<string, string> = {
    buy: '#00ff88',
    refuse: '#8888aa',
    blackmail: '#ff3344',
    tamper: '#ffaa00',
  }

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay flex flex-col">
      <View className="flex-1 p-4">
        {/* 结果标题 */}
        <View className="flex items-center justify-center mb-6 mt-4">
          <View className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: `${actionColors[finalAction ?? 'buy']}15`, border: `2px solid ${actionColors[finalAction ?? 'buy']}40` }}
          >
            <Text className="block text-2xl font-mono" style={{ color: actionColors[finalAction ?? 'buy'] }}>
              {finalAction === 'buy' ? '✓' : finalAction === 'refuse' ? '—' : finalAction === 'blackmail' ? '!' : '~'}
            </Text>
          </View>
          <Text className="block text-lg font-bold text-[#e0e0e0]">交易完成</Text>
          <Text className="block text-sm mt-1" style={{ color: actionColors[finalAction ?? 'buy'] }}>
            你{actionLabels[finalAction ?? 'buy']}
          </Text>
        </View>

        {/* 交易详情 */}
        <Card className="bg-[#141420] border-[#2a2a40] mb-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-center gap-2 mb-3">
              <View className="w-6 h-6 rounded-full" style={{ backgroundColor: `${emotionColor}30`, border: `1px solid ${emotionColor}` }}>
                <View className="w-full h-full flex items-center justify-center">
                  <View className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColor }} />
                </View>
              </View>
              <Text className="block text-sm font-semibold text-[#e0e0e0]">
                {currentCustomer.name} — {currentCustomer.memory.name}
              </Text>
            </View>

            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-xs text-[#8888aa]">表层情感</Text>
                <Text className="block text-xs" style={{ color: emotionColor }}>
                  {EMOTION_LABELS[currentCustomer.memory.emotion]}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-xs text-[#8888aa]">深层情感</Text>
                <Text className="block text-xs" style={{ color: EMOTION_COLORS[currentCustomer.memory.hiddenEmotion] }}>
                  {EMOTION_LABELS[currentCustomer.memory.hiddenEmotion]}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 后果 */}
        {dayConsequences.length > 0 && (
          <Card className="bg-[#1a1a2e] border-[#ffaa00]/30 mb-4 fade-in-up">
            <CardContent className="p-4">
              <Text className="block text-xs text-[#ffaa00] font-semibold mb-3">命运的回响</Text>
              {dayConsequences.map((con, i) => (
                <View key={i} className="mb-2 last:mb-0">
                  <Text className="block text-sm text-[#e0e0e0] leading-6">{con}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 核心故事 */}
        <Card className="bg-[#141420] border-[#7b2ff7]/30 mb-4">
          <CardContent className="p-4">
            <Text className="block text-xs text-[#7b2ff7] font-semibold mb-2">记忆核心</Text>
            <Text className="block text-sm text-[#8888aa] leading-6 italic">
              {currentCustomer.memory.coreStory}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 内容区底部留白 */}
      <View className="content-bottom-spacing" />

      {/* 返回按钮 */}
      <View className="game-bottom-bar">
        <View
          className="game-primary-btn"
          style={{ backgroundColor: '#00f0ff', color: '#0a0a0f' }}
          onClick={returnToHub}
        >
          <Text style={{ color: '#0a0a0f', fontSize: '16px', fontWeight: 600 }}>回到典当行</Text>
        </View>
      </View>
    </View>
  )
}
