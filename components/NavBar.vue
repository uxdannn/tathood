<script setup>
import { onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { user, setUser, logout } = useAuth()

onMounted(() => {
  setUser()
})

// Damit NavBar bei Änderungen sofort reagiert
watchEffect(() => {
  if (user.value === null) {
    // Optional: du kannst auch eine Umleitung einbauen
  }
})
</script>

<template>
  <nav>
    <NuxtLink to="/">Startseite</NuxtLink>
    <template v-if="user">
      <NuxtLink to="/account">Account</NuxtLink>
    </template>
    <template v-else>
      <NuxtLink to="/login">Login</NuxtLink>
      <NuxtLink to="/signup">Sign-Up</NuxtLink>
    </template>
  </nav>
</template>

<style scoped>
nav {
  background-color: silver;
  padding: 10px;
  margin-bottom: 20px;
}

nav a,
nav button {
  margin-right: 10px;
  text-decoration: none;
  color: black;
  background-color: gray;
  padding: 5px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
</style>