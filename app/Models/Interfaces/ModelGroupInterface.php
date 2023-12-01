<?php

namespace App\Models\Interfaces;

interface ModelGroupInterface
{
    public static function getModelGroups(): array;
    public function trio(): array;
}
