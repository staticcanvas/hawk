/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import {
  createHawkAnimationTypeflow,
  HawkAnimationTypeflow,
} from '../src/hawk-animation-typeflow.js';

function mockTypeFlow() {
  return { type: vi.fn(), rotate: vi.fn() };
}

describe('createHawkAnimationTypeflow', () => {
  it('ships a ready-to-use driver backed by the official TypeFlow package', () => {
    expect(HawkAnimationTypeflow).toEqual(
      expect.objectContaining({
        typeTitle: expect.any(Function),
        typeContent: expect.any(Function),
        rotatePlaceholder: expect.any(Function),
        stop: expect.any(Function),
      })
    );
  });
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
      expect.objectContaining({
        respectReducedMotion: true,
        allowedTags: expect.arrayContaining(['div', 'h1', 'h6', 'details', 'figure']),
      })
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

  it('forwards extended TypeFlow reveal styles to every animated surface', () => {
    const TypeFlow = mockTypeFlow();
    const driver = createHawkAnimationTypeflow(TypeFlow, {
      title: { typeStyle: 'word-fade', direction: 'center' },
      anchorTitle: { typeStyle: 'zoom-in-space', wordOrder: 'random' },
      content: { typeStyle: 'float-in-bottom', wordMotionDistance: 18 },
      rotate: {
        typeConfig: { typeStyle: 'fade-trail' },
        eraseConfig: { eraseStyle: 'float-in-top' },
      },
    });
    const el = document.createElement('div');

    driver.typeTitle(el, 'Page title');
    driver.typeTitle(el, 'Section title', { isAnchor: true });
    driver.typeContent(el, '<p>Preview</p>');
    driver.rotatePlaceholder(el, ['Search guides', 'Search API']);

    expect(TypeFlow.type).toHaveBeenNthCalledWith(
      1,
      el,
      'Page title',
      expect.objectContaining({ typeStyle: 'word-fade', direction: 'center' })
    );
    expect(TypeFlow.type).toHaveBeenNthCalledWith(
      2,
      el,
      'Section title',
      expect.objectContaining({ typeStyle: 'zoom-in-space', wordOrder: 'random' })
    );
    expect(TypeFlow.type).toHaveBeenNthCalledWith(
      3,
      el,
      '<p>Preview</p>',
      expect.objectContaining({ typeStyle: 'float-in-bottom', wordMotionDistance: 18 })
    );
    expect(TypeFlow.rotate).toHaveBeenCalledWith(
      el,
      ['Search guides', 'Search API'],
      expect.objectContaining({
        typeConfig: expect.objectContaining({ typeStyle: 'fade-trail', speed: 2 }),
        eraseConfig: expect.objectContaining({ eraseStyle: 'float-in-top', speed: 2 }),
      })
    );
  });
});
