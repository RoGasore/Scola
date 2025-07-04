
'use server';
/**
 * @fileOverview A Genkit flow for sending a support ticket with attachments via email and saving it to the database.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';
import { addSupportTicketToDb } from '@/services/support';
import type { SupportTicket } from '@/types';

const SendSupportTicketInputSchema = z.object({
  message: z.string().describe("The user's description of the problem."),
  pageUrl: z.string().url().describe("The URL of the page where the user encountered the issue."),
  screenshotDataUrl: z.string().optional().describe("A data URI of the screenshot image (e.g., 'data:image/png;base64,...')."),
  audioDataUrl: z.string().optional().describe("A data URI of the recorded audio (e.g., 'data:audio/webm;base64,...')."),
  userName: z.string().describe("The name of the user submitting the ticket."),
  userRole: z.string().describe("The role of the user (e.g., Admin, Teacher, Student)."),
});
export type SendSupportTicketInput = z.infer<typeof SendSupportTicketInputSchema>;

const resendApiKey = "re_jJWoAYkp_2evEJ82XdpqCrd8jbEqqhZA2"; // Use environment variables in production
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromAddress = `Support ScolaGest <support@resend.dev>`;
const toAddress = "admin@scolagest.com"; // Admin's email address

export async function sendSupportTicket(input: SendSupportTicketInput): Promise<{ id: string } | { error: string }> {
  return sendSupportTicketFlow(input);
}

const sendSupportTicketFlow = ai.defineFlow(
  {
    name: 'sendSupportTicketFlow',
    inputSchema: SendSupportTicketInputSchema,
    outputSchema: z.object({ id: z.string() }).or(z.object({ error: z.string() })),
  },
  async (input) => {
    
    // Step 1: Save the ticket to Firestore
    try {
        const ticketData: Omit<SupportTicket, 'id'> = {
            message: input.message,
            pageUrl: input.pageUrl,
            screenshotDataUrl: input.screenshotDataUrl,
            audioDataUrl: input.audioDataUrl,
            userName: input.userName,
            userRole: input.userRole,
            createdAt: new Date().toISOString(),
            status: 'new'
        };
        await addSupportTicketToDb(ticketData);
    } catch(dbError: any) {
        console.error('Failed to save support ticket to DB:', dbError);
        // We might decide to still send the email, but for now, we'll fail fast.
        return { error: 'Failed to save ticket to database. ' + dbError.message };
    }
    
    // Step 2: Send email notification
    if (!resend) {
      const errorMsg = 'The email service is not configured on the server.';
      console.error(errorMsg);
      // The ticket is saved, but email failed. This could be handled more gracefully.
      return { error: errorMsg };
    }

    const { message, pageUrl, screenshotDataUrl, audioDataUrl, userName, userRole } = input;
    const subject = `Nouveau ticket de support (${userRole}) : ${pageUrl}`;
    
    // Construct email body
    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h1>Nouveau Ticket de Support</h1>
        <p>Un nouveau ticket a été soumis par <strong>${userName} (${userRole})</strong>.</p>
        <p><strong>Page concernée :</strong> <a href="${pageUrl}">${pageUrl}</a></p>
        <hr>
        <h2>Message de l'utilisateur :</h2>
        <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        <hr>
        ${screenshotDataUrl ? `
          <h2>Capture d'écran :</h2>
          <p>La capture d'écran est jointe à ce mail et visible dans le tableau de bord ScolaGest.</p>
        ` : ''}
        ${audioDataUrl ? `
          <h2>Message vocal :</h2>
          <p>Un message vocal a été joint. Veuillez l'écouter en utilisant un lecteur compatible (ex: VLC, Chrome).</p>
        ` : ''}
      </div>
    `;

    const attachments = [];
    if (screenshotDataUrl) {
        attachments.push({
            filename: 'screenshot.png',
            content: screenshotDataUrl.split(',')[1],
        });
    }
    if (audioDataUrl) {
        attachments.push({
            filename: 'message_vocal.webm',
            content: audioDataUrl.split(',')[1], // Base64 content
        });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: toAddress,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      if (error) {
        console.error('Resend error:', error);
        return { error: error.message };
      }
      
      if (data && data.id) {
         return { id: data.id };
      }

      return { error: 'No valid ID was returned from the email service.' };

    } catch (e: any) {
        console.error('Failed to send support ticket:', e);
        return { error: e.message || 'An unknown error occurred while sending the ticket.' };
    }
  }
);
