/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import {
  LUCIDE_ICONS,
  TABLER_ICONS,
  HEROICONS,
  resolveHawkIcon,
} from '../src/hawk-icons.js';
import { HawkSearch } from '../src/hawk.js';

describe('hawk-icons adapter', () => {
  it('provides complete sets of standard icons for Lucide, Tabler, and Heroicons', () => {
    const requiredKeys = ['search', 'command', 'pin', 'clock', 'file'];
    for (const key of requiredKeys) {
      expect(LUCIDE_ICONS[key]).toContain('<svg');
      expect(TABLER_ICONS[key]).toContain('<svg');
      expect(HEROICONS[key]).toContain('<svg');
    }
  });

  it('resolves icons by library name identifier', () => {
    expect(resolveHawkIcon('lucide', 'search')).toBe(LUCIDE_ICONS.search);
    expect(resolveHawkIcon('tabler', 'pin')).toBe(TABLER_ICONS.pin);
    expect(resolveHawkIcon('heroicons', 'command')).toBe(HEROICONS.command);
    expect(resolveHawkIcon('lucide', 'nonexistent', '<fallback/>')).toBe('<fallback/>');
  });

  it('resolves icons with a custom map or resolver function', () => {
    const customMap = { search: '<svg id="custom-search"/>' };
    expect(resolveHawkIcon(customMap, 'search')).toBe('<svg id="custom-search"/>');

    const resolver = (name) => `<svg id="resolved-${name}"/>`;
    expect(resolveHawkIcon(resolver, 'clock')).toBe('<svg id="resolved-clock"/>');
  });

  it('can be injected directly into HawkSearch config.trigger.icon', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    const hawk = new HawkSearch({
      pagefind: { search: () => Promise.resolve({ results: [] }) },
      trigger: {
        container: host,
        icon: resolveHawkIcon('lucide', 'search'),
      },
    });

    const triggerIcon = host.querySelector('.hawk-trigger svg.hawk-trigger-icon');
    expect(triggerIcon).toBeTruthy();
    expect(triggerIcon.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(triggerIcon.getAttribute('stroke-width')).toBe('2');

    hawk.destroy();
    host.remove();
  });
});
