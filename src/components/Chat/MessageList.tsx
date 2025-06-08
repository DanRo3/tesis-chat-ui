import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types/chat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CodeBlock } from './CodeBlock';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { BiDislike, BiLike } from "react-icons/bi";
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { sendMessage } from '../../redux/chats/actions';
import { removeFailedMessage } from '../../redux/chats/slice';
import ScrollToBottomButton from '../Common/ScroolToBottom';
import Logo from '../../../public/logo.png';
import { LuDownload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const baseUrl = import.meta.env.VITE_IMAGE_ROUTE;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<{ [key: string]: 'up' | 'down' | null }>({});
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set());
  const [resendLoading, setResendLoading] = useState<Set<string>>(new Set());
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const failedMessages = useAppSelector(state => state.conversations.failedMessages);

  const handleCopyMessage = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setLikedMessages(prev => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type
    }));
  };

  const handleImageClick = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };

  const handleDownloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, failedMessages]);

  useEffect(() => {
    messages.forEach(message => {
      if (message.rol === 'assistant' && !completedMessages.has(message.uid)) {
        setTimeout(() => {
          setCompletedMessages(prev => new Set([...prev, message.uid]));
        }, 2000);
      }
    });
  }, [messages]);

  // Agregar event listener de scroll al contenedor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsButtonVisible(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    // Chequear al montar
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setIsButtonVisible(false);
  };

  const handleRetry = async (msg: Message) => {
    setResendLoading(prev => new Set(prev).add(msg.uid));
    try {
      await dispatch(
        sendMessage({
          message: {
            text_message: msg.text_message,
          },
          chat_room: msg.chat_room,
        })
      );
      dispatch(removeFailedMessage(msg.uid));
    } finally {
      setResendLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(msg.uid);
        return newSet;
      });
    }
  };

  return (
    
      <div className="relative w-full h-full flex-1 ">
        <div
          ref={containerRef}
          className="flex flex-col w-full px-2 sm:px-4 max-w-full overflow-y-auto overflow-x-hidden h-full scrollbar-hide"
          style={{ maxHeight: '100vh' }}
          tabIndex={0}
          aria-label="Message list"
        >
          {messages.map((message) => (
            <div
              key={message.uid}
              className={clsx('flex mb-4 w-full', {
                'justify-end': message.rol === 'user',
                'justify-start': message.rol === 'assistant',
              })}
            >
              <div className={clsx('flex flex-col', {
                'items-end max-w-[80%] sm:max-w-[70%]': message.rol === 'user',
                'items-start max-w-[85%] sm:max-w-[100%]': message.rol === 'assistant',
              })}>
                {message.rol === 'user' && message.image && (
                  <div className="relative">
                    <img
                      src={`${baseUrl}${message.image}`}
                      alt="Uploaded content"
                      className="rounded-md mt-3 max-w-[300px] max-h-[300px] object-contain mb-3 cursor-pointer"
                      onClick={() => handleImageClick(`${baseUrl}${message.image}`)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadImage(`${baseUrl}${message.image}`);
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                      title="Descargar imagen">
                      <LuDownload className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div
                  className={clsx(
                    'group whitespace-pre-wrap break-words overflow-wrap-break-word transition-all duration-200 ease-in-out overflow-x-auto max-w-full',
                    {
                      'px-4 py-2 bg-blue-200  rounded-4xl': message.rol === 'user',
                      'bg-white md:max-w-full': message.rol === 'assistant',
                    }
                  )}
                >
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ ...props }) => <img {...props} className="rounded-xl max-w-full h-auto" />,
                      code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                        ) : (
                          <code className="bg-gray-100 px-1 rounded text-black" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.text_message as string}
                  </Markdown>
                  {message.rol === 'assistant' && message.image && (
                    <div className="relative">
                      <img
                        src={message.image}
                        alt="Uploaded content"
                        className="rounded-md mt-3 max-w-[500px] max-h-[500px] object-contain mb-3 cursor-pointer"
                        onClick={() => message.image && handleImageClick(message.image)}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          message.image && handleDownloadImage(message.image);
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                        title="Descargar imagen">
                        <LuDownload className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {message.rol === 'assistant' && (
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-md mt-3">
                      <button
                        onClick={() => handleCopyMessage(message.text_message, message.uid)}
                        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        title="Copiar mensaje"
                      >
                        {copiedMessageId === message.uid ? <LuCheck className="text-green-500" /> : <LuCopy />}
                      </button>
                      <button
                        onClick={() => handleFeedback(message.uid, 'up')}
                        className={clsx(
                          "transition-colors cursor-pointer",
                          likedMessages[message.uid] === 'up'
                            ? "text-green-700"
                            : likedMessages[message.uid] === 'down'
                              ? "text-gray-300"
                              : "text-green-500 hover:text-green-700"
                        )}
                        title="Me gusta"
                      >
                        <BiLike />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.uid, 'down')}
                        className={clsx(
                          "transition-colors cursor-pointer",
                          likedMessages[message.uid] === 'down'
                            ? "text-red-700"
                            : likedMessages[message.uid] === 'up'
                              ? "text-gray-300"
                              : "text-red-500 hover:text-red-700"
                        )}
                        title="No me gusta"
                      >
                        <BiDislike />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Mensajes fallidos */}
              {failedMessages.map((msg: Message) => (
                <div
                  key={msg.uid}
                  className="flex mb-4 w-full justify-end"
                >
                  <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
                    <div className="px-4 py-2 bg-red-100 border border-red-400 rounded-4xl flex items-center gap-2">
                      <span className="text-red-700 truncate">{msg.text_message}</span>
                      <span className="text-xs text-red-500 ml-2">(Error al enviar)</span>
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 border border-red-400 rounded text-red-700 bg-white hover:bg-red-50 text-xs transition flex items-center gap-1 disabled:opacity-60"
                        onClick={() => handleRetry(msg)}
                        aria-label="Reenviar mensaje"
                        disabled={resendLoading.has(msg.uid)}
                      >
                        {resendLoading.has(msg.uid) && (
                          <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                        )}
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {isLoading && (
              <div className='flex items-center pb-10 px-4 animate-fade-in'>
                <div className="flex items-center gap-2">
                  <img 
                    src={Logo} 
                    alt="HChat esta buscando..." 
                    className='w-6 h-6 animate-pulse'
                  />
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-500/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
        <ScrollToBottomButton onClick={scrollToBottom} isVisible={isButtonVisible} />
      <ToastContainer />
      {fullScreenImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-50 flex items-center justify-center" onClick={closeFullScreenImage}>
          <img src={fullScreenImage} alt="Full screen" className="max-w-full max-h-full object-contain" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadImage(fullScreenImage);
            }}
            className="absolute top-2 right-8 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            title="Descargar imagen">
            <LuDownload className="w-6 h-6" />
          </button>
          <button
            onClick={closeFullScreenImage}
            className="absolute top-2 left-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            title="Cerrar"
          >
            <IoClose className="w-6 h-6"/>
          </button>
        </div>
      )}
    </div>
  );
}

export default MessageList;
