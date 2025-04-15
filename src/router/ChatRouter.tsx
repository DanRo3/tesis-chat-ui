import { Routes, Route} from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ChatPage from "../pages/ChatPage";
import { Chat } from "../components/Chat/Chat";

export const ChatRouter = () => {
  return (
      <Layout>
        <Routes>
          <Route path="/:uid" element={
              <Chat />
          } />
          <Route path="/" element={
              <ChatPage />
          } />
        </Routes>
      </Layout>
  );
};
