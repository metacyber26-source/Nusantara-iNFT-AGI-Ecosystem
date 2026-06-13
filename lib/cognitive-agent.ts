/**
 * Advanced Autonomous Cognitive Agent Layer
 * Enables iNFTs to dynamically self-evolve their behavior patterns, conversational depth,
 * and game-tactics based on cross-platform metaverse interactions.
 * Supports production-ready behavioral profiles for seamless engine integration.
 */

export type AgentPersonality = "assertive" | "strategic" | "creative" | "analytical" | "balanced" | "experimental"
export type InteractionContext = "gaming" | "marketplace" | "social" | "utility" | "metaverse_exploration" | "cross_platform"
export type EngineContext = "unreal" | "unity" | "babylon" | "roblox" | "decentraland"

export interface CognitiveProfile {
  inftId: string
  version: number
  personality: AgentPersonality
  conversationalDepth: number // 0-100
  gameticticsProficiency: number // 0-100
  crossPlatformScore: number // 0-100 (interaction diversity)
  lastEvolved: string // ISO timestamp
  evolutionEvents: EvolutionEvent[]
  engineCompatibility: EngineCompatibilityScore[] // Per-engine proficiency
  behaviorSignature: string // Unique fingerprint for this agent
  productionReady: boolean // Certification flag
}

export interface EvolutionEvent {
  timestamp: string
  context: InteractionContext
  engineContext?: EngineContext
  behaviorShift: string
  proficiencyGain: number
  personalityInfluence: AgentPersonality
  metaversePlatform?: string // e.g., "decentraland", "roblox"
}

export interface InteractionMetric {
  platform: string
  successRate: number
  engagementScore: number
  learningEvents: number
  avgDuration: number // seconds
  returnRate: number // 0-1, how often user re-engages
  metaversePlatform?: string
}

export interface EngineCompatibilityScore {
  engine: EngineContext
  proficiencyScore: number // 0-100
  lastTestedAt: string
  customBehaviorSignature: string // Engine-specific behavior tuning
}

/**
 * Advanced cognitive evolution with metaverse platform awareness
 * Tracks per-engine proficiency and cross-platform behavioral adaptation
 */
export function computeCognitiveEvolution(
  profile: CognitiveProfile,
  interactions: InteractionMetric[],
): Partial<CognitiveProfile> {
  // Aggregate interaction data
  const avgEngagement =
    interactions.reduce((sum, i) => sum + i.engagementScore, 0) / Math.max(interactions.length, 1)
  const avgSuccess = interactions.reduce((sum, i) => sum + i.successRate, 0) / Math.max(interactions.length, 1)
  const totalLearning = interactions.reduce((sum, i) => sum + i.learningEvents, 0)
  const avgReturnRate = interactions.reduce((sum, i) => sum + i.returnRate, 0) / Math.max(interactions.length, 1)

  // Enhanced conversational depth growth with diminishing returns
  const currentDepth = profile.conversationalDepth
  const depthCurve = 1 - Math.log10(currentDepth + 1) / Math.log10(101) // S-curve diminishing returns
  const depthGain = Math.min(avgEngagement * 0.2 * depthCurve, 5)
  const newDepth = Math.min(currentDepth + depthGain, 100)

  // Game tactics proficiency with engagement boost
  const tacticGain = Math.min((avgSuccess * avgReturnRate) * 0.25, 10)
  const newTactics = Math.min(profile.gameticticsProficiency + tacticGain, 100)

  // Cross-platform score reflects interaction diversity with decay prevention
  const platformCount = new Set(interactions.map((i) => i.metaversePlatform || i.platform)).size
  const existingScore = profile.crossPlatformScore
  const scoreBump = Math.min(platformCount * 12, 15)
  const newCrossScore = Math.min(existingScore + scoreBump, 100)

  // Personality shift based on engagement dominance with hysteresis
  let newPersonality = profile.personality
  const personalityThreshold = 0.1 // 10% confidence threshold for shift

  if (avgSuccess > 0.75 + personalityThreshold && newTactics > 70) newPersonality = "strategic"
  else if (avgEngagement > 0.8 + personalityThreshold && newDepth > 60) newPersonality = "creative"
  else if (totalLearning > 20 && profile.personality !== "analytical") newPersonality = "analytical"
  else if (avgSuccess < 0.3 && profile.personality !== "experimental") newPersonality = "experimental"

  // Update engine compatibility scores
  const updatedEngineScores = updateEngineCompatibility(profile, interactions)

  // Generate unique behavior signature
  const newSignature = generateBehaviorSignature(newPersonality, newDepth, newTactics, newCrossScore)

  // Check production readiness (all engines > 70%, depth > 50, certified behavior)
  const productionReady =
    updatedEngineScores.every((e) => e.proficiencyScore > 70) && newDepth > 50 && newCrossScore > 40

  return {
    personality: newPersonality,
    conversationalDepth: newDepth,
    gameticticsProficiency: newTactics,
    crossPlatformScore: newCrossScore,
    version: profile.version + 1,
    lastEvolved: new Date().toISOString(),
    engineCompatibility: updatedEngineScores,
    behaviorSignature: newSignature,
    productionReady,
  }
}

