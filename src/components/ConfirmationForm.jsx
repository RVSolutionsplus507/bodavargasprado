import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { invitationService } from '@/services/invitationService';
import { useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export function ConfirmationForm() {
  const [additionalGuests, setAdditionalGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { invitationCode, invitation } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (invitation && invitation.maxGuests > 1) {
      // Inicializar con el invitado principal
      setAdditionalGuests([
        { fullName: invitation.primaryGuest },
        ...Array(invitation.maxGuests - 1).fill({ fullName: '' })
      ]);
    } else if (invitation) {
      // Si solo es un invitado, inicializar con el invitado principal
      setAdditionalGuests([{ fullName: invitation.primaryGuest }]);
    }
  }, [invitation]);

  const confirmAttendanceMutation = useMutation({
    mutationFn: (data) => invitationService.confirmAttendance(invitationCode, data),
    onSuccess: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('¡Gracias por confirmar tu asistencia!');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    },
    onError: (error) => {
      console.error('Error al confirmar:', error);
      toast.error('Error al confirmar la asistencia. Por favor, intenta nuevamente.');
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar que todos los campos estén completos
    if (additionalGuests.some(guest => !guest.fullName.trim())) {
      toast.error('Por favor completa el nombre de todos los invitados');
      setLoading(false);
      return;
    }

    // Enviar solo los invitados con nombres completos
    const validGuests = additionalGuests.filter(guest => guest.fullName.trim());
    
    confirmAttendanceMutation.mutate({
      guests: validGuests
    });
  };

  const handleGuestChange = (index, value) => {
    const newGuests = [...additionalGuests];
    newGuests[index] = { fullName: value };
    setAdditionalGuests(newGuests);
  };

  if (!invitation) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {additionalGuests.map((guest, index) => (
          <div key={index} className="space-y-2">
            <label className="text-sm font-medium">
              {index === 0 ? 'Invitado Principal' : `Invitado ${index + 1}`}
            </label>
            <Input
              value={guest.fullName}
              onChange={(e) => handleGuestChange(index, e.target.value)}
              placeholder="Nombre completo"
              disabled={loading || index === 0} // Deshabilitar el campo del invitado principal
            />
          </div>
        ))}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-wedding-primary hover:bg-wedding-primary-dark text-white"
        disabled={loading}
      >
        {loading ? 'Confirmando...' : 'Confirmar Asistencia'}
      </Button>
    </form>
  );
} 