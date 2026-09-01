/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { createHawkAnimationTypeflow } from '../src/hawk-animation-typeflow.js';

function mockTypeFlow() {
  return { type: vi.fn(), rotate: vi.fn() };
}

describe('createHawkAnimationTypeflow', () => {
  it('respects prefers-reduced-motion by default for titles, content, and placeholder rotation', () => {
    const TypeFlow = mockTypeFlow();
    const driver = createHawkAnimationTypeflow(TypeFlow);
    const el = document.createElement('div');

    driver.typeTitle(el, 'Plain title');
    driver.typeTitle(el, 'Anchor title', { isAnchor: true });
    driver.typeContent(el, '<p>content</p>');
    driver.rotatePlaceholder(el, ['a', 'b']);

    expect(TypeFlow.type).toHaveBeenNthCalledWith(
      1,
      el,
      'Plain title',
      expect.objectContaining({ respectReducedMotion: true })
    );
    expect(TypeFlow.type).toHaveBeenNthCalledWith(
      2,
      el,
      'Anchor title',
      expect.objectContaining({ respectReducedMotion: true, typeStyle: 'scramble' })
    );
    expect(TypeFlow.type).toHaveBeenNthCalledWith(
      3,
      el,
      '<p>content</p>',
      expect.objectContaining({ respectReducedMotion: true })
    );
    expect(TypeFlow.rotate).toHaveBeenCalledWith(
      el,
      ['a', 'b'],
      expect.objectContaining({ respectReducedMotion: true })
    );
  });

  it('an explicit options override still wins over the respectReducedMotion default', () => {
    const TypeFlow = mockTypeFlow();
    const driver = createHawkAnimationTypeflow(TypeFlow, {
      title: { respectReducedMotion: false },
    });
    driver.typeTitle(document.createElement('div'), 'x');
    expect(TypeFlow.type).toHaveBeenCalledWith(
      expect.anything(),
      'x',
      expect.objectContaining({ respectReducedMotion: false })
    );
  });
});
