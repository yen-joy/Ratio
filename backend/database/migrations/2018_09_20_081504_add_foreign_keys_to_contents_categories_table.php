<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToContentsCategoriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('contents_categories', function(Blueprint $table)
		{
			$table->foreign('category_id', 'fk_category_contents_categories')->references('category_id')->on('categories')->onUpdate('NO ACTION')->onDelete('NO ACTION');
			$table->foreign('content_id', 'fk_content_contents_categories')->references('content_id')->on('contents')->onUpdate('NO ACTION')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('contents_categories', function(Blueprint $table)
		{
			$table->dropForeign('fk_category_contents_categories');
			$table->dropForeign('fk_content_contents_categories');
		});
	}

}
