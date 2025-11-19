import { GoogleGenAI, Modality } from "@google/genai";
import type { LiveServerMessage, Blob } from '@google/genai';
import { decodeAudioData, encode } from '../utils/audio';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const CODE_GENERATION_SYSTEM_INSTRUCTION = `You are an expert web developer AI. A user will provide instructions to create or modify a self-contained HTML file with CSS and JavaScript.
Your response MUST be ONLY the complete, raw code for the HTML file.
Do not include any explanations, comments, or markdown formatting like \`\`\`html.
Start your response with <!DOCTYPE html> and ensure it is a single, valid HTML document.
The user is testing your output in a live preview, so accuracy and completeness are crucial.`;


export async function generateCodeFromText(prompt: string, existingCode: string): Promise<string> {
  const fullPrompt = `Here is the current code:\n\n${existingCode}\n\nNow, follow these instructions: ${prompt}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: fullPrompt,
    config: {
      systemInstruction: CODE_GENERATION_SYSTEM_INSTRUCTION,
      temperature: 0.2,
    }
  });

  return response.text.trim();
}

// Live API Connection
interface LiveConnectionCallbacks {
    onTranscriptionUpdate: (text: string) => void;
    onTurnComplete: (fullTranscription: string) => void;
    onClose: () => void;
    onError: (error: ErrorEvent) => void;
}

let audioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
let outputAudioContext: AudioContext | null = null;

export async function connectLive(callbacks: LiveConnectionCallbacks): Promise<{ close: () => void }> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    let currentInputTranscription = '';

    const sessionPromise = ai.live.connect({
        // FIX: Corrected model name to full version 'gemini-2.5-flash-native-audio-preview-09-2025' as per documentation.
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => {
                if (!audioContext) {
                    // FIX: Add `any` cast to `window` to support `webkitAudioContext` for older browsers, resolving TypeScript error.
                    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                    audioContext = new AudioContext({ sampleRate: 16000 });
                }
                mediaStreamSource = audioContext.createMediaStreamSource(stream);
                scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                
                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob: Blob = {
                        data: encode(new Uint8Array(new Int16Array(inputData.map(f => f * 32768)).buffer)),
                        mimeType: 'audio/pcm;rate=16000',
                    };

                    sessionPromise.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };
                mediaStreamSource.connect(scriptProcessor);
                scriptProcessor.connect(audioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
                if (message.serverContent?.inputTranscription) {
                    const text = message.serverContent.inputTranscription.text;
                    callbacks.onTranscriptionUpdate(text);
                    currentInputTranscription += text;
                }

                if (message.serverContent?.turnComplete) {
                    callbacks.onTurnComplete(currentInputTranscription);
                    currentInputTranscription = '';
                }
                
                // Optional: handle audio output if needed in the future
            },
            onerror: (e: ErrorEvent) => {
                callbacks.onError(e);
                closeConnection();
            },
            onclose: (e: CloseEvent) => {
                callbacks.onClose();
                closeConnection();
            },
        },
        config: {
            // FIX: The Live API requires the AUDIO response modality, even for transcription-only use cases.
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
        },
    });

    const closeConnection = () => {
        stream.getTracks().forEach(track => track.stop());
        scriptProcessor?.disconnect();
        mediaStreamSource?.disconnect();
        if (audioContext && audioContext.state !== 'closed') {
           // audioContext.close(); // Re-using context can be better than closing
        }
    };

    const session = await sessionPromise;

    return {
        close: () => {
            session.close();
            closeConnection();
        }
    };
}