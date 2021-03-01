<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function(Blueprint $table)
		{
			$table->increments('user_id');
			$table->string('first_name', 45)->nullable();
			$table->string('last_name', 45);
			$table->string('email', 60);
			$table->string('user_hash');
			$table->date('user_hash_date');
			$table->string('state');
			$table->string('company');
			$table->boolean('role')->default(2)->comment('1- Admin, 2- user');
			$table->boolean('read_only')->default(0)->comment('0- deactive, 1- active');
			$table->boolean('is_corporate')->nullable()->default(0);
			$table->boolean('natuzzi_access')->default(0);
			$table->boolean('editions_access')->default(0);
			$table->boolean('divanidivani_access')->default(0);
			$table->boolean('admin_natuzzi_access')->default(0);
			$table->boolean('admin_editions_access')->default(0);
			$table->boolean('admin_divanidivani_access')->default(0);
			$table->longText('access_country')->nullable();
			$table->boolean('enable')->default(0)->comment('0- disabled, 1- enabled');
			$table->string('notes', 100)->nullable();
			$table->boolean('email_status')->default(0)->comment('0- unverified, 1- verified');
			$table->string('remember_token', 100)->nullable();
			$table->timestamps();
			$table->integer('created_by')->unsigned()->default(0);
			$table->integer('updated_by')->unsigned()->default(0);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('users');
	}

}
