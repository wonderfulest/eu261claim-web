import { anonymizeIP, anonymizeIPv4, anonymizeIPv6, extractAndAnonymizeIP } from './anonymize';

describe('anonymize utils', () => {
  describe('anonymizeIPv4', () => {
    it('should anonymize valid IPv4 addresses', () => {
      expect(anonymizeIPv4('192.168.1.100')).toBe('192.168.1.0');
      expect(anonymizeIPv4('10.0.0.1')).toBe('10.0.0.0');
      expect(anonymizeIPv4('172.16.254.1')).toBe('172.16.254.0');
      expect(anonymizeIPv4('8.8.8.8')).toBe('8.8.8.0');
    });

    it('should throw error for invalid IPv4 addresses', () => {
      expect(() => anonymizeIPv4('192.168.1')).toThrow('Invalid IPv4 address format');
      expect(() => anonymizeIPv4('192.168.1.256')).toThrow('Invalid IPv4 address format');
      expect(() => anonymizeIPv4('invalid')).toThrow('Invalid IPv4 address format');
      expect(() => anonymizeIPv4('192.168.-1.1')).toThrow('Invalid IPv4 address format');
    });
  });

  describe('anonymizeIPv6', () => {
    it('should anonymize valid IPv6 addresses', () => {
      const result = anonymizeIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      expect(result).toBe('2001:0db8:85a3:0000::');
    });

    it('should throw error for invalid IPv6 addresses', () => {
      expect(() => anonymizeIPv6('invalid')).toThrow('Invalid IPv6 address format');
      expect(() => anonymizeIPv6('12')).toThrow('Invalid IPv6 address format');
    });
  });

  describe('anonymizeIP', () => {
    it('should auto-detect and anonymize IPv4', () => {
      expect(anonymizeIP('192.168.1.100')).toBe('192.168.1.0');
      expect(anonymizeIP('10.0.0.1')).toBe('10.0.0.0');
    });

    it('should auto-detect and anonymize IPv6', () => {
      const result = anonymizeIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      expect(result).toBe('2001:0db8:85a3:0000::');
    });

    it('should return null for invalid input', () => {
      expect(anonymizeIP(null)).toBeNull();
      expect(anonymizeIP(undefined)).toBeNull();
      expect(anonymizeIP('')).toBeNull();
      expect(anonymizeIP('invalid')).toBeNull();
    });
  });

  describe('extractAndAnonymizeIP', () => {
    it('should extract from x-forwarded-for header', () => {
      const headers = {
        'x-forwarded-for': '192.168.1.100, 10.0.0.1',
      };
      expect(extractAndAnonymizeIP(headers)).toBe('192.168.1.0');
    });

    it('should extract from x-real-ip header', () => {
      const headers = {
        'x-real-ip': '192.168.1.100',
      };
      expect(extractAndAnonymizeIP(headers)).toBe('192.168.1.0');
    });

    it('should use remoteAddress as fallback', () => {
      const headers = {};
      expect(extractAndAnonymizeIP(headers, '192.168.1.100')).toBe('192.168.1.0');
    });

    it('should handle array headers', () => {
      const headers = {
        'x-forwarded-for': ['192.168.1.100', '10.0.0.1'],
      };
      expect(extractAndAnonymizeIP(headers)).toBe('192.168.1.0');
    });

    it('should return null when no IP available', () => {
      const headers = {};
      expect(extractAndAnonymizeIP(headers)).toBeNull();
    });
  });
});
