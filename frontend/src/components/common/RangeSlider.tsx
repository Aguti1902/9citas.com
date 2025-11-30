interface RangeSliderProps {
  min: number
  max: number
  valueMin: number
  valueMax: number
  onChange: (min: number, max: number) => void
  label: string
  unit?: string
  step?: number
}

export default function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  label,
  unit = '',
  step = 1,
}: RangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value)
    // Permitir movimiento hasta el máximo menos 1 paso
    if (newMin <= valueMax - step) {
      onChange(newMin, valueMax)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value)
    // Permitir movimiento hasta el mínimo más 1 paso
    if (newMax >= valueMin + step) {
      onChange(valueMin, newMax)
    }
  }

  // Calcular qué slider debe estar arriba según posición
  const minPercent = ((valueMin - min) / (max - min)) * 100
  const maxPercent = ((valueMax - min) / (max - min)) * 100
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-white font-semibold">{label}</label>
        <div className="text-primary font-bold">
          {valueMin}{unit} - {valueMax}{unit}
        </div>
      </div>

      <div className="relative h-12 pt-2">
        {/* Track background */}
        <div className="absolute top-5 left-0 right-0 h-2 bg-gray-700 rounded-full">
          {/* Active range */}
          <div
            className="absolute h-2 bg-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Max slider - debe estar DEBAJO para que min pueda moverse */}
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={handleMaxChange}
          step={step}
          className="absolute top-0 w-full h-full bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{
            zIndex: 1,
            pointerEvents: 'all',
          }}
        />

        {/* Min slider - debe estar ENCIMA para poder moverse libremente */}
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={handleMinChange}
          step={step}
          className="absolute top-0 w-full h-full bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{
            zIndex: 2,
            pointerEvents: 'all',
          }}
        />
      </div>
    </div>
  )
}

