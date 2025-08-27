// Example: How to use the Kaito Yaps Proxy in your applications
// This shows integration with SocialFi and Cluster Protocol workflows

// 1. Basic usage - Get yaps data for a user
async function getYapsData(username, proxyUrl = 'https://your-deployment.vercel.app/api/kaito-yaps-proxy') {
  try {
    const response = await fetch(`${proxyUrl}?username=${username}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching yaps data:', error);
    return null;
  }
}

// 2. Batch processing for multiple users
async function getBatchYapsData(usernames, proxyUrl = 'https://your-deployment.vercel.app/api/kaito-yaps-proxy') {
  const promises = usernames.map(username => getYapsData(username, proxyUrl));
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => ({
    username: usernames[index],
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}

// 3. Integration with reputation scoring
function calculateReputationScore(yapsData) {
  if (!yapsData) return 0;
  
  const { yaps_all = 0, yaps_l7d = 0 } = yapsData;
  
  // Example scoring algorithm
  const totalScore = yaps_all * 0.1;
  const recentActivityBonus = yaps_l7d * 0.5;
  const consistencyBonus = yaps_l7d > 0 ? 10 : 0;
  
  return Math.min(100, totalScore + recentActivityBonus + consistencyBonus);
}

// 4. SocialFi integration example
async function processSocialFiUser(username) {
  console.log(`🔍 Processing SocialFi user: ${username}`);
  
  // Get yaps data
  const yapsData = await getYapsData(username);
  if (!yapsData) {
    console.log(`❌ Could not fetch data for ${username}`);
    return null;
  }
  
  // Calculate reputation score
  const reputationScore = calculateReputationScore(yapsData);
  
  // Create user profile
  const userProfile = {
    username,
    yaps_all: yapsData.yaps_all || 0,
    yaps_l7d: yapsData.yaps_l7d || 0,
    reputation_score: reputationScore,
    tier: reputationScore >= 75 ? 'platinum' : 
          reputationScore >= 50 ? 'gold' : 
          reputationScore >= 25 ? 'silver' : 'bronze',
    last_updated: new Date().toISOString()
  };
  
  console.log(`✅ Processed ${username}: ${userProfile.tier} tier (${reputationScore} points)`);
  return userProfile;
}

// 5. Cluster Protocol integration example
async function analyzeUserCluster(usernames) {
  console.log('🔬 Analyzing user cluster...');
  
  // Get yaps data for all users
  const batchResults = await getBatchYapsData(usernames);
  
  // Filter successful results
  const validUsers = batchResults.filter(result => result.data !== null);
  
  if (validUsers.length === 0) {
    console.log('❌ No valid user data found');
    return null;
  }
  
  // Calculate cluster metrics
  const clusterMetrics = {
    total_users: validUsers.length,
    avg_yaps_all: validUsers.reduce((sum, user) => sum + (user.data.yaps_all || 0), 0) / validUsers.length,
    avg_yaps_l7d: validUsers.reduce((sum, user) => sum + (user.data.yaps_l7d || 0), 0) / validUsers.length,
    high_activity_users: validUsers.filter(user => (user.data.yaps_l7d || 0) > 10).length,
    cluster_health: 'calculating...'
  };
  
  // Determine cluster health
  const activityRatio = clusterMetrics.high_activity_users / clusterMetrics.total_users;
  clusterMetrics.cluster_health = activityRatio >= 0.7 ? 'high' : 
                                  activityRatio >= 0.4 ? 'medium' : 'low';
  
  console.log(`📊 Cluster analysis complete:`, clusterMetrics);
  return clusterMetrics;
}

// 6. Example usage
async function main() {
  console.log('🚀 Kaito Yaps Proxy Integration Examples\n');
  
  // Example 1: Single user processing
  await processSocialFiUser('VitalikButerin');
  
  console.log('\n---\n');
  
  // Example 2: Cluster analysis
  const testUsers = ['VitalikButerin', 'elonmusk', 'jack'];
  await analyzeUserCluster(testUsers);
  
  console.log('\n---\n');
  
  // Example 3: Batch processing with error handling
  const batchResults = await getBatchYapsData(['VitalikButerin', 'invaliduser123']);
  console.log('📦 Batch results:', batchResults);
}

// Export functions for use in other modules
module.exports = {
  getYapsData,
  getBatchYapsData,
  calculateReputationScore,
  processSocialFiUser,
  analyzeUserCluster
};

// Run examples if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 