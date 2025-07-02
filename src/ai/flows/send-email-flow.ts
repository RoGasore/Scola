
'use server';
/**
 * @fileOverview A Genkit flow for sending emails using Resend.
 *
 * - sendEmail - A function that sends an email.
 * - SendEmailInput - The input type for the sendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const SendEmailInputSchema = z.object({
  to: z.string().email().describe('The recipient email address.'),
  subject: z.string().describe('The subject of the email.'),
  html: z.string().describe('The HTML content of the email.'),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

// For production, it's recommended to use environment variables for the API key.
const resendApiKey = "re_jJWoAYkp_2evEJ82XdpqCrd8jbEqqhZA2";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
// You can set your verified domain in an environment variable.
// For now, it defaults to the Resend test address.
const fromAddress = process.env.EMAIL_FROM_ADDRESS || `ScolaGest <onboarding@resend.dev>`;

export async function sendEmail(input: SendEmailInput): Promise<{ id: string } | { error: string }> {
  return sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailInputSchema,
    outputSchema: z.object({ id: z.string() }).or(z.object({ error: z.string() })),
  },
  async (input) => {
    try {
      if (!resend) {
        console.error("Resend API key is not configured.");
        throw new Error('The email service is not configured on the server.');
      }
      
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: input.to,
        subject: input.subject,
        html: input.html,
      });

      if (error) {
        console.error('Resend error:', error);
        return { error: error.message };
      }
      
      // Check for a valid response with an ID.
      // The previous check was not robust enough.
      if (data && data.id) {
         return { id: data.id };
      }

      // If we are here, it means there was no error, but also no valid data.id
      return { error: 'No valid ID was returned from the email service.' };

    } catch (e: any) {
        console.error('Failed to send email:', e);
        return { error: e.message || 'An unknown error occurred while sending the email.' };
    }
  }
);
