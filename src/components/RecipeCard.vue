<template>
  <v-card
    class="mx-auto my-4 recipe-card"
    max-width="400"
    height="400"
    @click="emit('click', recipe)"
  >
    <v-img :src="recipe.image" :alt="`${recipe.title}の画像`" height="200" cover />
    <v-card-title>{{ recipe.title }}</v-card-title>
    <v-card-subtitle>
      <v-chip color="primary" text-color="white">{{ recipe.category }}</v-chip>
    </v-card-subtitle>
    <v-card-text>
      {{ recipe.description }}
    </v-card-text>
    <v-card-actions>
      <v-btn @click.stop="emit('edit', recipe)" color="primary" variant="text">編集</v-btn>
      <v-btn @click.stop="emit('delete', Number(recipe.id))" color="error" variant="text"
        >削除</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Recipe } from '@/types/recipe'

defineOptions({ name: 'RecipeCard' })

// 4 defineProps に型をつけて受け取る
// 分割代入によりtemplateで’recipe’を直接参照可能(<script setup> 特有の最適化でreactivity　保持)
const { recipe } = defineProps<{ recipe: Recipe }>()

// 5 defineEmitsでイベント名とペイロードの型を厳密化（関数オーバーロード構文）
const emit = defineEmits<{
  (e: 'click', payload: Recipe): void
  (e: 'edit', payload: Recipe): void
  (e: 'delete', id: number): void
}>()
</script>

<style scoped>
.recipe-card {
  --v-theme-overlay-multiplier: 2;
}

.recipe-card:hover {
  box-shadow: var(--v-theme-elevation-10);
}
</style>
