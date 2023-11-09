<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StonePageTabularResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'area' => $this->area,
            'locus' => $this->locus,
            'basket' => $this->basket,
            'stone_no' => $this->stone_no,
            'year' => $this->year,
            'prov_notes' => $this->prov_notes,
            'type' => $this->type,
            'material_code' => $this->material_code,
            'rim_diameter' => $this->rim_diameter,
            'description' => $this->description,
            'notes' => $this->notes,
            'publication' => $this->publication,
            'material' => $this->material->name,
            'base_type' => $this->baseType->name,
        ];
    }
}
