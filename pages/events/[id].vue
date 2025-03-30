<template>
    <div v-if="selectedEvent">
        <p>Die Seite hat die id {{ id }}</p>
        <h1>{{ selectedEvent.name }}</h1>
        <p><strong>Datum:</strong> {{ selectedEvent.date }}</p>
        <p><strong>Stadt:</strong> {{ selectedEvent.city }}</p>
    </div>
    <div v-else>
        <p>Ups, kein passendes Event gefunden 😢, zurück zur Startseite</p>
    </div>
</template>
  
<script setup>
    import { useRoute } from 'vue-router'
  
    const route = useRoute()
    const id = route.params.id

    const events = [
        { id: 1, name: 'Flash Day Leipzig', date: '2025-04-15', city: 'Leipzig' },
        { id: 2, name: 'Tattoo Convention Berlin', date: '2025-05-10', city: 'Berlin' },
        { id: 3, name: 'Ink & Art Festival Hamburg', date: '2025-06-01', city: 'Hamburg' }
    ]
    
    const selectedEvent = events.find(event => event.id === Number(id))

</script>