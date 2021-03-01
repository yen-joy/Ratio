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

class AccessesExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithColumnFormatting
{
    use Exportable;

    public function __construct(
        $query,
        $userTimeZone
    ) {
        $this->query = $query;
        $this->userTimeZone = $userTimeZone;        
    }

    public function headings() : array
    {
        return [
            'User Name',
            'User Surname',
            'Email',
            'Access date',
        ];
    }

    public function map($access) : array
    {
        return [
            $access->first_name,
            $access->last_name,
            $access->email,
            Date::dateTimeToExcel(Carbon::parse($access->access_date)
                ->setTimezone($this->userTimeZone))
        ];
    }

    public function columnFormats() : array
    {
        return [
            'D' => 'yyyy-mm-dd hh:mm:ss',
        ];
    }

    public function collection()
    {
        return $this->query->get();       
    }
}