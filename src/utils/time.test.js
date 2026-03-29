import { describe, it, expect } from 'vitest';
import { timeToMinutes, minutesToTime, normalizeBusiness, normalizeTimeToken, extractTimesFromText } from './time';

describe('timeToMinutes', () => {
  it('converts HH:MM to minutes', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('01:30')).toBe(90);
    expect(timeToMinutes('12:00')).toBe(720);
    expect(timeToMinutes('23:59')).toBe(1439);
  });

  it('handles edge cases', () => {
    expect(timeToMinutes('')).toBe(0);
    expect(timeToMinutes(null)).toBe(0);
    expect(timeToMinutes(undefined)).toBe(0);
  });
});

describe('minutesToTime', () => {
  it('converts minutes to HH:MM', () => {
    expect(minutesToTime(0)).toBe('00:00');
    expect(minutesToTime(90)).toBe('01:30');
    expect(minutesToTime(720)).toBe('12:00');
    expect(minutesToTime(1439)).toBe('23:59');
  });
});

describe('normalizeTimeToken', () => {
  it('normalizes HH:MM format', () => {
    expect(normalizeTimeToken('09:00')).toBe('09:00');
    expect(normalizeTimeToken('9:00')).toBe('09:00');
    expect(normalizeTimeToken('오전 9시')).toBe('09:00');
  });
});

describe('extractTimesFromText', () => {
  it('extracts times from text', () => {
    const times = extractTimesFromText('운영 09:00 - 18:00');
    expect(times.length).toBeGreaterThanOrEqual(2);
    expect(times[0]).toBe('09:00');
    expect(times[1]).toBe('18:00');
  });
});

describe('normalizeBusiness', () => {
  it('normalizes business hours object', () => {
    const result = normalizeBusiness({ open: '09:00', close: '18:00' });
    expect(result.open).toBe('09:00');
    expect(result.close).toBe('18:00');
  });

  it('handles empty input', () => {
    const result = normalizeBusiness({});
    expect(result.open).toBe('');
    expect(result.close).toBe('');
  });
});
