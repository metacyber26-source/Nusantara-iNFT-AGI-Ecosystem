/**
 * Metaverse Payload Generator
 * Standardized structures for seamless asset injection into Web3 gaming ecosystems
 * Supports: Decentraland, Roblox, Sandbox, Fortnite Creative, OnCyber, and custom engines
 */

import type {
  MetaverseAssetMetadata,
  EngineExport,
  InteractivityProfile,
  CognitiveBindings,
} from "./metaverse-metadata"

export type MetaverseProtocol = "decentraland" | "sandbox" | "oncyber" | "fortnite" | "roblox" | "custom_webgl"

/**
 * Universal Metaverse Injection Payload
 * Single standardized format that adapts to any platform
 */
export interface MetaverseInjectionPayload {
  version: string
  protocol: MetaverseProtocol
  timestamp: string
  asset: AssetPayload
  transform: TransformPayload
  physics: PhysicsPayload
  interaction: InteractionPayload
  cognitive: CognitivePayload | null
  commerce: CommercePayload
}

export interface AssetPayload {
  id: string
  name: string
  creator: string
  format: string // GLB, GLTF, FBX, VRM, etc.
  url: string
  checksum: string // SHA256 for integrity verification
  fileSize: number
  polyCount: number
  textureResolution: string
  metadata: Record<string, any>
}

export interface TransformPayload {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number; w: number } // quaternion
  scale: { x: number; y: number; z: number }
  pivot: { x: number; y: number; z: number }
}

export interface PhysicsPayload {
  enabled: boolean
  bodyType: "static" | "dynamic" | "kinematic"
  mass: number
  gravity: boolean
  friction: number
  restitution: number
  linearDamping: number
  angularDamping: number
  colliders: ColliderDefinition[]
}

export interface ColliderDefinition {
  shape: "box" | "sphere" | "capsule" | "mesh"
  size: { x: number; y: number; z: number }
  offset: { x: number; y: number; z: number }
  isTrigger: boolean
}

export interface InteractionPayload {
  enabled: boolean
  interactionType: "clickable" | "holdable" | "proximity" | "wearable" | "rideable" | "consumable"
  triggerRadius: number
  interactions: InteractionDefinition[]
  animations: AnimationDefinition[]
}

export interface InteractionDefinition {
  id: string
  name: string
  triggerEvent: string
  action: string
  parameters: Record<string, any>
  costInPi?: number // Pi Network payment required
  soundEffect?: string
  particleEffect?: string
}

export interface AnimationDefinition {
  id: string
  name: string
  clip: string
  duration: number
  looping: boolean
  startFrame: number
  endFrame: number
  transitionTime: number
  priority: number
}

export interface CognitivePayload {
  enabled: boolean
  agentId: string
  personality: string
  conversationalDepth: number
  gameticticsProficiency: number
  crossPlatformScore: number
  neuralBindings: NeuralBinding[]
  learningEnabled: boolean
  autonomousUpdate: boolean // allows agent to evolve during play
}

export interface NeuralBinding {
  parameterName: string
  evolutionDimension: string
  scalingFactor: number
  influenceRadius: number // how far this param affects behavior
}

export interface CommercePayload {
  purchasePrice: number // in Pi
  rentalPricePerDay: number // in Pi
  licensingTerms: string
  royaltyPercent: number
  creatorAddress: string
  escrowAddress: string
  paymentProcessor: "pi_network" | "stripe" | "web3"
}

/**
 * Generate platform-specific injection payload
 */
