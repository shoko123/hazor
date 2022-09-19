<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ModelController extends Controller
{
    protected $model_name = null;
    protected $model = null;

    public function createModel(String $model_name)
    {
        $this->model_name = $model_name;
        $model_full_path = "App\Models\Model\\" . $model_name;
        $this->model = new ($model_full_path);
    }

    public function init(Request $r)
    {  
        $this->createModel($r["model"]);
        return response()->json($this->model->init(), 200);
    }

    public function index(Request $r)
    {
        $this->createModel($r["model"]);
        $collection = $this->model->index($r["queryParams"]);
       
        return response()->json([           
            //"model" =>  $this->model_name,
            "msg" => "ModelController.index(" .  $this->model_name . ")",
            "collection" => $collection,
        ], 200);
    }

    public function page(Request $r)
    {
        $this->createModel($r["model"]);
        return response()->json([
            "page" => $this->model->page($r),
        ], 200);
    }
    
    public function destroy($id)
    {
        return response()->json([
            "msg" => "ModelControler.destroy()",
            "model_name" => $this->model_name
        ], 200);
    }
   
}
