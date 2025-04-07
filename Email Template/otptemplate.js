export const otpTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; box-sizing: border-box; display: flex; justify-content: center; align-items: center; height: 100vh; max-width: 100vw;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: #333;">Verify Your OTP</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.5;"> OTP is valid for only 2 minutes.</p>
        <span style="font-size:24px;">{otp}</span>
        <div style="margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">&copy; 2025 Your Company. All rights reserved.</div>
    </div>
</body>
</html>
`;