export function generateInjectionPayload(
  metadata: MetaverseAssetMetadata,
  protocol: MetaverseProtocol,
  customConfig?: Partial<MetaverseInjectionPayload>,
): MetaverseInjectionPayload {
  const basePayload: MetaverseInjectionPayload = {
    version: "1.0.0",
    protocol,
    timestamp: new Date().toISOString(),

    asset: {
      id: metadata.assetId,
      name: metadata.assetName,
      creator: metadata.creator,
      format: metadata.exports[0]?.exportFormat || "GLB",
      url: `ipfs://Qm${metadata.assetId}` || `https://cdn.nnif.io/${metadata.assetId}`,
      checksum: generateChecksum(metadata.assetId),
      fileSize: metadata.exports[0]?.fileSize || 0,
      polyCount: metadata.exports[0]?.polyCount || 5000,
      textureResolution: metadata.exports[0]?.textureResolution || "2048x2048",
      metadata: {
        languageSupport: metadata.supportedLanguages,
        qualityScore: metadata.qualityMetrics.overall,
        certifiedProduction: metadata.qualityMetrics.certifiedProduction,
      },
    },

    transform: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 },
      pivot: { x: 0, y: 0, z: 0 },
    },

    physics: {
      enabled: metadata.exports[0]?.performanceTargets.gpuOptimized || true,
      bodyType: "dynamic",
      mass: 1.0,
      gravity: true,
      friction: 0.5,
      restitution: 0.2,
      linearDamping: 0.1,
      angularDamping: 0.1,
      colliders: [
        {
          shape: "box",
          size: { x: 1, y: 1, z: 1 },
          offset: { x: 0, y: 0, z: 0 },
          isTrigger: false,
        },
      ],
    },

    interaction: {
      enabled: true,
      interactionType: metadata.interactivityProfile.isPlayable ? "clickable" : "proximity",
      triggerRadius: 5.0,
      interactions: metadata.interactivityProfile.customInteractions.map((ci) => ({
        id: `interaction_${ci.name}`,
        name: ci.name,
        triggerEvent: ci.triggerEvent,
        action: ci.action,
        parameters: {},
        soundEffect: ci.soundEffect,
        particleEffect: ci.particleEffect,
      })),
      animations: metadata.exports[0]?.animationClips.map((clip) => ({
        id: `anim_${clip.name}`,
        name: clip.name,
        clip: clip.name,
        duration: clip.duration,
        looping: clip.looping,
        startFrame: 0,
        endFrame: clip.duration * clip.frameRate,
        transitionTime: 0.3,
        priority: clip.priority,
      })) || [],
    },

    cognitive: metadata.cognitiveBindings
      ? {
          enabled: true,
          agentId: metadata.assetId,
          personality: "balanced",
          conversationalDepth: 30,
          gameticticsProficiency: 20,
          crossPlatformScore: 0,
          neuralBindings: metadata.cognitiveBindings.neuralScriptBindings.map((binding) => ({
            parameterName: binding.parameterId,
            evolutionDimension: binding.evolutionDimension,
            scalingFactor: binding.scalingFactor,
            influenceRadius: 100,
          })),
          learningEnabled: true,
          autonomousUpdate: false, // set to true for AGI evolution in future
        }
      : null,

    commerce: {
      purchasePrice: 1.0, // default, can be overridden
      rentalPricePerDay: 0.5,
      licensingTerms: metadata.licensing.licenseType,
      royaltyPercent: metadata.royaltyConfig.primarySaleRoyalty,
      creatorAddress: `nnif_${metadata.creator}`,
      escrowAddress: "nnif_escrow_v1",
      paymentProcessor: "pi_network",
    },
  }

  return { ...basePayload, ...customConfig }
}

/**
 * Generate Decentraland-specific payload
 */
export function generateDecentralandPayload(
  metadata: MetaverseAssetMetadata,
): DecentralandScenePayload {
  return {
    version: "1.0.0",
    scene: {
      title: metadata.assetName,
      description: metadata.assetId,
      thumbnail: `https://cdn.nnif.io/thumb/${metadata.assetId}.png`,
      world: {
        dx: 0,
        dy: 0,
      },
      spawn: {
        position: { x: 8, y: 2, z: 8 },
        camera: {
          position: { x: 10, y: 2, z: 10 },
          target: { x: 8, y: 2, z: 8 },
        },
      },
      parcels: ["0,0"],
      base: "0,0",
    },
    entities: [
      {
        version: 1,
        id: metadata.assetId,
        name: metadata.assetName,
        components: [
          {
            name: "Transform",
            data: {
              position: { x: 8, y: 0, z: 8 },
              scale: { x: 1, y: 1, z: 1 },
              rotation: { x: 0, y: 0, z: 0, w: 1 },
            },
          },
          {
            name: "GLTFShape",
            data: {
              assetId: metadata.assetId,
              withCollisions: true,
              isPointerBlocker: true,
            },
          },
        ],
      },
    ],
  }
}

export interface DecentralandScenePayload {
  version: string
  scene: {
    title: string
    description: string
    thumbnail: string
    world: { dx: number; dy: number }
    spawn: {
      position: { x: number; y: number; z: number }
      camera: {
        position: { x: number; y: number; z: number }
        target: { x: number; y: number; z: number }
      }
    }
    parcels: string[]
    base: string
  }
  entities: Array<{
    version: number
    id: string
    name: string
    components: Array<{ name: string; data: any }>
  }>
}

