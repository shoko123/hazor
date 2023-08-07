<?php

namespace App\Models\App;

use Illuminate\Support\Facades\Storage;
use Exception;

class AppModel
{
    public function __construct()
    {
    }

    static function bucket_url()
    {
        $pilot = 'pilot';

        switch (env('FILESYSTEM_DISK')) {
            case 'minio':
                return 'http://127.0.0.1:9000/hazor/';

            case 'do':
                $pilotUrl = Storage::url($pilot);
                return substr($pilotUrl, 0, str($pilotUrl)->length() - str($pilot)->length());
                break;

            default:
                throw new Exception('Unrecognized filesystem disk name');
        }
    }    
}
