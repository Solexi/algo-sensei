import { createTool } from "@iqai/adk";
import { z } from "zod";

/**
 * Tool to search for similar problems in competitive programming databases
 */

const problemDatabaseQuerySchema = z.object({
  problemType: z.enum([
    "array",
    "string",
    "graph",
    "tree",
    "dynamic-programming",
    "greedy",
    "binary-search",
    "backtracking",
    "heap",
    "union-find",
    "math",
    "other"
  ]),
  tags: z.array(z.string()).default([]),
  difficulty: z.string().optional(),
  limit: z.number().default(5),
});

export const problemDatabaseQueryTool = createTool({
  name: "problem_database_query",
  description: "Search for similar DSA problems in databases from LeetCode",
  schema: problemDatabaseQuerySchema,
  fn: (args) => {
    const { problemType, tags = [], difficulty, limit = 5 } = args;
    const mockResults = [
      {
        id: "leetcode-001",
        title: "Two Sum",
        difficulty: "easy",
        tags: ["array", "hash-table", "two-pointers"],
        patterns: ["hash-map-lookup", "complement-search"],
        editorialUrl: "https://leetcode.com/problems/two-sum/editorial/"
      },
      {
        id: "leetcode-015",
        title: "3Sum",
        difficulty: "medium",
        tags: ["array", "two-pointers", "sorting"],
        patterns: ["two-pointers", "duplicate-handling"],
        editorialUrl: "https://leetcode.com/problems/3sum/editorial/"
      }
    ].filter(p => 
      p.tags.includes(problemType) && 
      (!difficulty || p.difficulty === difficulty) &&
      (!tags.length || tags.some(tag => p.tags.includes(tag)))
    ).slice(0, limit);

    return {
      similarProblems: mockResults,
      searchCriteria: { problemType, tags, difficulty, limit }
    };
  }
});

/**
 * Tool to analyze and validate time/space complexity claims
 */
// export const complexityAnalysisTool: ToolDef = {
//   name: "complexity_analysis",
//   description: "Analyze and validate time/space complexity for algorithmic approaches",
//   inputSchema: {
//     type: "object",
//     properties: {
//       algorithmName: { 
//         type: "string",
//         description: "Name of the algorithm to analyze"
//       },
//       problemSize: { 
//         type: "string",
//         description: "Variable representing problem size (e.g., 'n', 'V+E', 'n*m')"
//       },
//       operations: { 
//         type: "array",
//         items: { type: "string" },
//         description: "List of main operations performed by the algorithm"
//       },
//       dataStructures: { 
//         type: "array",
//         items: { type: "string" },
//         description: "Data structures used in the algorithm"
//       }
//     },
//     required: ["algorithmName", "problemSize"]
//   },
//   execute: async ({ algorithmName, problemSize, operations = [], dataStructures = [] }) => {
//     // Mock complexity analysis logic
//     const complexityDatabase = {
//       "Two Pointers": { time: "O(n)", space: "O(1)" },
//       "Binary Search": { time: "O(log n)", space: "O(1)" },
//       "Merge Sort": { time: "O(n log n)", space: "O(n)" },
//       "DFS": { time: "O(V + E)", space: "O(V)" },
//       "BFS": { time: "O(V + E)", space: "O(V)" },
//       "Dynamic Programming": { time: "O(n²)", space: "O(n)" },
//       "Dijkstra": { time: "O((V + E) log V)", space: "O(V)" }
//     };

//     const analysis = complexityDatabase[algorithmName] || { 
//       time: "O(?)", 
//       space: "O(?)" 
//     };

//     return {
//       algorithm: algorithmName,
//       timeComplexity: analysis.time,
//       spaceComplexity: analysis.space,
//       analysisDetails: {
//         problemSize,
//         operations,
//         dataStructures,
//         reasoning: `Based on ${operations.length} main operations using ${dataStructures.join(", ")} data structures`
//       },
//       isOptimal: analysis.time !== "O(?)"
//     };
//   }
// };

