<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocusPageTabularResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'year' => $this->year,
            'square' => $this->square,
            'stratum' => $this->stratum,
            'type' => $this->type,
            'cross_ref' => $this->cross_ref,
            'description' => $this->description,
            'notes' => $this->notes,
            'elevation' => $this->elevation
        ];
    }
}
