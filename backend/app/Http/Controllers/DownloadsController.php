<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\DownloadsExport;
use App\Services\DownloadsService;

class DownloadsController extends Controller
{
    public function list(Request $request, DownloadsService $downloadsService)
    {        
        $page_size = $request->input('page_size');
        
        $data = $downloadsService->getQuery($request)->paginate($page_size);        
                
        return response()->json(['status' => 'success', 'message' 
            => 'contents listed success', 'data' => $data]);
    }
   
    public function export(Request $request, 
        DownloadsService $downloadsService) 
    {        
        $userTimeZone = $request->attributes->get('userTimeZone');

        $query = $downloadsService->getQuery($request);     
        
        return (new DownloadsExport($query, $userTimeZone))
            ->download('downloads.xlsx');
    }    
}
