export type Lang = 'en' | 'ko'

export const translations = {
  en: {
    siteNav: {
      langLabel: 'language',
      status: {
        online: 'online',
        offline: 'offline',
        checking: 'checking',
      },
    },
    header: {
      eyebrow: 'A computational notebook',
      titleA: 'Python',
      titleB: 'Testing',
      titleC: 'Agent',
      titleItalic: 'graded',
      tagline:
        'Submit Python. Receive a rigorous, AI-graded review in seconds — with feedback worth reading.',
      metaLabel: 'Vol. 02 — Edition',
      metaIssue: 'AI Grader',
    },
    question: {
      sectionTag: '§ 01',
      sectionLabel: 'Prompt',
      heading: 'The question',
      subheading: 'Describe the problem you want graded.',
      generate: 'Roll a question',
      generating: 'Generating…',
      placeholder: `Describe the problem or question you're working on…

Examples:
• Write a function that calculates the factorial of a number
• Create a class to manage a simple banking system
• Implement a binary search algorithm
• Write a program that finds the longest palindrome in a string`,
      templatesLabel: 'Quick starters',
      templates: [
        'Write a function that returns the sum of all even numbers in a list',
        'Create a class called Book with title and author attributes',
        'Write a function that reads a file and handles file not found errors',
        'Write a recursive function to compute the nth Fibonacci number',
      ],
      counter: (n: number) => `${n} / 1000 chars`,
    },
    editor: {
      sectionTag: '§ 02',
      sectionLabel: 'Solution',
      heading: 'Your code',
      fullscreen: 'Expand',
      collapse: 'Collapse',
      theme: 'Theme',
      themes: {
        dark: 'Dark',
        light: 'Light',
        hc: 'High contrast',
      },
      grade: 'Submit for grading',
      grading: 'Reading your code…',
      clear: 'Clear',
      tip: 'Ctrl+Space to autocomplete · Ctrl+/ to comment · ⇧ ↵ Shift+Enter to submit',
      questionTag: 'PROMPT',
      fullscreenTag: 'fullscreen',
    },
    result: {
      sectionTag: '§ 03',
      sectionLabel: 'Report',
      scoreLabel: 'Score',
      outOf: '/100',
      progressLabel: 'Mark recorded',
      feedbackHeading: 'The report',
      retry: 'Try again',
      newQuestion: 'New prompt',
      levels: {
        exceptional: 'Exceptional',
        excellent: 'Excellent',
        veryGood: 'Very good',
        good: 'Good',
        aboveAverage: 'Above average',
        average: 'Average',
        belowAverage: 'Below average',
        needsWork: 'Needs improvement',
      },
      messages: {
        ninety: "Outstanding work. You've mastered this concept.",
        eighty: "Great job. You're on the right track.",
        seventy: 'Good effort. A few refinements take this to excellent.',
        sixty: "Keep practicing. You're making progress.",
        below: "Don't give up. Every expert was once a beginner.",
      },
      learn: {
        sectionTag: '§ 04',
        sectionLabel: 'Learn',
        heading: 'Watch & learn',
        subheading: 'YouTube searches tuned for this problem.',
        cardCta: 'Search on YouTube',
        loading: 'Asking Gemini for the best tutorials…',
        topicPrefix: 'Topic',
        angleLabels: {
          tutorial: 'Tutorial',
          concept: 'Concept',
          walkthrough: 'Walkthrough',
        },
        angles: [
          { tag: 'Tutorial', suffix: 'python tutorial', angle: 'tutorial' as const },
          { tag: 'Concept', suffix: 'python concept explained', angle: 'concept' as const },
          { tag: 'Walkthrough', suffix: 'python algorithm walkthrough', angle: 'walkthrough' as const },
        ],
      },
    },
  },
  ko: {
    siteNav: {
      langLabel: '언어',
      status: {
        online: '온라인',
        offline: '오프라인',
        checking: '확인 중',
      },
    },
    header: {
      eyebrow: '연산 노트북',
      titleA: '파이썬',
      titleB: '테스팅',
      titleC: '에이전트',
      titleItalic: '채점',
      tagline:
        '파이썬 코드를 제출하면 몇 초 안에 정밀한 AI 첨삭을 받습니다 — 읽을 가치가 있는 피드백과 함께.',
      metaLabel: '제2권 — 에디션',
      metaIssue: 'AI 채점기',
    },
    question: {
      sectionTag: '§ 01',
      sectionLabel: '문제',
      heading: '오늘의 문제',
      subheading: '채점받고 싶은 문제를 적어주세요.',
      generate: '문제 뽑기',
      generating: '생성 중…',
      placeholder: `풀고 싶은 문제나 질문을 적어주세요…

예시:
• 정수의 팩토리얼을 계산하는 함수를 작성하세요
• 간단한 은행 시스템을 관리하는 클래스를 만드세요
• 이진 탐색 알고리즘을 구현하세요
• 문자열에서 가장 긴 회문을 찾는 프로그램을 작성하세요`,
      templatesLabel: '빠른 시작',
      templates: [
        '리스트의 모든 짝수의 합을 반환하는 함수를 작성하세요',
        'title과 author 속성을 갖는 Book 클래스를 만드세요',
        '파일을 읽고 파일이 없는 경우를 처리하는 함수를 작성하세요',
        'n번째 피보나치 수를 계산하는 재귀 함수를 작성하세요',
      ],
      counter: (n: number) => `${n} / 1000자`,
    },
    editor: {
      sectionTag: '§ 02',
      sectionLabel: '풀이',
      heading: '나의 코드',
      fullscreen: '확장',
      collapse: '축소',
      theme: '테마',
      themes: {
        dark: '다크',
        light: '라이트',
        hc: '고대비',
      },
      grade: '채점 요청',
      grading: '코드를 읽는 중…',
      clear: '지우기',
      tip: 'Ctrl+Space 자동완성 · Ctrl+/ 주석 · ⇧ ↵ Shift+Enter 제출',
      questionTag: '문제',
      fullscreenTag: '전체화면',
    },
    result: {
      sectionTag: '§ 03',
      sectionLabel: '리포트',
      scoreLabel: '점수',
      outOf: '/100',
      progressLabel: '기록된 점수',
      feedbackHeading: '상세 피드백',
      retry: '다시 풀기',
      newQuestion: '새 문제',
      levels: {
        exceptional: '탁월함',
        excellent: '훌륭함',
        veryGood: '매우 좋음',
        good: '좋음',
        aboveAverage: '평균 이상',
        average: '평균',
        belowAverage: '평균 이하',
        needsWork: '더 연습 필요',
      },
      messages: {
        ninety: '완벽한 풀이입니다. 이 개념을 완전히 익혔어요.',
        eighty: '훌륭합니다. 올바른 방향으로 가고 있어요.',
        seventy: '잘했어요. 조금만 다듬으면 최고가 됩니다.',
        sixty: '계속 연습하세요. 분명히 발전하고 있어요.',
        below: '포기하지 마세요. 모든 전문가도 처음엔 초보였습니다.',
      },
      learn: {
        sectionTag: '§ 04',
        sectionLabel: '학습',
        heading: '영상으로 학습하기',
        subheading: '이 문제에 어울리는 유튜브 검색 추천입니다.',
        cardCta: '유튜브에서 보기',
        loading: '제미나이가 영상 추천을 준비 중…',
        topicPrefix: '주제',
        angleLabels: {
          tutorial: '강의',
          concept: '개념',
          walkthrough: '풀이',
        },
        angles: [
          { tag: '강의', suffix: '파이썬 강의', angle: 'tutorial' as const },
          { tag: '개념', suffix: '파이썬 개념 설명', angle: 'concept' as const },
          { tag: '풀이', suffix: '파이썬 알고리즘 풀이', angle: 'walkthrough' as const },
        ],
      },
    },
  },
} as const

export type Translation = (typeof translations)['en']
