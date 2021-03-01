<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Download extends Model
{
    protected $table = 'downloads';
    public $timestamps = false;
    
    protected $fillable = [
        'user_id', 'content_id', 'download_date'
    ];

    protected $dates = [        
        'download_date'
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:sP');
    }

    public static function boot()
    {
        parent::boot();        

        static::creating(function ($model) {
            $model->download_date = $model->freshTimestamp();
        });
    }

    function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'user_id');
    }

    function content()
    {
        return $this->belongsTo('App\Content', 'content_id', 'content_id');
    }

    public function scopeByRole($query, $role_id)
    {
        return $query->whereHas('user', function ($q) use ($role_id) {
            $q->where('role', $role_id);
        });
    }
}
