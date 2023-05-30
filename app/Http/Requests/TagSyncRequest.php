<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class TagSyncRequest extends FormRequest
{
    private $modelToTableName = [
        "Locus" => "loci",
        "Stone" => "stones",
        "Fauna" => "fauna"
    ];
    private $modelToTagTableName = [
        "Locus" => "locus_tags",
        "Stone" => "stone_tags",
        "Fauna" => "fauna_tags"
    ];
    
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        //BEFORE PRODUCTION - enable checks!
        if (!auth('api')->check()) {
            return false;
        }
        $p = $this->input("model") . "tag";
        return $this->user('sanctum')->can($p);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        //TODO finish global_tags, CV and LV rules
        $model = $this->input("model");
        $table_name = $this->modelToTableName[$model];
        $tag_table_name = $this->modelToTagTableName[$model];
        $id_exists_rule = 'exists:' . $table_name . ',id';
        $tag_id_exists_rule = 'exists:' . $tag_table_name . ',id';
        //$global_tag_id_exists_rule = '';

        return [
            'model' => 'required|in:Locus,Stone,Fauna',
            'id' => $id_exists_rule,
            'new_tag_ids.*' => $tag_id_exists_rule,
            //'global_tags.*' => $global_tag_id_exists_rule,
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
