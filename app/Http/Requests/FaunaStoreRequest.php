<?php

namespace App\Http\Requests;

use App\Http\Requests\DigModelStoreRequest;

class FaunaStoreRequest extends DigModelStoreRequest
{
    //authorization done at DigModelStoreRequest.php

    private $rules = [];

    static  $base_rules = [
        'item.label' => 'max:40|nullable',
        'item.area' => 'max:12|nullable',
        'item.locus' => 'numeric|min:1261|max:8705|nullable',
        'item.basket' => 'numeric|min:0|max:554010|nullable',        
        'item.stratum' => 'max:30|nullable',
        'item.registration_clean' => 'required|min:0|max:30',
        'item.taxon' => 'max:40|nullable',
        'item.taxon_common_name' => 'max:40|nullable',
        'item.fragment_present' => 'max:15|nullable',
        'item.anatomical_label' => 'max:40|nullable',
        'item.element' => 'max:40|nullable',
        'item.modifications' => 'max:30|nullable',
        'item.phase' => 'max:20|nullable',
        'item.age' => 'max:20|nullable',
    ];
    static $create_rules = [
        //
    ];
    static $update_rules = [
        'item.id' => 'exists:fauna,id'
    ];

    public function rules(): array
    {
        return $this->rules;
    }

    protected function prepareForValidation(): void
    {
        if ($this->method() === 'POST') {
            $this->rules = array_merge(self::$base_rules, self::$create_rules);
        } else {
            $this->rules = array_merge(self::$base_rules, self::$update_rules);
        }
    }
}
