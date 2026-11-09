import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Mock data to ensure the forum looks active during your presentation!
const mockPosts = [
  { id: 1, author_name: 'Ramesh from Mandya', title: 'Best fertilizer for sugarcane in black soil?', content: 'I have 2 acres of black soil in Mandya. Which fertilizer gives the best yield for sugarcane this season?', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, author_name: 'Lakshmi from Chikkamagaluru', title: 'Coffee leaf rust prevention', content: 'Noticed some yellow spots on my coffee leaves. Is it too late to spray Copper Oxychloride?', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 3, author_name: 'Suresh from Raichur', title: 'Water requirement for Ragi', content: 'Planning to sow Ragi next week. How much irrigation is needed if the monsoon is delayed?', created_at: new Date(Date.now() - 259200000).toISOString() }
]

const mockReplies = [
  { id: 1, post_id: 1, author_name: 'Expert Agronomist', content: 'For black soil in Mandya, a combination of DAP at sowing and Urea at 45 days works best. Ensure soil testing is done first!', created_at: new Date(Date.now() - 80000000).toISOString() },
  { id: 2, post_id: 2, author_name: 'Coffee Board Official', content: 'It is not too late. Spray Copper Oxychloride (0.3%) immediately. Also, prune the affected branches to stop the spread.', created_at: new Date(Date.now() - 160000000).toISOString() }
]

export default function CommunityForum() {
  const [posts, setPosts] = useState([])
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [posting, setPosting] = useState(false)
  
  // Reply specific state
  const [replyingTo, setReplyingTo] = useState(null) // ID of the post being replied to
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch Posts
    const { data: postsData, error: postsError } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false })
    const finalPosts = (!postsError && postsData && postsData.length > 0) ? postsData : mockPosts
    setPosts(finalPosts)

    // Fetch Replies
    const { data: repliesData, error: repliesError } = await supabase.from('forum_replies').select('*').order('created_at', { ascending: true })
    const finalReplies = (!repliesError && repliesData && repliesData.length > 0) ? repliesData : mockReplies
    setReplies(finalReplies)

    setLoading(false)
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!newTitle || !newContent) return
    setPosting(true)
    const { error } = await supabase.from('forum_posts').insert({ author_name: 'You (Demo User)', title: newTitle, content: newContent })
    if (!error) {
      setNewTitle(''); setNewContent(''); setShowForm(false)
      fetchData()
    }
    setPosting(false)
  }

  const handleReplySubmit = async (postId) => {
    if (!replyText) return
    setSubmittingReply(true)
    const { error } = await supabase.from('forum_replies').insert({ post_id: postId, author_name: 'You (Demo User)', content: replyText })
    if (!error) {
      setReplyText('')
      setReplyingTo(null)
      fetchData() // Refresh to show the new reply
    }
    setSubmittingReply(false)
  }

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        FARMER COMMUNITY
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', lineHeight: '1.1', margin: 0 }}>Community Forum</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#059669', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
          {showForm ? 'Cancel' : '+ Ask a Question'}
        </button>
      </div>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Connect with fellow farmers across Karnataka. Share experiences, ask questions, and get advice on crop management.
      </p>

      {/* ASK A QUESTION FORM */}
      {showForm && (
        <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '16px', border: '1px solid #bbf7d0', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#059669', fontSize: '18px' }}>Ask the Community</h3>
          <form onSubmit={handlePost}>
            <input type="text" placeholder="Question Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', boxSizing: 'border-box' }} />
            <textarea placeholder="Describe your issue..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows="4" style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <button type="submit" disabled={posting} style={{ background: posting ? '#9ca3af' : '#2d5016', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
              {posting ? 'Posting...' : 'Post Question'}
            </button>
          </form>
        </div>
      )}

      {/* POSTS LIST */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading community discussions...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => {
            const postReplies = replies.filter(r => r.post_id === post.id)
            const isReplying = replyingTo === post.id

            return (
              <div key={post.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {/* Original Post */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>{post.title}</h3>
                    <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '16px' }}>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: '0 0 16px 0', color: '#4b5563', lineHeight: '1.6', fontSize: '15px' }}>{post.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{post.author_name.charAt(0)}</div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{post.author_name}</span>
                  </div>
                </div>

                {/* Replies Section */}
                {postReplies.length > 0 && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      💬 {postReplies.length} {postReplies.length === 1 ? 'Reply' : 'Replies'}
                    </h4>
                    {postReplies.map(reply => (
                      <div key={reply.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ width: '28px', height: '28px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#166534', flexShrink: 0 }}>{reply.author_name.charAt(0)}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#111827' }}>{reply.author_name} <span style={{ fontWeight: '400', color: '#9ca3af', marginLeft: '8px' }}>{new Date(reply.created_at).toLocaleDateString()}</span></p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input / Button */}
                <div style={{ marginTop: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  {isReplying ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <textarea 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)} 
                        placeholder="Write your advice..." 
                        rows="2"
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} 
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button onClick={() => handleReplySubmit(post.id)} disabled={submittingReply} style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                          {submittingReply ? 'Sending...' : 'Send'}
                        </button>
                        <button onClick={() => { setReplyingTo(null); setReplyText('') }} style={{ background: 'transparent', color: '#6b7280', border: 'none', padding: '4px', cursor: 'pointer', fontSize: '12px' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyingTo(post.id)} style={{ background: 'transparent', color: '#059669', border: '1px solid #059669', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                      💬 Reply to this question
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}