
//showTypes.ts
//types returned from 'show' api route
import { TMedia } from "./mediaTypes"
import { TApiMedia } from "./collectionTypes"
import { TFields } from "./moduleFieldsTypes"


type TItemDerived = {
        tag: string,
        url_id: string
        
}

type TApiItem = {
        fields: TFields,
        media: TMedia[],
        media1: TMedia,
        model_tags: any[],
        global_tags: any[],
        derived: TItemDerived,
        extra: any
}

type TItem = {
        fields: TFields,
        media: TMedia,
        model_tags: any[],
        global_tags: any[],
        derived: TItemDerived,
        extra: any
}

type TApiShowItem = {
        msg: string,
        fields: TFields,
        media: TApiMedia[],
        media1: TApiMedia,
        global_tags: any,
        model_tags: any,
        url_id: string,
}

type TApiShowCarousel = {
        id: number,
        url_id: string,
        description: string,
        media: TApiMedia,
}
export { TItem, TApiItem, TApiShowItem, TApiShowCarousel }