'use client'

import { useCallback, useState, useEffect } from 'react'
import { useClient } from 'sanity'
import { Card, Stack, Text, Button, Flex, Box, Spinner, Select } from '@sanity/ui'
import { UploadIcon, CheckmarkIcon, CloseIcon } from '@sanity/icons'

interface UploadFile extends File {
  preview?: string
  status?: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface PhotoCategory {
  _id: string
  name: string
  slug: string
}

export function BulkUploadTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [files, setFiles] = useState<UploadFile[]>([])
  const [categories, setCategories] = useState<PhotoCategory[]>([])
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [isFeatured, setIsFeatured] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStats, setUploadStats] = useState({ success: 0, failed: 0 })
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch photo categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await client.fetch<PhotoCategory[]>(
          `*[_type == "photoCategory"] | order(name asc) {
            _id,
            name,
            "slug": slug.current
          }`
        )
        setCategories(result)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [client])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const filesWithPreview = selectedFiles.map((file) => {
      const fileWithMeta = file as UploadFile
      fileWithMeta.preview = URL.createObjectURL(file)
      fileWithMeta.status = 'pending'
      return fileWithMeta
    })
    setFiles((prev) => [...prev, ...filesWithPreview])
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const uploadFile = async (file: UploadFile, index: number) => {
    try {
      console.log('Starting upload for:', file.name)
      
      // Update status to uploading
      setFiles((prev) => {
        const newFiles = [...prev]
        newFiles[index].status = 'uploading'
        return newFiles
      })

      // Upload the image asset
      console.log('Uploading image asset...')
      const imageAsset = await client.assets.upload('image', file, {
        filename: file.name,
      })
      console.log('Image asset uploaded:', imageAsset._id)

      // Create the photo document
      const photoDoc: any = {
        _type: 'photo',
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
          alt: file.name.replace(/\.[^/.]+$/, ''),
        },
        location: location || undefined,
        year: year,
        featured: isFeatured, // Fixed: changed from isFeatured to featured
      }

      // Only add category if one is selected
      if (category) {
        photoDoc.category = {
          _type: 'reference',
          _ref: category,
        }
      }

      console.log('Creating photo document...')
      const createdDoc = await client.create(photoDoc)
      console.log('Photo document created:', createdDoc._id)

      // Update status to success
      setFiles((prev) => {
        const newFiles = [...prev]
        newFiles[index].status = 'success'
        return newFiles
      })

      setUploadStats((prev) => ({ ...prev, success: prev.success + 1 }))
    } catch (error) {
      console.error('Upload error for', file.name, ':', error)
      const errorMsg = error instanceof Error ? error.message : 'Upload failed'
      setFiles((prev) => {
        const newFiles = [...prev]
        newFiles[index].status = 'error'
        newFiles[index].error = errorMsg
        return newFiles
      })
      setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    console.log('Starting bulk upload of', files.length, 'files')
    setIsUploading(true)
    setUploadStats({ success: 0, failed: 0 })
    setErrorMessage('')

    try {
      // Upload files sequentially (could be made parallel but sequential is safer)
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], i)
      }
      console.log('Bulk upload completed')
    } catch (error) {
      console.error('Bulk upload error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Upload process failed')
    } finally {
      setIsUploading(false)
    }
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'success'))
    setUploadStats({ success: 0, failed: 0 })
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={3} weight="bold">
          Bulk Photo Upload
        </Text>
        <Text size={1} muted>
          Upload multiple photos at once. Select files, configure settings, and upload.
        </Text>

        {/* File Input */}
        <Card border padding={3}>
          <Stack space={3}>
            <label htmlFor="file-input">
              <Flex align="center" justify="center" style={{ minHeight: '100px', cursor: 'pointer' }}>
                <Stack space={2}>
                  <Flex justify="center">
                    <UploadIcon style={{ fontSize: '2rem' }} />
                  </Flex>
                  <Text align="center">Click to select images or drag and drop</Text>
                  <Text align="center" size={1} muted>
                    (Multiple files supported)
                  </Text>
                </Stack>
              </Flex>
            </label>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Stack>
        </Card>

        {/* Upload Settings */}
        {files.length > 0 && (
          <Card border padding={3}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                Upload Settings ({files.length} files selected)
              </Text>

              <Box>
                <Text size={1} weight="semibold" style={{ marginBottom: '8px' }}>
                  Category (Optional)
                </Text>
                {isLoadingCategories ? (
                  <Flex align="center" gap={2}>
                    <Spinner />
                    <Text size={1}>Loading categories...</Text>
                  </Flex>
                ) : categories.length > 0 ? (
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.currentTarget.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">-- Select a category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Box>
                    <Text size={1} muted>
                      No categories found. Create categories in the studio first.
                    </Text>
                  </Box>
                )}
                <Text size={0} muted style={{ marginTop: '4px', display: 'block' }}>
                  Photos can be added to a category for organization
                </Text>
              </Box>

              <Box>
                <Text size={1} weight="semibold" style={{ marginBottom: '4px' }}>
                  Location (Optional)
                </Text>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, Studio"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </Box>

              <Box>
                <Text size={1} weight="semibold" style={{ marginBottom: '4px' }}>
                  Year
                </Text>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </Box>

              <Flex align="center" gap={2}>
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="featured-check">
                  <Text size={1}>Mark all as Featured</Text>
                </label>
              </Flex>
            </Stack>
          </Card>
        )}

        {/* File List */}
        {files.length > 0 && (
          <Card border padding={3}>
            <Stack space={2}>
              <Text size={2} weight="semibold">
                Files to Upload
              </Text>
              <Stack space={2}>
                {files.map((file, index) => (
                  <Card key={index} padding={2} tone={file.status === 'error' ? 'critical' : 'default'}>
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap={2}>
                        {file.status === 'uploading' && <Spinner />}
                        {file.status === 'success' && <CheckmarkIcon style={{ color: 'green' }} />}
                        {file.status === 'error' && <CloseIcon style={{ color: 'red' }} />}
                        <Text size={1}>{file.name}</Text>
                      </Flex>
                      {file.status === 'pending' && (
                        <Button
                          mode="ghost"
                          tone="critical"
                          text="Remove"
                          onClick={(e) => {
                            e.preventDefault()
                            removeFile(index)
                          }}
                          type="button"
                        />
                      )}
                    </Flex>
                    {file.error && (
                      <Text size={0} style={{ color: 'red', marginTop: '4px' }}>
                        {file.error}
                      </Text>
                    )}
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Card border padding={3} tone="critical">
            <Text size={2}>
              ❌ Error: {errorMessage}
            </Text>
          </Card>
        )}

        {/* Upload Stats */}
        {(uploadStats.success > 0 || uploadStats.failed > 0) && (
          <Card border padding={3} tone={uploadStats.failed > 0 ? 'caution' : 'positive'}>
            <Text size={2}>
              ✅ {uploadStats.success} uploaded • ❌ {uploadStats.failed} failed
            </Text>
          </Card>
        )}

        {/* Action Buttons */}
        <Flex gap={2}>
          <Button
            text={isUploading ? 'Uploading...' : `Upload ${files.length} Photos`}
            tone="primary"
            onClick={(e) => {
              e.preventDefault()
              handleUpload()
            }}
            disabled={isUploading || files.length === 0}
            style={{ flex: 1 }}
            type="button"
          />
          {uploadStats.success > 0 && (
            <Button 
              text="Clear Completed" 
              onClick={(e) => {
                e.preventDefault()
                clearCompleted()
              }} 
              mode="ghost" 
              type="button"
            />
          )}
        </Flex>
      </Stack>
    </Card>
  )
}

