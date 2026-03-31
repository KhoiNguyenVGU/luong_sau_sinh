import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { CheckCircle2, Lock, Syringe, Calendar, MapPin, Bell, Plus } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import type { Vaccination } from '../types';

export default function HealthPage() {
  const navigate = useNavigate();
  const { data } = useAppData();
  const { baby, vaccinations } = data;

  const completed = vaccinations.filter((v) => v.status === 'completed');
  const upcoming = vaccinations.filter((v) => v.status === 'upcoming');
  const future = vaccinations.filter((v) => v.status === 'future');

  const total = vaccinations.length;
  const completedCount = completed.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const daysUntil = (dateStr: string) => differenceInDays(new Date(dateStr), new Date());

  const handleCardClick = (v: Vaccination) => {
    if (v.status === 'completed' || v.status === 'upcoming') {
      navigate(`/health/edit/${v.id}`);
    }
  };

  const initials = baby.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(-2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 flex items-center gap-3 shadow-sm">
        {baby.avatarUrl ? (
          <img
            src={baby.avatarUrl}
            alt={baby.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
            <span className="text-blue-600 text-sm font-semibold">{initials}</span>
          </div>
        )}
        <h1 className="text-lg font-semibold text-gray-800">Lịch tiêm của Bé</h1>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Phase label */}
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            GIAI ĐOẠN 0-6 THÁNG
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">Hành trình bảo vệ</h2>

        {/* Progress card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5">
          <div className="flex-1">
            <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">TIẾN ĐỘ TỔNG QUÁT</p>
            <p className="text-3xl font-bold text-gray-900">{percent}%</p>
            <p className="text-sm text-gray-500 mt-1">
              {completedCount}/{total} mũi đã hoàn thành
            </p>
          </div>
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="48" cy="48" r={radius} fill="none"
                stroke="#3b82f6" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Syringe className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Upcoming section */}
        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-gray-900">Sắp tới</h3>
              {(() => {
                const nearest = Math.min(...upcoming.map((v) => daysUntil(v.date)));
                return (
                  <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full">
                    {nearest <= 0 ? 'Hôm nay' : `${nearest} ngày nữa`}
                  </span>
                );
              })()}
            </div>
            <div className="space-y-3">
              {upcoming.map((v) => {
                const days = daysUntil(v.date);
                return (
                  <div
                    key={v.id}
                    onClick={() => handleCardClick(v)}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden flex cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="w-1.5 bg-blue-500 flex-shrink-0" />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Syringe className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{v.name}</p>
                            {v.description && (
                              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{v.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {format(new Date(v.date), 'dd/MM/yyyy')}
                              </span>
                              {v.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {v.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {days > 0 && (
                          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                            {days} ngày
                          </span>
                        )}
                      </div>
                      {days > 0 && (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Bell className="w-4 h-4" />
                          Nhắc lịch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed section */}
        {completed.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Đã hoàn thành</h3>
            <div className="space-y-3">
              {completed.map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleCardClick(v)}
                  className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{v.name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(v.date), 'dd/MM/yyyy')}
                      </span>
                      {v.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {v.location}
                        </span>
                      )}
                    </div>
                    {v.ageLabel && (
                      <p className="text-xs text-gray-400 mt-1">{v.ageLabel}</p>
                    )}
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Future section */}
        {future.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Tương lai (6 tháng+)</h3>
            <div className="space-y-3">
              {future.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 opacity-60"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-500">{v.name}</p>
                    {v.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{v.description}</p>
                    )}
                  </div>
                  {v.ageLabel && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                      {v.ageLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating add button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4">
        <button
          onClick={() => navigate('/health/add')}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm lịch tiêm tùy chỉnh
        </button>
      </div>
    </div>
  );
}
