<?php

use Illuminate\Database\Seeder;

class ContentsUsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('contents_users')->delete();
        
        \DB::table('contents_users')->insert(array (
            0 => 
            array (
                'content_id' => 7,
                'user_id' => 5,
            ),
            1 => 
            array (
                'content_id' => 22,
                'user_id' => 5,
            ),
            2 => 
            array (
                'content_id' => 24,
                'user_id' => 5,
            ),
            3 => 
            array (
                'content_id' => 25,
                'user_id' => 5,
            ),
            4 =>
                array (
                    'content_id' => 26,
                    'user_id' => 5,
                ),
            5 =>
                array (
                    'content_id' => 27,
                    'user_id' => 5,
                ),
            6 =>
                array (
                    'content_id' => 28,
                    'user_id' => 5,
                ),
            7 =>
                array (
                    'content_id' => 13,
                    'user_id' => 6,
                ),
            8 =>
                array (
                    'content_id' => 17,
                    'user_id' => 6,
                ),
            9 =>
                array (
                    'content_id' => 20,
                    'user_id' => 6,
                ),

        ));
        
        
    }
}