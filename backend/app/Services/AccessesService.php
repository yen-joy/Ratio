<?php

namespace App\Services;

use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use App\Accesses;

class AccessesService
{
    public function getQuery(Request $request) {
        $query = null;

        $user = $request->attributes->get('user');        
        $user_ids = $request->has('user_ids') ? 
            $request->input('user_ids') : null;
        $sort = $request->has('sort') ? 
            $request->input('sort') : null;

        // base query
        $query = Accesses::join('users', 'accesses.user_id', '=', 
            'users.user_id')->select('accesses.access_id as access_id',
            'users.first_name as first_name',
            'users.last_name as last_name',
            'users.email as email',
            'accesses.access_date as access_date');
        
        // sort
        if ($sort !== null) {
            $query = $query->orderBy($sort["prop"], $sort["dir"]);
        }
         
        if ($user->role == 1) {
            if ($user_ids !== null) {
                $query = $query->whereIn('accesses.user_id', $user_ids);
            }      
        } else {
            $query = $query->where('accesses.user_id', $user->user_id);
        }              

        return $query;
    }
}