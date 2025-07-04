
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
            ...input,
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

    const { message, pageUrl, screenshotDataUrl, audioDataUrl } = input;
    const subject = `Nouveau ticket de support ScolaGest de la page: ${pageUrl}`;
    
    // Construct email body
    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h1>Nouveau Ticket de Support</h1>
        <p>Un nouveau ticket de support a été soumis et enregistré. Vous pouvez le consulter sur le tableau de bord administrateur.</p>
        <p><strong>Page concernée :</strong> <a href="${pageUrl}">${pageUrl}</a></p>
        <hr>
        <h2>Message de l'utilisateur :</h2>
        <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        <hr>
        ${screenshotDataUrl ? `
          <h2>Capture d'écran :</h2>
          <img src="${screenshotDataUrl}" alt="Capture d'écran de l'utilisateur" style="max-width: 100%; border: 1px solid #ddd; border-radius: 5px;" />
        ` : ''}
        ${audioDataUrl ? `
          <h2>Message vocal :</h2>
          <p>Un message vocal a été joint. Veuillez l'écouter en utilisant un lecteur compatible (ex: VLC, Chrome).</p>
        ` : ''}
      </div>
    `;

    const attachments = [];
    if (audioDataUrl) {
        attachments.push({
            filename: 'message_vocal.webm',
            content: audioDataUrl.split(',')[1], // Base64 content
        });
    }

    // TODO: Intégrer l'API WhatsApp ici (ex: Twilio)
    // try {
    //   await sendWhatsAppNotification(`Nouveau ticket de support de ${pageUrl}: ${message}`);
    // } catch (whatsappError) {
    //   console.error("Failed to send WhatsApp notification:", whatsappError);
    //   // Do not block the flow if WhatsApp fails
    // }

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
