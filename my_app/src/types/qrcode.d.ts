declare module 'qrcode.react' {
  import React from 'react';
  
  export interface QRCodeSVGProps {
    value: string;
    size?: number;
    level?: string;
    bgColor?: string;
    fgColor?: string;
    includeMargin?: boolean;
  }
  
  export const QRCodeSVG: React.FC<QRCodeSVGProps>;
} 