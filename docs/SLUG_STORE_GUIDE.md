# Slug Store v3.1.0 Complete Guide

> **The practical guide to using @farajabien/slug-store v3.1.0 in React applications**

## 🎯 **What is Slug Store?**

Slug Store is a revolutionary React state management library that provides:
- **useState-like API** - Zero learning curve
- **URL Persistence** - Share state via URLs
- **Offline Storage** - IndexedDB/LocalStorage integration  
- **Database Sync** - Automatic server synchronization
- **Compression** - 60-80% size reduction
- **Encryption** - Built-in security
- **Performance** - 5.5KB bundle, <10ms updates

---

## 🚀 **Installation & Setup**

```bash
pnpm add @farajabien/slug-store
```

### **Basic Usage**
```typescript
import { useSlugStore } from '@farajabien/slug-store'

function MyComponent() {
  const [state, setState, { isLoading, error }] = useSlugStore(
    'my-store',           // Unique key
    { count: 0 },         // Initial state
    { url: true }         // Options
  )

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => setState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  )
}
```

---

## ⚡ **v3.1.0 New Features**

### **Dev Tools Functions**
```typescript
import { slug, getSlugData, copySlug, shareSlug } from '@farajabien/slug-store'

// Get current URL slug
const currentSlug = slug()

// Get state data from anywhere
const stateData = getSlugData('my-store')

// Copy slug to clipboard
await copySlug('my-store')

// Native share dialog
await shareSlug('my-store', {
  title: 'My App State',
  text: 'Check out my configuration!'
})
```

### **Enhanced Hook Return**
```typescript
const [state, setState, { isLoading, error, slug }] = useSlugStore(
  'my-store',
  initialState,
  options
)

// v3.1.0 additions:
console.log('Current slug:', slug)           // Auto-updating slug
console.log('Bundle size:', '5.5KB')        // 23% smaller than v3.0
```

---

## 🎨 **Core Features**

### **1. URL Persistence**
```typescript
// Automatic URL synchronization
const [filters, setFilters] = useSlugStore('filters', {
  category: 'all',
  status: 'active',
  search: ''
}, {
  url: true,          // Enable URL sync
  compress: true      // Compress for large state
})

// URL updates automatically: /page?filters=eyJjYXRlZ29yeSI6InBvc...
// State is automatically restored from URL on page load
```

### **2. Offline Storage**
```typescript
const [userData, setUserData] = useSlugStore('user', {}, {
  offline: {
    storage: 'indexeddb',    // or 'localstorage'
    encryption: true,        // Encrypt sensitive data
    password: 'user-key',    // Custom encryption key
    ttl: 86400 * 30         // 30 days expiration
  }
})
```

### **3. Database Synchronization**
```typescript
const [projects, setProjects] = useSlugStore('projects', {}, {
  db: {
    endpoint: '/api/projects/sync',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer token',
      'Content-Type': 'application/json'
    }
  }
})
```

### **4. Cross-Platform Storage**
```typescript
// React Native
const [mobileState] = useSlugStore('mobile', {}, {
  offline: {
    storage: 'custom',
    customStorage: {
      getItem: AsyncStorage.getItem,
      setItem: AsyncStorage.setItem,
      removeItem: AsyncStorage.removeItem
    }
  }
})

// Electron
const [desktopState] = useSlugStore('desktop', {}, {
  offline: {
    storage: 'custom',
    customStorage: {
      getItem: (key) => window.electronAPI.store.get(key),
      setItem: (key, value) => window.electronAPI.store.set(key, value)
    }
  }
})
```

---

## 🛠️ **Practical Examples**

### **Project Dashboard (Clarity Use Case)**
```typescript
export function useProjectDashboard() {
  const [state, setState, { isLoading, error, slug }] = useSlugStore('projects', {
    projects: {},
    filters: { status: 'all', type: 'all' },
    ui: { selectedProject: null }
  }, {
    url: true,              // Shareable project views
    compress: true,         // Handle large project data
    offline: {              // Work offline
      storage: 'indexeddb',
      encryption: true,
      ttl: 86400 * 7
    },
    db: {                   // Sync across devices
      endpoint: '/api/projects/sync'
    }
  })

  const addProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }

    setState({
      ...state,
      projects: { ...state.projects, [newProject.id]: newProject }
    })
  }, [state, setState])

  // v3.1.0 Feature: Native sharing
  const shareProjects = useCallback(async () => {
    await shareSlug('projects', {
      title: 'My Projects',
      text: 'Check out my project dashboard!'
    })
  }, [])

  return {
    state,
    isLoading,
    error,
    slug,
    addProject,
    shareProjects,
    projects: Object.values(state.projects)
  }
}
```

### **Shopping Cart**
```typescript
export function useShoppingCart() {
  const [cart, setCart] = useSlugStore('cart', {
    items: {},
    total: 0,
    currency: 'USD'
  }, {
    url: true,              // Shareable cart
    offline: {              // Persist across sessions
      storage: 'localstorage',
      ttl: 86400 * 30
    }
  })

  const addItem = (product, quantity = 1) => {
    const item = cart.items[product.id] || { ...product, quantity: 0 }
    const newItems = {
      ...cart.items,
      [product.id]: { ...item, quantity: item.quantity + quantity }
    }

    setCart({
      ...cart,
      items: newItems,
      total: calculateTotal(newItems)
    })
  }

  const shareCart = () => copySlug('cart')

  return { cart, addItem, shareCart }
}
```

