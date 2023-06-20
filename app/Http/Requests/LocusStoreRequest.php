<?php

namespace App\Http\Requests;


use App\Http\Requests\DigModelStoreRequest;

class LocusStoreRequest extends DigModelStoreRequest
{
    //authorization done at DigModelStoreRequest.php

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'model' => 'in:Locus,Stone,Fauna',
            'id' => 'required|numeric',
            'item.name' => 'max:100',
            'item.area' => 'required|min:2|max:3',
            'item.locus_no' => 'required|numeric',
            'item.addendum' => 'nullable|min:1|max:2',
            'item.year' => 'nullable|numeric|min:1950|max:2025',
            'item.square' => 'max:100',
            'item.stratum' => 'max:100',
            'item.type' => 'max:100',
            'item.cross_ref' => 'max:100',
            'item.description' => 'max:500',
            'item.notes' => 'max:200',
            'item.elevation' => 'max:100',
        ];
    }
}
