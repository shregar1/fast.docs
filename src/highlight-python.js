import { createHighlighter } from 'shiki';

let highlighterPromise = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vitesse-dark', 'vitesse-light'],
      langs: ['python', 'bash', 'sh', 'json', 'sql', 'yaml', 'toml', 'markdown', 'javascript', 'typescript'],
    });
  }
  return highlighterPromise;
}

/**
 * Enhanced highlighting using Shiki.
 * Detects language from class (e.g. language-python).
 * Supports dual themes (dark/light) via CSS variables.
 */
export async function highlightCode(root = document) {
  const highlighter = await getHighlighter();
  const blocks = root.querySelectorAll(
    'pre code:not([data-shiki-highlight="1"]):not([data-fm-no-shiki="1"])'
  );
  
  for (const block of blocks) {
    // Only highlight if it has a class starting with 'language-' or 'python'
    const classList = Array.from(block.classList);
    const langMatch = classList.find(c => c.startsWith('language-')) || classList.find(c => c === 'python');
    
    if (!langMatch) continue;

    const lang = langMatch.replace('language-', '');
    const code = block.textContent.trim();
    if (!code) continue;

    try {
      const html = highlighter.codeToHtml(code, {
        lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
        // Dual themes: vitesse-dark as primary, vitesse-light as alternative
        themes: {
          light: 'vitesse-light',
          dark: 'vitesse-dark',
        },
        // Don't set a default color on the pre, we manage it in style.css
        defaultColor: false,
      });

      // Shiki returns a full <pre>...</pre>. 
      // We want to replace the existing pre/code or just update the content.
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const shikiPre = tempDiv.firstChild;
      
      if (shikiPre) {
        shikiPre.classList.add('fm-shiki-container');
        const originalPre = block.closest('pre');
        if (originalPre) {
          originalPre.parentNode.replaceChild(shikiPre, originalPre);
          const newCode = shikiPre.querySelector('code');
          if (newCode) newCode.dataset.shikiHighlight = '1';
        }
      }
    } catch (err) {
      console.warn('Shiki highlighting failed for block:', err);
    }
  }
}
