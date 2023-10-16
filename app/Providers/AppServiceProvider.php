<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\ModelGroup\ModelGroup;
use App\Models\App\DigModel;
use App\Models\DigModels\Locus;
use App\Models\DigModels\Stone;
use App\Models\DigModels\Fauna;
use App\Models\ModelGroup\LocusGroup;
use App\Models\ModelGroup\StoneGroup;
use App\Models\ModelGroup\FaunaGroup;
use App\Http\Requests\DigModelStoreRequest;
use App\Http\Requests\LocusStoreRequest;
use App\Http\Requests\StoneStoreRequest;
use App\Http\Requests\FaunaStoreRequest;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(DigModel::class, function ($app) {
            switch (request()->input("model")) {
                case "Locus":
                    return new Locus;
                case "Stone":
                    return new Stone;
                case "Fauna":
                    return new Fauna;
            }
        });

        $this->app->singleton(ModelGroup::class, function ($app) {
            switch (request()->input("model")) {
                case "Locus":
                    return new LocusGroup;
                case "Stone":
                    return new StoneGroup;
                case "Fauna":
                    return new FaunaGroup;
            }
        });
        $this->app->singleton(DigModelStoreRequest::class, function ($app) {
            switch (request()->input("model")) {
                case "Locus":
                    return new LocusStoreRequest;
                case "Stone":
                    return new StoneStoreRequest;
                case "Fauna":
                    return new FaunaStoreRequest;
                default:
                    throw 'BadModelName';
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
        ResetPassword::createUrlUsing(
            function ($notifiable, $token) {
                return "http://localhost/auth/reset-password/{$token}?email={$notifiable->getEmailForPasswordReset()}";
            }
        );

        Relation::morphMap([
            'Locus' => 'App\Models\DigModels\Locus',
            'Stone' => 'App\Models\DigModels\Stone',
            'Fauna' => 'App\Models\DigModels\Fauna',
        ]);
    }
}
