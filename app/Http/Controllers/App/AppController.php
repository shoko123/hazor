<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

use App\Models\App\AppModel;
use App\Models\Functional\MediaModel;

class AppController extends Controller
{
    public function __construct()
    {
    }

    public function init()
    {
        return response()->json([
            "appUrl" =>  env('APP_URL'),
            "bucketUrl" =>  env('S3_BUCKET_URL'),            
            "accessibility" => [
                'readOnly' => env('ACCESSIBILITY_READ_ONLY'),
                'authenticatedUsersOnly' => env('ACCESSIBILITY_AUTHENTICATED_ONLY')
            ],
            "media_collections"  => MediaModel::media_collections(),
            "msg" => "AppController.init()",
        ], 200);
    }

    public function status()
    {
        $tables = ['loci', 'stones', 'fauna'];
        $totals = [];
        foreach ($tables as $t) {
            array_push($totals, [
                'table_name' => $t,
                'cnt' => DB::table($t)->count(),
            ]);
        }

        return response()->json([
            "msg" => "AppController.totals",
            "totals" => $totals,
            "bucketUrl" =>  env('S3_BUCKET_URL'),
            "appUrl" => env('APP_URL')
        ], 200);
    }
}
