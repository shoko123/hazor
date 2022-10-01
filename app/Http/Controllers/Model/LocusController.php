<?php

namespace App\Http\Controllers\Model;

use App\Http\Controllers\App\ModelController;
use App\Models\Model\Locus;
use Illuminate\Http\Request;

class LocusController extends ModelController
{
    public function __construct()
    {
        parent::__construct('Locus');
    }

    public function store(Request $r)
    {      
        $method = $r->isMethod('put') ? "put" : "post";
                         
        return response()->json([
            "msg" => "LocusController.store()",
            "method" => $method
        ], 200);
    }
}
