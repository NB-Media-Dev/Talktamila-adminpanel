export interface ChatUser {
  user_id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  bio: string | null;
  followers_count: number;
  is_following: boolean;
  blocked_by_me?: boolean;
  blocked_me?: boolean;
  muted?: boolean;
}

export type MessageKind = "text" | "story_reply" | "story_reaction" | "call";

export interface MessageReaction {
  user_id: number;
  emoji: string;
}

export interface StoryContext {
  story_id: number;
  media_type: string;
  caption: string | null;
  available: boolean;
}

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  body: string;
  kind: MessageKind;
  story: StoryContext | null;
  reactions: MessageReaction[];
  created_at: string;
  read_at: string | null;
  is_mine: boolean;
  pending?: boolean;
}

export interface Conversation {
  partner: ChatUser;
  last_message: {
    id: number;
    body: string;
    kind: MessageKind;
    created_at: string;
    is_mine: boolean;
    read_at: string | null;
  };
  unread_count: number;
  is_unread?: boolean;
  is_request?: boolean;
}

export interface RequestState {
  is_request: boolean;
  request_sent: boolean;
  can_send: boolean;
}

export interface ThreadResponse {
  partner: ChatUser | null;
  messages: ChatMessage[];
  has_more: boolean;
  last_read_by_other_id: number | null;
  reactions_sync: Record<string, MessageReaction[]> | null;
  existing_ids: number[] | null;
  request?: RequestState;
}

export interface UnsendResult {
  success: boolean;
  message_id: number;
}

export interface ReactionUpdate {
  message_id: number;
  reactions: MessageReaction[];
}

export interface MessageSummary {
  latest_message_id: number;
  unread_conversations: number;
  request_unread?: number;
}