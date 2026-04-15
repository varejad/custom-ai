export const callLLM = async ({ provider, model, systemPrompt, temperature, topK, topP, messages, apiKey }) => {
  if (provider === 'gemini') {
    return await callGemini({ model, systemPrompt, temperature, topK, topP, messages, apiKey });
  } else if (provider === 'openai') {
    return await callOpenAI({ model, systemPrompt, temperature, topP, messages, apiKey });
  }
  throw new Error("Provedor não suportado");
};

const callGemini = async ({ model, systemPrompt, temperature, topK, topP, messages, apiKey }) => {
  if (!apiKey) throw new Error("Chave API do Gemini não configurada!");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const payload = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: parseFloat(temperature),
      topK: parseInt(topK),
      topP: parseFloat(topP)
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Erro na API do Gemini');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const callOpenAI = async ({ model, systemPrompt, temperature, topP, messages, apiKey }) => {
  if (!apiKey) throw new Error("Chave API da OpenAI não configurada!");
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: parseFloat(temperature),
      top_p: parseFloat(topP)
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Erro na API da OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
