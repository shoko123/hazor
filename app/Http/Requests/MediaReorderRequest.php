<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class MediaReorderRequest extends FormRequest
{
    static $modelToTableName = [
        "Locus" => "loci",
        "Stone" => "stones",
        "Fauna" => "fauna"
    ];

    public function authorize(): bool
    {
        if (!auth('api')->check()) {
            return false;
        }
        $p = $this->input("model") . "-" . "media";
        return $this->user('sanctum')->can($p);
    }

    public function rules(): array
    {
        $table_name = self::$modelToTableName[$this->input("model")];
        $model_id_exists_rule = 'required|exists:' . $table_name . ',id';
        
        return [
            'model' => 'required|in:Locus,Stone,Fauna',
            'model_id' => $model_id_exists_rule,
            'ordered.*.id' => 'nullable|exists:media,id',
            'ordered.*.order' => 'numeric|integer',
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
