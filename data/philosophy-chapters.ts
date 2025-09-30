// philosophy-chapters.ts (Chapter 6 only, VI/EN)

export const philosophyBlogs = {
  '6': {
    title: {
      vietnamese: 'Chương 6: Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người',
      english: 'Chapter 6: Hồ Chí Minh\'s Thought on Culture, Ethics, and Humanity',
    },
    sections: ['6.1'],
  },
} as const

export type ChapterId = keyof typeof philosophyBlogs

export const philosophySections = {
  '6.1': {
    title: {
      vietnamese: 'Tư tưởng Hồ Chí Minh về đạo đức',
      english: "Hồ Chí Minh's Ethical Thought",
    },
    blog: '6',
  },
} as const

export type SectionId = keyof typeof philosophySections