/**
 * Tool to parse and extract constraint information from problem statements
 */
// export const constraintParserTool: ToolDef = {
//   name: "constraint_parser",
//   description: "Parse mathematical constraints and ranges from problem statements",
//   inputSchema: {
//     type: "object",
//     properties: {
//       problemStatement: { 
//         type: "string",
//         description: "The full problem statement text"
//       },
//       constraintSection: { 
//         type: "string",
//         description: "Specific constraint section if available"
//       }
//     },
//     required: ["problemStatement"]
//   },
//   execute: async ({ problemStatement, constraintSection }) => {
//     // Mock constraint parsing logic
//     const text = constraintSection || problemStatement;
    
//     // Common constraint patterns
//     const patterns = {
//       arraySize: /1\s*≤\s*n\s*≤\s*([\d,]+)/i,
//       valueRange: /(?:[-]?\d+)\s*≤\s*(?:arr\[i\]|nums\[i\]|values?)\s*≤\s*([\d,]+)/i,
//       timeLimit: /(\d+)\s*(?:seconds?|ms|milliseconds?)/i,
//       memoryLimit: /(\d+)\s*(?:MB|GB|bytes?)/i
//     };

//     const extracted = {
//       n: null as number | null,
//       timeLimit: null as string | null,
//       memoryLimit: null as string | null,
//       valuesRange: null as string | null
//     };

//     // Extract array size
//     const sizeMatch = text.match(patterns.arraySize);
//     if (sizeMatch) {
//       extracted.n = parseInt(sizeMatch[1].replace(/,/g, ''));
//     }

//     // Extract value range
//     const rangeMatch = text.match(patterns.valueRange);
//     if (rangeMatch) {
//       extracted.valuesRange = rangeMatch[0];
//     }

//     // Extract time limit
//     const timeMatch = text.match(patterns.timeLimit);
//     if (timeMatch) {
//       extracted.timeLimit = timeMatch[0];
//     }

//     // Extract memory limit
//     const memoryMatch = text.match(patterns.memoryLimit);
//     if (memoryMatch) {
//       extracted.memoryLimit = memoryMatch[0];
//     }

//     return {
//       extractedConstraints: extracted,
//       rawText: text,
//       parsingSuccess: Object.values(extracted).some(v => v !== null)
//     };
//   }
// };

/**
 * Tool to identify common algorithmic patterns in problem descriptions
 */
// export const patternRecognitionTool: ToolDef = {
//   name: "pattern_recognition",
//   description: "Identify common algorithmic patterns and techniques from problem description",
//   inputSchema: {
//     type: "object",
//     properties: {
//       problemStatement: { 
//         type: "string",
//         description: "The problem statement to analyze for patterns"
//       },
//       examples: { 
//         type: "array",
//         items: { type: "string" },
//         description: "Example inputs/outputs if available"
//       }
//     },
//     required: ["problemStatement"]
//   },
//   execute: async ({ problemStatement, examples = [] }) => {
//     const text = problemStatement.toLowerCase();
    
//     // Pattern detection keywords
//     const patterns = [
//       {
//         name: "two-pointers",
//         keywords: ["two pointers", "left and right", "start and end", "palindrome", "sorted array"],
//         confidence: 0
//       },
//       {
//         name: "sliding-window",
//         keywords: ["subarray", "substring", "window", "maximum sum", "minimum length"],
//         confidence: 0
//       },
//       {
//         name: "binary-search",
//         keywords: ["sorted", "search", "find target", "log n", "divide and conquer"],
//         confidence: 0
//       },
//       {
//         name: "dynamic-programming",
//         keywords: ["optimal", "maximum", "minimum", "count ways", "fibonacci", "overlapping"],
//         confidence: 0
//       },
//       {
//         name: "graph-traversal",
//         keywords: ["graph", "nodes", "edges", "path", "connected", "traversal", "bfs", "dfs"],
//         confidence: 0
//       },
//       {
//         name: "greedy",
//         keywords: ["greedy", "local optimal", "minimum steps", "maximum profit"],
//         confidence: 0
//       }
//     ];

