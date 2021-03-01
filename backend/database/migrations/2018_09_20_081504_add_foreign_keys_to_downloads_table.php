<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToDownloadsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('downloads', function(Blueprint $table)
		{
			$table->foreign('content_id', 'fk_content_downloads')->references('content_id')->on('contents')->onUpdate('NO ACTION')->onDelete('NO ACTION');
			$table->foreign('user_id', 'fk_user_downloads')->references('user_id')->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('downloads', function(Blueprint $table)
		{
			$table->dropForeign('fk_content_downloads');
			$table->dropForeign('fk_user_downloads');
		});
	}

}
