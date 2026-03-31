import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { ArrowLeft, Camera, Heart, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type JournalCategory = 'milestone' | 'health' | 'sleep' | 'feeding' | 'other';

const CATEGORY_OPTIONS: { value: JournalCategory; label: string }[] = [
  { value: 'milestone', label: 'Cột mốc' },
  { value: 'health', label: 'Sức khoẻ' },
  { value: 'sleep', label: 'Giấc ngủ' },
  { value: 'feeding', label: 'Bú/Ăn' },
  { value: 'other', label: 'Khác' },
];

const SUGGESTIONS = [
  'Bữa ăn dặm đầu tiên',
  'Lần đầu lẫy thành công',
  'Bé biết lật',
  'Bé cười lần đầu',
  'Bé biết ngồi',
  'Bé mọc răng đầu tiên',
];

export default function JournalForm() {
  const navigate = useNavigate();
  const { data, addJournalEntry } = useAppData();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<JournalCategory>('milestone');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imagePreviewName, setImagePreviewName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formattedDate = (() => {
    try {
      const d = new Date(date + 'T00:00:00');
      return format(d, "EEEE, dd 'Tháng' M, yyyy", { locale: vi });
    } catch {
      return date;
    }
  })();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreviewName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!content.trim()) return;
    addJournalEntry({ date, content: content.trim(), category, imageUrl, tags: [] });
    navigate('/journal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/60 transition-colors">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <span className="text-base font-bold text-blue-700 tracking-wide">
          Viết nhật ký mới
        </span>
        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-500 overflow-hidden">
          {data.baby.avatarUrl ? (
            <img src={data.baby.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            data.baby.name.charAt(0)
          )}
        </div>
      </div>

      <div className="px-5 pt-4 pb-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-5 space-y-6">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Thời gian ghi nhớ
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
              <svg className="text-blue-500 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="flex-1 text-sm text-gray-700 font-medium">{formattedDate}</span>
              <input
                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="text-xs text-gray-400 bg-transparent border-none outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Khoảnh khắc đáng yêu
            </label>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
            <button
              type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-blue-300 transition-colors cursor-pointer"
            >
              {imageUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={imageUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg" />
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">{imagePreviewName}</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Camera size={24} className="text-blue-500" />
                  </div>
                  <span className="text-sm text-gray-500">Chạm để tải ảnh hoặc video</span>
                </>
              )}
            </button>
            <div className="flex items-start gap-2 mt-2 px-1">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <p className="text-xs text-gray-500 italic leading-relaxed">
                Mẹo: Ảnh đủ ánh sáng sẽ làm nhật ký thêm lung linh!
              </p>
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Lời nhắn cho con
            </label>
            <div className="relative">
              <textarea
                value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Hôm nay con đã làm gì khiến cả nhà bất ngờ?..."
                rows={4}
                className="w-full px-4 py-3 pr-10 bg-gray-50 rounded-xl text-sm text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
              />
              <PenLine size={16} className="absolute right-3 bottom-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.value} onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 border-2 border-gray-300 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave} disabled={!content.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-colors"
          >
            <Heart size={16} />
            Lưu kỷ niệm
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Gợi ý cho mẹ</h3>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion} onClick={() => setContent(suggestion)}
                className="px-3 py-1.5 bg-pink-50 text-pink-600 text-xs font-medium rounded-full border border-pink-200 hover:bg-pink-100 hover:border-pink-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
