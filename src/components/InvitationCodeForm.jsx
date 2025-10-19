import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { invitationService } from '@/services/invitationService';
import { useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function InvitationCodeForm() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { setInvitationCode } = useStore();
  const navigate = useNavigate();

  const validateCodeMutation = useMutation({
    mutationFn: (invitationCode) => invitationService.validateInvitationCode(invitationCode),
    onSuccess: (response) => {
      if (response.data.valid) {
        setInvitationCode(code);
        toast.success('¡Código válido!');
        setTimeout(() => {
          navigate('/confirm', { replace: true });
        }, 100);
      } else {
        toast.error('Código de invitación inválido. Por favor, verifica e intenta nuevamente.');
      }
    },
    onError: () => {
      toast.error('Error al validar el código. Por favor, intenta más tarde.');
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Por favor ingresa un código de invitación');
      return;
    }
    
    setLoading(true);
    validateCodeMutation.mutate(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-1.5 sm:space-y-2">
        <label htmlFor="invitation-code" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          Código de Invitación
        </label>
        <Input
          id="invitation-code"
          type="text"
          placeholder="Ingresa tu código de invitación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border-wedding-primary/50 focus:border-wedding-primary-dark dark:border-wedding-primary-dark/30 min-h-[44px] text-sm sm:text-base"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-wedding-primary hover:bg-wedding-primary-dark text-white min-h-[44px] text-sm sm:text-base"
        disabled={loading}
      >
        {loading ? 'Verificando...' : 'Verificar Código'}
      </Button>
    </form>
  );
}