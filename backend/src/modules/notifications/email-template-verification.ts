interface EmailVerificationProps {
  userName: string;
  otp: string;
  expiresInMinutes: number;
}

export const getEmailVerificationHtml = ({
  userName,
  otp,
  expiresInMinutes,
}: EmailVerificationProps): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color:#f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f5;">
    <tr>
      <td style="padding:32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:28px 32px; text-align:center; background:linear-gradient(135deg,#0ea5e9,#2563eb); border-radius:12px 12px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">CampusOR</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Confirm your email to finish signup</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 12px; color:#0f172a; font-size:16px;">Hi ${userName || "there"},</p>
              <p style="margin:0 0 18px; color:#334155; font-size:15px; line-height:1.6;">
                Use the code below to verify your email address. This code expires in ${expiresInMinutes} minutes.
              </p>
              <div style="display:flex; align-items:center; justify-content:center; margin:24px 0;">
                <div style="font-size:30px; letter-spacing:12px; font-weight:700; color:#0ea5e9; background:#e0f2fe; border:1px solid #bae6fd; padding:16px 20px; border-radius:10px;">
                  ${otp}
                </div>
              </div>
              <p style="margin:0 0 12px; color:#334155; font-size:14px; line-height:1.6;">
                If you did not request this, you can safely ignore this email.
              </p>
              <p style="margin:0; color:#94a3b8; font-size:12px;">Need help? Reply to this email and we will assist you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px; background:#f8fafc; border-radius:0 0 12px 12px; text-align:center;">
              <p style="margin:0; color:#94a3b8; font-size:12px;">© ${new Date().getFullYear()} CampusOR</p>
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

export const getEmailVerificationText = ({
  userName,
  otp,
  expiresInMinutes,
}: EmailVerificationProps): string => {
  return `
CampusOR - Verify your email

Hi ${userName || "there"},

Use this code to verify your email address: ${otp}
The code expires in ${expiresInMinutes} minutes.

If you did not request this, you can ignore this email.

© ${new Date().getFullYear()} CampusOR
  `;
};
