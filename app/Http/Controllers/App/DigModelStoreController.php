<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\App\DigModel;
use App\Http\Requests\StoneStoreRequest;

class DigModelStoreController extends Controller
{
    protected $model_name = null;
    protected $model = null;

    public function store(StoneStoreRequest $ss, Request $r, DigModel $m)
    {
        $res = $m->store($r["id"], $r["item"], $r->isMethod('put'));
        return response()->json([
            "msg" => "ModelStoreController.store()",
            "request" => $res,
        ], 200);
    }

 
}
