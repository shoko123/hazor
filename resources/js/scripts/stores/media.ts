// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'
import { TApiMediaOrNull } from '@/js/types/collectionTypes'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from '../../scripts/stores/notifications'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionMediaStore } from '../../scripts/stores/collections/collectionMedia'
import { useItemStore } from '../../scripts/stores/item'

export const useMediaStore = defineStore('media', () => {

  let bucketUrl = ref("")
  const showUploader = ref<boolean>(false)

  function getBucketUrl() {
    return bucketUrl.value
  }

  function setBucketUrl(burl: string) {
    bucketUrl.value = burl
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

  //Media Collections

  type TMediaCollectionName = 'photos' | 'drawings' | 'photosAndDrawings' | 'plans'
  type TMediaCollection = { name: TMediaCollectionName, label: string }
  type TMediaCollectionWithIndex = { index: number, name: TMediaCollectionName, label: string }


  const mediaCollections = ref<TMediaCollection[]>([
    { name: 'photos', label: 'Photo(s)' },
    { name: 'drawings', label: 'Drawings(s)' },
    { name: 'photosAndDrawings', label: 'Photo+Drawing(s)' },
    { name: 'plans', label: 'Plan(s)' },
  ])

  const mediaCollectionIndex = ref<number>(0)

  const getMediaCollectionsNames = computed((): TMediaCollectionWithIndex[] => {
    return mediaCollections.value.map((x, index) => { return { ...x, index } })
  })

  const getMediaCollection = computed(() => {
    return mediaCollections.value[mediaCollectionIndex.value].label
  })

  function setMediaCollection(index: number) {
    mediaCollectionIndex.value = index
    console.log(`set mediaCollection to ${index}`)
  }


  //////////////////
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
  console.log("Load files - started")
  await Promise.all(images.value.map(async (image) => { addImage(image) }))
    .catch(err => {
      console.log(`Error encountered when loading files - clearing files`)
      loadingToBrowser.value = false
      clear()
      return
    })
  loadingToBrowser.value = false
  console.log("Load files -finished")
}

async function addImage(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target) {
      console.log(`media.push image`)
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
    const r = useRoutesMainStore()
    let { showSnackbar, } = useNotificationsStore()
    const { send } = useXhrStore()
    let fd = new FormData();

    images.value.forEach((file) => {
      fd.append("media_files[]", file, file.name);
    });

    fd.append("model", r.current.module);
    fd.append("id", <string>r.current.url_id);
    fd.append("media_collection_name", 'photos');

    console.log(`upload() formData:\n ${JSON.stringify(fd, null, 2)}`)
    send("media/upload", 'post', fd)
      .then((res) => {
        showUploader.value = false
        showSnackbar("Media uploaded successfully")
        //clear()

        console.log(`res: ${JSON.stringify(res.data, null, 2)}`)

        let i = useItemStore()
        let c = useCollectionsStore()
        let cm = useCollectionMediaStore()

        i.media1 = buildMedia(res.data.media1)

        c.setArray('media', res.data.mediaArray)
        if (res.data.mediaArray.length > 0) {
          cm.savePage(res.data.mediaPage, true)
        } else {
          c.clear(['media'])
        }
      })
      .catch((err) => {
        console.log(`mediaUpload failed! err:\n ${JSON.stringify(err, null, 2)}`)
      })


  }
  return {
    setBucketUrl,
    getBucketUrl,
    buildMedia,
    showUploader,
    getMediaCollectionsNames,
    getMediaCollection,
    setMediaCollection,
    upload,
    images    ,
    imagesAsBrowserReadable,
    onInputChange,
    mediaReady
  }
})
