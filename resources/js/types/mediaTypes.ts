// mediaTypes.ts
import { TCollectionName } from '@/js/types/collectionTypes'
type TMedia = {
        hasMedia: boolean,
        urls: { full: string, tn: string }
}

type TMediaDetailsCMain = {
        id: number,
        url_id: string,
        tag: string,
        description: string
}

type TMediaDetailsCMedia = {
        id: number,
        collection_name: string,
        order_column: number,
        description: string | null
}

type TMediaProps = {
        source: TCollectionName,
        itemIndex: number,
        media: TMedia        
        details: TMediaDetailsCMain | TMediaDetailsCMedia
        size?: number
}



export { TMedia, TMediaDetailsCMain, TMediaDetailsCMedia, TMediaProps }