<?php

namespace App\Models\Tags;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tags\FaunaTagGroup;
use App\Models\Dig\Fauna;

class FaunaTag extends Model
{
    public $timestamps = false;
    protected $table = 'fauna_tags';

    public function tag_group()
    {
        return $this->belongsTo(FaunaTagGroup::class, 'group_id');
    }

    public function item()
    {
        return $this->belongsToMany(Fauna::class, 'fauna-fauna_tags', 'tag_id', 'item_id');
    }
}
