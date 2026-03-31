import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { Plus, Lightbulb, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function GrowthPage() {
  const navigate = useNavigate();
  const { data } = useAppData();
  const { baby, growthRecords } = data;

  const sorted = [...growthRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest = sorted[sorted.length - 1];
  const previous = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const weightChange = previous ? +(latest.weight - previous.weight).toFixed(1) : 0;
  const heightChange = previous ? +(latest.height - previous.height).toFixed(1) : 0;

  const chartData = sorted.map((r) => {
    const d = new Date(r.date);
    return { name: `T${d.getMonth() + 1}`, weight: r.weight, height: r.height };
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-lg">
          {baby.gender === 'female' ? '👶' : '👶'}
        </div>
        <span className="text-lg font-semibold text-gray-800">Baby's Journey</span>
      </div>

      <div className="px-5 space-y-5">
        {/* Label + Title */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1">
            CHỈ SỐ SỨC KHOẺ
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Biểu đồ Tăng trưởng</h1>
        </div>

        {/* Stats 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-2">Cân nặng hiện tại</p>
            <p className="text-3xl font-bold text-gray-900">
              {latest?.weight ?? '--'}
              <span className="text-base font-normal text-gray-500 ml-1">kg</span>
            </p>
            <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              CHUẨN WHO
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-2">Thay đổi tháng này</p>
            <p className="text-2xl font-bold text-green-500">
              +{weightChange} kg
            </p>
            <p className="mt-2 text-xs italic text-gray-500">
              Bé đang phát triển rất ổn định
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-2">Chiều cao hiện tại</p>
            <p className="text-3xl font-bold text-gray-900">
              {latest?.height ?? '--'}
              <span className="text-base font-normal text-gray-500 ml-1">cm</span>
            </p>
            <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              CHUẨN WHO
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-2">Thay đổi tháng này</p>
            <p className="text-2xl font-bold text-green-500">
              +{heightChange} cm
            </p>
            <p className="mt-2 text-xs italic text-gray-500">
              Chiều cao phát triển vượt mong đợi
            </p>
          </div>
        </div>

        {/* Trend Chart Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              <h2 className="text-base font-semibold text-gray-800">
                Xu hướng {sorted.length} tháng
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-medium">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-500 rounded inline-block" />
                CÂN NẶNG
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-red-400 rounded inline-block" />
                CHIỀU CAO
              </span>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="weight" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
                <YAxis yAxisId="height" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
                <Line yAxisId="weight" type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                <Line yAxisId="height" type="monotone" dataKey="height" stroke="#f87171" strokeWidth={2} dot={{ r: 4, fill: '#f87171' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expert Analysis Card */}
        <div className="rounded-2xl bg-teal-600 p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-yellow-300" />
            <h2 className="text-sm font-semibold">Phân tích chuyên gia</h2>
          </div>
          <p className="text-sm leading-relaxed opacity-95">
            Bé đang phát triển hoàn toàn bình thường so với độ tuổi. Cả cân nặng và chiều cao đều
            có xu hướng đi lên ổn định. Mức tăng +{heightChange}cm chiều cao là rất ấn tượng.
          </p>
          <div className="mt-4 bg-teal-700/50 rounded-xl p-3">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">Gợi ý:</span> Tiếp tục duy trì chế độ dinh dưỡng
              hiện tại và khuyến khích bé vận động nhẹ nhàng để cơ bắp săn chắc hơn.
            </p>
          </div>
        </div>

        {/* Add Growth Record Button */}
        <button
          onClick={() => navigate('/growth/add')}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-2xl shadow-sm transition-colors"
        >
          <Plus size={20} />
          Thêm kỷ lục tăng trưởng
        </button>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm text-blue-800 leading-relaxed">
            <span className="font-semibold">Sắp tới:</span> 6 tháng tuổi – Chuẩn bị cho giai đoạn
            ăn dặm đầu đời của bé.
          </p>
        </div>
      </div>
    </div>
  );
}
