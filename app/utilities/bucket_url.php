<?php

use Illuminate\Support\Facades\Storage;

if (!function_exists('bucket_url')) {
    function bucket_url()
    {
        $pilot = 'pilot';

        switch (env('FILESYSTEM_DISK')) {
            case 'minio':
                return 'http://127.0.0.1:9000/dig/';

            case 'do':
                $pilotUrl = Storage::url($pilot);
                return substr($pilotUrl, 0, str($pilotUrl)->length() - str($pilot)->length());
                break;

            default:
                throw new Exception('Unrecognized filesystem disk name');
        }
    }
}
