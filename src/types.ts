import { z } from 'zod';

// Hazard types for domestic SIGMETs
export const DomesticHazardSchema = z.enum(['conv', 'turb', 'ice', 'ifr']);
export type DomesticHazard = z.infer<typeof DomesticHazardSchema>;

// Hazard types for international SIGMETs
export const InternationalHazardSchema = z.enum(['turb', 'ice']);
export type InternationalHazard = z.infer<typeof InternationalHazardSchema>;

// Date format schema
export const DateSchema = z.string().regex(/^\d{8}_\d{6}Z$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
export type DateString = z.infer<typeof DateSchema>;

// Flight level schema
export const FlightLevelSchema = z.number().min(0).max(600);
export type FlightLevel = z.infer<typeof FlightLevelSchema>;

// API response schemas
export const SigmetResponseSchema = z.object({
  data: z.array(z.any()), // The actual SIGMET data structure
  results: z.number().optional(),
  total: z.number().optional(),
});

export type SigmetResponse = z.infer<typeof SigmetResponseSchema>;

// Tool parameter schemas
export const GetDomesticSigmetsParamsSchema = z.object({
  hazard: DomesticHazardSchema.optional(),
  level: FlightLevelSchema.optional(),
  date: DateSchema.optional(),
  humanReadable: z.boolean().optional(),
});

export const GetInternationalSigmetsParamsSchema = z.object({
  hazard: InternationalHazardSchema.optional(),
  level: FlightLevelSchema.optional(),
  date: DateSchema.optional(),
  humanReadable: z.boolean().optional(),
});

export type GetDomesticSigmetsParams = z.infer<typeof GetDomesticSigmetsParamsSchema>;
export type GetInternationalSigmetsParams = z.infer<typeof GetInternationalSigmetsParamsSchema>; 