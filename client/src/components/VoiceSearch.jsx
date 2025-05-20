import React, { useState, useEffect } from 'react';

const VoiceSearch = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
      setIsListening(false);
    };

    recognitionInstance.onend = () => setIsListening(false);
    recognitionInstance.onerror = () => setIsListening(false);

    setRecognition(recognitionInstance);
  }, [onSearch]);

  const handleVoiceSearch = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <button
      onClick={handleVoiceSearch}
      type="button"
      aria-label="Voice Search"
      title={isListening ? 'Listening...' : 'Click to speak'}
      className={`
        ml-2 flex items-center justify-center 
        w-10 h-10 rounded-full 
        transition-colors duration-300
        ${isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
      `}
    >
      {isListening ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-red-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="9" y="2" width="6" height="11" rx="3" ry="3" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v4m-4-2h8" />
  </svg>
) : (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="9" y="2" width="6" height="11" rx="3" ry="3" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v4m-4-2h8" />
  </svg>
)}

    </button>
  );
};

export default VoiceSearch;
