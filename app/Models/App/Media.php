<?php

namespace App\Models\App;

use Illuminate\Support\Facades\Storage;
use Exception;

class Media
{
    protected static $bucketUrl = null;
    public function __construct($eloquent_model_name = null)
    {
        $this->eloquent_model_name = $eloquent_model_name;
        $pilot = 'pilot';

        switch (env('FILESYSTEM_DISK')) {
            case 'minio':
                self::$bucketUrl = 'http://127.0.0.1:9000/jezreel/';
                break;

            case 'do':
                $pilotUrl = Storage::url($pilot);
                self::$bucketUrl = substr($pilotUrl, 0, str($pilotUrl)->length() - str($pilot)->length());
                break;
                
            default:
                throw new Exception('Unrecognized filesystem disk name');
        }
    }

}
