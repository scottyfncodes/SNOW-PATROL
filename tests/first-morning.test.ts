import { describe, expect, it } from 'vitest';
import { newRun } from '../src/missions/runner';
import { complete, firstRun, newProfile, routeGuided } from '../src/progress/profile';

/**
 * The first morning on patrol: dispatch sends you to the mission table for Morning Rounds, and the
 * first ride goes up the pass road. The compass points straight at the weather station, over slopes
 * the sled cannot climb, so on that first ride the route line shows the road even with the assist off.
 */
describe('first morning', () => {
  it('a new patrol is a first run until Morning Rounds is finished', () => {
    const p = newProfile();
    expect(firstRun(p)).toBe(true);
    complete(p, 'rounds');
    expect(firstRun(p)).toBe(false);
  });

  it('the route line shows on the first Morning Rounds with the assist off', () => {
    const p = newProfile();
    expect(p.settings.routeLine).toBe(false);
    expect(routeGuided(p)).toBe(false); // nothing taken yet: no line
    p.active = newRun('rounds');
    expect(routeGuided(p)).toBe(true);
  });

  it('after the first Morning Rounds the line follows the setting again', () => {
    const p = newProfile();
    complete(p, 'rounds');
    p.active = newRun('rounds');
    expect(routeGuided(p)).toBe(false);
    p.settings.routeLine = true;
    expect(routeGuided(p)).toBe(true);
  });

  it('other calls follow the setting, first run or not', () => {
    const p = newProfile();
    p.active = newRun('survey');
    expect(routeGuided(p)).toBe(false);
    p.settings.routeLine = true;
    expect(routeGuided(p)).toBe(true);
  });
});
