<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'user_hash', 'user_hash_date', 'user_id', 'first_name', 'last_name',
        'email', 'is_corporate', 'company', 'state', 'role', 'read_only',
        'state', 'natuzzi_access', 'editions_access', 'divanidivani_access',
        'enable', 'notes', 'admin_divanidivani_access',
        'admin_editions_access', 'admin_natuzzi_access', 'access_country',
        'ldap_flag'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'user_hash', 'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->user_hash;
    }
    
    public static function findOrCreate($id)
    {
        $obj = static::find($id);
        return $obj ? : new static;
    }

    public function registeration()
    {
        return $this->hasOne('App\RegistrationRequest', 
            $registration_request_id, $registration_request_id);
    }

}
