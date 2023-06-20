<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\App\DigModel;
use App\Http\Requests\DigModelStoreRequest;

class DigModelStoreController extends Controller
{
    public function store(DigModelStoreRequest $r, DigModel $m)
    {
        $validated = $r->validated();
        $item = $m->store($validated["id"], $validated["item"], $r->isMethod('post'));

        $resp = array_merge($item, [
            "msg" => "ModelControler.store()",
        ]);

        return response()->json($resp, 200);
    }
}
