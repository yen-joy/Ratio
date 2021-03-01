<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Carbon\Carbon;

class DownloadsExport implements FromCollection, WithHeadings, 
    WithMapping, WithColumnFormatting
{
    use Exportable;

    public function __construct(
        $query,
        $userTimeZone)
    {       
        $this->query = $query;
        $this->userTimeZone = $userTimeZone; 
    }

    public function headings(): array
    {
        return [
            'User Name',
            'User Surname',
            'Email',
            'Content',            
            'Download date',
        ];
    }

    public function map($download): array
    {
        return [
            $download->first_name,
            $download->last_name,
            $download->email,           
            $download->content_name,            
            Date::dateTimeToExcel(Carbon::parse($download->download_date)
                ->setTimezone($this->userTimeZone))
        ];
    }

    public function columnFormats(): array
    {
        return [            
            'E' => 'yyyy-mm-dd hh:mm:ss',
        ];
    }

    public function collection()
    {
        return $this->query->get();
    }    

}