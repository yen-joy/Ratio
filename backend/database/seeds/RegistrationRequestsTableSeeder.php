<?php

use Illuminate\Database\Seeder;

class RegistrationRequestsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('registration_requests')->delete();
        
        \DB::table('registration_requests')->insert(array (
            0 => 
            array (
                'registration_request_id' => 1,
                'user_id' => NULL,
                'first_name' => 'Guna',
                'last_name' => 'Sekaran',
                'email' => 'gunasekarn@gmail.com',
                'user_hash' => 'e6e061838856bf47e1de730719fb2609',
                'state' => 'AF',
                'company' => 'Colan',
                'is_corporate' => 0,
                'natuzzi_access' => 1,
                'editions_access' => 1,
                'divanidivani_access' => 0,
                'status' => 0,
                'notes' => 'asdgfdsgdsg  sdgdsgds asdfdsf',
                'email_status' => 0,
                'created_at' => '2018-09-20 07:53:57',
                'updated_at' => '2018-09-20 07:53:57',
                'created_by' => 0,
                'updated_by' => 0,
            ),
            1 => 
            array (
                'registration_request_id' => 2,
                'user_id' => NULL,
                'first_name' => 'Guna',
                'last_name' => 'Sekaran',
                'email' => 'gunasekarn@colanonline.com',
                'user_hash' => 'e6e061838856bf47e1de730719fb2609',
                'state' => 'AF',
                'company' => 'Colan',
                'is_corporate' => 0,
                'natuzzi_access' => 1,
                'editions_access' => 1,
                'divanidivani_access' => 0,
                'status' => 0,
                'notes' => 'asdgfdsgdsg  sdgdsgds asdfdsf',
                'email_status' => 0,
                'created_at' => '2018-09-20 09:37:24',
                'updated_at' => '2018-09-20 09:37:24',
                'created_by' => 0,
                'updated_by' => 0,
            ),
            2 => 
            array (
                'registration_request_id' => 3,
                'user_id' => NULL,
                'first_name' => 'Guna',
                'last_name' => 'Sekaran',
                'email' => 'guna@colanonline.com',
                'user_hash' => '$2y$10$tfgsxdZKCp3i6F3p07AJ9uVYBblO6FB1tm0NGRoV75HYKGhwphOV6',
                'state' => 'AF',
                'company' => 'Colan',
                'is_corporate' => 0,
                'natuzzi_access' => 1,
                'editions_access' => 1,
                'divanidivani_access' => 0,
                'status' => 0,
                'notes' => 'asdgfdsgdsg  sdgdsgds asdfdsf',
                'email_status' => 0,
                'created_at' => '2018-09-20 09:47:40',
                'updated_at' => '2018-09-20 09:47:40',
                'created_by' => 0,
                'updated_by' => 0,
            ),
        ));
        
        
    }
}