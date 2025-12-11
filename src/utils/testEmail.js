const sendEmail = require('./sendEmail'); // عدّل المسار حسب مكان الملف

async function test() {
  try {
    await sendEmail('lujaintoma8@gmail.com', 'Test Email', '<h1>Hello from HealthPal!</h1>');
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

test();
