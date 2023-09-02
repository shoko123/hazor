
//showTypes.ts
//types returned from 'show' api route
import { TMediaRecord } from "./mediaTypes"
import { TFields } from "./moduleFieldsTypes"

type TApiItemShow = {
        tag: string,
        fields: TFields,
        media: TMediaRecord[],
        model_tags: any[],
        global_tags: any[],
        discrete_columns: string[]
        slug: string,
        short: string,
        extra: any
}
type TApiItemUpdate = {
        fields: TFields,
        slug: string,
}


export { TApiItemShow, TApiItemUpdate }