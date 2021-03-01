<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AdminUserUpdate extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user=$user;
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
       
    return (new MailMessage)
                ->greeting('OBJECT: NATUZZI CMP - Some data IN YOUR ACCOUNT has been changed')
                ->line('Dear '.$this->user->first_name.' & '.$this->user->last_name.',')
                ->line('The Administrator has changed the following data related to your account:')
                ->line('NAME: '.$this->user->first_name)
                ->line('SURNAME: '.$this->user->last_name)
                ->line('COMPANY NAME: '.$this->user->company)    
                ->line('COUNTRY: '.$this->user->state)
                ->line('PASSWORD: #############')
                ->line((($this->user->natuzzi_access)==1)?'Brand:  Natuzzi Access':''.' '.(($this->user->editions_access)==2)?'Brand: Editions Access':'')          
                ->line(($this->user->state)==1?'USER ROLE: Admin':'USER ROLE: User')
                ->line(($this->user->enable)==1?'USER STATUS: Enabled':'USER STATUS: Disabled');
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
