<template>
  <div class="searchbar">
    <h2 class="searchbar">レシピ検索</h2>
    <v-card flat class="pa-4 searchbar-card" justify="center">
      <v-form color="black" @submit.prevent="emitSearch">
        <div class="searchbar__inputs">
          <v-text-field
            v-model="title"
            label="レシピタイトル"
            clearable
            class="searchbar__input searchbar__title"
            variant="underlined"
          />
          <v-combobox
            v-model="ingredients"
            :items="ingredientSuggestions"
            label="食材（複数可）"
            multiple
            chips
            clearable
            class="searchbar__input"
            variant="underlined"
          />
          <v-select
            class="searchbar__input"
            label="カテゴリを選択してください"
            :items="categoryOptions"
            v-model="category"
            clearable
            item-color="success"
            variant="underlined"
          />
        </div>
        <v-row dense>
          <v-col class="button-group" cols="12">
            <v-btn type="submit" color="primary" variant="elevated" class="mr-2 button">検索</v-btn>
            <v-btn class="button" color="warning" @click="emitReset">リセット</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref, watch } from 'vue'
import '@mdi/font/css/materialdesignicons.css'

defineOptions({ name: 'SearchBar' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  ingredients: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  ingredientSuggestions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  category: {
    type: String,
    default: '',
  },
  categoryOptions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (e: 'search', payload: { title: string; ingredients: string[]; category: string | null }): void
  (e: 'reset'): void
}>()

const title = ref(props.title)
const ingredients = ref<string[]>([...props.ingredients])
const categoryOptions = ref<string[]>([...props.categoryOptions])
const category = ref(props.category ?? '')

watch(
  () => [props.title, props.ingredients, props.category, props.categoryOptions] as const,
  ([nextTitle, nextIngredients, nextCategory, nextCategoryOptions]) => {
    title.value = nextTitle
    ingredients.value = [...nextIngredients]
    category.value = nextCategory
    categoryOptions.value = nextCategoryOptions
  },
)

function emitSearch() {
  emit('search', {
    title: title.value.trim(),
    ingredients: ingredients.value.map((item) => item.trim()).filter(Boolean),
    category: category.value ? category.value.trim() : null,
  })
}

function emitReset() {
  title.value = ''
  ingredients.value = []
  category.value = ''
  emit('reset')
}
</script>

<style scoped>
.v-btn + .v-btn {
  margin-left: 8px;
}

.searchbar h2 {
  text-align: center;
}

.searchbar-card {
  padding-top: 1%;
}

.searchbar__inputs {
  display: flex;
  justify-content: center;
  gap: 2%;
  width: 70%;
  margin: 0 auto;
}

.searchbar__input {
  flex: 0 1 auto;
  width: 45%;
}

.button-group {
  display: flex;
  justify-content: center;
  margin: 2% 2%;
}
.button {
  flex: 0 1 auto;
  min-width: 0;
  width: 120px;
}
</style>
