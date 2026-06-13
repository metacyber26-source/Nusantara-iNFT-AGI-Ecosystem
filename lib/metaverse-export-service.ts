/**
 * Cross-Metaverse Export Service
 * Unified interface for generating production-ready iNFT exports across all major engines
 * Automatically generates metadata, payloads, and behavioral profiles for seamless deployment
 */

import type { Inft } from "./forge-data"
import type { CognitiveProfile } from "./cognitive-agent"
import {
  generateMetaverseMetadata,
  exportToEnginePayload,
  generateBabylonConfig,
  generateUnityMaterial,
  generateUnrealAssetTable,
  type MetaverseAssetMetadata,
  type EngineExport,
  type MetaverseEngine,
} from "./metaverse-metadata"
import {
  generateInjectionPayload,
  generateDecentralandPayload,
  generateBabylonPayload,
  generateRobloxPayload,
  validatePayload,
  exportPayload,
  type MetaverseInjectionPayload,
  type MetaverseProtocol,
} from "./metaverse-payload"

export interface ExportOptions {
  engines: MetaverseEngine[]
  protocols: MetaverseProtocol[]
  includeCognitiveBindings: boolean
  optimizeForMobile: boolean
  generateLODs: boolean
}

export interface ExportResult {
  assetId: string
  assetName: string
  exportTime: string
  engines: EngineExportResult[]
  payloads: PayloadExportResult[]
  metadata: MetaverseAssetMetadata
  certifications: ExportCertification[]
  warnings: string[]
}

export interface EngineExportResult {
  engine: MetaverseEngine
  status: "success" | "partial" | "failed"
  downloadUrl: string
  fileSize: number
  polyOptimization: string
  textureSettings: string
  estimatedPerformance: "excellent" | "good" | "fair" | "poor"
}

export interface PayloadExportResult {
  protocol: MetaverseProtocol
  status: "success" | "failed"
  payload: string
  validation: { valid: boolean; errors: string[] }
}

export interface ExportCertification {
  certType: "production_ready" | "engine_compatible" | "performance_optimized" | "cognitive_enabled"
  certified: boolean
  details: string
  verifiedAt: string
}

/**
 * Generate complete cross-metaverse export for an iNFT
 */
export async function generateCrossMetaverseExport(
  inft: Inft,
  cognitiveProfile: CognitiveProfile | undefined,
  options: ExportOptions,
): Promise<ExportResult> {
  const exportTime = new Date().toISOString()
  const warnings: string[] = []

  // Step 1: Generate unified metadata
  const engineConfigs: Partial<EngineExport>[] = options.engines.map((engine) => ({
    engine,
    exportFormat: selectOptimalFormat(engine, inft.format),
    performanceTargets: generatePerformanceTargets(engine, options.optimizeForMobile),
  }))

  const metadata = generateMetaverseMetadata(inft, cognitiveProfile, engineConfigs)

  // Step 2: Generate engine-specific exports
  const engineExports = options.engines.map((engine) =>
    generateEngineExport(engine, metadata, options, warnings),
  )

  // Step 3: Generate platform-specific payloads
  const payloads = options.protocols.map((protocol) =>
    generateProtocolPayload(protocol, metadata, options, warnings),
  )

  // Step 4: Generate certifications
  const certifications = generateCertifications(inft, cognitiveProfile, engineExports, options)

  return {
    assetId: inft.id,
    assetName: inft.name,
    exportTime,
    engines: engineExports,
    payloads,
    metadata,
    certifications,
    warnings,
  }
}

/**
 * Select optimal export format for each engine
 */
