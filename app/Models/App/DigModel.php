<?php

namespace App\Models\App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

use Exception;

class DigModel extends Model implements HasMedia
{
    use  InteractsWithMedia;
    public $timestamps = false;
    protected $guarded = [];
    protected $eloquent_model_name;

    public function __construct($eloquent_model_name = null)
    {
        $this->eloquent_model_name = $eloquent_model_name;
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('tn')
            ->width(250)
            ->height(250)
            ->sharpen(10)
            ->nonQueued();
    }

   

}
