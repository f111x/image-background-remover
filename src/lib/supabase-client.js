// Minimal Supabase client using fetch directly (for Edge Runtime compatibility)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function supabaseFetch(table, options = {}) {
  const { select = '*', eq, single, insert, update, upsert } = options
  
  let url = `${SUPABASE_URL}/rest/v1/${table}`
  const params = []
  
  if (select) params.push(`select=${select}`)
  if (eq) {
    const [column, value] = eq
    params.push(`${column}=eq.${value}`)
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`
  }
  
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  
  if (insert) {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(insert),
    })
    return res.json()
  }
  
  if (update && eq) {
    const [column, value] = eq
    url += `?${column}=eq.${value}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(update),
    })
    return res.json()
  }
  
  if (upsert) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify(upsert),
    })
    return res.json()
  }
  
  const res = await fetch(url, { headers })
  const data = await res.json()
  
  if (single && Array.isArray(data)) {
    return { data: data[0] || null, error: data.length === 0 ? new Error('Not found') : null }
  }
  
  return { data, error: null }
}

// User operations
export async function getUser(userId) {
  return supabaseFetch('users', { select: '*', eq: ['id', userId], single: true })
}

export async function updateUser(userId, updates) {
  return supabaseFetch('users', { update: updates, eq: ['id', userId] })
}

// Credits operations  
export async function getCredits(userId) {
  return supabaseFetch('credits', { select: 'balance', eq: ['user_id', userId], single: true })
}

export async function updateCredits(userId, balance) {
  return supabaseFetch('credits', { upsert: { user_id: userId, balance }, eq: ['user_id', userId] })
}

// Usage tracking
export async function getUsage(userId, date) {
  return supabaseFetch('usage', { select: 'count', eq: ['user_id', userId], eq2: ['date', date], single: true })
}

export async function incrementUsage(userId, date) {
  const existing = await getUsage(userId, date)
  const count = existing.data?.count || 0
  if (existing.data) {
    return supabaseFetch('usage', { update: { count: count + 1 }, eq: ['user_id', userId], eq2: ['date', date] })
  } else {
    return supabaseFetch('usage', { insert: { user_id: userId, date, count: 1 } })
  }
}

// Orders
export async function createOrder(orderData) {
  return supabaseFetch('orders', { insert: orderData })
}

export async function updateOrder(orderId, updates) {
  return supabaseFetch('orders', { update: updates, eq: ['id', orderId] })
}

export async function getOrder(orderId) {
  return supabaseFetch('orders', { select: '*', eq: ['id', orderId], single: true })
}
