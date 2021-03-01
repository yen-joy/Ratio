<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToUsersContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users_contents', function(Blueprint $table)
		{
			$table->foreign('content_id', 'fk_content_users_contents')->references('content_id')->on('contents')->onUpdate('NO ACTION')->onDelete('NO ACTION');
			$table->foreign('user_id', 'fk_user_users_contents')->references('user_id')->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_contents', function(Blueprint $table)
		{
			$table->dropForeign('fk_content_users_contents');
			$table->dropForeign('fk_user_users_contents');
		});
    }
}
