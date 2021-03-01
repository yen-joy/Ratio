<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class EmailVerifiy extends Notification
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
        //$url = env('FRONT_END_URL').'sign-in/'.base64_encode(json_encode($this->registration));

    return (new MailMessage)
                ->subject('Email verified')
                ->greeting('NATUZZI CMP – Your email has been verified')
                ->line('Dear '.$this->registration->first_name.' '.$this->registration->last_name.',')
                ->line('Your email has been verified, your request will be managed by the Administrator and a notification will be sent to you.')
                ->line('Thank you ');
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
