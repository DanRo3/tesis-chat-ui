import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { createConversation, getConversationDetails, sendMessage } from '../../redux/chats/actions';
import { useAppSelector } from '../../hooks/useStore';
import { AppDispatch } from '../../redux/store/store';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addMessageToConversation } from '../../redux/chats/slice';
import { useEffect, useState } from 'react';
import Logo from '../../../public/logo.png';

export const Chat = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const uid = useAppSelector(state => state.conversations.currentConversationId);
  const messages = useAppSelector(state => state.conversations.currentConversation.chat.chat_messages);
  const year = new Date().getFullYear();
  const user = useAppSelector(state => state.auth.user)

  useEffect(() => {
    if (uid) {
      dispatch(getConversationDetails(uid));
    }
  }, [uid]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: `Buenos días ${user.user_name}`  };
    if (hour < 18) return {text: `Buenas tardes ${user.user_name}` };
    return { text: `Buenas noches ${user.user_name}` };
  };

  const handleSendMessage = async (content: string, imageData?: File, imagePreviewUrl?: string) => {
    let currentUid = uid;

    if (!currentUid) {
      const result = await dispatch(createConversation());
      if (createConversation.fulfilled.match(result)) {
        currentUid = result.payload.uid;
        await dispatch(getConversationDetails(currentUid));
      } else {
        return;
      }
    }

    const userMessage = { text_message: content, image: imageData };

    const message = {
      text_message: content,
      rol: 'user' as const,
      chat_room: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      uid: uuidv4(),
      slug: null,
      image: imagePreviewUrl || null,
    };


    dispatch(addMessageToConversation(message));
    setIsLoading(true);
    const response = await dispatch(sendMessage({ message: userMessage, chat_room: currentUid }));
    // Only set loading to false after we confirm the message was sent successfully
    if (sendMessage.fulfilled.match(response)) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
      // Optionally handle error here
    }
  };

  return (
    <div className="flex flex-col h-screen md:w-full w-screen overflow-hidden">
      {/* Contenedor del chat ajustado */}
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-2 sm:px-4 no-scrollbar">
        {uid ? (
          <div className="h-full">
            <MessageList messages={messages} />
            {isLoading && (
              <div className='flex items-center pb-10 px-4 animate-fade-in'>
                <div className="flex items-center gap-2">
                  <img 
                    src={Logo} 
                    alt="HChat esta buscando..." 
                    className='w-6 h-6 animate-pulse'
                  />
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div className='pb-10'></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center select-none">
            <img src={Logo} width={200} height={200}/>
            <h2 className="text-2xl font-semibold mb-4">
              <span className="bg-[#8d4925] text-transparent bg-clip-text">
                {getTimeBasedGreeting().text}
              </span>
            </h2>
            <p className="text-gray-500 mb-6">
              Parece que aún no has iniciado una conversación. ¡Comencemos!
            </p>
          </div>
        )}
      </div>

      {/* Input del chat */}
      <div className={`w-full max-w-4xl mx-auto px-2 sm:px-4 ${!uid ? 'flex items-center justify-center' : ''}`}>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Pie de página */}
      <p className="text-center text-gray-500 text-sm py-2">
        HChat. Diario de la Marina 1844-1960 {year}
      </p>
    </div>
  );
};

