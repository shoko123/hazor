<?php

namespace App\Models\Dig\Fauna;

use App\Models\FindModel;
use App\Models\DigModel;

class Fauna extends FindModel
{
    protected $table = 'fauna';
    public $timestamps = false;
    protected $guarded = [];

    public function __construct()
    {
        DigModel::__construct('Fauna');  
    }
}
