'use server';
/**
 * @fileOverview An AI flow to extract information from a teacher's CV.
 *
 * - extractCvInfo - A function that handles the CV parsing and information extraction.
 * - ExtractCvInfoInput - The input type for the extractCvInfo function.
 * - ExtractCvInfoOutput - The return type for the extractCvInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ExtractCvInfoInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "A teacher's CV file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractCvInfoInput = z.infer<typeof ExtractCvInfoInputSchema>;

export const ExtractCvInfoOutputSchema = z.object({
  professionalExperience: z.string().describe("A summary of the teacher's professional experience, formatted for a textarea. Use bullet points for different roles."),
  address: z.string().describe("The full address of the teacher, if found in the CV. Otherwise, an empty string."),
  missingInformation: z.array(z.string()).describe("A list of important fields that are missing from the CV. Check for: full name, email, phone number, and address."),
});
export type ExtractCvInfoOutput = z.infer<typeof ExtractCvInfoOutputSchema>;

export async function extractCvInfo(input: ExtractCvInfoInput): Promise<ExtractCvInfoOutput> {
  return extractCvInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractCvInfoPrompt',
  input: {schema: ExtractCvInfoInputSchema},
  output: {schema: ExtractCvInfoOutputSchema},
  prompt: `You are an expert HR assistant for a school in the Democratic Republic of Congo. Your task is to analyze the provided CV and extract key information.

Analyze the document provided via the data URI.

1.  **Extract Professional Experience**: Summarize the candidate's professional experience. List each position with the employer and dates. Format it clearly, using bullet points or numbered lists.
2.  **Extract Address**: Find the candidate's full physical address. If it's not present, leave the address field empty.
3.  **Identify Missing Information**: Review the CV to see if the following key pieces of information are present:
    *   Full Name (at least first and last name)
    *   Email Address
    *   Phone Number
    *   Physical Address

    For each piece of information that you cannot find, add a corresponding descriptive string to the 'missingInformation' array. For example, if the address is missing, add "Adresse physique". If the email is missing, add "Adresse e-mail".

Provide the output in the structured format requested.

CV Document: {{media url=cvDataUri}}`,
});

const extractCvInfoFlow = ai.defineFlow(
  {
    name: 'extractCvInfoFlow',
    inputSchema: ExtractCvInfoInputSchema,
    outputSchema: ExtractCvInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to extract information from CV.");
    }
    return output;
  }
);
