<?php
namespace App\Http\Middleware;

use Closure;
use App\User;

class Access
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {        
        $error = [
            'status' => 'error',
            'message' => 'Invalid access token',
        ];

        try {
            // check token presence
            $token = $request->bearerToken();      
            if ($token === null) {
                return response()->json($error, 401);
            }

            // check user id presence
            $user = json_decode(base64_decode($token));
            if (!array_key_exists('user_id', $user) 
                || $user->user_id === null) {
                return response()->json($error, 401);
            }

            // check user in db
            $user = User::find($user->user_id);
            if ($user === null) {
                return response()->json($error, 401);
            }
            
            // add user to request
            $request->attributes->add(['user' => $user]);

            // set client timezone
            $userTimeZone = 
                $request->header('User-Timezone');
            $request->attributes->add(['userTimeZone' 
                => $userTimeZone]);
        } catch(Exception $e) {
            return response()->json($error, 401);
        }        

        return $next($request);        
    }
}