import { useState } from 'react'
import { Users, Wifi, Calendar, MapPin, Sparkles, Star } from 'lucide-react'
import Modal from './Modal'
import RangeSlider from './RangeSlider'
import Button from './Button'

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string, params?: any) => void
  isPremium: boolean
  onPremiumRequired: () => void
  ageRange?: { min: number; max: number }
  distanceRange?: { min: number; max: number }
  onAgeRangeChange?: (min: number, max: number) => void
  onDistanceRangeChange?: (min: number, max: number) => void
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
  isPremium,
  onPremiumRequired,
  ageRange = { min: 18, max: 99 },
  distanceRange = { min: 1, max: 50 },
  onAgeRangeChange,
  onDistanceRangeChange,
}: FilterBarProps) {
  const [showAgeModal, setShowAgeModal] = useState(false)
  const [showDistanceModal, setShowDistanceModal] = useState(false)
  const [tempAgeRange, setTempAgeRange] = useState(ageRange)
  const [tempDistanceRange, setTempDistanceRange] = useState(distanceRange)

  const filters = [
    { id: 'all', label: 'TODOS', premium: false, Icon: Users },
    { id: 'online', label: 'ONLINE', premium: true, Icon: Wifi },
    { id: 'age', label: 'EDAD', premium: true, Icon: Calendar },
    { id: 'distance', label: 'DISTANCIA', premium: false, Icon: MapPin },
    { id: 'new', label: 'NUEVOS', premium: false, Icon: Sparkles },
  ]

  const handleFilterClick = (filterId: string, premium: boolean) => {
    if (premium && !isPremium) {
      onPremiumRequired()
      return
    }

    if (filterId === 'age') {
      setShowAgeModal(true)
    } else if (filterId === 'distance') {
      setShowDistanceModal(true)
    } else {
      onFilterChange(filterId)
    }
  }

  const handleApplyAgeFilter = () => {
    onAgeRangeChange?.(tempAgeRange.min, tempAgeRange.max)
    onFilterChange('age', { ageMin: tempAgeRange.min, ageMax: tempAgeRange.max })
    setShowAgeModal(false)
  }

  const handleApplyDistanceFilter = () => {
    onDistanceRangeChange?.(tempDistanceRange.min, tempDistanceRange.max)
    onFilterChange('distance', { distanceMin: tempDistanceRange.min, distanceMax: tempDistanceRange.max })
    setShowDistanceModal(false)
  }

  return (
    <>
      {/* Contenedor con scroll horizontal sin barra visible */}
      <div className="overflow-x-auto pb-2 px-2 scrollbar-hide">
        <div className="flex gap-2 min-w-min">
          {filters.map((filter) => {
            const Icon = filter.Icon
            const isActive = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id, filter.premium)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full transition-all flex-shrink-0 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold">{filter.label}</span>
                {filter.premium && !isPremium && (
                  <Star className="w-3 h-3 text-accent fill-accent ml-1" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal Filtro de Edad */}
      <Modal
        isOpen={showAgeModal}
        onClose={() => setShowAgeModal(false)}
        title="Filtrar por Edad"
        maxWidth="md"
      >
        <div className="space-y-6 p-4">
          <RangeSlider
            min={18}
            max={99}
            valueMin={tempAgeRange.min}
            valueMax={tempAgeRange.max}
            onChange={(min, max) => setTempAgeRange({ min, max })}
            label="Rango de edad"
            unit=" años"
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setTempAgeRange(ageRange)
                setShowAgeModal(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleApplyAgeFilter}
            >
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Filtro de Distancia */}
      <Modal
        isOpen={showDistanceModal}
        onClose={() => setShowDistanceModal(false)}
        title="Filtrar por Distancia"
        maxWidth="md"
      >
        <div className="space-y-6 p-4">
          <RangeSlider
            min={1}
            max={50}
            valueMin={tempDistanceRange.min}
            valueMax={tempDistanceRange.max}
            onChange={(min, max) => setTempDistanceRange({ min, max })}
            label="Rango de distancia"
            unit=" km"
            step={1}
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setTempDistanceRange(distanceRange)
                setShowDistanceModal(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleApplyDistanceFilter}
            >
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

