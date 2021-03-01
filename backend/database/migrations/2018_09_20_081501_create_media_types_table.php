<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMediaTypesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('media_types', function(Blueprint $table)
		{
			$table->increments('media_type_id');
			$table->string('media_type_name', 45);
			$table->timestamps();
			$table->integer('created_by')->unsigned();
			$table->integer('updated_by')->unsigned();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('media_types');
	}

}