/**
 * Generate Babylon.js engine payload
 */
export function generateBabylonPayload(metadata: MetaverseAssetMetadata): BabylonEnginePayload {
  return {
    scene: {
      collisionsEnabled: true,
      gravity: [0, -9.81, 0],
      ambientColor: [0.2, 0.2, 0.2],
    },
    camera: {
      position: [10, 5, 10],
      target: [0, 0, 0],
      attachControl: true,
      angularSensibilityX: 1000,
      angularSensibilityY: 1000,
      wheelPrecision: 50,
    },
    lights: [
      {
        type: "HemisphericLight",
        name: "light1",
        intensity: 0.7,
        direction: [0, 1, 0],
      },
    ],
    meshes: [
      {
        name: metadata.assetName,
        assetId: metadata.assetId,
        url: metadata.exports[0]?.exportFormat || "GLB",
        scaling: [1, 1, 1],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        castShadow: true,
        receiveShadow: true,
      },
    ],
    physics: {
      enabled: true,
      engine: "cannon",
      gravity: [0, -9.81, 0],
    },
  }
}

export interface BabylonEnginePayload {
  scene: {
    collisionsEnabled: boolean
    gravity: [number, number, number]
    ambientColor: [number, number, number]
  }
  camera: {
    position: [number, number, number]
    target: [number, number, number]
    attachControl: boolean
    angularSensibilityX: number
    angularSensibilityY: number
    wheelPrecision: number
  }
  lights: Array<{
    type: string
    name: string
    intensity: number
    direction: [number, number, number]
  }>
  meshes: Array<{
    name: string
    assetId: string
    url: string
    scaling: [number, number, number]
    position: [number, number, number]
    rotation: [number, number, number]
    castShadow: boolean
    receiveShadow: boolean
  }>
  physics: {
    enabled: boolean
    engine: string
    gravity: [number, number, number]
  }
}

/**
 * Generate Roblox-compatible payload
 */
export function generateRobloxPayload(metadata: MetaverseAssetMetadata): RobloxImportPayload {
  return {
    Name: metadata.assetName,
    Parent: "Workspace",
    PrimaryPart: "PrimaryPart",
    ModelMeta: {
      AssetId: metadata.assetId,
      Creator: metadata.creator,
      Description: `iNFT by ${metadata.creator}`,
      Version: metadata.assetVersion,
    },
    Parts: [
      {
        Name: "PrimaryPart",
        ClassName: "Part",
        Properties: {
          CanCollide: true,
          CFrame: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
          Shape: "Block",
          Size: [1, 1, 1],
        },
      },
    ],
    Descendants: [],
  }
}

export interface RobloxImportPayload {
  Name: string
  Parent: string
  PrimaryPart: string
  ModelMeta: {
    AssetId: string
    Creator: string
    Description: string
    Version: string
  }
  Parts: Array<{
    Name: string
    ClassName: string
    Properties: Record<string, any>
  }>
  Descendants: any[]
}

/**
 * Generate checksum for asset integrity verification
 */
function generateChecksum(assetId: string): string {
  // In production, this would compute actual SHA256
  // For now, generate deterministic mock checksum
  const chars = "abcdef0123456789"
  let hash = ""
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.seededRandom(assetId, i) * chars.length))
  }
  return hash
}

function seededRandom(seed: string, index: number): number {
  const charCode = seed.charCodeAt(index % seed.length)
  const x = Math.sin(charCode + index) * 10000
  return x - Math.floor(x)
}

/**
 * Validate injection payload integrity
 */
export function validatePayload(payload: MetaverseInjectionPayload): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!payload.asset.id) errors.push("Asset ID is required")
  if (!payload.asset.name) errors.push("Asset name is required")
  if (payload.asset.polyCount < 10) errors.push("PolyCount suspiciously low")
  if (payload.asset.polyCount > 500000) errors.push("PolyCount exceeds maximum threshold")
  if (!["GLB", "GLTF", "FBX", "VRM"].includes(payload.asset.format))
    errors.push(`Invalid format: ${payload.asset.format}`)
  if (payload.commerce.purchasePrice < 0) errors.push("Price cannot be negative")

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Export payload as JSON or platform-specific format
 */
export function exportPayload(
  payload: MetaverseInjectionPayload | DecentralandScenePayload | BabylonEnginePayload | RobloxImportPayload,
): string {
  return JSON.stringify(payload, null, 2)
}
