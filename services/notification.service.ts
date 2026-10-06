import { apiClient } from './api-client';

export interface NotificationItem {
  id: number;
  user_id: number;
  /** Backend types: 'story_like' | 'story_reply' | 'story_share' | 'story_react' | 'follow' | 'comment' | 'like' | 'story' | 'new_message' | 'message_react' */
  type: string;
  message: string | null;
  reference_id: number | null;
  is_read: boolean;
  created_at: string; // ISO string
  /** Who triggered this notification — used for deep-link navigation */
  actor_id: number | null;
  actor_username: string | null;
}

const BASE = '/api/v1/notifications';

export const notificationService = {
  /** Fetch the authenticated user's notifications */
  async getNotifications(limit = 50): Promise<NotificationItem[]> {
    return apiClient<NotificationItem[]>(`${BASE}?limit=${limit}`);
  },

  /** Mark a single notification as read */
  async markRead(notificationId: number): Promise<void> {
    await apiClient<{ success: boolean }>(`${BASE}/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  /** Mark every notification as read */
  async markAllRead(): Promise<void> {
    await apiClient<{ success: boolean }>(`${BASE}/read-all`, {
      method: 'PATCH',
    });
  },

  /** Delete a single notification */
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient<{ success: boolean }>(`${BASE}/${notificationId}`, {
      method: 'DELETE',
    });
  },
};
