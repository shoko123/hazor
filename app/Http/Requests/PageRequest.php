<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class PageRequest extends FormRequest
{
    private $modelToTableName = [
        "Locus" => "loci",
        "Stone" => "stones",
        "Fauna" => "fauna"
    ];

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
        //TODO  column_values Rule
        $table_name = $this->modelToTableName[$this->input("model")];
        $id_exists_rule = 'required|exists:' . $table_name . ',id';

        return [
            'model' => 'required|in:Locus,Stone,Fauna',
            'ids.*' => $id_exists_rule,
            'view' => 'required|in:Table,Image',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Validation errors',
            'data'      => $validator->errors()
        ], 400));
    }
}
