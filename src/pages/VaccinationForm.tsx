import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { ArrowLeft, Info, CheckCircle2 } from 'lucide-react';

export default function VaccinationForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, addVaccination, updateVaccination } = useAppData();

  const isEdit = Boolean(id);
  const existing = isEdit ? data.vaccinations.find(v => v.id === id) : undefined;

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDate(existing.date);
      setLocation(existing.location ?? '');
      setNotes(existing.notes ?? '');
    }
  }, [existing]);

  const handleSave = () => {
    if (!name.trim() || !date) return;
    if (isEdit && existing) {
      updateVaccination({ ...existing, name: name.trim(), date, location: location.trim() || undefined, notes: notes.trim() || undefined });
    } else {
      addVaccination({ name: name.trim(), date, location: location.trim() || undefined, notes: notes.trim() || undefined, status: 'upcoming' });
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/60 transition-colors">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <span className="text-base font-bold text-blue-700 tracking-wide">Baby's Journey</span>
        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-500 overflow-hidden">
          {data.baby.avatarUrl ? (
            <img src={data.baby.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            data.baby.name.charAt(0)
          )}
        </div>
      </div>

      <div className="px-5 pt-4 pb-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Cập nhật lịch tiêm' : 'Thêm lịch tiêm chủng'}
        </h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Ghi lại các mốc quan trọng để bảo vệ sức khoẻ cho bé yêu của bạn.
        </p>

        {/* Form Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
              Tên vắc-xin
            </label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Ví dụ: 6 trong 1 (Infanrix Hexa)"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
              Ngày tiêm
            </label>
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
              Địa điểm tiêm
            </label>
            <div className="relative">
              <input
                type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Trung tâm VNVC, Bệnh viện..."
                className="w-full px-4 py-3 pr-10 bg-blue-50 rounded-xl text-sm text-gray-800 placeholder-gray-400 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
              Ghi chú
            </label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Nhập tình trạng sức khoẻ của bé hoặc các dặn dò của bác sĩ..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-5 flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <span className="font-semibold">Nhắc nhở quan trọng:</span> Hãy theo dõi nhiệt độ của bé trong 24h sau khi tiêm. Đừng quên mang theo sổ tiêm chủng gốc khi đến hẹn.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave} disabled={!name.trim() || !date}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-colors"
        >
          <CheckCircle2 size={20} />
          {isEdit ? 'Cập nhật lịch tiêm' : 'Lưu lịch tiêm'}
        </button>

        <button onClick={() => navigate(-1)} className="mt-3 w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}
