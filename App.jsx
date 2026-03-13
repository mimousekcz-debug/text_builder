import React, { useEffect, useState } from "react";

// --- IKONY ---
const Icons = {
  Move: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7-7 7 7M5 15l7 7 7-7"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
};

export default function ShoptetBuilder() {
  // Stav pro přihlášení
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });

  // Hlavní data aplikce
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Načtení z LocalStorage při startu
  useEffect(() => {
    const saved = localStorage.getItem("shoptet_projects");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProjects(parsed);
      if (parsed.length > 0) setActiveProjectId(parsed[0].id);
    }
  }, []);

  // Ukládání do LocalStorage při změně
  useEffect(() => {
    localStorage.setItem("shoptet_projects", JSON.stringify(projects));
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // --- FUNKCE PROJEKTŮ ---
  const createNewProject = () => {
    const name = prompt("Název nového projektu:");
    if (!name) return;
    const newProj = { id: crypto.randomUUID(), name, blocks: [] };
    setProjects([...projects, newProj]);
    setActiveProjectId(newProj.id);
  };

  const deleteProject = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Opravdu smazat celý projekt?")) {
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      if (activeProjectId === id) setActiveProjectId(filtered[0]?.id || null);
    }
  };

  // --- FUNKCE BLOKŮ ---
  const addBlock = (type) => {
    if (!activeProjectId) return alert("Nejdříve vytvořte nebo vyberte projekt.");
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      heading: type === 'faq' ? "Máte dotazy?" : "Nový nadpis",
      text: type === 'faq' ? "Rádi odpovíme." : "Zde napište váš text...",
      url: type === 'youtube' ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : "https://placehold.co/600x400?text=Obrazok",
    };
    
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, blocks: [...p.blocks, newBlock] } : p
    ));
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (patch) => {
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, ...patch } : b)
        };
      }
      return p;
    }));
  };

  const removeBlock = (id, e) => {
    e.stopPropagation();
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, blocks: p.blocks.filter(b => b.id !== id) } : p
    ));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const copyHTML = () => {
    if (!activeProject) return;
    let html = `<div class="st-container" style="max-width:800px; margin:0 auto; font-family:sans-serif;">\n`;
    activeProject.blocks.forEach(b => {
      if (b.type === 'text') html += `<div style="padding:20px; text-align:center;"><h2>${b.heading}</h2><p>${b.text}</p></div>\n`;
      if (b.type === 'image') html += `<img src="${b.url}" style="width:100%; border-radius:8px; margin:20px 0;" />\n`;
      if (b.type === 'youtube') html += `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${b.url.split('v=')[1]}" frameborder="0" allowfullscreen></iframe>\n`;
    });
    html += `</div>`;
    navigator.clipboard.writeText(html);
    alert("HTML exportováno do schránky!");
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="login-overlay">
        <div className="login-card">
          <h2>Přihlášení klienta</h2>
          <p>Vítejte v Shoptet Content Builderu</p>
          <input type="text" placeholder="E-mail" onChange={e => setUser({...user, email: e.target.value})} />
          <input type="password" placeholder="Heslo" onChange={e => setUser({...user, password: e.target.value})} />
          <button className="login-btn" onClick={() => setIsLoggedIn(true)}>Přihlásit se</button>
        </div>
      </div>
    );
  }

  // --- HLAVNÍ EDITOR ---
  return (
    <div className="app-container">
      {/* Horní lišta */}
      <header className="admin-header">
        <div className="header-left">
          <div className="status-dot" />
          <span className="test-alert">Testovací verze doplňku – Plná verze bez omezení je k zaplacení v sekci "Můj balíček"</span>
        </div>
        <div className="header-right">
          <button className="primary-btn" onClick={copyHTML}>Kontaktujte nás</button>
        </div>
      </header>

      <div className="editor-layout">
        {/* LEVÝ PANEL - PROJEKTY */}
        <aside className="projects-sidebar">
          <div className="sidebar-header">
            <h3>Projekty</h3>
            <button className="icon-add-btn" onClick={createNewProject}><Icons.Plus /></button>
          </div>
          <div className="project-list">
            {projects.map(p => (
              <div 
                key={p.id} 
                className={`project-item ${activeProjectId === p.id ? 'active' : ''}`}
                onClick={() => setActiveProjectId(p.id)}
              >
                <span>{p.name}</span>
                <button className="btn-del" onClick={(e) => deleteProject(p.id, e)}><Icons.Trash /></button>
              </div>
            ))}
          </div>
        </aside>

        {/* PROSTŘEDEK - PLOCHA */}
        <main className="canvas-area">
          <div className="toolbar-top">
            <button onClick={() => addBlock('text')}>Text</button>
            <button onClick={() => addBlock('image')}>Obrázek</button>
            <button onClick={() => addBlock('youtube')}>Video</button>
            <button onClick={() => addBlock('faq')}>Otázky a Odpovědi</button>
          </div>

          <div className="preview-window">
            <h1 className="preview-title">{activeProject?.name || "Vyberte projekt"}</h1>
            
            <div className="blocks-container">
              {activeProject?.blocks.map(b => (
                <div 
                  key={b.id} 
                  className={`canvas-block ${selectedBlockId === b.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBlockId(b.id)}
                >
                  <div className="block-actions">
                    <button onClick={(e) => removeBlock(b.id, e)}><Icons.Trash /></button>
                  </div>

                  {b.type === 'image' && (
                    <div className="img-placeholder">
                      <img src={b.url} alt="preview" />
                    </div>
                  )}

                  {b.type === 'text' || b.type === 'faq' ? (
                    <div className="text-preview">
                      <h4>{b.heading}</h4>
                      <p>{b.text}</p>
                    </div>
                  ) : null}

                  {b.type === 'youtube' && (
                     <div className="video-placeholder">
                        <img src={`https://img.youtube.com/vi/${b.url.split('v=')[1]}/0.jpg`} alt="yt" />
                        <div className="play-button" />
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* PRAVÝ PANEL - NASTAVENÍ */}
        <aside className="settings-sidebar">
          {selectedBlockId && activeProject ? (
            <div className="settings-content">
              <h3>Nastavení bloku</h3>
              <div className="input-group">
                <label>Nadpis</label>
                <input 
                  value={activeProject.blocks.find(b => b.id === selectedBlockId)?.heading || ""} 
                  onChange={e => updateBlock({ heading: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Popis / Text</label>
                <textarea 
                   rows="5"
                   value={activeProject.blocks.find(b => b.id === selectedBlockId)?.text || ""} 
                   onChange={e => updateBlock({ text: e.target.value })}
                />
              </div>
              {activeProject.blocks.find(b => b.id === selectedBlockId)?.url !== undefined && (
                <div className="input-group">
                  <label>URL média</label>
                  <input 
                    value={activeProject.blocks.find(b => b.id === selectedBlockId)?.url || ""} 
                    onChange={e => updateBlock({ url: e.target.value })}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">Vyberte blok pro úpravu parametrů</div>
          )}
        </aside>
      </div>

      <style>{`
        :root { --primary: #1a1b35; --accent: #ff4d4d; --bg: #fdfdfd; --border: #ececec; }
        body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: #333; }
        
        /* Login */
        .login-overlay { position: fixed; inset: 0; background: #f0f2f5; display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .login-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 350px; text-align: center; }
        .login-card input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;}
        .login-btn { width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 10px;}

        /* App Structure */
        .app-container { display: flex; flex-direction: column; height: 100vh; }
        .admin-header { height: 50px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
        .test-alert { color: #d32f2f; font-size: 12px; font-weight: 600; }
        
        .editor-layout { display: flex; flex: 1; overflow: hidden; }

        /* Sidebar Projects */
        .projects-sidebar { width: 220px; border-right: 1px solid var(--border); background: #fff; padding: 15px; }
        .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .project-item { padding: 10px; border-radius: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 14px; margin-bottom: 5px;}
        .project-item.active { background: var(--primary); color: white; }
        .project-item:hover:not(.active) { background: #f5f5f5; }
        .btn-del { background: transparent; border: none; color: inherit; cursor: pointer; opacity: 0.6; }

        /* Canvas Area */
        .canvas-area { flex: 1; background: #f9f9f9; display: flex; flex-direction: column; align-items: center; overflow-y: auto; padding: 20px; }
        .toolbar-top { background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; gap: 10px; margin-bottom: 30px; }
        .toolbar-top button { padding: 8px 16px; border: 1px solid var(--border); background: white; border-radius: 4px; cursor: pointer; font-size: 13px; }
        
        .preview-window { width: 100%; max-width: 650px; background: white; min-height: 800px; box-shadow: 0 0 40px rgba(0,0,0,0.03); padding: 40px; }
        .preview-title { text-align: center; font-size: 18px; margin-bottom: 40px; color: #888; text-transform: uppercase; letter-spacing: 1px;}

        /* Blocks */
        .canvas-block { position: relative; margin-bottom: 20px; border: 1px dashed transparent; transition: 0.2s; border-radius: 8px; overflow: hidden; }
        .canvas-block:hover { border-color: #4a90e2; }
        .canvas-block.selected { border: 2px solid #4a90e2; box-shadow: 0 0 15px rgba(74,144,226,0.1); }
        .block-actions { position: absolute; top: 10px; right: 10px; display: none; }
        .canvas-block:hover .block-actions { display: block; }
        .block-actions button { background: #ff4d4d; color: white; border: none; padding: 5px; border-radius: 4px; cursor: pointer; }

        .img-placeholder img { width: 100%; height: auto; display: block; background: #eee; }
        .text-preview { padding: 20px; text-align: center; }
        .video-placeholder { position: relative; background: #000; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; }
        .video-placeholder img { width: 100%; opacity: 0.6; }
        .play-button { position: absolute; width: 60px; height: 60px; background: rgba(255,0,0,0.8); border-radius: 50%; }

        /* Settings Sidebar */
        .settings-sidebar { width: 300px; border-left: 1px solid var(--border); background: #fff; padding: 20px; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #666; }
        .input-group input, .input-group textarea { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; font-family: inherit; }
        
        .primary-btn { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; }
        .empty-state { color: #ccc; text-align: center; margin-top: 100px; font-style: italic; }
      `}</style>
    </div>
  );
}
