<script setup lang="ts">
import { type Logger } from "@datadog/browser-logs";
import { ref, onMounted, inject } from 'vue'
import dayjs from 'dayjs'

const logger = inject('logger') as Logger
const infoEvent = () => {
  logger.info('Hello world', {
    date: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}
onMounted(() => {

})
</script>

<template>
  <main>
    <h1>Datadog Browser Logs Demo</h1>
    <button @click="infoEvent">INFO</button>
  </main>
</template>
