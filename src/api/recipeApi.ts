import type { Recipe } from '../types/recipe.ts'
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

const API_URL = 'http://localhost:3000/recipes'

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const res = await api.get<Recipe[]>('/recipes')
  return res.data
}

export const getRecipeById = async (id: number | string): Promise<Recipe> => {
  const res = await axios.get<Recipe>(`${API_URL}/${id}`)
  return res.data
}

export const createRecipe = async (recipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
  const res = await api.post('/recipes', recipe)
  return res.data
}
// Omitとは？

export const updateRecipe = async (recipe: Recipe): Promise<Recipe> => {
  const res = await api.put(`/recipes/${recipe.id}`, recipe)
  return res.data
}

export const deleteRecipe = async (id: number): Promise<void> => {
  await api.delete(`/recipes/${id}`)
}
// <void>って何？
