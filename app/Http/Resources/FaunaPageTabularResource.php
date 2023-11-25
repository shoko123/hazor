<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaunaPageTabularResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'label' => $this->label,
            'area' => $this->area,
            'locus' => $this->locus,
            'basket' => $this->basket,
            'registration_clean' => $this->registration_clean ? 'Yes' : 'No',
            'taxon' => $this->taxon,
            'taxon_common_name' => $this->taxon_common_name,
            'fragment_present' => $this->fragment_present,
            'anatomical_label' => $this->anatomical_label,            
            'element' => $this->material->name,
            'modifications' => $this->modifications,            
            'symmetry' => $this->symmetry->name,
            'phase' => $this->phase,
            'age' => $this->age,
        ];
    }
}
