<?php

namespace App\Models\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
//use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use stdClass;

interface DigModelInterface
{
    public function init(): array;    
    public function index($queryParams);
    public function page($ids, $view): Collection;//view: "Media" | "Table"
    public function show(int $id);
    public function showCarouselItem(int $id);
    public function firstUrlId();

    public function getIdFromUrlId(string $s) : int;
    public function getUrlIdFromId(int $id): string;    
    public function indexSelect(): Builder;//returns {id, url_id}[]
    public function indexFormat(): string;
    public function pageSelect(): string;//returns {id, url_id}[]
    public function pageFormat(): string;//returns {id, url_id, description, media1 (null | {tnUrl, fullUrl})}[]
    public function buildSqlDescription(): string; //used by both indexSelect and pageSelect
    public function itemSelect(): string;

  
    public function itemFormat(): string;


}
