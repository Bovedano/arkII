export interface MenuOptionSpec {
  action: string;
  label: string;
  locked?: boolean;
  /** Optional trailing text, e.g. a completed checkmark + best time. */
  suffix?: string;
}

export function renderMenuOption({ action, label, locked, suffix }: MenuOptionSpec): string {
  const classes = ['menu-option', locked ? 'locked' : ''].filter(Boolean).join(' ');
  const attr = locked ? '' : ` data-action="${action}"`;
  const suffixHtml = suffix ? ` <span class="menu-option-suffix">${suffix}</span>` : '';
  return `<div class="${classes}"${attr}>${label}${suffixHtml}</div>`;
}

export function wireMenuActions(root: Element, handlers: Record<string, () => void>): void {
  root.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    const action = target?.dataset.action;
    if (action && handlers[action]) handlers[action]();
  });
}
