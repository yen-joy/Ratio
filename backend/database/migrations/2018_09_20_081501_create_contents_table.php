<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateContentsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('contents', function(Blueprint $table)
		{
			$table->increments('content_id');
			$table->string('content_name', 100);
			$table->string('file_mime_type', 100)->nullable();
			$table->string('file_name')->nullable();
			$table->integer('file_size')->unsigned()->nullable();
			$table->string('th_mime_type', 100)->nullable();
			$table->string('th_name')->nullable();
			$table->integer('th_size')->unsigned()->nullable();
			$table->boolean('copyright')->default(0);
			$table->boolean('private_content')->default(0);
			$table->date('availability_date')->nullable();
			$table->date('expiration_date')->nullable();
			$table->string('notes', 200)->nullable();
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
		Schema::drop('contents');
	}

}
