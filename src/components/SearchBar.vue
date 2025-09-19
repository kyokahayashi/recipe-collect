<template>
  <v-card flat class="pa-4">
    <v-form @submit.prevent="emitSearch">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="title"
            label="レシピタイトル"
            prepend-inner-icon="mdi-text-box-search"
            clearable
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-combobox
            v-model="ingredients"
            :items="ingredientSuggestions"
            label="食材（複数可）"
            prepend-inner-icon="mdi-food-apple"
            multiple
            chips
            clearable
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="auto">
          <v-btn type="submit" color="primary" class="mr-2">検索</v-btn>
          <v-btn variant="text" @click="emitReset">リセット</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { type PropType, ref, watch } from 'vue'

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
})

const emit = defineEmits<{
  (e: 'search', payload: { title: string; ingredients: string[] }): void
  (e: 'reset'): void
}>()

const title = ref(props.title)
const ingredients = ref<string[]>([...props.ingredients])

watch(
  () => [props.title, props.ingredients] as const,
  ([nextTitle, nextIngredients]) => {
    title.value = nextTitle
    ingredients.value = [...nextIngredients]
  },
)

function emitSearch() {
  emit('search', {
    title: title.value.trim(),
    ingredients: ingredients.value.map((item) => item.trim()).filter(Boolean),
  })
}

function emitReset() {
  title.value = ''
  ingredients.value = []
  emit('reset')
}
</script>

<style scoped>
.v-btn + .v-btn {
  margin-left: 8px;
}
</style>
