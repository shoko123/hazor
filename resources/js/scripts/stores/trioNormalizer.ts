// stores/media.js
import { normalize, schema } from 'normalizr';
import { Trio } from '../../types/trioTypes'

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
        selected: false,
        //groupKey
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
  return trio
}