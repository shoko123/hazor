//showTypes.ts
//types returned from 'show' api route
import { TApiArrayMedia, TApiArrayRelated } from '@/js/types/collectionTypes'
import { TFieldsUnion } from '@/js/types/moduleTypes'

type TApiItemShow<F> = {
  fields: F
  model_tags: string[]
  global_tags: string[]
  model_tags2: { group_label: string; tag_text: string }[]
  global_tags2: { group_label: string; tag_text: string }[]
  media: TApiArrayMedia[]
  related: TApiArrayRelated[]
  slug: string
  short: string
}

type TApiItemUpdate = {
  fields: TFieldsUnion
  slug: string
}

export { TApiItemShow, TApiItemUpdate }
