<?php

namespace App\Models\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
//use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use stdClass;

interface MediaModelInterface
{
    public function storeMedia(Request $r);
}
