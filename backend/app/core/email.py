import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # For demo purposes, we'll just log emails instead of sending them
        # In production, you'd configure SMTP settings
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.smtp_username = None  # Set in production
        self.smtp_password = None  # Set in production
        
    def send_password_reset_email(self, email: str, reset_token: str, reset_url: str):
        """Send password reset email"""
        try:
            subject = "Password Reset - Secure Password Vault"
            
            html_body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🔐 Password Reset</h1>
                </div>
                
                <div style="padding: 30px; background-color: #f8f9fa;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p style="color: #666; line-height: 1.6;">
                        You requested a password reset for your Secure Password Vault account.
                        Click the button below to reset your password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}?token={reset_token}" 
                           style="background: #3b82f6; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        <strong>Security Note:</strong> This link will expire in 1 hour for your security.
                        If you didn't request this reset, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Built by Adi with 💕<br>
                        Secure Password Vault
                    </p>
                </div>
            </body>
            </html>
            """
            
            # For demo purposes, just log the email content
            logger.info(f"Password reset email for {email}:")
            logger.info(f"Reset URL: {reset_url}?token={reset_token}")
            
            # In production, you would send the actual email:
            # self._send_email(email, subject, html_body)
            
            print(f"\n🔐 PASSWORD RESET EMAIL (Demo Mode)")
            print(f"📧 To: {email}")
            print(f"🔗 Reset Link: {reset_url}?token={reset_token}")
            print(f"⏰ This link expires in 1 hour\n")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to send password reset email: {e}")
            return False
    
    def _send_email(self, to_email: str, subject: str, html_body: str):
        """Actually send email via SMTP (for production use)"""
        if not self.smtp_username or not self.smtp_password:
            raise ValueError("SMTP credentials not configured")
            
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.smtp_username
        msg['To'] = to_email
        
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)

email_service = EmailService()