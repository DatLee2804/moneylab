'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from './SocketProvider';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/utils/utils';

export const NotificationBell = () => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }
    return () => {
      if (socket) {
        socket.off('new_notification');
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
                <h3 className="font-bold text-white">Thông báo</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-[#baff02] hover:underline">
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Không có thông báo nào</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 border-b border-white/5 transition-colors cursor-pointer",
                        n.isRead ? "bg-transparent hover:bg-white/5" : "bg-white/5 hover:bg-white/10"
                      )}
                      onClick={() => !n.isRead && markAsRead(n.id)}
                    >
                      <h4 className={cn("text-sm mb-1", n.isRead ? "text-gray-300" : "text-white font-bold")}>{n.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{n.message}</p>
                      <span className="text-[10px] text-gray-600">{new Date(n.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
