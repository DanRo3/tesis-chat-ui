export interface Chats {
    uid: string;
    slug: string | null;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    registered_by:string;
    registered_by_username:string;
}

export interface ChatDetails {
  chat: {
    uid: string;
    slug: string | null;
    createdAt: string;
    updatedAt: string;
    chat_room: string;
    chat_messages: Message[]
    title: string;
    description: string;
    registered_by:string;
    registered_by_username:string;
  }
}


export interface GetConversationsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results:{
        chats: Chats[];
    };
}


export interface Messages {
    rol: 'user' | 'assistant';
    content: string;
    image_data?: string[];
  }


export interface Message {
  uid: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  chat_room: string;
  text_message: string;
  rol: 'user' | 'assistant';
  image?: string | null;
}

export interface SendMessage {
    text_message: string;
    image?: File;
}
  