import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  topic: z.string().min(1, 'Please select a topic.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // TODO: Implement your email sending logic here
    // Options:
    // 1. Use Resend: https://resend.com/docs/send-with-nextjs
    // 2. Use SendGrid: https://www.npmjs.com/package/@sendgrid/mail
    // 3. Use Nodemailer: https://nodemailer.com/
    // 4. Use a form service like Formspark: https://formspark.io/

    // For now, just log the data (replace with actual email sending)
    console.log('Contact form submission:', validatedData);

    // Example with Resend (uncomment and configure):
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'contact@yourdomain.com',
      to: 'your-email@example.com',
      subject: `New Contact Form: ${validatedData.topic}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Topic:</strong> ${validatedData.topic}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });
    */

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
