<?php

namespace App\Http\Requests;

use App\Http\Requests\DigModelStoreRequest;

class FaunaStoreRequest extends DigModelStoreRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'required|numeric',
            'item.label' => 'max:20|nullable',
            'item.area' => 'max:20|nullable',
            'item.locus' => 'max:30|nullable',
            'item.basket' => 'max:30|nullable',
            'item.stratum' => 'max:20|nullable',
            'item.item_category' => 'max:30|nullable',
            'item.biological_taxonomy' => 'max:100|nullable',
            'item.has_taxonomic_identifier' => 'max:40|nullable',
            'item.has_anatomical_identifier' => 'max:40|nullable',
            'item.taxon' => 'max:30|nullable',
            'item.element' => 'max:30|nullable',
            'item.fragment_present' => 'max:30|nullable',
            'item.bone_number' => 'max:40|nullable',
            'item.snippet' => 'max:200|nullable',
            'item.taxon_id' => 'max:10|nullable',
            'item.element_id' => 'max:10|nullable',
        ];
    }
}
