<template>
  <v-app>
    <v-container>
      <v-text-field v-model="title" label="レシピタイトル" clearable variant="outlined" />
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('')
</script>
