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


interface MessageListProps {
  messages: Message[];
}


const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<{ [key: string]: 'up' | 'down' | null }>({});

  const handleCopyMessage = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setLikedMessages(prev => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type
    }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // const processImageUrl = (imageUrl: string) => {
  //   // If it's a blob URL, convert it to a File/Blob object
  //   if (imageUrl.startsWith('blob:')) {
  //     return URL.createObjectURL(
  //       new Blob([imageUrl], { type: 'image/jpeg' })
  //     );
  //   }
  //   return imageUrl;
  // };

  // Add this state near your other states
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set());

  // Add this effect after your other effects
  useEffect(() => {
    messages.forEach(message => {
      if (message.rol === 'assistant' && !completedMessages.has(message.uid)) {
        setTimeout(() => {
          setCompletedMessages(prev => new Set([...prev, message.uid]));
        }, 2000);
      }
    });
  }, [messages]);

  return (
    <div className="flex flex-col w-full px-2 sm:px-4 max-w-full overflow-hidden">
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
                <img
                  src={message.image}
                  alt="Uploaded content"
                  className="rounded-md mt-3 max-w-[300px] max-h-[300px] object-contain mb-3"
                />
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
                  <img
                    src={message.image}
                    alt="Uploaded content"
                    className="rounded-md mt-3 max-w-[300px] max-h-[300px] object-contain mb-3"
                  />
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
        </div>
      ))}
          <div ref={messagesEndRef} />
          <ToastContainer />
        </div>
      );
};

      export default MessageList;
