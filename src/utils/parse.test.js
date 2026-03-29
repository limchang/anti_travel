import { describe, it, expect } from 'vitest';
import { parseBusinessHoursText, isLikelyParsedAddress, isLikelyMenuPriceLine, parseBulkPlaceText } from './parse.js';

describe('parseBusinessHoursText', () => {
  it('parses basic open/close times', () => {
    const result = parseBusinessHoursText('09:00 - 18:00');
    expect(result.open).toBe('09:00');
    expect(result.close).toBe('18:00');
  });

  it('parses break time', () => {
    const result = parseBusinessHoursText('09:00 - 21:00\n브레이크 15:00 - 17:00');
    expect(result.breakStart).toBe('15:00');
    expect(result.breakEnd).toBe('17:00');
  });

  it('parses last order', () => {
    const result = parseBusinessHoursText('라스트오더 20:30');
    expect(result.lastOrder).toBe('20:30');
  });

  it('parses closed days', () => {
    const result = parseBusinessHoursText('월요일 휴무');
    expect(result.closedDays).toContain('mon');
  });
});

describe('isLikelyParsedAddress', () => {
  it('detects Korean addresses', () => {
    expect(isLikelyParsedAddress('서울 강남구 역삼로 123')).toBe(true);
    expect(isLikelyParsedAddress('경남 통영시 도남로 110')).toBe(true);
  });

  it('rejects non-addresses', () => {
    expect(isLikelyParsedAddress('충남식당')).toBe(false);
    expect(isLikelyParsedAddress('맛있는 음식')).toBe(false);
  });
});

describe('isLikelyMenuPriceLine', () => {
  it('detects price lines', () => {
    expect(isLikelyMenuPriceLine('12,000원')).toBe(true);
    expect(isLikelyMenuPriceLine('8,500원')).toBe(true);
    expect(isLikelyMenuPriceLine('메뉴이름')).toBe(false);
  });
});

describe('parseBulkPlaceText', () => {
  it('parses place names', () => {
    const result = parseBulkPlaceText('청춘육개장\n거제씨월드');
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('청춘육개장');
    expect(result[1].name).toBe('거제씨월드');
  });

  it('parses name + address pairs', () => {
    const result = parseBulkPlaceText('통영식당\n경남 통영시 도남로 110');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('통영식당');
    expect(result[0].address).toContain('통영시');
  });

  it('handles empty input', () => {
    expect(parseBulkPlaceText('')).toEqual([]);
    expect(parseBulkPlaceText(null)).toEqual([]);
  });
});
