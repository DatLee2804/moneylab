'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Volume2, 
  Maximize, 
  Settings, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  FileText, 
  Star,
  ArrowLeft,
  Menu,
  X,
  Loader2,
  Sparkles,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/utils/utils';
import api from '@/lib/api';

export default function CoursePlayer() {
  const params = useParams();
  
  const [course, setCourse] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [lessonDetail, setLessonDetail] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '20%' });
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('student');
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Setup user and watermark
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserEmail(u.email || '');
        setUserRole(u.role || 'student');
      } catch (e) {}
    }

    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 80) + 10 + '%';
      const left = Math.floor(Math.random() * 80) + 10 + '%';
      setWatermarkPos({ top, left });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Setup URL Masking (Anti-Direct Link Sharing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  // Utility to extract Google Drive ID
  const getGoogleDriveId = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Utility to extract YouTube ID (Bulletproof string operations)
  const getYoutubeId = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    try {
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].substring(0, 11);
      }
      if (url.includes('v=')) {
        return url.split('v=')[1].substring(0, 11);
      }
      if (url.includes('embed/')) {
        return url.split('embed/')[1].substring(0, 11);
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${params.id}`);
        const courseData = res.data;
        setCourse(courseData);
        
        if (courseData.sections?.length > 0) {
          const urlParams = new URLSearchParams(window.location.search);
          const initialLessonId = urlParams.get('lessonId');
          
          let foundLesson = null;
          if (initialLessonId) {
            // Find the lesson in sections
            for (const section of courseData.sections) {
              const lesson = section.lessons?.find((l: any) => l.id === initialLessonId);
              if (lesson) {
                foundLesson = lesson;
                setActiveSection(section.id);
                break;
              }
            }
          }

          if (!foundLesson) {
            const firstSection = courseData.sections[0];
            setActiveSection(firstSection.id);
            if (firstSection.lessons?.length > 0) {
              foundLesson = firstSection.lessons[0];
            }
          }
          
          if (foundLesson) {
            setActiveLesson(foundLesson);
          }
        }

        // Check enrollment
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const u = JSON.parse(userStr);
            if (['admin', 'manager'].includes(u.role?.toLowerCase())) {
              setIsEnrolled(true);
            } else if (u.role?.toLowerCase() === 'instructor' && courseData.instructorId === u.id) {
              setIsEnrolled(true);
            } else {
              const enRes = await api.get('/enrollments/me');
              const isUserEnrolled = enRes.data.some((en: any) => en.courseId === courseData.id);
              setIsEnrolled(isUserEnrolled);
            }
          }
        } catch (e) {
          console.error('Failed to check enrollment status', e);
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  // Fetch lesson details
  useEffect(() => {
    const fetchLessonDetail = async () => {
      if (!activeLesson?.id) return;
      try {
        const res = await api.get(`/lessons/${activeLesson.id}`);
        setLessonDetail(res.data);
      } catch (error) {
        console.error('Failed to fetch lesson detail:', error);
      }
    };
    
    fetchLessonDetail();
  }, [activeLesson?.id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!activeLesson?.id) return;
      try {
        const res = await api.get(`/lesson-comments/lesson/${activeLesson.id}`);
        setComments(res.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [activeLesson?.id]);

  const submitComment = async () => {
    if (!newComment.trim() || !activeLesson?.id) return;
    setIsSubmittingComment(true);
    try {
      const res = await api.post(`/lesson-comments/${activeLesson.id}`, { content: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (e) {
      console.error('Failed to submit comment:', e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Complete
  const markAsCompleted = async (lessonId: string) => {
    try {
      await api.patch(`/enrollments/lessons/${lessonId}/complete`);
      if (!completedLessons.includes(lessonId)) {
        setCompletedLessons([...completedLessons, lessonId]);
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      alert('Không thể đánh dấu hoàn thành, vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang tải bài học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <h2 className="text-white text-xl">Không tìm thấy khóa học</h2>
        <Link href={`/dashboard/${userRole === 'manager' ? 'manager/courses' : userRole === 'admin' ? 'admin/courses' : userRole === 'instructor' ? 'instructor/courses' : 'student'}`} className="ml-4 text-[#baff02] underline">Quay lại</Link>
      </div>
    );
  }

  // Calculate progress safely
  const totalLessons = course.sections?.reduce((acc: number, section: any) => acc + (section.lessons?.length || 0), 0) || 0;
  // Use local state or fetched progress in the future (for now just use mocked progress until API supplies it)
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans selection:bg-[#baff02]/30 selection:text-[#baff02]">
      {/* Top Navigation */}
      <header className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/${userRole === 'manager' ? 'manager/courses' : userRole === 'admin' ? 'admin/courses' : userRole === 'instructor' ? 'instructor/courses' : 'student'}`} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-white truncate max-w-md">{course.title} - {activeLesson?.title || 'Đang tải'}</h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Money Lab Academy</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#baff02]" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{progressPercent}% HOÀN THÀNH</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden relative">
        {/* Left Column: Video Player */}
        <main className={cn(
          "flex-grow flex flex-col bg-black transition-all duration-300 overflow-y-auto",
          isSidebarOpen ? "lg:mr-0" : ""
        )}>
          <div className="w-full aspect-video shrink-0 xl:max-h-[80vh] relative flex items-center justify-center group overflow-hidden bg-black">
            {/* Video Player IFrame */}
            <div className="absolute inset-0 w-full h-full">

              {lessonDetail ? (
                (!isEnrolled && !course?.isFree && !activeLesson?.isPreview) ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6 px-4 text-center z-10 relative">
                    <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border border-white/5">
                      <Lock size={32} className="text-[#baff02]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Nội dung trả phí</h3>
                      <p className="text-sm text-gray-400">Bạn cần đăng ký khóa học để xem nội dung bài học này.</p>
                    </div>
                    <Link 
                      href={`/courses/${course?.id}`}
                      className="px-6 py-3 bg-[#baff02] text-black font-bold rounded-xl hover:bg-[#8ec401] transition-colors mt-2"
                    >
                      Đăng ký ngay
                    </Link>
                  </div>
                ) : lessonDetail.videoEmbedUrl ? (
                  <iframe
                    src={lessonDetail.videoEmbedUrl}
                    loading="lazy"
                    style={{ border: 0, width: '100%', height: '100%' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                    className="absolute inset-0 pointer-events-auto bg-black"
                  ></iframe>
                ) : lessonDetail.videoUrl ? (
                  getYoutubeId(lessonDetail.videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(lessonDetail.videoUrl)}`}
                      style={{ border: 0, width: '100%', height: '100%' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen={true}
                      className="absolute inset-0 pointer-events-auto bg-black"
                    ></iframe>
                  ) : getGoogleDriveId(lessonDetail.videoUrl) ? (
                    <iframe
                      src={`https://drive.google.com/file/d/${getGoogleDriveId(lessonDetail.videoUrl)}/preview`}
                      style={{ border: 0, width: '100%', height: '100%' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen={true}
                      className="absolute inset-0 pointer-events-auto bg-black"
                    ></iframe>
                  ) : (
                    <video 
                      src={lessonDetail.videoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      onEnded={() => {
                        if (activeLesson) {
                          markAsCompleted(activeLesson.id);
                        }
                      }}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <Play size={48} className="opacity-20" />
                    <p className="font-bold text-sm">Chưa có video bài giảng</p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>
            
            {/* Watermark Overlay */}
            {userEmail && (
              <motion.div 
                animate={{ top: watermarkPos.top, left: watermarkPos.left }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute z-20 pointer-events-none select-none"
              >
                <div className="px-4 py-2 bg-black/20 backdrop-blur-[2px] border border-white/10 rounded-lg text-white/30 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {userEmail}
                </div>
              </motion.div>
            )}
          </div>

          {/* Video Info Tabs */}
          <div className="bg-[#0a0a0a] border-t border-white/5 p-6 md:p-10 shrink-0">
            <div className="flex space-x-8 border-b border-white/5 mb-8 overflow-x-auto scrollbar-hide">
              {['Tổng quan', 'Thảo luận', 'Tài liệu'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-sm font-bold transition-all relative whitespace-nowrap outline-none",
                    activeTab === tab ? "text-[#baff02]" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {tab}
                  {activeTab === tab && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#baff02]" />}
                </button>
              ))}
            </div>

            <div className="max-w-4xl flex justify-between items-start">
              <div className="flex-1 mr-8">
                {activeTab === 'Tổng quan' && (
                  <div>
                    <h2 className="text-2xl font-black text-white mb-4">{activeLesson?.title || 'Đang tải...'}</h2>
                    <div 
                      className="text-gray-400 leading-relaxed font-bold prose dark:prose-invert prose-sm"
                      dangerouslySetInnerHTML={{ __html: lessonDetail?.content || 'Chưa có mô tả chi tiết cho bài học này.' }}
                    />
                  </div>
                )}

                {activeTab === 'Thảo luận' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Thảo luận ({comments.length})</h3>
                    
                    <div className="flex space-x-4 mb-8">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white shrink-0 font-bold">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 space-y-3">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Thêm bình luận của bạn..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#baff02]/50 focus:ring-1 focus:ring-[#baff02]/50 min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={submitComment}
                            disabled={!newComment.trim() || isSubmittingComment}
                            className="px-4 py-2 bg-[#baff02] text-black font-bold text-sm rounded-lg hover:bg-[#baff02]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                          >
                            {isSubmittingComment ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                            <span>Gửi bình luận</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 shrink-0 font-bold overflow-hidden border border-white/10">
                            {comment.user?.avatar ? (
                              <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
                            ) : (
                              (comment.user?.name || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-bold text-white">{comment.user?.name || 'Ẩn danh'}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString('vi-VN')} {new Date(comment.createdAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'Tài liệu' && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Tài liệu đính kèm</h3>
                    <p className="text-gray-500 text-sm">Chưa có tài liệu đính kèm cho bài học này.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => activeLesson && markAsCompleted(activeLesson.id)}
                className={cn(
                  "px-6 py-3 border rounded-xl font-bold uppercase text-xs transition-colors shrink-0 flex items-center space-x-2",
                  activeLesson && completedLessons.includes(activeLesson.id) 
                    ? "bg-[#baff02] text-black border-[#baff02]"
                    : "bg-[#baff02]/10 border-[#baff02]/20 text-[#baff02] hover:bg-[#baff02] hover:text-black"
                )}
              >
                {activeLesson && completedLessons.includes(activeLesson.id) ? (
                  <>
                    <CheckCircle2 size={16} /> <span>Đã hoàn thành</span>
                  </>
                ) : (
                  <>
                    <Circle size={16} /> <span>Đánh dấu hoàn thành</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Right Column: Curriculum Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 right-0 w-full md:w-96 bg-[#141414] border-l border-white/5 z-40 transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
            <h3 className="font-black text-white uppercase tracking-widest text-sm">Nội dung khóa học</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {course.sections?.map((section: any, idx: number) => (
              <div key={section.id} className="border-b border-white/5">
                <button 
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors group border-none outline-none"
                >
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">CHƯƠNG {idx + 1}</p>
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight">{section.title}</h4>
                  </div>
                  {activeSection === section.id ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </button>

                <AnimatePresence>
                  {activeSection === section.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/20"
                    >
                      {section.lessons?.map((lesson: any, lIdx: number) => (
                        <button 
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={cn(
                            "w-full px-6 py-4 flex items-start space-x-4 hover:bg-white/5 transition-all text-left border-l-4 outline-none",
                            activeLesson?.id === lesson.id ? "bg-[#baff02]/10 border-[#baff02]" : "border-transparent"
                          )}
                        >
                          <div className="mt-1">
                            {completedLessons.includes(lesson.id) ? (
                              <CheckCircle2 size={18} className="text-[#baff02]" />
                            ) : (
                              <Circle size={18} className="text-gray-600" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <p className={cn(
                              "text-sm font-bold mb-1 transition-colors line-clamp-2",
                              activeLesson?.id === lesson.id ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                            )}>
                              {idx + 1}.{lIdx + 1} {lesson.title}
                            </p>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                  <Play size={10} />
                                  <span>{lesson.duration || 0}m</span>
                                </div>
                                {(lesson.isPreview || (course && course.isFree)) && (
                                  <div className="flex items-center space-x-1 text-[9px] font-black text-[#baff02] uppercase tracking-widest bg-[#baff02]/10 px-1.5 py-0.5 rounded">
                                    <Sparkles size={8} className="mr-1" />
                                    <span>{course?.isFree ? 'Miễn phí' : 'Học thử'}</span>
                                  </div>
                                )}
                              </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
