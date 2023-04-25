<?php

namespace App\Models\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
//use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use App\Models\App\DigModel;
//use Spatie\MediaLibrary\MediaCollections\MediaCollection;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;

interface MediaModelInterface
{
    public function storeMedia(Request $r, DigModel $dm);
    public static function orderMedia(MediaCollection $mc);
}
