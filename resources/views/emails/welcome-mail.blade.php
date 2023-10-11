@component("mail::message")

# Welcome {{ $name  }}!!
## This is a test email!

@component('mail::button', ['url' => 'https://opendigreports.com'])
To ODR
@endcomponent

@component('mail::panel')
This is a panel
@endcomponent

## Table component:

@component('mail::table')
| Laravel       | Table         | Example  |
| ------------- |:-------------:| --------:|
| Col 2 is      | Centered      | $10      |
| Col 3 is      | Right-Aligned | $20      |
@endcomponent


@component('mail::subcopy')
This is a subcopy component
@endcomponent

Thanks, <br>
{{ config('app.name') }}

@endcomponent