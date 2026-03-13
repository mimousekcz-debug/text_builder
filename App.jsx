import React, { useEffect, useMemo, useState } from "react";

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

export default function ShoptetBuilderFixed() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [projectName, setProjectName] = useState("produkt - CZ");
  const [library, setLibrary] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("eshop_content_lib_v2");
    if (saved) setLibrary(JSON.parse(saved));
  }, []);

  const saveToLibrary = () => {
    const newEntry = { id: Date.now(), name: projectName, data: blocks };
    const updated = [...library.filter(i => i.name !== projectName), newEntry];
    setLibrary(updated);
    localStorage.setItem("eshop_content_lib_v2", JSON.stringify(updated));
    alert("Vzor '" + projectName + "' uložen.");
  };

  const addBlock = (type, meta = {}) => {
    const id = crypto.randomUUID();
    let base = { id, type, heading: "Nadpis", text: "Popis...", url: "https://placehold.co/800x400", btnText: "Tlačítko", link: "#" };
    
    if (type === 'benefits') {
      base.items = Array(meta.count).fill(0).map((_, i) => ({ t: `Výhoda ${i+1}`, img: "https://placehold.co/100" }));
    }
    if (type === 'gallery') base.urls = ["https://placehold.co/400", "https://placehold.co/401", "https://placehold.co/402"];
    if (type === 'faq') base.items = [{ q: "Otázka?", a: "Odpověď" }];
    
    setBlocks([...blocks, base]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));

  const generateHTML = () => {
    const html = blocks.map(b => {
      const sectionStyle = "margin-bottom: 40px; font-family: sans-serif;";
      if (b.type === 'heading') return `<h2 style="${sectionStyle} text-align: center; font-size: 28px;">${b.heading}</h2>`;
      if (b.type === 'text') return `<p style="${sectionStyle} line-height: 1.6;">${b.text}</p>`;
      if (b.type === 'youtube') {
        const id = b.url.split('v=')[1]?.split('&')[0] || b.url.split('/').pop();
        return `<div style="${sectionStyle} position:relative; padding-bottom:56.25%; height:0; overflow:hidden;"><iframe src="https://www.youtube.com/embed/${id}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe></div>`;
      }
      if (b.type === 'image') return `<img src="${b.url}" style="${sectionStyle} width:100%; height:auto; border-radius:8px;" />`;
      if (b.type === 'benefits') {
        const items = b.items.map(it => `<div style="flex:1; text-align:center; padding:10px;"><img src="${it.img}" style="width:80px; margin-bottom:10px;" /><div><strong>${it.t}</strong></div></div>`).join('');
        return `<div style="${sectionStyle} display:flex; flex-wrap:wrap; justify-content:center; gap:20px;">${items}</div>`;
      }
      return ``;
    }).join('');
    
    navigator.clipboard.writeText(html);
    alert("HTML kód byl zkopírován do schránky!");
  };

  const activeBlock = blocks.find(b => b.id === selectedId);

  return (
    <div className="app-container">
      <header className="main-nav">
        <div className="brand">E-shop Content Builder</div>
        <button className="html-btn" onClick={generateHTML}>Kopírovat HTML</button>
      </header>

      <div className="workspace">
        <aside className="left-panel">
          <div className="section-card">
            <label>Název projektu</label>
            <input className="proj-name" value={projectName} onChange={e => setProjectName(e.target.value)} />
            <button className="save-btn" onClick={saveToLibrary}>Uložit vzor</button>
            <select className="lib-select" onChange={e => {
                const item = library.find(l => l.id === Number(e.target.value));
                if (item) { setBlocks(item.data); setProjectName(item.name); }
            }}>
              <option value="">--- Knihovna vzorů ---</option>
              {library.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div className="section-card widgets">
            <h3>Přidat blok</h3>
            <div className="grid">
              <button onClick={() => addBlock('benefits', {count: 3})}>Výhody (3)</button>
              <button onClick={() => addBlock('benefits', {count: 4})}>Výhody (4)</button>
              <button onClick={() => addBlock('benefits', {count: 5})}>Výhody (5)</button>
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

        <main className="editor-canvas">
          {blocks.map((b, idx) => (
            <div key={b.id} className={`canvas-block ${selectedId === b.id ? 'active' : ''}`} onClick={() => setSelectedId(b.id)}>
              <div className="block-controls">
                <button className="del-btn" onClick={() => setBlocks(blocks.filter(x => x.id !== b.id))}><Icons.Trash /></button>
              </div>
              <div className="preview-area">
                <strong>{b.type.toUpperCase()}</strong>
                {b.type === 'image' && <img src={b.url} style={{width:'100px', display:'block'}} />}
                {b.type === 'benefits' && <div style={{display:'flex', gap:10}}>{b.items.map((it,i) => <img key={i} src={it.img} width="30"/>)}</div>}
              </div>
            </div>
          ))}
        </main>

        <aside className="right-panel">
          {activeBlock ? (
            <div className="settings-box">
              <h3>Nastavení</h3>
              <label>Nadpis</label>
              <input value={activeBlock.heading || ''} onChange={e => updateBlock(selectedId, {heading: e.target.value})} />
              
              <label>Text</label>
              <textarea value={activeBlock.text || ''} onChange={e => updateBlock(selectedId, {text: e.target.value})} />

              {(activeBlock.type === 'image' || activeBlock.type === 'youtube' || activeBlock.type.includes('image')) && (
                <>
                  <label>{activeBlock.type === 'youtube' ? 'YouTube URL' : 'URL Obrázku'}</label>
                  <input value={activeBlock.url || ''} onChange={e => updateBlock(selectedId, {url: e.target.value})} />
                </>
              )}

              {activeBlock.type === 'benefits' && activeBlock.items.map((it, i) => (
                <div key={i} className="benefit-edit-row" style={{borderTop:'1px solid #eee', marginTop:10, paddingTop:10}}>
                  <label>Ikona {i+1} (URL)</label>
                  <input value={it.img} onChange={e => {
                    const newItems = [...activeBlock.items];
                    newItems[i].img = e.target.value;
                    updateBlock(selectedId, {items: newItems});
                  }} />
                  <label>Text {i+1}</label>
                  <input value={it.t} onChange={e => {
                    const newItems = [...activeBlock.items];
                    newItems[i].t = e.target.value;
                    updateBlock(selectedId, {items: newItems});
                  }} />
                </div>
              ))}
            </div>
          ) : <p>Vyberte widget</p>}
        </aside>
      </div>

      <style>{`
        .app-container { display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; background: #f4f6f8; }
        .main-nav { background: #131432; color: white; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; }
        .brand { font-size: 20px; font-weight: bold; }
        .html-btn { background: #34d399; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
        .workspace { display: flex; flex: 1; overflow: hidden; }
        .left-panel, .right-panel { width: 300px; padding: 20px; background: #fff; border: 1px solid #ddd; overflow-y: auto; }
        .editor-canvas { flex: 1; padding: 40px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
        .canvas-block { background: #fff; padding: 20px; border-radius: 12px; border: 2px solid transparent; cursor: pointer; position: relative; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .canvas-block.active { border-color: #131432; }
        .block-controls { position: absolute; right: 10px; top: 10px; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; border-radius: 5px; cursor: pointer; padding: 5px; }
        .settings-box label { display: block; font-size: 11px; font-weight: bold; margin-top: 15px; text-transform: uppercase; color: #666; }
        .settings-box input, .settings-box textarea { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
        .widgets .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .widgets button { padding: 10px; font-size: 11px; cursor: pointer; border: 1px solid #eee; background: #fff; border-radius: 8px; }
        .save-btn { width: 100%; background: #131432; color: white; padding: 10px; border: none; border-radius: 8px; margin: 10px 0; cursor: pointer; }
        .proj-name { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px; }
      `}</style>
    </div>
  );
}
