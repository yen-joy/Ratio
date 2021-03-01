<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRegistrationRequestsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('registration_requests', function(Blueprint $table)
		{
			$table->increments('registration_request_id');
			$table->integer('user_id')->unsigned()->nullable()->index('defdfd_idx');
			$table->string('first_name', 45)->nullable();
			$table->string('last_name', 45);
			$table->string('email', 60);
			$table->string('user_hash');
			$table->string('state');
			$table->string('company');
			$table->boolean('is_corporate')->nullable()->default(0);
			$table->boolean('natuzzi_access')->default(0);
			$table->boolean('editions_access')->default(0);
			$table->boolean('divanidivani_access')->default(0);
			$table->boolean('status')->default(0)->comment('0- onhold, 1- approved, 2- Rejected');
			$table->string('notes', 100)->nullable()->default('');
			$table->boolean('email_status')->default(0)->comment('0- deactive, 1- active');
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
		Schema::drop('registration_requests');
	}

}
