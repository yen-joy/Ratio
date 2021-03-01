<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Notifications\AdminUserCreate as CU;
use App\Notifications\AdminUserUpdate as UU;
use Carbon\Carbon;

class UserController extends Controller
{
    public function list(Request $request)
    {
        $page_size = $request->input('page_size');
        $statusValue = $request->has('statusValue') ? 
            $request->input('statusValue') : null;
        $brandValue = $request->has('brandValue') ? 
            $request->input('brandValue') : null;
        $countryCode = $request->has('countryCode') ? 
            $request->input('countryCode') : null;
        $sort = $request->has('sort') ? $request->input('sort') : null;  

        // base query
        $query = User::select('*');

        // filters
        if ($statusValue !== null) {
            $query = $query->where('enable', $statusValue);
        }
        if ($countryCode !== null) {
            $query = $query->where('state', $countryCode);
        }
        if ($brandValue !== null) {
            if ($brandValue == '1') {
                $query = $query->where('natuzzi_access', 1);
            }      
            if ($brandValue == '2') {
                $query = $query->where('editions_access', 1);
            }         
        }      

        // sort
        if ($sort !== null) {
            $query = $query->orderBy($sort["prop"], $sort["dir"]);
        }

        // paginate
        $data = $query->paginate($page_size);   

        return response()->json(['status' => 'success', 'message'
            => 'user listed success', 'data' => $data]);
    }

    public function filter(Request $request)
    {
        $result = User::where('first_name', 'LIKE', "%$request->filterValue%")
            ->orWhere('last_name', 'LIKE', "%$request->filterValue%")
            ->orWhere('email', 'LIKE', "%$request->filterValue%")
            ->limit(10)->get();

        return response()->json(['status' => 'success', 'message'
            => 'Search List', 'data' => $result], 200);
    }

    public function save(Request $request)
    {
        $input = $request->all();
        $rule = [
            'first_name' => 'required|string|max:45',
            'last_name' => 'required|string|max:45',
            'email' => 'required|string|email|max:60',
        ];
        $user = User::firstOrNew(['user_id' => $request->user_id]);
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        if ($request->user_id == '' || $request->user_hash != '') {
            $user->user_hash = md5($request->user_hash);
            $rule['user_hash'] = 'required|string|min:6';
            $user->user_hash_date = Carbon::now()->addMonths(3);
        }
        $user->state = $request->state;
        $user->company = $request->company;
        $user->role = ($request->role) ? $request->role : 2;
        $user->read_only = ($request->read_only) ? $request->read_only : 0;
        $user->is_corporate = ($request->is_corporate)
            ? $request->is_corporate : 0;
        $user->natuzzi_access = ($request->natuzzi_access)
            ? $request->natuzzi_access : 0;
        $user->editions_access = ($request->editions_access)
            ? $request->editions_access : 0;
        $user->admin_natuzzi_access = ($request->admin_natuzzi_access)
            ? $request->admin_natuzzi_access : 0;
        $user->admin_editions_access = ($request->admin_editions_access)
            ? $request->admin_editions_access : 0;
        $access_country = [];
        if ($request->access_country) {
            foreach ($request->access_country as $value) {
                $access_country[] = $value['code'];
            }
        }
        $user->access_country = implode(',', $access_country);
        $user->enable = ($request->enable) ? $request->enable : 0;
        $user->notes = $request->notes;
        $user->ldap_flag = ($request->ldap_flag) ? $request->ldap_flag : 0;

        $valid = Validator::make($input, $rule)->validate();
        if ($valid) {
            return response()->json(['status' => 'fail', 
                'message' => 'Validation error', 
                'data' => $valid->errors()], 401);
        }

        if (User::where(['email' => $request->email])->exists()
            && $request->user_id == '') {
            return response()->json(['status' => 'error', 'message'
                => 'Email Already Exists'], 200);
        } elseif ($request->user_id == '') {
            $user->save();
            $user->notify(new CU($user, $request->user_hash));
            return response()->json(['status' => 'success', 'message'
                => 'New User Successfully Register'], 200);
        } else {
            $user->save();
            $user->notify(new UU($user));
            return response()->json(['status' => 'success', 'message'
                => 'User Details Successfully Updated'], 200);
        }
    }

    public function details(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error', 'errors'
                    => $validator->errors()
            ], 400);
        }

        $userDetails = User::where('user_id', $request->id)->first();
        if (!$userDetails) {
            $response = ['status' => 'error', 'message' => 'Invalid Id'];

            return response()->json($response, 200);
        } else {
            $response = [
                'status' => 'success', 'message' => 'User Details',
                'data' => $userDetails
            ];

            return response()->json($response, 200);
        }
    }

    public function update(Request $request)
    {
        $user = User::where('user_id', $request->id)->first();

        $user->first_name = $request->pass['first_name'];
        $user->last_name = $request->pass['last_name'];
        if ($request->pass['user_hash'] != '' &&
            $request->pass['user_hash']) {
            $user->user_hash = md5($request->pass['user_hash']);
            $user->user_hash_date = Carbon::now()->addMonths(3);
        }
        $user->email = $request->pass['email'];
        $user->company = $request->pass['company'];
        $user->state = $request->pass['state'];
        $user->save();

        $response = ['status' => 'success', 'message'
            => 'User Details Updated'];
            
        return response()->json($response, 200);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->attributes->get('user');

        $users = User::find($user->user_id);
        $users->user_hash = md5($request->password);
        $users->user_hash_date = Carbon::now()->addMonths(3);
        
        if ($users->save()) {
            return response()->json(['status' => 'success', 'message'
                => 'successfully your password updated, please login again']);
        } else {
            return response()->json(['status' => 'success', 'message'
                => 'password not saved'], 200);
        }
    }
    
}
