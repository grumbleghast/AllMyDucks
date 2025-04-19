/**
 * Email service for sending emails
 * Uses a simple console log approach for development,
 * but can be replaced with actual email services in production
 */

/**
 * Send a password reset email
 * In development: logs email to console
 * In production: would use a real email service
 * 
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - URL for password reset
 * @returns {Promise<boolean>} Success status
 */
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // In a production environment, this would send an actual email
    // using a service like Nodemailer, SendGrid, etc.
    
    // For development, we'll just log the details
    console.log('\n--- PASSWORD RESET EMAIL ---');
    console.log(`To: ${email}`);
    console.log(`Subject: AllMyDucks Password Reset`);
    console.log(`\nHello,`);
    console.log(`\nYou requested a password reset for your AllMyDucks account.`);
    console.log(`\nPlease click the link below to reset your password:`);
    console.log(`\n${resetUrl}?token=${resetToken}`);
    console.log(`\nIf you didn't request this, please ignore this email.`);
    console.log(`\nThanks,`);
    console.log(`The AllMyDucks Team`);
    console.log('------------------------\n');
    
    return true;
  } catch (error) {
    console.error(`Failed to send password reset email: ${error.message}`);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
}; 