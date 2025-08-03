import { AgentBuilder } from "@iqai/adk";
import { problemAnalyzerAgent } from "./agents/problem-analyzer-agent/agent";
import { env } from "./env";
import * as dotenv from "dotenv";
import { solutionPlannerAgent } from "./agents/solution-planner-agent/agent";
import { codeGeneratorAgent } from "./agents/code-generator-agent/agent";

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
  console.log("🤖 DSA Assistant - Problem Analysis & Solution Planning");
  console.log("=".repeat(60));

  // Problem Analysis
  console.log("🔍 Step 1: Analyzing problem...");
  const { runner: analyzerRunner } = await AgentBuilder.create("ProblemAnalyzer_Runner")
    .withSubAgents([problemAnalyzerAgent])
    .withModel(env.LLM_MODEL)
    .build();

  const analysisResponse = await analyzerRunner.ask(`ProblemAnalyzer: Analyze this DSA problem: ${sampleProblem}`);
  console.log("📊 Analysis Result:");
  console.log(analysisResponse);
  console.log("-".repeat(40));

  // Solution Planning
  console.log("🔍 Step 2: Creating solution plan...");
  const { runner: plannerRunner } = await AgentBuilder.create("SolutionPlanner_Runner")
    .withSubAgents([solutionPlannerAgent])
    .withModel(env.LLM_MODEL)
    .build();

  const planResponse = await plannerRunner.ask(`SolutionPlanner: Based on this analysis: ${analysisResponse}, create a detailed solution plan for: ${sampleProblem}`);
  console.log("📋 Plan Result:");
  console.log(planResponse);
  console.log("-".repeat(40));

  // Code Generation
  console.log("🔍 Step 3: Generating code...");
  const { runner: codeRunner } = await AgentBuilder.create("CodeGenerator_Runner")
    .withSubAgents([codeGeneratorAgent])
    .withModel(env.LLM_MODEL)
    .build();

  const codeResponse = await codeRunner.ask(`CodeGenerator: Based on this analysis: ${analysisResponse} and this plan: ${planResponse}, generate complete code for: ${sampleProblem}`);
  console.log("💻 Code Result:");
  console.log(codeResponse);

  console.log("🎉 Complete DSA Assistant Response:");
  console.log("=".repeat(60));
  console.log("ANALYSIS:", analysisResponse);
  console.log("\nPLAN:", planResponse);
  console.log("\nCODE:", codeResponse);
}

main().catch(console.error);