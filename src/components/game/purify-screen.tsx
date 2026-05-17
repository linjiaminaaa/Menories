import { useEffect, useRef, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameStore, EMOTION_COLORS } from '@/store/game-store'

const LANTERN_RADIUS = 22 // 灯笼半径(百分比单位)

function MemoryScene({
  impurities, lanternX, lanternY, lanternActive,
  coreHealth,
}: {
  impurities: Array<{ id: string; x: number; y: number; size: number; health: number; maxHealth: number; type: 'tar' | 'mold' }>
  lanternX: number; lanternY: number; lanternActive: boolean
  coreHealth: number
}) {
  return (
    <View
      className="relative rounded-xl"
      style={{
        width: '100%',
        aspectRatio: '1',
        backgroundColor: '#1a1a18',
        border: '2px solid #2a2a20',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}
    >
      {/* 场景背景 — 阁楼 */}
      {/* 窗户光 */}
      <View
        className="absolute"
        style={{
          top: '8%', left: '15%',
          width: '22%', height: '30%',
          backgroundColor: 'rgba(255,220,160,0.12)',
          borderRadius: '4px',
          boxShadow: '0 0 30px rgba(255,220,160,0.1)',
        }}
      />
      {/* 窗户十字 */}
      <View className="absolute" style={{ top: '8%', left: '25.5%', width: 1, height: '30%', backgroundColor: 'rgba(255,220,160,0.15)' }} />
      <View className="absolute" style={{ top: '22%', left: '15%', width: '22%', height: 1, backgroundColor: 'rgba(255,220,160,0.15)' }} />

      {/* 地板纹理 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={`floor-${i}`}
          className="absolute"
          style={{
            bottom: '10%',
            left: `${5 + i * 15}%`,
            width: '14%',
            height: '2%',
            backgroundColor: 'rgba(180,160,140,0.08)',
            borderRadius: 1,
          }}
        />
      ))}

      {/* 八音盒（核心物体） */}
      <View
        className="absolute flex flex-col items-center justify-center"
        style={{
          top: '42%', left: '38%',
          width: '24%', height: '24%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* 八音盒底座 */}
        <View
          style={{
            width: '70%', height: '50%',
            backgroundColor: coreHealth > 30 ? '#3a2a1a' : '#2a1010',
            borderRadius: 6,
            border: `2px solid ${coreHealth > 30 ? 'rgba(180,140,100,0.3)' : 'rgba(255,50,50,0.4)'}`,
            boxShadow: coreHealth > 50
              ? '0 0 15px rgba(255,200,100,0.15)'
              : '0 0 10px rgba(255,50,50,0.3)',
            transition: 'all 0.5s ease',
          }}
        />
        {/* 八音盒小人 */}
        <View
          style={{
            width: 4, height: '35%',
            backgroundColor: coreHealth > 30 ? 'rgba(200,180,160,0.4)' : 'rgba(255,100,100,0.4)',
            borderRadius: 2,
            position: 'absolute',
            top: '10%',
            transition: 'all 0.5s ease',
          }}
        />
        {/* 核心生命条 */}
        <View
          className="absolute"
          style={{
            bottom: -10,
            width: '80%',
            height: 3,
            backgroundColor: '#1a1a1a',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${coreHealth}%`,
              backgroundColor: coreHealth > 60 ? '#ffaa44' : coreHealth > 30 ? '#ff6644' : '#ff2244',
              transition: 'width 0.3s ease',
            }}
          />
        </View>
      </View>

      {/* 浮尘粒子 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <View
          key={`dust-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 80}%`,
            backgroundColor: 'rgba(200,200,180,0.15)',
            opacity: 0.2 + Math.random() * 0.3,
          }}
        />
      ))}

      {/* 杂质 */}
      {impurities.map((imp) => {
        if (imp.health <= 0) return null
        const inLight = lanternActive && (() => {
          const dx = imp.x - lanternX
          const dy = imp.y - lanternY
          return Math.sqrt(dx * dx + dy * dy) < LANTERN_RADIUS
        })()
        const healthPct = imp.health / imp.maxHealth
        const isBurning = inLight && lanternActive

        return (
          <View
            key={imp.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${imp.x}%`,
              top: `${imp.y}%`,
              width: `${imp.size * 2}%`,
              height: `${imp.size * 2}%`,
              transform: 'translate(-50%, -50%)',
              opacity: inLight ? 1 : 0,
              transition: 'opacity 0.2s ease',
              zIndex: inLight ? 8 : 1,
            }}
          >
            {/* 杂质本体 */}
            <View
              className="rounded-full flex items-center justify-center"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: imp.type === 'tar'
                  ? `rgba(10,5,0,${0.5 + healthPct * 0.5})`
                  : `rgba(20,5,30,${0.5 + healthPct * 0.5})`,
                border: `2px solid ${imp.type === 'tar' ? 'rgba(80,40,10,0.6)' : 'rgba(100,20,80,0.6)'}`,
                boxShadow: isBurning
                  ? `0 0 ${10 + (1 - healthPct) * 20}px rgba(255,150,50,${0.4 + (1 - healthPct) * 0.6})`
                  : 'none',
                transform: isBurning ? `scale(${0.8 + (1 - healthPct) * 0.5})` : 'scale(1)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {/* 内部挣扎纹理 */}
              {imp.type === 'tar' && (
                <View
                  className="rounded-full"
                  style={{
                    width: `${30 + Math.random() * 40}%`,
                    height: `${30 + Math.random() * 40}%`,
                    backgroundColor: 'rgba(255,100,20,0.3)',
                    animation: 'impurity-pulse 0.8s ease-in-out infinite',
                  }}
                />
              )}
              {imp.type === 'mold' && (
                <View style={{
                  width: '60%', height: '60%',
                  borderRadius: '30% 70% 50% 50%',
                  backgroundColor: 'rgba(200,50,150,0.3)',
                  animation: 'impurity-pulse 1.2s ease-in-out infinite',
                }} />
              )}
            </View>

            {/* 生命条（燃烧中显示） */}
            {isBurning && (
              <View
                className="absolute"
                style={{
                  bottom: -6,
                  width: '80%',
                  height: 2,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${imp.health}%`,
                    backgroundColor: healthPct > 0.5 ? '#ff8844' : '#ff4422',
                    transition: 'width 0.1s linear',
                  }}
                />
              </View>
            )}

            {/* 沸腾粒子 */}
            {isBurning && healthPct < 0.8 && (
              <View
                className="absolute rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  backgroundColor: 'rgba(255,200,100,0.6)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: 'burn-particle 0.5s ease-out forwards',
                }}
              />
            )}
          </View>
        )
      })}

      {/* 真理提灯光圈 */}
      {lanternActive && (
        <View
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${lanternX}%`,
            top: `${lanternY}%`,
            width: `${LANTERN_RADIUS * 2}%`,
            height: `${LANTERN_RADIUS * 2}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,220,140,0.15) 0%, rgba(255,200,100,0.06) 40%, rgba(255,180,60,0.02) 70%, transparent 100%)',
            border: '1.5px solid rgba(255,200,120,0.3)',
            boxShadow: '0 0 30px rgba(255,200,120,0.12), inset 0 0 30px rgba(255,200,120,0.05)',
            zIndex: 7,
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
        />
      )}

      {/* 暗角效果 */}
      <View
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)',
          zIndex: 10,
        }}
      />
    </View>
  )
}

export function PurifyScreen() {
  const currentCustomer = useGameStore((s) => s.currentCustomer)
  const appraisalPurity = useGameStore((s) => s.appraisalPurity)
  const revealedTruth = useGameStore((s) => s.revealedTruth)
  const purifyImpurities = useGameStore((s) => s.purifyImpurities)
  const purifyLanternX = useGameStore((s) => s.purifyLanternX)
  const purifyLanternY = useGameStore((s) => s.purifyLanternY)
  const purifyLanternActive = useGameStore((s) => s.purifyLanternActive)
  const purifyCoreHealth = useGameStore((s) => s.purifyCoreHealth)
  const purifyTotalImpurities = useGameStore((s) => s.purifyTotalImpurities)
  const purifyClearedImpurities = useGameStore((s) => s.purifyClearedImpurities)
  const updateLantern = useGameStore((s) => s.updateLantern)
  const tickPurify = useGameStore((s) => s.tickPurify)
  const completePurify = useGameStore((s) => s.completePurify)
  const abortCustomer = useGameStore((s) => s.abortCustomer)

  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastTickRef = useRef(Date.now())
  const sceneBoundsRef = useRef<{ w: number; h: number; left: number; top: number }>({ w: 300, h: 300, left: 16, top: 200 })

  // 初始化场景边界
  useEffect(() => {
    try {
      const sysInfo = Taro.getSystemInfoSync()
      const screenW = sysInfo.windowWidth ?? 375
      const paddingX = 32 // px-4 * 2
      const sceneW = screenW - paddingX
      const sceneH = sceneW // aspect-ratio: 1
      // Estimate top offset: status bar + header area ≈ 180px
      const sceneTop = 180
      sceneBoundsRef.current = { w: sceneW, h: sceneH, left: 16, top: sceneTop }
    } catch { /* ignore */ }
  }, [])

  // 60fps game loop
  useEffect(() => {
    lastTickRef.current = Date.now()
    animRef.current = setInterval(() => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      tickPurify(Math.min(delta, 50))
    }, 16)
    return () => {
      if (animRef.current) clearInterval(animRef.current)
    }
  }, [tickPurify])

  // 触摸事件：计算灯笼位置百分比
  const getPercentPos = useCallback((clientX: number, clientY: number) => {
    const { left, top, w, h } = sceneBoundsRef.current
    const x = ((clientX - left) / w) * 100
    const y = ((clientY - top) / h) * 100
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    }
  }, [])

  const handleTouchStart = useCallback((e: any) => {
    const touch = e.touches?.[0] ?? e.changedTouches?.[0]
    if (touch) {
      const pos = getPercentPos(touch.clientX, touch.clientY)
      updateLantern(pos.x, pos.y, true)
    }
  }, [getPercentPos, updateLantern])

  const handleTouchMove = useCallback((e: any) => {
    const touch = e.touches?.[0] ?? e.changedTouches?.[0]
    if (touch) {
      const pos = getPercentPos(touch.clientX, touch.clientY)
      updateLantern(pos.x, pos.y, true)
    }
  }, [getPercentPos, updateLantern])

  const handleTouchEnd = useCallback(() => {
    updateLantern(purifyLanternX, purifyLanternY, false)
  }, [updateLantern, purifyLanternX, purifyLanternY])

  if (!currentCustomer) return null

  const emotionColor = EMOTION_COLORS[currentCustomer.memory.emotion]
  const remainingImpurities = purifyTotalImpurities - purifyClearedImpurities

  return (
    <View className="min-h-screen bg-[#0a0a0f] scanline-overlay flex flex-col">
      {/* 顶部信息 */}
      <View className="px-4 pt-3 pb-1" style={{ zIndex: 10 }}>
        <View className="flex flex-row items-center gap-2 mb-2">
          <View className="flex flex-row items-center gap-1 flex-1">
            <Text className="block text-xs font-semibold text-[#ffaa44]">光影显形 · 净化记忆</Text>
            <Badge variant="outline" className="border-[#2a2a40] text-[#8888aa] text-xs ml-1">
              {currentCustomer.memory.name}
            </Badge>
          </View>
          <Text className="block text-xs font-mono" style={{ color: emotionColor }}>纯{Math.round(appraisalPurity)}%</Text>
        </View>

        {/* 状态卡片 */}
        <Card className="bg-[#141420] border-[#2a2a40]">
          <CardContent className="p-2">
            <View className="flex flex-row items-center gap-3">
              <View className="flex flex-row items-center gap-1 flex-1">
                <Text className="block text-xs text-[#8888aa]">残留杂质</Text>
                {Array.from({ length: purifyTotalImpurities }).map((_, i) => (
                  <View
                    key={i}
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i < purifyClearedImpurities ? '#00ff88' : '#2a2a40',
                      boxShadow: i < purifyClearedImpurities ? '0 0 6px rgba(0,255,136,0.5)' : 'none',
                    }}
                  />
                ))}
                <Text className="block text-xs font-mono text-[#ffaa44] ml-1">
                  {purifyClearedImpurities}/{purifyTotalImpurities}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <Text className="block text-xs text-[#8888aa]">核心</Text>
                <View style={{ width: 40, height: 4, backgroundColor: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${purifyCoreHealth}%`,
                      backgroundColor: purifyCoreHealth > 60 ? '#ffaa44' : purifyCoreHealth > 30 ? '#ff6644' : '#ff2244',
                      borderRadius: 2,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 中部：记忆场景 */}
      <View className="flex-1 flex flex-col items-center justify-center px-4" style={{ zIndex: 10 }}>
        {/* 场景描述 */}
        <View className="mb-2 w-full">
          <Text className="block text-xs text-[#666688] italic text-center">
            {currentCustomer.memory.description}
          </Text>
        </View>

        {/* 场景 */}
        <View
          className="w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <MemoryScene
            impurities={purifyImpurities}
            lanternX={purifyLanternX}
            lanternY={purifyLanternY}
            lanternActive={purifyLanternActive}
            coreHealth={purifyCoreHealth}
          />
        </View>

        {/* 操作提示 */}
        <View className="mt-3" style={{ minHeight: 24 }}>
          {remainingImpurities <= 0 && revealedTruth ? (
            <Text className="block text-sm font-semibold text-[#00ff88] text-center">
              ✓ 全部杂质已净化 — 记忆真相显现
            </Text>
          ) : purifyLanternActive ? (
            <Text className="block text-xs text-[#ffaa44] text-center">
              保持灯笼笼罩杂质持续灼烧...
            </Text>
          ) : (
            <Text className="block text-xs text-[#8888aa] text-center">
              按住屏幕点亮真理提灯，寻找隐藏的记忆杂质
            </Text>
          )}
        </View>
      </View>

      {/* 隐藏真相揭示 */}
      {revealedTruth && (
        <View className="px-4 mb-2 fade-in-up" style={{ zIndex: 10 }}>
          <Card className="bg-[#1a1a2e] border-[#ff0066]/30">
            <CardContent className="p-3">
              <Text className="block text-xs text-[#ff0066] font-semibold mb-1">深层记忆净化完成</Text>
              <Text className="block text-xs text-[#ff88aa]">
                {currentCustomer.memory.hiddenTruth}
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      <View className="content-bottom-spacing" />

      {/* 底部操作区 */}
      <View className="game-bottom-bar" style={{ zIndex: 100 }}>
        <View
          className="game-primary-btn"
          style={{
            backgroundColor: remainingImpurities <= 0 ? '#ffaa44' : '#555555',
          }}
          onClick={remainingImpurities <= 0 ? () => completePurify() : undefined}
        >
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
            {remainingImpurities <= 0 ? '完成净化' : `剩余杂质: ${remainingImpurities}`}
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
