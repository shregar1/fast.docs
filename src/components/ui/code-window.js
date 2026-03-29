/** macOS-style window chrome + optional Try/Copy for home code samples */

export function codeWindowToolbar({ filename, codeId, showTryCopy = true }) {
  const actions = showTryCopy
    ? `<div class="flex items-center gap-2 flex-shrink-0">
        <button type="button" class="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors" style="background-color: var(--fm-text); color: var(--fm-bg);" onclick="window.copyHomeCodeTry('${codeId}')" aria-label="Copy quickstart and sample code">Try it</button>
        <button type="button" class="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors" style="background-color: var(--fm-surface); color: var(--fm-text); border: 1px solid var(--fm-border);" onmouseover="this.style.borderColor='var(--fm-border-hover)'" onmouseout="this.style.borderColor='var(--fm-border)'" onclick="window.copyHomeCodeRaw('${codeId}')" aria-label="Copy Python only">Copy</button>
      </div>`
    : '';

  return `
    <div class="flex items-center justify-between gap-3 flex-wrap px-4 py-3 border-b" style="background-color: var(--fm-surface-raised); border-color: var(--fm-border);">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-3 h-3 rounded-full bg-red-500/80 flex-shrink-0"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500/80 flex-shrink-0"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/80 flex-shrink-0"></div>
        <span class="ml-2 text-xs font-mono" style="color: var(--fm-text-muted);">${filename}</span>
      </div>
      ${actions}
    </div>`;
}

export function codeWindowCodeBlock({ codeId, code, wrapperClass = 'p-6 text-left overflow-x-auto' }) {
  return `
    <div class="${wrapperClass}">
      <pre class="text-sm font-mono leading-relaxed" style="color: var(--fm-text-secondary);"><code id="home-code-${codeId}" class="language-python">${code}</code></pre>
    </div>`;
}
