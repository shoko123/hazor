<?php

namespace App\Models\Tags;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tags\StoneTag;

class StoneTagGroup extends Model
{
    public $timestamps = false;
    protected $table = 'stone_tag_groups';

    public function tags()
    {
        return $this->hasMany(StoneTag::class, 'group_id', 'id');
    }
}
