declare module 'facebook-nodejs-business-sdk' {
  export class FacebookAdsApi {
    static init(accessToken: string): void;
  }

  export interface FacebookEventFields {
    fields: string[];
    time_filter?: string;
    limit?: number;
    [key: string]: string | string[] | number | undefined;
  }

  export interface FacebookEvent {
    id: string;
    name: string;
    description?: string;
    start_time: string;
    end_time?: string;
    place?: {
      name: string;
      location?: {
        city: string;
        country: string;
        latitude: number;
        longitude: number;
        state: string;
        street: string;
        zip: string;
      };
    };
    cover?: {
      source: string;
      id: string;
    };
  }

  export class Page {
    constructor(id: string);
    getEvents(params: FacebookEventFields): Promise<FacebookEvent[]>;
  }
} 