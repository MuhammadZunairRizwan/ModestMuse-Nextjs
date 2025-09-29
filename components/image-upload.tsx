"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file")
  const [uploading, setUploading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`)
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 5MB)`)
        }

        // For now, we'll create a local URL since no cloud storage is configured
        // In a real app, you would upload to your cloud storage service here
        const localUrl = URL.createObjectURL(file)

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return localUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedUrls])

      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUrlAdd = () => {
    if (!newImageUrl.trim()) return

    if (images.length >= maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      })
      return
    }

    // Basic URL validation
    try {
      new URL(newImageUrl)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      })
      return
    }

    onImagesChange([...images, newImageUrl])
    setNewImageUrl("")

    toast({
      title: "Image added",
      description: "Image URL added successfully",
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Label>
          Product Images ({images.length}/{maxImages})
        </Label>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={uploadMode === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("file")}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button
            type="button"
            variant={uploadMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("url")}
          >
            <LinkIcon className="w-4 h-4 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {uploadMode === "file" ? (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload images or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={uploading || images.length >= maxImages}
            />
          </div>
          {uploading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Uploading images...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            placeholder="Enter image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleUrlAdd()}
          />
          <Button type="button" onClick={handleUrlAdd} disabled={!newImageUrl.trim() || images.length >= maxImages}>
            Add
          </Button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Main</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">No images added yet</p>
            <p className="text-xs text-gray-500">Add images to showcase your product</p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-500">
        Note: Since no cloud storage is configured, uploaded files will create temporary URLs. For production, integrate
        with a cloud storage service like AWS S3, Cloudinary, or Vercel Blob.
      </p>
    </div>
  )
}
