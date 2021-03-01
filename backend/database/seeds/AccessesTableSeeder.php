<?php

use Illuminate\Database\Seeder;

class AccessesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('accesses')->delete();
        
        \DB::table('accesses')->insert(array (
            0 => 
            array (
                'access_id' => 1,
                'user_id' => 1,
                'access_date' => '2018-09-26 00:00:00',
            ),
            1 => 
            array (
                'access_id' => 2,
                'user_id' => 3,
                'access_date' => '2018-09-26 00:30:00',
            ),
            2 => 
            array (
                'access_id' => 3,
                'user_id' => 1,
                'access_date' => '2018-09-26 00:00:00',
            ),
            3 => 
            array (
                'access_id' => 4,
                'user_id' => 3,
                'access_date' => '2018-09-26 10:00:00',
            ),
            4 => 
            array (
                'access_id' => 5,
                'user_id' => 1,
                'access_date' => '2018-09-26 14:42:04',
            ),
            5 => 
            array (
                'access_id' => 6,
                'user_id' => 3,
                'access_date' => '2018-09-26 15:19:23',
            ),
        ));
        
        
    }
}