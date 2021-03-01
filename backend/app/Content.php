<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use File;

class Content extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $appends = ['imageUrl'];
    protected $primaryKey = 'content_id';
    protected $table = 'contents';
    protected $fillable = [
        'content_name', 'file_mime_type', 'file_name', 'file_size', 
        'th_mime_type', 'th_name', 'th_size', 'copyright', 'private_content', 
        'availability_date', 'expiration_date', 'notes', 'created_by', 
        'updated_by'
    ];

    public function mediatype()
    {
        return $this->hasMany('App\ContentsMediaTypes', 'content_id', 
            'content_id');
    }
    
    public function getImageUrlAttribute()
    {
        if ($this->th_name != '' 
            && File::exists(storage_path('app/public/th_content/' 
            . $this->content_id))) {
            $data = file_get_contents(storage_path('app/public/th_content/' 
                . $this->content_id));
            $base64 = 'data:' . $this->th_mime_type . ';base64,' 
                . base64_encode($data);
        } else {
            $base64 = null;
        }

        return $base64;
    }

}
