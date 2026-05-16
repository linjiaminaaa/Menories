import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'
import type { TradeAction } from '@/store/game-store'

export function TradingScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const appraisalCompleteness = useGameStore((s) => s.appraisalCompleteness)
  const negotiatedPrice = useGameStore((s) => s.negotiatedPrice)
  const revealedTruth = useGameStore((s) => s.revealedTruth)
  const executeTrade = useGameStore((s) => s.executeTrade)
  const money = useGameStore((s) => s.money)

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]
  const hiddenEmotionColor = EMOTION_COLORS[currentCustomer.memory.hiddenEmotion]

  const canAfford = money >= negotiatedPrice

  const actions: { key: TradeAction; label: string; description: string; color: string; risk: string }[] = [
    {
      key: 'buy',
      label: '收购记忆',
      description: `以 ${negotiatedPrice} 元收购这段记忆，加入你的库存`,
      color: '#00ff88',
      risk: canAfford ? '低风险' : '资金不足',
    },
    {
      key: 'refuse',
      label: '拒绝交易',
      description: '拒绝这笔交易，让顾客带着记忆离开',
      color: '#8888aa',
      risk: '无风险',
    },
    {
      key: 'blackmail',
      label: '敲诈顾客',
      description: `利用记忆中的秘密威胁顾客，索要 ${Math.round(negotiatedPrice * 0.5)} 元封口费`,
      color: '#ff3344',
      risk: '高风险 · 声望-15',
    },
    {
      key: 'tamper',
      label: '篡改记忆',
      description: '修剪痛苦片段后转卖，赚取差价',
      color: '#ffaa00',
      risk: '中风险 · 声望-5',
    },
  ]

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay">
      {/* 顶部标题 */}
      <View className="p-4 pb-2">
        <Text className="block text-sm font-semibold text-[#ff0066] neon-text" style={{ '--neon-color': '#ff0066' } as React.CSSProperties}>
          交易谈判
        </Text>
      </View>

      {/* 记忆鉴定结果 */}
      <View className="px-4 mb-4">
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-3">
              <View className="flex flex-row items-center gap-2">
                <View
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${emotionColor}20`, border: `2px solid ${emotionColor}` }}
                >
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: emotionColor }} />
                </View>
                <View>
                  <Text className="block text-sm font-semibold text-[#e0e0e0]">{currentCustomer.memory.name}</Text>
                  <Text className="block text-xs text-[#8888aa]">来自 {currentCustomer.name}</Text>
                </View>
              </View>
              <Badge style={{ backgroundColor: `${emotionColor}20`, color: emotionColor, borderColor: `${emotionColor}40` }}>
                {EMOTION_LABELS[currentCustomer.memory.emotion]}
              </Badge>
            </View>

            {/* 鉴定数据 */}
            <View className="flex flex-col gap-2 mb-3">
              <View className="flex flex-row items-center gap-2">
                <Text className="block text-xs text-[#8888aa] w-14">纯度</Text>
                <View className="flex-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${appraisalPurity}%`, backgroundColor: emotionColor }}
                  />
                </View>
                <Text className="block text-xs font-mono text-[#8888aa]">{Math.round(appraisalPurity)}%</Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Text className="block text-xs text-[#8888aa] w-14">完整度</Text>
                <View className="flex-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${appraisalCompleteness}%`,
                      backgroundColor: appraisalCompleteness > 60 ? '#00ff88' : '#ffaa00',
                    }}
                  />
                </View>
                <Text className="block text-xs font-mono text-[#8888aa]">{Math.round(appraisalCompleteness)}%</Text>
              </View>
            </View>

            {/* 隐藏情感提示 */}
            {revealedTruth && (
              <View className="p-3 rounded-lg border mb-2" style={{ borderColor: 'rgba(255,0,102,0.3)', backgroundColor: 'rgba(255,0,102,0.05)' }}>
                <View className="flex flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full" style={{ backgroundColor: hiddenEmotionColor }} />
                  <Text className="block text-xs text-[#ff0066]">
                    检测到深层情感: {EMOTION_LABELS[currentCustomer.memory.hiddenEmotion]}
                  </Text>
                </View>
              </View>
            )}

            {/* 估价 */}
            <View className="flex flex-row items-center justify-between pt-3 border-t border-[#2a2a40]">
              <Text className="block text-xs text-[#8888aa]">系统估价</Text>
              <Text className="block text-lg font-mono text-[#00ff88]">{negotiatedPrice} 元</Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 顾客状态 */}
      <View className="px-4 mb-4">
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-3">
            <Text className="block text-xs text-[#8888aa] mb-2">顾客心理状态</Text>
            <View className="flex flex-row gap-3">
              <View className="flex-1">
                <View className="flex flex-row items-center justify-between mb-1">
                  <Text className="block text-xs text-[#ffaa00]">急迫度</Text>
                  <Text className="block text-xs font-mono text-[#ffaa00]">{currentCustomer.urgency}%</Text>
                </View>
                <View className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${currentCustomer.urgency}%`,
                      backgroundColor: currentCustomer.urgency > 60 ? '#ff3344' : '#ffaa00',
                    }}
                  />
                </View>
              </View>
              <View className="flex-1">
                <View className="flex flex-row items-center justify-between mb-1">
                  <Text className="block text-xs text-[#00f0ff]">心理防线</Text>
                  <Text className="block text-xs font-mono text-[#00f0ff]">{currentCustomer.defense}%</Text>
                </View>
                <View className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${currentCustomer.defense}%`,
                      backgroundColor: currentCustomer.defense > 60 ? '#00f0ff' : '#8888aa',
                    }}
                  />
                </View>
              </View>
            </View>
            {currentCustomer.urgency > 60 && (
              <Text className="block text-xs text-[#ffaa00] mt-2">
                这位顾客似乎非常急切...也许可以压低价格？
              </Text>
            )}
            {currentCustomer.defense < 30 && (
              <Text className="block text-xs text-[#00f0ff] mt-2">
                顾客的心理防线已接近崩溃，可以获取更多信息。
              </Text>
            )}
          </CardContent>
        </Card>
      </View>

      {/* 交易操作 */}
      <View className="px-4 safe-bottom-lg">
        <Text className="block text-sm text-[#8888aa] mb-3 font-semibold">选择你的行动</Text>
        <View className="flex flex-col gap-3">
          {actions.map((action) => (
            <View
              key={action.key}
              className="trade-action-card"
              onClick={() => action.key !== 'buy' || canAfford ? executeTrade(action.key) : undefined}
            >
              <View className="flex flex-row items-center justify-between mb-2">
                <View className="flex flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: action.color }} />
                  <Text className="block text-base font-semibold text-[#e0e0e0]">{action.label}</Text>
                </View>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: action.key === 'blackmail' ? '#ff334466' : action.key === 'tamper' ? '#ffaa0066' : '#2a2a40',
                    color: action.key === 'blackmail' ? '#ff3344' : action.key === 'tamper' ? '#ffaa00' : '#8888aa',
                  }}
                  className="text-xs"
                >
                  {action.risk}
                </Badge>
              </View>
              <Text className="block text-sm text-[#8888aa]">{action.description}</Text>
              {action.key === 'buy' && !canAfford && (
                <Text className="block text-sm text-[#ff3344] mt-2 font-semibold">资金不足！</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
