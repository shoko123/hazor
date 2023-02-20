<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Interfaces\DigModelInterface;
use App\Models\Interfaces\ModelGroupInterface;

class DigModelDestroyController extends Controller
{
    public function destroy($id, DigModelInterface $m)
    {
        return response()->json([
            "msg" => "ModelControler.destroy()",
            "model_name" => $m->model_name
        ], 200);
    }
}
