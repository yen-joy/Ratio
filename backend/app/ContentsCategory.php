<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContentsCategory extends Model
{
  public $timestamps = false;

  protected $table = 'contents_categories';

  protected $fillable = [
    'content_id', 'category_id'
  ];

  public function content()
  {
    return $this->hasOne('App\Content', 'content_id', 'content_id')
      ->with('mediatype');
  }
  
  public function categories()
  {
    return $this->hasMany('App\Category', 'category_id', 'category_id');
  }

}
