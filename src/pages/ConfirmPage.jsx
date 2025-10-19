import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invitationService } from '@/services/invitationService';
import { useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { InvitationCodeForm } from '@/components/InvitationCodeForm';
import { ConfirmationForm } from '@/components/ConfirmationForm';
import { X, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export function ConfirmPage() {
  const [guests, setGuests] = useState([{ fullName: '' }]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { invitationCode, invitation, setInvitation, clearInvitation } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const weddingDate = new Date(import.meta.env.VITE_WEDDING_DATE || '2026-01-17T18:00:00');
  const rsvpDeadline = new Date(import.meta.env.VITE_RSVP_DEADLINE || '2025-12-17T23:59:59');
  const isDeadlinePassed = new Date() > rsvpDeadline;

  // Fetch invitation details if we have a code
  const { data: invitationData, isLoading: isLoadingInvitation, refetch } = useQuery({
    queryKey: ['invitation', invitationCode],
    queryFn: () => invitationService.getInvitationByCode(invitationCode),
    enabled: !!invitationCode,
    refetchOnMount: 'always', // Siempre recargar cuando se monta el componente
    refetchOnWindowFocus: true, // Recargar cuando la ventana recibe foco
  });

  // useEffect para manejar los datos de la invitación
  useEffect(() => {
    if (invitationData?.data) {
      setInvitation(invitationData.data);
      
      if (invitationData.data.confirmed) {
        // Ya está confirmado, actualizar estado inmediatamente
        setIsConfirmed(true);
        if (invitationData.data.guests && invitationData.data.guests.length > 0) {
          setGuests(invitationData.data.guests.map(guest => ({ fullName: guest.fullName })));
        }
      } else {
        // No está confirmado, inicializar formulario
        setIsConfirmed(false);
        // Inicializar con el invitado principal
        setGuests([{ fullName: invitationData.data.primaryGuest }]);
        // Si hay más invitados permitidos, agregar espacios en blanco
        if (invitationData.data.maxGuests > 1) {
          const additionalGuests = Array(invitationData.data.maxGuests - 1).fill({ fullName: '' });
          setGuests(prev => [...prev, ...additionalGuests]);
        }
      }
    }
  }, [invitationData]);

  const confirmAttendanceMutation = useMutation({
    mutationFn: (data) => invitationService.confirmAttendance(invitationCode, data),
    onSuccess: (response) => {
      // Invalidar y recargar los datos de la invitación
      queryClient.invalidateQueries(['invitation', invitationCode]);
      
      // Actualizar el store con los datos frescos
      if (response.data) {
        setInvitation(response.data);
      }
      
      setIsConfirmed(true);
      setIsConfirming(false);
      setShowModal(false);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast.success('¡Gracias por confirmar tu asistencia!');
    },
    onError: () => {
      toast.error('Error al confirmar la asistencia. Por favor, intenta nuevamente.');
      setIsConfirming(false);
    }
  });

  const handleConfirmClick = () => {
    if (invitationData?.data?.maxGuests > 1) {
      // Inicializar solo los invitados adicionales en el modal
      const additionalGuestsCount = invitationData.data.maxGuests - 1;
      setGuests(Array(additionalGuestsCount).fill({ fullName: '' }));
      setShowModal(true);
    } else {
      // Si solo es un invitado, confirmar directamente con el invitado principal
      handleConfirm([{ fullName: invitationData.data.primaryGuest }]);
    }
  };

  const handleConfirm = (guestsToConfirm = null) => {
    setIsConfirming(true);
    
    // Si no se proporcionan invitados (desde el modal), usar el estado actual
    const finalGuests = guestsToConfirm || guests;
    
    // Filtrar invitados sin nombre y agregar el invitado principal al principio
    const validGuests = [
      { fullName: invitationData.data.primaryGuest },
      ...finalGuests.filter(guest => guest.fullName.trim())
    ];
    
    confirmAttendanceMutation.mutate({
      guests: validGuests
    });
  };

  const handleModalConfirm = () => {
    // Validar que al menos un invitado adicional tenga nombre si se abrió el modal
    const hasValidGuest = guests.some(guest => guest.fullName.trim());
    if (!hasValidGuest) {
      toast.error('Por favor, agrega al menos un invitado adicional');
      return;
    }
    
    handleConfirm();
  };

  const handleGuestChange = (index, value) => {
    const newGuests = [...guests];
    newGuests[index] = { fullName: value };
    setGuests(newGuests);
  };

  // If deadline has passed, show message
  if (isDeadlinePassed) {
    return (
      <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-wedding-primary-dark dark:text-wedding-primary">
              Confirmación Cerrada
            </CardTitle>
            <CardDescription className="text-center mt-2">
              Lo sentimos, el plazo para confirmar asistencia ha terminado.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Si tienes alguna consulta, por favor contáctanos directamente.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-wedding-primary hover:bg-wedding-primary-dark text-white"
            >
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If already confirmed, show confirmation message
  if (isConfirmed) {
    // Obtener la lista completa de invitados desde la invitación o desde guests
    const confirmedGuestsList = invitationData?.data?.guests || invitation?.guests || guests.filter(g => g.fullName?.trim());
    
    return (
      <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-wedding-primary-dark dark:text-wedding-primary">
              ¡Asistencia Confirmada!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-4">
              ¡Los esperamos en nuestra boda!
            </h3>
            <p className="mb-6">
              Gracias por confirmar tu asistencia. Estamos emocionados de compartir este día especial contigo.
            </p>
            <div className="bg-wedding-primary/10 dark:bg-wedding-primary-dark/10 p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-center">Invitados confirmados:</h4>
              <ul className="list-disc list-inside space-y-1">
                {confirmedGuestsList.length > 0 ? (
                  confirmedGuestsList.map((guest, index) => (
                    <li key={index} className="text-center">{guest.fullName}</li>
                  ))
                ) : (
                  <li className="text-center">{invitationData?.data?.primaryGuest || invitation?.primaryGuest || 'Invitado'}</li>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-wedding-primary hover:bg-wedding-primary-dark text-white"
            >
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If no invitation code yet, show the code form
  if (!invitationCode) {
    return (
      <div className="min-h-[80vh] py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-cursive text-center mb-6 sm:mb-8 text-wedding-primary-dark dark:text-wedding-primary px-2">
            Confirma tu Asistencia
          </h1>
          <p className="text-center mb-6 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
            Por favor, ingresa el código de invitación que recibiste para confirmar tu asistencia.
          </p>
          <InvitationCodeForm />
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingInvitation) {
    return (
      <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
        <p className="text-xl">Cargando invitación...</p>
      </div>
    );
  }

  // Main confirmation form
  return (
    <div className="min-h-[80vh] py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-cursive text-center mb-6 sm:mb-8 text-wedding-primary-dark dark:text-wedding-primary px-2">
          Confirma tu Asistencia
        </h1>

        {invitationData?.data && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">Hola, {invitationData.data.primaryGuest}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Por favor confirma tu asistencia antes del 17 de Diciembre, 2025.
                {invitationData.data.maxGuests > 1 && (
                  <p className="mt-2">
                    Puedes agregar hasta {invitationData.data.maxGuests - 1} invitado{invitationData.data.maxGuests - 1 > 1 ? 's' : ''} adicional{invitationData.data.maxGuests - 1 > 1 ? 'es' : ''}.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                onClick={handleConfirmClick}
                className="bg-wedding-primary hover:bg-wedding-primary-dark text-white min-h-[44px] text-sm sm:text-base px-6 sm:px-8"
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirmando...' : 'Confirmar Asistencia'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Agregar Invitados Adicionales</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
              <p className="text-xs sm:text-sm text-gray-500">
                Invitado Principal: {invitationData?.data?.primaryGuest}
              </p>
              <div className="border-t pt-3 sm:pt-4">
                {guests.map((guest, index) => (
                  <div key={index} className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4">
                    <label className="text-xs sm:text-sm font-medium">
                      Invitado Adicional {index + 1}
                    </label>
                    <Input
                      value={guest.fullName}
                      onChange={(e) => handleGuestChange(index, e.target.value)}
                      placeholder="Nombre completo"
                      disabled={isConfirming}
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isConfirming}
                className="min-h-[44px] w-full sm:w-auto text-sm sm:text-base"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleModalConfirm}
                className="bg-wedding-primary hover:bg-wedding-primary-dark text-white min-h-[44px] w-full sm:w-auto text-sm sm:text-base"
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirmando...' : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}