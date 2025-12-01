import { useState, useRef } from 'react'
import { Heart, X, MapPin, Briefcase, Ruler } from 'lucide-react'

interface SwipeCardProps {
  profile: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onProfileClick: () => void
}

export default function SwipeCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onProfileClick,
}: SwipeCardProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const photos = profile.photos || []
  const currentPhoto = photos[currentPhotoIndex] || photos[0]

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startX
    setCurrentX(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const threshold = 100
    
    if (currentX > threshold) {
      // Swipe right - Like
      animateSwipe('right')
    } else if (currentX < -threshold) {
      // Swipe left - Pass
      animateSwipe('left')
    } else {
      // Reset
      setCurrentX(0)
    }
    
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = e.clientX - startX
    setCurrentX(diff)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    const threshold = 100
    
    if (currentX > threshold) {
      animateSwipe('right')
    } else if (currentX < -threshold) {
      animateSwipe('left')
    } else {
      setCurrentX(0)
    }
    
    setIsDragging(false)
  }

  const animateSwipe = (direction: 'left' | 'right') => {
    setCurrentX(direction === 'right' ? 1000 : -1000)
    
    setTimeout(() => {
      if (direction === 'right') {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
      setCurrentX(0)
    }, 300)
  }

  const handleLike = () => {
    animateSwipe('right')
  }

  const handlePass = () => {
    animateSwipe('left')
  }

  const rotate = currentX / 20
  const opacity = 1 - Math.abs(currentX) / 400

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translateX(${currentX}px) rotate(${rotate}deg)`,
          opacity,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
        }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Imagen */}
          <div 
            className="relative h-full"
            onClick={() => {
              if (!isDragging && Math.abs(currentX) < 5) {
                onProfileClick()
              }
            }}
          >
            {currentPhoto ? (
              <img
                src={currentPhoto.url}
                alt={profile.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center text-gray-500">
                  <div className="text-8xl mb-4">👤</div>
                  <p>Sin foto</p>
                </div>
              </div>
            )}

            {/* Indicadores de swipe */}
            <div
              className="absolute top-8 left-8 border-4 border-success text-success font-bold text-4xl px-6 py-3 rounded-2xl rotate-[-20deg] pointer-events-none"
              style={{
                opacity: Math.max(0, currentX / 200),
              }}
            >
              LIKE
            </div>

            <div
              className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-6 py-3 rounded-2xl rotate-[20deg] pointer-events-none"
              style={{
                opacity: Math.max(0, -currentX / 200),
              }}
            >
              NOPE
            </div>

            {/* Navegación de fotos */}
            {photos.length > 1 && (
              <>
                <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-2">
                  {photos.map((_: any, index: number) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentPhotoIndex((prev) => Math.max(0, prev - 1))
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  disabled={currentPhotoIndex === 0}
                  style={{ opacity: currentPhotoIndex === 0 ? 0.3 : 1 }}
                >
                  ←
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentPhotoIndex((prev) => Math.min(photos.length - 1, prev + 1))
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  disabled={currentPhotoIndex === photos.length - 1}
                  style={{ opacity: currentPhotoIndex === photos.length - 1 ? 0.3 : 1 }}
                >
                  →
                </button>
              </>
            )}

            {/* Indicador online */}
            {profile.isOnline && (
              <div className="absolute top-4 left-4 flex items-center bg-success bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs text-white font-semibold">Online</span>
              </div>
            )}

            {/* Contador de fotos */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
              {currentPhotoIndex + 1} / {photos.length}
            </div>

            {/* Info del perfil - PADDING AUMENTADO ABAJO */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-12 pb-36">
              <h2 className="text-white font-bold text-3xl mb-2">
                {profile.title}, {profile.age}
              </h2>
              
              <div className="space-y-1 text-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city}</span>
                  {profile.distance !== null && profile.distance !== undefined && (
                    <span className="text-accent font-semibold">· {profile.distance} km</span>
                  )}
                </div>
                
                {profile.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
                
                {profile.height && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <span>{profile.height} cm</span>
                  </div>
                )}
              </div>

              {/* Hobbies preview */}
              {profile.hobbies && profile.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.hobbies.slice(0, 3).map((hobby: string) => (
                    <span
                      key={hobby}
                      className="bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-primary/50"
                    >
                      {hobby}
                    </span>
                  ))}
                  {profile.hobbies.length > 3 && (
                    <span className="bg-gray-800/50 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-xs">
                      +{profile.hobbies.length - 3}
                    </span>
                  )}
                </div>
              )}

              <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                {profile.aboutMe}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción fijos - SOLO X Y CORAZÓN */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 z-10">
        <button
          onClick={handlePass}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 border-4 border-gray-200"
        >
          <X className="w-8 h-8 text-red-500" strokeWidth={3} />
        </button>

        <button
          onClick={handleLike}
          className="w-16 h-16 bg-gradient-to-br from-primary to-pink-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 border-4 border-pink-300"
        >
          <Heart className="w-8 h-8 text-white" fill="white" strokeWidth={0} />
        </button>
      </div>
    </div>
  )
}

