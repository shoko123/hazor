<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\App\DigModelInterface;
use App\Models\Model\Locus;
use App\Models\Model\Stone;
use App\Models\Model\Fauna;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(DigModelInterface::class, function ($app) {

            switch (request()->input("model")) {
                case "Locus":
                    return new Locus;
                case "Stone":
                    return new Stone;
                case "Fauna":
                    return new Fauna;
            }
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'Locus' => 'App\Models\Model\Locus',
            'Stone' => 'App\Model\Stone',
            'Fauna' => 'App\Model\Fauna',
        ]);
    }
}
