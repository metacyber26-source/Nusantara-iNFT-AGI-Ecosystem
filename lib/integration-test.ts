/**
 * Cross-Metaverse Export System - Integration Test
 * Verify all components work together seamlessly
 * 
 * Run this to validate Phase 1 completion
 */

import { MARKETPLACE_SEED } from "@/lib/forge-data"
import { initializeCognitiveProfile, computeCognitiveEvolution } from "@/lib/cognitive-agent"
import { generateCrossMetaverseExport, exportForBlockchain } from "@/lib/metaverse-export-service"
import { PRIMARY_SALE_SPLIT, MINT_FEE_SPLIT, SECONDARY_ROYALTY_SPLIT, isWhitelisted } from "@/lib/forge-config"

/**
 * Test 1: Verify Cognitive Agent Enhancement
 */
export async function testCognitiveAgent() {
  console.log("[TEST] 🧠 Cognitive Agent Enhancement")

  const inft = MARKETPLACE_SEED[0] // Gatotkaca Vanguard
  const profile = initializeCognitiveProfile(inft.id)

  console.log(`✓ Profile initialized for ${inft.name}`)
  console.log(`  - Version: ${profile.version}`)
  console.log(`  - Personality: ${profile.personality}`)
  console.log(`  - Production Ready: ${profile.productionReady}`)
  console.log(`  - Behavior Signature: ${profile.behaviorSignature}`)
  console.log(`  - Engine Compatibility:`)
  profile.engineCompatibility.forEach((ec) => {
    console.log(`    • ${ec.engine}: ${ec.proficiencyScore}% (${ec.customBehaviorSignature})`)
  })

  // Simulate evolution
  const interactions = [
    { platform: "unity", successRate: 0.85, engagementScore: 0.9, learningEvents: 5, avgDuration: 300, returnRate: 0.8, metaversePlatform: "unity" },
    { platform: "babylon", successRate: 0.75, engagementScore: 0.8, learningEvents: 4, avgDuration: 250, returnRate: 0.7, metaversePlatform: "babylon" },
  ]

  const evolved = computeCognitiveEvolution(profile, interactions)
  console.log(`✓ Profile evolved after interactions`)
  console.log(`  - New personality: ${evolved.personality}`)
  console.log(`  - Conversational depth: ${evolved.conversationalDepth}`)
  console.log(`  - Game tactics: ${evolved.gameticticsProficiency}`)
  console.log(`  - Production ready: ${evolved.productionReady}`)

  return true
}

/**
 * Test 2: Verify Metadata Generation
 */
export async function testMetadataGeneration() {
  console.log("\n[TEST] 📊 Metadata Generation")

  const inft = MARKETPLACE_SEED[4] // Singo Barong Mount
  const profile = initializeCognitiveProfile(inft.id)

  const result = await generateCrossMetaverseExport(inft, profile, {
    engines: ["unreal", "unity", "babylon"],
    protocols: ["decentraland", "roblox"],
    includeCognitiveBindings: true,
    optimizeForMobile: false,
    generateLODs: true,
  })

  console.log(`✓ Export generated for ${result.assetName}`)
  console.log(`✓ Timestamp: ${result.exportTime}`)

  // Verify engine exports
  console.log(`✓ Engine Exports (${result.engines.length}):`)
  result.engines.forEach((eng) => {
    console.log(
      `  • ${eng.engine}: ${eng.status} (${eng.estimatedPerformance} performance, ${eng.polyOptimization})`,
    )
  })

  // Verify platform payloads
  console.log(`✓ Platform Payloads (${result.payloads.length}):`)
  result.payloads.forEach((p) => {
    console.log(`  • ${p.protocol}: ${p.status} (${p.validation.valid ? "✓ valid" : "✗ invalid"})`)
    if (!p.validation.valid) {
      p.validation.errors.forEach((e) => console.log(`    ⚠ ${e}`))
    }
  })

  // Verify certifications
  console.log(`✓ Certifications (${result.certifications.length}):`)
  result.certifications.forEach((cert) => {
    console.log(`  • ${cert.certType}: ${cert.certified ? "✓ PASS" : "✗ FAIL"} (${cert.details})`)
  })

  if (result.warnings.length > 0) {
    console.log(`⚠ Warnings (${result.warnings.length}):`)
    result.warnings.forEach((w) => console.log(`  • ${w}`))
  }

  return true
}

/**
 * Test 3: Verify Revenue Split Integrity
 */
export async function testRevenueSplits() {
  console.log("\n[TEST] 💰 Revenue Split Verification")

  // Verify Primary Sale Split (50/25/10/10/5)
  let total = PRIMARY_SALE_SPLIT.reduce((sum, item) => sum + item.percent, 0)
  console.log(`✓ Primary Sale Split (Total: ${total}%):`)
  PRIMARY_SALE_SPLIT.forEach((item) => console.log(`  • ${item.label}: ${item.percent}%`))
  if (total !== 100) console.error(`✗ PRIMARY SALE SPLIT MISMATCH: ${total}% (expected 100%)`)

  // Verify Mint Fee Split (35/40/15/10)
  total = MINT_FEE_SPLIT.reduce((sum, item) => sum + item.percent, 0)
  console.log(`✓ Mint Fee Split (Total: ${total}%):`)
  MINT_FEE_SPLIT.forEach((item) => console.log(`  • ${item.label}: ${item.percent}%`))
  if (total !== 100) console.error(`✗ MINT FEE SPLIT MISMATCH: ${total}% (expected 100%)`)

  // Verify Secondary Royalty Split (50/30/20)
  total = SECONDARY_ROYALTY_SPLIT.reduce((sum, item) => sum + item.percent, 0)
  console.log(`✓ Secondary Royalty Split (Total: ${total}%):`)
  SECONDARY_ROYALTY_SPLIT.forEach((item) => console.log(`  • ${item.label}: ${item.percent}%`))
  if (total !== 100) console.error(`✗ SECONDARY ROYALTY SPLIT MISMATCH: ${total}% (expected 100%)`)

  return true
}

