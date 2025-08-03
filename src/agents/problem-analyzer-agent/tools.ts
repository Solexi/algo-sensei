import { GraphQLClient } from 'graphql-request';
import { env } from '../../env';
import { LeetCodeQuestion, LeetCodeTopicTag, FormattedProblem } from '../../types';
import { createTool } from '@iqai/adk';
import { z } from 'zod';

const graphqlClient = new GraphQLClient(env.LEETCODE_GRAPHQL_API_URL);

const getProblemsByTopic = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        topicTags {
          name
          id
          slug
        }
        hasSolution
        hasVideoSolution
      }
    }
  }
`;

export async function getSimilarProblemsFunction(params: {
  topicTags: string[];
  difficulty?: string;
  limit?: number;
  excludeTitle?: string;
}): Promise<string> {
  const { topicTags, difficulty, limit = 10, excludeTitle } = params;
  
  try {
    const filters: any = {
      tags: topicTags,
    };

    if (difficulty) {
      filters.difficulty = difficulty.toUpperCase();
    }
    const response: any = await graphqlClient.request(getProblemsByTopic, {
      categorySlug: '',
      limit: limit * 2,
      skip: 0,
      filters,
    });

    const questions: LeetCodeQuestion[] = response.problemsetQuestionList.questions;

    const formattedProblems: FormattedProblem[] = questions
      .filter((q: LeetCodeQuestion) => {
        if (excludeTitle && q.title.toLowerCase() === excludeTitle.toLowerCase()) {
          return false;
        }
        return true;
      })
      .slice(0, limit)
      .map((question: LeetCodeQuestion) => ({
        id: question.titleSlug,
        title: question.title,
        difficulty: question.difficulty,
        tags: question.topicTags.map((tag: LeetCodeTopicTag) => tag.name),
        patterns: extractPatterns(question.topicTags),
        editorialUrl: `https://leetcode.com/problems/${question.titleSlug}/editorial/`,
      }));

    const result = {
      count: formattedProblems.length,
      problems: formattedProblems.map((p, index) => ({
        number: index + 1,
        title: p.title,
        difficulty: p.difficulty,
        tags: p.tags.join(', '),
        patterns: p.patterns.join(', '),
        editorialUrl: p.editorialUrl
      }))
    };

    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error fetching similar problems from LeetCode:', error);
    return JSON.stringify({ 
      error: `Failed to retrieve similar problems: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}

export const getSimilarProblems = createTool({
  name: 'getSimilarProblems',
  description: 'Retrieves similar problems from LeetCode based on topic tags, difficulty, and patterns',
  schema: z.object({
    topicTags: z.array(z.string(), {
      description: 'Array of topic tags to find similar problems (e.g., ["array", "hash-table", "two-pointers"])',
    }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional().describe('Target difficulty level'),
    limit: z.number().optional().default(10).describe('Maximum number of similar problems to retrieve'),
    excludeTitle: z.string().optional().describe('Title of the current problem to exclude from results'),
  }),
  fn: getSimilarProblemsFunction
});


export function extractPatterns(topicTags: LeetCodeTopicTag[]): string[] {
  const patternMap: Record<string, string[]> = {
    'two-pointers': ['Two Pointers'],
    'sliding-window': ['Sliding Window'],
    'binary-search': ['Binary Search'],
    'dynamic-programming': ['Dynamic Programming'],
    'greedy': ['Greedy'],
    'backtracking': ['Backtracking'],
    'divide-and-conquer': ['Divide and Conquer'],
    'depth-first-search': ['DFS', 'Tree Traversal'],
    'breadth-first-search': ['BFS', 'Level Order Traversal'],
    'hash-table': ['Hashing'],
    'heap': ['Priority Queue', 'Heap'],
    'stack': ['Stack', 'Monotonic Stack'],
    'queue': ['Queue'],
    'linked-list': ['Linked List'],
    'tree': ['Binary Tree', 'Tree Traversal'],
    'binary-search-tree': ['BST'],
    'graph': ['Graph Traversal'],
    'union-find': ['Disjoint Set', 'Union Find'],
    'trie': ['Trie', 'Prefix Tree'],
    'string': ['String Manipulation'],
    'array': ['Array Processing'],
    'matrix': ['2D Array', 'Matrix'],
    'bit-manipulation': ['Bit Manipulation'],
    'math': ['Mathematical', 'Number Theory'],
    'geometry': ['Computational Geometry'],
    'sorting': ['Sorting Algorithm'],
    'prefix-sum': ['Prefix Sum'],
    'monotonic-stack': ['Monotonic Stack'],
    'topological-sort': ['Topological Sort'],
  };

  const patterns: string[] = [];
  const tagSlugs = topicTags.map(tag => tag.slug);

  for (const slug of tagSlugs) {
    if (patternMap[slug]) {
      patterns.push(...patternMap[slug]);
    }
  }

  return [...new Set(patterns)];
}

export const problemAnalyzerTools = [
  getSimilarProblems,
];

export const outputSchema = {
  type: 'object',
  properties: {
    problemType: {
      type: 'string',
      enum: ['array', 'string', 'graph', 'tree', 'dynamic-programming', 'greedy', 'binary-search', 'backtracking', 'heap', 'union-find', 'math', 'other'],
    },
    subTags: {
      type: 'array',
      items: { type: 'string' },
    },
    difficulty: {
      type: 'string',
      enum: ['easy', 'medium', 'hard'],
    },
    optimalApproachSummary: {
      type: 'string',
    },
    constraints: {
      type: 'object',
      properties: {
        n: { type: ['number', 'null'] },
        timeLimit: { type: ['string', 'null'] },
        memoryLimit: { type: ['string', 'null'] },
        valuesRange: { type: ['string', 'null'] },
      },
    },
    candidateAlgorithms: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          complexity: { type: 'string' },
          whenToUse: { type: 'string' },
        },
      },
    },
    recommendedAlgorithm: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        reasoning: { type: 'string' },
      },
    },
    toolAnalysis: {
      type: 'object',
      properties: {
        similarProblems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              difficulty: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } },
              patterns: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        patternAnalysis: { type: 'object' },
        complexityValidation: { type: 'object' },
        constraintAnalysis: { type: 'object' },
      },
    },
  },
  required: ['problemType', 'difficulty', 'optimalApproachSummary', 'candidateAlgorithms', 'recommendedAlgorithm'],
};
