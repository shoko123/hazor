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
            'diagnostic' => $this->diagnostic,
            'slug' => $this->slug,
            'label' => $this->label,
            'area' => $this->area,
            'locus' => $this->locus,
            'basket' => $this->basket,
            'registration_clean' => $this->registration_clean ? 'Yes' : 'No',
            'base_taxon' => $this->base_taxon->name,
            'taxon' => $this->taxon,
            'fragment_present' => $this->fragment_present,
            'base_element' => $this->base_element->name,
            'symmetry' => $this->symmetry,
            'anatomical_label' => $this->anatomical_label,
            'modifications' => $this->modifications,
        ];
    }
}
