<?php

namespace App\Models\Lookups;

use Illuminate\Database\Eloquent\Model;

class FaunaScope extends Model
{
    public $timestamps = false;
    protected $table = 'fauna_scopes';    
}
