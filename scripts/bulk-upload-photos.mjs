#!/usr/bin/env node

/**
 * Bulk Photo Upload Script for Boshnovart Portfolio
 * 
 * Usage:
 *   node scripts/bulk-upload-photos.js ./path/to/photos --category="events" --location="Manhattan" --year=2024
 * 
 * Or simply drag photos into the ./uploads folder and run:
 *   npm run upload-photos
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readdirSync, createReadStream, statSync } from 'fs'
import { join, basename, extname } from 'path'

// Load .env.local
config({ path: '.env.local' })

const client = createClient({
  projectId: 'u1jfi7ga',
  dataset: 'production',
  apiVersion: '2024-12-13',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Parse command line arguments
const args = process.argv.slice(2)
const folderPath = args[0] || './uploads'

// Parse options
const options = {}
args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=')
    options[key] = value
  }
})

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

async function getCategoryId(categorySlug) {
  const query = `*[_type == "photoCategory" && slug.current == $slug][0]._id`
  const categoryId = await client.fetch(query, { slug: categorySlug })
  
  if (!categoryId) {
    console.error(`\n❌ Category "${categorySlug}" not found!`)
    console.log('\nAvailable categories:')
    const categories = await client.fetch(`*[_type == "photoCategory"]{name, "slug": slug.current}`)
    categories.forEach(cat => console.log(`  - ${cat.slug} (${cat.name})`))
    process.exit(1)
  }
  
  return categoryId
}

async function uploadFolder(folderPath, options) {
  console.log('\n🚀 Bulk Photo Upload Starting...\n')
  
  // Validate folder exists
  try {
    const stats = statSync(folderPath)
    if (!stats.isDirectory()) {
      throw new Error('Not a directory')
    }
  } catch (error) {
    console.error(`❌ Error: Folder "${folderPath}" not found!`)
    console.log('\nCreate an "uploads" folder and add your photos, or specify a path:')
    console.log('  node scripts/bulk-upload-photos.js ./path/to/photos\n')
    process.exit(1)
  }

  // Get category ID if specified
  let categoryId = null
  if (options.category) {
    categoryId = await getCategoryId(options.category)
    console.log(`✅ Using category: ${options.category}`)
  }

  // Get all image files
  const files = readdirSync(folderPath).filter(file => {
    const ext = extname(file).toLowerCase()
    return imageExtensions.includes(ext)
  })

  if (files.length === 0) {
    console.error(`❌ No image files found in "${folderPath}"`)
    console.log('\nSupported formats: JPG, JPEG, PNG, GIF, WEBP\n')
    process.exit(1)
  }

  console.log(`📸 Found ${files.length} image(s) to upload\n`)

  const results = []

  for (const file of files) {
    const filePath = join(folderPath, file)
    const fileName = basename(file, extname(file))
    
    try {
      console.log(`⬆️  Uploading: ${file}...`)
      
      // Upload image asset
      const imageAsset = await client.assets.upload(
        'image',
        createReadStream(filePath),
        { filename: basename(filePath) }
      )

      console.log(`   ✓ Asset uploaded: ${imageAsset._id}`)

      // Create Photo document
      const photoDoc = {
        _type: 'photo',
        title: options.title || fileName.replace(/[-_]/g, ' '),
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
          alt: options.alt || fileName.replace(/[-_]/g, ' '),
        },
        location: options.location || undefined,
        year: options.year ? parseInt(options.year) : new Date().getFullYear(),
        featured: options.featured === 'true',
        order: 0,
      }

      // Add category reference if provided
      if (categoryId) {
        photoDoc.category = {
          _type: 'reference',
          _ref: categoryId,
        }
      }

      const createdDoc = await client.create(photoDoc)
      console.log(`   ✓ Photo document created: ${createdDoc._id}`)
      console.log(`   📝 Title: "${photoDoc.title}"\n`)

      results.push({ file, success: true, assetId: imageAsset._id, docId: createdDoc._id })
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`)
      results.push({ file, success: false, error: error.message })
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Upload Summary')
  console.log('='.repeat(50))
  console.log(`✅ Successful: ${results.filter(r => r.success).length}`)
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`)
  console.log('='.repeat(50) + '\n')

  if (results.some(r => r.success)) {
    console.log('🎉 Done! View your photos at http://localhost:3000/studio')
    console.log('\n💡 Tip: You can now edit each photo in the studio to:')
    console.log('   - Add better alt text (important for SEO)')
    console.log('   - Mark photos as "Featured" for homepage')
    console.log('   - Add descriptions and adjust display order\n')
  }
}

// Show usage if no token
if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('\n❌ Error: SANITY_API_WRITE_TOKEN not found!')
  console.log('\nSet your token in .env.local:')
  console.log('  SANITY_API_WRITE_TOKEN=your_token_here')
  console.log('\nGet a token from: https://www.sanity.io/manage')
  console.log('  → Select your project → API → Tokens → Add API token')
  console.log('  → Set permission to "Editor" or "Administrator"\n')
  process.exit(1)
}

// Run the upload
uploadFolder(folderPath, options).catch(error => {
  console.error('\n❌ Upload failed:', error.message)
  process.exit(1)
})

