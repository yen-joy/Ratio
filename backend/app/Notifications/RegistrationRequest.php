<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class RegistrationRequest extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($registration,$pass)
    {
        $this->registration=$registration;
        $this->password = $pass;
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
        $url = env('FRONT_END_URL').'sign-in/'.encrypt($this->registration->registration_request_id,'!@#$%secret_key_salt!@#$%');

    return (new MailMessage)
                ->greeting('NATUZZI CMP – Please confirm your email')
                ->line('Dear '.$this->registration->first_name.' '.$this->registration->last_name.',')
                ->line('Thanks for your request. Here you have the user name and password you choose:')
                ->line('User name: '.$this->registration->email)
                ->line('Password: '.$this->password)              
                ->line('To validate your request, please confirm your email address clicking on the following link:')
                ->action('click here', $url)
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
