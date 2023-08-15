<?php

namespace App\Http\Requests;

use App\Http\Requests\DigModelStoreRequest;

class FaunaStoreRequest extends DigModelStoreRequest
{
    //authorization done at DigModelStoreRequest.php

    private $rules = [];

    static  $base_rules = [
        'item.label' => 'max:20|nullable',
        'item.area' => 'max:20|nullable',
        'item.locus' => 'max:30|nullable',
        'item.basket' => 'max:30|nullable',
        'item.notes' => 'max:45|nullable',        
        'item.stratum' => 'max:20|nullable',
        'item.item_category' => 'max:30|nullable',
        'item.biological_taxonomy' => 'max:100|nullable',
        'item.has_taxonomic_identifier' => 'max:40|nullable',
        'item.has_anatomical_identifier' => 'max:40|nullable',
        'item.taxon' => 'max:30|nullable',
        'item.element' => 'max:30|nullable',
        'item.fragment_present' => 'max:30|nullable',
        'item.snippet' => 'max:200|nullable',
        'item.taxon_id' => 'max:10|nullable',
        'item.element_id' => 'max:10|nullable',
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
