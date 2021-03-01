<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MediaType extends Model
{
    protected $primaryKey = 'media_type_id';
    protected $table = 'media_types';
    protected $fillable = [
        'media_type_name','created_by','updated_by'
    ];
    public function contentMediaType()
    {
    return $this->belongsTo('App\ContentsMediaTypes', 'media_type_id','media_type_id');  
    }
}
