<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToRegistrationRequestsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('registration_requests', function(Blueprint $table)
		{
			$table->foreign('user_id', 'fk_user_registration_request')->references('user_id')->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('registration_requests', function(Blueprint $table)
		{
			$table->dropForeign('fk_user_registration_request');
		});
	}

}
