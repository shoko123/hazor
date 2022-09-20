<?php

namespace App\Models\Tags;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tags\Tag;

class TagGroup extends Model
{
    public $timestamps = false;
    protected $table = 'tag_groups';

    public function tags()
    {
        return $this->hasMany(Tag::class, 'group_id', 'id');
    }
}
