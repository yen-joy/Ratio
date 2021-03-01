<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Carbon\Carbon;

class RegistrationRequestAllAdmin extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($admin,$registration)
    {
        $this->admin=$admin;
        $this->registration=$registration;
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
       
        $url = env('FRONT_END_URL').'mng-requests/';
    return (new MailMessage)
                ->subject('Registration Request')
                ->greeting('OBJECT: NATUZZI CMP – New Registration Request')
                ->line('Dear '.$this->admin->first_name.' '.$this->admin->last_name.',')
                ->line('A new registration request is waiting to be reviewed by you with the following details:')
                ->line('NAME: '.$this->registration->first_name)
                ->line('SURNAME: '.$this->registration->last_name)
                ->line('COMPANY NAME: '.$this->registration->company)    
                ->line('COUNTRY: '.$this->registration->state)
                ->line('Requested Brand: '.(($this->registration->natuzzi_access)==1)?'natuzzi_access':''.' '.(($this->registration->editions_access)==2)?'editions_access':'')          
                ->line('Privacy accepted: Yes')
                ->line('Date of this request: '.$this->today)
                ->line('To manage the request, please click on the following link:')
                ->action('(link to log-in)', $url);     
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
