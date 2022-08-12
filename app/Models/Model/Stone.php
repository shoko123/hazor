<?php

namespace App\Models\Model;

use App\Models\App\DigModel;
use App\Models\App\FindModel;

class Stone extends FindModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'stones';

    public function __construct()
    {
        DigModel::__construct('Stone');
    }
}
