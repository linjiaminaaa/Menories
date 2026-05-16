import { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'

const PULSE_INTERVAL = 2200
const HIT_WINDOW_START = 1300
const HIT_WINDOW_END = 1900
const PERFECT_START = 1500
const PERFECT_END = 1700
const NOISE_CHANCE = 0.25

type PulseState = 'idle' | 'approaching' | 'hit-ready' | 'missed'

export function AppraisalScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const appraisalCompleteness = useGameStore((s) => s.appraisalCompleteness)
  const revealedTruth = useGameStore((s) => s.revealedTruth)
  const shellTotal = useGameStore((s) => s.resonanceShellTotal)
  const shellRemaining = useGameStore((s) => s.resonanceShellRemaining)
  const comboCount = useGameStore((s) => s.resonanceCombo)
  const resonancePhase = useGameStore((s) => s.resonancePhase)
  const initResonance = useGameStore((s) => s.initResonance)
  const resonanceHit = useGameStore((s) => s.resonanceHit)
  const resonanceMiss = useGameStore((s) => s.resonanceMiss)
  const completeAppraisal = useGameStore((s) => s.completeAppraisal)
  const abortCustomer = useGameStore((s) => s.abortCustomer)

  const [pulseStart, setPulseStart] = useState(0)
  const [pulseState, setPulseState] = useState<PulseState>('idle')
  const [isNoise, setIsNoise] = useState(false)
  const [pulseProgress, setPulseProgress] = useState(0)
  const [showPerfect, setShowPerfect] = useState(false)
  const [comboPop, setComboPop] = useState(false)
  const [hitResult, setHitResult] = useState<'perfect' | 'good' | 'miss' | 'noise' | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedRef = useRef(false)
  const pulseIdxRef = useRef(0)

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      initResonance()
      startNewPulse()
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startNewPulse = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setHitResult(null)
    const now = Date.now()
    const noise = Math.random() < NOISE_CHANCE
    setIsNoise(noise)
    setPulseState('approaching')
    setPulseStart(now)
    setPulseProgress(0)
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - now
      const progress = Math.min(100, (elapsed / PULSE_INTERVAL) * 100)
      setPulseProgress(progress)
      if (elapsed >= PULSE_INTERVAL) {
        setPulseState('missed'); clearInterval(timerRef.current!)
        if (!noise) resonanceMiss()
        setTimeout(() => { pulseIdxRef.current++; startNewPulse() }, 500)
      } else if (elapsed >= HIT_WINDOW_START && elapsed < HIT_WINDOW_END) {
        setPulseState('hit-ready')
      } else if (elapsed >= HIT_WINDOW_END) {
        setPulseState('missed'); clearInterval(timerRef.current!)
        if (!noise) resonanceMiss()
        setTimeout(() => { pulseIdxRef.current++; startNewPulse() }, 500)
      }
    }, 30)
  }

  const handleTap = useCallback(() => {
    if (!pulseStart || resonancePhase !== 'pulsing' || pulseState !== 'hit-ready') return
    if (isNoise) {
      resonanceHit('good', true)
      setHitResult('noise'); setShowPerfect(false)
      if (timerRef.current) clearInterval(timerRef.current)
      setTimeout(() => { pulseIdxRef.current++; startNewPulse() }, 700)
      return
    }
    const elapsed = Date.now() - pulseStart
    if (elapsed >= PERFECT_START && elapsed <= PERFECT_END) {
      resonanceHit('perfect', false)
      setHitResult('perfect'); setShowPerfect(true); setComboPop(true)
      setTimeout(() => setShowPerfect(false), 600)
      setTimeout(() => setComboPop(false), 300)
    } else {
      resonanceHit('good', false)
      setHitResult('good'); setShowPerfect(false)
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(() => { pulseIdxRef.current++; startNewPulse() }, 500)
  }, [pulseStart, isNoise, pulseState, resonancePhase, resonanceHit, resonanceMiss])

  const handleComplete = useCallback(() => completeAppraisal(), [completeAppraisal])

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]
  const hiddenColor = EMOTION_COLORS[currentCustomer.memory.hiddenEmotion]
  const strippedCount = shellTotal - shellRemaining
  const hitZoneStart = (HIT_WINDOW_START / PULSE_INTERVAL) * 100
  const hitZoneEnd = (HIT_WINDOW_END / PULSE_INTERVAL) * 100
  const perfectStart = (PERFECT_START / PULSE_INTERVAL) * 100
  const perfectEnd = (PERFECT_END / PULSE_INTERVAL) * 100

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay flex flex-col">
      <View className="crt-overlay" />

      {/* === 上部：紧凑信息区（非交互） === */}
      <View className="px-4 pt-3 pb-1" style={{ position: 'relative', zIndex: 10 }}>
        {/* 标题 + 纯度/完整度/稀有度 一行 */}
        <View className="flex flex-row items-center gap-2 mb-2">
          <View className="flex flex-row items-center gap-1 flex-1">
            <Text className="block text-xs font-semibold text-[#00f0ff]">共鸣诊断舱</Text>
            <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa] text-xs ml-1">
              {currentCustomer.memory.name}
            </Badge>
          </View>
          <Text className="block text-xs font-mono" style={{ color: emotionColor }}>纯{Math.round(appraisalPurity)}%</Text>
          <Text className="block text-xs font-mono" style={{ color: appraisalCompleteness > 60 ? '#00ff88' : '#ffaa00' }}>整{Math.round(appraisalCompleteness)}%</Text>
          <Text className="block text-xs font-mono text-[#ffcc00]">{'★'.repeat(currentCustomer.memory.rarity)}</Text>
        </View>

        {/* 记忆球小窗 + 外壳/连击指示 */}
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-2">
            <View className="flex flex-row items-center gap-3">
              {/* 迷你记忆球 */}
              <View className="relative flex items-center justify-center" style={{ width: 60, height: 60, flexShrink: 0 }}>
                {showPerfect && <View className="perfect-flash" />}
                <View
                  className="resonance-core rounded-full flex items-center justify-center"
                  style={{
                    width: 50, height: 50,
                    backgroundColor: `${revealedTruth ? hiddenColor : emotionColor}22`,
                    border: `1.5px solid ${revealedTruth ? hiddenColor : emotionColor}66`,
                    '--core-color': revealedTruth ? hiddenColor : emotionColor,
                  } as React.CSSProperties}
                >
                  <View className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `${revealedTruth ? hiddenColor : emotionColor}88` }}
                  />
                </View>
              </View>

              {/* 外壳 + 信噪比 + combo */}
              <View className="flex-1 flex flex-col gap-2">
                <View className="flex flex-row items-center gap-2">
                  <Text className="block text-xs text-[#8888aa] w-10">外壳</Text>
                  <View className="flex flex-row gap-1 flex-1">
                    {Array.from({ length: shellTotal }).map((_, i) => (
                      <View key={i} className="flex-1 h-2 rounded-full"
                        style={{ backgroundColor: i < strippedCount ? '#00ff88' : '#2a2a40' }}
                      />
                    ))}
                  </View>
                  <Text className="block text-xs font-mono text-[#00f0ff] w-8 text-right">{strippedCount}/{shellTotal}</Text>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <Text className="block text-xs text-[#8888aa] w-10">连击</Text>
                  <Text className={`block text-base font-mono ${comboPop ? 'combo-pop' : ''}`}
                    style={{
                      color: comboCount > 3 ? '#ffcc00' : comboCount > 1 ? '#00ff88' : '#8888aa',
                      textShadow: comboCount > 3 ? '0 0 8px rgba(255,204,0,0.4)' : undefined,
                    }}
                  >×{comboCount}</Text>
                </View>
              </View>
            </View>

            {/* 涟漪预览（迷你） */}
            {resonancePhase === 'pulsing' && (
              <View className="relative h-3 mt-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                <View className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    left: `${hitZoneStart}%`,
                    width: `${hitZoneEnd - hitZoneStart}%`,
                    backgroundColor: isNoise ? 'rgba(255,51,68,0.25)' : 'rgba(0,255,136,0.2)',
                  }}
                />
                <View className="absolute top-0 bottom-0 w-1 rounded-full"
                  style={{
                    left: `${pulseProgress}%`,
                    backgroundColor: pulseState === 'hit-ready' ? (isNoise ? '#ff3344' : '#00ff88') : '#00f0ff',
                    boxShadow: pulseState === 'hit-ready' ? `0 0 6px ${isNoise ? '#ff3344' : '#00ff88'}` : 'none',
                  }}
                />
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* === 中部：共振大按钮（拇指热区） === */}
      <View className="flex-1 flex flex-col items-center justify-center px-4" style={{ position: 'relative', zIndex: 10, minHeight: 180 }}>
        {/* 状态提示 */}
        <View className="mb-2" style={{ minHeight: 24 }}>
          {resonancePhase === 'pulsing' && pulseState === 'approaching' && (
            <Text className="block text-xs text-[#8888aa] text-center">
              {isNoise ? '⚠ 杂音接近...' : '等待共振窗口...'}
            </Text>
          )}
          {resonancePhase === 'pulsing' && pulseState === 'hit-ready' && (
            <Text className="block text-sm font-semibold text-center"
              style={{ color: isNoise ? '#ff3344' : '#00ff88' }}>
              {isNoise ? '⚠ 避开杂音脉冲!' : '现在点击!'}
            </Text>
          )}
          {resonancePhase === 'pulsing' && pulseState === 'missed' && (
            <Text className="block text-xs text-[#444466] text-center">已错过，等待下一轮...</Text>
          )}
          {resonancePhase === 'complete' && (
            <Text className="block text-sm font-semibold text-[#00ff88] text-center">✓ 全部剥离完成</Text>
          )}
          {hitResult && (
            <Text className="block text-sm font-bold text-center fade-in-up"
              style={{
                color: hitResult === 'perfect' ? '#ffcc00' : hitResult === 'good' ? '#00ff88' : '#ff3344',
              }}
            >
              {hitResult === 'perfect' ? '完美共振!' : hitResult === 'good' ? '共振成功' : '杂音污染!'}
            </Text>
          )}
        </View>

        {/* 大按钮 */}
        <View
          className="flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: pulseState === 'hit-ready' ? 160 : 120,
            height: pulseState === 'hit-ready' ? 160 : 120,
            backgroundColor: pulseState === 'hit-ready'
              ? (isNoise ? 'rgba(255,51,68,0.25)' : 'rgba(0,255,136,0.2)')
              : 'rgba(255,255,255,0.04)',
            border: pulseState === 'hit-ready'
              ? (isNoise ? '3px solid #ff3344' : '3px solid #00ff88')
              : '2px solid rgba(255,255,255,0.12)',
            boxShadow: pulseState === 'hit-ready'
              ? (isNoise
                ? '0 0 50px rgba(255,51,68,0.5), inset 0 0 40px rgba(255,51,68,0.15)'
                : '0 0 50px rgba(0,255,136,0.4), inset 0 0 40px rgba(0,255,136,0.1)')
              : 'none',
          }}
          onClick={handleTap}
        >
          {pulseState === 'hit-ready' ? (
            <Text className="block text-xl font-bold"
              style={{
                color: isNoise ? '#ff3344' : '#00ff88',
                textShadow: isNoise ? '0 0 15px #ff3344' : '0 0 15px #00ff88',
              }}
            >
              {isNoise ? '避开!' : '共振!'}
            </Text>
          ) : resonancePhase === 'complete' ? (
            <Text className="block text-sm text-[#00ff88]">✓</Text>
          ) : (
            <Text className="block text-xs text-[#444466]">
              {pulseState === 'missed' ? '...' : isNoise ? '⚠' : '◉'}
            </Text>
          )}
        </View>

        {/* 脉冲进度条 */}
        <View className="w-full mt-3">
          <View className="flex flex-row items-center justify-between mb-1">
            <Text className="block text-xs text-[#444466]">脉冲</Text>
            <Text className="block text-xs font-mono text-[#00f0ff]">
              {((PULSE_INTERVAL - (pulseProgress / 100) * PULSE_INTERVAL) / 1000).toFixed(1)}s
            </Text>
          </View>
          <View className="relative h-4 bg-[#0a0a0f] rounded-full overflow-hidden">
            <View className="absolute top-0 bottom-0 rounded-full"
              style={{ left: `${hitZoneStart}%`, width: `${hitZoneEnd - hitZoneStart}%`, backgroundColor: isNoise ? 'rgba(255,51,68,0.2)' : 'rgba(0,255,136,0.15)' }}
            />
            <View className="absolute top-1 bottom-1 rounded-full"
              style={{ left: `${perfectStart}%`, width: `${perfectEnd - perfectStart}%`, backgroundColor: isNoise ? 'rgba(255,51,68,0.3)' : 'rgba(0,255,136,0.25)' }}
            />
            <View className="absolute top-0 bottom-0 w-1.5 rounded-full"
              style={{ left: `${pulseProgress}%`, backgroundColor: pulseState === 'hit-ready' ? (isNoise ? '#ff3344' : '#00ff88') : '#00f0ff' }}
            />
          </View>
        </View>
      </View>

      {/* 隐藏真相揭示 */}
      {revealedTruth && (
        <View className="px-4 mb-2 fade-in-up" style={{ position: 'relative', zIndex: 10 }}>
          <Card className="bg-[#1a1a2e] border-[#ff0066]/30">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#ff0066] font-semibold mb-1">深层记忆解码完成</Text>
              <Text className="block text-xs text-[#ff88aa]">
                {EMOTION_LABELS[currentCustomer.memory.emotion]} → {EMOTION_LABELS[currentCustomer.memory.hiddenEmotion]}
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      <View className="content-bottom-spacing" />

      {/* 底部操作区 */}
      <View className="game-bottom-bar" style={{ zIndex: 100 }}>
        <View className="game-primary-btn" style={{ backgroundColor: '#7b2ff7' }} onClick={handleComplete}>
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>完成鉴定</Text>
        </View>
        <View className="bottom-bar-row">
          <View className="game-secondary-btn"
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
