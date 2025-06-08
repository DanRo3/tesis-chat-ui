import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { createConversation, getConversationDetails, renameConversation, sendMessage } from '../../redux/chats/actions';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { v4 as uuidv4 } from 'uuid';
import { addMessageToConversation } from '../../redux/chats/slice';
import { message } from 'antd';
import Logo from '../../../public/logo.png';

export const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const uid = useAppSelector((state) => state.conversations.currentConversationId);
  const current = useAppSelector((state) => state.conversations);
  const messages = useAppSelector((state) => state.conversations.currentConversation.chat.chat_messages);
  const user = useAppSelector((state) => state.auth.user);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (uid) {
      dispatch(getConversationDetails(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    // Auto-scroll al último mensaje
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (!user) return 'Hola';
    if (hour < 12) return `Buenos días, ${user.username}`;
    if (hour < 18) return `Buenas tardes, ${user.username}`;
    return `Buenas noches, ${user.username}`;
  };

  const editTitle = async()=>{
    if(current.currentConversation.chat.title === "Nueva Conversación" && current.currentConversation.chat.chat_messages.length>=1){
      let newTitle = current.currentConversation.chat.chat_messages[1].text_message.slice(0, 20);
      await dispatch(renameConversation({ id: uid, newTitle: newTitle })).unwrap();
    }
  }


  const handleSendMessage = async (content: string, imageData?: File, imagePreviewUrl?: string) => {
    try {
      let currentUid = uid;

      if (!currentUid) {
        const result = await dispatch(createConversation()).unwrap();
        currentUid = result.uid;
        await dispatch(getConversationDetails(currentUid)).unwrap();
      }

      const userMessage = { text_message: content, image: imageData };
      const messageData = {
        text_message: content,
        rol: 'user' as const,
        chat_room: currentUid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uid: uuidv4(),
        slug: null,
        image: imagePreviewUrl || null,
      };

      dispatch(addMessageToConversation(messageData));
      setIsLoading(true);
      await dispatch(sendMessage({ message: userMessage, chat_room: currentUid })).unwrap();
      await editTitle();
    } catch (error) {
      message.error('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white ">
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 scrollbar-hide" ref={chatRef}>
        {uid ? (
          <div className="h-full">
            <MessageList messages={messages} isLoading={isLoading}/>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <img src={Logo} alt="HChat" width={150} height={150} />
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">{getTimeBasedGreeting()}</h2>
            <p className="text-gray-500 mt-2 mb-4">Selecciona una pregunta para comenzar:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleSendMessage('Generame una gráfica de los barcos que entraron a La Habana de Barcelona por año.')}
                className="px-3 cursor-pointer py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              >
                Generame una gráfica de los barcos que entraron a La Habana de Barcelona por año.
              </button>
              <button
                onClick={() => handleSendMessage('¿Cuál es al año de más arrivos de Barcos al puerto de La Habana?')}
                className="px-3 py-1 cursor-pointer bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              >
                ¿Cuál es al año de más arrivos de Barcos al puerto de La Habana?
              </button>
              <button
                onClick={() => handleSendMessage('¿Quiénes eran los principales colaboradores de Diario de la Marina?')}
                className="px-3 py-1 cursor-pointer bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              >
                ¿Qué es el Diario de la Marina?
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 py-2">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
      <footer className="text-center text-gray-500 text-sm py-2 select-none">
        HChat {year} © Diario de la Marina 1844-1960 
      </footer>
    </div>
  );
};

