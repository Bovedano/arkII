export interface MenuOptionSpec {
  action: string;
  label: string;
  locked?: boolean;
  /** Best recorded time, shown as a corner medal badge when the level is completed. */
  bestTime?: string;
}

export function renderMenuOption({ action, label, locked, bestTime }: MenuOptionSpec): string {
  const completed = bestTime !== undefined;
  const classes = ['menu-option', locked ? 'locked' : '', completed ? 'completed' : '']
    .filter(Boolean)
    .join(' ');
  const attr = locked ? '' : ` data-action="${action}"`;
  const badgeHtml = completed
    ? `<span class="menu-option-badge">✓</span><span class="menu-option-time">${bestTime}</span>`
    : '';
  return `<div class="${classes}"${attr}><span class="menu-option-label">${label}</span>${badgeHtml}</div>`;
}

export function wireMenuActions(root: Element, handlers: Record<string, () => void>): void {
  root.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    const action = target?.dataset.action;
    if (action && handlers[action]) handlers[action]();
  });
}
