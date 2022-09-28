// stores/media.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoutesStore } from './routes/routesMain'
import { normalize, schema } from 'normalizr';

interface IObject {
  [key: string]: any
}

type TCategory = {
  name: string,
  groups: string[]
}

type TGroupValue = {
  group_type_code: string,
  group_name: string,
  table_name: string,
  column_name: string,
  params: string[]
}

type TGroupTag = {
  group_type_code: string,
  group_name: string,
  group_id: string,
  multiple: string,
  dependency: string[],
  params: string[]
}

interface IGroupObject {
  [key: string]: TGroupValue | TGroupTag
}
interface ICategoryObject {
  [key: string]: TCategory
}

type TEntities = {
  categories: ICategoryObject,
  groups: IGroupObject,
  params: IObject
}

type Trio = {
  entities: TEntities,
  result: string[],
}



type TSelectedParam = {
  key: string,
  groupKey: string,
  groupTypeCode: string
}


export const useTrioStore = defineStore('trio', () => {

  const routes = useRoutesStore()

  let trio = ref<Trio>({
    entities: {
      categories: {},
      groups: {},
      params: {}
    }, result: []
  })

  let filterGroups = ref<string[]>([])
  let itemGroups = ref<string[]>([])
  let newItemGroups = ref<string[]>([])

  let filters = ref<TSelectedParam[]>([])
  let item = ref<TSelectedParam[]>([])
  let newItem = ref<TSelectedParam[]>([])


  let selectedGroupIndex = ref<number>(0)
  let selectedCategoryIndex = ref<number>(0)
  let selectedCurrentParamIndices = ref<number[]>([])
  let selectedAllParamsByCategoryGroup = ref<number[]>([])
  const module = computed(() => {
    return routes.current.module
  })

  const currentCategories = computed(() => {
    return trio.value.result.map(x => { return { name: trio.value.entities.categories[x].name, selectedGroupsCount: 0 } })
  })


  const currentGroups = computed(() => {
    if(trio.value.result.length === 0) {return []}
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups
    return groupKeys.map(x => { return { name: trio.value.entities.groups[x].group_name, groupKey: x, params: trio.value.entities.groups[x].params, selectedParamsCount: 0 } })

  })

  const currentParams = computed(() => {
    if(trio.value.result.length === 0) {return []}
    let paramKeys = currentGroups.value[selectedGroupIndex.value].params
    return paramKeys.map(x => trio.value.entities.params[x])
  })




  function setTrio(res: object) {
    //console.log(`aux/normalizeGroups() payload: ${JSON.stringify(res, null, 2)}`);

    const ParamSchema = new schema.Entity('params', {}, {
      idAttribute: (value, parent, key) => {
        switch (parent.group_type_code) {
          case 'TM':
          case 'TG':
            return `${parent.group_type_code}.${value.id}`
          case 'LV':
          case 'CV':
            return `${parent.group_type_code}.${parent.column_name}.${value.id}`
          default:
            return 'XXX'
        }
      },

      processStrategy: (value, parent, key) => {
        return {
          ...value,
          key: `Just joking`,
        };
      },
    });

    const GroupSchema = new schema.Entity('groups', { params: [ParamSchema], }, {
      idAttribute: (value, parent, key) => {
        switch (value.group_type_code) {
          case 'TM':
          case 'TG':
            return `${value.group_type_code}.${value.group_id}`
          case 'LV':
          case 'CV':
            return `${value.group_type_code}.${value.column_name}`
          default:
            return 'XXX'
        }
      },
      processStrategy: (value, parent, key) => {
        return {
          ...value,
        };
      },
    });

    const categorySchema = new schema.Entity('categories', {
      groups: [GroupSchema]
    }, {
      idAttribute: (value, parent, key) => `${value.name}`,
      processStrategy: (value, parent, key) => {
        return {
          groups: value.groups,
          name: value.name
        };
      },
    });
    const categoriesSchema = [categorySchema];

    resetTrio()
    trio.value = normalize(res, categoriesSchema);
    initFilters()

    //console.log(`normalizedData: ${JSON.stringify(normalizedData, null, 2)}`);
    // commit("clearGroupsAndParams", null);
    // commit("groupKeys", normalizedData.result);
    // //console.log(`normalizedData: ${JSON.stringify(normalizedData, null, 2)}`);

    // commit("groupsAddProperties", normalizedData.entities.registrationGroups);
    // commit("groupsAddProperties", normalizedData.entities.lookupGroups);
    // commit("groupsAddProperties", normalizedData.entities.tagGroups);

    // commit("paramsAddProperties", normalizedData.entities.registrationParams);
    // commit("paramsAddProperties", normalizedData.entities.lookupParams);
    // commit("paramsAddProperties", normalizedData.entities.tagParams);

    // //console.log(`aux/normalizeGroups() before addAffect() groups:\n${JSON.stringify(getters["all"], null, 2)}`);
    // //make params aware of their dependant groups
    // getters["all"].forEach(x => {
    //   if (x.group_type === "Tag" && x.dependency !== null) {
    //     //console.log(`PUSH dependencies key: ${x.key} dependency: ${JSON.stringify(x.dependency, null, 2)}`);
    //     x.dependency.forEach(y => {
    //       y.forEach(z => {
    //         commit("paramAffectsAddTagGroups", { paramKey: z, affects: [x.key] });
    //       })
    //     })
    //   }
    // })
    //console.log(`aux/normalizeGroups() success`);
  }

  function initFilters() {
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      console.log(`${key}: ${value}`);
      filterGroups.value.push(key)
    }
  }

  function resetTrio() {
    selectedGroupIndex.value = 0
    selectedCategoryIndex.value = 0
    trio.value.result.length = 0
    trio.value = {
      entities: {
        categories: {},
        groups: {},
        params: {}
      }, result: []
    }
  }

  return { trio, setTrio, filters, item, newItem, currentCategories, currentGroups, currentParams, selectedCategoryIndex, selectedGroupIndex }
})