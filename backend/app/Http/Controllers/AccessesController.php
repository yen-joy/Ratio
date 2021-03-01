<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exports\AccessesExport;
use App\Services\AccessesService;

class AccessesController extends Controller
{
    public function list(Request $request, 
        AccessesService $accessesService)
    {
        $page_size = $request->input('page_size');
        
        $data = $accessesService->getQuery($request)
            ->paginate($page_size);
        
        return response()->json(['status' => 'success', 
            'message' => 'contents listed success', 'data' => $data]);
    }    

    public function export(Request $request, 
        AccessesService $accessesService)
    {
        $userTimeZone = $request->attributes->get('userTimeZone');
        $query = $accessesService->getQuery($request);
        
        return (new AccessesExport($query, 
            $userTimeZone))->download('accesses.xlsx');
    }    
}
