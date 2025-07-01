import { AviationWeatherApiClient } from '../src/api-client';
import { makeSigmetHumanReadable } from '../src/utils';

describe('AviationWeatherApiClient', () => {
  let client: AviationWeatherApiClient;

  beforeAll(() => {
    client = new AviationWeatherApiClient();
  });

  describe('Domestic SIGMETs', () => {
    it('fetches domestic SIGMETs for today', async () => {
      const params = { date: new Date().toISOString().slice(0,10).replace(/-/g, '') + '_000000Z' };
      const domesticSigmets = await client.getDomesticSigmets(params);
      expect(Array.isArray(domesticSigmets)).toBe(true);
      if (domesticSigmets.length > 0) {
        const pretty = makeSigmetHumanReadable(domesticSigmets[0]);
        console.log(pretty);
        expect(pretty).toHaveProperty('validTimeFrom');
      }
    });

    it('fetches domestic SIGMETs with filters', async () => {
      const filterParams = { hazard: 'turb' as const, level: 300 };
      const filteredSigmets = await client.getDomesticSigmets(filterParams);
      expect(Array.isArray(filteredSigmets)).toBe(true);
    });
  });

  describe('International SIGMETs', () => {
    it('fetches international SIGMETs', async () => {
      const internationalSigmets = await client.getInternationalSigmets();
      expect(Array.isArray(internationalSigmets)).toBe(true);
      if (internationalSigmets.length > 0) {
        const pretty = makeSigmetHumanReadable(internationalSigmets[0]);
        expect(pretty).toHaveProperty('validTimeFrom');
      }
    });
  });

  describe('Invalid Parameter Handling', () => {
    it('throws on invalid hazard for domestic', async () => {
      await expect(client.getDomesticSigmets({ hazard: 'invalid' as any })).rejects.toThrow();
    });
    it('throws on invalid level for domestic', async () => {
      await expect(client.getDomesticSigmets({ level: 1000 })).rejects.toThrow();
    });
    it('throws on invalid hazard for international', async () => {
      await expect(client.getInternationalSigmets({ hazard: 'invalid' as any })).rejects.toThrow();
    });
    it('throws on invalid level for international', async () => {
      await expect(client.getInternationalSigmets({ level: 1000 })).rejects.toThrow();
    });
  });
}); 