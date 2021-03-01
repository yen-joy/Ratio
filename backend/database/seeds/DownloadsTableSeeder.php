<?php

use Illuminate\Database\Seeder;

class DownloadsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('downloads')->delete();
        
        \DB::table('downloads')->insert(array (
            0 => 
            array (
                'download_id' => 1,
                'user_id' => 1,
                'content_id' => 1,
                'download_date' => '2018-09-25 00:00:00',
            ),
            1 => 
            array (
                'download_id' => 2,
                'user_id' => 3,
                'content_id' => 5,
                'download_date' => '2018-09-26 00:00:00',
            ),
            2 => 
            array (
                'download_id' => 3,
                'user_id' => 3,
                'content_id' => 6,
                'download_date' => '2018-09-27 00:00:00',
            ),
        ));
        
        
    }
}