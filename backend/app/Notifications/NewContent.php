<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Carbon\Carbon;

class NewContent extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user,$content)
    {
        $this->user=$user;
        $this->content=$content;
        $this->today = Carbon::now();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
       
        $url = env('FRONT_END_URL').'category/';
    return (new MailMessage)
                ->subject('New Content')
                ->greeting('OBJECT: NATUZZI CMP – A new content has been shared with you.')
                ->line('Dear '.$this->user->first_name.' '.$this->user->last_name.',')
                ->line('The Administrator has shared with you new contents.')
                ->line('-Media Name :'.$this->content->content_name)
                ->line('To view and download these media please follow this link')
                ->action('(link)', $url);     
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
