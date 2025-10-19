import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { galleryService } from "@/services/galleryService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"
import { useTranslation } from "react-i18next"

export function GalleryPage() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const fileInputRef = useRef(null)
  const queryClient = useQueryClient()

  // Fetch gallery sections
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["gallerySections"],
    queryFn: async () => {
      const result = await galleryService.getSections()
      return result.data || []
    },
    onError: (error) => {
      console.error("Error loading sections:", error)
      toast.error(t('gallery.uploadError'))
    },
  })

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, sectionId }) => {
      return await galleryService.uploadMedia(file, sectionId)
    },
    onSuccess: () => {
      toast.success(t('gallery.uploadSuccess'))
      setSelectedFile(null)
      queryClient.invalidateQueries(["gallerySections"])
    },
    onError: (error) => {
      console.error("Error uploading file:", error)
      toast.error(t('gallery.uploadError'))
    },
  })

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('gallery.fileTooLarge'))
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedSection) return

    uploadMutation.mutate({
      file: selectedFile,
      sectionId: selectedSection.id
    })
  }

  const renderMedia = (media) => {
    if (!media) return null

    if (media.type === "IMAGE") {
      return (
        <img
          src={media.public_url}
          alt={media.name || "Imagen de galería"}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      )
    } else if (media.type === "VIDEO") {
      return (
        <video
          src={media.public_url}
          controls
          className="w-full h-full object-contain"
        />
      )
    }
    return null
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cursive text-center mb-8 sm:mb-12 text-wedding-primary-dark dark:text-wedding-primary px-2">
          {t('gallery.title')}
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-base sm:text-lg">{t('gallery.loading')}</p>
          </div>
        ) : sections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sections.map((section) => (
              <Dialog 
                key={section.id} 
                onOpenChange={(open) => {
                  if (open) setSelectedSection(section)
                  else {
                    setSelectedSection(null)
                    setSelectedFile(null)
                  }
                }}
              >
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg md:text-xl text-center">{section.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        {section.media && section.media.length > 0 ? (
                          <img
                            src={section.media[0].public_url}
                            alt={section.name}
                            className="w-full h-48 object-cover rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-48 bg-wedding-primary/10 dark:bg-wedding-primary-dark/10 rounded-lg flex items-center justify-center">
                            <p className="text-wedding-primary dark:text-wedding-primary-dark">
                              {t('gallery.noImages')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6">
                  <DialogHeader className="pb-2 sm:pb-4">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl font-cursive text-wedding-primary-dark dark:text-wedding-primary pr-8">
                      {section.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Botón de subida - Solo si allow_upload es true */}
                    {section.allow_upload && (
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 min-h-[44px] text-sm sm:text-base"
                        onClick={handleFileClick}
                        disabled={uploadMutation.isLoading}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadMutation.isLoading ? t('gallery.uploading') : t('gallery.uploadButton')}
                      </Button>
                      {selectedFile && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                          <span className="text-xs sm:text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFile(null)}
                              disabled={uploadMutation.isLoading}
                              className="min-h-[44px] min-w-[44px]"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleUpload}
                              disabled={uploadMutation.isLoading}
                              className="min-h-[44px]"
                            >
                              {t('gallery.uploadButtonAction')}
                            </Button>
                          </div>
                        </div>
                      )}
                      </div>
                    )}

                    {/* Carrusel de imágenes */}
                    {section.media && section.media.length > 0 ? (
                      <div className="relative w-full">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {section.media.map((media) => (
                              <CarouselItem key={media.id}>
                                <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-2 sm:p-4 md:p-6">
                                  <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
                                    {renderMedia(media)}
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800" />
                          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800" />
                        </Carousel>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-wedding-primary/5 dark:bg-wedding-primary-dark/5 rounded-lg">
                        <p>{t('gallery.noPhotos')}</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">{t('gallery.noSections')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

