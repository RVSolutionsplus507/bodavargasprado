// src/store/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      invitationCode: null,
      invitation: null,
      setTheme: (theme) => set({ theme }),
      setInvitationCode: (invitationCode) => set({ invitationCode }),
      setInvitation: (invitation) => set({ invitation }),
      clearInvitation: () => set({ invitation: null, invitationCode: null }),
    }),
    {
      name: 'wedding-storage',
    }
  )
);
