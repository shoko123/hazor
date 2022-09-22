// stores/media.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoutesStore } from './routes/routesMain'
import { normalize, schema } from 'normalizr';

type Trio = {
  categories: string[],
  groups: object,
  params: object,
  filters: object,
  item: object,
  newItem: object
}

export const useTrioStore = defineStore('trio', () => {

  const routes = useRoutesStore()

  let trio = ref<Trio>({
    categories: [],
    groups: {},
    params: {},
    filters: {},
    item: {},
    newItem: {}
  })

  let tmp = ref<object>({})

  const module = computed(() => {
    return routes.current.module
  })


  function setTrio(res: object) {
    //console.log(`aux/normalizeGroups() payload: ${JSON.stringify(payload, null, 2)}`);

    const ParamSchema = new schema.Entity('params', {}, {
      idAttribute: (value, parent, key) => `${parent.group_type_code}.${value.name}`,
      processStrategy: (value, parent, key) => {
        return {
          ...value,
          key: `Just joking`,
        };
      },
    });

    const TMschema = new schema.Entity('TM_groups', { params: [ParamSchema], }, {
      idAttribute: (value, parent, key) => `TM.${value.group_name}.${value.group_id}`,
      processStrategy: (value, parent, key) => {
        return {
          ...value,
        };
      },
    });

    const TGschema = new schema.Entity('TG_groups', { params: [ParamSchema], }, {
      idAttribute: (value, parent, key) => `TG.${value.group_name}.${value.group_id}`,
      processStrategy: (value, parent, key) => {
        return {
          ...value,
        };
      },
    });
    const LVschema = new schema.Entity('LV_groups', { params: [ParamSchema], }, {
      idAttribute: (value, parent, key) => `LV.${value.column_name}`,
      processStrategy: (value, parent, key) => {
        return {
          ...value,
        };
      },
    });

    const CVschema = new schema.Entity('CV_groups', { params: [ParamSchema], }, {
      idAttribute: (value, parent, key) => `CV.${value.column_name}`,
      processStrategy: (value, parent, key) => {
        return {
          ...value,
        };
      },
    });

    const GroupSchema = new schema.Array(
      {
        TM: TMschema,
        TG: TGschema,
        LV: LVschema,
        CV: CVschema
      },
      (input, parent, key) => input.group_type_code
    );

    const categorySchema = new schema.Entity('categories', {
      groups: GroupSchema,
    }, {
      idAttribute: (value, parent, key) => `${value.name}`,
      processStrategy: (value, parent, key) => {
        return {
          groups: value.groups,
        };
      },
    });
    const categoriesSchema = [categorySchema];


    tmp.value = normalize(res, categoriesSchema);
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

  return { tmp, setTrio }
})