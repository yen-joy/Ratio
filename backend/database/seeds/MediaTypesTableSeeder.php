<?php

use Illuminate\Database\Seeder;

class MediaTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('media_types')->delete();
        \DB::table('media_types')->insert(array (
            0 =>
                array (
                    'media_type_id' => 1,
                    'media_type_name' => 'Single page',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            1 =>
                array (
                    'media_type_id' => 2,
                    'media_type_name' => 'Double page',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            2 =>
                array (
                    'media_type_id' => 3,
                    'media_type_name' => 'Half page',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            3 =>
                array (
                    'media_type_id' => 4,
                    'media_type_name' => 'Card',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            4 =>
                array (
                    'media_type_id' => 5,
                    'media_type_name' => '6x3',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            5 =>
                array (
                    'media_type_id' => 6,
                    'media_type_name' => '100x140',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            6 =>
                array (
                    'media_type_id' => 7,
                    'media_type_name' => '3x2',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            7 =>
                array (
                    'media_type_id' => 8,
                    'media_type_name' => '8x3',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            8 =>
                array (
                    'media_type_id' => 9,
                    'media_type_name' => 'Window decal',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            9 =>
                array (
                    'media_type_id' => 10,
                    'media_type_name' => 'Table display',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            10 =>
                array (
                    'media_type_id' => 11,
                    'media_type_name' => 'Hang tag',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            11 =>
                array (
                    'media_type_id' => 12,
                    'media_type_name' => 'TV spot',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            12 =>
                array (
                    'media_type_id' => 13,
                    'media_type_name' => 'Technical video',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            13 =>
                array (
                    'media_type_id' => 14,
                    'media_type_name' => 'Radio spot',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            14 =>
                array (
                    'media_type_id' => 15,
                    'media_type_name' => 'Photo',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
            15 =>
                array (
                    'media_type_id' => 16,
                    'media_type_name' => 'Product Brochure',
                    'created_at' => '2018-09-21 02:00:00',
                    'updated_at' => '2018-09-21 00:00:00',
                    'created_by' => 0,
                    'updated_by' => 0,
                ),
        ));
        
        
        
    }
}