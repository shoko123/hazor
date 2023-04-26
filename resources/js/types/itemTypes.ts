
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


export { TApiItem }