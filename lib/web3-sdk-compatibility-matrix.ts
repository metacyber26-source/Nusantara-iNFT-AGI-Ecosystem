/**
 * Web3 SDK Compatibility Matrix
 * Automatically adapts minted 3D assets for different metaverse platforms
 * Handles texture scaling, bone/rigging conversion, and format optimization
 */

export type MetaversePlatform = 'unity' | 'unreal' | 'webxr' | 'decentraland' | 'roblox' | 'babylon' | 'threejs';

export interface CompatibilityProfile {
  platform: MetaversePlatform;
  maxTextureResolution: number;
  maxPolyCount: number;
  maxBoneCount: number;
  supportedFormats: string[];
  boneRemappingRequired: boolean;
  textureCompressionFormats: string[];
  animationFrameLimit: number;
}

export interface PlatformAssetConfig {
  platform: MetaversePlatform;
  meshOptimization: {
    targetPolyCount: number;
    useLODs: boolean;
    mergeMeshes: boolean;
  };
  textureOptimization: {
    resolution: number;
    format: string;
    compression: string;
    mipmaps: boolean;
  };
  boneOptimization: {
    maxBones: number;
    skinWeightPrecision: number;
    boneRemapping: Record<string, string>;
  };
  animationOptimization: {
    sampleRate: number;
    compressionMethod: string;
  };
}

export class Web3SDKCompatibilityMatrix {
  private compatibilityProfiles: Map<MetaversePlatform, CompatibilityProfile> = new Map();
  private platformConfigs: Map<MetaversePlatform, PlatformAssetConfig> = new Map();

  constructor() {
    this.initializeProfiles();
  }

  private initializeProfiles(): void {
    // Unity
    this.compatibilityProfiles.set('unity', {
      platform: 'unity',
      maxTextureResolution: 4096,
      maxPolyCount: 100000,
      maxBoneCount: 256,
      supportedFormats: ['fbx', 'gltf', 'glb'],
      boneRemappingRequired: false,
      textureCompressionFormats: ['astc', 'etc2'],
      animationFrameLimit: 10000,
    });

    // Unreal Engine
    this.compatibilityProfiles.set('unreal', {
      platform: 'unreal',
      maxTextureResolution: 8192,
      maxPolyCount: 200000,
      maxBoneCount: 512,
      supportedFormats: ['fbx', 'uasset'],
      boneRemappingRequired: false,
      textureCompressionFormats: ['bc1', 'bc4'],
      animationFrameLimit: 15000,
    });

    // WebXR
    this.compatibilityProfiles.set('webxr', {
      platform: 'webxr',
      maxTextureResolution: 2048,
      maxPolyCount: 50000,
      maxBoneCount: 128,
      supportedFormats: ['glb', 'gltf'],
      boneRemappingRequired: false,
      textureCompressionFormats: ['basis'],
      animationFrameLimit: 5000,
    });

    // Decentraland
    this.compatibilityProfiles.set('decentraland', {
      platform: 'decentraland',
      maxTextureResolution: 1024,
      maxPolyCount: 20000,
      maxBoneCount: 64,
      supportedFormats: ['glb', 'gltf'],
      boneRemappingRequired: true,
      textureCompressionFormats: ['jpg', 'png'],
      animationFrameLimit: 3000,
    });

    // Roblox
    this.compatibilityProfiles.set('roblox', {
      platform: 'roblox',
      maxTextureResolution: 1024,
      maxPolyCount: 15000,
      maxBoneCount: 32,
      supportedFormats: ['rbxm', 'glb'],
      boneRemappingRequired: true,
      textureCompressionFormats: ['png'],
      animationFrameLimit: 2000,
    });

    // Babylon.js
    this.compatibilityProfiles.set('babylon', {
      platform: 'babylon',
      maxTextureResolution: 2048,
      maxPolyCount: 75000,
      maxBoneCount: 256,
      supportedFormats: ['gltf', 'glb', 'babylon'],
      boneRemappingRequired: false,
      textureCompressionFormats: ['basis', 'ktx2'],
      animationFrameLimit: 8000,
    });

    // Three.js
    this.compatibilityProfiles.set('threejs', {
      platform: 'threejs',
      maxTextureResolution: 2048,
      maxPolyCount: 60000,
      maxBoneCount: 200,
      supportedFormats: ['gltf', 'glb'],
      boneRemappingRequired: false,
      textureCompressionFormats: ['basis'],
      animationFrameLimit: 6000,
    });
  }

