<?php

namespace App\Http\Controllers;

use App\MediaType;
use Illuminate\Http\Request;

class MediaTypeController extends Controller
{
    public function list(Request $request)
    {
        $page_size = $request->input('page_size');
        $sort = $request->has('sort') ? $request->input('sort') : null;    

        // base query
        $query = MediaType::select('*');
        
        // sort
        if ($sort !== null) {
            $query = $query->orderBy($sort["prop"], $sort["dir"]);
        }

        $data = $query->paginate($page_size);

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }

    public function all()
    {
        $data = MediaType::get();

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }    

    public function save(Request $request)
    {
        $type_id = $request->input('media_type_id');
        $data = MediaType::firstOrNew(['media_type_id' => $type_id]);
        $data->media_type_name = $request->input('media_type_name');
        $data->created_by = 1;
        $data->updated_by = 1;

        $data->save();
        $msg = ($type_id) ? 'Media type Updated Succesfully '
            : 'Media type Created Succesfully';

        return response()->json(['status' => 'success', 'message'
            => $msg, 'data' => $data]);
    }
    
    public function delete(Request $request)
    {
        MediaType::whereIn("media_type_id", $request->all())->delete();
        
        return response()->json(['status' => 'success', 'message'
            => 'Mediatype Deleted Successfully'], 200);
    }
}
