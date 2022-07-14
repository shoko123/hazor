<?php

namespace App\Models\Dig\Locus;

use App\Models\DigModel;

class Locus extends DigModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'loci';

    public function __construct()
    {
        DigModel::__construct('Locus');
    }
    
    public function index()
    {
        return $this->limit(10)->get();
    }
}
