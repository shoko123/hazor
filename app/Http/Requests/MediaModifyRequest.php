<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules\File;
use App\Models\Functional\MediaModel;

class MediaModifyRequest extends FormRequest
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
        $media_collections = MediaModel::media_collections();
        $media_collection_rule =  'nullable|in:' . implode(',', $media_collections);
        return [
            'model' => 'required|in:Locus,Stone,Fauna',
            'model_id' => $model_id_exists_rule,
            'media_id' => 'nullable|exists:media,id',
            'media_collection_name' => $media_collection_rule,
            'media_files.*' => [
                'nullable',
                File::image()
                    ->min(10)
                    ->max(3 * 1024)
            ],
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
