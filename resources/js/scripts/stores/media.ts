// stores/media.js
import { TGenericFields } from '@/js/types/moduleTypes'
import { TMediaOfItem } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'
import { TMediaUrls, TApiArrayMedia } from '@/js/types/collectionTypes'

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from '../../scripts/stores/notifications'

import { useCollectionMediaStore } from '../../scripts/stores/collections/collectionMedia'
import { useItemStore } from '../../scripts/stores/item'


export const useMediaStore = defineStore('media', () => {
  const { showSnackbar, } = useNotificationsStore()
  const { send } = useXhrStore()

  //both bucketUrl and mediaCollectionNames are initiated at app.init()
  const bucketUrl = ref("")
  const mediaCollectionNames = ref<string[]>([])

 //Media collection index
  const mediaCollectionName = ref("Photo")
  const showUploader = ref<boolean>(false)

  function initMedia(burl: string, media_collections: string[]) {
    bucketUrl.value = burl
    mediaCollectionNames.value = media_collections
  }

  function buildMedia(apiMedia: TMediaUrls | null, module?: TModule): TMediaOfItem {
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
 
  function setItemMedia(media: TApiArrayMedia[]) {
    const cm = useCollectionMediaStore()
    cm.setArray(media)
  }


  //upload
  const images = ref<File[]>([])
  const imagesAsBrowserReadable = ref<string[]>([])
  const loadingToBrowser = ref<boolean>(false)
  const mediaReady = computed(() => {
    return images.value.length !== 0 && !loadingToBrowser.value
  })

  async function onInputChange(media: File[]) {
    media//make eslint happy
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
      .catch(() => {
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
    showUploader.value = false
    orderChanged.value = false
  }

  async function upload() {
    const i = useItemStore()
    const r = useRoutesMainStore()
    const fd = new FormData();

    images.value.forEach((file) => {
      fd.append("media_files[]", file, file.name);
    });

    const idAsString = (<TGenericFields>i.fields).id as unknown as string
    fd.append("model", r.current.module);
    fd.append("model_id", idAsString);
    fd.append("media_collection_name", mediaCollectionName.value)

    return send("media/upload", 'post', fd)
      .then((res) => {
        showUploader.value = false
        setItemMedia(res.data)
        clear()
        showSnackbar("Media uploaded successfully")
      })
      .catch((err) => {
        showSnackbar("Media upload failed. Please try later!", 'red')
        console.log(`mediaUpload failed! err:\n ${JSON.stringify(err, null, 2)}`)
      })
  }

//destroy
  async function destroy(media_id: number) {
    const r = useRoutesMainStore()
    const i = useItemStore()
    console.log(`destroy() media_id: ${media_id}, model: ${r.current.module}, model_id: ${(<TGenericFields>i.fields).id}`)
    return send("media/destroy", 'post', { media_id, model: r.current.module, model_id: (<TGenericFields>i.fields).id })
      .then((res) => {
        showUploader.value = false
        showSnackbar("Media deleted successfully")
        setItemMedia(res.data)
      })
      .catch((err) => {
        console.log(`media.dstroy failed! err:\n ${JSON.stringify(err, null, 2)}`)
      })
  }

  //reorder media

  const orderChanged = ref(false)

  async function reorder() {
    const r = useRoutesMainStore()
    const i = useItemStore()
    const cm = useCollectionMediaStore()
    const ordered = cm.array.map((x, index) => {return {id: x.id, order: index + 1}})
    console.log(`reorder()  model: ${r.current.module}, id: ${i.fields?.id} ,ordered: ${JSON.stringify(ordered, null, 2)}`)
    return send("media/reorder", 'post', { model: r.current.module, model_id: i.fields?.id, ordered })
    .then(() => {
      showUploader.value = false
      showSnackbar("Reorder completed successfully")
    })
    .catch((err) => {
      console.log(`media.reorder failed! err:\n ${JSON.stringify(err, null, 2)}`)
    })
  }

  return {
    initMedia,
    bucketUrl,
    buildMedia,
    setItemMedia,
    showUploader,
    mediaCollectionNames,
    mediaCollectionName,
    upload,
    images,
    imagesAsBrowserReadable,
    onInputChange,
    mediaReady,
    clear,
    destroy,
    orderChanged,
    reorder
  }
})
