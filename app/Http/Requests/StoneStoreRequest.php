<?php

namespace App\Http\Requests;


use App\Http\Requests\DigModelStoreRequest;

class StoneStoreRequest extends DigModelStoreRequest
{
    //authorization done at DigModelStoreRequest.php

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $base_rules = [
            'item.area' => 'in:A,A1,A2,A3,A4,A5,A6,A7,M,M1,M2,M68,XX',
            'item.locus' => 'max:50',
            'item.basket' => 'max:50',
            'item.stone_no' => 'min:0|max:99',
            'item.date' => 'string|max:10|nullable',
            'item.year' => 'numeric|min:1950|max:2025|nullable',
            'item.prov_notes' => 'max:200',
            'item.type' => 'max:500',
            'item.material_code' => 'max:20',
            'item.dimensions' => 'max:250',
            'item.rim_diameter' => 'min:1|max:500|nullable',
            'item.description' => 'max:500',
            'item.notes' => 'max:250',
            'item.publication' => 'max:250',
        ];
        $create_rules = [
            'item.material_id' => 'exists:stone_materials,id',
            'item.base_type_id' => 'exists:stone_base_types,id'
        ];
        $update_rules = [
            'item.id' => 'exists:stones,id'
        ];

        if ($this->method() === 'POST') {
            return array_merge($base_rules, $create_rules);
        } else {
              return array_merge($base_rules, $update_rules);
        }
    }
}
