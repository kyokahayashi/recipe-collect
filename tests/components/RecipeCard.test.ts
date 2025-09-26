// import {render } from '@testing-library/vue'
import RecipeCard from '../../src/components/RecipeCard.vue' 
import { describe, it, expect } from 'vitest'
import {renderWithVuetify} from '../test-utils'

// モック用レシピデータ
const mockRecipe = {
  id: '1',
  title: 'バターチキンカレー',
  description: '濃厚でスパイシーなインド風カレー',
  ingredients: ['鶏肉', 'トマト', 'バター', 'ヨーグルト', '香辛料'],
  steps: ['鶏肉を焼く', 'ソースを作る', '煮込む'],
  category: 'エスニック',
  image: '/images/カレーライス.png',
}

describe('RecipeCard.vue', () => {
  it('タイトルが表示されること', () => {
    const {getByText} = renderWithVuetify(RecipeCard, {
      props: {recipe:mockRecipe},
    })
    // タイトルが表示されることを確認
    expect(getByText('バターチキンカレー')).toBeTruthy()
  })

  it('カテゴリが表示されること', () => {
    const {getByText} = renderWithVuetify(RecipeCard, {
      props: {recipe: mockRecipe},
    })

    // カテゴリが表示されることを確認
    expect(getByText('エスニック')).toBeTruthy()
  })
  
  it('画像が正しく表示されていること', () => {
    const { getByAltText } = renderWithVuetify(RecipeCard, {
      props: {recipe: mockRecipe},
    })

    const img = getByAltText('バターチキンカレーの画像') as HTMLImageElement
    expect(img).toBeTruthy()
  })
})
