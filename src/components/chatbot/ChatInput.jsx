import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../context/ChatbotContext';
import { Send, Paperclip, Mic, X } from 'lucide-react';

const ChatInput = () => {
  const { sendMessage, isTyping } = useChatbot();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      sendMessage(message);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setMessage(prev => prev + ' ' + speechToText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert('Voice input is not supported in your browser');
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1"
            >
              <span className="text-xs text-gray-600 truncate max-w-[100px]">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="1"
            className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            disabled={isTyping}
          />
          
          {/* Input actions */}
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            {/* File upload */}
            <label className="cursor-pointer p-1 text-gray-400 hover:text-gray-600">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
              <Paperclip className="h-5 w-5" />
            </label>

            {/* Voice input */}
            <button
              onClick={handleVoiceInput}
              className={`p-1 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || isTyping}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="text-xs text-gray-400 mt-2">
          Assistant is typing...
        </div>
      )}
    </div>
  );
};

export default ChatInput;