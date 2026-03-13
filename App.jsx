import React, { useEffect, useState } from "react";

const Icons = {
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
};

export default function ShoptetBuilderPro() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Načtení z LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("shoptet_pro_builder");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProjects(parsed);
      if (parsed.length > 0) setActiveProjectId(parsed[0].id);
    }
  }, []);

  // Automatické ukládání
  useEffect(() => {
    localStorage.setItem("shoptet_pro_builder", JSON.stringify(projects));
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const createProject = () => {
    const name = prompt("Název nového projektu:");
    if (!name) return;
    const newProj = { id: crypto.randomUUID(), name, blocks: [] };
    setProjects([...projects, newProj]);
    setActiveProjectId(newProj.id);
  };

  const deleteProject = (id) => {
    if (window.confirm("Opravdu smazat celý projekt?")) {
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      if (activeProjectId === id) setActiveProjectId(filtered[0]?.id || null);
    }
  };

  const addBlock = (type) => {
    if (!activeProjectId) return alert("Nejdříve vytvořte nebo vyberte projekt.");
    const id = crypto.randomUUID();
    const defaults = {
      heading: "Nový blok",
      text: "Zde upravte text bloku pro váš e-shop.",
      url: type === 'youtube' ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : "https://placehold.co/600x400",
      btnText: "Více informací",
      faq: [{ q: "Nová otázka?", a: "Tady je odpověď." }]
    };

    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, blocks: [...p.blocks, { id, type, ...defaults }] } : p
    ));
    setSelectedBlockId(id);
  };

  const updateBlock = (patch) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? {
      ...p, blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, ...patch } : b)
    } : p));
  };

  const copyHTML = () => {
    if (!activeProject) return;
    let html = `\n<div class="shoptet-custom-content" style="max-width:1200px; margin:0 auto; font-family:sans-serif;">\n`;
    
    activeProject.blocks.forEach(b => {
      const styleInner = "padding: 20px 0;";
      switch(b.type) {
        case 'heading': html += `<h2 style="text-align:center; font-size:2rem; margin:40px 0;">${b.heading}</h2>\n`; break;
        case 'text': html += `<div style="${styleInner} line-height:1.7;">${b.text}</div>\n`; break;
        case 'image': html += `<img src="${b.url}" style="width:100%; height:auto; border-radius:8px; margin:20px 0;" alt="${b.heading}">\n`; break;
        case 'youtube': html += `<div style="position:relative; padding-bottom:56.25%; height:0; margin:30px 0;"><iframe src="${b.url}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0; border-radius:8px;" allowfullscreen></iframe></div>\n`; break;
        case 'cta': html += `<div style="text-align:center; background:#f4f4f4; padding:50px; border-radius:15px; margin:30px 0;"><h3>${b.heading}</h3><a href="${b.url}" style="display:inline-block; background:#000; color:#fff; padding:15px 35px; text-decoration:none; border-radius:5px; font-weight:bold;">${b.btnText}</a></div>\n`; break;
        case 'faq': 
          html += `<div style="margin:30px 0;">${b.faq.map(f => `<div style="border-bottom:1px solid #eee; padding:15px 0;"><strong>${f.q}</strong><p>${f.a}</p></div>`).join('')}</div>\n`; 
          break;
        default: break;
      }
    });
    
    html += `</div>`;
    navigator.clipboard.writeText(html);
    alert("Kód byl zkopírován! Nyní ho vložte do Shoptetu (HTML editoru).");
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>Pro Editor v1.0</h2>
          <p>Přihlášení do administrační sekce</p>
          <input type="text" placeholder="Admin" defaultValue="admin" />
          <input type="password" placeholder="Heslo" defaultValue="****" />
          <button onClick={() => setIsLoggedIn(true)}>Vstoupit</button>
        </div>
      </div>
    );
  }

  const selectedBlock = activeProject?.blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="builder-root">
      {/* Horní lišta s projekty */}
      <header className="top-nav">
        <div className="project-selector">
          <select value={activeProjectId || ""} onChange={(e) => setActiveProjectId(e.target.value)}>
            <option value="" disabled>Vyberte projekt...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="icon-btn" onClick={createProject} title="Nový projekt"><Icons.Plus /></button>
          {activeProjectId && <button className="icon-btn del" onClick={() => deleteProject(activeProjectId)}><Icons.Trash /></button>}
        </div>
        <div className="actions">
          <button className="export-btn" onClick={copyHTML}>Kopírovat HTML do Shoptetu</button>
        </div>
      </header>

      <div className="editor-main">
        {/* Widget Panel */}
        <aside className="widget-bar">
          <h3>Knihovna prvků</h3>
          <div className="widget-grid">
            {['heading', 'text', 'image', 'youtube', 'faq', 'cta'].map(type => (
              <button key={type} onClick={() => addBlock(type)}>
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </aside>

        {/* Live Preview Canvas */}
        <main className="canvas">
          <div className="preview-container">
            {!activeProject && <div className="empty-state">Vytvořte projekt pro začátek práce</div>}
            {activeProject?.blocks.map(b => (
              <div 
                key={b.id} 
                className={`block-view ${selectedBlockId === b.id ? 'active' : ''}`} 
                onClick={() => setSelectedBlockId(b.id)}
              >
                <div className="block-label">{b.type}</div>
                {b.type === 'heading' && <h2>{b.heading}</h2>}
                {b.type === 'text' && <div dangerouslySetInnerHTML={{ __html: b.text.replace(/\n/g, '<br/>') }} />}
                {b.type === 'image' && <img src={b.url} style={{maxWidth:'100%'}} alt="Preview" />}
                {b.type === 'youtube' && <div className="video-placeholder">Video: {b.url}</div>}
                {b.type === 'cta' && <div className="cta-preview"><h3>{b.heading}</h3><button>{b.btnText}</button></div>}
                {b.type === 'faq' && <div className="faq-preview">{b.faq.length} otázek</div>}
              </div>
            ))}
          </div>
        </main>

        {/* Pravý Settings Panel */}
        <aside className="settings-bar">
          {selectedBlock ? (
            <div className="settings-pane">
              <h3>Nastavení: {selectedBlock.type}</h3>
              <hr />
              
              <label>Hlavní text / Nadpis</label>
              <input value={selectedBlock.heading} onChange={e => updateBlock({heading: e.target.value})} />
              
              <label>Obsah (Text / HTML)</label>
              <textarea rows={6} value={selectedBlock.text} onChange={e => updateBlock({text: e.target.value})} />

              {['image', 'youtube', 'cta'].includes(selectedBlock.type) && (
                <>
                  <label>URL (Odkaz / Zdroj)</label>
                  <input value={selectedBlock.url} onChange={e => updateBlock({url: e.target.value})} />
                </>
              )}

              {selectedBlock.type === 'cta' && (
                <>
                  <label>Text tlačítka</label>
                  <input value={selectedBlock.btnText} onChange={e => updateBlock({btnText: e.target.value})} />
                </>
              )}

              <button className="del-btn" onClick={() => {
                setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, blocks: p.blocks.filter(x => x.id !== selectedBlockId)} : p));
                setSelectedBlockId(null);
              }}>Smazat tento blok</button>
            </div>
          ) : <div className="empty-msg">Klikněte na blok pro editaci</div>}
        </aside>
      </div>

      <style>{`
        .builder-root { height: 100vh; display: flex; flex-direction: column; background: #eff2f5; font-family: 'Inter', sans-serif; }
        .top-nav { background: #1a1d21; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .project-selector { display: flex; gap: 10px; align-items: center; }
        .project-selector select { background: #2c313a; color: white; border: 1px solid #444; padding: 6px; border-radius: 4px; }
        .icon-btn { background: #3e4451; color: white; border: none; width: 32px; height: 32px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .icon-btn.del:hover { background: #e02424; }
        .export-btn { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
        
        .editor-main { display: flex; flex: 1; overflow: hidden; }
        .widget-bar { width: 220px; background: white; border-right: 1px solid #d1d5db; padding: 20px; }
        .widget-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 15px; }
        .widget-grid button { padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: left; font-weight: 500; transition: all 0.2s; }
        .widget-grid button:hover { border-color: #2563eb; background: #eff6ff; }

        .canvas { flex: 1; padding: 40px; overflow-y: auto; background: #f1f5f9; display: flex; justify-content: center; }
        .preview-container { width: 100%; max-width: 900px; background: white; min-height: 100%; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .block-view { position: relative; border: 2px solid transparent; padding: 15px; margin-bottom: 5px; cursor: pointer; }
        .block-view:hover { border-color: #cbd5e1; border-style: dashed; }
        .block-view.active { border-color: #2563eb; border-style: solid; background: #f8faff; }
        .block-label { position: absolute; top: -10px; right: 10px; background: #2563eb; color: white; font-size: 10px; padding: 2px 8px; border-radius: 10px; }

        .settings-bar { width: 320px; background: white; border-left: 1px solid #d1d5db; padding: 20px; overflow-y: auto; }
        .settings-pane label { display: block; margin-top: 15px; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 5px; }
        .settings-pane input, .settings-pane textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; }
        .del-btn { width: 100%; margin-top: 40px; padding: 12px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; cursor: pointer; }
        
        .cta-preview { text-align: center; padding: 20px; background: #f1f5f9; border-radius: 8px; }
        .cta-preview button { background: #1e293b; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-top: 10px; }
        .video-placeholder { background: #000; color: white; padding: 40px; text-align: center; border-radius: 8px; font-size: 12px; }
        
        .login-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a1d21; }
        .login-box { background: white; padding: 40px; border-radius: 12px; width: 350px; text-align: center; }
        .login-box input { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; }
        .login-box button { width: 100%; padding: 14px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
        .empty-state { color: #94a3b8; text-align: center; margin-top: 100px; font-size: 18px; }
      `}</style>
    </div>
  );
}
