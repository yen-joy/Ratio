<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateContentsUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('contents_users', function(Blueprint $table)
		{
			$table->integer('content_id')->unsigned();
			$table->integer('user_id')->unsigned()->index('fk_user_contents_users_idx');
			$table->primary(['content_id','user_id']);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('contents_users');
	}

}
