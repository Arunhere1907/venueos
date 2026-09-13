/**
 * VenueOS — Assistive Web Speech API Helpers
 */

/**
 * Reads aloud given text using browser SpeechSynthesis.
 * Safe with iframe sandbox and checks browser availability.
 */
export function speakText(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment.');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Cancels current speech playback
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Interface for speech recognition instance
 */
export interface VoiceRecognitionController {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

// Global typing for speech recognition in browsers
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEventInit extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventInit) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

/**
 * Initializes speech-to-text listener if supported.
 */
export function initVoiceRecognition(
  onResult: (transcript: string) => void,
  onEnd: () => void,
  onError?: (err: string) => void
): VoiceRecognitionController {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const windowWithSpeech = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  const Recognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

  if (!Recognition) {
    return {
      start: () => {
        if (onError) onError('Speech recognition is not supported in this browser.');
      },
      stop: () => {},
      isSupported: false
    };
  }

  let recognition: SpeechRecognitionInstance | null = null;
  try {
    recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEventInit) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      onResult(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return {
      start: () => {
        try {
          recognition?.start();
        } catch {
          // Ignore repeated start calls
        }
      },
      stop: () => {
        try {
          recognition?.stop();
        } catch {
          // Ignore
        }
      },
      isSupported: true
    };
  } catch (err) {
    return {
      start: () => {
        if (onError) onError(String(err));
      },
      stop: () => {},
      isSupported: false
    };
  }
}
