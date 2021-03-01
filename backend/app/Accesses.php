<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Accesses extends Model
{
    protected $table = 'accesses';
    
    public $timestamps = false;
    
    protected $fillable = [
        'user_id', 'access_date'
    ];

    protected $dates = [        
        'access_date'
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:sP');
    }

    function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'user_id');
    }
}
