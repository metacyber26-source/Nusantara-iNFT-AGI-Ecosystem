/**
 * Cross-Metaverse Metadata Schemas
 * Production-ready metadata structures for Unreal Engine, Unity, and Babylon.js
 * Enables seamless asset injection into major Web3 gaming engines and open metaverse protocols
 */

import type { Inft, ExportFormat, Language } from "./forge-config"

export type MetaverseEngine = "unreal" | "unity" | "babylon" | "threejs" | "webgl"

/**
 * Unified Asset Metadata Standard
 * Compatible across all major game engines and metaverse platforms
 */
export interface MetaverseAssetMetadata {
  // Core Identity
  assetId: string
  assetName: string
  assetVersion: string
  createdAt: string
  updatedAt: string
  creator: string

  // Engine-specific exports
  exports: EngineExport[]

  // Behavioral & Interactive Layer
  interactivityProfile: InteractivityProfile
  cognitiveBindings?: CognitiveBindings

  // Localization & Language Support
  supportedLanguages: Language[]
  defaultLanguage: Language

  // Commerce & Rights
  licensing: LicensingTerms
  royaltyConfig: RoyaltyConfiguration

  // Quality & Performance
  qualityMetrics: QualityMetrics

  // Metaverse Registry
  metaverseRegistrations: MetaverseRegistration[]
}

/**
 * Engine-specific export configuration
 * Each engine gets optimized payload and format
 */
export interface EngineExport {
  engine: MetaverseEngine
  exportFormat: ExportFormat
  fileSize: number // bytes
  polyCount: number
  textureResolution: string // e.g., "2048x2048"
  animationClips: AnimationClip[]
  materialDefinitions: MaterialDefinition[]
  performanceTargets: PerformanceTarget
  exportTimestamp: string
}

export interface AnimationClip {
  name: string
  duration: number // seconds
  frameRate: number
  looping: boolean
  priority: number // 0-10 (execution priority)
}

export interface MaterialDefinition {
  name: string
  shaderType: "standard" | "pbr" | "custom"
  roughness: number
  metallic: number
  emissive: { r: number; g: number; b: number }
  texture: { type: string; url: string }[]
}

export interface PerformanceTarget {
  targetFPS: number
  maxMemoryMB: number
  gpuOptimized: boolean
  lodLevels: number
}

/**
 * Interactivity Profile for Cross-Platform Behaviors
 */
export interface InteractivityProfile {
  isPlayable: boolean
  isRideable: boolean
  isEquippable: boolean
  isConsumable: boolean
  customInteractions: CustomInteraction[]
  animationTriggers: AnimationTrigger[]
}

export interface CustomInteraction {
  name: string
  triggerEvent: string // e.g., "onCollide", "onEquip", "onActivate"
  action: string
  soundEffect?: string
  particleEffect?: string
}

export interface AnimationTrigger {
  triggerName: string
  inputEvent: string
  targetAnimationClip: string
  transitionDuration: number // seconds
}

/**
 * Cognitive Bindings for AGI Integration
 * Links iNFT behavioral evolution to game engine AI systems
 */
export interface CognitiveBindings {
  agentSystemType: "unreal_ai" | "unity_navmesh" | "babylon_behavior" | "custom"
  behaviorTreePath?: string
  neuralScriptBindings: NeuralScriptBinding[]
  learningEvents: LearningEventBinding[]
}

export interface NeuralScriptBinding {
  scriptName: string
  parameterId: string // exposed parameter in engine
  evolutionDimension: "conversationalDepth" | "gameticticsProficiency" | "crossPlatformScore"
  scalingFactor: number
}

export interface LearningEventBinding {
  engineEventType: string
  evolutionContext: "gaming" | "marketplace" | "social" | "utility"
  proficiencyMapping: number
}

/**
 * Licensing & Commerce Terms
 */
export interface LicensingTerms {
  licenseType: "exclusive" | "non-exclusive" | "limited"
  usageRights: UsageRight[]
  commercialUsageAllowed: boolean
  derivativeWorks: "allowed" | "restricted" | "prohibited"
  attributionRequired: boolean
  expirationDate?: string
}

export interface UsageRight {
  platform: string
  permission: "view" | "use" | "modify" | "redistribute"
  tier: "free" | "premium" | "enterprise"
}

