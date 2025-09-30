// philosophy-chapters.ts (Chapter 6 only, VI/EN)

export const philosophyBlogs = {
  '6': {
    title: {
      vietnamese: 'Chương 6: Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người',
      english: "Chapter 6: Hồ Chí Minh's Thought on Culture, Ethics, and Humanity",
    },
    sections: ['6.1', '6.2', '6.3'],
  },
} as const

export type ChapterId = keyof typeof philosophyBlogs

export const philosophySections = {
  '6.1': {
    title: {
      vietnamese: 'Đạo đức – gốc rễ của người cách mạng',
      english: 'Ethics – the revolutionary foundation',
    },
    blog: '6',
  },
  '6.2': {
    title: {
      vietnamese: 'Chuẩn mực đạo đức cách mạng',
      english: 'Standards of revolutionary ethics',
    },
    blog: '6',
  },
  '6.3': {
    title: {
      vietnamese: 'Nguyên tắc tu dưỡng và vận dụng thực tiễn',
      english: 'Principles of cultivation and practical application',
    },
    blog: '6',
  },
} as const

export type SectionId = keyof typeof philosophySections
