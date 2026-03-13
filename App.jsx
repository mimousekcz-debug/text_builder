import React, { useEffect, useMemo, useState } from "react";
// import "./styles.css"; // Ujistěte se, že soubor existuje, nebo zakomentujte

// --- POMOCNÉ KOMPONENTY (Tyto v kódu chyběly) ---
const Button = ({ children, variant = "primary", size = "md", onClick, className = "", ...props }) => {
  const baseStyle = "builder-btn"; // Styly řešte v CSS
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variant} ${size} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Input = (props) => <input className="builder-input" {...props} />;
const Textarea = (props) => <textarea className="builder-textarea" {...props} />;

// --- POMOCNÉ FUNKCE (Ponecháno z vašeho kódu) ---
function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(str) {
  return (str || "blok")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function youtubeEmbed(url) {
  if (!url) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

function createDefaultTheme(brand = "mimousek") {
  const themes = {
    chrapatko: {
      brand,
      brandName: "Chrápátko",
      accent: "#007599",
      accentSoft: "#e6f6f8",
      text: "#1e293b",
      muted: "#64748b",
      bg: "#ffffff",
      cardBg: "#f8fafc",
      radius: "22px",
      buttonText: "#ffffff",
    },
    mimousek: {
      brand,
      brandName: "Mimoušek",
      accent: "#9d7a5f",
      accentSoft: "#f5f0f2",
      text: "#6e513a",
      muted: "#8b6a4d",
      bg: "#ffffff",
      cardBg: "#faf7f8",
      radius: "22px",
      buttonText: "#ffffff",
    }
  };
  return themes[brand] || themes.mimousek;
}

const blockCatalog = [
  { type: "benefitIcons3", label: "Výhody 3 ikony" },
  { type: "benefitIcons4", label: "Výhody 4 ikony" },
  { type: "textImage", label: "Text a obrázek" },
  { type: "text", label: "Text" },
  { type: "image", label: "Obrázek" },
  { type: "gallery", label: "Galerie" },
  { type: "faq", label: "Otázky a odpovědi" },
  { type: "columns", label: "Sloupce" },
  { type: "video", label: "Video" },
  { type: "table", label: "Tabulka" },
  { type: "ctaBanner", label: "CTA banner" },
];

function blockBase(type, title) {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    anchor: slugify(title),
    settings: {
      padding: "medium",
      rounded: true,
      background: "white",
      container: "default",
      border: false,
      shadow: false,
      hiddenOnMobile: false,
      customClass: "",
    },
  };
}

function createBenefitItem(title = "prémiová\nkvalita") {
  return {
    imageUrl: "https://placehold.co/180x180?text=Ikona",
    alt: "Ikona výhody",
    title,
  };
}

function createBlock(type) {
  const base = blockBase(type, blockCatalog.find(b => b.type === type)?.label || type);
  switch (type) {
    case "benefitIcons3":
      return { ...base, items: [createBenefitItem(), createBenefitItem(), createBenefitItem()] };
    case "benefitIcons4":
      return { ...base, items: [createBenefitItem(), createBenefitItem(), createBenefitItem(), createBenefitItem()] };
    case "textImage":
      return {
        ...base,
        heading: "Nadpis bloku",
        text: "Sem napište text produktu...",
        imageUrl: "https://placehold.co/900x900?text=Obrázek",
        imageAlt: "Produktová fotografie",
        imagePosition: "right",
        imageRatio: "square",
        buttonText: "Zjistit více",
        buttonLink: "#",
      };
    case "text":
      return { ...base, heading: "Textový blok", text: "Sem napište delší popis..." };
    case "video":
      return { ...base, heading: "Video", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Popis videa" };
    default:
      return base;
  }
}

function createTemplate(templateName) {
  if (templateName === "product") return [createBlock("benefitIcons4"), createBlock("textImage"), createBlock("video")];
  return [createBlock("text")];
}

function updateBlock(blocks, id, patch) {
  return blocks.map((block) => (block.id === id ? { ...block, ...patch } : block));
}

// --- RENDERING LOGIKA (Ponecháno) ---
function blockSectionStyles(settings, theme) {
  const paddingMap = { small: "16px", medium: "28px", large: "40px" };
  const backgroundMap = { white: theme.bg, muted: theme.cardBg, accentSoft: theme.accentSoft, transparent: "transparent" };
  return [
    `padding:${paddingMap[settings?.padding || "medium"]};`,
    `border-radius:${settings?.rounded ? theme.radius : "0px"};`,
    `background:${backgroundMap[settings?.background || "white"]};`,
    settings?.border ? "border:1px solid #e2e8f0;" : "border:none;",
    settings?.shadow ? "box-shadow:0 12px 30px rgba(15,23,42,.06);" : "box-shadow:none;",
  ].join("");
}

function blockOuterStyles(settings) {
  const containerMap = { default: "max-width:1200px;margin:0 auto;", narrow: "max-width:980px;margin:0 auto;", full: "max-width:100%;margin:0 auto;" };
  return containerMap[settings?.container || "default"];
}

function renderBlockHtml(block, theme) {
  const sectionStyle = blockSectionStyles(block.settings, theme);
  const outerStyle = blockOuterStyles(block.settings);
  const wrap = (inner) => `<section style="${outerStyle}"><div style="${sectionStyle}">${inner}</div></section>`;

  if (block.type === "text") {
    return wrap(`<h2>${escapeHtml(block.heading)}</h2><p>${escapeHtml(block.text)}</p>`);
  }
  // ... (další typy bloků by se doplnily dle původního vzoru)
  return wrap(`<div>Blok typu: ${block.type}</div>`);
}

function buildExportHtml(blocks, theme, includeCss = true) {
  return `<div class="eshop-export">${blocks.map((block) => renderBlockHtml(block, theme)).join("")}</div>`;
}

// --- KOMPONENTY ROZHRANÍ ---
function CatalogButton({ item, onAdd }) {
  return (
    <button onClick={() => onAdd(item.type)} className="builder-catalog-btn">
      {item.label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="builder-field">
      <label className="builder-label">{label}</label>
      {children}
    </div>
  );
}

function BlockSettings({ block, setBlocks, theme }) {
  const patchBlock = (patch) => setBlocks((prev) => updateBlock(prev, block.id, patch));
  if (!block) return <div className="builder-empty">Vyberte blok pro nastavení.</div>;

  return (
    <div className="builder-settings">
      <div className="builder-panel">
        <div className="builder-panel-title">Nastavení: {block.title}</div>
        <Field label="Nadpis">
          <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

// --- HLAVNÍ APLIKACE ---
export default function EshopTextBuilderPro() {
  const [projectName, setProjectName] = useState("produkt - CZ");
  const [pageType, setPageType] = useState("product");
  const [theme, setTheme] = useState(createDefaultTheme("mimousek"));
  const [includeCss, setIncludeCss] = useState(true);
  const [blocks, setBlocks] = useState(createTemplate("product"));
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");

  const selectedBlock = blocks.find((block) => block.id === selectedId) || null;
  const generatedHtml = useMemo(() => buildExportHtml(blocks, theme, includeCss), [blocks, theme, includeCss]);

  const addBlock = (type) => {
    const block = createBlock(type);
    setBlocks([...blocks, block]);
    setSelectedId(block.id);
  };

  return (
    <div className="builder-app">
      <div className="builder-shell">
        <header className="builder-hero">
          <h1>E-shop Content Builder</h1>
          <div className="builder-top-actions">
            <Button onClick={() => console.log(generatedHtml)}>Kopírovat HTML</Button>
          </div>
        </header>

        <div className="builder-layout" style={{ display: "flex", gap: "20px" }}>
          {/* LEVÝ SLOUPEC */}
          <div className="builder-left" style={{ width: "300px" }}>
            <div className="builder-panel">
              <Field label="Název projektu">
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </Field>
            </div>
            <div className="builder-panel">
              <div className="builder-panel-title">Přidat blok</div>
              {blockCatalog.map(item => (
                <CatalogButton key={item.type} item={item} onAdd={addBlock} />
              ))}
            </div>
          </div>

          {/* STŘEDNÍ SLOUPEC - NÁHLED */}
          <div className="builder-center" style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
            <div className="tabs">
              <button onClick={() => setActiveTab("preview")}>Náhled</button>
              <button onClick={() => setActiveTab("code")}>Kód</button>
            </div>
            {activeTab === "preview" ? (
              <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            ) : (
              <pre>{generatedHtml}</pre>
            )}
          </div>

          {/* PRAVÝ SLOUPEC - NASTAVENÍ */}
          <div className="builder-right" style={{ width: "300px" }}>
            <BlockSettings block={selectedBlock} setBlocks={setBlocks} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
