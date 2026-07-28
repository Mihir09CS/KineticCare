export const resetPasswordTemplate = ({ name, resetUrl }) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>KineticCare Password Reset</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,0.08);
">

<!-- Header -->

<tr>
<td
style="
background:#2563eb;
padding:30px;
text-align:center;
color:white;
">

<h1 style="margin:0;">
KineticCare
</h1>

<p style="margin-top:8px;">
Smart Senior Wellness Platform
</p>

</td>
</tr>

<!-- Body -->

<tr>
<td style="padding:40px;">

<h2>Hello ${name}, 👋</h2>

<p>
We received a request to reset your password.
</p>

<p>
Click the button below to create a new password.
</p>

<div style="text-align:center;margin:40px 0;">

<a
href="${resetUrl}"
style="
background:#2563eb;
color:white;
padding:15px 35px;
text-decoration:none;
font-size:16px;
border-radius:8px;
display:inline-block;
font-weight:bold;
">

Reset Password

</a>

</div>

<p>
This password reset link is valid for
<strong>15 minutes</strong>.
</p>

<p>
If you didn't request this password reset,
you can safely ignore this email.
</p>

<hr>

<p style="font-size:13px;color:#777;">
If the button doesn't work, copy and paste this URL into your browser:
</p>

<p style="
word-break:break-all;
font-size:13px;
color:#2563eb;
">
${resetUrl}
</p>

</td>
</tr>

<!-- Footer -->

<tr>

<td
style="
background:#f8fafc;
padding:25px;
text-align:center;
font-size:13px;
color:#666;
">

<p style="margin:0;">
© ${new Date().getFullYear()} KineticCare
</p>

<p style="margin-top:8px;">
This is an automated email. Please do not reply.
</p>

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
