<?php

namespace App\Http\Controllers\Model;

use App\Http\Controllers\App\ModelController;
use App\Models\Model\Locus;
use Illuminate\Http\Request;

class LocusController extends ModelController
{
    public function __construct()
    {
        //DigController::__construct('Locus');
        $this->createModel('Locus');
    }

    public function index(Request $r)
    {
        return response()->json([
            "index" => $this->model->index(),
            "model_full_path" => $this->model_full_path
        ], 200);
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
