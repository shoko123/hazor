<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class LocusPageTabularResourceCollection extends ResourceCollection
{
    public static $wrap = 'page';

    public function toArray(Request $request): array
    {

        return parent::toArray($request);
    }
}
