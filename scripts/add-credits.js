#!/usr/bin/env node
/**
 * Admin script to add credits to a user
 * Usage: node scripts/add-credits.js <userId> <credits>
 * 
 * Example: node scripts/add-credits.js guest_123456 50
 */

const CLOUDFLARE_API_TOKEN = 'cfut_9ShyXIFTKg5qvCh4cfgxNhD1pShJIZeyz0JswwnF40a84b4d'
const USER_DATA_KV_ID = '4fe5b29d54b341aaae66dd332d8f78ba'

async function addCredits(userId, creditsToAdd) {
  const url = `https://api.cloudflare.com/client/v4/accounts/4d8209702498c9267e892fc08e8dc66c/kv/namespaces/${USER_DATA_KV_ID}/values/credits:${userId}`
  
  // First, get current credits
  const getResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'text/plain'
    }
  })
  
  let currentCredits = 0
  if (getResponse.ok) {
    const text = await getResponse.text()
    currentCredits = text ? parseInt(text) : 0
  }
  
  const newCredits = currentCredits + creditsToAdd
  
  // Write new credits
  const writeResponse = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'text/plain',
      'X-Expiration-Ttl': '864000' // 10 days expiration
    },
    body: newCredits.toString()
  })
  
  if (writeResponse.ok) {
    console.log(`✅ Success! Added ${creditsToAdd} credits to user ${userId}`)
    console.log(`   Previous: ${currentCredits} → New total: ${newCredits}`)
  } else {
    const error = await writeResponse.text()
    console.error(`❌ Failed to add credits: ${error}`)
    process.exit(1)
  }
}

// Parse arguments
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: node scripts/add-credits.js <userId> <credits>')
  console.error('Example: node scripts/add-credits.js guest_123456 50')
  process.exit(1)
}

const userId = args[0]
const credits = parseInt(args[1])

if (isNaN(credits) || credits <= 0) {
  console.error('Credits must be a positive number')
  process.exit(1)
}

addCredits(userId, credits)
