import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, topic, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        // LOGGING (Visible in server console)
        console.log('--- NEW CONTACT SUBMISSION ---');
        console.log(`From: ${name} (${email})`);
        console.log(`Topic: ${topic}`);
        console.log(`Message: ${message}`);
        console.log('------------------------------');

        /**
         * TODO: INTEGRATE EMAIL SERVICE
         * To actually receive emails, you can use Resend, SendGrid, or Postmark.
         * Example with Resend (npm install resend):
         * 
         * import { Resend } from 'resend';
         * const resend = new Resend(process.env.RESEND_API_KEY);
         * await resend.emails.send({
         *   from: 'PrivaFlow <onboarding@resend.dev>',
         *   to: 'your-email@example.com',
         *   subject: `[PrivaFlow] New Message from ${name}`,
         *   text: `Topic: ${topic}\n\n${message}`
         * });
         */

        return NextResponse.json(
            { success: true, message: 'Message received successfully' }, 
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}
