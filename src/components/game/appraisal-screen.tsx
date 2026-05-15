import { useState, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'

export function AppraisalScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const frequencyTarget = useGameStore((s) => s.frequencyTarget)
  const frequencyCurrent = useGameStore((s) => s.frequencyCurrent)
  const impurities = useGameStore((s) => s.impurities)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const appraisalCompleteness = useGameStore((s) => s.appraisalCompleteness)
  const revealedTruth = useGameStore((s) => s.revealedTruth)
  const setFrequencyCurrent = useGameStore((s) => s.setFrequencyCurrent)
  const removeImpurity = useGameStore((s) => s.removeImpurity)
  const missImpurity = useGameStore((s) => s.missImpurity)
  const completeAppraisal = useGameStore((s) => s.completeAppraisal)

  const [activeTab, setActiveTab] = useState<'frequency' | 'impurity'>('frequency')
  const [removedImpurities, setRemovedImpurities] = useState<Set<string>>(new Set())

  const handleFrequencyChange = useCallback((value: number[]) => {
    setFrequencyCurrent(value[0])
  }, [setFrequencyCurrent])

  const handleImpurityTap = useCallback((impId: string) => {
    if (removedImpurities.has(impId)) return
    setRemovedImpurities((prev) => new Set(prev).add(impId))
    removeImpurity(impId)
  }, [removedImpurities, removeImpurity])

  const handleOrbTap = useCallback(() => {
    missImpurity()
  }, [missImpurity])

  const handleComplete = useCallback(() => {
    completeAppraisal()
  }, [completeAppraisal])

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]
  const hiddenColor = EMOTION_COLORS[currentCustomer.memory.hiddenEmotion]
  const allImpuritiesRemoved = impurities.every((i) => i.removed)
  const freqDiff = Math.abs(frequencyCurrent - frequencyTarget)
  const isFreqMatched = freqDiff < 5

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay">
      {/* 顶部信息 */}
      <View className="p-4 pb-2">
        <View className="flex flex-row items-center justify-between mb-2">
          <Text className="block text-sm font-semibold text-[#00f0ff]">记忆鉴定台</Text>
          <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa] text-xs">
            {currentCustomer.memory.name}
          </Badge>
        </View>

        {/* 鉴定指标 */}
        <View className="flex flex-row gap-2 mb-3">
          <View className="flex-1 bg-[#141420] rounded-lg p-2 border border-[#2a2a40]">
            <Text className="block text-xs text-[#8888aa] mb-1">纯度</Text>
            <Text className="block text-lg font-mono" style={{ color: emotionColor }}>
              {Math.round(appraisalPurity)}%
            </Text>
          </View>
          <View className="flex-1 bg-[#141420] rounded-lg p-2 border border-[#2a2a40]">
            <Text className="block text-xs text-[#8888aa] mb-1">完整度</Text>
            <Text className="block text-lg font-mono" style={{ color: appraisalCompleteness > 60 ? '#00ff88' : '#ffaa00' }}>
              {Math.round(appraisalCompleteness)}%
            </Text>
          </View>
          <View className="flex-1 bg-[#141420] rounded-lg p-2 border border-[#2a2a40]">
            <Text className="block text-xs text-[#8888aa] mb-1">稀有度</Text>
            <Text className="block text-lg font-mono text-[#ffcc00]">
              {'★'.repeat(currentCustomer.memory.rarity)}
            </Text>
          </View>
        </View>
      </View>

      {/* 记忆球可视化 */}
      <View className="px-4 mb-4">
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-4">
            <View className="flex items-center justify-center mb-3">
              <View
                className="relative w-36 h-36 rounded-full orb-glow"
                style={{ '--orb-color': revealedTruth ? hiddenColor : emotionColor } as React.CSSProperties}
                onClick={activeTab === 'impurity' ? handleOrbTap : undefined}
              >
                {/* 记忆球主体 */}
                <View
                  className="absolute inset-2 rounded-full orb-flow-bg"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${revealedTruth ? hiddenColor : emotionColor}88, ${revealedTruth ? hiddenColor : emotionColor}22, #0a0a0f)`,
                    backgroundSize: '200% 200%',
                  }}
                />
                {/* 高光 */}
                <View className="absolute top-3 left-6 w-8 h-4 rounded-full blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                {/* 杂质斑点 */}
                {activeTab === 'impurity' && impurities.map((imp) => (
                  !imp.removed ? (
                    <View
                      key={imp.id}
                      className={`absolute rounded-full impurity-alive ${removedImpurities.has(imp.id) ? 'impurity-dying' : ''}`}
                      style={{
                        left: `${imp.x}%`,
                        top: `${imp.y}%`,
                        width: `${imp.size}px`,
                        height: `${imp.size}px`,
                        backgroundColor: '#1a0a0a',
                        border: '1px solid #330000',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImpurityTap(imp.id)
                      }}
                    />
                  ) : null
                ))}
              </View>
            </View>

            {/* 情感频谱 */}
            <View className="flex flex-row gap-1 mb-2">
              <Text className="block text-xs text-[#8888aa]">情感频谱:</Text>
              <View className="flex-1 flex flex-row gap-1">
                {(['sadness', 'anger', 'joy', 'fear', 'nostalgia', 'guilt'] as const).map((emo) => {
                  const isActive = currentCustomer.memory.emotion === emo || (revealedTruth && currentCustomer.memory.hiddenEmotion === emo)
                  return (
                    <View
                      key={emo}
                      className="h-2 flex-1 rounded-full"
                      style={{
                        backgroundColor: isActive ? EMOTION_COLORS[emo] : '#1a1a2e',
                        opacity: isActive ? 0.8 : 0.3,
                      }}
                    />
                  )
                })}
              </View>
            </View>
            <View className="flex flex-row justify-between">
              {(['悲', '怒', '喜', '惧', '怀', '罪'] as const).map((label, i) => (
                <Text key={i} className="block text-xs text-[#444466]">{label}</Text>
              ))}
            </View>

            {/* 隐藏真相揭示 */}
            {revealedTruth && (
              <View className="mt-3 p-3 rounded-lg border fade-in-up" style={{ borderColor: 'rgba(255,0,102,0.3)', backgroundColor: 'rgba(255,0,102,0.05)' }}>
                <Text className="block text-xs text-[#ff0066] font-semibold mb-1">检测到隐藏情感</Text>
                <Text className="block text-xs text-[#ff88aa]">
                  表层情感：{EMOTION_LABELS[currentCustomer.memory.emotion]} →
                  深层情感：{EMOTION_LABELS[currentCustomer.memory.hiddenEmotion]}
                </Text>
                <Text className="block text-xs text-[#8888aa] mt-1">
                  {currentCustomer.memory.hiddenTruth}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* 操作Tab切换 */}
      <View className="px-4 mb-3">
        <View className="flex flex-row gap-2">
          <View
            className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'frequency' ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30' : 'bg-[#141420] border border-[#2a2a40]'}`}
            onClick={() => setActiveTab('frequency')}
          >
            <Text className={`block text-xs ${activeTab === 'frequency' ? 'text-[#00f0ff]' : 'text-[#8888aa]'}`}>
              频谱调频
            </Text>
          </View>
          <View
            className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'impurity' ? 'bg-[#ff0066]/10 border border-[#ff0066]/30' : 'bg-[#141420] border border-[#2a2a40]'}`}
            onClick={() => setActiveTab('impurity')}
          >
            <Text className={`block text-xs ${activeTab === 'impurity' ? 'text-[#ff0066]' : 'text-[#8888aa]'}`}>
              杂质剔除
            </Text>
          </View>
        </View>
      </View>

      {/* 操作区域 */}
      <View className="px-4 mb-4">
        {activeTab === 'frequency' ? (
          <Card className="bg-[#141420] border-[#2a2a40]">
            <CardContent className="p-4">
              <Text className="block text-xs text-[#8888aa] mb-3">
                拖动滑块调整频率，当频率与记忆波动一致时，杂音消失、画面变清晰
              </Text>

              {/* 目标频率指示 */}
              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="block text-xs text-[#8888aa]">目标频率</Text>
                <Text className="block text-xs font-mono text-[#00f0ff]">{Math.round(frequencyTarget)} Hz</Text>
              </View>

              {/* 频率可视化 */}
              <View className="h-10 bg-[#0a0a0f] rounded-lg mb-3 relative overflow-hidden">
                {/* 目标波形 */}
                <View
                  className="absolute top-0 bottom-0 w-1" style={{ backgroundColor: 'rgba(0,240,255,0.5)', left: `${frequencyTarget}%` }}
                />
                {/* 当前位置 */}
                <View
                  className="absolute top-0 bottom-0 w-1 rounded"
                  style={{
                    left: `${frequencyCurrent}%`,
                    backgroundColor: isFreqMatched ? '#00ff88' : '#ff0066',
                    boxShadow: isFreqMatched ? '0 0 8px #00ff88' : '0 0 8px #ff0066',
                    transition: 'left 0.1s ease',
                  }}
                />
                {/* 波形效果 */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <View
                    key={i}
                    className="absolute bottom-0 w-1 rounded-t"
                    style={{
                      left: `${i * 5 + 2}%`,
                      height: `${15 + Math.sin((i * 0.5) + frequencyCurrent * 0.1) * 15}%`,
                      backgroundColor: isFreqMatched ? '#00ff8833' : '#ff006622',
                    }}
                  />
                ))}
              </View>

              {/* 匹配状态 */}
              <View className="flex flex-row items-center justify-center gap-2 mb-3">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: isFreqMatched ? '#00ff88' : freqDiff < 15 ? '#ffaa00' : '#ff3344',
                    boxShadow: `0 0 6px ${isFreqMatched ? '#00ff88' : freqDiff < 15 ? '#ffaa00' : '#ff3344'}`,
                  }}
                />
                <Text
                  className="block text-xs font-mono"
                  style={{
                    color: isFreqMatched ? '#00ff88' : freqDiff < 15 ? '#ffaa00' : '#ff3344',
                  }}
                >
                  {isFreqMatched ? '完美匹配！' : freqDiff < 15 ? '接近匹配...' : '频率偏差过大'}
                </Text>
              </View>

              {/* 滑块 */}
              <Slider
                value={[frequencyCurrent]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleFrequencyChange}
                className="w-full"
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#141420] border-[#2a2a40]">
            <CardContent className="p-4">
              <Text className="block text-xs text-[#8888aa] mb-2">
                点击记忆球上的黑色斑点清除精神污染。注意不要触碰发光区域！
              </Text>

              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="block text-xs text-[#8888aa]">
                  剩余杂质: {impurities.filter((i) => !i.removed).length}/{impurities.length}
                </Text>
                {allImpuritiesRemoved && (
                  <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 text-xs">
                    已清除
                  </Badge>
                )}
              </View>

              <View className="bg-[#0a0a0f] rounded-lg p-3">
                <Text className="block text-xs text-[#444466] text-center">
                  请点击上方记忆球中的黑色斑点
                </Text>
              </View>
            </CardContent>
          </Card>
        )}
      </View>

      {/* 完成鉴定按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          paddingBottom: '24px',
          backgroundColor: '#0a0a0f',
          borderTop: '1px solid #1a1a2e',
          zIndex: 100,
        }}
      >
        <Button
          className="w-full bg-[#7b2ff7] hover:bg-[#6a1ee6] text-white font-semibold"
          onClick={handleComplete}
        >
          <Text className="text-white font-semibold">完成鉴定</Text>
        </Button>
      </View>
    </View>
  )
}
