<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContentsMediaTypes extends Model
{
    public $timestamps = false;
    protected $table = 'contents_media_types';
    protected $fillable = [
        'content_id','media_type_id'
    ];
    public function content()
    {
    return $this->belongsTo('App\Content', 'content_id','content_id');
    }
    public function mediaType()
    {
    return $this->hasMany('App\MediaType', 'media_type_id','media_type_id');  
    }
}
