<?php

namespace App\Models\Dig\Stone;

use App\Models\DigModel;
use App\Models\FindModel;
class Locus extends FindModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'loci';

    public function __construct()
    {
        DigModel::__construct('Stone');
    }
}
