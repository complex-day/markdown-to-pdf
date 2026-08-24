export type ThemeType = 'github-light' | 'github-dark' | 'docs-style' | 'clean-print';

export type PageFormat = 'A4' | 'Letter';

export type PageOrientation = 'portrait' | 'landscape';

export type MarginPreset = 'narrow' | 'normal' | 'wide' | 'custom';

export interface MarginsConfig {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export type WatermarkPlacement = 'center' | 'diagonal' | 'footer';

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  placement: WatermarkPlacement;
  opacity: number;
}

export interface CoverPageConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  author?: string;
  organization?: string;
  date?: string;
}

export interface HeaderFooterConfig {
  enabled: boolean;
  headerTitle?: string;
  headerOrg?: string;
  headerCustom?: string;
  footerText?: string;
  showDate: boolean;
  showPageNumbers: boolean;
  pageNumberPosition: 'left' | 'center' | 'right';
}

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

export interface MarkdownDocument {
  id: string;
  filename: string;
  content: string;
  order: number;
  size?: number;
}

export interface TocConfig {
  enabled: boolean;
  maxDepth: number; // 1 to 6
}

export type ExportPreset = 'github' | 'documentation' | 'print' | 'custom';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface PdfGenerationRequest {
  documents: MarkdownDocument[];
  theme: ThemeType;
  coverPage: CoverPageConfig;
  toc: TocConfig;
  headerFooter: HeaderFooterConfig;
  pageFormat: PageFormat;
  orientation: PageOrientation;
  marginPreset: MarginPreset;
  customMargins?: MarginsConfig;
  watermark: WatermarkConfig;
  metadata: PdfMetadata;
  assets?: Record<string, string>; // relativePath -> dataUri / base64
  insertPageBreaks?: boolean;
}
