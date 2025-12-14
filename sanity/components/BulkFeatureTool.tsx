'use client'

import { useCallback, useState, useEffect } from 'react'
import { useClient } from 'sanity'
import { Card, Stack, Text, Button, Flex, Box, Spinner, Checkbox, Grid, Badge } from '@sanity/ui'
import { StarIcon, SearchIcon } from '@sanity/icons'

interface Photo {
  _id: string
  title: string
  imageUrl: string
  categoryName?: string
  location?: string
  year?: number
  featured: boolean
}

export function BulkFeatureTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all')
  const [updateStats, setUpdateStats] = useState({ success: 0, failed: 0 })

  // Fetch all photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true)
        const result = await client.fetch<Photo[]>(
          `*[_type == "photo"] | order(featured desc, _createdAt desc) {
            _id,
            title,
            "imageUrl": image.asset->url,
            "categoryName": category->name,
            location,
            year,
            featured
          }`
        )
        setPhotos(result)
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPhotos()
  }, [client])

  // Toggle individual photo selection
  const togglePhoto = useCallback((photoId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photoId)) {
        newSet.delete(photoId)
      } else {
        newSet.add(photoId)
      }
      return newSet
    })
  }, [])

  // Select all visible photos
  const selectAll = useCallback(() => {
    const filtered = getFilteredPhotos()
    setSelectedIds(new Set(filtered.map((p) => p._id)))
  }, [photos, searchTerm, filterFeatured])

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Get filtered photos based on search and filter
  const getFilteredPhotos = () => {
    let filtered = photos.filter((photo) =>
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterFeatured === 'featured') {
      filtered = filtered.filter((p) => p.featured)
    } else if (filterFeatured === 'not-featured') {
      filtered = filtered.filter((p) => !p.featured)
    }

    return filtered
  }

  // Mark selected photos as featured
  const handleMarkFeatured = async () => {
    await updatePhotos(true)
  }

  // Remove featured from selected photos
  const handleRemoveFeatured = async () => {
    await updatePhotos(false)
  }

  // Update photos featured status
  const updatePhotos = async (featured: boolean) => {
    setIsUpdating(true)
    setUpdateStats({ success: 0, failed: 0 })

    const idsToUpdate = Array.from(selectedIds)
    let successCount = 0
    let failedCount = 0

    for (const id of idsToUpdate) {
      try {
        await client
          .patch(id)
          .set({ featured })
          .commit()
        successCount++
        console.log(`Updated photo ${id} - featured: ${featured}`)
      } catch (error) {
        console.error(`Failed to update photo ${id}:`, error)
        failedCount++
      }
    }

    setUpdateStats({ success: successCount, failed: failedCount })

    // Refresh the photo list
    const updatedPhotos = photos.map((photo) => {
      if (selectedIds.has(photo._id)) {
        return { ...photo, featured }
      }
      return photo
    })
    setPhotos(updatedPhotos)
    setSelectedIds(new Set())
    setIsUpdating(false)
  }

  const filteredPhotos = getFilteredPhotos()
  const featuredCount = photos.filter((p) => p.featured).length

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Box>
          <Text size={3} weight="bold">
            Bulk Feature Photos
          </Text>
          <Text size={1} muted style={{ marginTop: '8px' }}>
            Mark multiple photos as "Featured" to display them on your homepage. Currently {featuredCount} photos are featured.
          </Text>
        </Box>

        {/* Search and Filter Bar */}
        <Card border padding={3}>
          <Stack space={3}>
            {/* Search */}
            <Flex align="center" gap={2}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by title, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </Flex>

            {/* Filter Buttons */}
            <Flex gap={2}>
              <Button
                text={`All (${photos.length})`}
                mode={filterFeatured === 'all' ? 'default' : 'ghost'}
                tone={filterFeatured === 'all' ? 'primary' : 'default'}
                onClick={() => setFilterFeatured('all')}
                type="button"
              />
              <Button
                text={`Featured (${featuredCount})`}
                mode={filterFeatured === 'featured' ? 'default' : 'ghost'}
                tone={filterFeatured === 'featured' ? 'primary' : 'default'}
                onClick={() => setFilterFeatured('featured')}
                type="button"
              />
              <Button
                text={`Not Featured (${photos.length - featuredCount})`}
                mode={filterFeatured === 'not-featured' ? 'default' : 'ghost'}
                tone={filterFeatured === 'not-featured' ? 'primary' : 'default'}
                onClick={() => setFilterFeatured('not-featured')}
                type="button"
              />
            </Flex>
          </Stack>
        </Card>

        {/* Selection Controls */}
        {!isLoading && photos.length > 0 && (
          <Card border padding={3}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
              <Text size={2}>
                {selectedIds.size} of {filteredPhotos.length} selected
              </Text>
              <Flex gap={2} wrap="wrap">
                <Button
                  text="Select All"
                  mode="ghost"
                  onClick={selectAll}
                  disabled={isUpdating}
                  type="button"
                />
                <Button
                  text="Deselect All"
                  mode="ghost"
                  onClick={deselectAll}
                  disabled={isUpdating || selectedIds.size === 0}
                  type="button"
                />
                <Button
                  text={`Mark ${selectedIds.size} as Featured`}
                  tone="positive"
                  icon={StarIcon}
                  onClick={handleMarkFeatured}
                  disabled={isUpdating || selectedIds.size === 0}
                  type="button"
                />
                <Button
                  text={`Remove Featured (${selectedIds.size})`}
                  tone="caution"
                  onClick={handleRemoveFeatured}
                  disabled={isUpdating || selectedIds.size === 0}
                  type="button"
                />
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Update Stats */}
        {(updateStats.success > 0 || updateStats.failed > 0) && (
          <Card border padding={3} tone={updateStats.failed > 0 ? 'caution' : 'positive'}>
            <Text size={2}>
              ✅ {updateStats.success} updated • ❌ {updateStats.failed} failed
            </Text>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Flex justify="center" align="center" style={{ minHeight: '200px' }}>
            <Stack space={3}>
              <Flex justify="center">
                <Spinner />
              </Flex>
              <Text align="center">Loading photos...</Text>
            </Stack>
          </Flex>
        )}

        {/* Empty State */}
        {!isLoading && photos.length === 0 && (
          <Card border padding={4}>
            <Text align="center" muted>
              No photos found in your library.
            </Text>
          </Card>
        )}

        {/* Photos Grid */}
        {!isLoading && filteredPhotos.length > 0 && (
          <Box style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Grid columns={[1, 2, 3, 4]} gap={3}>
              {filteredPhotos.map((photo) => (
                <Card
                  key={photo._id}
                  border
                  padding={2}
                  style={{
                    cursor: 'pointer',
                    opacity: isUpdating ? 0.5 : 1,
                    border: selectedIds.has(photo._id) ? '2px solid #2276fc' : undefined,
                  }}
                  onClick={() => !isUpdating && togglePhoto(photo._id)}
                >
                  <Stack space={2}>
                    {/* Checkbox and Featured Badge */}
                    <Flex justify="space-between" align="center">
                      <Checkbox
                        checked={selectedIds.has(photo._id)}
                        onChange={() => togglePhoto(photo._id)}
                        disabled={isUpdating}
                      />
                      {photo.featured && (
                        <Badge tone="positive" mode="outline">
                          <Flex align="center" gap={1}>
                            <StarIcon />
                            <Text size={0}>Featured</Text>
                          </Flex>
                        </Badge>
                      )}
                    </Flex>

                    {/* Image */}
                    <Box style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#f0f0f0' }}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {photo.featured && (
                        <Box
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '50%',
                            padding: '4px',
                          }}
                        >
                          <StarIcon style={{ color: '#ffd700' }} />
                        </Box>
                      )}
                    </Box>

                    {/* Photo Info */}
                    <Stack space={1}>
                      <Text size={1} weight="semibold" style={{ 
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.5rem'
                      }} title={photo.title}>
                        {photo.title}
                      </Text>
                      {photo.categoryName && (
                        <Text size={0} muted>
                          {photo.categoryName}
                        </Text>
                      )}
                      {(photo.location || photo.year) && (
                        <Text size={0} muted>
                          {photo.location && photo.location}
                          {photo.location && photo.year && ' • '}
                          {photo.year && photo.year}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Box>
        )}

        {/* No Results */}
        {!isLoading && photos.length > 0 && filteredPhotos.length === 0 && (
          <Card border padding={4}>
            <Text align="center" muted>
              No photos match your search or filter.
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  )
}

