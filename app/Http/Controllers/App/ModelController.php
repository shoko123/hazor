<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ModelController extends Controller
{
    public $model_full_path = null;
    protected $model_name = null;

    protected $model = null;

    public function __construct(/*String $model_name*/)
    {
        //$this->model_full_path = "App\Models\Model\\" . $model_name . "\\" . $model_name;
        //$this->model = new ($this->model_full_path);
    }
    public function createModel(String $model_name)
    {
        $this->model_name = $model_name;
        $this->model_full_path = "App\Models\Model\\" . $model_name;
        $this->model = new ($this->model_full_path);
    }

    public function hydrate(Request $r)
    {  
        $this->createModel($r["model"]);
        $count = $this->model->count();
        $mediaCount = '6777';
       
        return response()->json([           
            //"model" =>  $this->model_name,
            "msg" => "ModelController.hydrate(" .  $this->model_name . ")",
            "counts" => [ "items" => $count, "media" => 777,],
        ], 200);
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

    public function chunk(Request $r)
    {
        return response()->json([
            "msg" => "ModelControler.chunk()",
            "model_name" => $this->model_name
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
