<?php

namespace App\Models\Model;

use App\Models\App\DigModel;
use App\Models\App\FindModel;

class Locus extends FindModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'loci';

    public function __construct()
    {
        DigModel::__construct('Locus');
    }
    
    // public function index()
    // {
    //     return $this->limit(10)->get();
    // }
}
