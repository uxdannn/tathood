// composables/useAuth.js
import { supabase } from '~/lib/supabaseClient'

export function useAuth() {
  const user = useState('user', () => null)

  const artistProfile = useState('artistProfile', () => {
    if (process.client) {
      const cached = localStorage.getItem('artistProfile')
      return cached ? JSON.parse(cached) : null
    }
    return null
  })

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) console.error('Fehler beim Abrufen des Users:', error)
    user.value = data?.user || null
  }

  const fetchArtistProfile = async () => {
    if (!user.value) return

    const { data: profileData, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .maybeSingle()

    if (error) {
      console.error('Fehler beim Laden des Profils:', error)
      return
    }

    if (profileData) {
      artistProfile.value = profileData
      if (process.client) {
        localStorage.setItem('artistProfile', JSON.stringify(profileData))
      }
    } else {
      artistProfile.value = null
      if (process.client) {
        localStorage.removeItem('artistProfile')
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    artistProfile.value = null
    if (process.client) {
      localStorage.removeItem('artistProfile')
      localStorage.removeItem('artistProfiles')
    }

    if (process.client) {
      window.location.href = '/login'
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) user.value = data.user
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error) user.value = data.user
    return { data, error }
  }

  // NEU: Route-Schutz
  const requireAuth = async () => {
    await fetchUser()
    if (!user.value) {
      return navigateTo('/login')
    }
  }

  return {
    user,
    artistProfile,
    fetchUser,
    fetchArtistProfile,
    logout,
    login,
    signUp,
    requireAuth, // NEU
  }
}