<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use App\Models\App\AppModel;
use Exception;

class AppController extends Controller
{
    public function __construct()
    {
    }

    public function init()
    {
        return response()->json([
            "accessibility" => [
                'readOnly' => env('ACCESSIBILITY_READ_ONLY'),
                'authenticatedUsersOnly' => env('ACCESSIBILITY_AUTHENTICATED_ONLY')
            ],
            "bucketUrl" =>  AppModel::bucket_url(),
            "media_collections"  => config('media-library.media_collections'),
            "itemsPerPage" => config('display_options.itemsPerPage'),
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
            "bucketUrl" =>  AppModel::bucket_url(),
        ], 200);
    }
}
