import {
  extractUTMFromURL,
  extractUTMFromQuery,
  extractUTMFromSearchParams,
  hasUTMParams,
  validateUTMParams,
  utmParamsToQueryString,
  UTMParams,
} from './utm';

describe('utm utils', () => {
  describe('extractUTMFromURL', () => {
    it('should extract all UTM parameters from URL', () => {
      const url = 'https://example.com?utm_source=email&utm_medium=newsletter&utm_campaign=spring_sale&utm_content=banner&utm_term=shoes';
      const result = extractUTMFromURL(url);
      
      expect(result).toEqual({
        utm_source: 'email',
        utm_medium: 'newsletter',
        utm_campaign: 'spring_sale',
        utm_content: 'banner',
        utm_term: 'shoes',
      });
    });

    it('should extract partial UTM parameters', () => {
      const url = 'https://example.com?utm_source=google&utm_medium=cpc';
      const result = extractUTMFromURL(url);
      
      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
      });
    });

    it('should return empty object when no UTM parameters', () => {
      const url = 'https://example.com?other=value';
      const result = extractUTMFromURL(url);
      
      expect(result).toEqual({});
    });

    it('should handle invalid URLs gracefully', () => {
      const result = extractUTMFromURL('not-a-url');
      expect(result).toEqual({});
    });

    it('should ignore non-UTM parameters', () => {
      const url = 'https://example.com?utm_source=email&other=value&foo=bar';
      const result = extractUTMFromURL(url);
      
      expect(result).toEqual({
        utm_source: 'email',
      });
    });
  });

  describe('extractUTMFromSearchParams', () => {
    it('should extract UTM parameters from URLSearchParams', () => {
      const searchParams = new URLSearchParams('utm_source=email&utm_medium=newsletter');
      const result = extractUTMFromSearchParams(searchParams);
      
      expect(result).toEqual({
        utm_source: 'email',
        utm_medium: 'newsletter',
      });
    });

    it('should return empty object when no UTM parameters', () => {
      const searchParams = new URLSearchParams('other=value');
      const result = extractUTMFromSearchParams(searchParams);
      
      expect(result).toEqual({});
    });
  });

  describe('extractUTMFromQuery', () => {
    it('should extract UTM parameters from query object', () => {
      const query = {
        utm_source: 'email',
        utm_medium: 'newsletter',
        other: 'value',
      };
      const result = extractUTMFromQuery(query);
      
      expect(result).toEqual({
        utm_source: 'email',
        utm_medium: 'newsletter',
      });
    });

    it('should handle array values (take first)', () => {
      const query = {
        utm_source: ['email', 'social'],
        utm_medium: 'newsletter',
      };
      const result = extractUTMFromQuery(query);
      
      expect(result).toEqual({
        utm_source: 'email',
        utm_medium: 'newsletter',
      });
    });

    it('should handle undefined values', () => {
      const query = {
        utm_source: 'email',
        utm_medium: undefined,
      };
      const result = extractUTMFromQuery(query);
      
      expect(result).toEqual({
        utm_source: 'email',
      });
    });

    it('should return empty object when no UTM parameters', () => {
      const query = {
        other: 'value',
      };
      const result = extractUTMFromQuery(query);
      
      expect(result).toEqual({});
    });
  });

  describe('hasUTMParams', () => {
    it('should return true when UTM parameters exist', () => {
      expect(hasUTMParams({ utm_source: 'email' })).toBe(true);
      expect(hasUTMParams({ utm_source: 'email', utm_medium: 'newsletter' })).toBe(true);
    });

    it('should return false when no UTM parameters', () => {
      expect(hasUTMParams({})).toBe(false);
    });
  });

  describe('validateUTMParams', () => {
    it('should not modify valid parameters', () => {
      const params: UTMParams = {
        utm_source: 'email',
        utm_medium: 'newsletter',
      };
      const result = validateUTMParams(params);
      
      expect(result).toEqual(params);
    });

    it('should truncate parameters exceeding max length', () => {
      const longString = 'a'.repeat(150);
      const params: UTMParams = {
        utm_source: longString,
        utm_medium: 'newsletter',
      };
      const result = validateUTMParams(params, 100);
      
      expect(result.utm_source).toHaveLength(100);
      expect(result.utm_medium).toBe('newsletter');
    });

    it('should handle empty parameters', () => {
      const result = validateUTMParams({});
      expect(result).toEqual({});
    });
  });

  describe('utmParamsToQueryString', () => {
    it('should convert UTM parameters to query string', () => {
      const params: UTMParams = {
        utm_source: 'email',
        utm_medium: 'newsletter',
      };
      const result = utmParamsToQueryString(params);
      
      expect(result).toBe('utm_source=email&utm_medium=newsletter');
    });

    it('should handle all UTM parameters', () => {
      const params: UTMParams = {
        utm_source: 'email',
        utm_medium: 'newsletter',
        utm_campaign: 'spring_sale',
        utm_content: 'banner',
        utm_term: 'shoes',
      };
      const result = utmParamsToQueryString(params);
      
      expect(result).toContain('utm_source=email');
      expect(result).toContain('utm_medium=newsletter');
      expect(result).toContain('utm_campaign=spring_sale');
      expect(result).toContain('utm_content=banner');
      expect(result).toContain('utm_term=shoes');
    });

    it('should return empty string for empty parameters', () => {
      const result = utmParamsToQueryString({});
      expect(result).toBe('');
    });

    it('should URL encode special characters', () => {
      const params: UTMParams = {
        utm_source: 'email campaign',
        utm_medium: 'news&letter',
      };
      const result = utmParamsToQueryString(params);
      
      expect(result).toContain('email+campaign');
      expect(result).toContain('news%26letter');
    });
  });
});
