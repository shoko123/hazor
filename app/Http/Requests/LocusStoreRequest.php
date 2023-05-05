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
            'item.area' => 'required|size:2',
            'item.name' => 'max:100',
            'item.square' => 'max:100',
            'item.elevation' => 'max:100',
            'item.type' => 'max:100',
            'item.stratum' => 'max:100',
            'item.cross_ref' => 'max:100',            
        ];
    }
}
