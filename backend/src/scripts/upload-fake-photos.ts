import * as fs from 'fs'
import * as path from 'path'
import cloudinary from '../config/cloudinary'

const PHOTOS_DIR = path.join(__dirname, '../../fake-profiles-photos')
const OUTPUT_FILE = path.join(__dirname, '../../fake-profiles-photos-urls.json')

interface PhotoSet {
  folderName: string
  photos: {
    cover: string // URL de Cloudinary
    public: string[] // URLs de fotos públicas
  }
}

async function uploadPhotoToCloudinary(filePath: string, folderName: string, photoIndex: number): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: `9citas/fake-profiles/${folderName}`,
        public_id: `photo_${photoIndex}`,
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )
  })
}

async function processFolder(folderPath: string, folderName: string): Promise<PhotoSet | null> {
  const files = fs.readdirSync(folderPath)
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
  })

  if (imageFiles.length === 0) {
    console.log(`⚠️  Carpeta ${folderName} no tiene imágenes`)
    return null
  }

  console.log(`📸 Procesando ${folderName} (${imageFiles.length} fotos)...`)

  const photoSet: PhotoSet = {
    folderName,
    photos: {
      cover: '',
      public: [],
    },
  }

  // Ordenar archivos para mantener orden
  imageFiles.sort()

  // Primera foto = cover
  const coverPath = path.join(folderPath, imageFiles[0])
  try {
    photoSet.photos.cover = await uploadPhotoToCloudinary(coverPath, folderName, 0)
    console.log(`  ✅ Cover subida: ${imageFiles[0]}`)
  } catch (error) {
    console.error(`  ❌ Error subiendo cover:`, error)
    return null
  }

  // Resto de fotos = públicas
  for (let i = 1; i < imageFiles.length; i++) {
    const photoPath = path.join(folderPath, imageFiles[i])
    try {
      const url = await uploadPhotoToCloudinary(photoPath, folderName, i)
      photoSet.photos.public.push(url)
      console.log(`  ✅ Foto pública ${i} subida: ${imageFiles[i]}`)
    } catch (error) {
      console.error(`  ❌ Error subiendo foto ${i}:`, error)
    }
  }

  return photoSet
}

async function main() {
  console.log('🚀 Iniciando subida de fotos de perfiles falsos...\n')

  // Verificar que existe la carpeta
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`❌ La carpeta ${PHOTOS_DIR} no existe`)
    console.log('📁 Crea la carpeta y añade subcarpetas con las fotos de cada chica')
    process.exit(1)
  }

  // Leer todas las carpetas
  const folders = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  if (folders.length === 0) {
    console.error('❌ No se encontraron carpetas con fotos')
    console.log('📁 Crea carpetas dentro de fake-profiles-photos/ con las fotos de cada chica')
    process.exit(1)
  }

  console.log(`📁 Encontradas ${folders.length} carpetas\n`)

  const allPhotoSets: PhotoSet[] = []

  // Procesar cada carpeta
  for (const folderName of folders) {
    const folderPath = path.join(PHOTOS_DIR, folderName)
    const photoSet = await processFolder(folderPath, folderName)
    
    if (photoSet) {
      allPhotoSets.push(photoSet)
    }
    
    console.log('') // Línea en blanco entre carpetas
  }

  // Guardar URLs en archivo JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPhotoSets, null, 2))
  
  console.log(`\n✅ Proceso completado!`)
  console.log(`📊 Total de sets de fotos: ${allPhotoSets.length}`)
  console.log(`💾 URLs guardadas en: ${OUTPUT_FILE}`)
  console.log(`\n📋 Siguiente paso: Ejecuta el seed para crear los perfiles con estas fotos`)
  console.log(`   npx prisma db seed`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

