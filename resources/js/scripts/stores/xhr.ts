import axios from 'axios'
import { defineStore } from 'pinia'
import type { TXhrResult, TXhrMethod } from '@/js/types/generalTypes'

export const useXhrStore = defineStore('xhr', () => {
  async function setAxios() {
    axios.defaults.baseURL = `${window.location.protocol}//${window.location.host}`
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.withCredentials = true
    //axios.defaults.headers.common['Content-Type'] = 'application/json'
    //axios.defaults.headers.common['Accept'] = 'application/json'
    //console.log(`setAxios defaults: ${JSON.stringify(axios.defaults, null, 2)}`)

    try {
      await axios.get(`/sanctum/csrf-cookie`)
    } catch (err: unknown) {
      console.log(`failed to set csrf cookie. err: ${JSON.stringify(err, null, 2)}`)
      throw new Error('Failed to set csrf-token')
    }
  }

  async function send2<T = null>(endpoint: string, method: TXhrMethod, data?: object): Promise<TXhrResult<T>> {
    const fullUrl = endpoint.substring(0, 8) === 'fortify/' ? `${axios.defaults.baseURL}/${endpoint}` : `${axios.defaults.baseURL}/api/${endpoint}`
    console.log(`xhr.send2() endpoint: ${fullUrl}`)
    try {
      const res = await axios<T>({
        url: fullUrl,
        method,
        data: (data === undefined) ? null : data
      })
      return { success: true, data: res.data, message: res.statusText, status: res.status }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log(`**** axios.err **** resData:${JSON.stringify({ message: err.response?.data?.message, status: err.response ? err.response.status : 777 }, null, 2)}`);
        return { success: false, message: err.response?.data?.message, status: err.response ? err.response.status : 777 }
      } else {
        console.log(`**** axios.err **** no-response or setup error`);
        return { success: false, status: 999, message: 'unexpected error' }
      }
    }
  }

  async function send(endpoint: string, method: TXhrMethod, data?: object) {
    const fullUrl = endpoint.substring(0, 8) === 'fortify/' ? `${axios.defaults.baseURL}/${endpoint}` : `${axios.defaults.baseURL}/api/${endpoint}`
    console.log(`xhr.send() endpoint: ${fullUrl}`)
    return axios({
      url: fullUrl,
      method,
      data: (data === undefined) ? null : data
    })
      .then(res => {
        //console.log(`xhr success. res: ${JSON.stringify(res, null, 2)}`); 
        return res;
      })
      .catch(err => {
        //consoleLogErrors(err)
        console.log(`**** axios.err ****\n${JSON.stringify(err, null, 2)}`);
        throw err
      })
  }
  return { setAxios, send, send2 }
})