function selectOptimalFormat(engine: MetaverseEngine, inftFormat: string): string {
  const engineFormatMap: Record<MetaverseEngine, string> = {
    unreal: "FBX", // Unreal prefers FBX for complex rigs
    unity: "GLB", // Unity handles GLB efficiently
    babylon: "GLTF", // Babylon.js native GLTF support
    threejs: "GLTF", // Three.js uses GLTF
    webgl: "GLB", // WebGL prefers lightweight GLB
  }

  if (inftFormat === "Audio") return "WAV" // Audio assets
  if (inftFormat === "Text") return "JSON" // Text/AI assets
  if (inftFormat === "2D") return "PNG" // 2D sprite assets

  return engineFormatMap[engine] || "GLB"
}

/**
 * Generate engine-specific performance targets
 */
function generatePerformanceTargets(engine: MetaverseEngine, optimizeForMobile: boolean) {
  const baseTargets = {
    unreal: { fps: 60, memoryMB: 512, lods: 4 },
    unity: { fps: 60, memoryMB: 256, lods: 3 },
    babylon: { fps: 60, memoryMB: 128, lods: 2 },
    threejs: { fps: 60, memoryMB: 64, lods: 2 },
    webgl: { fps: 30, memoryMB: 32, lods: 1 },
  }

  const targets = baseTargets[engine] || { fps: 30, memoryMB: 64, lods: 1 }

  if (optimizeForMobile) {
    targets.fps = Math.max(30, targets.fps - 15)
    targets.memoryMB = Math.max(64, Math.floor(targets.memoryMB * 0.6))
    targets.lods = Math.max(1, targets.lods - 1)
  }

  return targets
}

/**
 * Generate engine-specific export
 */
function generateEngineExport(
  engine: MetaverseEngine,
  metadata: MetaverseAssetMetadata,
  options: ExportOptions,
  warnings: string[],
): EngineExportResult {
  try {
    const engineExport = metadata.exports.find((e) => e.engine === engine)

    if (!engineExport) {
      throw new Error(`No export configuration for ${engine}`)
    }

    // Estimate performance
    let performance: "excellent" | "good" | "fair" | "poor" = "good"
    if (engineExport.polyCount > 50000) performance = "fair"
    if (engineExport.polyCount > 100000) performance = "poor"
    if (engineExport.polyCount < 5000) performance = "excellent"

    // Check for optimization opportunities
    if (options.optimizeForMobile && engineExport.polyCount > 20000) {
      warnings.push(`${engine}: High poly count for mobile. Consider LOD generation.`)
    }

    return {
      engine,
      status: "success",
      downloadUrl: `https://cdn.nnif.io/exports/${metadata.assetId}_${engine}.zip`,
      fileSize: engineExport.fileSize,
      polyOptimization: `${engineExport.polyCount} tris (${Math.floor((engineExport.polyCount / 100000) * 100)}% of max)`,
      textureSettings: `${engineExport.textureResolution} @ ${calculateTextureMemory(engineExport.textureResolution)}MB`,
      estimatedPerformance: performance,
    }
  } catch (error) {
    warnings.push(`${engine} export failed: ${error}`)
    return {
      engine,
      status: "failed",
      downloadUrl: "",
      fileSize: 0,
      polyOptimization: "N/A",
      textureSettings: "N/A",
      estimatedPerformance: "poor",
    }
  }
}

/**
 * Generate protocol-specific payload
 */
function generateProtocolPayload(
  protocol: MetaverseProtocol,
  metadata: MetaverseAssetMetadata,
  options: ExportOptions,
  warnings: string[],
): PayloadExportResult {
  try {
    let payload: string

    switch (protocol) {
      case "decentraland":
        payload = exportPayload(generateDecentralandPayload(metadata))
        break
      case "babylon":
        payload = exportPayload(generateBabylonPayload(metadata))
        break
      case "roblox":
        payload = exportPayload(generateRobloxPayload(metadata))
        break
      case "custom_webgl":
        const injection = generateInjectionPayload(metadata, protocol)
        payload = exportPayload(injection)
        break
      default:
        const universal = generateInjectionPayload(metadata, protocol)
        payload = exportPayload(universal)
    }

    // Validate payload
    let validation = { valid: true, errors: [] as string[] }
    if (protocol === "custom_webgl") {
      const injection = JSON.parse(payload) as MetaverseInjectionPayload
      validation = validatePayload(injection)
    }

    return {
      protocol,
      status: validation.valid ? "success" : "failed",
      payload,
      validation,
    }
  } catch (error) {
    warnings.push(`${protocol} payload generation failed: ${error}`)
    return {
      protocol,
      status: "failed",
      payload: "",
      validation: { valid: false, errors: [`Failed to generate: ${error}`] },
    }
  }
}

