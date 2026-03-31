import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { ArrowLeft, MoreVertical, Calendar } from 'lucide-react';
import { differenceInMonths, differenceInDays, format } from 'date-fns';

export default function GrowthForm() {
  const navigate = useNavigate();
  const { data, addGrowthRecord } = useAppData();
  const { baby, growthRecords } = data;

  const today = new Date();
  const birthDate = new Date(baby.birthDate);
  const ageMonths = differenceInMonths(today, birthDate);
  const ageDaysRemainder = differenceInDays(today, birthDate) - ageMonths * 30;

  const [date, setDate] = useState(format(today, 'yyyy-MM-dd'));
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const sorted = [...growthRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const lastRecord = sorted[sorted.length - 1] ?? null;
  const daysSinceLast = lastRecord
    ? differenceInDays(today, new Date(lastRecord.date))
    : null;

  const weightNum = parseFloat(weight) || 0;
  const heightNum = parseFloat(height) || 0;

  const weightDiff = lastRecord && weightNum > 0 ? +(weightNum - lastRecord.weight).toFixed(1) : null;
  const heightDiff = lastRecord && heightNum > 0 ? +(heightNum - lastRecord.height).toFixed(1) : null;

  const getWeightStatus = () => {
    if (weightNum <= 0) return { label: 'WHO CHUẨN', color: 'green' };
    if (weightDiff !== null && weightDiff >= 0 && weightDiff <= 2) return { label: 'WHO CHUẨN', color: 'green' };
    if (weightDiff !== null && weightDiff > 2) return { label: 'VƯỢT CHUẨN', color: 'yellow' };
    if (weightDiff !== null && weightDiff < 0) return { label: 'DƯỚI CHUẨN', color: 'red' };
    return { label: 'WHO CHUẨN', color: 'green' };
  };

  const getHeightStatus = () => {
    if (heightNum <= 0) return { label: 'WHO CHUẨN', color: 'green' };
    if (heightDiff !== null && heightDiff >= 0 && heightDiff <= 5) return { label: 'WHO CHUẨN', color: 'green' };
    if (heightDiff !== null && heightDiff > 5) return { label: 'VƯỢT CHUẨN', color: 'yellow' };
    if (heightDiff !== null && heightDiff < 0) return { label: 'DƯỚI CHUẨN', color: 'red' };
    return { label: 'WHO CHUẨN', color: 'green' };
  };

  const weightStatus = getWeightStatus();
  const heightStatus = getHeightStatus();
  const canSave = weightNum > 0 && heightNum > 0 && date;

  const handleSave = () => {
    if (!canSave) return;
    addGrowthRecord({ date, weight: weightNum, height: heightNum });
    navigate('/growth');
  };

  const getAnalysisText = () => {
    if (weightNum <= 0 || heightNum <= 0) {
      return 'Nhập cân nặng và chiều cao để xem phân tích nhanh về tình trạng phát triển của bé.';
    }
    const parts: string[] = [];
    if (weightDiff !== null) {
      if (weightDiff > 0) parts.push(`Bé tăng ${weightDiff} kg so với lần đo trước`);
      else if (weightDiff === 0) parts.push('Cân nặng chưa thay đổi so với lần đo trước');
      else parts.push(`Cân nặng giảm ${Math.abs(weightDiff)} kg so với lần đo trước`);
    }
    if (heightDiff !== null) {
      if (heightDiff > 0) parts.push(`chiều cao tăng ${heightDiff} cm`);
      else if (heightDiff === 0) parts.push('chiều cao không thay đổi');
      else parts.push(`chiều cao giảm ${Math.abs(heightDiff)} cm`);
    }
    if (parts.length > 0) return parts.join(', ') + '. Bé đang phát triển tốt theo chuẩn WHO.';
    return 'Bé đang phát triển tốt theo chuẩn WHO.';
  };

  const badgeColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-700';
      case 'red': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/60 transition-colors">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-800">Nhập chỉ số tăng trưởng</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-white/60 transition-colors">
          <MoreVertical size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Baby Info */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center text-xl shrink-0 overflow-hidden">
          {baby.avatarUrl ? (
            <img src={baby.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>👶</span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Hôm nay bé được{' '}
            <span className="font-semibold text-gray-800">
              {ageMonths} tháng {ageDaysRemainder > 0 ? `${ageDaysRemainder} ngày` : ''}
            </span>
          </p>
          <p className="text-base font-bold text-gray-900">{baby.name}</p>
        </div>
      </div>

      <div className="px-5 space-y-4 mt-2">
        {/* Date Picker Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Ngày đo
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-10"
            />
            <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Weight Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-blue-600">Cân nặng (kg)</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${badgeColor(weightStatus.color)}`}>
              {weightStatus.label}
            </span>
          </div>
          <input
            type="number" inputMode="decimal" step="0.1" min="0"
            value={weight} onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="w-full text-center text-4xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-none focus:outline-none py-3"
          />
          <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-green-400 opacity-80" />
          <p className="text-xs text-green-600 font-medium mt-1.5 text-center">Vùng xanh</p>
        </div>

        {/* Height Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-blue-600">Chiều cao (cm)</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${badgeColor(heightStatus.color)}`}>
              {heightStatus.label}
            </span>
          </div>
          <input
            type="number" inputMode="decimal" step="0.1" min="0"
            value={height} onChange={(e) => setHeight(e.target.value)}
            placeholder="0.0"
            className="w-full text-center text-4xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-none focus:outline-none py-3"
          />
          {lastRecord && (
            <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
              Chiều cao trung bình theo WHO cho bé {ageMonths} tháng tuổi là{' '}
              <span className="font-semibold text-gray-700">{lastRecord.height} – {(lastRecord.height + 3).toFixed(1)} cm</span>
            </p>
          )}
        </div>

        {/* Quick Analysis */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-2">Phân tích nhanh</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-700 leading-relaxed">{getAnalysisText()}</p>
            {weightDiff !== null && weightNum > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${weightDiff >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {weightDiff >= 0 ? '+' : ''}{weightDiff} kg
                </span>
                {daysSinceLast !== null && (
                  <span className="text-xs text-gray-400">
                    Lần cuối: {daysSinceLast} ngày trước
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-4 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white text-base font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-200 transition-all"
        >
          LƯU CHỈ SỐ NGAY
        </button>
      </div>
    </div>
  );
}
