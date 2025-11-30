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

  // Obtener orientación guardada
  useEffect(() => {
    const savedOrientation = localStorage.getItem('userOrientation')
    if (savedOrientation) {
      setFormData(prev => ({ ...prev, orientation: savedOrientation }))
      localStorage.removeItem('userOrientation') // Limpiar después de usar
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedFiles.length > 8) {
      setError('Máximo 8 fotos (1 portada + 3 públicas + 4 privadas)')
      return
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

          <Input
            label="Ciudad"
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            placeholder="Ej: Barcelona, Madrid, Valencia..."
          />

          {/* FOTOS */}
          <div className="bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-white mb-3">
              📸 Fotos (Obligatorio: mínimo 1, máximo 8)
            </label>
            
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="block w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg text-center cursor-pointer transition-opacity"
              >
                + Añadir Fotos
              </label>
            </div>

            {photoPreview.length > 0 && (
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
                      {index === 0 ? 'Portada' : index <= 3 ? 'Pública' : 'Privada'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              • 1ª foto: Portada (obligatoria)<br/>
              • Fotos 2-4: Públicas<br/>
              • Fotos 5-8: Privadas (solo en chat)
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