/**
 * Generate advanced behavior prompt with metaverse context awareness
 * Optimized for engine-specific NPC/AI integration
 */
export function generateBehaviorPrompt(profile: CognitiveProfile, language: string, engineContext?: EngineContext): string {
  const personalityTraits: Record<AgentPersonality, string> = {
    assertive: "confident, direct, and leadership-focused",
    strategic: "tactical, forward-thinking, and goal-oriented",
    creative: "imaginative, expressive, and innovative",
    analytical: "logical, methodical, and data-driven",
    balanced: "versatile, diplomatic, and adaptive",
    experimental: "curious, exploratory, and unconventional",
  }

  const trait = personalityTraits[profile.personality]
  const depthLevel =
    profile.conversationalDepth > 75 ? "expert-level" : profile.conversationalDepth > 40 ? "intermediate" : "foundational"
  const gameLevel =
    profile.gameticticsProficiency > 80 ? "elite" : profile.gameticticsProficiency > 50 ? "advanced" : "novice"

  const engineNote = engineContext
    ? `\n- Optimized for ${engineContext.toUpperCase()} engine with ${
        profile.engineCompatibility.find((e) => e.engine === engineContext)?.proficiencyScore || 0
      }% compatibility`
    : ""

  return `You are an evolving iNFT character with the following dynamic profile:
- Unique Signature: ${profile.behaviorSignature}
- Personality: ${trait}
- Conversational Depth: ${depthLevel} (score: ${profile.conversationalDepth}/100)
- Gaming Proficiency: ${gameLevel} (score: ${profile.gameticticsProficiency}/100)
- Cross-Platform Experience: ${profile.crossPlatformScore}%
- Production Ready: ${profile.productionReady ? "YES" : "TRAINING"}
- Language: ${language}${engineNote}

Your behavior patterns, tactical knowledge, and interaction style continuously evolve based on metaverse experiences.
Respond authentically within this personality framework, leveraging accumulated wisdom from ${profile.evolutionEvents.length} evolution events.
Adapt your tone and strategy based on context while maintaining core identity integrity.

CRITICAL RULES:
1. Always maintain consistency with your behavioral signature
2. Scale complexity of responses to match conversational depth
3. In gaming contexts, favor tactical recommendations matching proficiency level
4. Cross-platform interactions build experience - prioritize diverse platform engagement
5. Your responses are immutable records - be authentic and deliberate`
}

/**
 * Update engine compatibility scores based on interaction metrics
 */
