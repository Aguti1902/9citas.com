import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { Sliders } from 'lucide-react'

interface AdvancedFiltersProps {
  isPremium: boolean
  onApplyFilters: (filters: { ageMin: number; ageMax: number; distance: number }) => void
  onPremiumRequired: () => void
}

export default function AdvancedFilters({
  isPremium,
  onApplyFilters,
  onPremiumRequired,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(99)
  const [distance, setDistance] = useState(50)

  const handleOpen = () => {
    if (!isPremium) {
      onPremiumRequired()
      return
    }
    setIsOpen(true)
  }

  const handleApply = () => {
    onApplyFilters({ ageMin, ageMax, distance })
    setIsOpen(false)
  }

  const handleReset = () => {
    setAgeMin(18)
    setAgeMax(99)
    setDistance(50)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
      >
        <Sliders className="w-4 h-4" />
        <span className="text-sm font-semibold">Filtros</span>
        {!isPremium && <span className="text-accent text-xs">⭐</span>}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filtros Avanzados"
        maxWidth="md"
      >
        <div className="space-y-6">
          {/* Filtro de Edad */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center justify-between">
              <span>Rango de Edad</span>
              <span className="text-primary text-lg">{ageMin} - {ageMax} años</span>
            </label>
            
            {/* Slider doble para rango */}
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Edad mínima: {ageMin}</label>
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={ageMin}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (value <= ageMax) {
                      setAgeMin(value)
                    }
                  }}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Edad máxima: {ageMax}</label>
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={ageMax}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (value >= ageMin) {
                      setAgeMax(value)
                    }
                  }}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Filtro de Distancia */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center justify-between">
              <span>Distancia Máxima</span>
              <span className="text-secondary text-lg">{distance} km</span>
            </label>
            
            <input
              type="range"
              min="1"
              max="100"
              step="5"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            
            {/* Marcadores de distancia */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
              <span>75 km</span>
              <span>100 km</span>
            </div>
          </div>

          {/* Vista previa */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Vista previa:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Usuarios entre {ageMin} y {ageMax} años</li>
              <li>• A menos de {distance} km de tu ubicación</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              onClick={handleReset}
            >
              Resetear
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleApply}
            >
              Aplicar Filtros
            </Button>
          </div>

          <p className="text-gray-500 text-xs text-center">
            Los filtros solo se aplican a usuarios de tu misma orientación
          </p>
        </div>
      </Modal>
    </>
  )
}
