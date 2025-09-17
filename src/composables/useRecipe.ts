import type { Recipe } from '@/types/recipe';
import { ref } from 'vue';
import * as api from '@/api/recipeApi';


const recipes = ref<Recipe[]>([])

export function useRecipe() {
  const fetchAll = async () => {
    recipes.value = await api.fetchRecipes()
  }

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe = await api.createRecipe(recipe)
    recipes.value.push(newRecipe)
  }

  const updateRecipe = async (recipe: Recipe) => {
    const updated = await api.updateRecipe(recipe)
    const index = recipes.value.findIndex(r => r.id === recipe.id)
    if (index !== -1) recipes.value[index] = updated
  }

  const removeRecipe = async (id: number) => {
    await api.deleteRecipe(id)
    recipes.value = recipes.value.filter(r => r.id !== id)
  }

  return {
    recipes,
    fetchAll,
    addRecipe,
    updateRecipe,
    removeRecipe,
  }
}
