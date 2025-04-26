import React from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface Props {
  onClick: () => void;
  isVisible: boolean;
}

const ScrollToBottomButton: React.FC<Props> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      onClick={onClick}
      className="sticky left-1/2 bottom-4 text-2xl cursor-pointer -translate-x-1/2 w-10 h-10 backdrop-blur-xs bg-white/20 hover:bg-white/5 text-blue-600 hover:text-blue-700 p-3 rounded-full shadow-lg border border-gray-500 transition-all flex items-center justify-center"
      aria-label="Ir al último mensaje"
    >
      <IoChevronDown size={20} />
    </div>

  );
};

export default ScrollToBottomButton;
