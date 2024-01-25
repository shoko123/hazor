
//showTypes.ts
//types returned from 'show' api route
import { TApiArrayMedia, TApiArrayRelated } from "./collectionTypes"
import { TFields } from "./moduleFieldsTypes"

type TApiItemShow = {
        fields: TFields,
        model_tags: string[],
        global_tags: string[],
        media: TApiArrayMedia[],
        related: TApiArrayRelated[],
        slug: string,
        short: string,
}
type TApiItemUpdate = {
        fields: TFields,
        slug: string,
}


export { TApiItemShow, TApiItemUpdate }