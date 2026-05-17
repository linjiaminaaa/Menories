import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { useGameStore, EMOTION_COLORS } from '@/store/game-store'

export function DialogScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const dialogIndex = useGameStore((s) => s.dialogIndex)
  const advanceDialog = useGameStore((s) => s.advanceDialog)
  const setPhase = useGameStore((s) => s.setPhase)
  const abortCustomer = useGameStore((s) => s.abortCustomer)

  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showChoices, setShowChoices] = useState(false)

  const currentStep = currentCustomer?.dialog[dialogIndex]
  const isLastStep = dialogIndex >= (currentCustomer?.dialog.length ?? 0) - 1

  // 打字机效果
  useEffect(() => {
    if (!currentStep) return

    const fullText = currentStep.text
    setDisplayedText('')
    setShowChoices(false)
    setIsTyping(true)

    let charIndex = 0
    const timer = setInterval(() => {
      charIndex++
      setDisplayedText(fullText.slice(0, charIndex))
      if (charIndex >= fullText.length) {
        clearInterval(timer)
        setIsTyping(false)
        setShowChoices(true)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [dialogIndex, currentStep?.text])

  // 鉴定前的最后一步
  useEffect(() => {
    if (!currentStep && currentCustomer && dialogIndex >= (currentCustomer.dialog.length ?? 0)) {
      setPhase('tuning')
    }
  }, [dialogIndex, currentStep, currentCustomer, setPhase])

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay">
      {/* 顾客信息 */}
      <View className="p-4 pb-2">
        <View className="flex flex-row items-center justify-between mb-2">
          <View className="flex flex-row items-center gap-2">
            <View
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${emotionColor}20`,
                border: `2px solid ${emotionColor}`,
              }}
            >
              <Text className="block text-sm font-bold" style={{ color: emotionColor }}>
                {currentCustomer.name.charAt(0)}
              </Text>
            </View>
            <View>
              <Text className="block text-sm font-semibold text-[#e0e0e0]">{currentCustomer.name}</Text>
              <Text className="block text-xs text-[#444466]">{currentCustomer.title}</Text>
            </View>
          </View>
          {/* 心理状态指标 */}
          <View className="flex flex-col gap-1">
            <View className="flex flex-row items-center gap-1">
              <Text className="block text-xs text-[#ffaa00]">急迫</Text>
              <View className="w-12 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${currentCustomer.urgency}%`,
                    backgroundColor: currentCustomer.urgency > 60 ? '#ff3344' : '#ffaa00',
                  }}
                />
              </View>
            </View>
            <View className="flex flex-row items-center gap-1">
              <Text className="block text-xs text-[#8888aa]">防线</Text>
              <View className="w-12 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
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
        </View>
      </View>

      {/* 对话内容区 */}
      <View className="px-4 flex-1">
        {/* 外貌描述（首次出现时） */}
        {dialogIndex === 0 && (
          <Card className="bg-[#141420] border-[#2a2a40] mb-3 fade-in-up">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#8888aa]">{currentCustomer.appearance}</Text>
            </CardContent>
          </Card>
        )}

        {/* 对话框 */}
        {currentStep && (
          <Card className="bg-[#1a1a2e] border-[#2a2a40] mb-3 fade-in">
            <CardContent className="p-4">
              {/* 说话者标识 */}
              <View className="flex flex-row items-center gap-2 mb-2">
                {currentStep.speaker === 'customer' ? (
                  <View className="px-2 py-1 rounded bg-[#7b2ff7]/20 border border-[#7b2ff7]/30">
                    <Text className="block text-xs text-[#cc66ff]">{currentCustomer.name}</Text>
                  </View>
                ) : currentStep.speaker === 'narrator' ? (
                  <View className="px-2 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                    <Text className="block text-xs text-[#00f0ff]">旁白</Text>
                  </View>
                ) : (
                  <View className="px-2 py-1 rounded bg-[#2a2a40]">
                    <Text className="block text-xs text-[#8888aa]">系统</Text>
                  </View>
                )}
              </View>

              {/* 对话文字（打字机效果） */}
              <Text className="block text-sm text-[#e0e0e0] leading-6">
                {displayedText}
                {isTyping && <Text className="text-[#00f0ff]">|</Text>}
              </Text>

              {/* 微表情提示 */}
              {currentStep.microExpression && showChoices && (
                <View className="mt-3 pt-2 border-t border-[#2a2a40] micro-expression">
                  <Text className="block text-xs text-[#ffaa00]">
                    [微表情] {currentStep.microExpression}
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>
        )}

        {/* 选择项 */}
        {showChoices && currentStep?.choices && currentStep.choices.length > 0 && (
          <View className="flex flex-col gap-3 mb-3">
            {currentStep.choices.map((choice, i) => (
              <View
                key={i}
                className="touch-choice fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => advanceDialog(i)}
              >
                <Text className="block text-sm text-[#e0e0e0]">{choice.text}</Text>
                <View className="flex flex-row gap-2 mt-2">
                  {choice.defenseChange !== 0 && (
                    <Text className="block text-xs text-[#00f0ff]">
                      防线{choice.defenseChange > 0 ? '+' : ''}{choice.defenseChange}
                    </Text>
                  )}
                  {choice.urgencyChange !== 0 && (
                    <Text className="block text-xs text-[#ffaa00]">
                      急迫{choice.urgencyChange > 0 ? '+' : ''}{choice.urgencyChange}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 继续/进入鉴定按钮 */}
        {showChoices && (!currentStep?.choices || currentStep.choices.length === 0) && (
          <View className="flex flex-col gap-2 mb-3 safe-bottom">
            <View
              className="game-primary-btn"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
              }}
              onClick={() => {
                if (isLastStep) {
                  setPhase('tuning')
                } else {
                  advanceDialog()
                }
              }}
            >
              <Text style={{ color: '#00f0ff', fontSize: '16px', fontWeight: 600 }}>
                {isLastStep ? '开始鉴定记忆' : '继续'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 底部中止按钮 */}
      <View className="game-bottom-bar">
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
