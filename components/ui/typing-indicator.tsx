import type React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center justify-center p-2">
      {/* 👇 [SỬA ĐỔI] Dải màu rộng hơn và background to hơn để chuyển động mượt hơn */}
      <p className="animate-text-gradient bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-orange-400 via-yellow-500 via-green-400 via-teal-400 via-blue-500 to-indigo-500 bg-[400%_auto] bg-clip-text text-transparent">
        E-Learning đang suy ngẫm...
      </p>
    </div>
  );
}