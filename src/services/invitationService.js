// src/services/invitationService.js
import { api } from "../lib/api"

export const invitationService = {
  validateInvitationCode: async (code) => {
    try {
      const response = await api.get(`/api/invitations/validate/${code}`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getInvitationByCode: async (code) => {
    try {
      const response = await api.get(`/api/invitations/${code}`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getInvitationDetails: async (code) => {
    try {
      const response = await api.get(`/api/invitations/${code}/details`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  confirmAttendance: async (code, data) => {
    try {
      const response = await api.post(`/api/invitations/${code}/confirm`, data)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getInvitationsStats: async () => {
    try {
      const response = await api.get("/api/invitations/stats")
      return { data: response.data, error: null }
    } catch (error) {
      console.error("Error fetching invitation stats:", error)
      return { data: null, error }
    }
  },

  getAllInvitations: async () => {
    try {
      const response = await api.get("/api/invitations")
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  createInvitation: async (data) => {
    try {
      const response = await api.post("/api/invitations", data)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  updateInvitation: async (id, data) => {
    try {
      const response = await api.put(`/api/invitations/${id}`, data)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  deleteInvitation: async (id) => {
    try {
      const response = await api.delete(`/api/invitations/${id}`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  deleteGuest: async (guestId) => {
    try {
      const response = await api.delete(`/api/guests/${guestId}`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}

