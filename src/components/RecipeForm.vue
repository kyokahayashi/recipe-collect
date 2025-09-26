<template>
  <v-form @submit.prevent="onSubmit" ref="formRef">
    <v-text-field v-model="form.title" label="タイトル" :rules="titleRules" required />
    <v-textarea v-model="form.description" label="説明" :rows="3" auto-grow />
    <v-textarea
      v-model="ingredientsText"
      label="材料(改行区切り)"
      hint="1行につき、1材料。空行は無視されます"
      persistent-hint
      :rows="4"
      auto-grow
    />
    <v-textarea
      v-model="stepsText"
      label="作り方(改行区切り)"
      hint="1行につき1手順。空行は無視されます"
      persistent-hint
      :rows="5"
      auto-grow
    />
    <v-select
      v-model="form.category"
      :items="categories"
      label="カテゴリ"
      :rules="[(v: any) => !!v || 'カテゴリは必須です']"
      required
    />
    <v-text-field v-model="form.image" label="画像URL" :rules="imageRules" />
    <div class="mt-4">
      <v-btn type="submit" color="primary">保存</v-btn>
      <v-btn class="ml-2" color="warning" @click="reset">リセット</v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { Recipe } from '@/types/recipe'
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

defineOptions({ name: 'RecipeForm' })

const props = defineProps<{
  modelValue: Recipe
}>()

// v-model 更新用＆送信完了通知用
const emit = defineEmits<{
  (e: 'update:modelValue', value: Recipe): void
  (e: 'submit', recipe: Recipe): void
}>()

const formRef = ref<VForm | null>(null) //マウント前はnullだから

// カテゴリ候補を　Recipe['category']の配列として型安全に定義
const categories: Recipe['category'][] = ['和食', '洋食', '中華', 'その他']

// modelValueを編集用にクローンしてフォームのソースに（浅いコピー→配列が共有されないよう注意）
const form = ref<Recipe>(deepClone(props.modelValue))

// テキスト⇆配列　変換用の中間state(textareaにバインド)
const ingredientsText = ref((form.value.ingredients ?? []).join('\n'))
const stepsText = ref((form.value.steps ?? []).join('\n'))

// 入力バリデーション（最低限）
const titleRules = [(v: string) => !!v || 'タイトルは必須です']
const imageRules = [
  (v: string) => !v || /^http?:\/\//i.test(v) || 'http(s)://から始まるURLを入力してください',
]

// 親からmodelValueが差し替えられたときにフォームを同期
watch(
  () => props.modelValue,
  (val) => {
    form.value = deepClone(val)
    ingredientsText.value = (val.ingredients ?? []).join('\n')
    stepsText.value = (val.steps ?? []).join('\n')
  },
)

// テキストを配列へ正規化（空行除去、前後空白トリム）
// ingredientsTextとstepsTextが変わればコールバックが発火、第二引数の関数を実行
watch([ingredientsText, stepsText], ([ing, stp]) => {
  form.value.ingredients = ing
    .split('\n') //改行で分割['トマト', 'にんじん', '']
    .map((s) => s.trim()) //改行の前後の空白を取り除く
    .filter(Boolean) //空文字を除去(false扱いされるので)['トマト', 'にんじん']
  form.value.steps = stp
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
})

// フォームの変更を親へも反映(v-model 対応)。 deep:trueでネスト変更も拾う
watch(
  () => form.value,
  (val) => emit('update:modelValue', deepClone(val)),
  { deep: true },
)

// 送信：ますvalidate →OKならsubmit. 安全のためクローンを渡す
async function onSubmit() {
  const result = await formRef.value?.validate()
  if (!result || result.valid) {
    emit('submit', deepClone(form.value))
  }
}

// リセット：親から受け取ったmodelValueに戻す
function reset() {
  form.value = deepClone(props.modelValue)
  ingredientsText.value = (props.modelValue.ingredients ?? []).join('\n')
  stepsText.value = (props.modelValue.steps ?? []).join('\n')
}

// 今回のRecipeはプリミティブ＋配列だけなのでJSONベースの範囲ディープクローンで十分
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}
</script>

<style scoped></style>
<!--  -->
