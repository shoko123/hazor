<?php

namespace App\Models\Tags;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tags\TagGroup;
use App\Models\Dig\Locus;
use App\Models\Dig\Stone;
use App\Models\Dig\Fauna;

class Tag extends Model
{
    public $timestamps = false;
    protected $table = 'tags';

    public function tag_group()
    {
        return $this->belongsTo(TagGroup::class, 'group_id');
    }

    

    // public function taggables()
    // {
    //     return $this->hasMany('\App\Models\Scene\Sceneable', 'scene_id');
    // }

   

    public function loci()
    {
        return $this->morphedByMany('Locus', 'taggable');
    }

    public function stones()
    {
        return $this->morphedByMany('Stone', 'taggable');
    }

    public function fauna()
    {
        return $this->morphedByMany('Fauna', 'taggable');
    }
}
