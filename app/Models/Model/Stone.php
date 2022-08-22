<?php

namespace App\Models\Model;

use Illuminate\Support\Facades\DB;

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

    function buildSqlDescription(): string
    {
        return 'details AS description';
    }
    function buildSqlUrlId(): string
    {
        return 'basket AS url_id';
    }
}
