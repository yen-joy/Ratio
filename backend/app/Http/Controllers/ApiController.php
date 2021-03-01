<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use Illuminate\Support\Facades\Validator;
use App\User;
use App\Accesses;
use App\RegistrationRequest;
use App\Notifications\RegistrationRequest as RR;
use App\Notifications\RegistrationRequestAllAdmin as RRA;
use App\Notifications\EmailVerifiy as EV;
use App\Notifications\ResetPassword as RP;
use Carbon\Carbon;

class ApiController extends Controller
{

    public function version(Request $request)
    {
        $data = (object)array('version' => config('app.version'));

        return response()->json(['status' => 'success', 'message'
            => 'App Version', 'data' => $data]);
    }

    public function register(Request $request)
    {
        $input = $request->all();
        $v = Validator::make($input, [
            'first_name' => 'required|string|max:45',
            'last_name' => 'required|string|max:45',
            'email' => 'required|string|email|max:60',
            'user_hash' => 'required|string|min:6'
        ])->validate();

        if ($v) {
            return response()->json(['status' => 'fail', 'message'
                => 'validation error', 'data' => $validator->errors()], 401);
        }

        if (RegistrationRequest::where('email', $request->email)->exists()) {
            return response()->json(['status' => 'error', 'message'
                => 'Email Already Exists']);
        } else {
            $input['user_hash'] = md5($input['user_hash']);
            $input['role'] = ($request->role) ? $request->role : 2;
            $input['read_only'] = ($request->read_only) ?
                $request->read_only : 0;
            $input['is_corporate'] = ($request->is_corporate) ?
                $request->is_corporate : 0;
            $input['natuzzi_access'] = ($request->natuzzi_access) ?
                $request->natuzzi_access : 0;
            $input['editions_access'] = ($request->editions_access) ?
                $request->editions_access : 0;

            $registration = RegistrationRequest::create($input);
            try {
                $registration->notify(new RR(
                    $registration,
                    $request->user_hash
                ));
            } catch (Exception $e) {
                RegistrationRequest::where(
                    "registration_request_id",
                    $registration->registration_request_id
                )->delete();
                return response()->json(['status' => 'error', 'message' =>
                    'Mail server down, please register after some time']);
            }

            return response()->json(['status' => 'success', 'message'
                => 'Registration request successfuly sent']);
        }
    }

    public function register_email_validate(Request $request)
    {
        $key = $request->key;
        $id = decrypt($key, '!@#$%secret_key_salt!@#$%');
        $rr = RegistrationRequest::find($id);

        if ($rr->email_status == 0) {
            $rr->email_status = 1;
            $rr->save();
            try {
                $rr->notify(new EV($rr));
            } catch (Exception $e) {
                return response()->json(['status' => 'error', 'message'
                    => 'Mail server down, please register after some time']);
            }

            $adminDetails = User::where('role', 1)
                ->whereRaw('FIND_IN_SET("' . $rr->state . '",access_country )')
                ->where(function ($query) use ($rr) {
                    if ($rr->natuzzi_access) {
                        $query->Where(
                            'admin_natuzzi_access',
                            $rr->natuzzi_access
                        );
                    }
                    if ($rr->editions_access) {
                        $query->Where(
                            'admin_editions_access',
                            $rr->editions_access
                        );
                    }
                })->get();
            foreach ($adminDetails as $admin) {
                try {
                    $admin->notify(new RRA($admin, $rr));
                } catch (Exception $e) {
                    return response()->json(['status' => 'error', 'message'
                        => 'Mail server down, please try after some time']);
                }
            }
            return response()->json(['status' => 'success', 'message'
                => 'Email verified successfuly']);
        } else if ($rr->email_status == 1) {
            return response()->json(['status' => 'success', 'message'
                => 'Email address is already verified']);
        } else {
            return response()->json(['status' => 'error', 'message'
                => 'Invalid token']);
        }
    }

    public function login(Request $request)
    {
        // extract credential
        $credentials = $request->only('email', 'user_hash');
        $email = $credentials['email'];
        if (strpos($email, '@') === false) {
            $email .= env('USER_EMAIL_SUFFIX', '@natuzzi.com');
        }
        $password = $credentials['user_hash'];

        // check user existence
        $user = User::select(
            'user_id',
            'first_name',
            'last_name',
            'user_hash',
            'user_hash_date',
            'email',
            'is_corporate',
            'company',
            'state',
            'role',
            'read_only',
            'state',
            'natuzzi_access',
            'editions_access',
            'divanidivani_access',
            'enable',
            'notes',
            'ldap_flag'
        )->where('email', $email)->first();
        if ($user === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'invalid email or password',
            ]);
        }        

        // check credential
        if ($user->ldap_flag === 1) {
            try {
                // extract username
                $username = explode("@", $email);
                array_pop($username);
                $username = join('@', $username);

                // check ldap credential
                $provider = \Adldap::connect('default');
                if ($provider->auth()->attempt(
                    $username,
                    $password,
                    $bindAsUser = true
                ) === false) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'invalid email or password',
                    ]);
                }
            } catch (Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'invalid email or password',
                ]);
            }
        } else {
            if ($user->user_hash !== md5($password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'invalid email or password',
                ]);
            }
        }

        // check user enable
        if ($user->enable === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account has been deactivated.
                for more info please contact the administrator',
            ]);
        }

        Accesses::insert([
            'user_id' => $user->user_id,
            'access_date' => date('Y-m-d H:i:s')
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'token' => base64_encode($user),
                'data' => $user
            ],
        ]);
    }

    public function reset(Request $request)
    {
        if (User::where('email', '=', $request->email)->exists()) {
            $user = User::where('email', '=', $request->email)->first();
            $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $pin = mt_rand(1000000, 9999999) . mt_rand(1000000, 9999999)
                . $characters[rand(0, strlen($characters) - 1)];
            $password = str_shuffle($pin);
            $crypt = md5($password);
            User::where('email', '=', $request->email)
                ->update(['user_hash' => $crypt, 'user_hash_date'
                    => Carbon::now()->addMonths(3)]);
            try {
                $user->notify(new RP($request->email, $password));
            } catch (Exception $e) {
                return response()->json(['status' => 'error', 'message'
                    => 'Mail server down, please register after some time']);
            }
            return response()->json(['status' => 'success', 'message'
                => 'An email with your new password has been sent to you, 
                    please check your email.'], 200);
        } else {
            return response()->json(['status' => 'error', 'message'
                => 'Email invalid, please register.'], 200);
        }
    }

    public function registration_delete()
    {
        $now = Carbon::now();
        $datetime_from = date(
            "Y-m-d H:i:s",
            strtotime("-2 days", strtotime(Carbon::now()))
        );

        $registration = RegistrationRequest::where("email_status", 0)
            ->where('created_at', '<=', $datetime_from)->delete();

        return response()->json(['status' => 'success', 'message'
            => 'Unverified registeration request deleted successfully']);
    }
}