<template>
  <SearchBar
    :title="searchTitle"
    :ingredients="searchIngredients"
    :category="searchCategory"
    :category-options="categoryOptions"
    @search="handleSearch"
    @reset="handleReset"
  />
  <v-container>
    <v-btn @click="openForm" color="primary" class="my-4">レシピを追加</v-btn>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="recipe in filteredRecipes" :key="recipe.id">
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
import SearchBar from '@/components/SearchBar.vue'
import { useRecipe } from '@/composables/useRecipe'
import type { Recipe } from '@/types/recipe'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { recipes, fetchAll, addRecipe, updateRecipe, removeRecipe } = useRecipe()

const formDialog = ref(false)
const searchTitle = ref('')
const searchIngredients = ref<string[]>([])
const searchCategory = ref('')
const categoryOptions = computed(() => Array.from(new Set(recipes.value.map((r) => r.category))))

const filteredRecipes = computed(() => {
  const normalizedTitle = searchTitle.value.trim().toLowerCase()
  const normalizedIngredients = searchIngredients.value
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  // ？normalizedTitleやnormalizedIngredientsでは日本語なのにtoLowerCase()しても変わらないのでは？←今後英字を使うことを考慮して残す
  const normalizedCategory = searchCategory.value.trim()
  return recipes.value.filter((recipe) => {
    const matchesTitle =
      normalizedTitle.length === 0 || recipe.title.toLowerCase().includes(normalizedTitle)
    // タイトル検索の文字数がfalsyの場合０を返し、truthyの場合タイトル検索に入力されたタイトルを返す。（右辺がようわからん）
    const matchesIngredients =
      normalizedIngredients.length === 0 ||
      normalizedIngredients.every((needle) =>
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(needle)),
      )
    // 材料検索の入力文字数が0だったりfalsyの場合０を返す。truthyだった場合,材料検索に入力された材料がすべて含まれているかをチェックし、含まれていればtrueを返す。
    const matchesCategory =
      normalizedCategory.length === 0 || recipe.category === normalizedCategory
    return matchesTitle && matchesIngredients && matchesCategory
  })
})

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
  const { id, ...payload } = recipe
  if (id === 0) {
    addRecipe(payload)
  } else {
    updateRecipe(recipe)
  }
  formDialog.value = false
}

function handleSearch(payload: { title: string; ingredients: string[]; category: string | null }) {
  searchTitle.value = payload.title
  searchIngredients.value = payload.ingredients
  searchCategory.value = payload.category ?? ''
}

function handleReset() {
  searchTitle.value = ''
  searchIngredients.value = []
}

function deleteRecipe(id: number) {
  removeRecipe(id)
}

onMounted(fetchAll)
</script>

<style scoped></style>
