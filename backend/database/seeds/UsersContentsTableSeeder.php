<?php

use Illuminate\Database\Seeder;

class UsersContentsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users_contents')->delete();
        
        \DB::table('users_contents')->insert(array (
            0 => 
            array (
                'content_id' => 2,
                'user_id' => 3,
            ),
            1 => 
            array (
                'content_id' => 4,
                'user_id' => 1,
            ),
            2 => 
            array (
                'content_id' => 8,
                'user_id' => 1,
            ),
            3 => 
            array (
                'content_id' => 8,
                'user_id' => 3,
            ),
        ));
        
        
    }
}