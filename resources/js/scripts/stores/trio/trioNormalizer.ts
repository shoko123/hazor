// stores/media.js
import { normalize, schema } from 'normalizr';
import { Trio } from '../../../types/trioTypes'

export default function normalizeTrio(res: object): Trio {
  //console.log(`aux/normalizeGroups() payload: ${JSON.stringify(res, null, 2)}`);

  let trio = {
    entities: {
      categories: {},
      groups: {},
      params: {}
    }, result: []
  } as Trio

  const ParamSchema = new schema.Entity('params', {}, {
    idAttribute: (value, parent, key) => {
      return `${parent.group_name}.${value.name}`
    },
    processStrategy: (value, parent, key) => {
      let param = {
        ...value,
        paramKey: `${parent.group_name}.${value.name}`,
        order: 0
      }
      if(parent.group_type_code === 'CS'){
        param.name = ""
      }
      return param
    },
  });

  const GroupSchema = new schema.Entity('groups', { params: [ParamSchema], }, {
    idAttribute: (value, parent, key) => {
      return value.group_name
    },
    processStrategy: (value, parent, key) => {
      return {
        ...value, categoryKey: parent.name
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

  trio = normalize(res, categoriesSchema);

  //add param order field 
  let order = 0
  trio.result.forEach((r) => {
    trio.entities.categories[r].groups.forEach(g => {
      trio.entities.groups[g].params.forEach(p => {
        trio.entities.params[p].order = order
        order++
      })
      order++
    })
    order++
  })
  return trio
}