import React, { useEffect, useMemo, useState } from "react";

// --- IKONY PRO TOOLBAR ---
const Icons = {
  Heading: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4v16M18 4v16M6 12h12"/></svg>,
  Text: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  Youtube: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>,
  Benefits: (n) => <g stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="12" stroke="none" fill="currentColor" fontWeight="bold">{n}</text></g>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>,
  Move: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>
};

export default function EshopBuilderFinal() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const addBlock = (type, count = 0) => {
    const id = crypto.randomUUID();
    let newBlock = { id, type, heading: "Nadpis sekce", text: "Text...", url: "" };
    
    if (type === 'youtube') {
      newBlock.url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
    
    if (type === 'benefits') {
      newBlock.count = count;
      newBlock.items = Array(count).fill(0).map((_, i) => ({
        t: `Výhoda ${i+1}`,
        img: "https://cdn.myshoptet.com/usr/your-domain.cz/user/documents/upload/icon-placeholder.png"
      }));
    }

    setBlocks([...blocks, newBlock]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
  const deleteBlock = (id) => { setBlocks(blocks.filter(b => b.id !== id)); setSelectedId(null); };

  // --- DRAG & DROP ---
  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const newBlocks = [...blocks];
    const item = newBlocks.splice(draggedIdx, 1)[0];
    newBlocks.splice(idx, 0, item);
    setDraggedIdx(idx);
    setBlocks(newBlocks);
  };

  // --- HTML EXPORT PRO SHOPTET ---
  const generateHtml = useMemo(() => {
    return blocks.map(b => {
      const wrapper = (content) => `<div class="content-block" style="padding:25px 0; max-width:1000px; margin:auto; font-family:sans-serif;">${content}</div>`;
      
      if (b.type === 'heading') return wrapper(`<h2 style="text-align:center; font-size:28px;">${b.heading}</h2>`);
      if (b.type === 'text') return wrapper(`<p style="line-height:1.6;">${b.text.replace(/\n/g, '<br>')}</p>`);
      
      if (b.type === 'youtube') {
        const videoId = b.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
        return wrapper(`<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:10px;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe></div>`);
      }

      if (b.type === 'benefits') {
        const items = b.items.map(it => `
          <div style="flex:1; text-align:center; padding:10px;">
            <img src="${it.img}" style="width:100px; height:100px; margin-bottom:10px;" alt="${it.t}">
            <div style="font-weight:bold; font-size:14px;">${it.t}</div>
          </div>`).join("");
        return wrapper(`<div style="display:flex; justify-content:space-around; align-items:flex-start; gap:10px;">${items}</div>`);
      }
      return "";
    }).join("\n");
  }, [blocks]);

  return (
    <div className="builder-vfinal">
      <header className="top-bar">
        <div className="title">ESHOP CONTENT <span>BUILDER</span></div>
        <button className="export-btn" onClick={() => {navigator.clipboard.writeText(generateHtml); alert("HTML kód byl zkopírován!")}}>Kopírovat HTML</button>
      </header>

      <nav className="toolbar">
        <button onClick={() => addBlock('heading')}><Icons.Heading /> Nadpis</button>
        <button onClick={() => addBlock('text')}><Icons.Text /> Text</button>
        <button onClick={() => addBlock('youtube')}><Icons.Youtube /> YouTube Video</button>
        <div className="sep" />
        <button onClick={() => addBlock('benefits', 3)}><svg width="18" height="18">{Icons.Benefits(3)}</svg> 3 Výhody</button>
        <button onClick={() => addBlock('benefits', 4)}><svg width="18" height="18">{Icons.Benefits(4)}</svg> 4 Výhody</button>
        <button onClick={() => addBlock('benefits', 5)}><svg width="18" height="18">{Icons.Benefits(5)}</svg> 5 Výhody</button>
      </nav>

      <div className="editor-main">
        <div className="canvas">
          {blocks.map((b, idx) => (
            <div 
              key={b.id} 
              className={`block-unit ${selectedId === b.id ? 'active' : ''}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => { e.preventDefault(); handleDragOver(idx); }}
              onClick={() => setSelectedId(b.id)}
            >
              <div className="block-meta">
                <span className="drag-handle"><Icons.Move /></span>
                <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }}><Icons.Trash /></button>
              </div>

              <div className="block-preview-content">
                {b.type === 'heading' && <h2>{b.heading}</h2>}
                {b.type === 'text' && <p>{b.text}</p>}
                {b.type === 'youtube' && <div className="p-video">YouTube Video: {b.url}</div>}
                {b.type === 'benefits' && (
                  <div className="p-benefits" style={{display: 'flex', gap: '10px', justifyContent: 'space-around'}}>
                    {b.items.map((it, i) => (
                      <div key={i} style={{textAlign: 'center'}}><img src={it.img} style={{width: '50px'}} /><div>{it.t}</div></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className="inspector">
          <div className="ins-header">Nastavení bloku</div>
          {selectedId ? (
            <div className="ins-body">
              {blocks.find(b => b.id === selectedId).type === 'youtube' ? (
                <>
                  <label>Odkaz na video</label>
                  <input value={blocks.find(b => b.id === selectedId).url} onChange={e => updateBlock(selectedId, {url: e.target.value})} />
                </>
              ) : blocks.find(b => b.id === selectedId).type === 'benefits' ? (
                <div className="benefit-editor">
                  {blocks.find(b => b.id === selectedId).items.map((it, i) => (
                    <div key={i} className="benefit-row-edit">
                      <label>Ikona {i+1} (URL)</label>
                      <input value={it.img} onChange={e => {
                        const newItems = [...blocks.find(b => b.id === selectedId).items];
                        newItems[i].img = e.target.value;
                        updateBlock(selectedId, {items: newItems});
                      }} />
                      <label>Text {i+1}</label>
                      <input value={it.t} onChange={e => {
                        const newItems = [...blocks.find(b => b.id === selectedId).items];
                        newItems[i].t = e.target.value;
                        updateBlock(selectedId, {items: newItems});
                      }} />
                      <hr />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <label>Nadpis / Obsah</label>
                  <input value={blocks.find(b => b.id === selectedId).heading} onChange={e => updateBlock(selectedId, {heading: e.target.value})} />
                  <label>Text</label>
                  <textarea value={blocks.find(b => b.id === selectedId).text} onChange={e => updateBlock(selectedId, {text: e.target.value})} />
                </>
              )}
            </div>
          ) : <div className="empty-ins">Vyberte widget</div>}
        </aside>
      </div>

      <style>{`
        .builder-vfinal { display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; background: #f1f5f9; }
        .top-bar { background: #1e293b; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .title span { color: #3b82f6; font-weight: bold; }
        .export-btn { background: #3b82f6; border: none; padding: 8px 16px; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; }

        .toolbar { background: white; padding: 10px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: center; align-items: center; }
        .toolbar button { background: white; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 12px; transition: 0.2s; }
        .toolbar button:hover { border-color: #3b82f6; color: #3b82f6; }
        .sep { width: 1px; height: 24px; background: #e2e8f0; margin: 0 10px; }

        .editor-main { display: flex; flex: 1; overflow: hidden; }
        .canvas { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        
        .block-unit { background: white; width: 100%; max-width: 700px; padding: 20px; border-radius: 8px; border: 2px solid transparent; cursor: pointer; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .block-unit.active { border-color: #3b82f6; }
        
        .block-meta { position: absolute; left: -45px; top: 0; display: flex; flex-direction: column; gap: 5px; opacity: 0; transition: 0.2s; }
        .block-unit:hover .block-meta { opacity: 1; }
        .drag-handle { background: white; padding: 6px; border-radius: 5px; cursor: grab; color: #94a3b8; border: 1px solid #e2e8f0; }
        .del-btn { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 6px; border-radius: 5px; cursor: pointer; }

        .p-video { background: #000; color: white; padding: 20px; text-align: center; border-radius: 6px; }
        .p-benefits { background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px dashed #cbd5e1; }

        .inspector { width: 300px; background: white; border-left: 1px solid #e2e8f0; padding: 20px; overflow-y: auto; }
        .ins-header { font-weight: bold; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .ins-body label { display: block; font-size: 11px; font-weight: bold; margin-top: 15px; color: #64748b; text-transform: uppercase; }
        .ins-body input, .ins-body textarea { width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; margin-top: 5px; box-sizing: border-box; }
        .benefit-row-edit hr { border: 0; border-top: 1px solid #eee; margin: 15px 0; }
        
        .empty-ins { color: #94a3b8; text-align: center; margin-top: 100px; }
      `}</style>
    </div>
  );
}
