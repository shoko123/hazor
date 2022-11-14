<?php

namespace App\Models\Interfaces;

use Illuminate\Http\Request;
//use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Collection;
use stdClass;

interface DigModelInterface

{
    public function buildSqlDescription(): string;
    public function index($queryParams);
    public function init(): array;
    public function page(Request $r);
    public function show(Request $r);
}
