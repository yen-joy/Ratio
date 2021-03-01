<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateContentsMediaTypesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('contents_media_types', function(Blueprint $table)
		{
			$table->integer('content_id')->unsigned();
			$table->integer('media_type_id')->unsigned()->index('fk_media_type_contents_media_types_idx');
			$table->primary(['content_id','media_type_id']);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('contents_media_types');
	}

}
