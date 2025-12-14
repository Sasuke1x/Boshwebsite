'use client'

import { useCallback, useState, useEffect } from 'react'
import { useClient } from 'sanity'
import { Card, Stack, Text, Button, Flex, Box, Spinner, Checkbox, Grid } from '@sanity/ui'
import { TrashIcon, SearchIcon } from '@sanity/icons'

interface Photo {
  _id: string
  title: string
  imageUrl: string
  categoryName?: string
  location?: string
  year?: number
}

export function BulkDeleteTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteStats, setDeleteStats] = useState({ success: 0, failed: 0 })
  const [showConfirm, setShowConfirm] = useState(false)

  // Fetch all photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true)
        const result = await client.fetch<Photo[]>(
          `*[_type == "photo"] | order(_createdAt desc) {
            _id,
            title,
            "imageUrl": image.asset->url,
            "categoryName": category->name,
            location,
            year
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
    const filteredPhotos = photos.filter((photo) =>
      photo.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setSelectedIds(new Set(filteredPhotos.map((p) => p._id)))
  }, [photos, searchTerm])

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Delete selected photos
  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteStats({ success: 0, failed: 0 })
    setShowConfirm(false)

    const idsToDelete = Array.from(selectedIds)
    let successCount = 0
    let failedCount = 0

    for (const id of idsToDelete) {
      try {
        await client.delete(id)
        successCount++
        console.log(`Deleted photo: ${id}`)
      } catch (error) {
        console.error(`Failed to delete photo ${id}:`, error)
        failedCount++
      }
    }

    setDeleteStats({ success: successCount, failed: failedCount })

    // Refresh the photo list
    const updatedPhotos = photos.filter((photo) => !selectedIds.has(photo._id))
    setPhotos(updatedPhotos)
    setSelectedIds(new Set())
    setIsDeleting(false)
  }

  // Filter photos based on search
  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Box>
          <Text size={3} weight="bold">
            Bulk Delete Photos
          </Text>
          <Text size={1} muted style={{ marginTop: '8px' }}>
            Select multiple photos to delete them all at once. Be careful - this cannot be undone!
          </Text>
        </Box>

        {/* Search Bar */}
        <Card border padding={3}>
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
        </Card>

        {/* Selection Controls */}
        {!isLoading && photos.length > 0 && (
          <Card border padding={3}>
            <Flex justify="space-between" align="center">
              <Text size={2}>
                {selectedIds.size} of {filteredPhotos.length} selected
              </Text>
              <Flex gap={2}>
                <Button
                  text="Select All"
                  mode="ghost"
                  onClick={selectAll}
                  disabled={isDeleting}
                  type="button"
                />
                <Button
                  text="Deselect All"
                  mode="ghost"
                  onClick={deselectAll}
                  disabled={isDeleting || selectedIds.size === 0}
                  type="button"
                />
                <Button
                  text={`Delete ${selectedIds.size} Photos`}
                  tone="critical"
                  icon={TrashIcon}
                  onClick={() => setShowConfirm(true)}
                  disabled={isDeleting || selectedIds.size === 0}
                  type="button"
                />
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <Card border padding={4} tone="critical">
            <Stack space={3}>
              <Text size={2} weight="bold">
                ⚠️ Confirm Deletion
              </Text>
              <Text size={1}>
                Are you sure you want to delete {selectedIds.size} photo{selectedIds.size > 1 ? 's' : ''}? 
                This action cannot be undone!
              </Text>
              <Flex gap={2}>
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setShowConfirm(false)}
                  type="button"
                />
                <Button
                  text="Yes, Delete Now"
                  tone="critical"
                  onClick={handleDelete}
                  type="button"
                />
              </Flex>
            </Stack>
          </Card>
        )}

        {/* Delete Stats */}
        {(deleteStats.success > 0 || deleteStats.failed > 0) && (
          <Card border padding={3} tone={deleteStats.failed > 0 ? 'caution' : 'positive'}>
            <Text size={2}>
              ✅ {deleteStats.success} deleted • ❌ {deleteStats.failed} failed
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
                    opacity: isDeleting ? 0.5 : 1,
                    border: selectedIds.has(photo._id) ? '2px solid #2276fc' : undefined,
                  }}
                  onClick={() => !isDeleting && togglePhoto(photo._id)}
                >
                  <Stack space={2}>
                    {/* Checkbox */}
                    <Flex justify="space-between" align="center">
                      <Checkbox
                        checked={selectedIds.has(photo._id)}
                        onChange={() => togglePhoto(photo._id)}
                        disabled={isDeleting}
                      />
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
              No photos match your search.
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  )
}