/**
 * Generate export certifications
 */
function generateCertifications(
  inft: Inft,
  cognitiveProfile: CognitiveProfile | undefined,
  engineExports: EngineExportResult[],
  options: ExportOptions,
): ExportCertification[] {
  const certs: ExportCertification[] = []
  const now = new Date().toISOString()

  // Production Ready Cert
  const allEngineSuccess = engineExports.every((e) => e.status !== "failed")
  certs.push({
    certType: "production_ready",
    certified: allEngineSuccess && allEngineSuccess,
    details: allEngineSuccess ? "Asset certified for production deployment" : "Some engines failed export",
    verifiedAt: now,
  })

  // Engine Compatibility Cert
  const compatibleEngines = engineExports.filter((e) => e.status === "success").length
  certs.push({
    certType: "engine_compatible",
    certified: compatibleEngines >= 3,
    details: `Compatible with ${compatibleEngines}/${engineExports.length} target engines`,
    verifiedAt: now,
  })

  // Performance Optimization Cert
  const excellentPerformance = engineExports.filter((e) => e.estimatedPerformance === "excellent").length
  certs.push({
    certType: "performance_optimized",
    certified: excellentPerformance > 0 || !options.optimizeForMobile,
    details: `Performance rating: ${excellentPerformance} excellent, ${engineExports.filter((e) => e.estimatedPerformance === "good").length} good`,
    verifiedAt: now,
  })

  // Cognitive Binding Cert
  if (cognitiveProfile) {
    certs.push({
      certType: "cognitive_enabled",
      certified: cognitiveProfile.productionReady,
      details: cognitiveProfile.productionReady
        ? `Cognitive agent ready (v${cognitiveProfile.version})`
        : `Cognitive agent in training (v${cognitiveProfile.version})`,
      verifiedAt: now,
    })
  }

  return certs
}

/**
 * Calculate texture memory usage
 */
function calculateTextureMemory(resolution: string): number {
  const [width, height] = resolution.split("x").map(Number)
  // 4 bytes per pixel (RGBA), divided by 1024^2 for MB
  return Math.round((width * height * 4) / (1024 * 1024))
}

/**
 * Export metadata for integration with blockchain/web3
 */
export function exportForBlockchain(
  result: ExportResult,
  contractAddress: string,
): BlockchainMetadata {
  return {
    contractAddress,
    assetId: result.assetId,
    assetName: result.assetName,
    metadataURI: `ipfs://Qm${result.assetId}`,
    attributes: {
      creator: result.metadata.creator,
      format: result.metadata.exports[0]?.exportFormat || "Unknown",
      polyCount: result.metadata.exports[0]?.polyCount || 0,
      engines: result.engines.filter((e) => e.status === "success").map((e) => e.engine),
      cognitiveEnabled: !!result.metadata.cognitiveBindings,
      certifications: result.certifications.filter((c) => c.certified).map((c) => c.certType),
    },
    royalties: {
      creator: result.metadata.royaltyConfig.primarySaleRoyalty,
      platform: 25, // ICP2E Jatim Community
    },
  }
}

export interface BlockchainMetadata {
  contractAddress: string
  assetId: string
  assetName: string
  metadataURI: string
  attributes: {
    creator: string
    format: string
    polyCount: number
    engines: MetaverseEngine[]
    cognitiveEnabled: boolean
    certifications: string[]
  }
  royalties: {
    creator: number
    platform: number
  }
}
