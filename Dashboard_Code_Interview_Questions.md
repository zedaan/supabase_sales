# Dashboard Code Interview Questions

## Table of Contents
1. [Basic useState Questions](#basic-usestate-questions)
2. [useEffect & Data Fetching Questions](#useeffect--data-fetching-questions)
3. [Supabase Integration Questions](#supabase-integration-questions)
4. [Error Handling Questions](#error-handling-questions)
5. [Code Structure & Best Practices](#code-structure--best-practices)
6. [Advanced Scenarios](#advanced-scenarios)

---

## Basic useState Questions

### **Q1: What is useState and how is it used in your Dashboard component?**
**A:** useState is a React Hook that allows functional components to manage state. In the Dashboard component:
```javascript
const [metrics, setMetrics] = useState([]);
```
- `metrics` is the state variable that holds the data
- `setMetrics` is the function to update the state
- `[]` is the initial value (empty array)

### **Q2: Why did you initialize metrics state with an empty array `[]`?**
**A:** I initialized with an empty array because:
- The data will be an array of sales metrics
- It prevents errors when trying to map over the data before it loads
- It's a safe default that won't break the component
- It clearly indicates the expected data structure

### **Q3: What happens when you call `setMetrics(data)`?**
**A:** When `setMetrics(data)` is called:
1. React updates the `metrics` state with the new data
2. The component re-renders with the new state
3. Any JSX that uses `metrics` will show the updated data
4. The old state is replaced with the new state

### **Q4: How would you add a loading state to your Dashboard component?**
**A:** 
```javascript
const [loading, setLoading] = useState(true);

async function fetchMatrics() {
  try {
    setLoading(true);
    const {error, data} = await supabase.from('sales_deals').select('*');
    if (error) throw error;
    setMetrics(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
}

// In JSX:
if (loading) return <div>Loading...</div>;
```

---

## useEffect & Data Fetching Questions

### **Q5: Explain the useEffect in your Dashboard component.**
**A:** 
```javascript
useEffect(() => {
  fetchMatrics();
}, []);
```
This useEffect:
- Runs when the component mounts (first render)
- Calls `fetchMatrics()` to get data from Supabase
- Has an empty dependency array `[]`, so it only runs once
- Ensures data is fetched when the component loads

### **Q6: What would happen if you removed the dependency array from useEffect?**
**A:** If you removed `[]`:
```javascript
useEffect(() => {
  fetchMatrics();
}); // No dependency array
```
The effect would run after every render, causing:
- Infinite API calls to Supabase
- Performance issues
- Potential rate limiting
- Unnecessary re-renders

### **Q7: How would you modify the useEffect to refetch data when a prop changes?**
**A:** 
```javascript
useEffect(() => {
  fetchMatrics();
}, [userId]); // Refetch when userId changes
```

### **Q8: Why is fetchMatrics declared as an async function?**
**A:** `fetchMatrics` is async because:
- It makes an API call to Supabase which returns a Promise
- `await` is used to wait for the Supabase response
- It allows proper error handling with try/catch
- It prevents blocking the UI while waiting for data

---

## Supabase Integration Questions

### **Q9: Explain the Supabase query in your fetchMatrics function.**
**A:** 
```javascript
const {error, data} = await supabase
  .from('sales_deals')
  .select(`
    name,
    value.sum()
  `);
```
This query:
- Goes to the `sales_deals` table
- Selects the `name` column
- Uses `value.sum()` to aggregate all values
- Returns the total sum instead of individual records
- Destructures the response to get `error` and `data`

### **Q10: What does `value.sum()` do and why use it?**
**A:** `value.sum()` is a Supabase aggregation function that:
- Sums all values in the `value` column
- Returns a single total instead of multiple records
- Is more efficient than fetching all records and summing in JavaScript
- Reduces data transfer and processing time

### **Q11: How would you modify the query to get individual sales records instead of a sum?**
**A:** 
```javascript
const {error, data} = await supabase
  .from('sales_deals')
  .select('name, value')
  .order('value', {ascending: false});
```

### **Q12: What's the difference between your current query and this one?**
```javascript
// Your current query
.select(`name, value.sum()`)

// Alternative query
.select('name, value')
```
**A:** 
- **Current:** Returns aggregated data (total sum)
- **Alternative:** Returns individual records
- **Current:** One result with total
- **Alternative:** Array of all sales deals

---

## Error Handling Questions

### **Q13: Explain the error handling in your fetchMatrics function.**
**A:** 
```javascript
try {
  const {error, data} = await supabase.from('sales_deals').select('*');
  if (error) {
    throw error;
  }
  setMetrics(data);
} catch (error) {
  console.error('Error fetching metrics:', error, metrics);
}
```
This handles errors by:
- Using try/catch to catch any exceptions
- Checking for Supabase-specific errors
- Logging errors to console
- Preventing the app from crashing

### **Q14: How would you improve the error handling to show errors to users?**
**A:** 
```javascript
const [error, setError] = useState(null);

async function fetchMatrics() {
  try {
    setError(null);
    const {error, data} = await supabase.from('sales_deals').select('*');
    if (error) throw error;
    setMetrics(data);
  } catch (error) {
    setError(error.message);
    console.error('Error:', error);
  }
}

// In JSX:
if (error) return <div>Error: {error}</div>;
```

### **Q15: What happens if the Supabase connection fails?**
**A:** If the connection fails:
- The `await supabase.from()` call will throw an error
- The error will be caught by the catch block
- The error will be logged to console
- The component will continue to render (won't crash)
- The metrics state will remain unchanged

---

## Code Structure & Best Practices

### **Q16: What's wrong with the function name `fetchMatrics`?**
**A:** The function name has a typo:
- **Current:** `fetchMatrics` (missing 'e')
- **Correct:** `fetchMetrics`
- This should be fixed for code clarity and professionalism

### **Q17: How would you add TypeScript to this component?**
**A:** 
```javascript
interface Metrics {
  name: string;
  value: number;
}

function Dashboard(): JSX.Element {
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  
  async function fetchMetrics(): Promise<void> {
    // ... rest of the function
  }
}
```

### **Q18: How would you add PropTypes for this component?**
**A:** 
```javascript
import PropTypes from 'prop-types';

function Dashboard({ title, refreshInterval }) {
  // component code
}

Dashboard.propTypes = {
  title: PropTypes.string,
  refreshInterval: PropTypes.number
};

Dashboard.defaultProps = {
  title: 'Sales Dashboard',
  refreshInterval: 30000
};
```

### **Q19: How would you make this component reusable?**
**A:** 
```javascript
function Dashboard({ 
  tableName = 'sales_deals', 
  columns = 'name, value.sum()',
  title = 'Total Sales This Quarter ($)'
}) {
  const [metrics, setMetrics] = useState([]);
  
  async function fetchMetrics() {
    const {error, data} = await supabase
      .from(tableName)
      .select(columns);
    // ... rest of the function
  }
  
  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>{title}</h2>
      </div>
    </div>
  );
}
```

---

## Advanced Scenarios

### **Q20: How would you add real-time updates to your Dashboard?**
**A:** 
```javascript
useEffect(() => {
  fetchMatrics();
  
  const subscription = supabase
    .from('sales_deals')
    .on('*', payload => {
      console.log('Change received!', payload);
      fetchMatrics(); // Refetch data
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### **Q21: How would you add caching to prevent unnecessary API calls?**
**A:** 
```javascript
const [lastFetch, setLastFetch] = useState(0);
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchMatrics() {
  const now = Date.now();
  if (now - lastFetch < CACHE_DURATION) {
    return; // Use cached data
  }
  
  try {
    const {error, data} = await supabase.from('sales_deals').select('*');
    if (error) throw error;
    setMetrics(data);
    setLastFetch(now);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### **Q22: How would you add pagination to handle large datasets?**
**A:** 
```javascript
const [page, setPage] = useState(0);
const [hasMore, setHasMore] = useState(true);
const PAGE_SIZE = 10;

async function fetchMatrics() {
  try {
    const {error, data} = await supabase
      .from('sales_deals')
      .select('*')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      
    if (error) throw error;
    
    setMetrics(prev => [...prev, ...data]);
    setHasMore(data.length === PAGE_SIZE);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### **Q23: How would you add search/filtering functionality?**
**A:** 
```javascript
const [searchTerm, setSearchTerm] = useState('');

async function fetchMatrics() {
  try {
    let query = supabase.from('sales_deals').select('*');
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const {error, data} = await query;
    if (error) throw error;
    setMetrics(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// In JSX:
<input 
  value={searchTerm} 
  onChange={(e) => setSearchTerm(e.target.value)} 
  placeholder="Search deals..."
/>
```

### **Q24: How would you optimize this component for performance?**
**A:** 
```javascript
// 1. Memoize expensive calculations
const totalSales = useMemo(() => 
  metrics.reduce((sum, item) => sum + item.value, 0), 
  [metrics]
);

// 2. Debounce search
const debouncedSearch = useCallback(
  debounce((term) => {
    setSearchTerm(term);
  }, 300),
  []
);

// 3. Use React.memo to prevent unnecessary re-renders
const Dashboard = React.memo(function Dashboard() {
  // component code
});
```

### **Q25: How would you add unit tests for this component?**
**A:** 
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/sales', (req, res, ctx) => {
    return res(ctx.json([{ name: 'Deal 1', value: 100 }]));
  })
);

test('renders dashboard with data', async () => {
  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('Total Sales This Quarter ($)')).toBeInTheDocument();
  });
});

test('handles error gracefully', async () => {
  server.use(
    rest.get('/api/sales', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  
  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## Summary

These questions cover:
- **useState fundamentals** and state management
- **useEffect patterns** and data fetching
- **Supabase integration** and queries
- **Error handling** best practices
- **Code structure** and maintainability
- **Advanced features** like real-time updates and caching
- **Performance optimization** techniques
- **Testing strategies** for React components

The Dashboard component demonstrates key React concepts including hooks, async operations, error handling, and external API integration - all essential topics for React interviews! 