import React, { useEffect, useMemo, useState } from "react";

// --- IKONY ---
const Icons = {
  Heading: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4v16M18 4v16M6 12h12"/></svg>,
  Text: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  TextImage: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Benefits: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Move: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>
};

export default function EshopBuilderV4() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [projectName, setProjectName] = useState("Nový produkt");
  const [draggedIdx, setDraggedIdx] = useState(null);

  // --- LOGIKA BLOKŮ ---
  const addBlock = (type) => {
    const id = crypto.randomUUID();
    let newBlock = { id, type, heading: "Nadpis sekce", text: "Zde napište text...", url: "https://placehold.co/600x400" };
    
    if (type === 'benefits') {
      newBlock.count = 4;
      newBlock.items = Array(5).fill(0).map((_, i) => ({ t: `Výhoda ${i+1}`, img: "https://placehold.co/100" }));
    }
    setBlocks([...blocks, newBlock]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
  const deleteBlock = (id) => setBlocks(blocks.filter(b => b.id !== id));

  // --- DRAG & DROP LOGIKA ---
  const onDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (index) => {
    if (draggedIdx === null || draggedIdx === index) return;
    const items = [...blocks];
    const draggedItem = items[draggedIdx];
    items.splice(draggedIdx, 1);
    items.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    setBlocks(items);
  };

  const onDragEnd = () => setDraggedIdx(null);

  // --- HTML EXPORT ---
  const generateHtml = useMemo(() => {
    return blocks.map(b => {
      const s = "padding:20px 0; max-width:900px; margin:auto; font-family:sans-serif;";
      if (b.type === 'heading') return `<h2 style="${s} font-size:32px; text-align:center;">${b.heading}</h2>`;
      if (b.type === 'text') return `<p style="${s} line-height:1.6; font-size:16px;">${b.text.replace(/\n/g, '<br>')}</p>`;
      if (b.type === 'text-image-left') return `<div style="${s} display:flex; align-items:center; gap:30px;"><div style="flex:1;"><img src="${b.url}" style="width:100%; border-radius:10px;"></div><div style="flex:1;"><h2>${b.heading}</h2><p>${b.text}</p></div></div>`;
      if (b.type === 'text-image-right') return `<div style="${s} display:flex; align-items:center; gap:30px; flex-direction:row-reverse;"><div style="flex:1;"><img src="${b.url}" style="width:100%; border-radius:10px;"></div><div style="flex:1;"><h2>${b.heading}</h2><p>${b.text}</p></div></div>`;
      if (b.type === 'benefits') {
        const items = b.items.slice(0, b.count).map(it => `<div style="flex:1; text-align:center;"><img src="${it.img}" style="width:80px; margin-bottom:10px;"><div style="font-weight:bold;">${it.t}</div></div>`).join("");
        return `<div style="${s} display:flex; justify-content:space-around;">${items}</div>`;
      }
      return "";
    }).join("\n");
  }, [blocks]);

  return (
    <div className="builder-v4">
      <header className="top-nav">
        <div className="logo">JG-BUILDER <span>ULTRA</span></div>
        <input className="proj-input" value={projectName} onChange={e => setProjectName(e.target.value)} />
        <button className="btn-copy" onClick={() => {navigator.clipboard.writeText(generateHtml); alert("Kód zkopírován!")}}>Kopírovat HTML</button>
      </header>

      <section className="toolbar">
        <button onClick={() => addBlock('heading')}><Icons.Heading /> Nadpis</button>
        <button onClick={() => addBlock('text')}><Icons.Text /> Samostatný text</button>
        <button onClick={() => addBlock('text-image-left')}><Icons.TextImage /> Foto vlevo</button>
        <button onClick={() => addBlock('text-image-right')}><Icons.TextImage /> Foto vpravo</button>
        <button onClick={() => addBlock('benefits')}><Icons.Benefits /> Výhody</button>
      </section>

      <main className="editor-area">
        <div className="canvas">
          {blocks.length === 0 && <div className="empty">Zatím tu nic není. Přidejte widget z horní lišty.</div>}
          {blocks.map((b, idx) => (
            <div 
              key={b.id} 
              className={`block-wrapper ${selectedId === b.id ? 'selected' : ''} ${draggedIdx === idx ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={() => onDragOver(idx)}
              onDragEnd={onDragEnd}
              onClick={() => setSelectedId(b.id)}
            >
              {/* Ovládací prvky bloku */}
              <div className="block-actions">
                <div className="handle"><Icons.Move /></div>
                <button className="delete-btn" onClick={(e) => {e.stopPropagation(); deleteBlock(b.id)}}><Icons.Trash /></button>
              </div>

              {/* Obsah bloku v náhledu */}
              <div className="preview-content">
                {b.type === 'heading' && <h1 className="ph">{b.heading}</h1>}
                {b.type === 'text' && <p className="pt">{b.text}</p>}
                {(b.type === 'text-image-left' || b.type === 'text-image-right') && (
                  <div className={`flex-p ${b.type}`}>
                    <img src={b.url} alt="" style={{width: '150px', borderRadius: '8px'}} />
                    <div><h3>{b.heading}</h3><p>{b.text}</p></div>
                  </div>
                )}
                {b.type === 'benefits' && (
                  <div className="benefits-p" style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
                    {b.items.slice(0, b.count).map((it, i) => (
                      <div key={i} style={{textAlign: 'center'}}><img src={it.img} style={{width: '40px'}} /><div style={{fontSize: '10px'}}>{it.t}</div></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className="inspector">
          <h3>Vlastnosti</h3>
          {selectedId ? (
            <div className="ins-form">
              {blocks.find(b => b.id === selectedId).type !== 'text' && (
                <><label>Nadpis</label><input value={blocks.find(b => b.id === selectedId).heading} onChange={e => updateBlock(selectedId, {heading: e.target.value})} /></>
              )}
              {blocks.find(b => b.id === selectedId).type !== 'heading' && blocks.find(b => b.id === selectedId).type !== 'benefits' && (
                <><label>Text</label><textarea value={blocks.find(b => b.id === selectedId).text} onChange={e => updateBlock(selectedId, {text: e.target.value})} /></>
              )}
              {blocks.find(b => b.id === selectedId).type.includes('image') && (
                <><label>URL Obrázku</label><input value={blocks.find(b => b.id === selectedId).url} onChange={e => updateBlock(selectedId, {url: e.target.value})} /></>
              )}
              {blocks.find(b => b.id === selectedId).type === 'benefits' && (
                <><label>Počet ikon (3-5)</label>
                   <input type="number" min="3" max="5" value={blocks.find(b => b.id === selectedId).count} onChange={e => updateBlock(selectedId, {count: parseInt(e.target.value)})} />
                </>
              )}
            </div>
          ) : <p className="ins-empty">Vyberte widget v ploše</p>}
        </aside>
      </main>

      <style>{`
        .builder-v4 { display: flex; flex-direction: column; height: 100vh; font-family: 'Inter', sans-serif; background: #f4f7f9; }
        .top-nav { background: #0f172a; color: white; padding: 12px 25px; display: flex; align-items: center; gap: 20px; }
        .proj-input { background: #1e293b; border: 1px solid #334155; color: white; padding: 6px 12px; border-radius: 6px; width: 200px; }
        .btn-copy { margin-left: auto; background: #3b82f6; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: 600; }
        
        .toolbar { background: white; padding: 12px; display: flex; justify-content: center; gap: 10px; border-bottom: 1px solid #e2e8f0; }
        .toolbar button { background: #fff; border: 1px solid #e2e8f0; padding: 8px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; transition: 0.2s; }
        .toolbar button:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }

        .editor-area { display: flex; flex: 1; overflow: hidden; }
        .canvas { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        
        .block-wrapper { position: relative; background: white; width: 100%; max-width: 750px; padding: 25px; border-radius: 10px; border: 2px solid transparent; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .block-wrapper:hover { border-color: #cbd5e1; }
        .block-wrapper.selected { border-color: #3b82f6; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2); }
        .block-wrapper.dragging { opacity: 0.5; border: 2px dashed #3b82f6; }

        .block-actions { position: absolute; left: -45px; top: 0; display: flex; flex-direction: column; gap: 5px; opacity: 0; transition: 0.2s; }
        .block-wrapper:hover .block-actions { opacity: 1; }
        .handle { cursor: grab; background: white; padding: 8px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #64748b; }
        .delete-btn { background: #fee2e2; color: #ef4444; border: none; padding: 8px; border-radius: 6px; cursor: pointer; }

        .ph { text-align: center; margin: 0; font-size: 24px; }
        .pt { color: #475569; line-height: 1.6; margin: 0; }
        .flex-p { display: flex; gap: 20px; align-items: center; }
        .flex-p.text-image-right { flex-direction: row-reverse; }

        .inspector { width: 320px; background: white; border-left: 1px solid #e2e8f0; padding: 25px; }
        .ins-form label { display: block; font-size: 12px; font-weight: 700; color: #1e293b; margin-top: 15px; text-transform: uppercase; }
        .ins-form input, .ins-form textarea { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; margin-top: 5px; font-family: inherit; }
        .ins-form textarea { height: 120px; }
        .ins-empty { text-align: center; color: #94a3b8; margin-top: 100px; }
        .empty { color: #94a3b8; margin-top: 100px; font-style: italic; }
      `}</style>
    </div>
  );
}
