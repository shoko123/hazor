<?php

namespace App\Models\App;


// Declare the interface 'Template'
interface DigModelInterface
{
    public function buildSqlDescription(): string;
    public function getTrio(): array;
    public function index($queryParams);
    public function init(): array;
    public function page($r);
}
