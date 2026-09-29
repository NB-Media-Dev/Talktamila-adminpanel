export interface ChatUser {
  user_id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  bio: string | null;
  followers_count: number;
  is_following: boolean;
  /** Only present on the partner returned by the first page of a thread. */
  blocked_by_me?: boolean;
  blocked_me?: boolean;
  muted?: boolean;
}

/** "text" is normal chat. The story kinds are created automatically when someone
 *  replies to / reacts to a story - sender is the replier, receiver is the story owner.
 *  "call" is a log entry written by the calls WebSocket when a call ends (sender = caller);
 *  its `body` is JSON: {"media": "audio"|"video", "outcome": "...", "seconds": n}. */
export type MessageKind = "text" | "story_reply" | "story_reaction" | "call";

export interface MessageReaction {
  user_id: number;
  emoji: string;
}

/** Small card describing the story a reply/reaction belongs to. */
export interface StoryContext {
  story_id: number;
  media_type: string;
  caption: string | null;
  /** false once the story has expired or been deleted. */
  available: boolean;
}

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  body: string;
  kind: MessageKind;
  /** Only set for story_reply / story_reaction; null if the story row is gone. */
  story: StoryContext | null;
  reactions: MessageReaction[];
  created_at: string;
  read_at: string | null;
  is_mine: boolean;
  /** Client-only: shown while the message is still being sent. */
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
  /** true when there are unread messages OR the chat was marked as unread from the 3-dot menu. */
  is_unread?: boolean;
}

export interface ThreadResponse {
  partner: ChatUser | null;
  messages: ChatMessage[];
  has_more: boolean;
  last_read_by_other_id: number | null;
  /** Only when polling with syncFromId: current reactions for every message from that id on. */
  reactions_sync: Record<string, MessageReaction[]> | null;
  /** Only when polling with syncFromId: ids that still exist from that id on (so unsent messages can be dropped). */
  existing_ids: number[] | null;
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
}