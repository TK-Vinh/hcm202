// philosophy-chapters.ts (Chapter 4 only, VI/EN; removed Japanese)

export const philosophyBlogs = {
  '4.1': {
    title: {
      vietnamese: 'Dân chủ và dân chủ xã hội chủ nghĩa',
      english: 'Democracy and Socialist Democracy',
    },
    sections: ['4.1.1', '4.1.2'],
  },
  '4.2': {
    title: {
      vietnamese: 'Nhà nước xã hội chủ nghĩa',
      english: 'The Socialist State',
    },
    sections: ['4.2'],
  },
  '4.3': {
    title: {
      vietnamese: 'Dân chủ XHCN và nhà nước pháp quyền XHCN ở Việt Nam',
      english: 'Socialist Democracy & the Socialist Rule-of-Law State in Vietnam',
    },
    sections: ['4.3.1','4.3.2','4.3.3','4.3.4','4.3.5'],
  },
} as const

export type ChapterId = keyof typeof philosophyBlogs

export const philosophySections = {
  // Chương I
  '4.1.1': {
    title: {
      vietnamese: 'Dân chủ và sự ra đời, phát triển của dân chủ',
      english: 'Democracy: Emergence and Development',
    },
    blog: '4.1',
  },
  '4.1.2': {
    title: {
      vietnamese: 'Dân chủ xã hội chủ nghĩa',
      english: 'Socialist Democracy',
    },
    blog: '4.1',
  },

  // Chương II
  '4.2': {
    title: {
      vietnamese: 'Nhà nước xã hội chủ nghĩa',
      english: 'The Socialist State',
    },
    blog: '4.2',
  },

  // Chương III
  '4.3.1': {
    title: {
      vietnamese: 'Dân chủ xã hội chủ nghĩa ở Việt Nam',
      english: 'Socialist Democracy in Vietnam',
    },
    blog: '4.3',
  },
  '4.3.2': {
    title: {
      vietnamese: 'Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam',
      english: 'The Socialist Rule-of-Law State in Vietnam',
    },
    blog: '4.3',
  },
  '4.3.3': {
    title: {
      vietnamese: 'Phát huy dân chủ, xây dựng Nhà nước pháp quyền XHCN hiện nay',
      english: 'Promote Democracy & Build the Socialist Rule-of-Law State Today',
    },
    blog: '4.3',
  },
  '4.3.4': {
    title: {
      vietnamese: 'Phòng, chống tham nhũng góp phần bảo vệ chế độ, xây dựng Nhà nước pháp quyền',
      english: 'Anti-Corruption to Safeguard the Regime & Build the Rule-of-Law State',
    },
    blog: '4.3',
  },
  '4.3.5': {
    title: {
      vietnamese: 'Trách nhiệm của công dân trong phòng, chống tham nhũng',
      english: 'Citizen Responsibility in Anti-Corruption',
    },
    blog: '4.3',
  },
} as const

export type SectionId = keyof typeof philosophySections
