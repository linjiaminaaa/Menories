import { useState, useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { useGameStore } from '@/store/game-store'

export function ClosingScreen() {
  const day = useGameStore((s) => s.day)
  const money = useGameStore((s) => s.money)
  const reputation = useGameStore((s) => s.reputation)
  const inventory = useGameStore((s) => s.inventory)
  const dayConsequences = useGameStore((s) => s.dayConsequences)
  const completedCustomerIds = useGameStore((s) => s.completedCustomerIds)
  const endDay = useGameStore((s) => s.endDay)
  const startNewDay = useGameStore((s) => s.startNewDay)
  const showStorage = useGameStore((s) => s.showStorage)

  const [countdown, setCountdown] = useState(6)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasAdvanced = useRef(false)

  useEffect(() => {
    if (!autoAdvance) return
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          if (!hasAdvanced.current) {
            hasAdvanced.current = true
            endDay()
            startNewDay()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoAdvance, endDay, startNewDay])

  const handleSkip = () => {
    if (hasAdvanced.current) return
    hasAdvanced.current = true
    setAutoAdvance(false)
    if (timerRef.current) clearInterval(timerRef.current)
    endDay()
    startNewDay()
  }

  const corruptedCount = inventory.filter((m) => m.corruptionLevel > 50).length

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay vignette flex flex-col">
      <View className="flex-1 p-4">
        {/* 标题 */}
        <View className="flex items-center justify-center mb-6 mt-4">
          <Text className="block text-lg font-bold text-[#e0e0e0]">打烊时分</Text>
          <Text className="block text-sm text-[#8888aa] mt-1">第 {day} 天 · 营业结束</Text>
        </View>

        {/* 今日总结 */}
        <Card className="bg-[#141420] border-[#2a2a40] mb-4">
          <CardContent className="p-4">
            <Text className="block text-xs text-[#ffaa00] font-semibold mb-3">今日总结</Text>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-xs text-[#8888aa]">服务顾客</Text>
                <Text className="block text-xs font-mono text-[#e0e0e0]">{completedCustomerIds.length} 位</Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-xs text-[#8888aa]">当前资金</Text>
                <Text className="block text-xs font-mono text-[#00ff88]">{money} 元</Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-xs text-[#8888aa]">声望</Text>
                <Text className="block text-xs font-mono text-[#00f0ff]">{reputation}</Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-xs text-[#8888aa]">库存记忆</Text>
                <Text className="block text-xs font-mono text-[#cc66ff]">{inventory.length} 段</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 库存警告 */}
        {corruptedCount > 0 && (
          <Card className="bg-[#ffaa00]/10 border-[#ffaa00]/30 mb-4">
            <CardContent className="p-3">
              <View className="flex flex-row items-center gap-2 mb-2">
                <View className="w-2 h-2 rounded-full bg-[#ffaa00] breathe" />
                <Text className="block text-xs text-[#ffaa00] font-semibold">
                  {corruptedCount} 段记忆正在腐化
                </Text>
              </View>
              <Text className="block text-xs text-[#8888aa]">
                建议使用定影剂延缓腐化，或趁记忆尚完整时出售。
              </Text>
            </CardContent>
          </Card>
        )}

        {/* 后果提示 */}
        {dayConsequences.length > 0 && (
          <Card className="bg-[#1a1a2e] border-[#7b2ff7]/30 mb-4 fade-in-up">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#7b2ff7] font-semibold mb-2">今夜将发生...</Text>
              {dayConsequences.map((con, i) => (
                <Text key={i} className="block text-xs text-[#8888aa] mb-1">{con}</Text>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 氛围 */}
        <Card className="bg-[#141420] border-[#2a2a40] mb-4">
          <CardContent className="p-3">
            <Text className="block text-xs text-[#444466] text-center">
              {day <= 2
                ? '窗外的霓虹灯一盏一盏熄灭，街道渐渐沉入梦乡。'
                : day <= 4
                ? '远处偶尔传来夜行者的脚步声，时钟不紧不慢地走着。'
                : '黑暗从街角蔓延过来，吞没了最后一丝光亮。是时候休息了。'}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 内容留白 */}
      <View className="content-bottom-spacing" />

      {/* 底部操作区 */}
      <View className="game-bottom-bar">
        {/* 倒计时/状态 */}
        <View className="bg-[#141420] rounded-lg p-3 border border-[#2a2a40] text-center">
          <View className="flex flex-row items-center justify-center gap-2">
            <View className="w-2 h-2 rounded-full bg-[#00f0ff] breathe" />
            <Text className="block text-sm text-[#8888aa]">
              {countdown > 0
                ? `天亮倒计时 ${countdown} 秒...`
                : '新的一天来临'}
            </Text>
          </View>
        </View>

        <View className="bottom-bar-row">
          <View
            className="game-secondary-btn"
            style={{ justifyContent: 'center', flex: 1 }}
            onClick={showStorage}
          >
            <Text style={{ color: '#8888aa', fontSize: '14px' }}>存储柜</Text>
          </View>
          <View
            className="game-primary-btn"
            style={{ flex: 1, backgroundColor: '#ffaa00', color: '#0a0a0f' }}
            onClick={handleSkip}
          >
            <Text style={{ color: '#0a0a0f', fontSize: '16px', fontWeight: 600 }}>直接入睡</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
