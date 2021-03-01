<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ApprovedEmail extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($registration)
    {
        $this->registration=$registration;
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
        $url = env('FRONT_END_URL').'sign-in/';
        $status = ($this->registration->status==1)?'Accepted':'Rejected';
        $msg = new MailMessage;
        $msg->subject('Account activation');
        $msg->greeting('NATUZZI CMP – Your request has been '.$status);
        $msg->line('Dear '.$this->registration->first_name.' '.$this->registration->last_name.',');
        if($this->registration->status==1){
        $msg->line('Your request has been '.$status.' and your account on NATUZZI CMP is now '.$status.'.');
        $msg->line('You can log-in and browse all media contents. ');
        $msg->action('(link to log-in)', $url);
        }
                return $msg;
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
