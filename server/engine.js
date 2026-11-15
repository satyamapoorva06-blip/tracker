export function fallbackClassify(email) {
  const text = `${email.subject} ${email.messages.map(m => m.body).join(' ')}`.toLowerCase();
  let classification = 'Assistant to Reply', reason = 'This looks like a request the assistant can coordinate.', action = 'Review the request and prepare a response.', confidence = 0.78;
  if (/approval|approve|partnership|decision|sign off|budget|proposal/.test(text)) { classification = 'Client to Reply'; reason = 'This request involves a decision or approval best made by the client.'; action = 'Ask the client to review and decide.'; confidence = 0.88; }
  else if (/newsletter|no reply|receipt|confirmation only|for your information/.test(text)) { classification = 'No Reply Needed'; reason = 'This message is informational and does not appear to request a response.'; action = 'Read and archive when convenient.'; confidence = 0.86; }
  else if (text.trim().length < 35) { classification = 'Needs Human Review'; reason = 'There is not enough context to confidently determine ownership.'; action = 'Review the conversation and assign an owner.'; confidence = 0.45; }
  const body = email.messages.at(-1)?.body || '';
  return { classification, confidence, reason, summary: body.length > 180 ? body.slice(0, 177) + '...' : body, action, source: 'Rules-based fallback' };
}
export async function classify(email) {
  if (!process.env.OPENAI_API_KEY) return fallbackClassify(email);
  try {
    const response = await fetch(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`}, body:JSON.stringify({model:process.env.OPENAI_MODEL || 'gpt-4o-mini',response_format:{type:'json_object'},messages:[{role:'system',content:'Classify this email conversation. Return JSON with classification (Assistant to Reply, Client to Reply, No Reply Needed, or Needs Human Review), confidence (0 to 1), reason, summary, and action. Use Needs Human Review when uncertain.'},{role:'user',content:JSON.stringify(email)}]}) });
    if (!response.ok) throw new Error('AI unavailable');
    const result = JSON.parse((await response.json()).choices[0].message.content);
    if (!['Assistant to Reply','Client to Reply','No Reply Needed','Needs Human Review'].includes(result.classification) || typeof result.confidence !== 'number' || !result.reason || !result.summary || !result.action) throw new Error('Invalid AI response');
    return {...result, source:'AI analysis'};
  } catch { return fallbackClassify(email); }
}
