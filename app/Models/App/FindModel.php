<?php

namespace App\Models\App;

use App\Models\App\DigModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

use Exception;

class FindModel extends DigModel
{
    public function __construct($eloquent_model_name = null)
    {
   
    }

    public function index($queryParams)
    {
        $builder = (object)[];
        switch ($this->eloquent_model_name) {
            case "Locus":
                $builder = $this->select('id', 'area', 'square', 'name', 'type', 'name AS dot');
                break;
            case "Fauna":
                $builder = $this->select('id', 'area', 'locus', 'basket', 'taxon', 'locus AS dot');
                break;
            case "Stone":
                $builder = $this->select('id', 'area', 'locus', 'basket', 'details', 'basket AS dot');
                break;
            
        }

        if (!empty($queryParams)) {
            foreach ($queryParams["registration"] as $key => $ids) {
                switch ($key) {
                    case "areas":
                        $builder->whereIn("area", $ids);
                        break;

                    case "seasons":
                        $builder->whereIn("season", $ids);
                        break;

                    case "media":
                        $builder->whereHas('media', function (Builder $mediaQuery) use ($ids) {
                            $mediaQuery->whereIn('collection_name', $ids);
                        });
                        break;

                    default:
                        //throw Error
                }
            }
        }

        switch ($this->eloquent_model_name) {
            case "Locus":
                $builder->orderBy('area', 'asc');
                break;
                 case "Stone":
            case "Fauna":
                $builder->orderBy('id', 'asc')->orderBy('basket', 'asc');
                break;                
        }     
        $collection = $builder->take(100)->get();
        return $collection;
    }

}
