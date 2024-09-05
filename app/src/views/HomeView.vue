<script setup lang="ts">
import { type Logger } from "@datadog/browser-logs";
import { ref, onMounted, inject } from 'vue'
import { addUser, getUsers, queryWhere, deleteAll } from '../db.ts'
import dayjs from 'dayjs'
import axios from 'axios'

const usersState = ref([])
const logger = inject('logger') as Logger
const infoEvent = () => {
  logger.info('Hello world', {
    date: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

const fetchUsers = async () => {
  const users = await axios.get('https://jsonplaceholder.typicode.com/users').then(res => res.data)
  usersState.value = users
}

const getUsersFromDB = async () => {
  const users = await getUsers()
  usersState.value = users
}

onMounted(async()=>{
  const q = await queryWhere('email', '@')
  console.log(q)
})

</script>

<template>
  <main class="container mx-auto p-2">
    <h1 class="text-2xl line-clamp-4 py-2">Datadog Browser Logs Demo</h1>
    <button @click="infoEvent" class="bg-blue-600 text-white p-2 mb-2 rounded">INFO</button>
    <hr />
    <div class="container mx-auto p-4">
      <button @click="fetchUsers" class="bg-blue-500 text-white p-2 mb-4 rounded">Get Users from API</button>
      <button class="bg-blue-500 text-white p-2 mb-4 rounded ml-3" @click="getUsersFromDB">Get IndexedDB</button>
      <button class="bg-red-500 text-white p-2 mb-4 rounded ml-3" @click="deleteAll">Delete All</button>
      <div class="grid gap-2 grid-cols-2">
        <div v-for="user in usersState" :key="user.id" class="border-2 p-2 flex">
          <div class="content">
            <h2>{{ user.name }}</h2>
            <p>{{ user.username }}</p>
            <p>{{ user.email }}</p>
            <p>{{ user.phone }}</p>
          </div>
          <div class="actions ml-auto">
            <button @click="addUser(user)" class="bg-blue-500 text-white p-2 rounded">Add</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
