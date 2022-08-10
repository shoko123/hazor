<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class AppController extends Controller
{
    public function hydrate(Request $r)
    {  
        $count = 0;
            if ($r["name"] !== 'About') {
                $fullModuleName = 'HHH';
               $count = $fullModuleName::count();
                //self::$counts['media'] = DB::table('media')->where('model_type', self::$moduleName)->count();
            }
     
        return response()->json([
            "counts" => [ "items" => $count, "media" => 777,],
            "categories" =>  self::$bucketUrl,
            "msg" => "AppController.init()",
        ], 200);
    }

    
}
