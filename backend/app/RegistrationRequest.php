<?php

namespace App;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class RegistrationRequest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    use Notifiable;
    protected $table = 'registration_requests';
    protected $primaryKey = 'registration_request_id'; 
    protected $fillable = [
        'first_name','last_name','email', 'user_hash','company','state','natuzzi_access','editions_access','divanidivani_access','notes','email_status','created_by','updated_by'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_hash', 'remember_token',
    ];

    public function user() {
        return $this->hasOne('App\User', 'user_id', 'user_id');
    }
    
}