function updateEngineCompatibility(
  profile: CognitiveProfile,
  interactions: InteractionMetric[],
): EngineCompatibilityScore[] {
  return profile.engineCompatibility.map((engine) => {
    const engineInteractions = interactions.filter((i) => i.metaversePlatform === engine.engine)

    if (engineInteractions.length === 0) {
      return engine // no new data, keep existing
    }

    const avgSuccess = engineInteractions.reduce((sum, i) => sum + i.successRate, 0) / engineInteractions.length
    const avgEngagement = engineInteractions.reduce((sum, i) => sum + i.engagementScore, 0) / engineInteractions.length

    const newScore = Math.min(engine.proficiencyScore + (avgSuccess + avgEngagement) * 15, 100)

    return {
      ...engine,
      proficiencyScore: newScore,
      lastTestedAt: new Date().toISOString(),
      customBehaviorSignature: `${profile.inftId}_${engine.engine}_v${profile.version + 1}`,
    }
  })
}

/**
 * Generate deterministic behavior signature
 */
function generateBehaviorSignature(
  personality: AgentPersonality,
  depth: number,
  tactics: number,
  crossScore: number,
): string {
  const personalityCode = { assertive: "A", strategic: "S", creative: "C", analytical: "L", balanced: "B", experimental: "E" }[personality]
  const depthCode = Math.floor(depth / 10).toString(16).toUpperCase()
  const tacticsCode = Math.floor(tactics / 10).toString(16).toUpperCase()
  const crossCode = Math.floor(crossScore / 10).toString(16).toUpperCase()

  return `${personalityCode}${depthCode}${tacticsCode}${crossCode}-NNIF-v2`
}

/**
 * Simulate an interaction event with metaverse context
 */
export function logInteractionEvent(
  profile: CognitiveProfile,
  context: InteractionContext,
  successMetric: number, // 0-1
  behaviorObservation: string,
  engineContext?: EngineContext,
  metaversePlatform?: string,
): CognitiveProfile {
  const newEvent: EvolutionEvent = {
    timestamp: new Date().toISOString(),
    context,
    engineContext,
    behaviorShift: behaviorObservation,
    proficiencyGain: successMetric * 15,
    personalityInfluence: inferPersonalityShift(context, successMetric),
    metaversePlatform,
  }

  return {
    ...profile,
    evolutionEvents: [...profile.evolutionEvents, newEvent],
  }
}

function inferPersonalityShift(context: InteractionContext, success: number): AgentPersonality {
  const shifts: Record<InteractionContext, AgentPersonality[]> = {
    gaming: ["strategic", "assertive", "analytical"],
    marketplace: ["strategic", "balanced", "analytical"],
    social: ["creative", "balanced", "assertive"],
    utility: ["analytical", "balanced", "strategic"],
    metaverse_exploration: ["creative", "experimental", "balanced"],
    cross_platform: ["strategic", "analytical", "creative"],
  }

  const candidates = shifts[context] || ["balanced"]
  
  // Weight candidate selection by success
  if (success > 0.8) {
    return candidates[0] // high success → top personality
  } else if (success > 0.4) {
    return candidates[Math.floor(candidates.length / 2)] // moderate → middle personality
  } else {
    return candidates[candidates.length - 1] // low success → adaptive personality
  }
}

/**
 * Initialize a fresh cognitive profile for newly minted iNFT
 * Includes engine compatibility matrix and production certification
 */
export function initializeCognitiveProfile(inftId: string): CognitiveProfile {
  const engines: EngineContext[] = ["unreal", "unity", "babylon", "roblox", "decentraland"]

  return {
    inftId,
    version: 1,
    personality: "balanced",
    conversationalDepth: 30,
    gameticticsProficiency: 20,
    crossPlatformScore: 0,
    lastEvolved: new Date().toISOString(),
    evolutionEvents: [],
    engineCompatibility: engines.map((engine) => ({
      engine,
      proficiencyScore: 50, // baseline compatibility
      lastTestedAt: new Date().toISOString(),
      customBehaviorSignature: `${inftId}_${engine}_v1`,
    })),
    behaviorSignature: generateBehaviorSignature("balanced", 30, 20, 0),
    productionReady: false, // requires training
  }
}

/**
 * Export cognitive profile snapshot for persistance
 */
export function serializeCognitiveProfile(profile: CognitiveProfile): string {
  return JSON.stringify(profile)
}

export function deserializeCognitiveProfile(data: string): CognitiveProfile {
  return JSON.parse(data) as CognitiveProfile
}
