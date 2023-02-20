<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Functional\MediaModel;

class MediaController extends Controller
{
    public function store(Request $r)
    {
        $mediaModel = new MediaModel($r["model"]);

    }
}
