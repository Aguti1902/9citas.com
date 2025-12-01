import { useState } from 'react'
import { Users, Wifi, Calendar, MapPin, Sparkles, Star } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

interface FilterBarProps {
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
  isPremium: boolean
  onPremiumRequired: () => void
  ageRange?: { min: number; max: number }
  distanceRange?: { min: number; max: number }
  onAgeRangeChange?: (min: number, max: number) => void
  onDistanceRangeChange?: (min: number, max: number) => void
}

export default function FilterBar({
  activeFilters,
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
  const [tempAgeMin, setTempAgeMin] = useState(ageRange.min)
  const [tempAgeMax, setTempAgeMax] = useState(ageRange.max)
  const [tempDistanceMin, setTempDistanceMin] = useState(distanceRange.min)
  const [tempDistanceMax, setTempDistanceMax] = useState(distanceRange.max)

  const filters = [
    { id: 'all', label: 'TODOS', premium: false, Icon: Users },
    { id: 'online', label: 'ONLINE', premium: true, Icon: Wifi },
    { id: 'age', label: 'EDAD', premium: true, Icon: Calendar, isModal: true },
    { id: 'distance', label: 'DISTANCIA', premium: false, Icon: MapPin, isModal: true },
    { id: 'new', label: 'NUEVOS', premium: false, Icon: Sparkles },
  ]

  const toggleFilter = (filterId: string, premium: boolean, isModal?: boolean) => {
    if (premium && !isPremium) {
      onPremiumRequired()
      return
    }

    // Si es un filtro modal, abrir el modal
    if (isModal) {
      if (filterId === 'age') {
        setShowAgeModal(true)
      } else if (filterId === 'distance') {
        setShowDistanceModal(true)
      }
      return
    }

    if (filterId === 'all') {
      onFilterChange(['all'])
      return
    }

    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters.filter(f => f !== 'all'), filterId]

    onFilterChange(newFilters.length === 0 ? ['all'] : newFilters)
  }

  const handleApplyAge = () => {
    onAgeRangeChange?.(tempAgeMin, tempAgeMax)
    
    // Activar el filtro de edad
    if (!activeFilters.includes('age')) {
      const newFilters = [...activeFilters.filter(f => f !== 'all'), 'age']
      onFilterChange(newFilters)
    }
    
    setShowAgeModal(false)
  }

  const handleApplyDistance = () => {
    onDistanceRangeChange?.(tempDistanceMin, tempDistanceMax)
    
    // Activar el filtro de distancia
    if (!activeFilters.includes('distance')) {
      const newFilters = [...activeFilters.filter(f => f !== 'all'), 'distance']
      onFilterChange(newFilters)
    }
    
    setShowDistanceModal(false)
  }

  return (
    <>
      {/* Contenedor con scroll horizontal sin barra visible - Mejorado */}
      <div className="overflow-x-auto px-2 pb-1 scrollbar-hide">
        <div className="flex gap-2 min-w-min">
          {filters.map((filter) => {
            const Icon = filter.Icon
            const isActive = activeFilters.includes(filter.id)
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id, filter.premium, filter.isModal)}
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
        title="Filtrar por edad"
        maxWidth="sm"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Desde
              </label>
              <select
                value={tempAgeMin}
                onChange={(e) => setTempAgeMin(parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-lg"
              >
                {Array.from({ length: 82 }, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age} años</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Hasta
              </label>
              <select
                value={tempAgeMax}
                onChange={(e) => setTempAgeMax(parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-lg"
              >
                {Array.from({ length: 82 }, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age} años</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              onClick={() => setShowAgeModal(false)}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleApplyAge}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Filtro de Distancia */}
      <Modal
        isOpen={showDistanceModal}
        onClose={() => setShowDistanceModal(false)}
        title="Filtrar por distancia"
        maxWidth="sm"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Desde
              </label>
              <select
                value={tempDistanceMin}
                onChange={(e) => setTempDistanceMin(parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-lg"
              >
                {Array.from({ length: 50 }, (_, i) => i + 1).map(km => (
                  <option key={km} value={km}>{km} km</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Hasta
              </label>
              <select
                value={tempDistanceMax}
                onChange={(e) => setTempDistanceMax(parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-lg"
              >
                {Array.from({ length: 50 }, (_, i) => i + 1).map(km => (
                  <option key={km} value={km}>{km} km</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              onClick={() => setShowDistanceModal(false)}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleApplyDistance}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
