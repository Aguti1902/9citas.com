import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/common/Logo'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import Button from '@/components/common/Button'

export default function CreateProfilePage() {
  const navigate = useNavigate()
  const { refreshUserData } = useAuthStore()

  const [formData, setFormData] = useState({
    title: '',
    aboutMe: '',
    lookingFor: '',
    age: '',
    orientation: 'hetero',
    gender: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    height: '',
    bodyType: '',
    relationshipStatus: 'soltero',
    occupation: '',
    education: '',
    smoking: 'no',
    drinking: 'social',
    children: 'no',
    pets: '',
    zodiacSign: '',
  })

  const [hobbies, setHobbies] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>(['Español'])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const [isDetectingLocation, setIsDetectingLocation] = useState(true)
  const [locationError, setLocationError] = useState('')

  // Lista de ciudades españolas (misma que LocationSelector)
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

  // Obtener orientación guardada - NO detectar ubicación al crear perfil
  useEffect(() => {
    const savedOrientation = localStorage.getItem('userOrientation')
    if (savedOrientation) {
      setFormData(prev => ({ ...prev, orientation: savedOrientation }))
      localStorage.removeItem('userOrientation') // Limpiar después de usar
    }

    // IMPORTANTE: NO detectar ubicación automáticamente al crear el perfil
    // La ubicación se detectará cuando el usuario navegue/use la app
    setIsDetectingLocation(false)
    setLocationError('')
    
    // NO establecer ubicación por defecto - dejar que el usuario la seleccione manualmente
    // o que se detecte cuando navegue por la app
  }, [])

  // Función para detectar ubicación manualmente (si el usuario quiere)
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización.')
      return
    }

    setIsDetectingLocation(true)
    setLocationError('')
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        
        console.log(`📍 Ubicación obtenida: ${latitude}, ${longitude} (precisión: ${accuracy}m)`)
        
        try {
          // Usar geocodificación inversa para obtener la ciudad exacta
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=es`,
            {
              headers: {
                'User-Agent': '9citas.com/1.0'
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            const address = data.address
            
            // Intentar obtener la ciudad de diferentes campos
            let cityName = address.city || 
                          address.town || 
                          address.municipality || 
                          address.village ||
                          address.county ||
                          address.state_district
            
            // Si no encontramos ciudad, buscar la más cercana de nuestra lista
            if (!cityName) {
              console.log('⚠️ No se encontró ciudad en geocodificación, usando ciudad más cercana')
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
              cityName = closestCity.name
            } else {
              // Normalizar nombre de ciudad (capitalizar primera letra)
              cityName = cityName.split(' ').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ).join(' ')
              
              // Verificar si la ciudad está en nuestra lista, si no, usar la más cercana
              const cityInList = SPANISH_CITIES.find(c => 
                c.name.toLowerCase() === cityName.toLowerCase()
              )
              
              if (!cityInList) {
                console.log(`⚠️ Ciudad "${cityName}" no está en lista, usando ciudad más cercana`)
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
                cityName = closestCity.name
              }
            }
            
            console.log(`✅ Ciudad detectada: ${cityName}`)
            
            setFormData(prev => ({
              ...prev,
              city: cityName,
              latitude,
              longitude,
            }))
          } else {
            throw new Error('Error en geocodificación')
          }
        } catch (error) {
          console.error('Error en geocodificación inversa:', error)
          // Fallback: buscar la ciudad más cercana
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

          setFormData(prev => ({
            ...prev,
            city: closestCity.name,
            latitude,
            longitude,
          }))
        }
        
        setIsDetectingLocation(false)
      },
      (error) => {
        console.error('Error de geolocalización:', error)
        setLocationError('No se pudo obtener tu ubicación. Por favor, permite el acceso a tu ubicación.')
        setIsDetectingLocation(false)
        // Usar Madrid como fallback
        setFormData(prev => ({
          ...prev,
          city: 'Madrid',
          latitude: 40.4168,
          longitude: -3.7038,
        }))
      },
      {
        enableHighAccuracy: true, // Máxima precisión usando GPS
        timeout: 30000, // 30 segundos para obtener ubicación precisa
        maximumAge: 0, // No usar ubicación en caché, siempre obtener nueva
      }
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const currentPublicCount = Math.min(selectedFiles.length, 4)
    const currentPrivateCount = Math.max(0, selectedFiles.length - 4)
    
    // Determinar si es para fotos públicas o privadas basado en el input
    const isPrivate = e.target.id === 'photo-upload-private'
    
    if (isPrivate) {
      // Fotos privadas: máximo 4
      if (currentPrivateCount + files.length > 4) {
        setError('Máximo 4 fotos privadas')
        return
      }
    } else {
      // Fotos públicas: máximo 4 (1 portada + 3 públicas)
      if (currentPublicCount + files.length > 4) {
        setError('Máximo 4 fotos públicas (1 portada + 3 públicas)')
        return
      }
    }
    
    setSelectedFiles([...selectedFiles, ...files])
    
    // Preview
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreview(prev => prev.filter((_, i) => i !== index))
  }

  const toggleHobby = (hobby: string) => {
    setHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    )
  }

  const toggleLanguage = (language: string) => {
    setLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.title.length > 15) {
      setError('El título debe tener máximo 15 caracteres')
      return
    }

    // IMPORTANTE: La ciudad NO es obligatoria al crear el perfil
    // Se puede crear sin ciudad y se detectará cuando use la app

    const age = parseInt(formData.age)
    if (age < 18 || age > 99) {
      setError('La edad debe estar entre 18 y 99 años')
      return
    }

    if (selectedFiles.length === 0) {
      setError('Debes subir al menos 1 foto de portada')
      return
    }

    if (!formData.gender) {
      setError('Debes seleccionar tu género')
      return
    }

    setIsLoading(true)

    try {
      // Crear perfil
      await api.post('/profile', {
        ...formData,
        age,
        height: formData.height ? parseInt(formData.height) : null,
        hobbies,
        languages,
      })

      // Subir fotos
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData()
        formData.append('photo', selectedFiles[i])
        
        // Primera foto es portada, siguientes 3 son públicas, resto privadas
        let type = 'cover'
        if (i > 0 && i <= 3) type = 'public'
        if (i > 3) type = 'private'
        
        formData.append('type', type)
        
        try {
          await api.post('/photos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } catch (photoErr) {
          console.error('Error subiendo foto:', photoErr)
        }
      }

      await refreshUserData()
      navigate('/app')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Logo size="md" className="mb-4" />
          <h2 className="text-2xl font-bold text-white">Completa tu perfil</h2>
          <p className="text-gray-400 mt-2">
            Cuéntanos un poco sobre ti para empezar a conocer gente
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Título del perfil (máx. 15 caracteres)"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            maxLength={15}
            placeholder="Ej: Carlos, 28"
          />

          <Textarea
            label="Descríbete"
            value={formData.aboutMe}
            onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
            required
            rows={4}
            placeholder="Cuéntanos sobre ti, tus intereses, hobbies..."
          />

          <Textarea
            label="Lo que buscas"
            value={formData.lookingFor}
            onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
            required
            rows={4}
            placeholder="¿Qué tipo de conexión o relación buscas?"
          />

          <Input
            label="Edad (18-99 años)"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
            min={18}
            max={99}
            placeholder="Tu edad"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Orientación
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  value="hetero"
                  checked={formData.orientation === 'hetero'}
                  onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                  className="mr-2"
                />
                <span className="text-white">Hetero</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  value="gay"
                  checked={formData.orientation === 'gay'}
                  onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                  className="mr-2"
                />
                <span className="text-white">Gay</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Género *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="hombre"
                  checked={formData.gender === 'hombre'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mr-2"
                  required
                />
                <span className="text-white">Hombre</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="mujer"
                  checked={formData.gender === 'mujer'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mr-2"
                  required
                />
                <span className="text-white">Mujer</span>
              </label>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              {formData.orientation === 'hetero' 
                ? 'Los usuarios heteros verán solo perfiles del género opuesto'
                : 'Los usuarios gays verán solo perfiles del mismo género'}
            </p>
          </div>

          {/* Ubicación - NO se detecta automáticamente al crear perfil */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ubicación (Opcional)
            </label>
            <p className="text-gray-400 text-xs mb-2">
              La ubicación se detectará automáticamente cuando uses la app. Puedes seleccionar una ciudad manualmente si lo deseas.
            </p>
            <div className="flex gap-2">
              <select
                value={formData.city}
                onChange={(e) => {
                  const selectedCity = SPANISH_CITIES.find(c => c.name === e.target.value)
                  setFormData(prev => ({
                    ...prev,
                    city: e.target.value,
                    latitude: selectedCity?.lat || null,
                    longitude: selectedCity?.lng || null,
                  }))
                }}
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
              >
                <option value="">Seleccionar ciudad (opcional)</option>
                {SPANISH_CITIES.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetectingLocation ? 'Detectando...' : '📍 Detectar'}
              </button>
            </div>
            {isDetectingLocation && (
              <p className="text-gray-400 text-xs mt-2">Detectando tu ubicación...</p>
            )}
            {locationError && (
              <p className="text-red-400 text-xs mt-1">{locationError}</p>
            )}
            {formData.city && !isDetectingLocation && !locationError && (
              <p className="text-gray-400 text-xs mt-1">
                Ciudad seleccionada: {formData.city}
              </p>
            )}
          </div>

          {/* FOTOS PÚBLICAS */}
          <div className="bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-white mb-3">
              📸 Fotos Públicas (Obligatorio: mínimo 1, máximo 4)
            </label>
            
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload-public"
              />
              <label
                htmlFor="photo-upload-public"
                className="block w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg text-center cursor-pointer transition-opacity"
              >
                + Añadir Fotos Públicas
              </label>
            </div>

            {photoPreview.length > 0 && photoPreview.length <= 4 && (
              <div className="grid grid-cols-4 gap-2">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                      {index === 0 ? 'Portada' : 'Pública'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              • 1ª foto: Portada (obligatoria, se muestra en tu perfil)<br/>
              • Fotos 2-4: Públicas (visibles para todos)
            </p>
          </div>

          {/* FOTOS PRIVADAS */}
          <div className="bg-gray-800 rounded-lg p-4 border-2 border-accent">
            <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
              🔒 Fotos Privadas (Opcional: máximo 4)
            </label>
            
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload-private"
              />
              <label
                htmlFor="photo-upload-private"
                className="block w-full bg-accent hover:opacity-90 text-black font-semibold py-3 px-6 rounded-lg text-center cursor-pointer transition-opacity"
              >
                + Añadir Fotos Privadas
              </label>
            </div>

            {photoPreview.length > 4 && (
              <div className="grid grid-cols-4 gap-2">
                {photoPreview.slice(4).map((preview, index) => (
                  <div key={index + 4} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview privada ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index + 4)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                      🔒 Privada
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              • Solo visibles para usuarios con los que tengas match<br/>
              • Pueden solicitar acceso para verlas<br/>
              • Máximo 4 fotos privadas
            </p>
          </div>

          {/* Información física */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">👤 Información Física</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Altura (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="Ej: 175"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de cuerpo
                </label>
                <select
                  value={formData.bodyType}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                  className="input-field"
                >
                  <option value="">Seleccionar...</option>
                  <option value="delgado">Delgado</option>
                  <option value="atletico">Atlético</option>
                  <option value="promedio">Promedio</option>
                  <option value="musculoso">Musculoso</option>
                  <option value="corpulento">Corpulento</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estilo de vida */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">🌟 Estilo de Vida</h3>
            
            <Input
              label="Profesión / Trabajo"
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              placeholder="Ej: Ingeniero, Diseñador, Estudiante..."
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nivel de estudios
              </label>
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="input-field"
              >
                <option value="">Seleccionar...</option>
                <option value="secundaria">Secundaria</option>
                <option value="bachillerato">Bachillerato</option>
                <option value="fp">Formación Profesional</option>
                <option value="universitario">Universitario</option>
                <option value="posgrado">Posgrado/Máster</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ¿Fumas?
                </label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="input-field"
                >
                  <option value="no">No fumo</option>
                  <option value="ocasional">Ocasionalmente</option>
                  <option value="regular">Sí, regularmente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ¿Bebes alcohol?
                </label>
                <select
                  value={formData.drinking}
                  onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
                  className="input-field"
                >
                  <option value="no">No bebo</option>
                  <option value="social">Socialmente</option>
                  <option value="regular">Regularmente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ¿Tienes hijos?
                </label>
                <select
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                  className="input-field"
                >
                  <option value="no">No</option>
                  <option value="si_vivo">Sí, viven conmigo</option>
                  <option value="si_no_vivo">Sí, no viven conmigo</option>
                  <option value="quiero">No, pero quiero</option>
                </select>
              </div>

              <Input
                label="Mascotas"
                type="text"
                value={formData.pets}
                onChange={(e) => setFormData({ ...formData, pets: e.target.value })}
                placeholder="Ej: Perro, Gato, Ninguna..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado civil
                </label>
                <select
                  value={formData.relationshipStatus}
                  onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value })}
                  className="input-field"
                >
                  <option value="soltero">Soltero/a</option>
                  <option value="divorciado">Divorciado/a</option>
                  <option value="viudo">Viudo/a</option>
                  <option value="complicado">Es complicado</option>
                  <option value="abierto">Relación abierta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Signo zodiacal
                </label>
                <select
                  value={formData.zodiacSign}
                  onChange={(e) => setFormData({ ...formData, zodiacSign: e.target.value })}
                  className="input-field"
                >
                  <option value="">-</option>
                  <option value="aries">♈ Aries</option>
                  <option value="tauro">♉ Tauro</option>
                  <option value="geminis">♊ Géminis</option>
                  <option value="cancer">♋ Cáncer</option>
                  <option value="leo">♌ Leo</option>
                  <option value="virgo">♍ Virgo</option>
                  <option value="libra">♎ Libra</option>
                  <option value="escorpio">♏ Escorpio</option>
                  <option value="sagitario">♐ Sagitario</option>
                  <option value="capricornio">♑ Capricornio</option>
                  <option value="acuario">♒ Acuario</option>
                  <option value="piscis">♓ Piscis</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hobbies e intereses */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">🎯 Hobbies e Intereses</h3>
            <p className="text-sm text-gray-400 mb-3">Selecciona tus intereses (mínimo 3)</p>
            
            <div className="flex flex-wrap gap-2">
              {['Deportes', 'Gym', 'Viajar', 'Cine', 'Series', 'Música', 'Leer', 'Cocinar', 'Videojuegos', 
                'Fotografía', 'Arte', 'Bailar', 'Senderismo', 'Playa', 'Montaña', 'Yoga', 'Mascotas', 
                'Tecnología', 'Moda', 'Gastronomía'].map(hobby => (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => toggleHobby(hobby)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    hobbies.includes(hobby)
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">🌍 Idiomas que hablas</h3>
            
            <div className="flex flex-wrap gap-2">
              {['Español', 'Inglés', 'Catalán', 'Francés', 'Alemán', 'Italiano', 'Portugués', 
                'Árabe', 'Chino', 'Ruso'].map(language => (
                <button
                  key={language}
                  type="button"
                  onClick={() => toggleLanguage(language)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    languages.includes(language)
                      ? 'bg-secondary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Reglas */}
          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-400 space-y-2">
            <p className="font-semibold text-white mb-2">📋 Reglas importantes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No se permiten fotos de desnudos enseñando pechos, genitales o culo en las fotos públicas</li>
              <li>No se permite pedir dinero a cambio de sexo</li>
              <li>Evitar mensajes con insultos, xenofobia o discriminación</li>
              <li>No registrarse en un género/categoría que no corresponda</li>
              <li>Si incumples las reglas, tu perfil podrá ser eliminado</li>
            </ul>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="primary"
            isLoading={isLoading}
            className="mt-6"
          >
            Guardar perfil
          </Button>
        </form>
      </div>
    </div>
  )
}

