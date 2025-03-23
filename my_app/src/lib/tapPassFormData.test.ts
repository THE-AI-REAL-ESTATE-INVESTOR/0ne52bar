import { registrationSchema } from './tapPassFormData';

describe('TapPass Form Validation', () => {
  const validFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    birthday: '1990-01-01',
    phoneNumber: '1234567890',
    agreeToTerms: true
  };

  test('validates correct form data', () => {
    const result = registrationSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });

  test('requires name to be at least 2 characters', () => {
    const result = registrationSchema.safeParse({
      ...validFormData,
      name: 'J'
    });
    expect(result.success).toBe(false);
  });

  test('requires valid email', () => {
    const result = registrationSchema.safeParse({
      ...validFormData,
      email: 'invalid-email'
    });
    expect(result.success).toBe(false);
  });

  test('requires age to be at least 21', () => {
    const today = new Date();
    const under21Date = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    
    const result = registrationSchema.safeParse({
      ...validFormData,
      birthday: under21Date
    });
    expect(result.success).toBe(false);
  });

  test('requires 10 digit phone number', () => {
    const result = registrationSchema.safeParse({
      ...validFormData,
      phoneNumber: '123'
    });
    expect(result.success).toBe(false);
  });

  test('requires agreement to terms', () => {
    const result = registrationSchema.safeParse({
      ...validFormData,
      agreeToTerms: false
    });
    expect(result.success).toBe(false);
  });
}); 