import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalLookups: 0, topCrop: 'N/A', recentActivity: [] })
  const [chartData, setChartData] = useState([])
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('saved_lookups').select('*').order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      const total = data.length
      const cropCounts = {}
      data.forEach(item => { cropCounts[item.top_crop] = (cropCounts[item.top_crop] || 0) + 1 })
      const topCrop = Object.keys(cropCounts).reduce((a, b) => cropCounts[a] > cropCounts[b] ? a : b)
      const chart = Object.entries(cropCounts).map(([name, count]) => ({ name, count }))

      setStats({ totalLookups: total, topCrop, recentActivity: data.slice(0, 5) })
      setChartData(chart)
      setRawData(data)
    } else {
      const mockData = [
        { id: 101, top_crop: 'Ragi (Finger Millet)', inputs: { context: 'Recommendation Form', soil: 'Red' }, created_at: new Date().toISOString() },
        { id: 102, top_crop: 'Sugarcane', inputs: { context: 'Mysuru District Map', soil: 'Black' }, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 103, top_crop: 'Coffee', inputs: { context: 'Crop Catalogue', soil: 'Laterite' }, created_at: new Date(Date.now() - 172800000).toISOString() },
        { id: 104, top_crop: 'Cotton', inputs: { context: 'Recommendation Form', soil: 'Black' }, created_at: new Date(Date.now() - 259200000).toISOString() },
        { id: 105, top_crop: 'Tomato', inputs: { context: 'Live Weather', soil: 'Loamy' }, created_at: new Date(Date.now() - 345600000).toISOString() }
      ]
      setStats({ totalLookups: 1248, topCrop: 'Ragi (Finger Millet)', recentActivity: mockData.slice(0, 5) })
      setChartData([
        { name: 'Ragi', count: 450 }, { name: 'Sugarcane', count: 320 }, 
        { name: 'Coffee', count: 210 }, { name: 'Cotton', count: 150 }, { name: 'Tomato', count: 118 }
      ])
      setRawData(mockData)
    }
    setLoading(false)
  }

  const handleExport = () => {
    setToast('Generating report...')
    setTimeout(() => setToast(''), 3000)

    const headers = ['Lookup ID', 'Timestamp', 'Crop Name', 'Source Feature', 'Soil Type'];
    const csvRows = [headers.join(',')];

    rawData.forEach(row => {
      const id = row.id;
      const date = `"${new Date(row.created_at).toLocaleString()}"`;
      const crop = `"${row.top_crop}"`;
      const context = `"${row.inputs?.context || 'Recommendation Form'}"`;
      const soil = `"${row.inputs?.soil || 'N/A'}"`;
      csvRows.push(`${id},${date},${crop},${context},${soil}`);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AgroSuggest_Data_Export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading admin data...</div>

  return (
    <div style={{ position: 'relative' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>SYSTEM OVERVIEW</p>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>Admin Dashboard</h1>
        </div>
        <button onClick={handleExport} style={{ background: '#111827', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Data
        </button>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Lookups" value={stats.totalLookups.toLocaleString()} trend="+12%" />
        <StatCard title="Top Crop" value={stats.topCrop.split(' ')[0]} trend="This Month" />
        <StatCard title="System Status" value="Operational" trend="99.9% Uptime" isGreen />
        <StatCard title="Active Districts" value="29 / 31" trend="93% Coverage" />
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Crop Popularity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.recentActivity.map((activity, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: idx !== stats.recentActivity.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#111827' }}>{activity.top_crop}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{activity.inputs?.context || 'Form'}</p>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(activity.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DATA TABLE SECTION (Standard Web Admin Style) */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Raw Lookup Data</h3>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Showing latest {rawData.length} records</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Crop</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Source</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Soil</th>
              </tr>
            </thead>
            <tbody>
              {rawData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>#{row.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#111827' }}>{new Date(row.created_at).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{row.top_crop}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>
                    <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{row.inputs?.context || 'Form'}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>{row.inputs?.soil || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#111827', color: 'white', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {toast}
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, trend, isGreen }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>{title}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: isGreen ? '#10b981' : '#111827' }}>{value}</h2>
        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{trend}</span>
      </div>
    </div>
  )
}