import mermaid from 'mermaid';

function mermaidTheme() {
  return document.documentElement.classList.contains('light') ? 'neutral' : 'dark';
}

/**
 * Renders Mermaid diagrams inside #fm-architecture-section (architecture page).
 */
export async function initHomeArchitectureDiagrams() {
  const root = document.getElementById('fm-architecture-section');
  if (!root) return;

  const nodes = root.querySelectorAll('pre.mermaid');
  if (!nodes.length) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme(),
    securityLevel: 'strict',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  });

  await mermaid.run({ nodes: [...nodes] });
}