//     // Calculate confidence scores
//     patterns.forEach(pattern => {
//       pattern.confidence = pattern.keywords.reduce((score, keyword) => {
//         return score + (text.includes(keyword) ? 1 : 0);
//       }, 0) / pattern.keywords.length;
//     });

//     // Sort by confidence and filter significant patterns
//     const detectedPatterns = patterns
//       .filter(p => p.confidence > 0.1)
//       .sort((a, b) => b.confidence - a.confidence)
//       .map(p => ({
//         name: p.name,
//         confidence: Math.round(p.confidence * 100),
//         matchedKeywords: p.keywords.filter(k => text.includes(k))
//       }));

//     return {
//       detectedPatterns,
//       mostLikelyPattern: detectedPatterns[0]?.name || "unknown",
//       analysisText: text.substring(0, 200) + "..."
//     };
//   }
// };

/**
 * Tool to query algorithm knowledge base for detailed information
 */
// export const algorithmKnowledgeBaseTool: ToolDef = {
//   name: "algorithm_knowledge_base",
//   description: "Query comprehensive database of algorithms and their properties",
//   inputSchema: {
//     type: "object",
//     properties: {
//       algorithmName: { 
//         type: "string",
//         description: "Name of the algorithm to query"
//       },
//       category: { 
//         type: "string",
//         enum: ["sorting", "searching", "graph", "dynamic-programming", "greedy", "string", "tree"],
//         description: "Algorithm category to filter by"
//       },
//       complexity: { 
//         type: "string",
//         description: "Desired complexity bound (e.g., 'O(n)', 'O(log n)')"
//       }
//     }
//   },
//   execute: async ({ algorithmName, category, complexity }) => {
//     // Mock algorithm knowledge base
//     const algorithms = [
//       {
//         name: "Two Pointers",
//         category: "array",
//         timeComplexity: "O(n)",
//         spaceComplexity: "O(1)",
//         description: "Use two pointers moving towards each other or in same direction",
//         useCases: ["Sorted array problems", "Palindrome checking", "Sum problems"],
//         implementation: "Initialize left=0, right=n-1; move based on condition",
//         variations: ["Fast-slow pointers", "Same direction pointers"]
//       },
//       {
//         name: "Binary Search",
//         category: "searching",
//         timeComplexity: "O(log n)",
//         spaceComplexity: "O(1)",
//         description: "Divide search space in half repeatedly",
//         useCases: ["Search in sorted array", "Find boundary conditions", "Answer search"],
//         implementation: "while (left <= right) { mid = (left + right) / 2; ... }",
//         variations: ["Binary search on answer", "Rotated array search"]
//       },
//       {
//         name: "Dynamic Programming",
//         category: "dynamic-programming",
//         timeComplexity: "O(n²)",
//         spaceComplexity: "O(n)",
//         description: "Break down problems into overlapping subproblems",
//         useCases: ["Optimization problems", "Counting problems", "Decision problems"],
//         implementation: "dp[i] = f(dp[i-1], dp[i-2], ...)",
//         variations: ["Top-down (memoization)", "Bottom-up (tabulation)"]
//       }
//     ];

//     let results = algorithms;
    
//     if (algorithmName) {
//       results = results.filter(a => 
//         a.name.toLowerCase().includes(algorithmName.toLowerCase())
//       );
//     }
    
//     if (category) {
//       results = results.filter(a => a.category === category);
//     }
    
//     if (complexity) {
//       results = results.filter(a => 
//         a.timeComplexity === complexity || a.spaceComplexity === complexity
//       );
//     }

//     return {
//       algorithms: results,
//       searchCriteria: { algorithmName, category, complexity },
//       totalFound: results.length
//     };
//   }
// };

