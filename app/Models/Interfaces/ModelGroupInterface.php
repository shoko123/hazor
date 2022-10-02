<?php

namespace App\Models\Interfaces;

interface ModelGroupInterface
{
    public static function getModelGroups(): array;
    public static function getModelGroupNames(): array;
    public function trio(): array;
}
