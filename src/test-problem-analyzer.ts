import { AgentBuilder } from "@iqai/adk";
import { problemAnalyzerTools, outputSchema } from "./agents/problem-analyzer-agent/tools";
import { env } from "./env";
import * as dotenv from "dotenv";
import dedent from "dedent";

dotenv.config();

const sampleProblem = `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Constraints:
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9
- Only one valid answer exists.
`;

const problemAnalyzerInstruction = dedent`
You are the Problem Analyzer Agent for a DSA (Data Structures and Algorithms) assistant.

CORE RESPONSIBILITIES:
1. **Problem Classification**: Analyze the problem statement and classify it into one of these primary types:
   - array: Problems involving array manipulation, traversal, or operations
   - string: String processing, pattern matching, character manipulation
   - graph: Graph traversal, shortest paths, connectivity problems
   - tree: Binary trees, BSTs, tree traversals, tree construction
   - dynamic-programming: Optimization problems with overlapping subproblems
   - greedy: Problems where local optimal choices lead to global optimum
   - binary-search: Search problems in sorted spaces or answer spaces
   - backtracking: Constraint satisfaction, generating combinations/permutations
   - heap: Priority queue operations, k-th element problems
   - union-find: Disjoint set problems, connectivity queries
   - math: Mathematical computations, number theory, geometry
   - other: Problems that don't fit the above categories

2. **Sub-tags Identification**: Identify specific techniques or patterns within the problem
3. **Constraint Extraction**: Parse constraints for n, timeLimit, memoryLimit, valuesRange
4. **Algorithm Candidates**: List 2-4 viable algorithms with complexity analysis
5. **Best Algorithm Recommendation**: Select the most appropriate algorithm
6. **Difficulty Assessment**: Estimate difficulty (easy/medium/hard)

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON matching the exact output schema
- No explanatory text outside the JSON structure
- Be precise and specific in algorithm names and complexity notations`;

async function main() {
    try {
        console.log("🔍 Creating Problem Analyzer Agent...");
        
        // Create agent using AgentBuilder with tools (remove outputSchema due to Gemini limitation with tools)
        const { runner } = await AgentBuilder
            .create("ProblemAnalyzerTest")
            .withModel(env.LLM_MODEL)
            .withDescription("Classifies DSA problems, suggests candidate algorithms, and recommends one with reasoning.")
            .withInstruction(problemAnalyzerInstruction + `

IMPORTANT: You MUST respond with a valid JSON object that matches this exact structure:
{
  "problemType": "array|string|graph|tree|dynamic-programming|greedy|binary-search|backtracking|heap|union-find|math|other",
  "subTags": ["tag1", "tag2"],
  "difficulty": "easy|medium|hard",
  "optimalApproachSummary": "Brief explanation of the best approach",
  "constraints": {
    "n": null|number,
    "timeLimit": null|"string",
    "memoryLimit": null|"string", 
    "valuesRange": null|"string"
  },
  "candidateAlgorithms": [
    {
      "name": "Algorithm Name",
      "complexity": "O(n) time, O(1) space",
      "whenToUse": "When to use this algorithm"
    }
  ],
  "recommendedAlgorithm": {
    "name": "Best Algorithm Name", 
    "reasoning": "Why this is the best choice"
  },
  "toolAnalysis": {
    "similarProblems": [],
    "patternAnalysis": {},
    "complexityValidation": {},
    "constraintAnalysis": {}
  }
}

Before responding with the final JSON, use the available tools to gather information and enhance your analysis.`)
            .withTools(...problemAnalyzerTools)
            .withQuickSession()
            .build();
        
        console.log("� Running Problem Analyzer Agent...");
        console.log(`📝 Problem: ${sampleProblem.substring(0, 100)}...`);
        
        const response = await runner.ask(`Analyze this DSA problem: ${sampleProblem}`);
        
        console.log("📊 Analysis Output:");
        console.log("=".repeat(50));
        
        // Try to parse the JSON response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                console.log(JSON.stringify(result, null, 2));
                
                // Additional analysis
                console.log("\n🎯 Quick Summary:");
                console.log(`- Problem Type: ${result.problemType}`);
                console.log(`- Difficulty: ${result.difficulty}`);
                console.log(`- Recommended: ${result.recommendedAlgorithm?.name || "N/A"}`);
                console.log(`- Sub-tags: ${result.subTags?.join(", ") || "None"}`);
                
            } else {
                console.log("Raw response:", response);
            }
        } catch (parseError) {
            console.log("Raw response:", response);
            console.log("Parse error:", parseError);
        }
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main().catch(console.error);
