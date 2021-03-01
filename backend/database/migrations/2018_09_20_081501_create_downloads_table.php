<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateDownloadsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('downloads', function(Blueprint $table)
		{
			$table->increments('download_id');
			$table->integer('user_id')->unsigned()->index('fk_user_downloads_idx');
			$table->integer('content_id')->unsigned()->index('fk_content_downloads_idx');
			$table->dateTime('download_date');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('downloads');
	}

}
