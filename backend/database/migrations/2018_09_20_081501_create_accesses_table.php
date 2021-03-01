<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAccessesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('accesses', function(Blueprint $table)
		{
			$table->increments('access_id');
			$table->integer('user_id')->unsigned()->index('fk_user_accesses_idx');
			$table->dateTime('access_date');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('accesses');
	}

}
