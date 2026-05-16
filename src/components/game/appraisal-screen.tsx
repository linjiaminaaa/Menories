import { useState, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'

export function AppraisalScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const spectrumBands = useGameStore((s) => s.spectrumBands)
  const impurities = useGameStore((s) => s.impurities)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const appraisalCompleteness = useGameStore((s) => s.appraisalCompleteness)
  const revealedTruth = useGameStore((s) => s.revealedTruth)
  const adjustBand = useGameStore((s) => s.adjustBand)
  const removeImpurity = useGameStore((s) => s.removeImpurity)
  const missImpurity = useGameStore((s) => s.missImpurity)
  const completeAppraisal = useGameStore((s) => s.completeAppraisal)
  const abortCustomer = useGameStore((s) => s.abortCustomer)

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [step1Done, setStep1Done] = useState(false)
  const [removedImpurities, setRemovedImpurities] = useState<Set<string>>(new Set())

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
  const remainingImpurities = impurities.filter((i) => !i.removed).length

  const totalMatch = spectrumBands.reduce((sum, b) => {
    const match = Math.max(0, 100 - Math.abs(b.current - b.target) * 2)
    return sum + match
  }, 0)
  const avgMatch = spectrumBands.length > 0 ? totalMatch / spectrumBands.length : 0

  const hiddenBand = spectrumBands.find((b) => b.emotion === currentCustomer.memory.hiddenEmotion)
  const hiddenMatched = hiddenBand ? Math.abs(hiddenBand.current - hiddenBand.target) < 10 : false
  const isWellMatched = avgMatch > 60

  const advanceToStep2 = () => {
    setStep1Done(true)
    setCurrentStep(2)
  }

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
                className="relative w-48 h-48 rounded-full orb-glow"
                style={{ '--orb-color': revealedTruth ? hiddenColor : emotionColor } as React.CSSProperties}
                onClick={currentStep === 2 ? handleOrbTap : undefined}
              >
                <View
                  className="absolute inset-2 rounded-full orb-flow-bg"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${revealedTruth ? hiddenColor : emotionColor}88, ${revealedTruth ? hiddenColor : emotionColor}22, #0a0a0f)`,
                    backgroundSize: '200% 200%',
                  }}
                />
                <View className="absolute top-3 left-6 w-8 h-4 rounded-full blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

                {/* 杂质斑点 — 仅步骤2显示 */}
                {currentStep === 2 && impurities.map((imp) => (
                  !imp.removed ? (
                    <View
                      key={imp.id}
                      className={`absolute rounded-full impurity-alive ${removedImpurities.has(imp.id) ? 'impurity-dying' : ''}`}
                      style={{
                        left: `${imp.x}%`,
                        top: `${imp.y}%`,
                        width: `${Math.max(imp.size, 22)}px`,
                        height: `${Math.max(imp.size, 22)}px`,
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

      {/* 步骤指示器 */}
      <View className="px-4 mb-3">
        <View className="flex flex-row items-center gap-0">
          {/* Step 1 */}
          <View className="flex flex-col items-center flex-1">
            <View className="flex flex-row items-center gap-2 mb-1">
              <View
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: currentStep === 1 ? '#00f0ff' : step1Done ? '#00ff88' : '#2a2a40',
                  color: currentStep === 1 ? '#0a0a0f' : '#fff',
                }}
              >
                <Text className="block text-xs font-bold">{step1Done ? '✓' : '1'}</Text>
              </View>
              <Text
                className="block text-sm font-semibold"
                style={{ color: currentStep === 1 ? '#00f0ff' : step1Done ? '#00ff88' : '#444466' }}
              >
                频谱均衡
              </Text>
            </View>
            {currentStep === 1 && (
              <View className="h-1 w-full rounded-full" style={{ backgroundColor: '#00f0ff' }} />
            )}
            {step1Done && currentStep === 2 && (
              <View className="h-1 w-full rounded-full" style={{ backgroundColor: '#00ff88' }} />
            )}
            {!step1Done && currentStep === 2 && (
              <View className="h-1 w-full rounded-full" style={{ backgroundColor: '#2a2a40' }} />
            )}
          </View>

          {/* 连接线 */}
          <View className="w-8" />

          {/* Step 2 */}
          <View className="flex flex-col items-center flex-1">
            <View className="flex flex-row items-center gap-2 mb-1">
              <View
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: currentStep === 2 ? '#ff0066' : '#2a2a40',
                  color: '#fff',
                }}
              >
                <Text className="block text-xs font-bold">2</Text>
              </View>
              <Text
                className="block text-sm font-semibold"
                style={{ color: currentStep === 2 ? '#ff0066' : '#444466' }}
              >
                杂质剔除
              </Text>
            </View>
            {currentStep === 2 && (
              <View className="h-1 w-full rounded-full" style={{ backgroundColor: '#ff0066' }} />
            )}
          </View>
        </View>
      </View>

      {/* 操作区域 */}
      <View className="px-4 mb-4">
        {currentStep === 1 ? (
          /* 步骤1：频谱均衡器 */
          <Card className="bg-[#141420] border-[#2a2a40]">
            <CardContent className="p-4">
              <Text className="block text-xs text-[#8888aa] mb-1">
                调节各频段至目标值，使频谱与记忆共振
              </Text>

              {/* 全局匹配度 */}
              <View className="mb-4">
                <View className="flex flex-row items-center justify-between mb-1">
                  <Text className="block text-xs text-[#8888aa]">共振匹配度</Text>
                  <Text className="block text-xs font-mono" style={{
                    color: avgMatch > 70 ? '#00ff88' : avgMatch > 40 ? '#ffaa00' : '#ff3344'
                  }}>
                    {Math.round(avgMatch)}%
                  </Text>
                </View>
                <View className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${avgMatch}%`,
                      backgroundColor: avgMatch > 70 ? '#00ff88' : avgMatch > 40 ? '#ffaa00' : '#ff3344',
                    }}
                  />
                </View>
              </View>

              {/* 六段频谱均衡器 */}
              <View className="flex flex-col gap-1">
                {spectrumBands.map((band) => {
                  const bandMatch = Math.abs(band.current - band.target) < 10
                  const isHidden = band.emotion === currentCustomer.memory.hiddenEmotion && hiddenMatched

                  return (
                    <View key={band.emotion} className="flex flex-row items-center gap-2 py-1">
                      <Text className="block w-8 text-center text-sm font-semibold" style={{ color: band.color }}>
                        {band.label}
                      </Text>
                      <View className="flex-1 h-6 bg-[#0a0a0f] rounded-full overflow-hidden relative">
                        <View
                          className="h-full rounded-full transition-all duration-200"
                          style={{
                            width: `${band.current}%`,
                            backgroundColor: bandMatch ? '#00ff88' : band.color,
                            opacity: bandMatch ? 1 : 0.7,
                            boxShadow: isHidden ? `0 0 8px ${band.color}` : undefined,
                          }}
                        />
                      </View>
                      <Text className="block w-10 text-right font-mono text-xs" style={{ color: bandMatch ? '#00ff88' : '#8888aa' }}>
                        {band.current}
                      </Text>
                      <View
                        className="w-11 h-11 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a40' }}
                        hoverClass="border-[#444466] bg-[#222240]"
                        onClick={() => adjustBand(band.emotion, -10)}
                      >
                        <Text className="block text-lg font-bold text-[#8888aa]" style={{ lineHeight: 1 }}>−</Text>
                      </View>
                      <View
                        className="w-11 h-11 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: '#1a1a2e', border: `1px solid ${band.color}44` }}
                        hoverClass="border-[#666688] bg-[#222240]"
                        onClick={() => adjustBand(band.emotion, 10)}
                      >
                        <Text className="block text-lg font-bold" style={{ color: band.color, lineHeight: 1 }}>+</Text>
                      </View>
                    </View>
                  )
                })}
              </View>

              {/* 隐藏情感匹配提示 */}
              {hiddenMatched && !revealedTruth && (
                <View className="mt-3 p-2 rounded-lg border border-[#ff0066]/30 bg-[#ff0066]/5">
                  <View className="flex flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#ff0066] breathe" />
                    <Text className="block text-xs text-[#ff0066]">检测到异常频谱共振...</Text>
                  </View>
                </View>
              )}

              {/* 匹配完成 → 进入步骤2 */}
              {isWellMatched && (
                <View className="mt-4 p-4 rounded-lg border fade-in-up" style={{ borderColor: 'rgba(0,255,136,0.4)', backgroundColor: 'rgba(0,255,136,0.08)' }}>
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
                    <Text className="block text-sm font-semibold text-[#00ff88]">频谱共振完成！</Text>
                  </View>
                  <Text className="block text-xs text-[#8888aa] mb-3">
                    纯度提升至 {Math.round(appraisalPurity)}%。接下来请清除杂质污染以确保记忆完整。
                  </Text>
                  <View
                    className="flex items-center justify-center w-full py-3 rounded-lg"
                    style={{ backgroundColor: '#ff0066', color: '#fff' }}
                    hoverClass="opacity-90"
                    onClick={advanceToStep2}
                  >
                    <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>清除杂质 →</Text>
                  </View>
                </View>
              )}
            </CardContent>
          </Card>
        ) : (
          /* 步骤2：杂质剔除 */
          <Card className="bg-[#141420] border-[#2a2a40]">
            <CardContent className="p-4">
              {/* 步骤1完成标记 */}
              {step1Done && (
                <View className="flex flex-row items-center gap-2 mb-3 pb-3 border-b border-[#2a2a40]">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
                  <Text className="block text-xs text-[#00ff88]">✓ 频谱共振已完成</Text>
                  <Text className="block text-xs text-[#8888aa] ml-auto">纯度 {Math.round(appraisalPurity)}%</Text>
                </View>
              )}

              <Text className="block text-xs text-[#8888aa] mb-2">
                点击记忆球上的黑色斑点清除精神污染。注意不要触碰发光区域！
              </Text>

              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="block text-sm text-[#8888aa]">
                  剩余杂质: {remainingImpurities}/{impurities.length}
                </Text>
                {allImpuritiesRemoved && (
                  <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 text-sm py-1 px-3">
                    全部清除 ✓
                  </Badge>
                )}
              </View>

              {allImpuritiesRemoved && (
                <View className="mt-3 p-3 rounded-lg border fade-in-up" style={{ borderColor: 'rgba(0,255,136,0.3)', backgroundColor: 'rgba(0,255,136,0.05)' }}>
                  <View className="flex flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#00ff88] breathe" />
                    <Text className="block text-sm text-[#00ff88] font-semibold">记忆已净化完毕，可以完成鉴定</Text>
                  </View>
                </View>
              )}

              {!allImpuritiesRemoved && (
                <View className="bg-[#0a0a0f] rounded-lg p-3 mt-2">
                  <Text className="block text-xs text-[#444466] text-center">
                    请点击上方记忆球中的黑色斑点
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>
        )}
      </View>

      {/* 内容区底部留白 */}
      <View className="content-bottom-spacing" />

      {/* 底部操作区 */}
      <View className="game-bottom-bar">
        <View
          className="game-primary-btn"
          style={{ backgroundColor: '#7b2ff7' }}
          onClick={handleComplete}
        >
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>完成鉴定</Text>
        </View>
        <View className="bottom-bar-row">
          <View
            className="game-secondary-btn"
            style={{ justifyContent: 'center', flex: 1, borderColor: '#ff334444' }}
            onClick={abortCustomer}
          >
            <Text style={{ color: '#ff3344', fontSize: '14px' }}>中止交易</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
