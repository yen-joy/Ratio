<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AdminUserCreate extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user,$user_hash)
    {
        $this->user=$user;
        $this->user_hash=$user_hash;
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
        $Natuzzi = $this->user->natuzzi_access==1?'Natuzzi Access':'';
        $Editions = $this->user->editions_access==2?'Editions Access':'';
       
    return (new MailMessage)
                ->greeting('OBJECT: NATUZZI CMP - An account has been created for you')
                ->line('Dear '.$this->user->first_name.' '.$this->user->last_name.',')
                ->line('The Administrator has created for you an account to Natuzzi Marketing & Communication Platform.')
                ->line('Here follows the data of you new account.')
                ->line('NAME: '.$this->user->first_name)
                ->line('SURNAME: '.$this->user->last_name)
                ->line('COMPANY NAME: '.$this->user->company)    
                ->line('COUNTRY: '.$this->user->state)
                ->line('PASSWORD: '.$this->user_hash)
                ->line('Brand: '.$Natuzzi .' '.$Editions)          
                ->line($this->user->role==1?'USER ROLE: Admin':'USER ROLE: User')
                ->line($this->user->enable==1?'USER STATUS: Enabled':'USER STATUS: Disabled');
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
