export interface MenuOptionSpec {
  action: string;
  label: string;
  locked?: boolean;
}

export function renderMenuOption({ action, label, locked }: MenuOptionSpec): string {
  const classes = ['menu-option', locked ? 'locked' : ''].filter(Boolean).join(' ');
  const attr = locked ? '' : ` data-action="${action}"`;
  return `<div class="${classes}"${attr}>${label}</div>`;
}

export function wireMenuActions(root: Element, handlers: Record<string, () => void>): void {
  root.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    const action = target?.dataset.action;
    if (action && handlers[action]) handlers[action]();
  });
}