export interface RoyaltyConfiguration {
  primarySaleRoyalty: number // percentage
  secondarySaleRoyalty: number // percentage
  rentalIncomeShare: number // percentage
  royaltyAddress: string
  payoutFrequency: "monthly" | "quarterly" | "on-demand"
}

/**
 * Quality & Performance Metrics
 */
export interface QualityMetrics {
  polyCountScore: number // 0-100
  textureQualityScore: number // 0-100
  rigQualityScore: number // 0-100 (for rigged assets)
  compatibilityScore: number // 0-100 (engine compatibility)
  overall: number // weighted average
  certifiedProduction: boolean
  lastAuditDate: string
}

/**
 * Metaverse Platform Registrations
 * Tracks asset presence across platforms
 */
export interface MetaverseRegistration {
  platform: string // e.g., "decentraland", "roblox", "fortnite", "oncyber"
  assetId: string // platform-specific ID
  registrationDate: string
  status: "active" | "archived" | "pending"
  instantiationCount: number
  lastActivity: string
}

/**
 * Generate production-ready metadata for an iNFT
 */
export function generateMetaverseMetadata(
  inft: Inft,
  cognitiveProfile: any,
  exportConfigs: Partial<EngineExport>[],
): MetaverseAssetMetadata {
  const now = new Date().toISOString()

  return {
    assetId: inft.id,
    assetName: inft.name,
    assetVersion: "1.0.0",
    createdAt: now,
    updatedAt: now,
    creator: inft.creator,

    exports: exportConfigs.map((config) => ({
      engine: config.engine || "webgl",
      exportFormat: config.exportFormat || "GLB",
      fileSize: config.fileSize || 0,
      polyCount: parseInt(inft.polyCount.split(" ")[0]) || 5000,
      textureResolution: config.textureResolution || "2048x2048",
      animationClips: config.animationClips || [],
      materialDefinitions: config.materialDefinitions || [],
      performanceTargets: config.performanceTargets || {
        targetFPS: 60,
        maxMemoryMB: 256,
        gpuOptimized: true,
        lodLevels: 3,
      },
      exportTimestamp: now,
    } as EngineExport)),

    interactivityProfile: {
      isPlayable: inft.format === "3D",
      isRideable: inft.name.toLowerCase().includes("mount"),
      isEquippable: inft.forSale,
      isConsumable: inft.format === "Audio",
      customInteractions: [],
      animationTriggers: [],
    },

    cognitiveBindings: cognitiveProfile
      ? {
          agentSystemType: "custom",
          neuralScriptBindings: [
            {
              scriptName: "personality_driver",
              parameterId: "character_personality",
              evolutionDimension: "conversationalDepth",
              scalingFactor: 0.01,
            },
            {
              scriptName: "game_tactics_driver",
              parameterId: "ai_tactics_proficiency",
              evolutionDimension: "gameticticsProficiency",
              scalingFactor: 0.015,
            },
          ],
          learningEvents: [
            { engineEventType: "combat_success", evolutionContext: "gaming", proficiencyMapping: 1.0 },
            { engineEventType: "interaction_positive", evolutionContext: "social", proficiencyMapping: 0.8 },
          ],
        }
      : undefined,

    supportedLanguages: inft.languages,
    defaultLanguage: "EN",

    licensing: {
      licenseType: "non-exclusive",
      usageRights: [
        { platform: "all", permission: "use", tier: "premium" },
        { platform: "web3", permission: "redistribute", tier: "premium" },
      ],
      commercialUsageAllowed: true,
      derivativeWorks: "restricted",
      attributionRequired: true,
    },

    royaltyConfig: {
      primarySaleRoyalty: 50,
      secondarySaleRoyalty: 50,
      rentalIncomeShare: 50,
      royaltyAddress: `nnif_${inft.creator}`,
      payoutFrequency: "on-demand",
    },

    qualityMetrics: {
      polyCountScore: Math.min(100, (10000 / parseInt(inft.polyCount.split(" ")[0])) * 100),
      textureQualityScore: 85,
      rigQualityScore: inft.rigged ? 90 : 0,
      compatibilityScore: 92,
      overall: 89,
      certifiedProduction: true,
      lastAuditDate: now,
    },

    metaverseRegistrations: [],
  }
}

/**
 * Export metadata to engine-specific JSON payload
 */
