<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\App\DigModel;
use Illuminate\Http\Request;
use App\Http\Requests\MediaModifyRequest;
use App\Http\Requests\MediaReorderRequest;
use App\Models\Functional\MediaModel;


class MediaController extends Controller
{
    public function upload(MediaModifyRequest $r, DigModel $dm)
    {
        $validated = $r->validated();
        $m = new MediaModel();
        return response()->json($m->upload($validated, $dm), 200);
    }
  
    public function carousel(Request $r)
    {
        $res = MediaModel::carousel($r["id"]);      
        return response()->json($res, 200);
    }

    public function destroy(MediaModifyRequest $r)
    {
        $validated = $r->validated();
        $m = new MediaModel();
        return response()->json($m->destroy($validated), 200);
    }

    public function reorder(MediaReorderRequest $r)
    {
        $validated = $r->validated();
        $m = new MediaModel();
        return response()->json($m->reorder($validated), 200);
    }
}
