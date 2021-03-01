<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'user_id' => 1,
                'first_name' => 'Guna',
                'last_name' => 'Sekaran',
                'email' => 'admin@admin.com',
                'user_hash' => 'e6e061838856bf47e1de730719fb2609',
                'user_hash_date' => '2018-09-20 11:24:27',
                'state' => 'AF',
                'company' => 'Colan',
                'role' => 1,
                'is_corporate' => 1,
                'natuzzi_access' => 1,
                'editions_access' => 1,
                'divanidivani_access' => 0,
                'enable' => 0,
                'notes' => 'asdgfdsgdsg  sdgdsgds asdfdsf',
                'email_status' => 0,
                'remember_token' => NULL,
                'created_at' => '2018-09-20 11:19:43',
                'updated_at' => '2018-09-20 11:19:43',
                'created_by' => 0,
                'updated_by' => 0,
            ),
            1 => 
            array (
                'user_id' => 3,
                'first_name' => 'Guna',
                'last_name' => 'Sekaran',
                'email' => 'guna@admin.com',
                'user_hash' => '0433fbc756a787652d815bc4428dd896',
                'user_hash_date' => '2018-09-20 11:24:27',
                'state' => 'AF',
                'company' => 'Colan',
                'role' => 2,
                'is_corporate' => 0,
                'natuzzi_access' => 1,
                'editions_access' => 0,
                'divanidivani_access' => 0,
                'enable' => 0,
                'notes' => 'asdgfdsgdsg  sdgdsgds asdfdsf',
                'email_status' => 0,
                'remember_token' => NULL,
                'created_at' => '2018-09-20 11:24:27',
                'updated_at' => '2018-09-20 11:24:27',
                'created_by' => 0,
                'updated_by' => 0,
            ),
            2 => array (
                'user_id' => 4,
                'first_name' => 'Admin',
                'last_name' => 'Natuzzi',
                'email' => 'admin@natuzzi.com',
                'user_hash' => md5('admin123'),
                'user_hash_date' => '2018-09-20 11:24:27',
                'state' => 'IT',
                'company' => 'Natuzzi',
                'role' => 1,
                'is_corporate' => 1,
                'natuzzi_access' => 1,
                'editions_access' => 1,
                'divanidivani_access' => 0,
                'enable' => 1,
                'notes' => '',
                'email_status' => 1,
                'remember_token' => NULL,
                'created_at' => '2018-09-20 11:24:27',
                'updated_at' => '2018-09-20 11:24:27',
                'created_by' => 0,
                'updated_by' => 0,
            ),
            3 => array (
                'user_id' => 5,
                'first_name' => 'Italia',
                'last_name' => 'Natuzzi',
                'email' => 'italia@natuzzi.com',
                'user_hash' => md5('italia123'),
                'user_hash_date' => '2018-09-20 11:24:27',
                'state' => 'IT',
                'company' => 'Natuzzi',
                'role' => 2,
                'is_corporate' => 0,
                'natuzzi_access' => 1,
                'editions_access' => 0,
                'divanidivani_access' => 0,
                'enable' => 1,
                'notes' => '',
                'email_status' => 1,
                'remember_token' => NULL,
                'created_at' => '2018-09-20 11:24:27',
                'updated_at' => '2018-09-20 11:24:27',
                'created_by' => 0,
                'updated_by' => 0,
            ),
            4 => array (
                'user_id' => 6,
                'first_name' => 'Editions',
                'last_name' => 'Natuzzi',
                'email' => 'editions@natuzzi.com',
                'user_hash' => md5('editions123'),
                'user_hash_date' => '2018-09-20 11:24:27',
                'state' => 'IT',
                'company' => 'Natuzzi',
                'role' => 2,
                'is_corporate' => 0,
                'natuzzi_access' => 0,
                'editions_access' => 1,
                'divanidivani_access' => 0,
                'enable' => 1,
                'notes' => '',
                'email_status' => 1,
                'remember_token' => NULL,
                'created_at' => '2018-09-20 11:24:27',
                'updated_at' => '2018-09-20 11:24:27',
                'created_by' => 0,
                'updated_by' => 0,
            ),
        ));
        
        
    }
}