import Alert from '@/lib/models/Alert'
import dbConnect from '@/lib/mongodb'

interface TokenPrice {
  id: string
  price: number
  change24h: number
  bondedPercentage: number
}

// Fetch current token prices from our API
async function fetchTokenPrices(): Promise<TokenPrice[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tokens/all?limit=1000`)
    const data = await response.json()
    
    if (data.success && data.data) {
      return data.data.map((token: any) => ({
        id: token.id,
        price: parseFloat(token.price || '0'),
        change24h: parseFloat(token.twentyFourHour || '0'),
        bondedPercentage: token.bondedPercentage || 0
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching token prices:', error)
    return []
  }
}

// Check if alert condition is met
function checkAlertCondition(alert: any, tokenData: TokenPrice): boolean {
  const { alertType, condition, threshold } = alert
  
  switch (alertType) {
    case 'price':
      if (condition === 'above') {
        return tokenData.price > threshold
      } else if (condition === 'below') {
        return tokenData.price < threshold
      }
      break
      
    case 'percentage':
      if (condition === 'increases') {
        return tokenData.change24h > threshold
      } else if (condition === 'decreases') {
        return tokenData.change24h < -threshold
      }
      break
      
    case 'bond':
      if (condition === 'reaches') {
        return tokenData.bondedPercentage >= threshold
      }
      break
  }
  
  return false
}

// Main alert checking function
export async function checkAlerts(): Promise<void> {
  try {
    await dbConnect()
    
    // Get all active, non-triggered alerts
    const alerts = await Alert.find({
      isActive: true,
      isTriggered: false
    }).lean()
    
    if (alerts.length === 0) {
      console.log('📊 No active alerts to check')
      return
    }
    
    console.log(`🔔 Checking ${alerts.length} active alerts...`)
    
    // Fetch current token prices
    const tokenPrices = await fetchTokenPrices()
    const priceMap = new Map(tokenPrices.map(token => [token.id, token]))
    
    let triggeredCount = 0
    
    // Check each alert
    for (const alert of alerts) {
      const tokenData = priceMap.get(alert.tokenId)
      
      if (!tokenData) {
        console.log(`⚠️ No price data found for token ${alert.tokenSymbol} (${alert.tokenId})`)
        continue
      }
      
      // Check if alert condition is met
      if (checkAlertCondition(alert, tokenData)) {
        console.log(`🚨 Alert triggered for ${alert.tokenSymbol}: ${alert.condition} ${alert.threshold}`)
        
        // Update alert as triggered
        await Alert.findByIdAndUpdate(alert._id, {
          isTriggered: true,
          triggeredAt: new Date(),
          triggeredPrice: tokenData.price,
          triggeredPercentage: tokenData.change24h
        })
        
        triggeredCount++
        
        // Here you could add notification logic (email, push notifications, etc.)
        console.log(`✅ Alert ${alert._id} marked as triggered`)
      }
    }
    
    console.log(`🔔 Alert check complete. ${triggeredCount} alerts triggered.`)
    
  } catch (error) {
    console.error('❌ Error checking alerts:', error)
  }
}

// Start continuous alert checking
export function startAlertChecking(): void {
  console.log('🔔 Starting continuous alert checking...')
  
  // Run immediately
  checkAlerts()
  
  // Run every 60 seconds
  setInterval(checkAlerts, 60000)
}
