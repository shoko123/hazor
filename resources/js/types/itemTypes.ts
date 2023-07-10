
//showTypes.ts
//types returned from 'show' api route
import { TMedia } from "./mediaTypes"
import { TApiArrayMedia, TApiMedia, TApiMediaOrNull, TApiPageMedia } from "./collectionTypes"
import { TFields } from "./moduleFieldsTypes"


type TItemDerived = {
        tag: string,
        url_id: string

}

type TApiItemShow = {
        slug: string,
        tag: string,
        fields: TFields,
        media: TApiMediaOrNull[],
        media1: TApiMedia,
        mediaPage: TApiPageMedia[],
        mediaArray: TApiArrayMedia[],        
        model_tags: any[],
        global_tags: any[],
        discrete_columns: string[]
        url_id: string,
        extra: any
}
type TApiItemUpdate = {
        fields: TFields,
        url_id: string,
}


export { TApiItemShow, TApiItemUpdate }