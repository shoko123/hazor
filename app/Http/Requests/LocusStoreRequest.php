<?php

namespace App\Http\Requests;


use App\Http\Requests\DigModelStoreRequest;

class LocusStoreRequest extends DigModelStoreRequest
{
    //authorization done at DigModelStoreRequest.php

    private $rules = [];

    static $base_rules = [
        'item.name' => 'max:100',
        'item.area' => 'in:XX,A,A1,A2,A3,A4,A5,A6,A7,M,M1,M2,M68',
        'item.locus_no' => 'required|numeric',
        'item.addendum' => 'nullable|min:1|max:2',
        'item.year' => 'nullable|numeric|min:1950|max:2025',
        'item.square' => 'max:100',
        'item.stratum' => 'max:100',
        'item.type' => 'max:100',
        'item.cross_ref' => 'max:100',
        'item.description' => 'max:500',
        'item.notes' => 'max:500',
        'item.elevation' => 'max:100',
    ];
    static $create_rules = [
        //
    ];
    static $update_rules = [
        'item.id' => 'exists:loci,id'
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
