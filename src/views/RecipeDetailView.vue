<template>
  <v-container>
    <h1>レシピ名</h1>
    <v-card v-if="recipe" class="mx-auto my-5" max-width="600">
      <v-img :src="recipe.image" height="300px" cover></v-img>
      <v-card-title>{{ RecipeCard.title }}</v-card-title>
      <v-card-subtitle>{{ RecipeCard.category }}</v-card-subtitle>
      <v-card-text>
        <p>{{ recipe.description }}</p>
        <h4>材料</h4>
        <v-list>
          <v-list-item v-for="(item, index) in recipe.ingredients" :key="index">
            {{ item }}
          </v-list-item>
        </v-list>
        <h4>手順</h4>
        <ol>
          <li v-for="(step, index) in recipe.steps" :key="index">{{ step }}</li>
        </ol>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="goBack">戻る</v-btn>
      </v-card-actions>
    </v-card>

    <v-alert v-else-if="isLoaded" type="error" title="レシピが見つかりません">
      該当するレシピが存在しません
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/RecipeCard.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Recipe } from '@/types/recipe'
import { getRecipeById } from '@/api/recipeApi'

const route = useRoute()
const router = useRouter()

const isLoaded = ref(false)

const recipe = ref<Recipe | null>(null)

const fetchRecipe = async () => {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const data = await getRecipeById(id)
    recipe.value = data
  } catch (error) {
    console.error('取得失敗:', error)
    recipe.value = null
  }
}

const goBack = () => {
  router.back()
}

onMounted(fetchRecipe)
</script>

<style scoped></style>
