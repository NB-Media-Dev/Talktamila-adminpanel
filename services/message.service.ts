import { apiClient } from './api-client';
import type {
  ChatMessage,
  ChatUser,
  Conversation,
  MessageSummary,
  ReactionUpdate,
  ThreadResponse,
  UnsendResult,
} from '@/types/Messages';

export const messageService = {
  summary: (): Promise<MessageSummary> =>
    apiClient<MessageSummary>('/api/v1/messages/summary', { method: 'GET' }),

  conversations: (): Promise<Conversation[]> =>
    apiClient<Conversation[]>('/api/v1/messages/conversations', { method: 'GET' }),

  /** Everyone except me. Used by "See all" and the "New message" picker. */
  people: (q = '', limit = 30, offset = 0): Promise<ChatUser[]> => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    params.set('limit', String(limit));
    params.set('offset', String(offset));
    return apiClient<ChatUser[]>(`/api/v1/messages/users?${params.toString()}`, { method: 'GET' });
  },

  thread: (
    userId: number,
    opts: { afterId?: number; beforeId?: number; limit?: number; syncFromId?: number } = {}
  ): Promise<ThreadResponse> => {
    const params = new URLSearchParams();
    if (opts.afterId !== undefined) params.set('after_id', String(opts.afterId));
    if (opts.beforeId !== undefined) params.set('before_id', String(opts.beforeId));
    if (opts.limit !== undefined) params.set('limit', String(opts.limit));
    if (opts.syncFromId !== undefined) params.set('sync_from_id', String(opts.syncFromId));
    const qs = params.toString();
    return apiClient<ThreadResponse>(`/api/v1/messages/thread/${userId}${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    });
  },

  send: (userId: number, body: string): Promise<ChatMessage> =>
    apiClient<ChatMessage>(`/api/v1/messages/thread/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),

  /** Set my reaction on a message I sent or received (replaces my previous one). */
  react: (messageId: number, emoji: string): Promise<ReactionUpdate> =>
    apiClient<ReactionUpdate>(`/api/v1/messages/${messageId}/reaction`, {
      method: 'PUT',
      body: JSON.stringify({ emoji }),
    }),

  unreact: (messageId: number): Promise<ReactionUpdate> =>
    apiClient<ReactionUpdate>(`/api/v1/messages/${messageId}/reaction`, { method: 'DELETE' }),

  /** Mark a chat as read without opening it (inbox 3-dot menu). */
  markRead: (userId: number): Promise<{ success: boolean }> =>
    apiClient<{ success: boolean }>(`/api/v1/messages/thread/${userId}/read`, { method: 'POST' }),

  /** Mark a chat as unread (inbox 3-dot menu). The other person's "Seen" status is not affected. */
  markUnread: (userId: number): Promise<{ success: boolean }> =>
    apiClient<{ success: boolean }>(`/api/v1/messages/thread/${userId}/unread`, { method: 'POST' }),

  /** Delete a chat for me only - the other person keeps their copy. */
  deleteChat: (userId: number): Promise<{ success: boolean }> =>
    apiClient<{ success: boolean }>(`/api/v1/messages/thread/${userId}`, { method: 'DELETE' }),

  /** Unsend (delete for everyone) a message I sent. */
  unsend: (messageId: number): Promise<UnsendResult> =>
    apiClient<UnsendResult>(`/api/v1/messages/${messageId}`, { method: 'DELETE' }),
};