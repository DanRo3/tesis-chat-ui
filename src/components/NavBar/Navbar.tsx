import { PiChatBold } from "react-icons/pi";
import { RiMenu2Fill, RiMenu3Fill } from "react-icons/ri";


export const Navbar: React.FC<{
  isCompressed: boolean;
  onToggleCompression: (state: boolean) => void;
}> = ({ isCompressed, onToggleCompression }) => {


  return (
    <nav className="bg-white text-gray-700 w-full h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        {isCompressed && (
          <div className="flex items-center w-16 justify-between h-10 text-2xl">
            <button onClick={() => onToggleCompression(!isCompressed)} className="text-black cursor-pointer hover:bg-[#F2EFE7] p-2 rounded-lg">
              {isCompressed ? (
                <RiMenu2Fill />
              ) : (
                <RiMenu3Fill />
              )}
            </button>
            <button className="hover:bg-[#F2EFE7] p-2 rounded-lg ml-2 cursor-pointer">
              <PiChatBold className="text-black" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
