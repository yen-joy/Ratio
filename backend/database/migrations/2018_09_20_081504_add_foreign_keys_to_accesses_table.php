<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToAccessesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('accesses', function(Blueprint $table)
		{
			$table->foreign('user_id', 'fk_user_accesses')->references('user_id')->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('accesses', function(Blueprint $table)
		{
			$table->dropForeign('fk_user_accesses');
		});
	}

}
