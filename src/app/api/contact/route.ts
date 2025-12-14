import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Log the form data
    console.log('Contact form submission:', {
      name: formData.name,
      email: formData.email,
      project: formData.project,
      message: formData.message,
      timestamp: new Date().toISOString()
    });

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      console.warn('Resend not configured. Email not sent.');
      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully (email delivery pending configuration)' 
      });
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL!,
        replyTo: formData.email,
        subject: `New Contact Form: ${formData.project || 'General Inquiry'} - ${formData.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Project Type:</strong> ${formData.project || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `,
      });

      console.log('Email sent successfully via Resend');
    } catch (emailError) {
      console.error('Resend email error:', emailError);
      // Don't fail the request if email fails - just log it
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' }, 
      { status: 500 }
    );
  }
}
