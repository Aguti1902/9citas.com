import { Users, Wifi, Sparkles } from 'lucide-react'

interface FilterBarProps {
  activeFilters: string[]
  onFilterChange: (filters: string[], params?: any) => void
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
  const filters = [
    { id: 'all', label: 'TODOS', premium: false, Icon: Users },
    { id: 'online', label: 'ONLINE', premium: true, Icon: Wifi },
    { id: 'new', label: 'NUEVOS', premium: false, Icon: Sparkles },
  ]

  const toggleFilter = (filterId: string, premium: boolean) => {
    if (premium && !isPremium) {
      onPremiumRequired()
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

  const handleAgeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value)
    if (type === 'min') {
      onAgeRangeChange?.(numValue, ageRange.max)
    } else {
      onAgeRangeChange?.(ageRange.min, numValue)
    }
  }

  const handleDistanceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value)
    if (type === 'min') {
      onDistanceRangeChange?.(numValue, distanceRange.max)
    } else {
      onDistanceRangeChange?.(distanceRange.min, numValue)
    }
  }

  return (
    <div className="space-y-3">
      {/* Filtros principales */}
      <div className="overflow-x-auto px-2 pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-min">
          {filters.map((filter) => {
            const Icon = filter.Icon
            const isActive = activeFilters.includes(filter.id)
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id, filter.premium)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full transition-all flex-shrink-0 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold">{filter.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filtros de Edad y Distancia */}
      <div className="px-2 space-y-2">
        {/* Edad */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300">EDAD</span>
            {!isPremium && (
              <span className="text-[10px] bg-accent text-black px-2 py-0.5 rounded-full font-bold">
                9PLUS
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={ageRange.min}
              onChange={(e) => handleAgeChange('min', e.target.value)}
              disabled={!isPremium}
              className="flex-1 bg-gray-900 text-white text-sm rounded px-2 py-1 disabled:opacity-50"
            >
              {Array.from({ length: 82 }, (_, i) => i + 18).map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
            <span className="text-gray-500 text-xs">-</span>
            <select
              value={ageRange.max}
              onChange={(e) => handleAgeChange('max', e.target.value)}
              disabled={!isPremium}
              className="flex-1 bg-gray-900 text-white text-sm rounded px-2 py-1 disabled:opacity-50"
            >
              {Array.from({ length: 82 }, (_, i) => i + 18).map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Distancia */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300">DISTANCIA (KM)</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={distanceRange.min}
              onChange={(e) => handleDistanceChange('min', e.target.value)}
              className="flex-1 bg-gray-900 text-white text-sm rounded px-2 py-1"
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map(km => (
                <option key={km} value={km}>{km}</option>
              ))}
            </select>
            <span className="text-gray-500 text-xs">-</span>
            <select
              value={distanceRange.max}
              onChange={(e) => handleDistanceChange('max', e.target.value)}
              className="flex-1 bg-gray-900 text-white text-sm rounded px-2 py-1"
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map(km => (
                <option key={km} value={km}>{km}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
