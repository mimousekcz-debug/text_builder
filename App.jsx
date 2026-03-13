import React, { useEffect, useMemo, useState } from "react";

// --- IKONY PRO WIDGETY (SVG) ---
const Icons = {
  Text: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  Image: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Video: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Faq: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  Table: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  Benefits: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
};

export default function EshopBuilderV2() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("edit"); // edit / code
  const [projectName, setProjectName] = useState("Nový produkt");

  // --- LOGIKA ---
  const addBlock = (type) => {
    const id = crypto.randomUUID();
    const newBlock = {
      id,
      type,
      heading: type === 'benefits' ? "Naše výhody" : "Nový nadpis",
      content: "Zde upravte text...",
      url: type === 'video' ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : "https://placehold.co/800x400?text=Obrazek",
      items: type === 'faq' ? [{q: "Otázka?", a: "Odpověď"}] : (type === 'benefits' ? [{t: "Kvalita"}, {t: "Doprava"}] : [])
    };
    setBlocks([...blocks, newBlock]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? {...b, ...patch} : b));
  const deleteBlock = (id) => { setBlocks(blocks.filter(b => b.id !== id)); if(selectedId === id) setSelectedId(null); };

  // --- RENDER HTML (Pro Shoptet) ---
  const generateHtml = useMemo(() => {
    return blocks.map(b => {
      const wrapper = (inner) => `<section style="padding:40px 0; font-family:sans-serif; max-width:1000px; margin:auto;">${inner}</section>`;
      if(b.type === 'text') return wrapper(`<h2 style="font-size:28px; color:#333;">${b.heading}</h2><p style="line-height:1.6; color:#666;">${b.content.replace(/\n/g, '<br>')}</p>`);
      if(b.type === 'image') return wrapper(`<img src="${b.url}" style="width:100%; border-radius:15px; display:block;">`);
      if(b.type === 'video') {
        const vid = b.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
        return wrapper(`<h2 style="text-align:center;">${b.heading}</h2><iframe width="100%" height="500" src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen style="border-radius:15px;"></iframe>`);
      }
      return "";
    }).join("\n");
  }, [blocks]);

  return (
    <div className="app-shell">
      {/* Top Bar */}
      <header className="top-nav">
        <div className="logo">JG-MEDIA <span>Builder</span></div>
        <input className="project-name" value={projectName} onChange={e => setProjectName(e.target.value)} />
        <div className="actions">
          <button className="btn-secondary" onClick={() => setActiveTab(activeTab === "edit" ? "code" : "edit")}>
            {activeTab === "edit" ? "Zobrazit kód" : "Zpět k úpravám"}
          </button>
          <button className="btn-primary" onClick={() => {navigator.clipboard.writeText(generateHtml); alert("Zkopírováno!");}}>Exportovat pro Shoptet</button>
        </div>
      </header>

      {/* Grid s výběrem bloků (Podle obrázku) */}
      <section className="block-catalog">
        <p className="catalog-label">Klikněte na blok pro přidání do popisu:</p>
        <div className="grid">
          <button onClick={() => addBlock('text')}><Icons.Text /><span>Text</span></button>
          <button onClick={() => addBlock('image')}><Icons.Image /><span>Obrázek</span></button>
          <button onClick={() => addBlock('video')}><Icons.Video /><span>Video</span></button>
          <button onClick={() => addBlock('faq')}><Icons.Faq /><span>FAQ</span></button>
          <button onClick={() => addBlock('table')}><Icons.Table /><span>Tabulka</span></button>
          <button onClick={() => addBlock('benefits')}><Icons.Benefits /><span>Výhody</span></button>
        </div>
      </section>

      <main className="main-content">
        {/* Levý panel - Seznam bloků */}
        <aside className="sidebar-layers">
          <h3>Struktura popisku</h3>
          {blocks.length === 0 && <p className="empty-info">Zatím žádné bloky</p>}
          {blocks.map((b, i) => (
            <div key={b.id} className={`layer-item ${selectedId === b.id ? 'active' : ''}`} onClick={() => setSelectedId(b.id)}>
              <span className="index">{i+1}</span>
              <span className="type">{b.type}</span>
              <button className="del" onClick={() => deleteBlock(b.id)}>×</button>
            </div>
          ))}
        </aside>

        {/* Střed - Interaktivní náhled */}
        <section className="preview-canvas">
          {activeTab === "edit" ? (
            <div className="canvas-inner">
              {blocks.map(b => (
                <div key={b.id} className={`preview-block ${selectedId === b.id ? 'selected' : ''}`} onClick={() => setSelectedId(b.id)}>
                  <div className="block-label">{b.type}</div>
                  {b.type === 'text' && (
                    <div className="content">
                      <input value={b.heading} onChange={e => updateBlock(b.id, {heading: e.target.value})} className="h-input" />
                      <textarea value={b.content} onChange={e => updateBlock(b.id, {content: e.target.value})} className="t-input" />
                    </div>
                  )}
                  {b.type === 'image' && <div className="img-placeholder"><img src={b.url} alt="" /><span>Klikněte vpravo pro změnu URL</span></div>}
                  {b.type === 'video' && <div className="video-placeholder">YouTube Video: {b.url}</div>}
                </div>
              ))}
            </div>
          ) : (
            <textarea className="raw-code" readOnly value={generateHtml} />
          )}
        </section>

        {/* Pravý panel - Nastavení detailu */}
        <aside className="sidebar-config">
          <h3>Nastavení bloku</h3>
          {selectedId ? (
            <div className="config-form">
              <label>Nadpis sekce</label>
              <input value={blocks.find(b => b.id === selectedId)?.heading} onChange={e => updateBlock(selectedId, {heading: e.target.value})} />
              
              {(blocks.find(b => b.id === selectedId)?.type === 'image' || blocks.find(b => b.id === selectedId)?.type === 'video') && (
                <>
                  <label>URL média</label>
                  <input value={blocks.find(b => b.id === selectedId)?.url} onChange={e => updateBlock(selectedId, {url: e.target.value})} />
                </>
              )}
            </div>
          ) : <p className="empty-info">Vyberte blok v náhledu</p>}
        </aside>
      </main>

      <style>{`
        :root { --accent: #e63946; --bg: #f8f9fa; --panel: #ffffff; --text: #2b2d42; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; }
        .app-shell { display: flex; flex-direction: column; height: 100vh; }
        
        .top-nav { background: #1b1b2f; color: white; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; }
        .logo { font-weight: bold; font-size: 1.2rem; } .logo span { color: var(--accent); }
        .project-name { background: transparent; border: 1px solid #444; color: white; padding: 5px 10px; border-radius: 4px; }
        
        .block-catalog { background: white; padding: 15px; border-bottom: 1px solid #ddd; text-align: center; }
        .catalog-label { font-size: 0.8rem; color: #888; margin-bottom: 10px; }
        .block-catalog .grid { display: flex; justify-content: center; gap: 15px; }
        .block-catalog button { background: white; border: 1px solid #eee; padding: 10px 20px; border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; min-width: 90px; transition: 0.2s; }
        .block-catalog button:hover { border-color: var(--accent); color: var(--accent); background: #fff5f5; }
        .block-catalog button span { font-size: 0.75rem; margin-top: 5px; }

        .main-content { display: flex; flex: 1; overflow: hidden; }
        
        .sidebar-layers { width: 220px; background: white; border-right: 1px solid #ddd; padding: 15px; }
        .layer-item { display: flex; align-items: center; padding: 8px; border: 1px solid #eee; margin-bottom: 5px; border-radius: 4px; font-size: 0.85rem; cursor: pointer; }
        .layer-item.active { border-color: var(--accent); background: #fff5f5; }
        .layer-item .index { color: #aaa; margin-right: 10px; }
        .layer-item .del { margin-left: auto; background: none; border: none; color: #ccc; cursor: pointer; font-size: 1.2rem; }
        .layer-item .del:hover { color: var(--accent); }

        .preview-canvas { flex: 1; overflow-y: auto; padding: 40px; display: flex; justify-content: center; }
        .canvas-inner { width: 100%; max-width: 800px; background: white; min-height: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-radius: 8px; padding: 20px; }
        .preview-block { position: relative; border: 2px dashed transparent; padding: 20px; transition: 0.2s; cursor: pointer; }
        .preview-block:hover { border-color: #ddd; }
        .preview-block.selected { border-color: var(--accent); background: #fffafa; }
        .block-label { position: absolute; top: -10px; right: 10px; background: var(--accent); color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        
        .h-input { width: 100%; font-size: 1.5rem; font-weight: bold; border: none; background: transparent; margin-bottom: 10px; }
        .t-input { width: 100%; min-height: 80px; border: none; background: transparent; font-family: inherit; resize: none; color: #666; }
        .img-placeholder img { width: 100%; border-radius: 8px; }
        .video-placeholder { background: #000; color: white; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }

        .sidebar-config { width: 280px; background: white; border-left: 1px solid #ddd; padding: 15px; }
        .config-form label { display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; margin-top: 15px; }
        .config-form input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        
        .btn-primary { background: var(--accent); color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
        .btn-secondary { background: #333; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px; }
        .empty-info { text-align: center; color: #ccc; font-size: 0.85rem; margin-top: 40px; }
        .raw-code { width: 100%; height: 100%; font-family: monospace; border: none; background: #222; color: #50fa7b; padding: 20px; border-radius: 8px; }
      `}</style>
    </div>
  );
}
