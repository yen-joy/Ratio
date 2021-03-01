<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToContentsMediaTypesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('contents_media_types', function(Blueprint $table)
		{
			$table->foreign('content_id', 'fk_content_contents_media_types')->references('content_id')->on('contents')->onUpdate('NO ACTION')->onDelete('NO ACTION');
			$table->foreign('media_type_id', 'fk_media_type_contents_media_types')->references('media_type_id')->on('media_types')->onUpdate('NO ACTION')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('contents_media_types', function(Blueprint $table)
		{
			$table->dropForeign('fk_content_contents_media_types');
			$table->dropForeign('fk_media_type_contents_media_types');
		});
	}

}
