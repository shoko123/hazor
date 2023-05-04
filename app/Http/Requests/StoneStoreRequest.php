<?php

namespace App\Http\Requests;


use App\Http\Requests\DigModelStoreRequest;

class StoneStoreRequest extends DigModelStoreRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (!auth('api')->check()) {
            return false;
        }
        $p = $this->input("model") . "-" . (($this->method() == 'POST')  ?  "create" : "update");
        return $this->user('sanctum')->can($p);
    }

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
            'item.area' => 'min:1|max:3',
            'item.locus' => 'max:500',
            'item.basket' => 'string|nullable',
            'item.date' => 'string|max:10|nullable',
            'item.prov_notes' => 'max:500',
            'item.material' => 'max:500',
            'item.type' => 'max:500',
            'item.details' => 'max:500',
            'item.dimensions' => 'max:500',
        ];
    }
}
