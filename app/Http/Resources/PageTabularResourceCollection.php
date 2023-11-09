<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\DigModels\Locus;
use App\Http\Resources\LocusPageTabularResourceCollection;
use App\Http\Resources\StonePageTabularResourceCollection;
use App\Http\Resources\FaunaPageTabularResourceCollection;

class PageTabularTransformCollection
{

    public function __construct(string $model_name, any $resource)
    {
        switch ($model_name) {
            case "Locus":
                return new LocusPageTabularResourceCollection($resource);
            case "Stone":
                return new StonePageTabularResourceCollection($resource);
            case "Fauna":
                return new FaunaPageTabularResourceCollection($resource);
        }
    }
}

class PageTabularResourceCollection extends ResourceCollection
{
}
