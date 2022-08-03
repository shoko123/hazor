<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class AppController extends Controller
{
    protected static $bucketUrl = null;
    
    public function __construct()
    {
         $pilot = 'pilot';

        switch (env('FILESYSTEM_DISK')) {
            case 'minio':
                self::$bucketUrl = 'http://127.0.0.1:9000/dig/';
                break;

            case 'do':
                $pilotUrl = Storage::url($pilot);
                self::$bucketUrl = substr($pilotUrl, 0, str($pilotUrl)->length() - str($pilot)->length());
                break;
                
            default:
                throw new Exception('Unrecognized filesystem disk name');
        }
    }

    public function init(Request $r)
    {
        return response()->json([
            "accessibility" => config('accessibility.accessibility'),
            "bucketUrl" =>  self::$bucketUrl,
            "msg" => "AppController.init()",
        ], 200);
    }

    public function totals()
    {
        $tables = ['loci', 'fauna'];
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

        ], 200);
    }
}
