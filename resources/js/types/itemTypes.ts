
//showTypes.ts
//types returned from 'show' api route
import { TApiArrayMedia, TMediaUrls, TApiPageMedia } from "./collectionTypes"
import { TMediaRecord } from "./mediaTypes"
import { TFields } from "./moduleFieldsTypes"

type TApiItemShow = {
        tag: string,
        fields: TFields,
        media: TMediaRecord[],
        media1: TMediaUrls,
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