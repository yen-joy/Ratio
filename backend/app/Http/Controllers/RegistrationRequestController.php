<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\RegistrationRequest;
use App\User;
use DB;
use Illuminate\Http\Request;
use App\Notifications\ApprovedEmail as AE;
use App\Notifications\RegisterRequestRejected as RRR;
use Carbon\Carbon;

class RegistrationRequestController extends Controller
{
    public function list(Request $request)
    {
        $user = $request->attributes->get('user');

        $page_size = $request->input('page_size');
        $status = $request->has('status') ? $request->input('status') : null;
        $sort = $request->has('sort') ? $request->input('sort') : null;
        
        // base query
        $query = RegistrationRequest::select('*');

        // filters
        if ($status !== null) {
            $query = $query->where('status', $status);
        }

        // finalize query
        $query = $query->whereRaw('FIND_IN_SET(state, "'
            . $user->access_country . '" )')
            ->where('email_status', 1)->with('user');
        
        // sort
        if ($sort !== null) {
            $query = $query->orderBy($sort["prop"], $sort["dir"]);
        }

        $data = $query->paginate($page_size);

        return response()->json(['status' => 'success', 'message'
            => 'Registration listed success', 'data' => $data]);
    }

    public function save(Request $request)
    {
        $input = $request->all();
        $check = Validator::make($input, [
            'first_name' => 'required|string|max:45',
            'last_name' => 'required|string|max:45',
            'email' => 'required|string|email|max:60'            
        ])->validate();

        if ($check) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Validation error',
                'data' => $check->errors()
            ], 401);
        } else {
            if ($request->enable == 1) {
                $reg = RegistrationRequest::where(
                    'registration_request_id',
                    $request->registration_request_id
                )->first();
                $reg->first_name = $request->first_name;
                $reg->last_name = $request->last_name;
                $reg->email = $request->email;
                if ($request->has('user_hash')) {
                    $reg->user_hash = md5($request->user_hash);
                }
                $reg->state = $request->state;
                $reg->company = $request->company;
                if ($request->enable == 2) {
                    $reg->status = $request->enable;
                }
                $reg->is_corporate = ($request->is_corporate) ?
                    $request->is_corporate : 0;
                $reg->natuzzi_access = ($request->natuzzi_access) ?
                    $request->natuzzi_access : 0;
                $reg->editions_access = ($request->editions_access) ?
                    $request->editions_access : 0;
                $reg->notes = $request->notes;
                $reg->save();
                try {
                    $reg->notify(new AE($reg));
                } catch (Exception $e) {
                    return response()->json(['status' => 'error', 'message'
                        => 'Mail server down, please register 
                        after some time']);
                }
                $regreq = DB::table('registration_requests')
                    ->select('user_hash')->where(
                        'registration_request_id',
                        $request->registration_request_id
                    )->first();
                $user = User::findOrCreate($request->has('user_id') ?
                    $request->user_id : '');
                $user->first_name = $request->first_name;
                $user->last_name = $request->last_name;
                $user->email = $request->email;
                if ($request->has('user_hash')) {
                    $user->user_hash = md5($request->user_hash);
                } else {
                    $user->user_hash = $regreq->user_hash;
                }
                $user->user_hash_Date = Carbon::now()->addMonths(3);
                $user->state = $request->state;
                $user->company = $request->company;
                $user->role = ($request->role) ? $request->role : 2;
                $user->read_only = ($request->read_only) ?
                    $request->read_only : 0;
                $user->is_corporate = ($request->is_corporate) ?
                    $request->is_corporate : 0;
                $user->natuzzi_access = ($request->natuzzi_access) ?
                    $request->natuzzi_access : 0;
                $user->editions_access = ($request->editions_access) ?
                    $request->editions_access : 0;
                $user->enable = ($request->enable) ? $request->enable : 0;
                $user->notes = $request->notes;
                $user->ldap_flag = 0;
                $user->save();
                RegistrationRequest::where(
                    'registration_request_id',
                    $request->registration_request_id
                )->update(['user_id'
                    => $user->user_id, 'status' => 1]);

                return response()->json(['status' => 'success', 'message'
                    => 'User Approved']);
            } else {
                $reg = RegistrationRequest::where(
                    'registration_request_id',
                    $request->registration_request_id
                )->first();
                $reg->first_name = $request->first_name;
                $reg->last_name = $request->last_name;
                $reg->email = $request->email;
                $reg->user_hash = md5($request->user_hash);

                $reg->state = $request->state;
                $reg->company = $request->company;
                if ($request->enable == "2") {
                    $reg->status = $request->enable;
                }
                $reg->is_corporate = ($request->is_corporate) ?
                    $request->is_corporate : 0;
                $reg->natuzzi_access = ($request->natuzzi_access) ?
                    $request->natuzzi_access : 0;
                $reg->editions_access = ($request->editions_access) ?
                    $request->editions_access : 0;
                $reg->notes = $request->notes;
                $reg->save();
                if ($request->enable == "2") {
                    try {
                        $reg->notify(new RRR($reg));
                    } catch (Exception $e) {
                        return response()->json(['status' => 'error', 'message'
                            => 'Mail server down, please register after 
                            some time']);
                    }
                }
                return response()->json(['status' => 'success', 'message'
                    => 'User Updated']);
            }
        }
    }

    public function count(Request $request)
    {
        $user = $request->attributes->get('user');

        $holdcount = RegistrationRequest::where([
            ['status', '=', 0],
            ['email_status', '=', 1]
        ])
            ->whereRaw('FIND_IN_SET(state, "' . $user->access_country . '" )')
            ->count();
        if ($holdcount > 0) {
            return response()->json(['status' => 'success', 'message'
                => 'Registration hold count', 'data' => $holdcount]);
        } else {
            return response()->json(['status' => 'success', 'message'
                => 'Registration hold count not available ', 'data' => 0]);
        }
    }
    
    public function delete(Request $request)
    {
        $user = RegistrationRequest::find($request->all());
        if ($user) {
            $destroy = RegistrationRequest::destroy($request->all());
            return response()->json(['status' => 'success', 'message'
                => 'Registration Request User Deleted Successfully'], 200);
        } else {
            return response()->json(['status' => 'error', 'message'
                => 'Something Went Wrong'], 401);
        }
    }
}
