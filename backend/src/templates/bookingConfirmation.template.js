export const bookingConfirmationTemplate = ({
  name,
  serviceName,
  date,
  startTime,
  endTime,
  bookingId,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>KineticCare Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td style="background:#16a34a;padding:30px;text-align:center;color:white;">
<h1 style="margin:0;font-size:26px;">Booking Confirmed! 🎉</h1>
<p style="margin-top:8px;font-size:14px;opacity:0.9;">KineticCare Smart Senior Wellness</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">
<h2 style="color:#1e293b;margin-top:0;">Hello ${name}, 👋</h2>
<p style="color:#475569;font-size:16px;line-height:1.6;">
Your appointment has been successfully booked. Here are your booking details:
</p>

<table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin:25px 0;border:1px solid #e2e8f0;">
<tr>
<td style="color:#64748b;font-weight:bold;width:35%;">Booking Reference:</td>
<td style="color:#0f172a;font-family:monospace;font-weight:bold;">${bookingId}</td>
</tr>
<tr>
<td style="color:#64748b;font-weight:bold;">Service:</td>
<td style="color:#0f172a;font-weight:bold;">${serviceName}</td>
</tr>
<tr>
<td style="color:#64748b;font-weight:bold;">Date:</td>
<td style="color:#0f172a;">${date}</td>
</tr>
<tr>
<td style="color:#64748b;font-weight:bold;">Time Slot:</td>
<td style="color:#0f172a;">${startTime} - ${endTime}</td>
</tr>
</table>

<p style="color:#475569;font-size:15px;line-height:1.6;">
Please arrive 10 minutes prior to your scheduled appointment. If you need to reschedule or cancel, you can manage your bookings through your KineticCare dashboard.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8fafc;padding:25px;text-align:center;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">
<p style="margin:0;">© ${new Date().getFullYear()} KineticCare. All rights reserved.</p>
<p style="margin-top:8px;">This is an automated notification. Please do not reply directly.</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};
