<?php
namespace App\Models\Model;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use App\Models\App\FindModel;

class Locus extends DigModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'loci';

    public function __construct()
    {
        DigModel::__construct('Locus');
    }

    function buildSqlDescription() : string {
        return 'type AS description';
    }
    
    function buildSqlUrlId() : string {
        return 'name AS url_id';
    }
}
