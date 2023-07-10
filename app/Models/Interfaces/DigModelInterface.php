<?php

namespace App\Models\Interfaces;

//use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection as SupportCollection;
interface DigModelInterface
{
    public function init(): array;    
    public function index($queryParams);
    public function page($ids, $view): SupportCollection;//some page views require gathering of data from DB (according to ids/slugs and view): "Media" | "Table"
    public function show(int $id);
    public function carousel(int $id);
    public function firstUrlId();
    public function getIdFromUrlId(string $s) : int;
    public function getUrlIdFromId(int $id): string;    
    public function builderIndexSelect(): void;
    public function itemShortDescription(Model $item): string;
    public function builderOrder(): void;
    public function pageFormat(): string;//returns {id, url_id, description, media1 (null | {tnUrl, fullUrl})}[]
    //public function buildSqlDescription(): string; //used by both builderIndexSelect and order
    public function itemSelect(): Builder;
    public function itemGet(object $slug_params): Builder;
    public function itemToIdParams(Model $item): array;
    public function discreteColumns(Model $model): array;
  
    public function itemFormat(): string;
    public function destroyItem(int $id);
}
