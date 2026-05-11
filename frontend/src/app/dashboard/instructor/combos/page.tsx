'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Search, Eye, Edit, Trash2, X, Image as ImageIcon, BadgePercent } from 'lucide-react';
import { cn } from '@/utils/utils';
import api from '@/lib/api';
import RichTextEditor from '@/components/common/RichTextEditor';

export default function InstructorCombosPage() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editComboId, setEditComboId] = useState('');
  
  // States for new combo
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState('');

  useEffect(() => {
    fetchCombos();
    fetchAvailableCourses();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await api.get('/courses/me?isCombo=true');
      setCombos(response.data || []);
    } catch (error) {
      console.error('Error fetching combos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await api.get('/courses/me?isCombo=false');
      // Cho phép chọn tất cả các khóa học hiện có của giảng viên
      const allCourses = response.data || [];
      setAvailableCourses(allCourses);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditComboId('');
    setTitle('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setCategory('');
    setSelectedCourses([]);
    setCoverImage(null);
    setExistingCoverImageUrl('');
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (combo: any) => {
    setIsEditMode(true);
    setEditComboId(combo.id);
    setTitle(combo.title);
    setDescription(combo.description);
    setPrice(combo.price?.toString() || '');
    setDiscountPrice(combo.discountPrice?.toString() || '');
    setCategory(combo.category || '');
    setSelectedCourses(combo.includedCourses?.map((c: any) => c.id) || []);
    setCoverImage(null);
    setExistingCoverImageUrl(combo.coverImage || '');
    setIsCreateModalOpen(true);
  };

  const handleDeleteCombo = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa combo này không?')) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCombos();
    } catch (error: any) {
      console.error('Error deleting combo:', error);
      alert('Không thể xóa combo');
    }
  };

  const handleSubmitCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất 1 khóa học cho combo');
      return;
    }

    try {
      let coverImageUrl = existingCoverImageUrl;
      if (coverImage) {
        const formData = new FormData();
        formData.append('file', coverImage);
        const uploadRes = await api.post('/uploads/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        coverImageUrl = uploadRes.data.url;
      }

      const comboData = {
        title,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        category: category || 'Combo',
        isCombo: true,
        includedCourseIds: selectedCourses,
        coverImage: coverImageUrl
      };

      let response;
      if (isEditMode) {
        response = await api.patch(`/courses/${editComboId}`, comboData);
      } else {
        response = await api.post('/courses', comboData);
      }

      if (response.status === 200 || response.status === 201) {
        setIsCreateModalOpen(false);
        fetchCombos();
      }
    } catch (error: any) {
      console.error('Error saving combo:', error);
      alert(`Lỗi: ${error.response?.data?.message || 'Không thể lưu combo'}`);
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  return (
    <DashboardLayout role="instructor" title="Combo Khóa Học">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm combo..." 
            className="w-full pl-10 pr-4 py-2 bg-[#141414] border border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-[#baff02]/20 text-white placeholder:text-gray-600 transition-all"
          />
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2 bg-[#baff02] text-[#0a0a0a] rounded-xl font-bold hover:bg-[#d0ff00] transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Tạo Combo Mới</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#baff02]/20 border-t-[#baff02] rounded-full animate-spin"></div>
        </div>
      ) : combos.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] rounded-3xl border border-white/5">
          <BadgePercent size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-black text-white mb-2">Chưa có combo nào</h3>
          <p className="text-gray-500 mb-6">Bạn có thể tạo các combo để tăng doanh số bán hàng.</p>
          <button 
            onClick={handleOpenCreateModal}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
          >
            Tạo combo đầu tiên
          </button>
        </div>
      ) : (
        <div className="bg-[#141414] rounded-none border-y border-white/5 overflow-hidden -mx-8 lg:-mx-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#0a0a0a] text-xs uppercase font-black tracking-wider text-gray-500 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Tên Combo</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4">Khóa học gộp</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {combos.map((combo: any) => (
                  <tr key={combo.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {combo.coverImage ? (
                          <img src={combo.coverImage} alt={combo.title} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                            <BadgePercent size={20} className="text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white">{combo.title}</div>
                          <div className="text-xs text-gray-500">{combo.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] uppercase tracking-widest font-black rounded-lg border",
                        combo.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        combo.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {combo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(combo.discountPrice || combo.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-white">{combo.includedCourses?.length || 0}</span>
                        <span className="text-gray-500">khóa học</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEditClick(combo)} className="p-2 text-gray-500 hover:text-[#baff02] hover:bg-[#baff02]/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteCombo(combo.id)} className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl custom-scrollbar">
            <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{isEditMode ? 'Chỉnh Sửa Combo' : 'Tạo Combo Mới'}</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitCombo} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tên Combo</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] transition-all outline-none placeholder:text-gray-400"
                    placeholder="VD: Combo Frontend Master"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mô tả ngắn</label>
                  <RichTextEditor 
                    content={description}
                    onChange={(content) => setDescription(content)}
                    placeholder="Mô tả về lợi ích của combo..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giá bán (Khuyến mãi) (VNĐ)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] transition-all outline-none placeholder:text-gray-400"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giá gốc (VNĐ) - Tùy chọn</label>
                    <input 
                      type="number" 
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] transition-all outline-none placeholder:text-gray-400"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Danh mục</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#baff02]/20 focus:border-[#baff02] transition-all outline-none placeholder:text-gray-400"
                    placeholder="VD: Web Development"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ảnh bìa</label>
                  <div 
                    onClick={() => document.getElementById('combo-cover-upload')?.click()}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 hover:bg-gray-100 hover:border-[#baff02] cursor-pointer transition-all overflow-hidden relative group"
                  >
                    <div className="space-y-1 w-full text-center flex flex-col items-center">
                      {(coverImage || existingCoverImageUrl) ? (
                        <>
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-gray-200">
                            <img 
                              src={coverImage ? URL.createObjectURL(coverImage) : existingCoverImageUrl} 
                              alt="Cover Preview" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-gray-900 text-xs font-bold shadow-sm">
                              Thay đổi ảnh bìa
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <ImageIcon size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">Click để tải lên ảnh bìa</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                      <input id="combo-cover-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Chọn khóa học để gộp</label>
                  {availableCourses.length === 0 ? (
                    <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      Bạn chưa có khóa học nào để tạo combo.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {availableCourses.map((course: any) => (
                        <div 
                          key={course.id} 
                          onClick={() => toggleCourseSelection(course.id)}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                            selectedCourses.includes(course.id) 
                              ? "bg-green-50 border-green-200" 
                              : "bg-white border-gray-100 hover:border-gray-300"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center border",
                            selectedCourses.includes(course.id) 
                              ? "bg-[#baff02] border-[#baff02] text-[#0a0a0a]" 
                              : "border-gray-300 bg-transparent"
                          )}>
                            {selectedCourses.includes(course.id) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-sm font-bold text-gray-900">{course.title}</h4>
                            <p className="text-xs text-gray-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={selectedCourses.length === 0}
                  className="px-10 py-4 bg-[#baff02] text-[#0f172a] font-black rounded-2xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#baff02]/20"
                >
                  {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Combo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
