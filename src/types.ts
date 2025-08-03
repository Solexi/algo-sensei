    export type LeetCodeTopicTag = {
      name: string;
      slug: string;
    }

    export type LeetCodeQuestion = {
      title: string;
      titleSlug: string;
      difficulty: string;
      topicTags: LeetCodeTopicTag[];
    }

    export type FormattedProblem = {
      id: string;
      title: string;
      difficulty: string;
      tags: string[];
      patterns: string[];
      editorialUrl?: string;
    }