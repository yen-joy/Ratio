<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateContentsCategoriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('contents_categories', function(Blueprint $table)
		{
			$table->integer('content_id')->unsigned();
			$table->integer('category_id')->unsigned()->index('fk_category_contents_categories_idx');
			$table->primary(['content_id','category_id']);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('contents_categories');
	}

}
