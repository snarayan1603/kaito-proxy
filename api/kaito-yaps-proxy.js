module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { username, user_id } = req.query;
    
    // Validate that at least one parameter is provided
    if (!username && !user_id) {
      res.status(400).json({ error: 'username or user_id required' });
      return;
    }
    
    // Build query parameters for Kaito API
    const queryParams = new URLSearchParams();
    if (username) queryParams.append('username', username);
    if (user_id) queryParams.append('user_id', user_id);
    
    // Construct the Kaito API URL
    const kaitoUrl = `https://api.kaito.ai/api/v1/yaps?${queryParams.toString()}`;
    
    // Forward the request to Kaito API
    const response = await fetch(kaitoUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'kaito-yaps-proxy/1.0.0'
      }
    });
    
    // Handle upstream errors
    if (!response.ok) {
      console.error(`Kaito API error: ${response.status} ${response.statusText}`);
      res.status(502).json({ error: 'Upstream error' });
      return;
    }
    
    // Get the JSON response
    const data = await response.json();
    
    // Return the raw JSON response
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 