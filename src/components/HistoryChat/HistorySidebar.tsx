import React, { useCallback, useRef, useState } from "react";
import { RootState } from "../../redux/store/store";
import Logo from "../../../public/logo.png";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { useEffect } from "react";
import {
  deleteConversation,
  getConversations,
  getNextsConversations,
  renameConversation,
} from "../../redux/chats/actions";
import { Dropdown, Menu, message } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { newConversation, setCurrentConversationId } from "../../redux/chats/slice";
import { RiChatHistoryLine, RiMenu2Fill, RiMenu3Fill } from "react-icons/ri";
import { ImSpinner3 } from "react-icons/im";
import { BsChatSquareText } from "react-icons/bs";
import { PiChatBold } from "react-icons/pi";

export const HistorySidebar: React.FC<{
  isCompressed: boolean;
  onToggleCompression: (state: boolean) => void;
}> = ({ isCompressed, onToggleCompression }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const currentConversationId = useAppSelector(
    (state: RootState) => state.conversations.currentConversationId
  );
  const user = useAppSelector(
    (state:RootState)=> state.auth.user
  );

  const { next, loading } = useAppSelector((state: RootState) => ({
    next: state.conversations.historyChat.next,
    loading: state.conversations.loading,
  }));

  const observerRef = useRef<HTMLDivElement | null>(null);

  const getNextPage = (url: string): string | null => {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("p");
  };

  const loadMoreChats = useCallback(() => {
    if (next && !loading) {
      const page = getNextPage(next);
      if (page) {
        dispatch(getNextsConversations(page));
      }
    }
  }, [next, loading, dispatch]);

  const handleScroll = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      loadMoreChats();
    }
  }, [loadMoreChats]);
  

  useEffect(() => {
    if (!observerRef.current) return;
  
    const observer = new IntersectionObserver(handleScroll, {
      root: null,
      rootMargin: "100px", // Margen para cargar antes de que llegue al final
      threshold: 0.5, // Se activa cuando el 50% del elemento es visible
    });
  
    observer.observe(observerRef.current);
  
    return () => {
      observer.disconnect();
    };
  }, [handleScroll]);
  

  const historyChat = useAppSelector(
    (state: RootState) => state.conversations.historyChat
  );

  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const handleStartEditing = (uid: string, currentTitle: string) => {
    setEditingConversationId(uid);
    setEditedTitle(currentTitle);
  };

  const handleCancelEditing = () => {
    setEditingConversationId(null);
    setEditedTitle("");
  };

  const handleSaveTitle = async (uid: string) => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      message.error("Conversation name cannot be empty");
      return;
    }

    try {
      await dispatch(
        renameConversation({ id: uid, newTitle: trimmedTitle })
      ).unwrap();
      setEditingConversationId(null);
      message.success("Conversation renamed successfully");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to rename conversation"
      );
    }
  };

  useEffect(() => {
    // Get the conversations when the component mounts
    dispatch(getConversations());
  }, [dispatch]);

  const getConversationMenu = (uid: string) => (
    <Menu>
      <Menu.Item
        key="rename"
        icon={<EditOutlined />}
        onClick={() => {
          const conversation = historyChat.results.chats.find(conv => conv.uid === uid);
          if (conversation) {
            handleStartEditing(uid, conversation.title);
          }
        }}
      >
        Rename
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDeleteConversation(uid)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleNewConversation = () => {
    setIsLoading(true);
    console.log("new conversation");
    navigate("/chat/");
    dispatch(newConversation());
    setIsLoading(false);

  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/signin");
  };

  const handleDeleteConversation = (uid: string) => {
    dispatch(deleteConversation(uid));
  };

  const loadingConversation = (uid: string) => {
    dispatch(setCurrentConversationId(uid));
  }

  return (
    <div
      className={`
        bg-gray-200 text-black transition-all duration-300 ease-in-out
        ${isCompressed ? "hidden" : "md:w-64 w-full"}
        h-full flex flex-col
      `}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between h-10 text-2xl px-4 mt-2">
          <button
            onClick={() => onToggleCompression(!isCompressed)}
            className="text-black cursor-pointer hover:bg-[#cba694] p-2 rounded-lg"
          >
            {isCompressed ? (
              <RiMenu2Fill />
            ) : (
              <RiMenu3Fill />
            )}
          </button>
          <button className=" cursor-pointer hover:bg-[#cba694] p-2 rounded-lg" onClick={handleNewConversation} disabled={isLoading}>
            {isLoading ? <PiChatBold className="text-black animate-spin" /> : <PiChatBold className="text-black" />}
          </button>
        </div>

        <div className="flex items-center justify-between pl-4 cursor-pointer  mx-4 my-6 rounded-xl hover:bg-[#cba694] group">
          <div className="flex items-center" onClick={handleNewConversation}>
            <div className="rounded-full bg-[#F2EFE7] border-[1px] border-gray-300">
              <img src={Logo} alt="Netsy" height={30} width={30} />
            </div>
            <div className="p-3">HChat.</div>
          </div>
          <button className="cursor-pointer p-2 opacity-0 group-hover:opacity-100">
            <PiChatBold className="text-black" />
          </button>
        </div>

        <div className="flex items-center pl-4 select-none mx-4 mb-4 gap-2">
          <RiChatHistoryLine className="text-black text-2xl"/>
          <h1 className="text-lg font-semibold">Historial</h1>
        </div>
      </div>

      {/* Historial (flex-grow, scrollable) */}
      <div className="flex-1 p-4 mx-2 rounded-xl bg-gray-100 overflow-y-auto scrollbar-hide min-h-0">
        {historyChat.results.chats.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-center text-gray-500">
            No conversations found
            <BsChatSquareText className="text-5xl mt-4" />
          </div>
        ) : (
          <>
          {historyChat.results.chats.map((conversation) => (
            <div
              key={conversation.uid}
              className={`
                p-2 mb-2 rounded hover:bg-[#cba694] cursor-pointer relative
                ${conversation.uid === currentConversationId ? "bg-[#e0e0e0]" : "hover:bg-[#cba694]"}
                ${
                  isCompressed
                    ? "flex justify-between items-center"
                    : "flex items-center justify-between"
                }
              `}
            >
              <div className="flex items-center space-x-2 w-full" onClick={() => loadingConversation(conversation.uid)}>
                {editingConversationId === conversation.uid ? (
                  <div className="flex items-center w-[60%]">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="flex-grow border rounded px-2 py-1"
                      autoFocus
                      onBlur={() => handleSaveTitle(conversation.uid)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleSaveTitle(conversation.uid);
                        if (e.key === "Escape") handleCancelEditing();
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center w-full justify-between"
                    onDoubleClick={() =>
                      handleStartEditing(conversation.uid, conversation.title)
                    }
                  >
                    <div className="flex items-center">
                      <p className="flex-grow">
                        {conversation.title.length > 18
                          ? `${conversation.title.slice(0, 18)}...`
                          : conversation.title}
                      </p>
                      <button
                        onClick={() =>
                          handleStartEditing(conversation.uid, conversation.title)
                        }
                        className="opacity-0 group-hover:opacity-100 ml-2 "
                      >
                        <EditOutlined className="text-gray-500  hover:text-gray-700" />
                      </button>
                    </div>
                    <Dropdown
                      overlay={getConversationMenu(conversation.uid)}
                      trigger={["click"]}
                    >
                      <MoreOutlined className="text-gray-500 hover:text-gray-700" />
                    </Dropdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          </>
        )}
        <div ref={observerRef} />
        {loading && (
          <div className="flex justify-center items-center text-[#6f4c3b] animate-spin mb-2">
            <ImSpinner3 />
          </div>
        )}
      </div>

      {/* Footer (email + logout) */}
      <div className="h-16 px-4 flex items-center justify-between border-t border-gray-300 bg-gray-200 select-none">
        <span className="font-semibold truncate max-w-[80%]">{user.email}</span>
        <button
          className="text-2xl cursor-pointer ml-2 hover:bg-[#cba694] p-2 rounded-lg"
          onClick={handleLogout}
        >
          <IoIosLogOut />
        </button>
      </div>
    </div>
  );
};
