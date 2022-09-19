<?php

namespace App\Models\Tags;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tags\LocusTag;

class LocusTagGroup extends Model
{
    public $timestamps = false;
    protected $table = 'locus_tag_groups';

    public function tags()
    {
        return $this->hasMany(LocusTag::class, 'group_id', 'id');
    }
}
