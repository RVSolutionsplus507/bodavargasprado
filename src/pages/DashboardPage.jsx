import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { invitationService } from "@/services/invitationService"
import { galleryService } from "@/services/galleryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash, X, Plus, Image, RefreshCw, Eye, EyeOff, Upload, Settings, UserMinus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(true)
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [newInvitation, setNewInvitation] = useState({
    primaryGuest: "",
    maxGuests: 1,
  })
  const [newSection, setNewSection] = useState({
    name: "",
    description: "",
    allow_upload: true,
    is_active: false
  })
  const [editingSection, setEditingSection] = useState(null)
  const queryClient = useQueryClient()

  // Verificar si ya está autenticado en sessionStorage
  useEffect(() => {
    const authenticated = sessionStorage.getItem('dashboard_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
    }
  }, [])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    const correctPassword = import.meta.env.VITE_API_KEY
    
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
      setPasswordError("")
      sessionStorage.setItem('dashboard_authenticated', 'true')
      toast.success("¡Acceso concedido!")
    } else {
      setPasswordError("Contraseña incorrecta")
      toast.error("Contraseña incorrecta")
      setPassword("")
    }
  }

  // Fetch invitations and stats
  const { data: invitations = [], isLoading: loadingInvitations } = useQuery({
    queryKey: ["invitations"],
    queryFn: () => invitationService.getAllInvitations().then((res) => res.data || []),
    onError: (error) => {
      console.error("Error fetching invitations:", error)
      toast.error("Error al cargar las invitaciones")
    },
  })

  // Fetch gallery sections (todas para admin)
  const { data: sections = [], isLoading: loadingSections } = useQuery({
    queryKey: ["gallery-sections"],
    queryFn: () => galleryService.getAllSections().then((res) => res.data || []),
    onError: (error) => {
      console.error("Error fetching gallery sections:", error)
      toast.error("Error al cargar las secciones de la galería")
    },
  })

  const {
    data: stats,
    isLoading: loadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["invitationStats"],
    queryFn: () => invitationService.getInvitationsStats().then((res) => res.data),
    onError: (error) => {
      console.error("Error fetching stats:", error)
      toast.error("Error al cargar las estadísticas: " + (error.response?.data?.error || error.message))
    },
  })

  // Mutations
  const createInvitationMutation = useMutation({
    mutationFn: (data) => invitationService.createInvitation(data),
    onSuccess: () => {
      toast.success("Invitación creada exitosamente")
      setNewInvitation({ primaryGuest: "", maxGuests: 1 })
      queryClient.invalidateQueries(["invitations"])
      queryClient.invalidateQueries(["invitationStats"])
    },
    onError: () => {
      toast.error("Error al crear la invitación")
    },
  })

  const deleteInvitationMutation = useMutation({
    mutationFn: (id) => invitationService.deleteInvitation(id),
    onSuccess: () => {
      toast.success("Invitación eliminada exitosamente")
      queryClient.invalidateQueries(["invitations"])
      queryClient.invalidateQueries(["invitationStats"])
    },
    onError: () => {
      toast.error("Error al eliminar la invitación")
    },
  })

  const deleteGuestMutation = useMutation({
    mutationFn: (guestId) => invitationService.deleteGuest(guestId),
    onSuccess: () => {
      toast.success("Invitado eliminado exitosamente")
      queryClient.invalidateQueries(["invitations"])
      queryClient.invalidateQueries(["invitationStats"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Error al eliminar el invitado")
    },
  })

  // Gallery Mutations
  const createSectionMutation = useMutation({
    mutationFn: (data) => galleryService.createSection(data),
    onSuccess: () => {
      toast.success("Sección creada exitosamente")
      setNewSection({ name: "", description: "", allow_upload: true, is_active: false })
      queryClient.invalidateQueries(["gallery-sections"])
    },
    onError: () => {
      toast.error("Error al crear la sección")
    },
  })

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, data }) => galleryService.updateSection(id, data),
    onSuccess: () => {
      toast.success("Sección actualizada exitosamente")
      setEditingSection(null)
      queryClient.invalidateQueries(["gallery-sections"])
    },
    onError: () => {
      toast.error("Error al actualizar la sección")
    },
  })

  const deleteSectionMutation = useMutation({
    mutationFn: (id) => galleryService.deleteSection(id),
    onSuccess: () => {
      toast.success("Sección eliminada exitosamente")
      queryClient.invalidateQueries(["gallery-sections"])
    },
    onError: () => {
      toast.error("Error al eliminar la sección")
    },
  })

  const seedSectionsMutation = useMutation({
    mutationFn: () => galleryService.seedSections(),
    onSuccess: () => {
      toast.success("Secciones de prueba creadas exitosamente")
      queryClient.invalidateQueries(["gallery-sections"])
    },
    onError: () => {
      toast.error("Error al crear las secciones de prueba")
    },
  })

  const handleCreateInvitation = (e) => {
    e.preventDefault()
    if (!newInvitation.primaryGuest.trim()) {
      toast.error("Por favor ingresa el nombre del invitado principal")
      return
    }

    createInvitationMutation.mutate(newInvitation)
  }

  const handleDeleteInvitation = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta invitación?")) {
      deleteInvitationMutation.mutate(id)
    }
  }

  const handleDeleteGuest = (guest, invitation) => {
    const isMainGuest = guest.fullName === invitation.primaryGuest
    if (isMainGuest) {
      toast.error("No se puede eliminar el invitado principal. Elimina toda la invitación en su lugar.")
      return
    }
    
    if (confirm(`¿Estás seguro de que deseas eliminar a ${guest.fullName}? Esto liberará un puesto y reducirá el máximo de invitados.`)) {
      deleteGuestMutation.mutate(guest.id)
    }
  }

  const handleCreateSection = (e) => {
    e.preventDefault()
    if (!newSection.name.trim()) {
      toast.error("Por favor ingresa el nombre de la sección")
      return
    }
    createSectionMutation.mutate(newSection)
  }

  const handleUpdateSection = (section, updates) => {
    updateSectionMutation.mutate({
      id: section.id,
      data: updates
    })
  }

  const handleToggleActive = (section) => {
    handleUpdateSection(section, { is_active: !section.is_active })
  }

  const handleToggleUpload = (section) => {
    handleUpdateSection(section, { allow_upload: !section.allow_upload })
  }

  const handleDeleteSection = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sección? Se eliminarán todas las imágenes asociadas.")) {
      deleteSectionMutation.mutate(id)
    }
  }

  const handleSeedSections = () => {
    if (confirm("¿Estás seguro de que deseas crear las secciones de prueba?")) {
      seedSectionsMutation.mutate()
    }
  }

  // Si no está autenticado, mostrar solo el dialog de contraseña
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <Dialog open={showPasswordDialog} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-center text-wedding-primary-dark dark:text-wedding-primary">
                Acceso al Panel de Administración
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa la contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError("")
                    }}
                    className={passwordError ? "border-red-500 pr-10" : "pr-10"}
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-wedding-primary hover:bg-wedding-primary-dark text-white">
                Acceder
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-center mb-8 text-wedding-primary-dark dark:text-wedding-primary">
          Panel de Administración
        </h1>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 w-full gap-2">
            <TabsTrigger value="stats" className="text-xs sm:text-sm">Estadísticas</TabsTrigger>
            <TabsTrigger value="invitations" className="text-xs sm:text-sm">Invitaciones</TabsTrigger>
            <TabsTrigger value="create" className="text-xs sm:text-sm">Crear</TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs sm:text-sm">Galería</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            {loadingStats ? (
              <p className="text-center">Cargando estadísticas...</p>
            ) : statsError ? (
              <div className="text-center py-8">
                <p className="text-red-500">
                  Error al cargar estadísticas: {statsError.response?.data?.error || statsError.message}
                </p>
                <Button
                  onClick={() => queryClient.invalidateQueries(["invitationStats"])}
                  className="mt-4"
                  variant="outline"
                >
                  Reintentar
                </Button>
              </div>
            ) : stats ? (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Invitados Totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalGuests || 0} / 120</p>
                    <p className="text-sm text-gray-500 mt-2">Capacidad máxima: 120 invitados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Confirmados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.confirmedGuests || 0}</p>
                    <p className="text-sm text-gray-500 mt-2">{stats.confirmedPercentage || 0}% de los invitados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Invitaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalInvitations || 0}</p>
                    <p className="text-sm text-gray-500 mt-2">{stats.confirmedInvitations || 0} confirmadas</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-center">No hay estadísticas disponibles</p>
            )}
          </TabsContent>

          <TabsContent value="invitations">
            {loadingInvitations ? (
              <p className="text-center">Cargando invitaciones...</p>
            ) : Array.isArray(invitations) && invitations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-wedding-primary/10 dark:bg-wedding-primary-dark/10 text-left">
                      <th className="px-4 py-3">Invitado Principal</th>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Máx. Invitados</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Invitados</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Asegúrate de que invitations sea un array antes de mapearlo */}
                    {Array.isArray(invitations) &&
                      invitations.map((invitation) => (
                        <tr key={invitation.id} className="border-b border-gray-200 dark:border-gray-800">
                              <td className="px-4 py-4">{invitation.primaryGuest}</td>
                              <td className="px-4 py-4 font-mono text-sm">{invitation.code}</td>
                              <td className="px-4 py-4">{invitation.maxGuests}</td>
                              <td className="px-4 py-4">
                                {invitation.confirmed ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Confirmado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pendiente
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                {invitation.guests && invitation.guests.length > 0 ? (
                                  <div>
                                    <span className="text-sm font-medium">{invitation.guests.length} invitado{invitation.guests.length > 1 ? 's' : ''}:</span>
                                    <ul className="space-y-1 mt-2">
                                      {invitation.guests.map((guest) => {
                                        const isMainGuest = guest.fullName === invitation.primaryGuest
                                        return (
                                          <li key={guest.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                            <span className="flex items-center gap-2">
                                              {guest.fullName}
                                              {isMainGuest && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                  Principal
                                                </span>
                                              )}
                                            </span>
                                            {!isMainGuest && invitation.confirmed && (
                                              <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteGuest(guest, invitation)}
                                                className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Eliminar invitado adicional"
                                              >
                                                <UserMinus className="w-3 h-3" />
                                              </Button>
                                            )}
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm">Sin invitados confirmados</span>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteInvitation(invitation.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Eliminar invitación completa"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8">No hay invitaciones creadas aún.</p>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Invitación</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateInvitation} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="primaryGuest" className="text-sm font-medium">
                        Invitado Principal
                      </label>
                      <Input
                        id="primaryGuest"
                        value={newInvitation.primaryGuest}
                        onChange={(e) => setNewInvitation({ ...newInvitation, primaryGuest: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="maxGuests" className="text-sm font-medium">
                        Número Máximo de Invitados
                      </label>
                      <Input
                        id="maxGuests"
                        type="number"
                        min="1"
                        max="8"
                        value={newInvitation.maxGuests}
                        onChange={(e) =>
                          setNewInvitation({ ...newInvitation, maxGuests: Number.parseInt(e.target.value) })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Incluye al invitado principal. Máximo 8 personas por invitación.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-wedding-primary hover:bg-wedding-primary-dark text-white"
                    disabled={createInvitationMutation.isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createInvitationMutation.isLoading ? "Creando..." : "Crear Invitación"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Administración de la Galería</CardTitle>
                  <CardDescription>
                    Crea y gestiona las secciones de la galería. Controla qué secciones son visibles y si permiten subir fotos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Crear nueva sección */}
                    <form onSubmit={handleCreateSection} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sectionName">Nombre de la Sección *</Label>
                          <Input
                            id="sectionName"
                            placeholder="Ej: Ceremonia, Recepción, etc."
                            value={newSection.name}
                            onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sectionDescription">Descripción (opcional)</Label>
                          <Input
                            id="sectionDescription"
                            placeholder="Descripción breve"
                            value={newSection.description}
                            onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="allow-upload"
                            checked={newSection.allow_upload}
                            onCheckedChange={(checked) => setNewSection({ ...newSection, allow_upload: checked })}
                          />
                          <Label htmlFor="allow-upload" className="cursor-pointer text-sm">
                            Permitir subir fotos
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is-active"
                            checked={newSection.is_active}
                            onCheckedChange={(checked) => setNewSection({ ...newSection, is_active: checked })}
                          />
                          <Label htmlFor="is-active" className="cursor-pointer text-sm">
                            Activar sección
                          </Label>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={createSectionMutation.isLoading}>
                        <Plus className="w-4 h-4 mr-2" />
                        {createSectionMutation.isLoading ? "Creando..." : "Crear Nueva Sección"}
                      </Button>
                    </form>

                    {/* Lista de secciones */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Secciones ({sections.length})</h3>
                      </div>
                      
                      {loadingSections ? (
                        <p className="text-center py-4">Cargando secciones...</p>
                      ) : sections.length > 0 ? (
                        <div className="grid gap-4">
                          {sections.map((section) => (
                            <Card key={section.id} className={!section.is_active ? "opacity-60" : ""}>
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                                  <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-base sm:text-lg">{section.name}</h4>
                                      {section.is_active ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                          <Eye className="w-3 h-3 mr-1" />
                                          Activa
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                          <EyeOff className="w-3 h-3 mr-1" />
                                          Inactiva
                                        </span>
                                      )}
                                    </div>
                                    {section.description && (
                                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{section.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                                      <span>Orden: {section.order}</span>
                                      <span className="hidden sm:inline">•</span>
                                      <span>Fotos: {section.media?.length || 0}</span>
                                      <span className="hidden sm:inline">•</span>
                                      <span className="flex items-center gap-1">
                                        {section.allow_upload ? (
                                          <>
                                            <Upload className="w-3 h-3" />
                                            <span className="hidden sm:inline">Subida permitida</span>
                                            <span className="sm:hidden">Subida OK</span>
                                          </>
                                        ) : (
                                          <>
                                            <X className="w-3 h-3" />
                                            <span className="hidden sm:inline">Subida bloqueada</span>
                                            <span className="sm:hidden">Sin subida</span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                    <div className="flex gap-2 flex-1 sm:flex-initial">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleActive(section)}
                                        disabled={updateSectionMutation.isLoading}
                                      >
                                        {section.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleUpload(section)}
                                        disabled={updateSectionMutation.isLoading}
                                      >
                                        <Upload className="w-4 h-4" />
                                      </Button>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Editar Sección</DialogTitle>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                              <Label>Nombre</Label>
                                              <Input
                                                value={editingSection?.name || section.name}
                                                onChange={(e) => setEditingSection({ ...section, name: e.target.value })}
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Descripción</Label>
                                              <Textarea
                                                value={editingSection?.description || section.description || ""}
                                                onChange={(e) => setEditingSection({ ...section, description: e.target.value })}
                                              />
                                            </div>
                                            <Button
                                              onClick={() => {
                                                if (editingSection) {
                                                  handleUpdateSection(section, {
                                                    name: editingSection.name,
                                                    description: editingSection.description
                                                  })
                                                }
                                              }}
                                              className="w-full"
                                            >
                                              Guardar Cambios
                                            </Button>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteSection(section.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <Image className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">No hay secciones creadas aún.</p>
                          <p className="text-sm text-gray-500 mt-1">Crea tu primera sección usando el formulario arriba.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

