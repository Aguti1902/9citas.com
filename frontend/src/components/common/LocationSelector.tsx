import { useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import Modal from './Modal'

interface LocationSelectorProps {
  currentCity: string
  onLocationChange: (city: string, lat: number, lng: number) => void
}

// Ciudades españolas principales con coordenadas
const SPANISH_CITIES = [
  { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
  { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Murcia', lat: 37.9922, lng: -1.1307 },
  { name: 'Palma', lat: 39.5696, lng: 2.6502 },
  { name: 'Las Palmas', lat: 28.1248, lng: -15.4300 },
  { name: 'Bilbao', lat: 43.2630, lng: -2.9350 },
  { name: 'Alicante', lat: 38.3452, lng: -0.4810 },
  { name: 'Córdoba', lat: 37.8882, lng: -4.7794 },
  { name: 'Valladolid', lat: 41.6523, lng: -4.7245 },
  { name: 'Vigo', lat: 42.2406, lng: -8.7207 },
  { name: 'Gijón', lat: 43.5450, lng: -5.6619 },
  { name: 'Hospitalet de Llobregat', lat: 41.3598, lng: 2.0994 },
  { name: 'A Coruña', lat: 43.3623, lng: -8.4115 },
  { name: 'Granada', lat: 37.1773, lng: -3.5986 },
  { name: 'Vitoria', lat: 42.8467, lng: -2.6716 },
  { name: 'Elche', lat: 38.2699, lng: -0.6983 },
  { name: 'Oviedo', lat: 43.3614, lng: -5.8593 },
  { name: 'Santa Cruz de Tenerife', lat: 28.4698, lng: -16.2549 },
  { name: 'Badalona', lat: 41.4502, lng: 2.2451 },
  { name: 'Cartagena', lat: 37.6256, lng: -0.9960 },
  { name: 'Terrassa', lat: 41.5633, lng: 2.0099 },
  { name: 'Jerez', lat: 36.6862, lng: -6.1367 },
  { name: 'Sabadell', lat: 41.5433, lng: 2.1092 },
  { name: 'Móstoles', lat: 40.3230, lng: -3.8651 },
  { name: 'Alcalá de Henares', lat: 40.4818, lng: -3.3634 },
  { name: 'Pamplona', lat: 42.8125, lng: -1.6458 },
]

export default function LocationSelector({ currentCity, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCities = SPANISH_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización')
      return
    }

    setIsGettingLocation(true)
    setIsOpen(false) // Cerrar el modal inmediatamente
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Buscar la ciudad más cercana en nuestra lista
          let closestCity = SPANISH_CITIES[0]
          let minDistance = Infinity

          SPANISH_CITIES.forEach(city => {
            const distance = Math.sqrt(
              Math.pow(city.lat - latitude, 2) + Math.pow(city.lng - longitude, 2)
            )
            if (distance < minDistance) {
              minDistance = distance
              closestCity = city
            }
          })

          onLocationChange(closestCity.name, latitude, longitude)
        } catch (error) {
          console.error('Error al obtener ciudad:', error)
          alert('No se pudo determinar tu ciudad')
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error('Error de geolocalización:', error)
        alert('No se pudo obtener tu ubicación. Por favor, permite el acceso a tu ubicación.')
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSelectCity = (city: typeof SPANISH_CITIES[0]) => {
    onLocationChange(city.name, city.lat, city.lng)
    setIsOpen(false)
  }

  return (
    <>
      {/* Botón selector de ubicación - UN SOLO BOTÓN */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors min-w-0 flex-shrink-0"
        title="Cambiar ubicación"
      >
        <MapPin className="w-4 h-4 text-white flex-shrink-0" />
        <span className="text-white text-sm font-medium truncate hidden sm:inline">
          {currentCity}
        </span>
        <span className="text-white text-xs font-medium truncate sm:hidden">
          {currentCity}
        </span>
      </button>

      {/* Modal de selección */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cambiar ubicación">
        <div className="space-y-4">
          {/* Botón de geolocalización automática */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-700 text-white py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Obteniendo ubicación...</span>
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6" />
                <span>Usar mi ubicación actual</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">o elige una ciudad</span>
            </div>
          </div>

          {/* Buscador de ciudades */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Lista de ciudades */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  city.name === currentCity
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{city.name}</span>
                  {city.name === currentCity && (
                    <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
                      Actual
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}

