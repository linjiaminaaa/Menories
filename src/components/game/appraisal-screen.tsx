import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS, EMOTION_LABELS } from '@/store/game-store'

const FRAGMENT_COLORS = [
  EMOTION_COLORS.sadness, EMOTION_COLORS.anger, EMOTION_COLORS.joy,
  EMOTION_COLORS.fear, EMOTION_COLORS.nostalgia, EMOTION_COLORS.guilt,
  '#ffcc00', '#cc66ff',
]
const FRAGMENT_LABELS = ['悲', '怒', '喜', '惧', '怀', '罪', '⊕', '★']

// 赛博解码模拟文本
const DECODE_LINES = [
  'MEM_FRAG_ANALYZING...',
  'NEURAL_TRACE: ACTIVE',
  'SIG_INTEGRITY: SCANNING',
  'EMOTION_VECTOR: MAPPING',
  'QUANTUM_DECOHERENCE: 0.3%',
  'MNEMONIC_HASH: VERIFYING',
  'SYNAPSE_BRIDGE: LOCKED',
  'GHOST_SIGNAL: DETECTED',
]

function CyberPanel({ puzzleMoves, strippedCount, shellTotal, revealedTruth }: {
  puzzleMoves: number
  strippedCount: number
  shellTotal: number
  revealedTruth: boolean
}) {
  const [decodeLine, setDecodeLine] = useState(0)
  const [glitchTick, setGlitchTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setDecodeLine((prev) => (prev + 1) % DECODE_LINES.length)
      setGlitchTick((prev) => prev + 1)
    }, 1500)
    return () => clearInterval(t)
  }, [])

  const sigPercent = shellTotal > 0 ? Math.round((strippedCount / shellTotal) * 100) : 0
  const blocks = 10
  const filledBlocks = Math.round((sigPercent / 100) * blocks)

  return (
    <View className="mt-2 mb-2">
      <Card className="bg-[#0d0d14] border-[#1a1a2e]" style={{ overflow: 'hidden' }}>
        {/* 终端标题栏 */}
        <View className="flex flex-row items-center justify-between px-3 py-1.5"
          style={{ backgroundColor: '#0a0a10', borderBottom: '1px solid #1a1a2e' }}
        >
          <View className="flex flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff3344' }} />
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffaa00' }} />
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ff88' }} />
          </View>
          <Text className="block text-xs font-mono text-[#444466]">NEURAL_DECODER v2.7</Text>
          <View className="w-10" />
        </View>

        <CardContent className="p-2">
          {/* 解码状态行 */}
          <View className="flex flex-row items-center justify-between mb-2">
            <View className="flex flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-[#00ff88] breathe" />
              <Text className="block text-xs font-mono text-[#00ff88]">
                {revealedTruth ? 'DECODE_COMPLETE' : DECODE_LINES[decodeLine]}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1">
              <Text className="block text-xs font-mono text-[#00f0ff]">
                {String(glitchTick).padStart(3, '0')}
              </Text>
              <Text className="block text-xs text-[#444466]">TICK</Text>
            </View>
          </View>

          {/* 信号完整性条 + 碎片计数 */}
          <View className="flex flex-row items-center gap-3">
            <View className="flex-1">
              <View className="flex flex-row items-center justify-between mb-1">
                <Text className="block text-xs font-mono text-[#8888aa]">SIG_INTEGRITY</Text>
                <Text className="block text-xs font-mono" style={{
                  color: sigPercent > 60 ? '#00ff88' : sigPercent > 30 ? '#ffaa00' : '#ff3344'
                }}>{sigPercent}%</Text>
              </View>
              <View className="flex flex-row gap-1">
                {Array.from({ length: blocks }).map((_, i) => (
                  <View key={i} className="flex-1 h-1.5 rounded-sm transition-all duration-300"
                    style={{
                      backgroundColor: i < filledBlocks
                        ? (sigPercent > 60 ? '#00ff88' : sigPercent > 30 ? '#ffaa00' : '#ff3344')
                        : '#1a1a2e',
                      boxShadow: i < filledBlocks ? `0 0 3px ${sigPercent > 60 ? '#00ff8844' : '#ffaa0044'}` : 'none',
                    }}
                  />
                ))}
              </View>
            </View>

            <View className="flex flex-col items-center">
              <Text className="block text-xs font-mono text-[#cc66ff]">{shellTotal - strippedCount}</Text>
              <Text className="block text-xs text-[#444466]">FRAG</Text>
            </View>

            <View className="flex flex-col items-center">
              <Text className="block text-xs font-mono text-[#ffaa00]">{puzzleMoves}</Text>
              <Text className="block text-xs text-[#444466]">STEP</Text>
            </View>
          </View>

          {/* 随机十六进制数据流 */}
          <View className="flex flex-row mt-2 pt-2" style={{ borderTop: '1px solid #1a1a2e' }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const hex = '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
              const fade = i / 16
              return (
                <Text key={`${glitchTick}-${i}`} className="block text-xs font-mono"
                  style={{
                    color: '#1a1a2e',
                    opacity: 0.3 + fade * 0.5,
                    width: 14,
                    textAlign: 'center',
                  }}
                >
                  {hex}
                </Text>
              )
            })}
          </View>
        </CardContent>
      </Card>
    </View>
  )
}

