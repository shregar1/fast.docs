/** macOS-style window chrome + optional Try/Copy for home code samples */

export function codeWindowToolbar({
  filename,
  codeId,
  showTryCopy = true,
  showControllerToggle = false,
}) {
  const controllerToggle = showControllerToggle
    ? `<div class="inline-flex rounded-lg p-0.5 border" style="border-color: var(--fm-border); background: var(--fm-bg);" role="group" aria-label="Controller style">
        <button type="button" class="fm-hero-ctrl-tab px-2.5 py-1 text-xs font-medium rounded-md fm-hero-ctrl-tab-active" data-fm-ctrl-block="${codeId}" data-fm-ctrl-mode="class" onclick="window.setHomeCodeControllerMode('${codeId}', 'class')">Classes</button>
        <button type="button" class="fm-hero-ctrl-tab px-2.5 py-1 text-xs font-medium rounded-md" data-fm-ctrl-block="${codeId}" data-fm-ctrl-mode="function" onclick="window.setHomeCodeControllerMode('${codeId}', 'function')">Functions</button>
      </div>`
    : '';

  const actions = showTryCopy
    ? `<div class="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
        ${controllerToggle}
        <button type="button" class="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors" style="background-color: var(--fm-text); color: var(--fm-bg);" onclick="window.copyHomeCodeTry('${codeId}')" aria-label="Copy quickstart and sample code">Try it</button>
        <button type="button" class="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors" style="background-color: var(--fm-surface); color: var(--fm-text); border: 1px solid var(--fm-border);" onmouseover="this.style.borderColor='var(--fm-border-hover)'" onmouseout="this.style.borderColor='var(--fm-border)'" onclick="window.copyHomeCodeRaw('${codeId}')" aria-label="Copy Python only">Copy</button>
      </div>`
    : controllerToggle
      ? `<div class="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">${controllerToggle}</div>`
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
      <pre class="text-sm font-mono leading-relaxed" style="color: var(--fm-text-secondary);"><code id="home-code-${codeId}" class="language-python" data-fm-no-shiki="1">${code}</code></pre>
    </div>`;
}
