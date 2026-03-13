import React, { useEffect, useMemo, useState } from "react";

// --- IKONY (SVG) ---
const Icons = {
  Heading: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4v16M18 4v16M6 12h12"/></svg>,
  Text: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  TextImage: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18"/></svg>,
  Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Gallery: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
  Youtube: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>,
  Faq: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  Cta: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 12h8"/></svg>,
  Table: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"/></svg>,
  Move: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
};

export default function ShoptetBuilderUltimate() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [projectName, setProjectName] = useState("produkt - CZ");
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [library, setLibrary] = useState([]);

  // --- PERSISTENCE (KNIHOVNA) ---
  useEffect(() => {
    const saved = localStorage.getItem("eshop_content_lib");
    if (saved) setLibrary(JSON.parse(saved));
  }, []);

  const saveToLibrary = () => {
    const newEntry = { id: Date.now(), name: projectName, data: blocks };
    const updated = [...library.filter(i => i.name !== projectName), newEntry];
    setLibrary(updated);
    localStorage.setItem("eshop_content_lib", JSON.stringify(updated));
    alert("Vzor '" + projectName + "' byl uložen.");
  };

  const loadFromLibrary = (id) => {
    const item = library.find(l => l.id === Number(id));
    if (item) { setBlocks(item.data); setProjectName(item.name); }
  };

  // --- MANIPULACE S BLOKY ---
  const addBlock = (type, meta = {}) => {
    const id = crypto.randomUUID();
    let base = { 
        id, 
        type, 
        heading: "Nadpis bloku", 
        text: "Zde napište svůj text...", 
        url: "https://placehold.co/600x400",
        btnText: "Více informací",
        link: "#"
    };
    
    if (type === 'benefits') {
      base.count = meta.count;
      base.items = Array(meta.count).fill(0).map((_, i) => ({ 
        t: `Výhoda ${i+1}`, 
        img: "https://placehold.co/100" 
      }));
    }
    if (type === 'faq') base.items = [{ q: "Otázka?", a: "Odpověď" }];
    if (type === 'gallery') base.urls = ["https://placehold.co/400", "https://placehold.co/401", "https://placehold.co/402"];
    if (type === 'table') base.rows = [{k: "Parametr", v: "Hodnota"}];

    setBlocks([...blocks, base]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
  const deleteBlock = (id) => { setBlocks(blocks.filter(b => b.id !== id)); setSelectedId(null); };

  // --- DRAG & DROP LOGIKA ---
  const onDragStart = (idx) => setDraggedIdx(idx);
  const onDragOver = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const newBlocks = [...blocks];
    const item = newBlocks.splice(draggedIdx, 1)[0];
    newBlocks.splice(idx, 0, item);
    setDraggedIdx(idx);
    setBlocks(newBlocks);
  };

  // --- HTML EXPORT ---
  const handleExport = () => {
    console.log("Generuji HTML pro Shoptet...");
    // Zde by byla logika generování čistého HTML řetězce
    alert("Funkce generování HTML kódu připravena k implementaci exportu.");
  };

  return (
    <div className="app-container">
      {/* Horní modrá lišta */}
      <header className="main-nav">
        <div className="brand">E-shop Content Builder</div>
        <button className="html-btn" onClick={handleExport}>Kopírovat HTML</button>
      </header>

      <div className="workspace">
        {/* Levý panel - Knihovna a Tlačítka */}
        <aside className="left-panel">
          <div className="section-card">
            <label>Název projektu</label>
            <input className="proj-name" value={projectName} onChange={e => setProjectName(e.target.value)} />
            <button className="save-btn" onClick={saveToLibrary}>Uložit vzor</button>
            <select className="lib-select" onChange={e => loadFromLibrary(e.target.value)}>
              <option value="">--- Knihovna vzorů ---</option>
              {library.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div className="section-card widgets">
            <h3>Přidat blok</h3>
            <div className="grid">
              <button onClick={() => addBlock('benefits', {count: 3})}>Výhody 3 ikony</button>
              <button onClick={() => addBlock('benefits', {count: 4})}>Výhody 4 ikony</button>
              <button onClick={() => addBlock('benefits', {count: 5})}>Výhody 5 ikon</button>
              <button onClick={() => addBlock('heading')}>Nadpis</button>
              <button onClick={() => addBlock('text')}>Text</button>
              <button onClick={() => addBlock('text-image-left')}>Text + Obrázek</button>
              <button onClick={() => addBlock('image')}>Obrázek</button>
              <button onClick={() => addBlock('gallery')}>Galerie</button>
              <button onClick={() => addBlock('faq')}>FAQ</button>
              <button onClick={() => addBlock('youtube')}>Video</button>
              <button onClick={() => addBlock('table')}>Tabulka</button>
              <button onClick={() => addBlock('cta')}>CTA banner</button>
            </div>
          </div>
        </aside>

        {/* Střední část - Drag & Drop plocha */}
        <main className="editor-canvas">
          {blocks.length === 0 && <div className="placeholder-info">Zatím prázdné. Přidejte první blok z nabídky vlevo.</div>}
          {blocks.map((b, idx) => (
            <div 
              key={b.id} 
              className={`canvas-block ${selectedId === b.id ? 'active' : ''}`}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => { e.preventDefault(); onDragOver(idx); }}
              onClick={() => setSelectedId(b.id)}
            >
              <div className="block-controls">
                <span className="drag-icon"><Icons.Move /></span>
                <span className="type-badge">{b.type.replace(/-/g, ' ')}</span>
                <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }}><Icons.Trash /></button>
              </div>
              
              <div className="preview-area">
                {b.type === 'benefits' && (
                    <div style={{display: 'flex', justifyContent: 'space-around', gap: '10px'}}>
                        {b.items.map((it, i) => (
                            <div key={i} style={{textAlign: 'center', fontSize: '10px'}}>
                                <img src={it.img} width="40" style={{display: 'block', margin: '0 auto 5px'}} />
                                <strong>{it.t}</strong>
                            </div>
                        ))}
                    </div>
                )}
                {b.type === 'heading' && <h2 style={{margin: 0}}>{b.heading}</h2>}
                {b.type === 'text' && <p style={{margin: 0, fontSize: '13px'}}>{b.text}</p>}
                {b.type === 'image' && <div className="img-ph">Obrázek: {b.url}</div>}
                {b.type === 'youtube' && <div className="video-ph">YouTube Video</div>}
                {!(['benefits', 'heading', 'text', 'image', 'youtube'].includes(b.type)) && (
                    <div style={{fontStyle: 'italic', color: '#999'}}>Náhled pro {b.type}</div>
                )}
              </div>
            </div>
          ))}
        </main>

        {/* Pravý panel - Nastavení */}
        <aside className="right-panel">
          {selectedId ? (
            <div className="settings-box">
              <h3>Nastavení: {blocks.find(b => b.id === selectedId).type.toUpperCase()}</h3>
              
              <label>Hlavní nadpis</label>
              <input 
                value={blocks.find(b => b.id === selectedId).heading} 
                onChange={e => updateBlock(selectedId, {heading: e.target.value})} 
              />
              
              <label>Textový obsah</label>
              <textarea 
                value={blocks.find(b => b.id === selectedId).text} 
                onChange={e => updateBlock(selectedId, {text: e.target.value})} 
              />

              {blocks.find(b => b.id === selectedId).type.includes('image') || blocks.find(b => b.id === selectedId).type === 'youtube' ? (
                <>
                    <label>URL média (Obrázek/Video)</label>
                    <input 
                        value={blocks.find(b => b.id === selectedId).url} 
                        onChange={e => updateBlock(selectedId, {url: e.target.value})} 
                    />
                </>
              ) : null}

              {blocks.find(b => b.id === selectedId).type === 'benefits' && (
                <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                    <strong>Texty ikon:</strong>
                    {blocks.find(b => b.id === selectedId).items.map((it, i) => (
                        <div key={i} style={{marginBottom: '10px'}}>
                            <label style={{fontSize: '9px'}}>Ikona {i+1}</label>
                            <input 
                                value={it.t} 
                                onChange={e => {
                                    const newItems = [...blocks.find(b => b.id === selectedId).items];
                                    newItems[i].t = e.target.value;
                                    updateBlock(selectedId, {items: newItems});
                                }} 
                            />
                        </div>
                    ))}
                </div>
              )}
            </div>
          ) : <div className="empty-state">Vyberte blok v ploše pro úpravu</div>}
        </aside>
      </div>

      <style>{`
        .app-container { display: flex; flex-direction: column; height: 100vh; font-family: 'Inter', -apple-system, sans-serif; background: #f4f6f8; color: #333; }
        .main-nav { background: #131432; color: white; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        .brand { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .html-btn { background: #34d399; color: #131432; border: none; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .html-btn:hover { background: #10b981; }

        .workspace { display: flex; flex: 1; overflow: hidden; }
        .left-panel { width: 280px; padding: 20px; border-right: 1px solid #ddd; background: #fff; overflow-y: auto; }
        .right-panel { width: 320px; padding: 20px; border-left: 1px solid #ddd; background: #fff; overflow-y: auto; }

        .section-card { background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .proj-name { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; box-sizing: border-box; }
        .save-btn { width: 100%; background: #131432; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; margin-bottom: 10px; font-weight: 600; }
        .lib-select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; background: #f9f9f9; }

        .widgets h3 { font-size: 14px; margin-top: 0; margin-bottom: 15px; color: #666; }
        .widgets .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .widgets button { background: #fff; border: 1px solid #e5e7eb; padding: 12px 5px; border-radius: 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.2s; color: #4b5563; }
        .widgets button:hover { border-color: #131432; background: #f3f4f6; color: #131432; }

        .editor-canvas { flex: 1; padding: 40px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; gap: 20px; background-image: radial-gradient(#d1d5db 1px, transparent 1px); background-size: 20px 20px; }
        .canvas-block { background: white; width: 100%; max-width: 800px; min-height: 80px; border-radius: 16px; border: 2px solid transparent; cursor: pointer; position: relative; padding: 25px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); transition: 0.2s; }
        .canvas-block.active { border-color: #131432; box-shadow: 0 0 0 4px rgba(19, 20, 50, 0.05); }
        .canvas-block:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        
        .block-controls { position: absolute; left: -50px; top: 10px; display: flex; flex-direction: column; gap: 8px; opacity: 0; transition: 0.3s; }
        .canvas-block:hover .block-controls { opacity: 1; }
        .drag-icon { background: white; padding: 8px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: grab; color: #9ca3af; display: flex; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 8px; border-radius: 10px; cursor: pointer; display: flex; }
        .type-badge { background: #131432; color: white; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }

        .settings-box h3 { font-size: 16px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #131432; }
        .settings-box label { display: block; font-size: 11px; font-weight: 800; color: #9ca3af; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .settings-box input, .settings-box textarea { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; margin-top: 8px; box-sizing: border-box; font-family: inherit; font-size: 14px; background: #f9fafb; }
        .settings-box textarea { height: 150px; resize: vertical; }
        
        .img-ph, .video-ph { background: #f3f4f6; border: 2px dashed #d1d5db; padding: 20px; text-align: center; border-radius: 12px; color: #9ca3af; font-size: 12px; }
        .empty-state { text-align: center; margin-top: 100px; color: #9ca3af; font-size: 14px; }
        .placeholder-info { margin-top: 100px; color: #9ca3af; font-style: italic; }
      `}</style>
    </div>
  );
}
