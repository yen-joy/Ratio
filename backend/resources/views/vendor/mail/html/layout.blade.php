<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>Natuzzi Marketing & Communication Platform</title>
</head>
<body>
<style>
        @media only screen and (max-width: 600px) {
            .inner-body {
                width: 100% !important;
            }

            .footer {
                width: 100% !important;
            }
        }

        @media only screen and (max-width: 500px) {
            .button {
                width: 100% !important;
            }
        }
    </style>
<table align="center" style="background: #fff;">
  <tr>
    <td>
<div style="width:80%; margin-left:auto;margin-right:auto; font-family:'Trebuchet MS', sans-serif;">
<!--EMAIL HEADER-->
 {{ $header or '' }}

<!--EMAIL HEADER ENDS-->

<!--EMAIL BODY-->
  <table width="100%">
    <tr>
      <td>
        <div style="padding:20px;">
			{{ Illuminate\Mail\Markdown::parse($slot) }}

			{{ $subcopy or '' }}
        </div>
      </td>
    </tr>
  </table>

<!-- EMAIL BODY ENDS-->

<!--EMAIL FOOTER -->
{{ $footer or '' }}
<!-- EMAIL FOOTER ENDS -->
</div>
    </td>
  </tr>
</table> 








</body>
</html>
