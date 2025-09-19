export interface Recipe {
  id: number | string
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  category: '和食' | '洋食' | '中華' | 'その他'
  image: string
}
