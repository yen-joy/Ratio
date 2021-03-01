<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use File;

class Category extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $appends = ['imageUrl', 'text', 'value'];
    protected $primaryKey = 'category_id';
    protected $table = 'categories';
    protected $fillable = [
        'category_name', 'parent_id', 'brand', 'th_mime_type', 'th_name', 
        'th_size', 'created_by', 'updated_by'
    ];

    public function childs()
    {
        return $this->hasMany('App\Category', 'parent_id', 'category_id')
            ->with('childs')->with('content');
    }

    public function content()
    {
        return $this->hasMany('App\ContentsCategory', 'category_id', 
            'category_id');
    }

    public function children()
    {
        return $this->hasMany('App\Category', 'parent_id', 'category_id')
            ->with('children');
    }

    public function getTextAttribute()
    {
        return $this->category_name;
    }

    public function parent()
    {
        return $this->hasOne('App\Category', 'category_id', 'parent_id')
            ->with('parent');
    }

    public function getValueAttribute()
    {
        return $this->category_name;
    }

    public function getImageUrlAttribute()
    {
        if ($this->th_name != '' 
            && File::exists(storage_path('app/public/category/' 
            . $this->category_id))) {
            return '/category/image/' .$this->category_id;
        } else {
            return null;
        }
    }
}