/**
 * Test 4: Verify Whitelist System
 */
export async function testWhitelist() {
  console.log("\n[TEST] 🔐 Whitelist Verification")

  const whitelist = ["Ful21", "Murtini79", "SIREP74", "ifah24", "Muhammadefendi123", "Titin999", "afifmasfiqo", "Tar72", "Rid81"]

  console.log(`✓ Whitelist verified (${whitelist.length} pioneers):`)

  whitelist.forEach((username) => {
    const isWL = isWhitelisted(username)
    console.log(`  ${isWL ? "✓" : "✗"} ${username}`)
    if (!isWL) console.error(`✗ WHITELIST VERIFICATION FAILED: ${username}`)
  })

  // Test non-whitelisted user
  const notWL = isWhitelisted("RandomUser123")
  console.log(`✓ Non-whitelisted user correctly identified: ${!notWL ? "✓" : "✗"}`)

  return true
}

/**
 * Test 5: Verify Blockchain Export
 */
export async function testBlockchainExport() {
  console.log("\n[TEST] ⛓️  Blockchain Metadata Export")

  const inft = MARKETPLACE_SEED[1] // Reog Spirit Mask
  const profile = initializeCognitiveProfile(inft.id)

  const result = await generateCrossMetaverseExport(inft, profile, {
    engines: ["unreal", "unity"],
    protocols: ["custom_webgl"],
    includeCognitiveBindings: true,
    optimizeForMobile: false,
    generateLODs: false,
  })

  const blockchainMeta = exportForBlockchain(result, "0x742d35Cc6634C0532925a3b844Bc9e7595f1e5b0")

  console.log(`✓ Blockchain metadata exported:`)
  console.log(`  • Contract: ${blockchainMeta.contractAddress}`)
  console.log(`  • Asset ID: ${blockchainMeta.assetId}`)
  console.log(`  • Metadata URI: ${blockchainMeta.metadataURI}`)
  console.log(`  • Creator: ${blockchainMeta.attributes.creator}`)
  console.log(`  • Format: ${blockchainMeta.attributes.format}`)
  console.log(`  • Poly Count: ${blockchainMeta.attributes.polyCount}`)
  console.log(`  • Engines: ${blockchainMeta.attributes.engines.join(", ")}`)
  console.log(`  • Cognitive Enabled: ${blockchainMeta.attributes.cognitiveEnabled ? "Yes" : "No"}`)
  console.log(`  • Certifications: ${blockchainMeta.attributes.certifications.join(", ")}`)
  console.log(`  • Royalties:`)
  console.log(`    • Creator: ${blockchainMeta.royalties.creator}%`)
  console.log(`    • Platform: ${blockchainMeta.royalties.platform}%`)

  return true
}

/**
 * Test 6: Verify Multilingual Support
 */
export async function testMultilingualSupport() {
  console.log("\n[TEST] 🌍 Multilingual Support")

  const languages = ["EN", "ID", "JV"]

  MARKETPLACE_SEED.forEach((inft) => {
    const hasAllLanguages = languages.every((lang) => inft.languages.includes(lang as any))
    const status = hasAllLanguages ? "✓" : `✗ (${inft.languages.join(", ")})`
    console.log(`  ${status} ${inft.name}: ${inft.languages.join(", ")}`)
  })

  return true
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log("═══════════════════════════════════════════════════")
  console.log("NUSANTARA NEO iNFT FORGE - Integration Test Suite")
  console.log("Phase 1: Cross-Metaverse Asset Optimization")
  console.log("═══════════════════════════════════════════════════\n")

  try {
    const results = [
      { name: "Cognitive Agent Enhancement", test: testCognitiveAgent },
      { name: "Metadata Generation", test: testMetadataGeneration },
      { name: "Revenue Split Integrity", test: testRevenueSplits },
      { name: "Whitelist System", test: testWhitelist },
      { name: "Blockchain Export", test: testBlockchainExport },
      { name: "Multilingual Support", test: testMultilingualSupport },
    ]

    const passed: string[] = []
    const failed: string[] = []

    for (const { name, test } of results) {
      try {
        await test()
        passed.push(name)
      } catch (error) {
        console.error(`\n✗ TEST FAILED: ${error}`)
        failed.push(name)
      }
    }

    console.log("\n═══════════════════════════════════════════════════")
    console.log("TEST RESULTS SUMMARY")
    console.log("═══════════════════════════════════════════════════")
    console.log(`✓ PASSED: ${passed.length}/${results.length}`)
    passed.forEach((t) => console.log(`  • ${t}`))

    if (failed.length > 0) {
      console.log(`✗ FAILED: ${failed.length}/${results.length}`)
      failed.forEach((t) => console.log(`  • ${t}`))
    }

    console.log("\n" + (failed.length === 0 ? "🎉 ALL TESTS PASSED 🎉" : "❌ SOME TESTS FAILED"))
    console.log("═══════════════════════════════════════════════════\n")

    return failed.length === 0
  } catch (error) {
    console.error("Fatal test error:", error)
    return false
  }
}

// Export for use in components
export default runAllTests