export function exportToEnginePayload(metadata: MetaverseAssetMetadata, engine: MetaverseEngine): string {
  const engineExport = metadata.exports.find((e) => e.engine === engine)

  if (!engineExport) {
    throw new Error(`No export configuration for engine: ${engine}`)
  }

  const payload = {
    metadata: {
      id: metadata.assetId,
      name: metadata.assetName,
      version: metadata.assetVersion,
      creator: metadata.creator,
    },
    export: {
      format: engineExport.exportFormat,
      polyCount: engineExport.polyCount,
      textureResolution: engineExport.textureResolution,
      performanceTargets: engineExport.performanceTargets,
    },
    interactivity: metadata.interactivityProfile,
    cognitive: metadata.cognitiveBindings,
    licensing: metadata.licensing,
    royalty: metadata.royaltyConfig,
    languages: metadata.supportedLanguages,
  }

  return JSON.stringify(payload, null, 2)
}

/**
 * Generate Babylon.js scene configuration
 */
export function generateBabylonConfig(metadata: MetaverseAssetMetadata): BabylonSceneConfig {
  const babylonExport = metadata.exports.find((e) => e.engine === "babylon")

  return {
    assetName: metadata.assetName,
    assetUrl: `./assets/${metadata.assetId}.babylon`,
    scaling: 1.0,
    animations: babylonExport?.animationClips.map((clip) => ({
      name: clip.name,
      startFrame: 0,
      endFrame: clip.duration * clip.frameRate,
      loopMode: clip.looping ? true : false,
      speedRatio: 1.0,
    })) || [],
    physics: {
      enabled: true,
      engine: "cannon",
      gravity: { x: 0, y: -9.81, z: 0 },
    },
    interactivity: metadata.interactivityProfile,
  }
}

export interface BabylonSceneConfig {
  assetName: string
  assetUrl: string
  scaling: number
  animations: Array<{
    name: string
    startFrame: number
    endFrame: number
    loopMode: boolean
    speedRatio: number
  }>
  physics: {
    enabled: boolean
    engine: string
    gravity: { x: number; y: number; z: number }
  }
  interactivity: InteractivityProfile
}

/**
 * Generate Unity URP Material Definition
 */
export function generateUnityMaterial(material: MaterialDefinition): UnityMaterialConfig {
  return {
    name: material.name,
    shader: "Universal Render Pipeline/Lit",
    properties: {
      roughness: material.roughness,
      metallic: material.metallic,
      emissionColor: material.emissive,
      mainTexture: material.texture.find((t) => t.type === "diffuse")?.url || "",
      normalMap: material.texture.find((t) => t.type === "normal")?.url || "",
      roughnessMap: material.texture.find((t) => t.type === "roughness")?.url || "",
      metallicMap: material.texture.find((t) => t.type === "metallic")?.url || "",
    },
  }
}

export interface UnityMaterialConfig {
  name: string
  shader: string
  properties: {
    roughness: number
    metallic: number
    emissionColor: { r: number; g: number; b: number }
    mainTexture: string
    normalMap: string
    roughnessMap: string
    metallicMap: string
  }
}

/**
 * Generate Unreal Engine DataTable for asset import
 */
export function generateUnrealAssetTable(metadata: MetaverseAssetMetadata): UnrealAssetTableEntry {
  const unrealExport = metadata.exports.find((e) => e.engine === "unreal")

  return {
    AssetID: metadata.assetId,
    AssetName: metadata.assetName,
    CreatorName: metadata.creator,
    Format: unrealExport?.exportFormat || "GLTF",
    PolyCount: unrealExport?.polyCount || 5000,
    TextureRes: unrealExport?.textureResolution || "2048x2048",
    Skeletal: unrealExport?.animationClips.length > 0,
    AnimationCount: unrealExport?.animationClips.length || 0,
    Rideable: metadata.interactivityProfile.isRideable,
    Equippable: metadata.interactivityProfile.isEquippable,
    CognitiveEnabled: !!metadata.cognitiveBindings,
    RoyaltyPercent: metadata.royaltyConfig.primarySaleRoyalty,
  }
}

export interface UnrealAssetTableEntry {
  AssetID: string
  AssetName: string
  CreatorName: string
  Format: string
  PolyCount: number
  TextureRes: string
  Skeletal: boolean
  AnimationCount: number
  Rideable: boolean
  Equippable: boolean
  CognitiveEnabled: boolean
  RoyaltyPercent: number
}
