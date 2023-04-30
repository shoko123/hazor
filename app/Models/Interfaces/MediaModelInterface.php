<?php

namespace App\Models\Interfaces;

use Illuminate\Http\Request;
use App\Models\App\DigModel;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;

interface MediaModelInterface
{
    public function upload(Request $r, DigModel $dm);
    public static function getMedia(MediaCollection $mc);
}
