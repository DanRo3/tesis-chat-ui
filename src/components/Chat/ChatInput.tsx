import React, { useState, useRef, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { IoArrowUpCircleSharp} from 'react-icons/io5'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ChatInputProps {
  onSendMessage: (content: string, imageData?: File, imagePreviewUrl?: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  // Manejador del envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white py-1 px-2 rounded-2xl shadow-lg flex flex-col space-y-3 md:w-[80%] w-full mx-auto relative animate-neon-border">
    
      <TextareaAutosize
        ref={textAreaRef}
        minRows={1}
        maxRows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="¿Qué quieres saber hoy?"
        className="flex-grow p-2 border-none focus:outline-none resize-none"
        onKeyDown={handleKeyDown}
      />
      
      <div className='flex justify-end'> 
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          title="Enviar mensaje"
          className={`cursor-pointer  ${isLoading ? 'opacity-50 cursor-not-allowed rounded-full bg-gray-100' : 'bg-white'}`}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters  size={36} className="text-gray-500 animate-spin"/>
          ) : (
            <IoArrowUpCircleSharp size={48} className="text-yellow-900 hover:text-amber-950 transition-colors"/>
          )}
        </button>
      </div>
    </div>
  )
}

export default ChatInput