import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { ChevronRight, Baby, Weight, Ruler } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { differenceInDays, differenceInMonths, format } from 'date-fns';

export default function HomePage() {
  const navigate = useNavigate();
  const { data } = useAppData();
  const { baby, vaccinations, growthRecords, journalEntries } = data;

  const today = new Date();
  const birthDate = new Date(baby.birthDate);

  const totalDays = differenceInDays(today, birthDate);
  const months = differenceInMonths(today, birthDate);

  const upcomingVaccinations = vaccinations
    .filter((v) => v.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextVaccine = upcomingVaccinations[0] || null;
  const daysUntilVaccine = nextVaccine
    ? differenceInDays(new Date(nextVaccine.date), today)
    : null;

  const sortedGrowth = [...growthRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const latestGrowth = sortedGrowth[sortedGrowth.length - 1] || null;
  const previousGrowth = sortedGrowth[sortedGrowth.length - 2] || null;

  const weightChange =
    latestGrowth && previousGrowth
      ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
      : null;
  const heightChange =
    latestGrowth && previousGrowth
      ? (latestGrowth.height - previousGrowth.height).toFixed(1)
      : null;

  const chartData = sortedGrowth.slice(-4).map((r) => ({
    month: format(new Date(r.date), 'MM/yy'),
    weight: r.weight,
    height: r.height,
  }));

  const sortedJournal = [...journalEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[430px] px-4 pb-8 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {baby.avatarUrl ? (
              <img
                src={baby.avatarUrl}
                alt={baby.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <Baby className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{baby.name}</h2>
            <p className="text-xs text-gray-500">
              {baby.gender === 'female' ? 'Bé gái' : 'Bé trai'}
            </p>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-blue-600">
            Chào mẹ, hôm nay của bé
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {months} tháng tuổi{' '}
            <span className="text-base font-normal text-gray-500">
              ({totalDays} ngày)
            </span>
          </p>
        </div>

        {/* Upcoming Vaccination Card */}
        {nextVaccine && (
          <button
            onClick={() => navigate('/health')}
            className="mb-6 w-full rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-200">
                  <span className="text-lg">💉</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600">
                    Lịch tiêm chủng sắp tới
                  </p>
                  <p className="font-semibold text-gray-900">
                    {nextVaccine.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daysUntilVaccine !== null && daysUntilVaccine >= 0
                      ? `Còn ${daysUntilVaccine} ngày nữa`
                      : 'Đã đến lịch tiêm'}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400" />
            </div>
          </button>
        )}

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <Weight className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">Cân nặng</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestGrowth ? `${latestGrowth.weight}kg` : '--'}
            </p>
            {weightChange && Number(weightChange) > 0 && (
              <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                +{weightChange}kg
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50">
                <Ruler className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">Chiều cao</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestGrowth ? `${latestGrowth.height}cm` : '--'}
            </p>
            {heightChange && Number(heightChange) > 0 && (
              <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                +{heightChange}cm
              </span>
            )}
          </div>
        </div>

        {/* Growth Chart Section */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Biểu đồ tăng trưởng</h3>
            <button
              onClick={() => navigate('/growth')}
              className="flex items-center gap-1 text-sm font-medium text-blue-600"
            >
              Chi tiết
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#1e40af' }}
                  name="Cân nặng (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="height"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ec4899' }}
                  name="Chiều cao (cm)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">
              Chưa có dữ liệu tăng trưởng
            </p>
          )}
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1e40af]" />
              <span className="text-xs text-gray-500">Cân nặng (kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899]" />
              <span className="text-xs text-gray-500">Chiều cao (cm)</span>
            </div>
          </div>
        </div>

        {/* Journal Section */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Nhật ký của mẹ</h3>
            <button
              onClick={() => navigate('/journal')}
              className="flex items-center gap-1 text-sm font-medium text-blue-600"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {sortedJournal.length > 0 ? (
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
              {sortedJournal.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => navigate('/journal')}
                  className="w-52 flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {entry.imageUrl ? (
                    <div className="relative h-32 w-full">
                      <img
                        src={entry.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                        <p className="line-clamp-2 text-xs font-medium text-white">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      <p className="line-clamp-3 text-sm text-gray-700">
                        {entry.content}
                      </p>
                    </div>
                  )}
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-400">
                      {format(new Date(entry.date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">
              Chưa có nhật ký nào
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
