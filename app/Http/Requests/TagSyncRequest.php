<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
use Closure;

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

    private $modelInfo = [
        "Locus" => [ "table_name" => "loci", "tag_table_name" => "locus_tags", "fields" => ["area"]],
        "Stone" => [ "table_name" => "stones", "tag_table_name" => "stone_tags", "fields" => ["material_id", "base_type_id"]],
        "Fauna" => [ "table_name" => "fauna", "tag_table_name" => "fauna_tags", "fields" => []],
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
        //TODO  column_values Rule
        $model = $this->input("model");
        $info = $this->modelInfo[$this->input("model")];

        $table_name = $this->modelToTableName[$this->input("model")];
        $tag_table_name = $this->modelToTagTableName[$model];
        $id_exists_rule = 'required|exists:' . $table_name . ',id';
        $tag_id_exists_rule = 'exists:' . $tag_table_name . ',id';

        $column_names = collect($info["fields"])->implode(',');
        $column_name_rule = 'in:' . $column_names;
        return [
            'model' => 'required|in:Locus,Stone,Fauna',
            'id' => $id_exists_rule,
            'model_tag_ids.*' => $tag_id_exists_rule,
            'ids.*' => 'exists:tags,id',
            'columns.*.column_name' => $column_name_rule,
            'columns.*.val' => '',
            'columns.*.paramKey' => '',
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