### **Form State with Validation**
```typescript
export function useFormState(validationSchema) {
  const [form, setForm] = useSlugStore('form', {
    data: {},
    errors: {},
    touched: {},
    isValid: false
  }, {
    url: true,              // Shareable form state
    offline: {              // Auto-save drafts
      storage: 'localstorage',
      ttl: 3600
    }
  })

  const updateField = (field, value) => {
    const newData = { ...form.data, [field]: value }
    const errors = validate(newData, validationSchema)
    
    setForm({
      data: newData,
      errors,
      touched: { ...form.touched, [field]: true },
      isValid: Object.keys(errors).length === 0
    })
  }

  const saveDraft = () => {
    // Automatically saved via offline storage
    console.log('Draft saved automatically!')
  }

  return { form, updateField, saveDraft }
}
```

---

## 🔐 **Security & Privacy**

### **Encrypted Storage**
```typescript
const [sensitiveData, setSensitiveData] = useSlugStore('secure', {}, {
  url: false,             // Never expose in URL
  offline: {
    storage: 'indexeddb',
    encryption: true,
    password: process.env.ENCRYPTION_KEY
  }
})
```

### **Role-Based Access**
```typescript
function useSecureStore(userRole) {
  const canShare = ['admin', 'manager'].includes(userRole)
  
  return useSlugStore('secure-data', {}, {
    url: canShare,          // Only certain roles can share
    offline: {
      encryption: true,
      password: `${userRole}-${getUserId()}`
    }
  })
}
```

---

## ⚡ **Performance Optimization**

### **Large Datasets**
```typescript
const [bigData, setBigData] = useSlugStore('large-dataset', {}, {
  url: false,             // Too large for URL
  compress: true,         // Essential for large data
  offline: {
    storage: 'indexeddb',
    ttl: 86400
  },
  debounceMs: 500        // Debounce rapid updates
})
```

### **Memory Management**
```typescript
const [cachedData, setCachedData] = useSlugStore('cache', {}, {
  offline: {
    storage: 'indexeddb',
    ttl: 3600,            // 1 hour cache
    maxSize: 1024 * 1024  // 1MB limit
  }
})
```

---

## 🌐 **Real-Time Features**

### **Live Collaboration**
```typescript
export function useCollaboration(roomId) {
  const [state, setState] = useSlugStore(`collab-${roomId}`, {
    users: {},
    cursors: {},
    changes: []
  }, {
    url: false,
    offline: { storage: 'memory' }
  })

  useEffect(() => {
    const ws = new WebSocket(`wss://api.app.com/ws/${roomId}`)
    
    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data)
      
      if (type === 'USER_UPDATE') {
        setState(prev => ({
          ...prev,
          users: { ...prev.users, [payload.userId]: payload }
        }))
      }
    }

    return () => ws.close()
  }, [roomId, setState])

  return state
}
```

---

## 🔄 **Migration Guide**

### **From useState**
```typescript
// Before
const [count, setCount] = useState(0)

// After (with URL persistence!)
const [state, setState] = useSlugStore('counter', { count: 0 }, { url: true })
const count = state.count
const setCount = (newCount) => setState({ count: newCount })
```

### **From Redux/Zustand**
```typescript
// Before: Complex setup
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// After: Simple + more features
const [state, setState] = useSlugStore('counter', { count: 0 }, {
  url: true,              // Shareable URLs
  offline: true,          // Offline storage
  db: { endpoint: '/api/sync' } // Database sync
})
```

---

## 📊 **Best Practices**

### **1. Store Organization**
```typescript
// ✅ Good: Separate stores by domain
const [userState] = useSlugStore('user', {})
const [cartState] = useSlugStore('cart', {})

// ❌ Bad: Everything in one store
const [appState] = useSlugStore('app', { user: {}, cart: {} })
```

### **2. Security**
```typescript
// ✅ Good: Encrypt sensitive data
useSlugStore('user-data', {}, {
  url: false,
  offline: { storage: 'indexeddb', encryption: true }
})

// ❌ Bad: Sensitive data in URL
useSlugStore('passwords', {}, { url: true })
```

---

## 🎯 **Common Patterns**

### **Loading States**
```typescript
const [state, setState, { isLoading, error }] = useSlugStore('data', {})

if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />
return <DataView data={state} />
```

### **Conditional Features**
```typescript
const [state, setState] = useSlugStore('app', {}, {
  url: process.env.NODE_ENV === 'development',
  offline: { 
    storage: 'indexeddb',
    encryption: process.env.NODE_ENV === 'production'
  }
})
```

### **Computed Values**
```typescript
const [state, setState] = useSlugStore('todos', { items: [] })

const completedTodos = useMemo(
  () => state.items.filter(todo => todo.completed),
  [state.items]
)

const progress = state.items.length > 0 
  ? completedTodos.length / state.items.length 
  : 0
```

---

## 🚀 **Summary**

**Slug Store v3.1.0 provides:**
- ✅ **useState simplicity** with enterprise features
- ✅ **5.5KB bundle** (23% smaller than v3.0)
- ✅ **URL persistence** for shareable state
- ✅ **Offline storage** with encryption
- ✅ **Database sync** across devices
- ✅ **Dev tools** for debugging
- ✅ **Cross-platform** React, React Native, Electron

**One hook to rule them all:**
```typescript
const [state, setState, { isLoading, error, slug }] = useSlugStore(
  'my-app',
  initialState,
  {
    url: true,           // ✅ Shareable URLs
    offline: true,       // ✅ Works offline
    compress: true,      // ✅ Optimized performance
    encrypt: true,       // ✅ Secure by default
    db: { endpoint: '/api/sync' } // ✅ Cross-device sync
  }
)
```

Start with basic usage and add features as needed. Slug Store grows with your application! 