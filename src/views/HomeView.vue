<template>
  <v-container>
    <v-btn @click="openForm" color="primary" class="my-4">レシピを追加</v-btn>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard
          :recipe="recipe"
          @click="openDetail"
          @edit="editRecipe"
          @delete="deleteRecipe"
        />
      </v-col>
    </v-row>

    <!-- 登録/編集フォーム -->
    <v-dialog v-model="formDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ selectedRecipe?.id ? 'レシピを編集' : 'レシピを追加' }}</span>
        </v-card-title>
        <v-card-text>
          <RecipeForm :model-value="selectedRecipe" @submit="handleSubmit" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/RecipeCard.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import { useRecipe } from '@/composables/useRecipe'
import type { Recipe } from '@/types/recipe'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { recipes, fetchAll, addRecipe, updateRecipe, removeRecipe } = useRecipe()

const formDialog = ref(false)

const router = useRouter()
const openDetail = (recipe: Recipe) => {
  console.log('openDetail', recipe, recipe.id)
  router
    .push({ name: 'recipe-detail', params: { id: String(recipe.id) } })
    .catch((err) => console.error('router.push failed', err))
}

function createEmptyRecipe(): Recipe {
  return {
    id: 0,
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    category: '和食',
    image: '',
  }
}

const selectedRecipe = ref<Recipe>(createEmptyRecipe())

function openForm() {
  selectedRecipe.value = createEmptyRecipe()
  formDialog.value = true
}

function editRecipe(recipe: Recipe) {
  selectedRecipe.value = { ...recipe }
  formDialog.value = true
}

function handleSubmit(recipe: Recipe) {
  if (recipe.id === 0) {
    addRecipe(recipe)
  } else {
    updateRecipe(recipe)
  }
  formDialog.value = false
}

function deleteRecipe(id: number) {
  removeRecipe(id)
}

onMounted(fetchAll)
</script>

<style scoped></style>
