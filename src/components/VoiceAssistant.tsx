import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function VoiceAssistant() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = language === 'te' ? 'te-IN' : 'en-IN';

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      setIsListening(false);
      handleVoiceQuery(transcript);
    };

    recognitionInstance.onerror = () => {
      setIsListening(false);
      toast.error(t(language, 'voice.error'));
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, [language]);

  const startListening = () => {
    if (!recognition) {
      toast.error(t(language, 'voice.noSupport'));
      return;
    }

    setTranscript('');
    setResponse('');
    setIsListening(true);
    recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const handleVoiceQuery = async (query: string) => {
    setIsProcessing(true);

    try {
      const prompt = language === 'en' 
        ? `You are an agriculture expert assistant. User asked: "${query}". 
           Provide a helpful, concise answer in simple English (max 3 sentences).`
        : `మీరు వ్యవసాయ నిపుణుడు. యూజర్ అడిగారు: "${query}". 
           సాధారణ తెలుగులో సహాయకరమైన, సంక్షిప్త సమాధానం ఇవ్వండి (గరిష్టంగా 3 వాక్యాలు).`;

      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          messages: [{ role: 'user', content: prompt }],
          model: 'google/gemini-2.5-flash',
          temperature: 0.7,
        },
      });

      if (error) throw error;

      const aiResponse = data.choices[0].message.content;
      setResponse(aiResponse);
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Voice assistant error:', error);
      toast.error(t(language, 'common.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const supportsVoice = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  if (!supportsVoice) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-80"
          >
            <Card className="shadow-2xl border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{t(language, 'voice.title')}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Indicator */}
                <div className="text-center mb-4">
                  {isListening ? (
                    <div className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Mic className="h-12 w-12 text-red-500" />
                      </motion.div>
                      <p className="text-sm font-medium">{t(language, 'voice.listening')}</p>
                    </div>
                  ) : isProcessing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-sm font-medium">{t(language, 'voice.processing')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <MicOff className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t(language, 'voice.speak')}</p>
                    </div>
                  )}
                </div>

                {/* Transcript */}
                {transcript && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      {language === 'en' ? 'You said:' : 'మీరు చెప్పారు:'}
                    </p>
                    <p className="text-sm">{transcript}</p>
                  </div>
                )}

                {/* Response */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-start gap-2">
                      <Volume2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{response}</p>
                    </div>
                  </motion.div>
                )}

                {/* Control Button */}
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                  variant={isListening ? 'destructive' : 'default'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Stop' : 'ఆపండి'}
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Start Speaking' : 'మాట్లాడటం ప్రారంభించండి'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
