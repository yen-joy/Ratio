<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(AccessesTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        $this->call(ContentsTableSeeder::class);
        $this->call(ContentsCategoriesTableSeeder::class);
        $this->call(MediaTypesTableSeeder::class);
        $this->call(ContentsMediaTypesTableSeeder::class);
        $this->call(ContentsUsersTableSeeder::class);
        $this->call(DownloadsTableSeeder::class);
        $this->call(RegistrationRequestsTableSeeder::class);
        $this->call(UsersContentsTableSeeder::class);
    }
}
