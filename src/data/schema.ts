import { z } from 'zod';

// Shape only. Whether the numbers are correct is checked by hand against the official notification.
const Spec = z.object({
  docType: z.enum(['photo', 'signature', 'thumb', 'certificate', 'class10', 'class12', 'graduation', 'id', 'category', 'pwbd', 'domicile', 'declaration', 'guardian', 'special', 'other']), required: z.boolean(),
  outputFormats: z.array(z.enum(['jpeg', 'png', 'webp', 'pdf'])).min(1),
  width: z.number().positive().optional(), height: z.number().positive().optional(), unit: z.enum(['px', 'mm', 'cm']).optional(), dpi: z.number().positive().optional(),
  minKB: z.number().nonnegative().optional(), maxKB: z.number().positive().optional(), sourceNote: z.string().optional(),
});
const Notification = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), examId: z.string(), examName: z.string(),
  category: z.enum(['ssc', 'upsc', 'banking', 'railway', 'defence', 'teaching', 'state']), state: z.string().optional(),
  cycle: z.string(), title: z.string(), status: z.enum(['verified', 'unverified', 'outdated']),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), published: z.string().optional(),
  siteUrl: z.string().url(), notificationUrl: z.string().url().nullable(), supersededBy: z.string().optional(),
  specs: z.array(Spec), note: z.string().optional(),
});
export const Notifications = z.array(Notification);
