<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['api']], function () {
    Route::get('version', 'ApiController@version');
    Route::post('register', 'ApiController@register');
    Route::post('register_email_validate', 'ApiController@register_email_validate');
    Route::post('login', 'ApiController@login');
    Route::post('reset', 'ApiController@reset');
    Route::get('registration_delete', 'ApiController@registration_delete');    

    Route::group(['middleware' => ['query-string-access', 'access']], function () {
        Route::post('accesses/list', 'AccessesController@list');
        Route::post('accesses/export', 'AccessesController@export');

        Route::get('category/childs/{id}', 'CategoryController@child');
        Route::post('category/delete', 'CategoryController@delete');
        Route::post('category/save', 'CategoryController@save');
        Route::get('category/brand/{brand?}', 'CategoryController@brand');
        Route::get('category/tree/{brand?}', 'CategoryController@tree');
        Route::get('category/details/{category?}', 'CategoryController@details');
        Route::get('category/image/{id}', 'CategoryController@image');

        Route::post('content/list', 'ContentController@list');
        Route::post('content/save', 'ContentController@save');
        Route::post('content/details', 'ContentController@details');
        Route::post('content/delete', 'ContentController@delete');
        Route::get('content/myCollection', 'ContentController@myCollection');
        Route::post('content/search', 'ContentController@search');
        Route::post('content/addToMyCollection', 'ContentController@addToMyCollection');
        Route::post('content/removeFromMyCollection', 'ContentController@removeFromMyCollection');
        Route::post('content/download', 'ContentController@download');

        Route::post('downloads/list', 'DownloadsController@list');
        Route::post('downloads/export', 'DownloadsController@export');

        Route::post('mediaType/list', 'MediaTypeController@list');
        Route::post('mediaType/delete', 'MediaTypeController@delete');
        Route::get('mediaType/all', 'MediaTypeController@all');
        Route::post('mediaType/save', 'MediaTypeController@save');

        Route::post('registration/list', 'RegistrationRequestController@list');
        Route::post('registration/save', 'RegistrationRequestController@save');
        Route::get('registration/count', 'RegistrationRequestController@count');
        Route::post('registration/delete', 'RegistrationRequestController@delete');

        Route::post('user/list', 'UserController@list');
        Route::post('user/filter', 'UserController@filter');
        Route::post('user/save', 'UserController@save');
        Route::post('user/details', 'UserController@details');
        Route::post('user/update', 'UserController@update');
        Route::post('user/updatePassword', 'UserController@updatePassword');
    });
});