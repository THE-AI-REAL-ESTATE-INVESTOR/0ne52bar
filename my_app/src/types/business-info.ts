/**
 * Business information types
 */

/**
 * Represents business hours for a specific day of the week
 * @prisma.model
 */
export interface BusinessHours {
  /** Unique identifier for the hours entry */
  id: string;
  
  /** Day of the week */
  day: string;
  
  /** Hours of operation for that day */
  hours: string;
  
  /** Reference to the business info this entry belongs to */
  businessInfoId: string;
  
  /** Reference to the business */
  businessInfo: BusinessInfo;
}

/**
 * Represents amenities offered by the business
 * @prisma.model
 */
export interface BusinessAmenity {
  /** Unique identifier for the amenity */
  id: string;
  
  /** Name of the amenity */
  name: string;
  
  /** Description of the amenity */
  description?: string;
  
  /** Reference to the business info this entry belongs to */
  businessInfoId: string;
  
  /** Reference to the business */
  businessInfo: BusinessInfo;
}

/**
 * Represents general business information
 * @prisma.model
 */
export interface BusinessInfo {
  /** Unique identifier for the business info */
  id: string;
  
  /** Business name */
  name: string;
  
  /** Business description */
  description: string;
  
  /** Business address */
  address: string;
  
  /** Business phone number */
  phone: string;
  
  /** Business hours by day */
  hours: BusinessHours[];
  
  /** Available amenities */
  amenities: BusinessAmenity[];
} 