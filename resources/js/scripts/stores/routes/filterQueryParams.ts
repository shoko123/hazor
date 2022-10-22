import { IObject, TmpGroup } from '../../../types/trioTypes'

function serializeQueryParams(groups: TmpGroup[]): IObject {
    let query: IObject = {}
    groups.forEach((group => {
        let commaSeperated = ''
        group.params.forEach(x => {
            commaSeperated += x.replace(/ /g,"_")  + ",";
        })
        query[group.groupName.replace(/ /g,"_")] = commaSeperated.slice(0, -1)
    }
    ));
    console.log(`query: ${JSON.stringify(query, null, 2)}`); 
    return query
}

function parseQueryParams(qp: IObject): any {
    let TG, TM, LV, CV, BS = []
    for (const [key, value] of Object.entries(qp)) {

    }
}
export { serializeQueryParams, parseQueryParams } 
