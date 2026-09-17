import { z } from 'zod';

// Contact/Inquiry Form
export const InquiryFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  service: z.string()
    .min(1, 'Please select a service')
    .max(100, 'Service must be less than 100 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  budget: z.string()
    .optional()
    .or(z.literal('')),
  timeline: z.string()
    .optional()
    .or(z.literal('')),
});

export type InquiryFormData = z.infer<typeof InquiryFormSchema>;

// Venture Studio Submission
export const VentureSubmissionSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(150, 'Company name must be less than 150 characters'),
  industry: z.string()
    .min(1, 'Please select an industry'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  stage: z.enum(['idea', 'mvp', 'beta', 'launched', 'scaling'], {
    message: 'Please select a valid funding stage'
  }),
  fundingAmount: z.number()
    .positive('Funding amount must be positive')
    .optional()
    .or(z.literal(0)),
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  linkedIn: z.string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  additionalInfo: z.string()
    .max(1000, 'Additional info must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type VentureSubmissionData = z.infer<typeof VentureSubmissionSchema>;

// Early Access Signup
export const EarlyAccessSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  lastName: z.string()
    .max(50, 'Last name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  interests: z.array(z.string()).optional(),
});

export type EarlyAccessData = z.infer<typeof EarlyAccessSchema>;

// Chat/Message Validation
export const ChatMessageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message must be less than 10000 characters'),
  sessionId: z.string()
    .uuid('Invalid session ID'),
});

export type ChatMessageData = z.infer<typeof ChatMessageSchema>;

// Newsletter Signup
export const NewsletterSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  category: z.string()
    .optional()
    .or(z.literal('')),
});

export type NewsletterData = z.infer<typeof NewsletterSchema>;

// Utility function for form validation
export const validateFormData = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: 'Validation failed' } };
  }
};
