<?php

namespace App\Services;

use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use App\Download;

class DownloadsService
{
    public function getQuery(Request $request) {
        $query = null;

        $user = $request->attributes->get('user');
        $user_id = $request->has('user_id') ? 
            $request->input('user_id') : null;
        $content_id = $request->has('content_id') ? 
            $request->input('content_id') : null;
        $brand_id = $request->has('brand_id') ? 
            $request->input('brand_id') : null;
        $category_id = $request->has('category_id') ? 
            $request->input('category_id') : null;
        $searchContents = $request->has('searchContents') ? 
            $request->input('searchContents') : null;
        $privateContents = $request->has('privateContents') ? 
            $request->input('privateContents') : null;
        $user_ids = $request->has('user_ids') ? 
            $request->input('user_ids') : null;          
        $sort = $request->has('sort') ? 
            $request->input('sort') : null;       
            
        // base query
        $query = Download
            ::join('users', 'users.user_id', '=', 'downloads.user_id')
            ->join('contents', 'contents.content_id', 
                '=', 'downloads.content_id');

        // complete query
        if ($user->role == 1) {
            // if private contents
            if ($privateContents === true) {
                $category_id = null;
            }

            // complete joins
            if ($brand_id !== null) {
                if ($category_id === null) {
                    $query = $query->join('contents_categories', 
                    'contents_categories.content_id', 
                    '=', 'downloads.content_id')
                    ->join('categories', 
                    'categories.category_id', 
                    '=', 'contents_categories.category_id');  
                } else {
                    $query = $query->join('contents_categories', 
                    'contents_categories.content_id', 
                    '=', 'downloads.content_id');       
                }
            }           
        }

        // select
        $query = $query->select('downloads.download_id as download_id',
            'users.first_name as first_name',
            'users.last_name as last_name',
            'users.email as email',
            'contents.content_name as content_name',            
            'downloads.download_date as download_date');

        // sort
        if ($sort !== null) {
            $query = $query->orderBy($sort["prop"], $sort["dir"]);
        }

        if ($user->role == 1) {           
            // add where
            if ($user_id !== null) {
                $query = $query->where('downloads.user_id', $user_id);
            }
            if ($content_id !== null) {
                $query = $query->where('contents.content_id', $content_id);
            }
            if ($brand_id !== null) {
                if ($category_id === null) {
                    $query = $query->where('categories.brand', $brand_id);
                } else {
                    $query = $query->where('contents_categories.category_id', 
                    $category_id);
                }
            }            
            if ($searchContents !== null) {
                $query = $query->where('contents.content_name', 
                    'LIKE', "%$searchContents%");
            }
            if ($privateContents === true) {
                $query = $query->where('contents.private_content', 
                    '=', 1);
            }
            if ($user_ids !== null) {
                $query = $query->whereIn('downloads.user_id', $user_ids);
            }
        } else {
            // add where
            $query = $query->where('downloads.user_id', $user->user_id);
            if ($content_id !== null) {
                $query = $query->where('contents.content_id', $content_id);
            }
        }

        return $query;
    }
}