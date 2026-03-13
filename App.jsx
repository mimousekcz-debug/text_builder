import React, { useEffect, useMemo, useState } from "react";

// --- IKONY PRO NOVÉ WIDGETY ---
const Icons = {
  Heading: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4v16M18 4v16M6 12h12"/></svg>,
  Text: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  TextImage: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Gallery: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Table: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  Faq: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  Cta: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 12h8M12 8v8"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>,
  Move: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>
};

export default function EshopBuilderV5() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const addBlock = (type) => {
    const id = crypto.randomUUID();
    let newBlock = { id, type, heading: "Nový blok", text: "Obsah...", url: "https://placehold.co/600x400" };
    
    if (type === 'faq') newBlock.items = [{ q: "Otázka?", a: "Odpověď" }];
    if (type === 'table') newBlock.rows = [{ label: "Hmotnost", value: "2 kg" }, { label: "Materiál", value: "Bavlna" }];
    if (type === 'gallery') newBlock.urls = ["https://placehold.co/300", "https://placehold.co/301", "https://placehold.co/302"];
    if (type === 'cta') { newBlock.buttonText = "Koupit nyní"; newBlock.link = "#"; }

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

  // --- EXPORT HTML ---
  const generateHtml = useMemo(() => {
    return blocks.map(b => {
      const wrapper = (content) => `<div style="padding:20px 0; max-width:900px; margin:auto; font-family:Arial, sans-serif;">${content}</div>`;
      
      if (b.type === 'heading') return wrapper(`<h2 style="font-size:28px; text-align:center; color:#1a1a2e;">${b.heading}</h2>`);
      if (b.type === 'text') return wrapper(`<p style="line-height:1.6; font-size:15px; color:#444;">${b.text.replace(/\n/g, '<br>')}</p>`);
      if (b.type === 'table') {
        const rows = b.rows.map(r => `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px; font-weight:bold;">${r.label}</td><td style="padding:10px;">${r.value}</td></tr>`).join("");
        return wrapper(`<table style="width:100%; border-collapse:collapse; background:#f9f9f9; border-radius:8px; overflow:hidden;">${rows}</table>`);
      }
      if (b.type === 'faq') {
        const faqs = b.items.map(i => `<div style="margin-bottom:15px;"><b>Q: ${i.q}</b><br><p style="margin-top:5px; color:#666;">${i.a}</p></div>`).join("");
        return wrapper(`<div style="background:#fff; border:1px solid #eee; padding:20px; border-radius:8px;">${faqs}</div>`);
      }
      if (b.type === 'gallery') {
        const imgs = b.urls.map(u => `<img src="${u}" style="width:31%; margin:1%; border-radius:5px;">`).join("");
        return wrapper(`<div style="display:flex; flex-wrap:wrap; justify-content:center;">${imgs}</div>`);
      }
      if (b.type === 'cta') {
        return wrapper(`<div style="text-align:center; padding:30px; background:#1a1a2e; border-radius:10px; color:#fff;"><h3>${b.heading}</h3><a href="${b.link}" style="display:inline-block; background:#e63946; color:#fff; padding:12px 30px; border-radius:5px; text-decoration:none; font-weight:bold;">${b.buttonText}</a></div>`);
      }
      return "";
    }).join("\n");
  }, [blocks]);

  return (
    <div className="builder-v5">
      <header className="top-bar">
        <div className="title">ESHOP BUILDER <span>V5</span></div>
        <button className="export-btn" onClick={() => {navigator.clipboard.writeText(generateHtml); alert("Kód zkopírován!")}}>Kopírovat HTML</button>
      </header>

      {/* Toolbar s widgety */}
      <nav className="toolbar">
        <button onClick={() => addBlock('heading')}><Icons.Heading /> Nadpis</button>
        <button onClick={() => addBlock('text')}><Icons.Text /> Text</button>
        <button onClick={() => addBlock('table')}><Icons.Table /> Tabulka</button>
        <button onClick={() => addBlock('gallery')}><Icons.Gallery /> Galerie</button>
        <button onClick={() => addBlock('faq')}><Icons.Faq /> FAQ</button>
        <button onClick={() => addBlock('cta')}><Icons.Cta /> CTA Banner</button>
      </nav>

      <div className="editor-main">
        {/* Pracovní plocha */}
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
                <span className="type-label">{b.type.toUpperCase()}</span>
                <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }}><Icons.Trash /></button>
              </div>

              <div className="block-preview-content">
                {b.type === 'heading' && <h2>{b.heading}</h2>}
                {b.type === 'text' && <p>{b.text}</p>}
                {b.type === 'table' && <div className="p-table">Tabulka s {b.rows.length} řádky</div>}
                {b.type === 'gallery' && <div className="p-gal">Galerie ({b.urls.length} fotky)</div>}
                {b.type === 'faq' && <div className="p-faq">FAQ ({b.items.length} otázek)</div>}
                {b.type === 'cta' && <div className="p-cta">Tlačítko: {b.buttonText}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Inspektor (Vpravo) */}
        <aside className="inspector">
          <div className="ins-header">Nastavení widgetu</div>
          {selectedId ? (
            <div className="ins-body">
              <label>Nadpis widgetu</label>
              <input value={blocks.find(b => b.id === selectedId).heading} onChange={e => updateBlock(selectedId, {heading: e.target.value})} />
              
              {blocks.find(b => b.id === selectedId).type === 'text' && (
                <><label>Text</label><textarea value={blocks.find(b => b.id === selectedId).text} onChange={e => updateBlock(selectedId, {text: e.target.value})} /></>
              )}

              {blocks.find(b => b.id === selectedId).type === 'cta' && (
                <>
                  <label>Text tlačítka</label>
                  <input value={blocks.find(b => b.id === selectedId).buttonText} onChange={e => updateBlock(selectedId, {buttonText: e.target.value})} />
                  <label>Odkaz (URL)</label>
                  <input value={blocks.find(b => b.id === selectedId).link} onChange={e => updateBlock(selectedId, {link: e.target.value})} />
                </>
              )}

              {blocks.find(b => b.id === selectedId).type === 'faq' && (
                <button className="add-sub" onClick={() => {
                  const items = [...blocks.find(b => b.id === selectedId).items, {q: "Nová otázka?", a: "Odpověď"}];
                  updateBlock(selectedId, {items});
                }}>+ Přidat otázku</button>
              )}
            </div>
          ) : <div className="empty-ins">Vyberte widget pro úpravu</div>}
        </aside>
      </div>

      <style>{`
        .builder-v5 { display: flex; flex-direction: column; height: 100vh; font-family: 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; }
        .top-bar { background: #0f172a; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .title span { color: #3b82f6; font-weight: bold; }
        .export-btn { background: #3b82f6; border: none; padding: 8px 16px; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; }

        .toolbar { background: white; padding: 10px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: center; }
        .toolbar button { background: white; border: 1px solid #e2e8f0; padding: 8px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; transition: 0.2s; }
        .toolbar button:hover { border-color: #3b82f6; color: #3b82f6; }

        .editor-main { display: flex; flex: 1; overflow: hidden; }
        .canvas { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        
        .block-unit { background: white; width: 100%; max-width: 700px; padding: 20px; border-radius: 12px; border: 2px solid transparent; cursor: pointer; position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .block-unit.active { border-color: #3b82f6; }
        .block-unit:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        
        .block-meta { position: absolute; left: -50px; top: 0; display: flex; flex-direction: column; gap: 5px; opacity: 0; transition: 0.2s; }
        .block-unit:hover .block-meta { opacity: 1; }
        .drag-handle { background: white; padding: 6px; border-radius: 5px; cursor: grab; color: #94a3b8; border: 1px solid #e2e8f0; }
        .del-btn { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 6px; border-radius: 5px; cursor: pointer; }
        .type-label { font-size: 9px; font-weight: bold; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #64748b; margin-top: 5px; text-align: center; }

        .inspector { width: 300px; background: white; border-left: 1px solid #e2e8f0; padding: 20px; }
        .ins-header { font-weight: bold; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .ins-body label { display: block; font-size: 11px; font-weight: bold; margin-top: 15px; color: #64748b; text-transform: uppercase; }
        .ins-body input, .ins-body textarea { width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; margin-top: 5px; box-sizing: border-box; }
        .add-sub { width: 100%; margin-top: 20px; padding: 10px; border: 1px dashed #3b82f6; color: #3b82f6; background: #eff6ff; border-radius: 6px; cursor: pointer; font-weight: bold; }
        
        .empty-ins { color: #94a3b8; text-align: center; margin-top: 100px; font-size: 13px; }
        .p-cta { background: #0f172a; color: white; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; }
        .p-table, .p-gal, .p-faq { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; text-align: center; font-style: italic; color: #64748b; }
      `}</style>
    </div>
  );
}
