<?php

namespace App\Models\Interfaces;

interface DigModelInterface
{
    public function buildSqlDescription(): string;
    public function index($queryParams);
    public function init(): array;
    public function page($r);
}
