import { vi } from 'vitest'

// Vuetify関連のCSSで落ちるのを防ぐ
vi.mock('@/components/RecipeCard.vue?vue&type=style&index=0&scoped=e9bb8040&lang.css', () => ({}))

// グローバルに CSSStyleSheet をモック（JSDOM対策）
vi.stubGlobal('CSSStyleSheet', class {})
