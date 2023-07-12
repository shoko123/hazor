<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShowParamsRequest extends FormRequest
{
    private $modelRules = [
        "Locus" => [
            'model' => 'required|in:Locus',
            'id' => 'sometimes|required|exists:loci,id',
            'slug' => 'string',
            'params.area' => 'exists:loci,area',
            'params.name'  => 'exists:loci,name',
        ],
        "Stone" =>  [
            'model' => 'required|in:Stone',
            'id' => 'sometimes|required|exists:stones,id',
            'slug' => 'string',            
            'params.basket' => 'exists:stones,basket',
            'params.stone_no'  => 'exists:stones,stone_no',
        ],
        "Fauna" => [
            'model' => 'required|in:Fauna',
            'id' => 'sometimes|required|exists:fauna,id',
            'slug' => 'string',                
            'params.basket' => 'exists:stones,basket',
            'params.stone_no'  => 'exists:stones,stone_no',
        ]
    ];

    public function rules(): array
    {
        return $this->modelRules[$this->input("model")];
    }
}
