// Supabase client for browser - uses direct REST API
const SUPABASE_URL = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = {
  from: (table: string) => ({
    select: (cols = '*') => {
      const url = `${SUPABASE_URL}/rest/v1/${table}?select=${cols}`
      return {
        eq: (col: string, val: string) => supabase.from(table).select(cols).filter(col, 'eq', val),
        single: () => fetch(url, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          }
        }).then(r => r.json()).then(d => ({ data: d?.[0] || null }))
      }
    },
    insert: (data: any) => {
      const url = `${SUPABASE_URL}/rest/v1/${table}`
      return fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then(r => r.json())
    },
    update: (data: any) => ({
      eq: (col: string, val: string) => {
        const url = `${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`
        return fetch(url, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }).then(r => r.json())
      }
    }),
    upsert: (data: any) => {
      const url = `${SUPABASE_URL}/rest/v1/${table}`
      return fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(data)
      }).then(r => r.json())
    }
  })
}

// Helper functions
export async function getCredits(userId: string) {
  const { data } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
  return data?.balance || 0
}

export async function updateCredits(userId: string, balance: number) {
  return supabase.from('credits').upsert({ user_id: userId, balance })
}

export async function getUser(userId: string) {
  const { data } = await supabase.from('users').select('*').eq('id', userId).single()
  return data
}

export async function updateUser(userId: string, updates: any) {
  return supabase.from('users').update(updates).eq('id', userId)
}

export async function getUsage(userId: string, date: string) {
  const { data } = await supabase.from('usage').select('count').eq('user_id', userId).eq('date', date).single()
  return data?.count || 0
}

export async function incrementUsage(userId: string, date: string) {
  const count = await getUsage(userId, date)
  if (count > 0) {
    return supabase.from('usage').update({ count: count + 1 }).eq('user_id', userId).eq('date', date)
  } else {
    return supabase.from('usage').insert({ user_id: userId, date, count: 1 })
  }
}

export async function createOrder(orderData: any) {
  return supabase.from('orders').insert(orderData)
}

export async function updateOrderStatus(orderId: string, updates: any) {
  return supabase.from('orders').update(updates).eq('id', orderId)
}

export async function getOrder(orderId: string) {
  const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
  return data
}
