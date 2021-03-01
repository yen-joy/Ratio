<?php

namespace App\Http\Controllers;

use App\Category;
use App\ContentsCategory;
use Illuminate\Http\Request;
use Storage;
use Carbon\Carbon;
use File;

class CategoryController extends Controller
{
    public function brand($brand = null)
    {
        $categories = Category::where(
            function ($query) {
                $query->where('parent_id', '=', 0)
                    ->orWhere('parent_id', '=', null);
            }
        )->with('childs')->with('content');
        if ($brand) {
            $categories->where('brand', '=', $brand);
        }
        $data['category'] = $categories->get();
        $data['medialist'] = [];

        return response()->json(['status' => 'success', 'message'
            => 'categories listed success', 'data' => $data]);
    }

    public function child($category_id)
    {
        $datachild = Category::where('category_id', $category_id)
            ->with('children')->get()->toArray();
        $data = array_values($this->all_child($datachild, array()));

        return response()->json(['status' => 'success', 'message'
            => 'categories listed success', 'data' => $data]);
    }   

    public function details($category = null)
    {
        $date = Carbon::now()->format('Y-m-d');
        $data['category'] = Category::where('parent_id', '=', $category)
            ->with('childs')->get();
        $data['parentcategory'] = Category::where(
            'category_id',
            '=',
            $category
        )->with('childs')->first();
        $parent = Category::where('category_id', '=', $category)
            ->with('parent')->first()->toArray();
        $parentarray = $this->parentloop($parent, array());
        $data['parent'] = array_reverse($parentarray);
        $data['medialist'] = ContentsCategory::where(
            'category_id',
            $category
        )->whereHas('content', function ($q) use ($date) {
            $q->whereRaw("'" . $date . "' >= `availability_date` and '" . $date
                . "' <=  `expiration_date`");
            $q->orWhere(['availability_date' => '']);
            $q->orWhere(['expiration_date' => '']);
            $q->orWhere(['availability_date' => null]);
            $q->orWhere(['expiration_date' => null]);
        })->with('content', 'categories')->get();

        return response()->json(['status' => 'success', 'message'
            => 'contents listed success', 'data' => $data]);
    }

    public function save(Request $request)
    {
        $user = $request->attributes->get('user');

        if ($request->has('category_id')) {
            $category = Category::firstOrNew(['category_id'
                => $request->category_id]);
        } else {
            $category = new Category;
        }

        // save image
        if ($request->has('imageFile') && $request->file('imageFile')) {
            $imageFile = $request['imageFile'];

            $category->th_mime_type = $imageFile->getMimeType();
            $category->th_name = $imageFile->getClientOriginalName();
            $category->th_size = $imageFile->getSize();
        }

        $category->category_name = $request->category_name;
        $category->parent_id = $request->has('parent_id')
            ? $request->parent_id : 0;
        $category->brand = $request->brand;
        $category->created_by = $user->user_id;
        $category->updated_by = $user->user_id;
        $category->save();    
        
        // save image
        if ($request->has('imageFile') && $request->file('imageFile')) {
            Storage::putFileAs(
                '/public/category/',
                $imageFile,
                $category->category_id
            );
        }

        return response()->json(['status' => 'success', 'message'
            => 'Category Saved'], 200);
    }    

    public function delete(Request $request)
    {
        $category_id = [];
        foreach ($request->all() as $key) {
            $category_id[] = $key['category_id'];

            Storage::delete('/public/category/' . $key['category_id']);
        }
        Category::whereIn("category_id", $category_id)->delete();

        return response()->json(['status' => 'success', 'message'
            => 'category Deleted Successfully'], 200);
    }
    
    public function tree(Request $request, $brand = null)
    {
        $user = $request->attributes->get('user');

        if ($user->role === 1 || ($user->natuzzi_access == 1
            && $user->editions_access == 1)) {
            $permission_brand = null;
        } else {
            if ($user->natuzzi_access == 1 && $user->editions_access == 0) {
                $permission_brand = 1;
            }
            if ($user->natuzzi_access == 0 && $user->editions_access == 1) {
                $permission_brand = 2;
            }
        }

        if ($brand == null) {
            $brand = $permission_brand;
        }

        $tree = [];

        if ($brand == null || $brand == $permission_brand
            || $permission_brand == null) {
            $tree = $this->all_categories($brand);
        }

        return response()->json(['status' => 'success', 'message'
            => 'category listed Successfully', 'data' => $tree], 200);
    }

    public function image(Request $request, $id)
    {
        $filePath = storage_path('app/public/category/' . $id);
        
        if (File::exists($filePath)) {
            return response()->file($filePath);            
        } else {
            return null;
        }
    }

    private function all_child($data, $array = [])
    {
        $categoriesArray = $array;
        foreach ($data as $category) {
            $categoriesArray[] = $category['category_id'];
            $new = $this->all_child($category['children'], $categoriesArray);
            $categoriesArray = array_merge($categoriesArray, $new);
        }

        return array_unique($categoriesArray);
    }

    private function all_categories($brand = null, $parent_id = 0, $string = '')
    {
        $categoriesArray = [];
        $categories = Category::select('category_id', 'category_name');
        $categories->where(
            function ($query) use ($parent_id) {
                $query->where('parent_id', '=', $parent_id);
                if ($parent_id == 0) {
                    $query->oRwhere('parent_id', '=', null);
                }
            }
        );
        if ($brand) {
            $categories->where('brand', '=', $brand);
        }
        $allCategories = $categories->get()->toArray();

        foreach ($allCategories as $category) {
            $c['category_id'] = $category['category_id'];
            $c['category_name'] = $category['category_name'];
            $c['view_category_name'] = $string . $category['category_name'];
            $categoriesArray[] = $c;
            foreach ($this->all_categories(
                $brand,
                $category['category_id'],
                $string . ' -  '
            ) as $d) {
                $categoriesArray[] = $d;
            }
        }

        return $categoriesArray;
    }

    private function parentloop($parent, $result)
    {
        $result[] = [
            'category_id' => $parent['category_id'],
            'category_name' => $parent['category_name']
        ];
        if ($parent['parent'] != null) {
            return $result[] = $this->parentloop($parent['parent'], $result);
        } else {
            return $result;
        }
    }

}
