import { apiClient } from './api-client';
import { getStoredPushEndpoint } from '@/lib/push';
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

  send: (userId: number, body: string): Promise<ChatMessage> => {
    const pushEndpoint = getStoredPushEndpoint();
    return apiClient<ChatMessage>(`/api/v1/messages/thread/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ body }),
      // Tells the backend which browser is sending, so it never notifies the sender's own browser.
      headers: pushEndpoint ? { 'X-Push-Endpoint': pushEndpoint } : undefined,
    });
  },

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

  /** Accept a message request: the chat moves from Requests to the main inbox. */
  acceptRequest: (userId: number): Promise<{ success: boolean; accepted: boolean }> =>
    apiClient<{ success: boolean; accepted: boolean }>(`/api/v1/messages/thread/${userId}/accept`, {
      method: 'POST',
    }),

  /** Delete a chat for me only - the other person keeps their copy. */
  deleteChat: (userId: number): Promise<{ success: boolean }> =>
    apiClient<{ success: boolean }>(`/api/v1/messages/thread/${userId}`, { method: 'DELETE' }),

  /** Block this person: neither of you can message or call the other. */
  block: (userId: number): Promise<{ success: boolean; blocked: boolean }> =>
    apiClient<{ success: boolean; blocked: boolean }>(`/api/v1/messages/thread/${userId}/block`, {
      method: 'POST',
    }),

  unblock: (userId: number): Promise<{ success: boolean; blocked: boolean }> =>
    apiClient<{ success: boolean; blocked: boolean }>(`/api/v1/messages/thread/${userId}/block`, {
      method: 'DELETE',
    }),

  /** Mute a chat: it stops counting in the unread badge. */
  mute: (userId: number): Promise<{ success: boolean; muted: boolean }> =>
    apiClient<{ success: boolean; muted: boolean }>(`/api/v1/messages/thread/${userId}/mute`, {
      method: 'POST',
    }),

  unmute: (userId: number): Promise<{ success: boolean; muted: boolean }> =>
    apiClient<{ success: boolean; muted: boolean }>(`/api/v1/messages/thread/${userId}/mute`, {
      method: 'DELETE',
    }),

  report: (userId: number, reason: string): Promise<{ success: boolean }> =>
    apiClient<{ success: boolean }>(`/api/v1/messages/thread/${userId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  /** Unsend (delete for everyone) a message I sent. */
  unsend: (messageId: number): Promise<UnsendResult> =>
    apiClient<UnsendResult>(`/api/v1/messages/${messageId}`, { method: 'DELETE' }),
};