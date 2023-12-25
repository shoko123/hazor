<?php

namespace App\Models\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

interface DigModelInterface
{
    public function initInfo(): array;
    public function index($queryParams);
    public function page($ids, $view): Collection;
    public function show(array $validated);
    public function carousel(int $id);
    public function firstSlug();
    public function destroyItem(int $id);
}
