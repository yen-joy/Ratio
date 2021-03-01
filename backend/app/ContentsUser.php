<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContentsUser extends Model
{

    // admin utility
    public $timestamps = false;
    protected $table = 'contents_users';
    protected $fillable = [
        'content_id','user_id'
    ];
    public function content()
    {
    return $this->hasOne('App\Content', 'content_id','content_id')->with('mediatype');
    }
}
