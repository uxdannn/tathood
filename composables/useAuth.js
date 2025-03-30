import { useRouter } from 'vue-router'
import { supabase } from '~/lib/supabaseClient'

export function useAuth() {
  const user = useState('user', () => null)
  const router = useRouter()

  const setUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('artistProfile')      // 👤 persönliches Profil
    localStorage.removeItem('artistProfiles')     // 📦 alle Artist-Profile Startseite
    user.value = null
    router.push('/login')
  }

  return {
    user,
    setUser,
    logout,
  }
}