  /**
   * Generate platform-specific configuration
   */
  public generatePlatformConfig(platform: MetaversePlatform): PlatformAssetConfig {
    const profile = this.compatibilityProfiles.get(platform);
    if (!profile) throw new Error(`Unknown platform: ${platform}`);

    const config: PlatformAssetConfig = {
      platform,
      meshOptimization: {
        targetPolyCount: Math.floor(profile.maxPolyCount * 0.75),
        useLODs: profile.maxPolyCount < 100000,
        mergeMeshes: profile.maxPolyCount < 50000,
      },
      textureOptimization: {
        resolution: profile.maxTextureResolution,
        format: profile.supportedFormats[0],
        compression: profile.textureCompressionFormats[0],
        mipmaps: profile.maxTextureResolution <= 2048,
      },
      boneOptimization: {
        maxBones: profile.maxBoneCount,
        skinWeightPrecision: 4,
        boneRemapping: this.generateBoneRemapping(platform),
      },
      animationOptimization: {
        sampleRate: 30,
        compressionMethod: 'quaternion',
      },
    };

    this.platformConfigs.set(platform, config);
    return config;
  }

  /**
   * Generate bone remapping for platform
   */
  private generateBoneRemapping(platform: MetaversePlatform): Record<string, string> {
    const mappings: Record<MetaversePlatform, Record<string, string>> = {
      unity: {
        'armature': 'Armature',
        'skeleton': 'Skeleton',
        'bone': 'Bone',
      },
      unreal: {
        'armature': 'Skeleton',
        'skeleton': 'Skeleton',
        'bone': 'Bone',
      },
      webxr: {
        'armature': 'armature',
        'skeleton': 'skeleton',
        'bone': 'bone',
      },
      decentraland: {
        'armature': 'Armature',
        'skeleton': 'Skeleton',
        'bone': 'Bone',
      },
      roblox: {
        'armature': 'Humanoid',
        'skeleton': 'Skeleton',
        'bone': 'Bone',
      },
      babylon: {
        'armature': 'armature',
        'skeleton': 'skeleton',
        'bone': 'bone',
      },
      threejs: {
        'armature': 'armature',
        'skeleton': 'skeleton',
        'bone': 'bone',
      },
    };

    return mappings[platform] || {};
  }

  /**
   * Validate asset compatibility
   */
  public validateAssetCompatibility(
    assetData: {
      polyCount: number;
      textureResolution: number;
      boneCount: number;
      format: string;
      animationFrames: number;
    },
    platform: MetaversePlatform,
  ): {
    compatible: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const profile = this.compatibilityProfiles.get(platform);
    if (!profile) throw new Error(`Unknown platform: ${platform}`);

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (assetData.polyCount > profile.maxPolyCount) {
      warnings.push(
        `Poly count ${assetData.polyCount} exceeds limit ${profile.maxPolyCount}`,
      );
      recommendations.push('Use LOD generation for performance');
    }

    if (assetData.textureResolution > profile.maxTextureResolution) {
      warnings.push(
        `Texture resolution ${assetData.textureResolution} exceeds limit ${profile.maxTextureResolution}`,
      );
      recommendations.push('Downscale textures or use compression');
    }

    if (assetData.boneCount > profile.maxBoneCount) {
      warnings.push(
        `Bone count ${assetData.boneCount} exceeds limit ${profile.maxBoneCount}`,
      );
      recommendations.push('Reduce skeleton complexity or use bone merging');
    }

    if (!profile.supportedFormats.includes(assetData.format)) {
      warnings.push(`Format ${assetData.format} not natively supported`);
      recommendations.push(`Convert to ${profile.supportedFormats[0]}`);
    }

    if (assetData.animationFrames > profile.animationFrameLimit) {
      warnings.push(
        `Animation frames ${assetData.animationFrames} exceeds limit ${profile.animationFrameLimit}`,
      );
      recommendations.push('Reduce animation sample rate');
    }

    const compatible = warnings.length === 0;

    return { compatible, warnings, recommendations };
  }

  /**
   * Auto-scale asset for platform
   */
  public autoScaleAsset(
    assetData: any,
    platform: MetaversePlatform,
  ): PlatformAssetConfig {
    const config = this.generatePlatformConfig(platform);
    const validation = this.validateAssetCompatibility(assetData, platform);

    console.log(`[Web3 Compatibility] Asset compatibility for ${platform}:`, {
      compatible: validation.compatible,
      warnings: validation.warnings,
      recommendations: validation.recommendations,
    });

    return config;
  }

  /**
   * Get all platform profiles
   */
  public getAllProfiles(): Map<MetaversePlatform, CompatibilityProfile> {
    return new Map(this.compatibilityProfiles);
  }
}

export const compatibilityMatrix = new Web3SDKCompatibilityMatrix();
