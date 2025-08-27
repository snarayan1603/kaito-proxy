# Kaito Yaps API Proxy

A CORS-enabled proxy for the Kaito Yaps API that allows frontend clients to access tokenized attention data without CORS restrictions.

## 🚀 Live Deployment

**🌐 Deployed URL**: https://kaito-proxy-ak3g.vercel.app/

**📡 API Endpoint**: https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy

## What is This Proxy?

The Kaito Yaps API Proxy is a serverless function that:
- **Bypasses CORS restrictions** when accessing Kaito's API from frontend applications
- **Forwards requests** to `https://api.kaito.ai/api/v1/yaps` 
- **Returns tokenized attention data** for Twitter/X users
- **Handles errors gracefully** with proper HTTP status codes
- **Supports SocialFi and Cluster Protocol workflows**

## 🔧 Features

- ✅ **CORS-enabled** - Works from any frontend application
- ✅ **Serverless** - Deployed on Vercel for high availability
- ✅ **Error handling** - Proper error responses for invalid requests
- ✅ **Rate limiting** - Respects Kaito's 100 calls/5 min limit
- ✅ **Multiple parameters** - Supports `username` or `user_id`
- ✅ **Production ready** - Built for real-world applications

## 📊 API Reference

### Endpoint
```
GET https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy
```

### Query Parameters
- `username` (optional) - Twitter/X username (e.g., "VitalikButerin")
- `user_id` (optional) - Numeric user ID

*At least one parameter is required.*

### Response Format
```json
{
  "user_id": "295218901",
  "username": "VitalikButerin",
  "yaps_all": 7530.93,
  "yaps_l24h": 0,
  "yaps_l48h": 0,
  "yaps_l7d": 793.08,
  "yaps_l30d": 1661.42,
  "yaps_l3m": 3961.22,
  "yaps_l6m": 7530.93,
  "yaps_l12m": 7530.93
}
```

### Error Responses
- `400` - Missing required parameters
- `502` - Upstream API error
- `500` - Internal server error

## 🌐 Frontend Usage

### JavaScript/TypeScript

#### Basic Usage
```javascript
// Fetch yaps data for a user
const getYapsData = async (username) => {
  const response = await fetch(`https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy?username=${username}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
};

// Usage
const data = await getYapsData('VitalikButerin');
console.log(`Total yaps: ${data.yaps_all}`);
console.log(`Recent yaps (7d): ${data.yaps_l7d}`);
```

#### With Error Handling
```javascript
const fetchUserYaps = async (username) => {
  try {
    const response = await fetch(`https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy?username=${username}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unknown error');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching yaps data:', error);
    return null;
  }
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useYapsData = (username) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy?username=${username}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        
        const yapsData = await response.json();
        setData(yapsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  return { data, loading, error };
};

// Usage in component
const YapsProfile = ({ username }) => {
  const { data, loading, error } = useYapsData(username);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h2>{data.username}</h2>
      <p>Total Yaps: {data.yaps_all}</p>
      <p>Recent Activity (7d): {data.yaps_l7d}</p>
    </div>
  );
};
```

### Vue.js Example
```javascript
// In your Vue component
export default {
  data() {
    return {
      yapsData: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchYaps(username) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy?username=${username}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
        
        this.yapsData = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
```

### Batch Processing
```javascript
const getBatchYapsData = async (usernames) => {
  const promises = usernames.map(username => 
    fetch(`https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy?username=${username}`)
      .then(response => response.json())
      .catch(error => ({ username, error: error.message }))
  );
  
  const results = await Promise.all(promises);
  return results;
};

// Usage
const users = ['VitalikButerin', 'elonmusk', 'jack'];
const batchData = await getBatchYapsData(users);
```

## 🔬 SocialFi Integration Examples

### Reputation Scoring
```javascript
const calculateReputationScore = (yapsData) => {
  const { yaps_all = 0, yaps_l7d = 0 } = yapsData;
  
  const totalScore = yaps_all * 0.1;
  const recentBonus = yaps_l7d * 0.5;
  const consistencyBonus = yaps_l7d > 0 ? 10 : 0;
  
  return Math.min(100, totalScore + recentBonus + consistencyBonus);
};

const processSocialFiUser = async (username) => {
  const yapsData = await getYapsData(username);
  if (!yapsData) return null;
  
  const score = calculateReputationScore(yapsData);
  
  return {
    username,
    yaps_all: yapsData.yaps_all,
    yaps_l7d: yapsData.yaps_l7d,
    reputation_score: score,
    tier: score >= 75 ? 'platinum' : score >= 50 ? 'gold' : 'silver'
  };
};
```

### Cluster Protocol Analysis
```javascript
const analyzeUserCluster = async (usernames) => {
  const results = await getBatchYapsData(usernames);
  const validUsers = results.filter(user => !user.error);
  
  const metrics = {
    total_users: validUsers.length,
    avg_yaps_all: validUsers.reduce((sum, user) => sum + user.yaps_all, 0) / validUsers.length,
    avg_yaps_l7d: validUsers.reduce((sum, user) => sum + user.yaps_l7d, 0) / validUsers.length,
    high_activity_users: validUsers.filter(user => user.yaps_l7d > 10).length
  };
  
  return metrics;
};
```

## 🧪 Testing

### Quick Test
```bash
curl "https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy?username=VitalikButerin"
```

### Test in Browser
Visit: https://kaito-proxy-ak3g.vercel.app/

The landing page includes interactive test buttons for immediate testing.

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sigmabrogz/kaito-proxy.git
   cd kaito-proxy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

4. **Test locally:**
   ```bash
   curl "http://localhost:3000/api/kaito-yaps-proxy?username=VitalikButerin"
   ```

## 📦 Deployment

The proxy is automatically deployed on Vercel. To deploy your own instance:

1. **Fork this repository**
2. **Connect to Vercel dashboard**
3. **Import your forked repo**
4. **Deploy automatically on push**

Or use Vercel CLI:
```bash
npm run deploy
```

## 🔄 Integration with Existing Projects

### Add to your project:
```javascript
// api/yaps.js - Create a utility module
export const yapsAPI = {
  baseURL: 'https://kaito-proxy-ak3g.vercel.app/api/kaito-yaps-proxy',
  
  async getUser(username) {
    const response = await fetch(`${this.baseURL}?username=${username}`);
    return response.json();
  },
  
  async getUserById(userId) {
    const response = await fetch(`${this.baseURL}?user_id=${userId}`);
    return response.json();
  }
};
```

### Use in your components:
```javascript
import { yapsAPI } from './api/yaps.js';

const userData = await yapsAPI.getUser('VitalikButerin');
```

## 🎯 Use Cases

- **SocialFi Applications**: User reputation scoring and tier systems
- **Cluster Protocol**: Tokenized attention analysis and grouping
- **CT Quadrant Mapper**: Reputation scoring for crypto Twitter users
- **Analytics Dashboards**: Real-time yaps tracking and visualization
- **DeFi Protocols**: Governance weight based on social influence

## 🚀 Next Steps

- Add caching for better performance
- Implement rate limiting middleware
- Add API key authentication if needed
- Integrate with Web3 wallets for user verification

## 🔗 Links

- **Live Proxy**: https://kaito-proxy-ak3g.vercel.app/
- **Repository**: https://github.com/Sigmabrogz/kaito-proxy
- **Kaito API**: https://api.kaito.ai/
- **Vercel**: https://vercel.com/

---

Built with ❤️ for the SocialFi and Cluster Protocol ecosystem # kaito-proxy
