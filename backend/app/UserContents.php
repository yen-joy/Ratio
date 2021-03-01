<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserContents extends Model
{
    public $timestamps = false;
    
    protected $table = 'users_contents';

    protected $fillable = [
        'content_id', 'user_id'
    ];

    public function content()
    {
        return $this->hasOne('App\Content', 'content_id', 'content_id')
            ->with('mediatype');
    }
}
