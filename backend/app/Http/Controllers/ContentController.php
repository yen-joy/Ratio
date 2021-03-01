<?php

namespace App\Http\Controllers;

use App\Content;
use App\ContentsUser;
use App\UserContents;
use App\ContentsCategory;
use App\ContentsMediaTypes;
use App\Category;
use App\User;
use App\Download;
use Storage;
use App\MediaType;
use ZipArchive;
use File;
use App\Notifications\NewContent as NC;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentController extends Controller
{
    public function list(Request $request)
    {
        $user = $request->attributes->get('user');

        $page_size = $request->input('page_size');
        $brand_id = $request->has('brand_id') ?
            $request->input('brand_id') : null;
        $category_id = $request->has('category_id') ?
            $request->input('category_id') : null;
        $searchContents = $request->has('searchContents') ?
            $request->input('searchContents') : null;
        $privateContents = $request->has('privateContents') ?
            $request->input('privateContents') : null;
        $sort = $request->has('sort') ? $request->input('sort') : null;

        if ($privateContents === true) {
            $query = Content::where('private_content', 1);
        } else {
            if ($brand_id !== null) {
                if ($category_id === null) {
                    $category_ids = Category::where('brand', $brand_id)
                        ->pluck('category_id');
                    $content_ids = ContentsCategory::whereIn(
                        'category_id',
                        $category_ids
                    )->pluck('content_id');
                } else {
                    $content_ids = ContentsCategory::where(
                        'category_id',
                        $category_id
                    )->pluck('content_id');
                }

                $query = Content::whereIn('content_id', $content_ids);
            } else {
                $query = Content::select();
            }
        }

        if ($searchContents !== null) {
            $query = $query->where(
                'content_name',
                'LIKE',
                "%$searchContents%"
            );
        }

        // sort
        if ($sort !== null) {
            $query = $query->orderBy($sort["prop"], $sort["dir"]);
        }

        // order by created_at
        if ($sort === null || ($sort !== null 
            && $sort["prop"] !== 'created_at')) {
                $query = $query->orderBy('created_at', 'desc');
            }

        // paginate
        $data = $query->paginate($page_size);

        return response()->json(['status' => 'success', 'message'
            => 'All Contents List', 'data' => $data], 200);
    }

    public function search(Request $request)
    {
        $user = $request->attributes->get('user');

        DB::enableQueryLog();

        $searchText = $request->has('searchText') ?
            $request->input('searchText') : null;
        $mediaType = $request->has('mediaType') ?
            $request->input('mediaType') : null;

        $mediaTypes = null;
        if ($mediaType !== null) {
            $mediaTypes = explode(',', $mediaType);
        }

        $brands = null;
        if ($user->natuzzi_access) {
            $brands[] = 1;
        }
        if ($user->editions_access) {
            $brands[] = 2;
        }

        if ($searchText === null || $mediaTypes === null
            || count($brands) === 0) {
            return response()->json(['status' => 'error', 'message'
                => 'Insufficient parameters', 'data' => []], 401);
        }

        $category_ids = Category::whereIn('brand', $brands)
            ->pluck('category_id');
        $date = Carbon::now()->format('Y-m-d');

        $query1 = Content::join(
            'contents_media_types', 'contents.content_id', 
            '=', 'contents_media_types.content_id')
            ->join(
                'contents_categories', 'contents.content_id', 
                '=', 'contents_categories.content_id')
            ->whereIn('contents_media_types.media_type_id', $mediaTypes)
            ->whereIn('contents_categories.category_id', $category_ids)
            ->Where(function ($q) use ($date) {
                $q->whereRaw("'" . $date . "' >= `availability_date` and '"
                    . $date . "' <=  `expiration_date`");
                $q->orWhere(['availability_date' => '']);
                $q->orWhere(['expiration_date' => '']);
                $q->orWhere(['availability_date' => null]);
                $q->orWhere(['expiration_date' => null]);
            })->with('mediatype');

        $query2 = Content::join(
            'contents_media_types', 'contents.content_id', 
            '=', 'contents_media_types.content_id')
            ->join(
                'contents_users', 'contents.content_id', 
                '=', 'contents_users.content_id')
            ->whereIn('contents_media_types.media_type_id', $mediaTypes)
            ->Where('contents_users.user_id', $user->user_id)
            ->Where(function ($q) use ($date) {
                $q->whereRaw("'" . $date . "' >= `availability_date` and '"
                    . $date . "' <=  `expiration_date`");
                $q->orWhere(['availability_date' => '']);
                $q->orWhere(['expiration_date' => '']);
                $q->orWhere(['availability_date' => null]);
                $q->orWhere(['expiration_date' => null]);
            })->with('mediatype');         

        $data = $query1->union($query2)->get();        

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }    

    public function myCollection(Request $request)
    {
        $user = $request->attributes->get('user');

        $date = Carbon::now()->format('Y-m-d');
        $data = UserContents::where('user_id', $user->user_id)
            ->whereHas('content', function ($q) use ($date) {
                $q->whereRaw("'" . $date . "' >= `availability_date` and '"
                    . $date . "' <=  `expiration_date`");
                $q->orWhere(['availability_date' => '']);
                $q->orWhere(['expiration_date' => '']);
                $q->orWhere(['availability_date' => null]);
                $q->orWhere(['expiration_date' => null]);
            })->with('content')->get();

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }    

    public function addToMyCollection(Request $request)
    {
        $user = $request->attributes->get('user');

        $date = Carbon::now()->format('Y-m-d');
        UserContents::firstOrNew([
            'user_id' => $user->user_id,
            'content_id' => $request->content_id
        ])->save();
        $data = UserContents::where('user_id', $user->user_id)
            ->whereHas('content', function ($q) use ($date) {
                $q->whereRaw("'" . $date . "' >= `availability_date` and '"
                    . $date . "' <=  `expiration_date`");
                $q->orWhere(['availability_date' => '']);
                $q->orWhere(['expiration_date' => '']);
                $q->orWhere(['availability_date' => null]);
                $q->orWhere(['expiration_date' => null]);
            })->with('content')->get();

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }

    public function removeFromMyCollection(Request $request)
    {
        $user = $request->attributes->get('user');

        $date = Carbon::now()->format('Y-m-d');
        UserContents::Where(['user_id' => $user->user_id, 'content_id'
            => $request->content_id])->delete();
        $data = UserContents::where('user_id', $user->user_id)
            ->whereHas('content', function ($q) use ($date) {
                $q->whereRaw("'" . $date . "' >= `availability_date` and '"
                    . $date . "' <=  `expiration_date`");
                $q->orWhere(['availability_date' => '']);
                $q->orWhere(['expiration_date' => '']);
                $q->orWhere(['availability_date' => null]);
                $q->orWhere(['expiration_date' => null]);
            })->with('content')->get();

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }

    public function download(Request $request)
    {
        $user = $request->attributes->get('user');

        $content_ids = explode(',', $request->input('content_id'));
        $content = Content::whereIn('content_id', $content_ids)->get();

        $filePath = null;
        $filename = null;
        $deleteAfter = false;
        if (count($content) > 1) {
            $filename = uniqid() . '_bulk.zip';
            $filePath = storage_path('app/public/content/') . $filename;
            $deleteAfter = true;

            $zip = new ZipArchive;
            $overwriteZip = file_exists($filePath);
            if ($zip->open($filePath, $overwriteZip ? ZipArchive::OVERWRITE
                : ZipArchive::CREATE) == true) {
                $content->each(function ($c) use ($zip) {
                    $zip->addFile(
                        storage_path('app/public/content/') . $c->content_id,
                        $c->file_name
                    );
                });
                $zip->close();
            }
        } elseif (count($content) == 1) {
            $filename = $content[0]->file_name;
            $filePath = storage_path('app/public/content/')
                . $content[0]->content_id;
        }

        $content->each(function ($c) use ($user) {
            Download::create([
                'user_id' => $user->user_id,
                'content_id' => $c->content_id
            ]);
        });

        if (file_exists($filePath)) {
            return response()
                ->download($filePath, $filename)
                ->deleteFileAfterSend($deleteAfter);
        }

        return response()->json(['status' => 'error', 'message'
            => 'file not found']);
    }

    public function save(Request $request)
    {
        $user = $request->attributes->get('user');

        $mediaType = json_decode($request->mediaType);
        if ($request->has('content_id')) {
            $content = Content::firstOrNew(['content_id'
                => $request->content_id]);
        } else {
            $content = new Content;
        }
        $content->content_name = $request->content_name;
        $content->copyright = ($request->copyright == "true" ||
            $request->copyright == 1) ? 1 : 0;
        $content->private_content = $request->private_content;
        $content->availability_date = $request->availability_date;
        $content->expiration_date = $request->expiration_date;
        $content->notes = $request->notes;
        $content->created_by = $user->user_id;
        $content->updated_by = $user->user_id;

        if ($request->has('media_file') && $request->file('media_file')) {
            $m_file = $request->file('media_file');

            $content->file_mime_type = $m_file->getMimeType();
            $content->file_name = $m_file->getClientOriginalName();
            $content->file_size = $m_file->getSize();
        }

        if ($request->has('th_image') && $request->file('th_image')) {
            $th_file = $request->file('th_image');

            $content->th_mime_type = $th_file->getMimeType();
            $content->th_name = $th_file->getClientOriginalName();
            $content->th_size = $th_file->getSize();
        }

        $content->save();

        if ($request->has('media_file') && $request->file('media_file')) {
            Storage::putFileAs(
                '/public/content/',
                $m_file,
                $content->content_id
            );
        }

        if ($request->has('th_image') && $request->file('th_image')) {
            Storage::putFileAs(
                '/public/th_content/',
                $th_file,
                $content->content_id
            );
        }

        ContentsCategory::where("content_id", $content->content_id)->delete();
        ContentsMediaTypes::where(
            "content_id",
            $content->content_id
        )->delete();
        $old_users = ContentsUser::select('user_id')->where(
            "content_id",
            $content->content_id
        )->get();
        ContentsUser::where("content_id", $content->content_id)->delete();
        UserContents::where("content_id", $content->content_id)->delete();

        foreach ($mediaType as $key => $value) {
            ContentsMediaTypes::firstOrCreate([
                'content_id' => $content->content_id,
                'media_type_id' => $value->media_type_id
            ]);
        }

        if (isset($request->selectCategory)) {
            $selectCategory = explode(",", $request->selectCategory);
            foreach ($selectCategory as $key => $value) {
                ContentsCategory::firstOrCreate([
                    'content_id' => $content->content_id,
                    'category_id' => $value
                ]);
            }
        }

        if (isset($request->privateUser)) {
            $privateUser = explode(",", $request->privateUser);

            foreach ($privateUser as $key => $val) {
                if ($val != '') {
                    $user = user::find($val);
                    if (!$old_users->contains('user_id', $val)) {
                        $user->notify(new NC($user, $content));
                    }
                    ContentsUser::firstOrCreate([
                        'content_id' => $content->content_id,
                        'user_id' => $val
                    ]);
                }
            }
        }

        return response()->json(['status' => 'success', 'message'
            => 'Content Saved', 'data' => $content], 200);
    }    

    public function details(Request $request)
    {
        $media_types = [];
        $media_types['content'] = Content::where(
            'content_id',
            $request->content_id
        )->first();
        $contentMediaTypes = ContentsMediaTypes::where(
            'content_id',
            $request->content_id
        )->get();
        $ContentsUser = ContentsUser::where(
            'content_id',
            $request->content_id
        )->get();

        $ContentsCategory = ContentsCategory::where(
            'content_id',
            $request->content_id
        )->get();
        foreach ($contentMediaTypes as $key => $val) {
            $media_types['media_types'][] = MediaType::where(
                'media_type_id',
                $val->media_type_id
            )->first();
        }
        foreach ($ContentsUser as $key => $val) {
            $media_types['user'][] = User::where('user_id', $val->user_id)
                ->first();
        }
        foreach ($ContentsCategory as $key => $val) {
            $media_types['category'][] = Category::where(
                'category_id',
                $val->category_id
            )->first();
        }

        return response()->json(['status' => 'success', 'message'
            => 'content List', 'data' => $media_types], 200);
    }    

    public function delete(Request $request)
    {
        $content_ids = [];
        foreach ($request->all() as $key => $value) {
            $content_ids[] = $value['content_id'];     
            
            Storage::delete('/public/content/' . $value['content_id']);
            Storage::delete('/public/th_content/' . $value['content_id']);
        }

        Download::whereIn("content_id", $content_ids)->delete();
        ContentsCategory::whereIn("content_id", $content_ids)->delete();
        ContentsMediaTypes::whereIn("content_id", $content_ids)->delete();
        ContentsUser::whereIn("content_id", $content_ids)->delete();
        UserContents::whereIn("content_id", $content_ids)->delete();
        Content::whereIn("content_id", $content_ids)->delete();        

        return response()->json(['status' => 'success', 'message'
            => 'Content Deleted Successfully'], 200);
    }    
}
