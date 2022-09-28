<?php

namespace App\Models\Tags;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tags\FaunaTag;

class FaunaTagGroup extends Model
{
    public $timestamps = false;
    protected $table = 'fauna_tag_groups';

    public function tags()
    {
        return $this->hasMany(FaunaTag::class, 'group_id', 'id');
    }
}
