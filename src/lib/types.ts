import { z } from "zod";

export interface GenOptions {
  idea: string;
  type: string;
  modelId: string;
  userName?: string;
  nameOverride?: string;
  audience?: string;
  answers?: string[];
  tech?: string[];
  lang?: string;
  modulesHint?: { name: string; features: string[] }[];
}

export const prdSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  summary: z.string(),
  problem: z.string(),
  audience: z.array(z.string()),
  goals: z.array(z.string()),
  requirements: z.array(z.string()),
  modules: z.array(
    z.object({
      name: z.string(),
      features: z.array(z.string()),
    })
  ).optional(),
  userFlow: z.array(
    z.object({
      step: z.number(),
      title: z.string(),
      description: z.string(),
    })
  ),
  architecture: z.array(
    z.object({
      name: z.string(),
      layer: z.string(),
      description: z.string(),
      tech: z.string(),
    })
  ),
  db: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      columns: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          note: z.string().optional(),
        })
      ),
    })
  ),
  constraints: z.array(z.string()),
  outOfScope: z.array(z.string()),
  successMetrics: z.array(z.string()),
  userStories: z.array(
    z.object({
      persona: z.string(),
      action: z.string(),
      value: z.string(),
      acceptanceCriteria: z.array(z.string()),
    })
  ).optional(),
  risks: z.array(
    z.object({
      risk: z.string(),
      impact: z.string(),
      mitigation: z.string(),
    })
  ).optional(),
  milestones: z.array(
    z.object({
      phase: z.string(),
      title: z.string(),
      duration: z.string(),
      deliverables: z.array(z.string()),
    })
  ).optional(),
  assumptions: z.array(
    z.object({
      assumption: z.string(),
      validationPlan: z.string(),
    })
  ).optional(),
  roles: z.array(
    z.object({
      role: z.string(),
      accessLevel: z.string(),
      description: z.string(),
    })
  ).optional(),
  consistencyAudit: z.array(z.string()).optional(),
});

export interface AgentModel {
  id: string;
  name: string;
  vendor: string;
  tagline: string;
  price: string;
  speed: number;
  quality: number;
  accent: string;
}

export interface AgentLog {
  agentId: string;
  agentName: string;
  role: string;
  lines: string[];
  status: "pending" | "running" | "done";
}

export type Prd = z.infer<typeof prdSchema> & {
  id: string;
  modelId: string;
  createdAt: number;
};
export type PrdModule = NonNullable<Prd["modules"]>[number];
export type UserFlowStep = Prd["userFlow"][number];
export type DbTable = Prd["db"][number];
export type DbColumn = DbTable["columns"][number];
export type ArchComponent = Prd["architecture"][number];
export type UserStory = NonNullable<Prd["userStories"]>[number];
export type Risk = NonNullable<Prd["risks"]>[number];
export type Milestone = NonNullable<Prd["milestones"]>[number];
export type Assumption = NonNullable<Prd["assumptions"]>[number];
export type Role = NonNullable<Prd["roles"]>[number];
export type GraphNode = {
  id: string;
  kind: "Epic" | "Story" | "Task" | "API" | "Table" | "Component";
  label: string;
  sub: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
};

export type GraphLayout = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type Tier = "static" | "simple" | "medium" | "full";
