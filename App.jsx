import React, { useEffect, useState } from "react";

const Icons = {
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Image: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
};

export default function ShoptetBuilderUltimate() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("shoptet_builder_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProjects(parsed);
      if (parsed.length > 0) setActiveProjectId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shoptet_builder_v2", JSON.stringify(projects));
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const addBlock = (type) => {
    if (!activeProjectId) return alert("Vyberte projekt");
    const id = crypto.randomUUID();
    const newBlock = {
      id,
      type,
      heading: "Nadpis bloku",
      text: "Zde je ukázkový text pro váš nový widget.",
      url: "https://placehold.co/600x400?text=Obrazek",
      btnText: "Klikněte zde",
      gallery: ["https://placehold.co/300x300", "https://placehold.co/300x300", "https://placehold.co/300x300"],
      faq: [{ q: "Otázka?", a: "Odpověď." }]
    };
    
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, blocks: [...p.blocks, newBlock] } : p
    ));
    setSelectedBlockId(id);
  };

  const updateBlock = (patch) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? {
      ...p, blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, ...patch } : b)
    } : p));
  };

  const copyHTML = () => {
    let html = `<div class="st-builder-wrap" style="max-width:1100px; margin:0 auto; font-family: sans-serif; color: #333;">\n`;
    activeProject.blocks.forEach(b => {
      switch(b.type) {
        case 'heading': html += `<h2 style="text-align:center; margin:40px 0;">${b.heading}</h2>\n`; break;
        case 'text': html += `<p style="line-height:1.6; margin-bottom:20px;">${b.text}</p>\n`; break;
        case 'img-left': html += `<div style="display:flex; gap:30px; align-items:center; margin:30px 0; flex-wrap:wrap;"><img src="${b.url}" style="flex:1; min-width:300px; border-radius:8px;"><div style="flex:1;"><h3>${b.heading}</h3><p>${b.text}</p></div></div>\n`; break;
        case 'img-right': html += `<div style="display:flex; gap:30px; align-items:center; margin:30px 0; flex-wrap:wrap;"><div style="flex:1;"><h3>${b.heading}</h3><p>${b.text}</p></div><img src="${b.url}" style="flex:1; min-width:300px; border-radius:8px;"></div>\n`; break;
        case 'image': html += `<img src="${b.url}" style="width:100%; border-radius:10px; margin:20px 0;">\n`; break;
        case 'cta': html += `<div style="text-align:center; padding:40px; background:#f8f9fa; border-radius:12px; margin:30px 0;"><h3>${b.heading}</h3><a href="${b.url}" style="display:inline-block; padding:12px 30px; background:#000; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">${b.btnText}</a></div>\n`; break;
        case 'gallery': html += `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin:30px 0;">${b.gallery.map(img => `<img src="${img}" style="width:100%; border-radius:5px;">`).join('')}</div>\n`; break;
        default: break;
      }
    });
    html += `</div>`;
    navigator.clipboard.writeText(html);
    alert("HTML kód byl zkopírován pro Shoptet!");
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>Blinky Content Builder</h2>
          <input type="text" placeholder="Uživatelské jméno" />
          <input type="password" placeholder="Heslo" />
          <button onClick={() => setIsLoggedIn(true)}>Vstoupit do editoru</button>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-root">
      <header className="top-nav">
        <div className="nav-info"><b>Blinky</b> / {activeProject?.name || 'Žádný projekt'}</div>
        <button className="export-btn" onClick={copyHTML}>Exportovat pro Shoptet</button>
      </header>

      <div className="editor-main">
        {/* WIDGET BAR - Levý */}
        <aside className="widget-bar">
          <h3>Obsahové bloky</h3>
          <div className="widget-grid">
            <button onClick={() => addBlock('heading')}>Nadpis</button>
            <button onClick={() => addBlock('text')}>Text</button>
            <button onClick={() => addBlock('img-right')}>Text + Obr. vpravo</button>
            <button onClick={() => addBlock('img-left')}>Text + Obr. vlevo</button>
            <button onClick={() => addBlock('image')}>Samostatný obr.</button>
            <button onClick={() => addBlock('gallery')}>Galerie</button>
            <button onClick={() => addBlock('youtube')}>YouTube Video</button>
            <button onClick={() => addBlock('faq')}>FAQ</button>
            <button onClick={() => addBlock('cta')}>CTA Tlačítko</button>
          </div>
          <hr />
          <button className="new-proj-btn" onClick={() => {
            const n = prompt("Název projektu");
            if(n) setProjects([...projects, {id: crypto.randomUUID(), name: n, blocks: []}]);
          }}>+ Nový projekt</button>
        </aside>

        {/* CANVAS - Prostředek */}
        <main className="canvas">
          <div className="preview-container">
            {activeProject?.blocks.map(b => (
              <div key={b.id} className={`block-view ${selectedBlockId === b.id ? 'active' : ''}`} onClick={() => setSelectedBlockId(b.id)}>
                <span className="block-tag">{b.type}</span>
                {b.type === 'heading' && <h2>{b.heading}</h2>}
                {b.type === 'text' && <p>{b.text}</p>}
                {(b.type === 'img-left' || b.type === 'img-right') && (
                  <div className={`flex-preview ${b.type}`}>
                    <div className="txt"><h3>{b.heading}</h3><p>{b.text}</p></div>
                    <div className="img"><img src={b.url} alt="" /></div>
                  </div>
                )}
                {b.type === 'image' && <img src={b.url} className="full-img" />}
                {b.type === 'gallery' && <div className="gal-preview">{b.gallery.map((g,i) => <img key={i} src={g}/>)}</div>}
                {b.type === 'cta' && <div className="cta-preview"><h3>{b.heading}</h3><button>{b.btnText}</button></div>}
              </div>
            ))}
          </div>
        </main>

        {/* SETTINGS - Pravý */}
        <aside className="settings-bar">
          {selectedBlockId ? (
            <div className="settings-pane">
              <h3>Nastavení widgetu</h3>
              <label>Nadpis / Hlavní text</label>
              <input value={activeProject.blocks.find(b => b.id === selectedBlockId).heading} onChange={e => updateBlock({heading: e.target.value})} />
              
              <label>Doplňující text</label>
              <textarea value={activeProject.blocks.find(b => b.id === selectedBlockId).text} onChange={e => updateBlock({text: e.target.value})} />

              {(selectedBlockId && ['image', 'img-left', 'img-right', 'youtube', 'cta'].includes(activeProject.blocks.find(b => b.id === selectedBlockId).type)) && (
                <>
                  <label>URL (Obrázek / Video / Link)</label>
                  <input value={activeProject.blocks.find(b => b.id === selectedBlockId).url} onChange={e => updateBlock({url: e.target.value})} />
                </>
              )}

              {activeProject.blocks.find(b => b.id === selectedBlockId).type === 'cta' && (
                <>
                  <label>Text na tlačítku</label>
                  <input value={activeProject.blocks.find(b => b.id === selectedBlockId).btnText} onChange={e => updateBlock({btnText: e.target.value})} />
                </>
              )}
              
              <button className="del-btn" onClick={() => {
                setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, blocks: p.blocks.filter(x => x.id !== selectedBlockId)} : p));
                setSelectedBlockId(null);
              }}>Smazat widget</button>
            </div>
          ) : <div className="empty">Vyberte prvek na ploše</div>}
        </aside>
      </div>

      <style>{`
        .builder-root { height: 100vh; display: flex; flex-direction: column; font-family: sans-serif; background: #f4f7f9; }
        .top-nav { background: #fff; padding: 10px 25px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
        .export-btn { background: #ff4d4d; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
        
        .editor-main { display: flex; flex: 1; overflow: hidden; }
        .widget-bar { width: 260px; background: #fff; border-right: 1px solid #ddd; padding: 20px; }
        .widget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .widget-grid button { padding: 10px 5px; font-size: 11px; cursor: pointer; border: 1px solid #eee; background: #fafafa; border-radius: 4px; }
        .widget-grid button:hover { border-color: #ff4d4d; }

        .canvas { flex: 1; padding: 40px; overflow-y: auto; display: flex; justify-content: center; }
        .preview-container { width: 100%; max-width: 800px; background: white; min-height: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 40px; }
        
        .block-view { position: relative; border: 1px solid transparent; padding: 20px; margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
        .block-view:hover { border-color: #ddd; background: #fcfcfc; }
        .block-view.active { border-color: #ff4d4d; background: #fff5f5; }
        .block-tag { position: absolute; top: 0; right: 0; font-size: 9px; background: #eee; padding: 2px 6px; color: #999; text-transform: uppercase; }

        .flex-preview { display: flex; gap: 20px; align-items: center; }
        .flex-preview.img-left { flex-direction: row-reverse; }
        .flex-preview div { flex: 1; }
        .flex-preview img { width: 100%; border-radius: 8px; }
        .full-img { width: 100%; border-radius: 8px; }
        .gal-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .gal-preview img { width: 100%; aspect-ratio: 1; object-fit: cover; }
        .cta-preview { text-align: center; background: #f9f9f9; padding: 20px; border-radius: 8px; }
        .cta-preview button { background: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; margin-top: 10px; }

        .settings-bar { width: 300px; background: #fff; border-left: 1px solid #ddd; padding: 20px; }
        .settings-pane label { display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px; color: #666; margin-top: 15px; }
        .settings-pane input, .settings-pane textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        .del-btn { width: 100%; margin-top: 30px; padding: 10px; background: #fee2e2; color: #b91c1c; border: none; border-radius: 4px; cursor: pointer; }

        .login-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f2f5; }
        .login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 320px; text-align: center; }
        .login-box input { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        .login-box button { width: 100%; padding: 12px; background: #ff4d4d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
      `}</style>
    </div>
  );
}
