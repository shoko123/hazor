<?php

namespace App\Models\Model;

use Illuminate\Support\Facades\DB;
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
    function buildSqlDescription() : string {
        return 'CONCAT(label, ", ", taxon, ", ", element) AS description';
    }
    function buildSqlUrlId() : string {
        return 'basket AS url_id';
    }
}
