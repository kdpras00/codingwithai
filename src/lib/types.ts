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

export interface PrdModule {
  name: string;
  features: string[];
}

export interface UserFlowStep {
  step: number;
  title: string;
  description: string;
}

export interface DbColumn {
  name: string;
  type: string;
  note?: string;
}

export interface DbTable {
  name: string;
  description: string;
  columns: DbColumn[];
}

export interface ArchComponent {
  name: string;
  layer: string;
  description: string;
  tech: string;
}

export interface UserStory {
  persona: string;
  action: string;
  value: string;
  acceptanceCriteria: string[];
}

export interface Risk {
  risk: string;
  impact: string;
  mitigation: string;
}

export interface Milestone {
  phase: string;
  title: string;
  duration: string;
  deliverables: string[];
}

export interface Assumption {
  assumption: string;
  validationPlan: string;
}

export interface Role {
  role: string;
  accessLevel: string;
  description: string;
}

export interface Prd {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  problem: string;
  audience: string[];
  goals: string[];
  modelId: string;
  createdAt: number;
  requirements: string[];
  modules: PrdModule[];
  userFlow: UserFlowStep[];
  architecture: ArchComponent[];
  db: DbTable[];
  constraints: string[];
  outOfScope: string[];
  successMetrics: string[];
  userStories?: UserStory[];
  risks?: Risk[];
  milestones?: Milestone[];
  assumptions?: Assumption[];
  roles?: Role[];
}

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
