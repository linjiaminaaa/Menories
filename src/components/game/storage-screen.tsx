import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'
import type { InventoryMemory } from '@/store/game-store'

interface StorageScreenProps {
  onSellMemory: (id: string) => void
  onApplyFixative: (id: string) => void
  onClose: () => void
}

export function StorageScreen({ onSellMemory, onApplyFixative, onClose }: StorageScreenProps) {
  const inventory = useGameStore((s) => s.inventory)
  const money = useGameStore((s) => s.money)
  const totalNegative = useGameStore((s) => s.totalNegativeEnergy)

  // 检查属性克制
  const getConflictWarning = (mem: InventoryMemory, index: number): string | null => {
    const prev = inventory[index - 1]
    const next = inventory[index + 1]
    const conflictingPairs: Record<string, string> = {
      anger: 'nostalgia',
      nostalgia: 'anger',
      joy: 'fear',
      fear: 'joy',
    }
    if (prev && conflictingPairs[mem.emotion] === prev.emotion) {
      return `与「${prev.name}」情绪冲突！`
    }
    if (next && conflictingPairs[mem.emotion] === next.emotion) {
      return `与「${next.name}」情绪冲突！`
    }
    return null
  }

  return (
    <View className="min-h-screen bg-[#0a0a0f] p-4 fade-in">
      {/* Header */}
      <View className="flex flex-row items-center justify-between mb-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="block text-lg font-bold text-[#00f0ff]">记忆存储柜</Text>
          <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa]">
            {inventory.length} 段记忆
          </Badge>
        </View>
      </View>

      {/* 环境状态 */}
      <View className="flex flex-row gap-3 mb-4">
        <View className="flex-1 bg-[#141420] rounded-lg p-3 border border-[#2a2a40]">
          <Text className="block text-xs text-[#8888aa] mb-1">资金</Text>
          <Text className="block text-lg font-mono text-[#00ff88]">{money} 元</Text>
        </View>
        <View className="flex-1 bg-[#141420] rounded-lg p-3 border border-[#2a2a40]">
          <Text className="block text-xs text-[#8888aa] mb-1">负面能量</Text>
          <Text className="block text-lg font-mono text-[#ff3344]">{totalNegative}/100</Text>
        </View>
      </View>

      {totalNegative > 60 && (
        <View className="bg-[#ff3344]/10 border border-[#ff3344]/30 rounded-lg p-3 mb-4">
          <Text className="block text-xs text-[#ff3344]">警告：店铺负面能量过高，可能触发灵异事件！</Text>
        </View>
      )}

      {/* 记忆列表 */}
      {inventory.length === 0 ? (
        <View className="flex items-center justify-center h-64">
          <Text className="block text-[#444466] text-center">
            {'存储柜空空如也\n等待第一位顾客上门吧'}
          </Text>
        </View>
      ) : (
        <View className="flex flex-col gap-3 content-bottom-spacing">
          {inventory.map((mem, index) => {
            const conflict = getConflictWarning(mem, index)
            const emotionColor = EMOTION_COLORS[mem.emotion]
            const sellPrice = Math.round(mem.basePrice * (mem.purity / 100) * (mem.completeness / 100) * mem.rarity * 0.6)

            return (
              <Card key={mem.id} className="bg-[#1a1a2e] border-[#2a2a40] memory-card">
                <CardContent className="p-3">
                  {/* 标题行 */}
                  <View className="flex flex-row items-center justify-between mb-2">
                    <View className="flex flex-row items-center gap-2">
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: emotionColor, boxShadow: `0 0 8px ${emotionColor}` }}
                      />
                      <Text className="block text-sm font-semibold text-[#e0e0e0]">{mem.name}</Text>
                    </View>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: emotionColor, color: emotionColor }}
                    >
                      {EMOTION_LABELS[mem.emotion]}
                    </Badge>
                  </View>

                  {/* 属性条 */}
                  <View className="flex flex-col gap-1 mb-2">
                    <View className="flex flex-row items-center gap-2">
                      <Text className="block text-xs text-[#8888aa] w-14">纯度</Text>
                      <View className="flex-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full spectrum-bar"
                          style={{
                            width: `${mem.purity}%`,
                            backgroundColor: emotionColor,
                          }}
                        />
                      </View>
                      <Text className="block text-xs font-mono text-[#8888aa]">{Math.round(mem.purity)}%</Text>
                    </View>
                    <View className="flex flex-row items-center gap-2">
                      <Text className="block text-xs text-[#8888aa] w-14">完整度</Text>
                      <View className="flex-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full spectrum-bar"
                          style={{
                            width: `${mem.completeness}%`,
                            backgroundColor: mem.completeness > 60 ? '#00ff88' : '#ffaa00',
                          }}
                        />
                      </View>
                      <Text className="block text-xs font-mono text-[#8888aa]">{Math.round(mem.completeness)}%</Text>
                    </View>
                    <View className="flex flex-row items-center gap-2">
                      <Text className="block text-xs text-[#8888aa] w-14">腐化</Text>
                      <View className="flex-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full spectrum-bar"
                          style={{
                            width: `${mem.corruptionLevel}%`,
                            backgroundColor: mem.corruptionLevel > 50 ? '#ff3344' : '#8888aa',
                          }}
                        />
                      </View>
                      <Text className="block text-xs font-mono text-[#8888aa]">{Math.round(mem.corruptionLevel)}%</Text>
                    </View>
                  </View>

                  {/* 冲突警告 */}
                  {conflict && (
                    <View className="bg-[#ff3344]/10 rounded p-2 mb-2">
                      <Text className="block text-xs text-[#ff3344]">{conflict}</Text>
                    </View>
                  )}

                  {/* 腐化警告 */}
                  {mem.corruptionLevel > 50 && (
                    <View className="bg-[#ffaa00]/10 rounded p-2 mb-2">
                      <Text className="block text-xs text-[#ffaa00]">记忆正在褪色，建议尽快使用定影剂或出售</Text>
                    </View>
                  )}

                  {/* 操作按钮 */}
                  <View className="flex flex-row gap-3 mt-1">
                    <View
                      className="game-secondary-btn"
                      style={{ borderColor: '#00f0ff66', flex: 1 }}
                      onClick={() => onApplyFixative(mem.id)}
                    >
                      <Text style={{ color: '#00f0ff', fontSize: '13px', fontWeight: 500 }}>定影剂 (50元)</Text>
                    </View>
                    <View
                      className="game-secondary-btn"
                      style={{ borderColor: '#00ff8866', flex: 1 }}
                      onClick={() => onSellMemory(mem.id)}
                    >
                      <Text style={{ color: '#00ff88', fontSize: '13px', fontWeight: 500 }}>出售 ({sellPrice}元)</Text>
                    </View>
                  </View>

                  {/* 存储天数 */}
                  <Text className="block text-xs text-[#444466] mt-2">
                    已存储 {mem.daysStored} 天 | 稀有度: {'★'.repeat(mem.rarity)}
                  </Text>
                </CardContent>
              </Card>
            )
          })}
        </View>
      )}

      {/* 底部返回按钮 */}
      <View className="game-bottom-bar">
        <View className="bottom-bar-row">
          <View
            className="game-secondary-btn"
            style={{ justifyContent: 'center', flex: 1, borderColor: '#2a2a40' }}
            onClick={onClose}
          >
            <Text style={{ color: '#8888aa', fontSize: '15px', fontWeight: 500 }}>返回</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
