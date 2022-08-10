<?php

namespace App\Models\Model;

use App\Models\App\FindModel;
use App\Models\App\DigModel;

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
