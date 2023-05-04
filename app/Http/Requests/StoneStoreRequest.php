<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoneStoreRequest extends FormRequest
{
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
        return [
            'item.area' => 'min:1|max:3',
            'item.locus' => 'max:500',
            'item.basket' => 'numeric|min:1|max:50000|nullable',
            'item.date' => 'string|nullable',
        ];
    }
}
