
//showTypes.ts
//types returned from 'show' api route
import { TApiArrayMedia, TApiMedia, TApiMediaOrNull, TApiPageMedia } from "./collectionTypes"
import { TFields } from "./moduleFieldsTypes"

type TApiItemShow = {
        tag: string,
        fields: TFields,
        media: TApiMediaOrNull[],
        media1: TApiMedia,
        mediaPage: TApiPageMedia[],
        mediaArray: TApiArrayMedia[],        
        model_tags: any[],
        global_tags: any[],
        discrete_columns: string[]
        slug: string,
        extra: any
}
type TApiItemUpdate = {
        fields: TFields,
        slug: string,
}


export { TApiItemShow, TApiItemUpdate }