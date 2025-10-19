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

export function GalleryPage() {
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
      toast.error("Error al cargar las secciones de la galería")
    },
  })

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, sectionId }) => {
      return await galleryService.uploadMedia(file, sectionId)
    },
    onSuccess: () => {
      toast.success("Archivo subido exitosamente")
      setSelectedFile(null)
      queryClient.invalidateQueries(["gallerySections"])
    },
    onError: (error) => {
      console.error("Error uploading file:", error)
      toast.error("Error al subir el archivo")
    },
  })

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("El archivo es demasiado grande. Máximo 5MB.")
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
          className="max-w-full max-h-full object-contain rounded-lg"
          loading="lazy"
        />
      )
    } else if (media.type === "VIDEO") {
      return (
        <video
          src={media.public_url}
          controls
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      )
    }
    return null
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cursive text-center mb-8 sm:mb-12 text-wedding-primary-dark dark:text-wedding-primary px-2">
          Galería de Fotos
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-base sm:text-lg">Cargando secciones...</p>
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
                              No hay imágenes
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)] md:max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl font-cursive text-wedding-primary-dark dark:text-wedding-primary pr-8">
                      {section.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
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
                        {uploadMutation.isLoading ? "Subiendo..." : "Subir Foto"}
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
                              Subir
                            </Button>
                          </div>
                        </div>
                      )}
                      </div>
                    )}

                    {/* Carrusel de imágenes */}
                    {section.media && section.media.length > 0 ? (
                      <div className="relative">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {section.media.map((media) => (
                              <CarouselItem key={media.id}>
                                <div className="flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-lg p-4" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                  {renderMedia(media)}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                        </Carousel>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-wedding-primary/5 dark:bg-wedding-primary-dark/5 rounded-lg">
                        <p>No hay fotos en esta sección</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">No hay secciones disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}

