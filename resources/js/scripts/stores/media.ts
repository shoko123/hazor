// stores/media.js
import { TFields } from '@/js/types/moduleFieldsTypes'
import { TMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'
import { TApiArray, TApiArrayMedia, TApiMediaOrNull, TApiPageMedia } from '@/js/types/collectionTypes'

import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from '../../scripts/stores/notifications'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionMediaStore } from '../../scripts/stores/collections/collectionMedia'
import { useItemStore } from '../../scripts/stores/item'


export const useMediaStore = defineStore('media', () => {
  let { showSnackbar, } = useNotificationsStore()
  const { send } = useXhrStore()

  //both bucketUrl and mediaCollectionNames are initiated at app.init()
  const bucketUrl = ref("")
  const mediaCollectionNames = ref<string[]>([])

  const showUploader = ref<boolean>(false)

  function initMedia(burl: string, media_collections: string[]) {
    bucketUrl.value = burl
    mediaCollectionNames.value = media_collections
  }

  function buildMedia(apiMedia: TApiMediaOrNull, module?: TModule): TMedia {
    if (apiMedia === null || apiMedia === undefined) {
      return {
        hasMedia: false,
        urls: {
          full: `${bucketUrl.value}app/filler/${module}Filler.jpg`,
          tn: `${bucketUrl.value}app/filler/${module}Filler-tn.jpg`
        },
      }
    } else {
      return {
        hasMedia: true,
        urls: {
          full: `${bucketUrl.value}${apiMedia.full}`,
          tn: `${bucketUrl.value}${apiMedia.tn}`
        },
      }
    }
  }

  //Media collection index
  const mediaCollectionIndex = ref(0)

  //upload
  const images = ref<File[]>([])
  const imagesAsBrowserReadable = ref<string[]>([])
  const loadingToBrowser = ref<boolean>(false)
  const mediaReady = computed(() => {
    return images.value.length !== 0 && !loadingToBrowser.value
  })

  async function onInputChange(media: File[]) {
    if (images.value.length > 6) {
      alert("Max number of files is 6 - Upload aborted!");
      clear()
      return
    }
    images.value.forEach((file) => {
      if (file.size > 1024 * 1024 * 2) {
        alert(`File ${file.name} exceeds max allowed 2MB - Upload aborted!`);
        clear()
        return
      }
    });

    loadingToBrowser.value = true
    //console.log("Load files - started")
    await Promise.all(images.value.map(async (image) => { addImage(image) }))
      .catch(err => {
        console.log(`Error encountered when loading files - clearing files`)
        loadingToBrowser.value = false
        clear()
        return
      })
    loadingToBrowser.value = false
    //console.log("Load files -finished")
  }

  async function addImage(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        //console.log(`media.push image`)
        imagesAsBrowserReadable.value.push(<string>e.target.result)
      }
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    images.value = []
    imagesAsBrowserReadable.value = []
  }

  async function upload() {
    const i = useItemStore()
    const r = useRoutesMainStore()
    let fd = new FormData();

    images.value.forEach((file) => {
      fd.append("media_files[]", file, file.name);
    });

    const idAsString = (<TFields>i.fields).id as unknown as string
    fd.append("model", r.current.module);
    fd.append("id", idAsString);
    fd.append("media_collection_name", mediaCollectionNames.value[mediaCollectionIndex.value])

    return send("media/upload", 'post', fd)
      .then((res) => {
        showUploader.value = false
        setItemMedia(res.data.mediaArray, res.data.mediaPage, res.data.media1)
        clear()
        showSnackbar("Media uploaded successfully")
      })
      .catch((err) => {
        showSnackbar("Media upload failed. Please try later!", 'red')
        console.log(`mediaUpload failed! err:\n ${JSON.stringify(err, null, 2)}`)
      })
  }


  async function destroy(media_id: number) {
    const r = useRoutesMainStore()
    const i = useItemStore()

    console.log(`destroy() media_id: ${media_id}, model_type: ${r.current.module}, model_id: ${(<TFields>i.fields).id}`)
    return send("media/destroy", 'post', { media_id, model_type: r.current.module, model_id: (<TFields>i.fields).id })
      .then((res) => {
        showUploader.value = false
        showSnackbar("Media deleted successfully")
        setItemMedia(res.data.mediaArray, res.data.mediaPage, res.data.media1)
      })
      .catch((err) => {
        console.log(`media.dstroy failed! err:\n ${JSON.stringify(err, null, 2)}`)
      })
  }

  function setItemMedia(array: TApiArrayMedia[], page: TApiPageMedia[], media1: TApiMediaOrNull) {
    let i = useItemStore()
    let c = useCollectionsStore()
    let cm = useCollectionMediaStore()
    i.media1 = buildMedia(media1)

    c.setArray('media', array)
    if (array.length > 0) {
      cm.savePage(page, true)
    } else {
      c.clear(['media'])
    }
  }

  return {
    initMedia,
    bucketUrl,
    buildMedia,
    showUploader,
    mediaCollectionNames,
    mediaCollectionIndex,
    setItemMedia,
    upload,
    images,
    imagesAsBrowserReadable,
    onInputChange,
    mediaReady,
    clear,
    destroy
  }
})
