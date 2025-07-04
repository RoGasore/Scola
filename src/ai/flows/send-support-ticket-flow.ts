
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
  audioDataUrls: z.array(z.string()).optional().describe("A list of data URIs of the recorded audio files (e.g., 'data:audio/webm;base64,...')."),
  userName: z.string().describe("The name of the user submitting the ticket."),
  userEmail: z.string().email().describe("The email address of the user for replies."),
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
        const now = new Date().toISOString();
        const ticketData: Omit<SupportTicket, 'id'> = {
            userName: input.userName,
            userEmail: input.userEmail,
            userRole: input.userRole,
            subject: input.message.substring(0, 100) + (input.message.length > 100 ? '...' : ''),
            pageUrl: input.pageUrl,
            createdAt: now,
            status: 'new',
            conversation: [{
                author: 'user',
                authorName: input.userName,
                message: input.message,
                createdAt: now,
                screenshotDataUrl: input.screenshotDataUrl,
                audioDataUrls: input.audioDataUrls || [],
            }]
        };
        await addSupportTicketToDb(ticketData);
    } catch(dbError: any) {
        console.error('Failed to save support ticket to DB:', dbError);
        return { error: 'Failed to save ticket to database. ' + dbError.message };
    }
    
    // Step 2: Send email notification
    if (!resend) {
      const errorMsg = 'The email service is not configured on the server.';
      console.error(errorMsg);
      // We don't return an error here, as the ticket is saved. The email is just a notification.
      return { id: "ticket_saved_no_email" }; 
    }

    const { message, pageUrl, screenshotDataUrl, audioDataUrls, userName, userRole } = input;
    const subject = `Nouveau ticket de support (${userRole}) : ${pageUrl}`;
    
    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h1>Nouveau Ticket de Support</h1>
        <p>Un nouveau ticket a été soumis par <strong>${userName} (${userRole})</strong>.</p>
        <p><strong>Page concernée :</strong> <a href="${pageUrl}">${pageUrl}</a></p>
        <hr>
        <h2>Message de l'utilisateur :</h2>
        <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        <hr>
        ${screenshotDataUrl ? `<h2>Capture d'écran jointe.</h2>` : ''}
        ${audioDataUrls && audioDataUrls.length > 0 ? `<h2>${audioDataUrls.length} message(s) vocal/vocaux joint(s).</h2>` : ''}
        <p>Connectez-vous à votre tableau de bord ScolaGest pour voir tous les détails et pièces jointes.</p>
      </div>
    `;

    const attachments = [];
    if (screenshotDataUrl) {
        const content = screenshotDataUrl.split(',')[1];
        if (content) {
            attachments.push({
                filename: 'screenshot.png',
                content: content,
            });
        }
    }
    if (audioDataUrls) {
        audioDataUrls.forEach((audioUrl, index) => {
            const content = audioUrl.split(',')[1];
            if (content) {
                attachments.push({
                    filename: `message_vocal_${index + 1}.webm`,
                    content: content,
                });
            }
        });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: toAddress,
        subject: subject,
        html: htmlBody,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (error) {
        console.error('Resend error:', error);
        return { error: error.message };
      }
      
      if (data?.id) {
         return { id: data.id };
      }

      return { error: 'No valid ID was returned from the email service.' };

    } catch (e: any) {
        console.error('Failed to send support ticket:', e);
        // Placeholder for WhatsApp Integration
        // if (config.whatsapp.enabled) {
        //   await sendWhatsAppNotification(`New support ticket from ${userName}: ${message}`);
        // }
        return { error: e.message || 'An unknown error occurred while sending the ticket.' };
    }
  }
);
