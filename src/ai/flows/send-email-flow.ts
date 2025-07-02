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

// IMPORTANT: This flow relies on the RESEND_API_KEY environment variable.
// The user must create a .env.local file and add RESEND_API_KEY=...
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromAddress = `ScolaGest <onboarding@resend.dev>`;

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
      
      if (!data) {
         return { error: 'No response data from email service.' };
      }

      return { id: data.id };
    } catch (e: any) {
        console.error('Failed to send email:', e);
        return { error: e.message || 'An unknown error occurred while sending the email.' };
    }
  }
);
