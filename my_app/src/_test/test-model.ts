/**
 * TEST MODELS - NOT PART OF THE ACTUAL APPLICATION
 * 
 * These models were created for testing the ts2prisma generator.
 * They should not be included in the final schema.
 */

/**
 * Example model for testing the TypeScript-to-Prisma Schema Generator
 * This file demonstrates how the generator can automatically convert TypeScript
 * interfaces to Prisma models with proper relationships
 */

/**
 * Represents a tag that can be applied to various content
 * @prisma.model
 */
export interface TestTag {
  /** Unique identifier for the tag */
  id: string;
  /** Tag name */
  name: string;
  /** When the tag was created */
  createdAt: Date;
  /** Color code for the tag */
  colorHex: string;
}

/**
 * Represents a category for blog posts
 */
export interface TestCategory {
  /** Unique identifier for the category */
  id: string;
  /** Category name */
  name: string;
  /** Category description */
  description?: string;
  /** Posts in this category */
  posts: TestPost[];
}

/**
 * Represents a user in the system
 */
export interface TestUser {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Whether the user is active */
  isActive: boolean;
  /** User's registration date */
  createdAt: Date;
  /** Collection of posts created by the user */
  posts: TestPost[];
}

/**
 * Represents a blog post
 */
export interface TestPost {
  /** Unique identifier for the post */
  id: string;
  /** Post title */
  title: string;
  /** Main content of the post */
  content: string;
  /** Whether the post is published */
  published: boolean;
  /** Publication date */
  publishedAt?: Date;
  /** User ID who wrote this post */
  authorId: string;
  /** Reference to the author */
  author: TestUser;
  /** Tags associated with this post */
  tags: string[];
  /** Category ID this post belongs to */
  categoryId: string;
  /** Reference to the category */
  category: TestCategory;
}

/**
 * Represents a comment on a post
 */
export interface TestComment {
  /** Unique identifier for the comment */
  id: string;
  /** Comment text */
  text: string;
  /** When the comment was created */
  createdAt: Date;
  /** ID of the post this comment belongs to */
  postId: string;
  /** Reference to the post */
  post: TestPost;
  /** ID of the user who wrote this comment */
  authorId: string;
  /** Reference to the user who wrote the comment */
  author: TestUser;
}

/**
 * Represents a product in an e-commerce system
 * @prisma.model
 */
export interface TestProduct {
  /** Unique identifier for the product */
  id: string;
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product price */
  price: number;
  /** Stock quantity */
  stock: number;
  /** Whether the product is available */
  isAvailable: boolean;
  /** When the product was created */
  createdAt: Date;
  /** When the product was last updated */
  updatedAt?: Date;
}

/**
 * Represents a customer order in the e-commerce system
 * @prisma.model
 */
export interface TestOrder {
  /** Unique identifier for the order */
  id: string;
  /** Current status of the order */
  status: string;
  /** Total amount of the order */
  totalAmount: number;
  /** Customer who placed the order */
  customerId: string;
  /** Reference to the customer */
  customer: TestUser;
  /** When the order was placed */
  orderDate: Date;
  /** When the order was last updated */
  updatedAt?: Date;
  /** Order items */
  items: TestOrderItem[];
}

/**
 * Represents an item in a customer order
 * @prisma.model
 */
export interface TestOrderItem {
  /** Unique identifier for the order item */
  id: string;
  /** Order this item belongs to */
  orderId: string;
  /** Reference to the order */
  order: TestOrder;
  /** Product in this order item */
  productId: string;
  /** Reference to the product */
  product: TestProduct;
  /** Quantity ordered */
  quantity: number;
  /** Price at time of order */
  unitPrice: number;
}

/**
 * Represents a product review
 * @prisma.model
 */
export interface TestReview {
  /** Unique identifier for the review */
  id: string;
  /** Rating from 1-5 */
  rating: number;
  /** Review title */
  title: string;
  /** Review text */
  content: string;
  /** Product being reviewed */
  productId: string;
  /** Reference to the product */
  product: TestProduct;
  /** User who wrote the review */
  authorId: string;
  /** Reference to the user */
  author: TestUser;
  /** Whether the review is verified */
  isVerified: boolean;
  /** When the review was written */
  createdAt: Date;
}

/**
 * Represents a shipping or billing address
 * @prisma.model
 */
export interface TestAddress {
  /** Unique identifier for the address */
  id: string;
  /** Street address */
  street: string;
  /** City */
  city: string;
  /** State or province */
  state: string;
  /** Postal code */
  postalCode: string;
  /** Country */
  country: string;
  /** Associated user */
  userId: string;
  /** Reference to the user */
  user: TestUser;
  /** Whether this is the default address */
  isDefault: boolean;
  /** Address type (shipping/billing) */
  addressType: string;
}

/**
 * Represents a payment for an order
 * @prisma.model
 */
export interface TestPayment {
  /** Unique identifier for the payment */
  id: string;
  /** Associated order */
  orderId: string;
  /** Reference to the order */
  order: TestOrder;
  /** Payment amount */
  amount: number;
  /** Payment method (credit card, PayPal, etc.) */
  method: string;
  /** Payment status */
  status: string;
  /** Transaction ID from payment processor */
  transactionId: string;
  /** When the payment was processed */
  processedAt: Date;
  /** Additional payment details as JSON */
  details?: string;
}

/**
 * Represents a subscription for a user
 * @prisma.model
 */
export interface TestSubscription {
  /** Unique identifier for the subscription */
  id: string;
  
  /** Name of the subscription plan */
  planName: string;
  
  /** Price per billing period */
  price: number;
  
  /** How often the user is billed (monthly, yearly, etc.) */
  billingPeriod: string;
  
  /** When the subscription started */
  startDate: Date;
  
  /** When the subscription ends or renews */
  endDate: Date;
  
  /** Whether the subscription renews automatically */
  autoRenew: boolean;
  
  /** Current status of the subscription */
  status: string;
  
  /** User who owns this subscription */
  userId: string;
  
  /** Reference to the user */
  user: TestUser;
  
  /** When the subscription was last updated */
  updatedAt?: Date;
}

/**
 * Represents a notification sent to a user
 * @prisma.model
 */
export interface TestNotification {
  /** Unique identifier for the notification */
  id: string;
  
  /** Type of notification (email, push, in-app) */
  type: string;
  
  /** Notification title */
  title: string;
  
  /** Notification message */
  message: string;
  
  /** Whether the notification has been read */
  isRead: boolean;
  
  /** When the notification was created */
  createdAt: Date;
  
  /** When the notification was read */
  readAt?: Date;
  
  /** User who received the notification */
  userId: string;
  
  /** Reference to the user */
  user: TestUser;
} 