import { AgentBuilder } from "@iqai/adk";
import { problemAnalyzerAgent } from "./agents/problem-analyzer-agent/agent";
import { env } from "./env";
import * as dotenv from "dotenv";

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

async function main() {
    const { runner } = await AgentBuilder
        .create("ProblemAnalyzerTest")
        .withSubAgents([problemAnalyzerAgent])
        .withModel(env.LLM_MODEL)
        .build();
    
    console.log("🔍 Running Problem Analyzer Agent...");
    const response = await runner.ask(sampleProblem);
    console.log("📊 Analysis Output:\n", JSON.stringify(response, null, 2));
}

main().catch(console.error);