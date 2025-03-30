<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()
const { login } = useAuth()

const handleLogin = async () => {
  error.value = null

  const { error: loginError } = await login(email.value, password.value)

  if (loginError) {
    error.value = loginError.message
  } else {
    router.push('/account')
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Passwort" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">❌ {{ error }}</p>
  </div>
</template>

<style scoped>
form {
  margin-bottom: 20px;
}
</style>