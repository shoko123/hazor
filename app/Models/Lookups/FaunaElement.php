<?php

namespace App\Models\Lookups;

use Illuminate\Database\Eloquent\Model;

class FaunaElement extends Model
{
    public $timestamps = false;
    protected $table = 'fauna_base_elements';    
}
