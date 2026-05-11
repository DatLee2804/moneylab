'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  BookOpen, 
  Search, 
  Filter, 
  ChevronRight, 
  Eye,
  Settings as SettingsIcon,
  X,
  Lock,
  Upload,
  RefreshCw,
  Save,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import RichTextEditor from '@/components/common/RichTextEditor';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function InstructorCoursesPage() {
  const [selectedCourse, setSelectedCourse] = React.useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<any | null>(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<any | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = React.useState(false);
  const [editingSession, setEditingSession] = React.useState<any | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = React.useState(false);

  const [courseFormData, setCourseFormData] = React.useState({
    title: '',
    name: '', // Added for compatibility with name field in modal
    sessions: 0,
    category: 'AI',
    originalPrice: '',
    discountPrice: '',
    thumbnail: '',
    content: '',
    shortDescription: '',
    introVideoUrl: '',
    isFree: false
  });

  const [sectionFormData, setSectionFormData] = React.useState({
    title: ''
  });

  const [sessionFormData, setSessionFormData] = React.useState({
    title: '',
    summary: '',
    videoUrl: '',
    isPreview: false
  });

  const [currentSectionId, setCurrentSectionId] = React.useState<string | null>(null);

  const [courses, setCourses] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/me');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const handleSelectCourse = async (course: any) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/courses/${course.id}`);
      setSelectedCourse(response.data);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCourseDetails = async () => {
    if (!selectedCourse) return;
    try {
      const response = await api.get(`/courses/${selectedCourse.id}`);
      setSelectedCourse(response.data);
    } catch (error) {
      console.error('Failed to refresh course details:', error);
    }
  };

  const handleOpenCourseModal = (course: any | null = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        title: course.title || '',
        name: course.title || '',
        sessions: course.sessions || 0,
        category: course.category || 'AI',
        originalPrice: course.price || 0,
        discountPrice: course.discountPrice || 0,
        thumbnail: course.coverImage || '',
        content: course.description || '',
        shortDescription: course.shortDescription || '',
        introVideoUrl: course.introVideoUrl || '',
        isFree: course.isFree || false
      });
    } else {
      setEditingCourse(null);
      setCourseFormData({
        title: '',
        name: '',
        sessions: 0,
        category: 'AI',
        originalPrice: '',
        discountPrice: '',
        thumbnail: '',
        content: '',
        shortDescription: '',
        introVideoUrl: '',
        isFree: false
      });
    }
    setIsCourseModalOpen(true);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseFormData({ ...courseFormData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSessionFormData({ ...sessionFormData, videoUrl: response.data.url });
      alert('Tải video lên thành công!');
    } catch (error: any) {
      console.error('Failed to upload video:', error);
      const errorMsg = error.response?.data?.message || 'Tải video thất bại. Vui lòng thử lại.';
      alert(errorMsg);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.name && !courseFormData.title) {
       alert("Vui lòng nhập tên khoá học");
       return;
    }

    try {
      const payload = {
        title: courseFormData.name || courseFormData.title,
        description: courseFormData.content || "Chưa có mô tả chi tiết.",
        shortDescription: courseFormData.shortDescription || "",
        introVideoUrl: courseFormData.introVideoUrl || "",
        coverImage: courseFormData.thumbnail || null,
        price: Number(courseFormData.originalPrice?.toString().replace(/[^0-9]/g, '')) || 0,
        discountPrice: Number(courseFormData.discountPrice?.toString().replace(/[^0-9]/g, '')) || 0,
        category: courseFormData.category || 'AI',
        isFree: courseFormData.isFree,
      };

      if (editingCourse) {
        const response = await api.patch(`/courses/${editingCourse.id}`, payload);
        setCourses(courses.map(c => c.id === editingCourse.id ? response.data : c));
      } else {
        const response = await api.post('/courses', payload);
        const newCourse = response.data;
        // Backend returns the plain course but Table might expect more (like counts)
        // Refresh to get consistent data
        await fetchCourses(); 
        setIsCourseModalOpen(false);
      }
      setIsCourseModalOpen(false);
      alert(editingCourse ? 'Cập nhật thành công!' : 'Tạo khoá học thành công!');
    } catch (error: any) {
      console.error('Failed to save course:', error);
      const errorMsg = error.response?.data?.message || 'Không thể lưu khoá học. Vui lòng thử lại sau.';
      alert(Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg);
    }
  };

  const handleOpenSectionModal = (section: any | null = null) => {
    if (section) {
      setEditingSection(section);
      setSectionFormData({ title: section.title });
    } else {
      setEditingSection(null);
      setSectionFormData({ title: '' });
    }
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await api.patch(`/sections/${editingSection.id}`, sectionFormData);
      } else {
        await api.post(`/courses/${selectedCourse.id}/sections`, sectionFormData);
      }
      await refreshCourseDetails();
      setIsSectionModalOpen(false);
    } catch (error) {
      console.error('Failed to save section:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá chương này cùng tất cả bài học bên trong?')) {
      try {
        await api.delete(`/sections/${sectionId}`);
        await refreshCourseDetails();
      } catch (error) {
        console.error('Failed to delete section:', error);
      }
    }
  };

  const handleOpenSessionModal = (sectionId: string, lesson: any | null = null) => {
    setCurrentSectionId(sectionId);
    if (lesson) {
      setEditingSession(lesson);
      setSessionFormData({
        title: lesson.title,
        summary: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        isPreview: lesson.isPreview || false
      });
    } else {
      setEditingSession(null);
      setSessionFormData({
        title: '',
        summary: '',
        videoUrl: '',
        isPreview: false
      });
    }
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: sessionFormData.title,
        content: sessionFormData.summary,
        videoUrl: sessionFormData.videoUrl,
        isPreview: sessionFormData.isPreview,
      };

      if (editingSession) {
        await api.patch(`/lessons/${editingSession.id}`, payload);
      } else {
        await api.post(`/courses/sections/${currentSectionId}/lessons`, payload);
      }
      await refreshCourseDetails();
      setIsSessionModalOpen(false);
    } catch (error) {
      console.error('Failed to save lesson:', error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài học này?')) {
      try {
        await api.delete(`/lessons/${id}`);
        await refreshCourseDetails();
      } catch (error) {
        console.error('Failed to delete lesson:', error);
      }
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá khoá học này?')) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };


  const renderCourseDesign = () => (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <button onClick={() => setSelectedCourse(null)} className="hover:text-[#baff02] transition-colors">Quản lý khóa học</button>
          <ChevronRight size={14} />
          <span className="font-bold text-white line-clamp-1">{selectedCourse.title}</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-white">Thiết kế khóa học</h1>
          <button 
            onClick={() => handleOpenSectionModal()}
            className="flex items-center space-x-2 px-6 py-3 bg-[#baff02] text-[#0f172a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Thêm chương mới</span>
          </button>
        </div>
      </header>

      <div className="space-y-12">
        {selectedCourse.sections?.length > 0 ? (
          selectedCourse.sections.map((section: any, sectionIndex: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={section.id} 
              className="group"
            >
              <div className="flex justify-between items-end mb-4 px-2">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-[10px] font-black text-[#baff02] bg-[#baff02]/10 px-2 py-0.5 rounded uppercase tracking-widest">Chương {sectionIndex + 1}</span>
                    <h3 className="text-xl font-black text-white tracking-tight">{section.title}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleOpenSessionModal(section.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#baff02]/10 text-[#baff02] rounded-xl hover:bg-[#baff02] hover:text-[#0f172a] transition-all text-xs font-black uppercase tracking-wider"
                  >
                    <Plus size={14} />
                    <span>Thêm bài học</span>
                  </button>
                  <button 
                    onClick={() => handleOpenSectionModal(section)}
                    className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                    title="Sửa chương"
                  >
                    <SettingsIcon size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    title="Xoá chương"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">STT</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tên Bài Học</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-1/3">Nội dung tóm tắt</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Video</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {section.lessons?.length > 0 ? section.lessons.map((lesson: any, lessonIndex: number) => (
                        <tr key={lesson.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group/row">
                          <td className="p-6 text-sm font-black text-gray-300 group-hover/row:text-[#baff02] transition-colors">{(lessonIndex + 1).toString().padStart(2, '0')}</td>
                          <td className="p-6">
                            <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{lesson.title}</div>
                          </td>
                          <td className="p-6 text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                            <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: lesson.content || 'Chưa có mô tả' }} />
                          </td>
                          <td className="p-6">
                            {lesson.videoUrl ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-[#baff02] animate-pulse" />
                                <span className="text-[10px] text-[#baff02] font-black uppercase tracking-widest">Đã có Video</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Chưa có Video</span>
                            )}
                          </td>
                          <td className="p-6">
                            {lesson.isPreview && (
                              <div className="flex items-center space-x-2">
                                <Sparkles size={14} className="text-amber-400" />
                                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Học thử</span>
                              </div>
                            )}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleOpenSessionModal(section.id, lesson)}
                                className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm" 
                              >
                                <SettingsIcon size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSession(lesson.id)}
                                className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm" 
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-12 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chưa có bài học nào trong chương này</p>
                            <button 
                               onClick={() => handleOpenSessionModal(section.id)}
                               className="mt-4 text-[10px] font-black text-[#baff02] hover:underline uppercase tracking-widest"
                            >
                               + Thêm bài học đầu tiên
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl mb-6 text-gray-300">
              <LayoutDashboard size={48} />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Chưa có nội dung đào tạo</h3>
            <p className="text-sm text-gray-400 font-medium mb-8 max-w-xs text-center">Bắt đầu bằng cách tạo chương (section) đầu tiên để tổ chức các bài học của bạn.</p>
            <button 
              onClick={() => handleOpenSectionModal()}
              className="px-10 py-4 bg-[#baff02] text-[#0f172a] rounded-2xl font-black shadow-xl shadow-[#baff02]/20 hover:scale-105 transition-all"
            >
              Thêm chương đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout role="instructor" title={selectedCourse ? "Thiết kế khóa học" : "Quản lý khóa học"}>
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-[#baff02] animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải danh sách khoá học...</p>
          </div>
        ) : selectedCourse ? renderCourseDesign() : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Khóa học của bạn</h2>
              <button 
                onClick={() => handleOpenCourseModal()}
                className="flex items-center space-x-2 px-6 py-3 bg-[#baff02] text-[#0f172a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:bg-green-700 transition-all"
              >
                <Plus size={18} />
                <span>Tạo khóa học mới</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-none border-y border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden -mx-8 lg:-mx-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">STT</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider"></th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Tên Khoá học</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Số Buổi</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Thể loại</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Giá gốc</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Giá KM</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Trạng thái</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider w-1/4">Nội dung</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {courses.map((course, index) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-400">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="relative w-20 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                            {course.coverImage ? (
                              <Image src={course.coverImage} fill className="object-cover" alt={course.title} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <BookOpen size={16} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white max-w-xs">{course.title}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{course.lessons || 0}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <span className="px-2.5 py-1 bg-[#baff02]/20 text-[#baff02] rounded-lg text-[10px] font-black uppercase tracking-wider">{course.category || 'AI'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-400 line-through">
                          {course.isFree ? '-' : `${course.price?.toLocaleString()}đ`}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#baff02]">
                          {course.isFree || Number(course.price) === 0 ? 'Khoá học miễn phí' : `${course.discountPrice?.toLocaleString() || course.price?.toLocaleString()}đ`}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center space-x-1.5",
                            course.status === 'APPROVED' 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                              : course.status === 'REJECTED'
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          )}>
                            {course.status === 'APPROVED' ? 'Đã duyệt' : course.status === 'REJECTED' ? 'Bị từ chối' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {course.description ? (
                             <div className="line-clamp-2">
                               {stripHtml(course.description)}
                             </div>
                          ) : 'Chưa có mô tả'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <button 
                              onClick={() => handleSelectCourse(course)}
                              className="flex items-center space-x-2 px-3 py-1.5 bg-[#baff02]/10 text-[#baff02] text-xs font-bold rounded-lg hover:bg-[#baff02] hover:text-[#0f172a] transition-all"
                            >
                              <LayoutDashboard size={14} />
                              <span>Thiết kế khoá học</span>
                            </button>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleOpenCourseModal(course)}
                                className="flex-grow flex items-center justify-center space-x-1 px-3 py-1.5 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-lg hover:bg-amber-500 hover:text-white transition-all"
                              >
                                <SettingsIcon size={14} />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="flex-grow flex items-center justify-center space-x-1 px-3 py-1.5 bg-rose-500/10 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                              >
                                <X size={14} />
                                <span>Xoá</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-y-auto border border-gray-100 custom-scrollbar"
            >
              <form onSubmit={handleSaveCourse} className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-gray-900">
                    {editingCourse ? 'Cập nhật khoá học' : 'Tạo khoá học mới'}
                  </h2>
                  <button type="button" onClick={() => setIsCourseModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên khoá học</label>
                    <input 
                      type="text" 
                      value={courseFormData.name || ''}
                      onChange={(e) => setCourseFormData({...courseFormData, name: e.target.value})}
                      placeholder="Nhập tên khóa học..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thể loại</label>
                    <select 
                      value={courseFormData.category || 'AI'}
                      onChange={(e) => setCourseFormData({...courseFormData, category: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all cursor-pointer" 
                    >
                      <option value="Đầu tư">Đầu tư</option>
                      <option value="AI & Công nghệ">AI & Công nghệ</option>
                      <option value="Marketing & Mạng xã hội">Marketing & Mạng xã hội</option>
                      <option value="Vibe Coding">Vibe Coding</option>
                      <option value="Tài chính">Tài chính</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mô tả ngắn</label>
                    <input 
                      type="text" 
                      value={courseFormData.shortDescription || ''}
                      onChange={(e) => setCourseFormData({...courseFormData, shortDescription: e.target.value})}
                      placeholder="Chiến lược toàn diện cho Fanpage, Group Facebook..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link Video giới thiệu (YouTube/Vimeo/Drive)</label>
                    <input 
                      type="text" 
                      value={courseFormData.introVideoUrl || ''}
                      onChange={(e) => setCourseFormData({...courseFormData, introVideoUrl: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số buổi</label>
                    <input 
                      type="number" 
                      value={courseFormData.sessions || 0}
                      onChange={(e) => setCourseFormData({...courseFormData, sessions: parseInt(e.target.value) || 0})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all" 
                    />
                  </div>
                  <div className="col-span-2 space-y-4 py-4 border-y border-gray-100">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chế độ học phí</label>
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
                      <button 
                        type="button"
                        onClick={() => setCourseFormData({...courseFormData, isFree: false})}
                        className={cn(
                          "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                          !courseFormData.isFree ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        Trả phí
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCourseFormData({...courseFormData, isFree: true})}
                        className={cn(
                          "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                          courseFormData.isFree ? "bg-[#baff02] text-[#0f172a] shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        Miễn phí
                      </button>
                    </div>
                  </div>

                  {!courseFormData.isFree && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giá gốc</label>
                        <input 
                          type="text" 
                          value={courseFormData.originalPrice || '0'}
                          onChange={(e) => setCourseFormData({...courseFormData, originalPrice: e.target.value})}
                          placeholder="Ví dụ: 2.500.000đ"
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giá KM</label>
                        <input 
                          type="text" 
                          value={courseFormData.discountPrice || '0'}
                          onChange={(e) => setCourseFormData({...courseFormData, discountPrice: e.target.value})}
                          placeholder="Ví dụ: 1.299.000đ"
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ảnh bìa khoá học</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#baff02] hover:bg-gray-100 transition-all overflow-hidden group"
                    >
                      {courseFormData.thumbnail ? (
                        <>
                          <Image src={courseFormData.thumbnail} fill className="object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-gray-900 text-xs font-bold border border-gray-200">
                               Thay đổi ảnh bìa
                             </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">Click để tải lên ảnh bìa</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden" 
                        onChange={handleThumbnailUpload}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giới thiệu khoá học</label>
                    <RichTextEditor 
                      content={courseFormData.content}
                      onChange={(content) => setCourseFormData({...courseFormData, content})}
                      placeholder="Mô tả chi tiết về khoá học của bạn..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors">Hủy</button>
                  <button type="submit" className="px-10 py-4 bg-[#baff02] text-[#0f172a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:bg-green-700 transition-all font-sans">
                    Lưu khoá học
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isSessionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSessionModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-y-auto border border-gray-100 dark:border-gray-700 custom-scrollbar"
            >
              <form onSubmit={handleSaveSession} className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">
                    {editingSession ? 'Cập nhật bài học' : 'Thêm bài học mới'}
                  </h2>
                  <button type="button" onClick={() => setIsSessionModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiêu đề bài học</label>
                    <input 
                      type="text" 
                      value={sessionFormData.title}
                      onChange={(e) => setSessionFormData({...sessionFormData, title: e.target.value})}
                      placeholder="Nhập tiêu đề học..."
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Video bài học</label>
                    <div className="flex flex-col space-y-3">
                      <div className="relative flex items-center space-x-2">
                        <input 
                          type="text" 
                          value={sessionFormData.videoUrl}
                          onChange={(e) => setSessionFormData({...sessionFormData, videoUrl: e.target.value})}
                          placeholder="Link từ Google Drive/Vimeo/Youtube..."
                          className="flex-grow px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all placeholder:text-gray-400" 
                        />
                        <button 
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={isUploadingVideo}
                          className={cn(
                            "px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 transition-all",
                            isUploadingVideo 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-[#baff02] text-[#0f172a] hover:scale-105 active:scale-95 shadow-lg shadow-[#baff02]/20"
                          )}
                        >
                          {isUploadingVideo ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Đang tải...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={14} />
                              <span>Tải lên</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={videoInputRef}
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2">
                        Dán link trực tiếp hoặc bấm "Tải lên" để lưu video vào Google Drive
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tóm tắt nội dung</label>
                    <RichTextEditor 
                      content={sessionFormData.summary}
                      onChange={(summary) => setSessionFormData({...sessionFormData, summary})}
                      placeholder="Những kiến thức chính sẽ học trong bài này..."
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-amber-500/5 rounded-[2rem] border border-amber-500/10">
                    <div className="flex items-center h-6">
                      <input
                        id="isPreview"
                        type="checkbox"
                        checked={sessionFormData.isPreview}
                        onChange={(e) => setSessionFormData({...sessionFormData, isPreview: e.target.checked})}
                        className="w-5 h-5 text-[#baff02] bg-gray-800 border-gray-700 rounded focus:ring-[#baff02] focus:ring-offset-gray-900"
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label htmlFor="isPreview" className="font-black text-amber-500 uppercase tracking-widest text-[10px] cursor-pointer selection:hidden">Cho phép học viên học thử (Free Preview)</label>
                      <p className="text-gray-500 text-[9px] font-bold mt-0.5">Học viên chưa đăng ký có thể xem bài này để tham khảo.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsSessionModalOpen(false)} className="px-8 py-4 text-sm font-bold text-gray-500 hover:text-[#0f172a] transition-colors">Hủy</button>
                  <button type="submit" className="px-10 py-4 bg-[#baff02] text-[#0f172a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:bg-green-700 transition-all font-sans">
                    Lưu bài học
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {isSectionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSectionModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              <form onSubmit={handleSaveSection} className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">
                    {editingSection ? 'Sửa thông tin chương' : 'Thêm chương học mới'}
                  </h2>
                  <button type="button" onClick={() => setIsSectionModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tên chương (Ví dụ: Giới thiệu, Kỹ thuật nâng cao...)</label>
                    <input 
                      type="text" 
                      value={sectionFormData.title}
                      onChange={(e) => setSectionFormData({...sectionFormData, title: e.target.value})}
                      placeholder="Nhập tên chương..."
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] focus:outline-none transition-all" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsSectionModalOpen(false)} className="px-8 py-4 text-sm font-bold text-gray-500">Hủy</button>
                  <button type="submit" className="px-10 py-4 bg-[#baff02] text-[#0f172a] rounded-2xl font-black shadow-lg shadow-[#baff02]/20 hover:scale-105 transition-all">
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
