<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCategoriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('categories', function(Blueprint $table)
		{
			$table->increments('category_id');
			$table->string('category_name', 45);
			$table->integer('parent_id')->unsigned()->nullable();
			$table->boolean('brand');
			$table->string('th_mime_type', 100)->nullable();
			$table->string('th_name')->nullable();
			$table->integer('th_size')->unsigned()->nullable();
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
		Schema::drop('categories');
	}

}
