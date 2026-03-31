import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { Search, Plus, Camera, Moon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { JournalCategory } from '../types';

const categoryConfig: Record<
  JournalCategory,
  { label: string; bg: string; text: string; dot: string }
> = {
  milestone: { label: 'CỘT MỐC', bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-600' },
  health:    { label: 'SỨC KHOẺ', bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-600' },
  sleep:     { label: 'GIẤC NGỦ', bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-600' },
  feeding:   { label: 'BÚ/ĂN', bg: 'bg-orange-100', text: 'text-orange-600', dot: 'bg-orange-600' },
  other:     { label: 'KHÁC', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-600' },
};

export default function JournalPage() {
  const navigate = useNavigate();
  const { data } = useAppData();
  const { baby, journalEntries } = data;

  const sortedEntries = [...journalEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedByDate = sortedEntries.reduce<Record<string, typeof sortedEntries>>(
    (groups, entry) => {
      const dateKey = entry.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(entry);
      return groups;
    },
    {}
  );

  const dateKeys = Object.keys(groupedByDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[430px] px-4 pb-24 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100">
              {baby.avatarUrl ? (
                <img src={baby.avatarUrl} alt={baby.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-blue-600">{baby.name.charAt(0)}</span>
              )}
            </div>
            <h1 className="text-lg font-bold text-gray-900">Baby's Journey</h1>
          </div>
          <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Nhật ký của Bé</h2>
          <p className="mt-1 text-sm text-gray-500">
            Ghi lại những khoảnh khắc đầu đời đáng nhớ
          </p>
        </div>

        {/* Timeline */}
        {sortedEntries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">Chưa có nhật ký nào</p>
            <button
              onClick={() => navigate('/journal/add')}
              className="mt-4 rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
            >
              Tạo nhật ký đầu tiên
            </button>
          </div>
        ) : (
          <div className="relative pl-8">
            <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200" />

            {dateKeys.map((dateKey) => {
              const entries = groupedByDate[dateKey];
              const parsedDate = parseISO(dateKey);
              const formattedDate = format(parsedDate, 'd MMMM', { locale: vi });

              return (
                <div key={dateKey} className="mb-8">
                  {/* Date header */}
                  <div className="relative mb-4 flex items-center gap-3">
                    <div className="absolute -left-8 flex w-6 items-center justify-center">
                      <div className="h-3 w-3 rounded-full border-2 border-blue-600 bg-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{formattedDate}</span>
                  </div>

                  {/* Entries */}
                  {entries.map((entry) => {
                    const cat = categoryConfig[entry.category];
                    return (
                      <div key={entry.id} className="relative mb-4">
                        <div className="absolute -left-8 top-4 flex w-6 items-center justify-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${cat.dot}`} />
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <div className="mb-3">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${cat.bg} ${cat.text}`}>
                              {cat.label}
                            </span>
                          </div>

                          {entry.category === 'milestone' && (
                            <>
                              <p className="mb-3 text-base font-semibold italic text-gray-800">
                                "{entry.content}"
                              </p>
                              {entry.imageUrl && (
                                <img src={entry.imageUrl} alt="" className="mb-3 h-44 w-full rounded-xl object-cover" />
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Camera className="h-3.5 w-3.5" />
                                  1 ảnh
                                </span>
                                <span>{format(parsedDate, 'HH:mm')}</span>
                              </div>
                            </>
                          )}

                          {entry.category === 'health' && (
                            <>
                              <p className="mb-3 text-sm leading-relaxed text-gray-700">{entry.content}</p>
                              {entry.imageUrl && (
                                <img src={entry.imageUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" />
                              )}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {entry.tags.map((tag) => (
                                    <span key={tag} className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {entry.category === 'sleep' && (
                            <>
                              <p className="mb-3 text-sm leading-relaxed text-gray-700">{entry.content}</p>
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="rounded-xl bg-purple-50 p-3">
                                  <div className="flex items-center gap-2 text-purple-700">
                                    <Moon className="h-4 w-4" />
                                    <div className="flex flex-col gap-0.5">
                                      {entry.tags.map((tag) => (
                                        <span key={tag} className="text-xs font-medium">{tag}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {(entry.category === 'feeding' || entry.category === 'other') && (
                            <>
                              <p className="mb-3 text-sm leading-relaxed text-gray-700">{entry.content}</p>
                              {entry.imageUrl && (
                                <img src={entry.imageUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" />
                              )}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {entry.tags.map((tag) => (
                                    <span key={tag} className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${entry.category === 'feeding' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Add Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-50">
        <button
          onClick={() => navigate('/journal/add')}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Viết nhật ký mới
        </button>
      </div>
    </div>
  );
}
