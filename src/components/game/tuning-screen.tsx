import { useEffect, useRef, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS } from '@/store/game-store'

const WAVE_BARS = 64
const STABLE_TARGET = 180 // 3秒 @ 60fps

function WaveformDisplay({
  targetFreq, targetAmp, probeFreq, probeAmp,
  matchProgress, isActive, phase,
}: {
  targetFreq: number; targetAmp: number
  probeFreq: number; probeAmp: number
  matchProgress: number; isActive: boolean; phase: number
}) {
  const bars: Array<{ targetH: number; probeH: number }> = []

  for (let i = 0; i < WAVE_BARS; i++) {
    const t = (i / WAVE_BARS) * Math.PI * 4
    const targetH = Math.abs(Math.sin(t * (targetFreq / 50) + phase)) * (targetAmp / 100)
    const probeH = isActive ? Math.abs(Math.sin(t * (probeFreq / 50))) * (probeAmp / 100) : 0.05
    bars.push({ targetH, probeH })
  }

  const noiseOpacity = isActive ? Math.max(0, 1 - matchProgress / 100) : 1

  return (
    <View className="relative" style={{ width: '100%', aspectRatio: '16/10' }}>
      {/* CRT 背景 */}
      <View
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: '#0a1a0a',
          border: '2px solid #1a3a1a',
          boxShadow: 'inset 0 0 40px rgba(0, 255, 80, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* 扫描线 */}
        <View
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,80,0.03) 2px, rgba(0,255,80,0.03) 4px)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

        {/* 网格 */}
        <View className="absolute inset-0 flex flex-col" style={{ zIndex: 1, opacity: 0.2 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} className="flex-1" style={{ borderBottom: '1px solid rgba(0,255,80,0.15)' }} />
          ))}
        </View>
        <View className="absolute inset-0 flex flex-row" style={{ zIndex: 1, opacity: 0.2 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} className="flex-1" style={{ borderRight: '1px solid rgba(0,255,80,0.15)' }} />
          ))}
        </View>

        {/* 波形柱状图 */}
        <View
          className="absolute inset-0 flex flex-row items-center justify-center px-4"
          style={{ zIndex: 2, gap: 1 }}
        >
          {bars.map((bar, i) => {
            const targetTop = `${(1 - bar.targetH) * 45}%`
            const targetHeight = `${bar.targetH * 90}%`
            const probeTop = `${(1 - bar.probeH) * 45}%`
            const probeHeight = `${bar.probeH * 90}%`
            const isMatching = matchProgress > 70 && Math.abs(bar.targetH - bar.probeH) < 0.12
            return (
              <View key={i} className="flex-1 relative flex flex-col items-center" style={{ height: '100%', justifyContent: 'center' }}>
                {/* 基准波 */}
                {isActive && (
                  <View
                    style={{
                      position: 'absolute',
                      top: targetTop,
                      height: targetHeight,
                      width: '80%',
                      backgroundColor: matchProgress > 90 ? '#00ff66' : '#00aa44',
                      borderRadius: 1,
                      opacity: 0.7,
                      boxShadow: matchProgress > 90 ? '0 0 4px rgba(0,255,100,0.5)' : 'none',
                    }}
                  />
                )}
                {/* 探针波 */}
                <View
                  style={{
                    position: 'absolute',
                    top: probeTop,
                    height: probeHeight,
                    width: '60%',
                    backgroundColor: isMatching ? '#00ffcc' : '#44ccff',
                    borderRadius: 1,
                    opacity: isActive ? 0.9 : 0.3,
                    boxShadow: isMatching ? '0 0 6px rgba(0,255,200,0.6)' : '0 0 2px rgba(68,204,255,0.3)',
                    transition: 'all 0.08s linear',
                  }}
                />
              </View>
            )
          })}
        </View>

        {/* 中心水平线 */}
        <View
          className="absolute left-0 right-0"
          style={{
            top: '50%',
            height: 1,
            backgroundColor: 'rgba(0,255,80,0.3)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* 雪花噪点覆盖层 */}
        <View
          className="absolute inset-0"
          style={{
            zIndex: 6,
            opacity: noiseOpacity,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        />

        {/* 同步光环 */}
        {matchProgress >= 90 && (
          <View
            className="absolute inset-0 rounded-lg"
            style={{
              zIndex: 7,
              border: '2px solid rgba(0,255,136,0.5)',
              boxShadow: 'inset 0 0 30px rgba(0,255,136,0.15), 0 0 20px rgba(0,255,136,0.2)',
              animation: 'sync-pulse 0.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </View>
    </View>
  )
}

function KnobControl({
  label, value, color, onChange,
}: {
  label: string; value: number; color: string; onChange: (v: number) => void
}) {
  const knobRef = useRef<{ tracking: boolean; startY: number; startVal: number }>({
    tracking: false, startY: 0, startVal: 50,
  })

  const handleTouchStart = useCallback((e: any) => {
    const touch = e.touches?.[0] ?? e.changedTouches?.[0]
    if (touch) {
      knobRef.current = { tracking: true, startY: touch.clientY, startVal: value }
    }
  }, [value])

  const handleTouchMove = useCallback((e: any) => {
    if (!knobRef.current.tracking) return
    const touch = e.touches?.[0] ?? e.changedTouches?.[0]
    if (touch) {
      const deltaY = knobRef.current.startY - touch.clientY
      const newVal = Math.max(0, Math.min(100, knobRef.current.startVal + deltaY * 0.5))
      onChange(Math.round(newVal))
    }
  }, [onChange])

  const handleTouchEnd = useCallback(() => {
    knobRef.current.tracking = false
  }, [])

  const rotation = (value / 100) * 270 - 135

  return (
    <View className="flex flex-col items-center gap-2 flex-1">
      <Text className="block text-xs font-mono" style={{ color }}>{label}</Text>
      {/* 旋钮 */}
      <View
        className="relative flex items-center justify-center"
        style={{ width: 100, height: 100 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 旋钮底盘 */}
        <View
          className="absolute rounded-full"
          style={{
            width: 90,
            height: 90,
            backgroundColor: '#141420',
            border: '3px solid #2a2a40',
            boxShadow: '0 0 15px rgba(0,0,0,0.5)',
          }}
        />
        {/* 刻度标记 */}
        {[0, 45, 90, 135, 180, 225, 270].map((deg) => (
          <View
            key={deg}
            className="absolute"
            style={{
              width: 2,
              height: 8,
              backgroundColor: deg === 135 ? color : '#2a2a40',
              transform: `rotate(${deg - 135}deg) translateY(-35px)`,
              transformOrigin: 'center center',
              opacity: 0.6,
            }}
          />
        ))}
        {/* 旋钮指针 */}
        <View
          className="absolute"
          style={{
            width: 4,
            height: 30,
            backgroundColor: color,
            borderRadius: 2,
            transform: `rotate(${rotation}deg) translateY(-18px)`,
            transformOrigin: 'center center',
            boxShadow: `0 0 8px ${color}66`,
            transition: 'transform 0.05s linear',
          }}
        />
        {/* 中心圆 */}
        <View
          className="absolute rounded-full"
          style={{
            width: 24,
            height: 24,
            backgroundColor: '#1a1a2e',
            border: `2px solid ${color}66`,
          }}
        />
      </View>
      {/* 数值 */}
      <Text className="block text-lg font-mono font-bold" style={{ color }}>{value}</Text>
    </View>
  )
}

export function TuningScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const tuningTargetFreq = useGameStore((s) => s.tuningTargetFreq)
  const tuningTargetAmp = useGameStore((s) => s.tuningTargetAmp)
  const tuningProbeFreq = useGameStore((s) => s.tuningProbeFreq)
  const tuningProbeAmp = useGameStore((s) => s.tuningProbeAmp)
  const tuningMatchProgress = useGameStore((s) => s.tuningMatchProgress)
  const tuningStableFrames = useGameStore((s) => s.tuningStableFrames)
  const tuningIsActive = useGameStore((s) => s.tuningIsActive)
  const tuningPhase = useGameStore((s) => s.tuningPhase)
  const initTuning = useGameStore((s) => s.initTuning)
  const updateTuningKnobs = useGameStore((s) => s.updateTuningKnobs)
  const startTuningConnect = useGameStore((s) => s.startTuningConnect)
  const stopTuningConnect = useGameStore((s) => s.stopTuningConnect)
  const tickTuning = useGameStore((s) => s.tickTuning)
  const completeTuning = useGameStore((s) => s.completeTuning)
  const abortCustomer = useGameStore((s) => s.abortCustomer)

  const initedRef = useRef(false)
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastTickRef = useRef(Date.now())

  useEffect(() => {
    if (!initedRef.current) {
      initedRef.current = true
      initTuning()
    }
  }, [initTuning])

  // 60fps game loop
  useEffect(() => {
    lastTickRef.current = Date.now()
    animRef.current = setInterval(() => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      tickTuning(Math.min(delta, 50))
    }, 16)
    return () => {
      if (animRef.current) clearInterval(animRef.current)
    }
  }, [tickTuning])

  // 自动完成：稳定3秒后自动进入下一阶段
  useEffect(() => {
    if (tuningStableFrames >= STABLE_TARGET) {
      completeTuning()
    }
  }, [tuningStableFrames, completeTuning])

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]
  const stablePercent = Math.round((tuningStableFrames / STABLE_TARGET) * 100)

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay flex flex-col">
      {/* 顶部信息 */}
      <View className="px-4 pt-3 pb-1" style={{ zIndex: 10 }}>
        <View className="flex flex-row items-center gap-2 mb-2">
          <View className="flex flex-row items-center gap-1 flex-1">
            <Text className="block text-xs font-semibold text-[#00ff88]">脑波调频</Text>
            <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa] text-xs ml-1">
              {currentCustomer.memory.name}
            </Badge>
          </View>
          <Text className="block text-xs font-mono" style={{ color: emotionColor }}>
            纯{Math.round(appraisalPurity)}%
          </Text>
        </View>

        {/* 信号同步状态卡片 */}
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-2">
            <View className="flex flex-row items-center gap-3">
              <View className="flex flex-row items-center gap-1 flex-1">
                <Text className="block text-xs text-[#8888aa]">同步率</Text>
                <View className="flex-1 mx-1" style={{ height: 6, backgroundColor: '#0a0a0f', borderRadius: 3, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${tuningMatchProgress}%`,
                      backgroundColor: tuningMatchProgress > 90 ? '#00ff88' : tuningMatchProgress > 50 ? '#ffaa00' : '#ff3344',
                      borderRadius: 3,
                      transition: 'width 0.1s linear, background-color 0.3s ease',
                      boxShadow: tuningMatchProgress > 90 ? '0 0 8px rgba(0,255,136,0.5)' : 'none',
                    }}
                  />
                </View>
                <Text className="block text-xs font-mono" style={{
                  color: tuningMatchProgress > 90 ? '#00ff88' : tuningMatchProgress > 50 ? '#ffaa00' : '#ff3344',
                }}>{tuningMatchProgress}%</Text>
              </View>
              {tuningIsActive && tuningMatchProgress >= 90 && (
                <View className="flex flex-row items-center gap-1">
                  <View className="w-2 h-2 rounded-full" style={{
                    backgroundColor: stablePercent >= 80 ? '#00ff88' : '#ffaa00',
                    animation: 'breathe 0.5s ease-in-out infinite',
                  }} />
                  <Text className="block text-xs font-mono text-[#00ff88]">稳定 {stablePercent}%</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 中部：CRT 示波器 */}
      <View className="flex-1 flex flex-col items-center justify-center px-4" style={{ zIndex: 10 }}>
        <WaveformDisplay
          targetFreq={tuningTargetFreq}
          targetAmp={tuningTargetAmp}
          probeFreq={tuningProbeFreq}
          probeAmp={tuningProbeAmp}
          matchProgress={tuningMatchProgress}
          isActive={tuningIsActive}
          phase={tuningPhase}
        />

        {/* 状态提示 */}
        <View className="mt-3" style={{ minHeight: 24 }}>
          {!tuningIsActive ? (
            <Text className="block text-xs text-[#ffaa00] text-center animate-pulse">
              长按「接入」键开始神经链接...
            </Text>
          ) : tuningMatchProgress >= 90 ? (
            <Text className="block text-xs text-[#00ff88] text-center">
              ✓ 波形同步中 — 保持稳定...
            </Text>
          ) : tuningMatchProgress > 40 ? (
            <Text className="block text-xs text-[#ffaa00] text-center">
              接近同步...微调旋钮使波形重合
            </Text>
          ) : (
            <Text className="block text-xs text-[#ff3344] text-center">
              调整频率与振幅，使探针波匹配基准波
            </Text>
          )}
        </View>
      </View>

      {/* 中部：旋钮控制区 */}
      <View className="px-6 pb-2" style={{ zIndex: 10 }}>
        <View className="flex flex-row gap-4">
          <KnobControl
            label="频率 (FREQ)"
            value={tuningProbeFreq}
            color="#44ccff"
            onChange={(v) => updateTuningKnobs(v, tuningProbeAmp)}
          />
          <KnobControl
            label="振幅 (AMP)"
            value={tuningProbeAmp}
            color="#ff88cc"
            onChange={(v) => updateTuningKnobs(tuningProbeFreq, v)}
          />
        </View>
      </View>

      <View className="content-bottom-spacing" />

      {/* 底部操作区 */}
      <View className="game-bottom-bar" style={{ zIndex: 100 }}>
        {/* 长按接入键 */}
        <View
          className="game-primary-btn"
          style={{
            backgroundColor: tuningIsActive ? '#00aa44' : '#7b2ff7',
            transition: 'background-color 0.2s ease',
          }}
          onTouchStart={() => startTuningConnect()}
          onTouchEnd={() => stopTuningConnect()}
          onTouchCancel={() => stopTuningConnect()}
        >
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
            {tuningIsActive ? '● 接入中...' : '长按接入'}
          </Text>
        </View>
        <View className="bottom-bar-row">
          <View className="game-secondary-btn" style={{ justifyContent: 'center', flex: 1, borderColor: '#ff334444' }} onClick={abortCustomer}>
            <Text style={{ color: '#ff3344', fontSize: '14px' }}>中止交易</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