export function AppraisalScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const appraisalCompleteness = useGameStore((s) => s.appraisalCompleteness)
  const revealedTruth = useGameStore((s) => s.revealedTruth)
  const puzzleGrid = useGameStore((s) => s.puzzleGrid)
  const puzzleRound = useGameStore((s) => s.puzzleRound)
  const puzzleShellTotal = useGameStore((s) => s.puzzleShellTotal)
  const puzzleShellRemaining = useGameStore((s) => s.puzzleShellRemaining)
  const puzzleMoves = useGameStore((s) => s.puzzleMoves)
  const initPuzzle = useGameStore((s) => s.initPuzzle)
  const moveFragment = useGameStore((s) => s.moveFragment)
  const completeAppraisal = useGameStore((s) => s.completeAppraisal)
  const abortCustomer = useGameStore((s) => s.abortCustomer)

  const initedRef = useRef(false)

  // Init first puzzle round
  useEffect(() => {
    if (!initedRef.current) {
      initedRef.current = true
      initPuzzle()
    }
  }, [initPuzzle])

  // Auto-start next round when puzzle is solved (grid becomes solved)
  const prevRoundRef = useRef(puzzleRound)
  useEffect(() => {
    if (puzzleRound > prevRoundRef.current && puzzleShellRemaining > 0) {
      // Small delay then auto-start next round
      const t = setTimeout(() => initPuzzle(), 600)
      prevRoundRef.current = puzzleRound
      return () => clearTimeout(t)
    }
    prevRoundRef.current = puzzleRound
  }, [puzzleRound, puzzleShellRemaining, initPuzzle])

  const handleTileTap = useCallback((row: number, col: number) => {
    moveFragment(row, col)
  }, [moveFragment])

  const handleComplete = useCallback(() => completeAppraisal(), [completeAppraisal])

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]
  const strippedCount = puzzleShellTotal - puzzleShellRemaining
  const size = puzzleGrid.length || 3

  // Find empty position
  let emptyR = -1, emptyC = -1
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (puzzleGrid[r]?.[c] === 0) { emptyR = r; emptyC = c }
    }
  }

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay flex flex-col">
      {/* === 顶部信息 === */}
      <View className="px-4 pt-3 pb-1" style={{ zIndex: 10 }}>
        <View className="flex flex-row items-center gap-2 mb-2">
          <View className="flex flex-row items-center gap-1 flex-1">
            <Text className="block text-xs font-semibold text-[#00f0ff]">记忆碎片重组</Text>
            <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa] text-xs ml-1">
              {currentCustomer.memory.name}
            </Badge>
          </View>
          <Text className="block text-xs font-mono" style={{ color: emotionColor }}>纯{Math.round(appraisalPurity)}%</Text>
          <Text className="block text-xs font-mono" style={{ color: appraisalCompleteness > 60 ? '#00ff88' : '#ffaa00' }}>整{Math.round(appraisalCompleteness)}%</Text>
        </View>

        {/* 外壳 + 步数 信息条 */}
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-2">
            <View className="flex flex-row items-center gap-3">
              <View className="flex flex-row items-center gap-1 flex-1">
                <Text className="block text-xs text-[#8888aa]">外壳</Text>
                {Array.from({ length: puzzleShellTotal }).map((_, i) => (
                  <View key={i} className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: i < strippedCount ? '#00ff88' : '#2a2a40',
                      boxShadow: i < strippedCount ? '0 0 4px #00ff88' : 'none',
                    }}
                  />
                ))}
                <Text className="block text-xs font-mono text-[#00f0ff] ml-1">{strippedCount}/{puzzleShellTotal}</Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <Text className="block text-xs text-[#8888aa]">步数</Text>
                <Text className="block text-sm font-mono text-[#ffaa00]">{puzzleMoves}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 赛博诊断面板 */}
        <CyberPanel puzzleMoves={puzzleMoves} strippedCount={strippedCount} shellTotal={puzzleShellTotal} revealedTruth={revealedTruth} />
      </View>

      {/* === 中部：拼图网格 === */}
      <View className="flex-1 flex flex-col items-center justify-center px-4" style={{ zIndex: 10 }}>
        {/* 目标参考（迷你） */}
        <View className="mb-2 flex flex-row items-center gap-2">
          <Text className="block text-xs text-[#444466]">目标排列:</Text>
          <View className="flex flex-row gap-1">
            {FRAGMENT_LABELS.slice(0, size * size - 1).map((label, i) => (
              <View key={i} className="w-5 h-5 rounded flex items-center justify-center"
                style={{ backgroundColor: `${FRAGMENT_COLORS[i]}44`, border: `1px solid ${FRAGMENT_COLORS[i]}66` }}
              >
                <Text className="block text-xs" style={{ color: FRAGMENT_COLORS[i], fontSize: 9 }}>{label}</Text>
              </View>
            ))}
            <View className="w-5 h-5 rounded border border-dashed border-[#2a2a40]" />
          </View>
        </View>

        {/* 拼图网格 */}
        <View className="p-2 rounded-xl" style={{ backgroundColor: '#141420', border: '2px solid #2a2a40' }}>
          {puzzleGrid.map((row, r) => (
            <View key={r} className="flex flex-row">
              {row.map((val, c) => {
                const isEmpty = val === 0
                const isAdjacent = Math.abs(r - emptyR) + Math.abs(c - emptyC) === 1
                const colorIdx = val - 1
                const bgColor = isEmpty ? 'transparent' : FRAGMENT_COLORS[colorIdx] || '#444466'
                const label = isEmpty ? '' : FRAGMENT_LABELS[colorIdx] || '?'

                return (
                  <View
                    key={`${r}-${c}`}
                    className="flex items-center justify-center m-0.5 rounded-lg transition-all duration-150"
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: isEmpty ? 'rgba(255,255,255,0.03)' : `${bgColor}22`,
                      border: isEmpty
                        ? '2px dashed #2a2a40'
                        : isAdjacent
                        ? `2px solid ${bgColor}66`
                        : `1px solid ${bgColor}33`,
                      boxShadow: isEmpty
                        ? 'none'
                        : isAdjacent
                        ? `0 0 12px ${bgColor}33`
                        : 'none',
                      transform: isAdjacent && !isEmpty ? 'scale(1.03)' : 'scale(1)',
                    }}
                    onClick={isAdjacent && !isEmpty ? () => handleTileTap(r, c) : undefined}
                  >
                    {!isEmpty && (
                      <Text className="block text-xl font-bold"
                        style={{ color: bgColor, textShadow: `0 0 8px ${bgColor}66` }}
                      >
                        {label}
                      </Text>
                    )}
                  </View>
                )
              })}
            </View>
          ))}
        </View>

        {/* 操作提示 */}
        <View className="mt-3" style={{ minHeight: 24 }}>
          {puzzleShellRemaining <= 0 && revealedTruth ? (
            <Text className="block text-sm font-semibold text-[#00ff88] text-center">
              ✓ 全部碎片已重组 — 记忆真相显现
            </Text>
          ) : puzzleGrid.length === 0 ? (
            <Text className="block text-xs text-[#444466] text-center">初始化中...</Text>
          ) : (
            <Text className="block text-xs text-[#8888aa] text-center">
              点击与空位相邻的碎片将其滑入空位，按目标顺序排列
            </Text>
          )}
        </View>
      </View>

      {/* 隐藏真相揭示 */}
      {revealedTruth && (
        <View className="px-4 mb-2 fade-in-up" style={{ zIndex: 10 }}>
          <Card className="bg-[#1a1a2e] border-[#ff0066]/30">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#ff0066] font-semibold mb-1">深层记忆解码完成</Text>
              <Text className="block text-xs text-[#ff88aa]">
                {EMOTION_LABELS[currentCustomer.memory.emotion]} → {EMOTION_LABELS[currentCustomer.memory.hiddenEmotion]}
              </Text>
              <Text className="block text-xs text-[#8888aa] mt-1">{currentCustomer.memory.hiddenTruth}</Text>
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
          <View className="game-secondary-btn" style={{ justifyContent: 'center', flex: 1, borderColor: '#ff334444' }} onClick={abortCustomer}>
            <Text style={{ color: '#ff3344', fontSize: '14px' }}>中止交易</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
