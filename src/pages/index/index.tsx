import { View } from '@tarojs/components'
import { useGameStore } from '@/store/game-store'
import { HubScreen } from '@/components/game/hub-screen'
import { DialogScreen } from '@/components/game/dialog-screen'
import { TuningScreen } from '@/components/game/tuning-screen'
import { PurifyScreen } from '@/components/game/purify-screen'
import { TradingScreen } from '@/components/game/trading-screen'
import { ResultScreen } from '@/components/game/result-screen'
import { StorageScreen } from '@/components/game/storage-screen'
import { ClosingScreen } from '@/components/game/closing-screen'
import './index.css'

export default function Index() {
  const phase = useGameStore((s) => s.phase)
  const removeFromInventory = useGameStore((s) => s.removeFromInventory)
  const applyFixative = useGameStore((s) => s.applyFixative)
  const returnToHub = useGameStore((s) => s.returnToHub)
  const inventory = useGameStore((s) => s.inventory)

  const handleSellMemory = (id: string) => {
    const mem = inventory.find((m) => m.id === id)
    if (mem) {
      const sellPrice = Math.round(mem.basePrice * (mem.purity / 100) * (mem.completeness / 100) * mem.rarity * 0.6)
      removeFromInventory(id, sellPrice)
    }
  }

  const handleApplyFixative = (id: string) => {
    applyFixative(id)
  }

  return (
    <View className="game-container">
      {phase === 'hub' && <HubScreen />}
      {phase === 'dialog' && <DialogScreen />}
      {phase === 'tuning' && <TuningScreen />}
      {phase === 'purify' && <PurifyScreen />}
      {phase === 'trading' && <TradingScreen />}
      {phase === 'result' && <ResultScreen />}
      {phase === 'closing' && <ClosingScreen />}
      {phase === 'storage' && (
        <StorageScreen
          onSellMemory={handleSellMemory}
          onApplyFixative={handleApplyFixative}
          onClose={returnToHub}
        />
      )}
    </View>
  )
}
