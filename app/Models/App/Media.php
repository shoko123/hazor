<?php

namespace App\Models\App;

use Illuminate\Support\Facades\Storage;
use Exception;

class Media
{
    public function __construct($eloquent_model_name = null)
    {
        $this->eloquent_model_name = $eloquent_model_name;
    }

}