/**
 * Tool to validate problem classification and suggest improvements
 */
// export const classificationValidatorTool: ToolDef = {
//   name: "classification_validator",
//   description: "Validate problem classification and suggest alternative classifications",
//   inputSchema: {
//     type: "object",
//     properties: {
//       problemStatement: { type: "string" },
//       suggestedType: { 
//         type: "string",
//         enum: ["array", "string", "graph", "tree", "dynamic-programming", "greedy", "binary-search", "backtracking", "heap", "union-find", "math", "other"]
//       },
//       suggestedTags: { type: "array", items: { type: "string" } },
//       confidence: { type: "number", minimum: 0, maximum: 1 }
//     },
//     required: ["problemStatement", "suggestedType"]
//   },
//   execute: async ({ problemStatement, suggestedType, suggestedTags = [], confidence = 0.5 }) => {
//     // Mock validation logic
//     const validationRules = {
//       "array": ["array", "list", "elements", "indices"],
//       "string": ["string", "character", "substring", "pattern"],
//       "graph": ["graph", "nodes", "edges", "path", "connected"],
//       "tree": ["tree", "root", "leaf", "parent", "child"],
//       "dynamic-programming": ["optimal", "maximum", "minimum", "count"]
//     };

//     const text = problemStatement.toLowerCase();
//     const relevantKeywords = validationRules[suggestedType] || [];
//     const keywordMatches = relevantKeywords.filter(keyword => text.includes(keyword));
    
//     const validationScore = keywordMatches.length / relevantKeywords.length;
//     const isValid = validationScore > 0.3;

//     // Suggest alternative classifications
//     const alternatives = Object.entries(validationRules)
//       .filter(([type]) => type !== suggestedType)
//       .map(([type, keywords]) => ({
//         type,
//         score: keywords.filter(k => text.includes(k)).length / keywords.length
//       }))
//       .filter(alt => alt.score > 0.2)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 3);

//     return {
//       isValid,
//       validationScore: Math.round(validationScore * 100),
//       matchedKeywords: keywordMatches,
//       alternatives: alternatives.map(alt => ({
//         problemType: alt.type,
//         confidence: Math.round(alt.score * 100)
//       })),
//       recommendation: isValid ? "Classification appears correct" : "Consider alternative classifications"
//     };
//   }
// };

// Export all tools
export const problemAnalyzerTools = [
  problemDatabaseQueryTool,
  // complexityAnalysisTool,
  // constraintParserTool,
  // patternRecognitionTool,
  // algorithmKnowledgeBaseTool,
  // classificationValidatorTool
];

// Output schema for the agent - using Zod for better type safety
export const outputSchema = z.object({
  problemType: z.enum([
    "array", "string", "graph", "tree", "dynamic-programming", 
    "greedy", "binary-search", "backtracking", "heap", "union-find", "math", "other"
  ]),
  subTags: z.array(z.string()).default([]),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  optimalApproachSummary: z.string(),
  constraints: z.object({
    n: z.number().nullable().optional(),
    timeLimit: z.string().nullable().optional(),
    memoryLimit: z.string().nullable().optional(),
    valuesRange: z.string().nullable().optional()
  }).default({}),
  candidateAlgorithms: z.array(z.object({
    name: z.string(),
    complexity: z.string(),
    whenToUse: z.string()
  })).default([]),
  recommendedAlgorithm: z.object({
    name: z.string(),
    reasoning: z.string()
  }),
  toolAnalysis: z.object({
    similarProblems: z.array(z.object({
      id: z.string(),
      title: z.string(),
      difficulty: z.string(),
      tags: z.array(z.string()),
      patterns: z.array(z.string()).optional(),
      editorialUrl: z.string().optional()
    })).optional(),
    patternAnalysis: z.object({}).optional(),
    complexityValidation: z.object({}).optional(),
    constraintAnalysis: z.object({}).optional()
  }).default({})
});