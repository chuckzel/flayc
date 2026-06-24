import { type UploadedPhoto } from "./print-types";

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createDemoPhoto(
  name: string,
  startColor: string,
  endColor: string,
  label: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100" role="img" aria-label="${escapeXml(name)}">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${startColor}"/>
          <stop offset="100%" stop-color="${endColor}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1100" fill="url(#g)"/>
      <circle cx="660" cy="260" r="170" fill="rgba(255,255,255,0.14)"/>
      <circle cx="245" cy="715" r="220" fill="rgba(255,255,255,0.10)"/>
      <rect x="72" y="72" width="756" height="956" rx="42" fill="rgba(15,23,42,0.28)" stroke="rgba(255,255,255,0.36)" stroke-width="6"/>
      <text x="112" y="196" fill="#f8fafc" font-size="82" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(label)}</text>
      <text x="112" y="272" fill="rgba(248,250,252,0.9)" font-size="28" font-family="Inter, Arial, sans-serif">${escapeXml(name)}</text>
      <rect x="112" y="340" width="300" height="10" rx="5" fill="rgba(248,250,252,0.8)"/>
      <rect x="112" y="376" width="520" height="10" rx="5" fill="rgba(248,250,252,0.45)"/>
      <rect x="112" y="412" width="450" height="10" rx="5" fill="rgba(248,250,252,0.45)"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createStarterPhotos(): UploadedPhoto[] {
  return [
    {
      id: "starter-1",
      name: "cover-shot.jpg",
      sizeLabel: "2.4 MB",
      url: createDemoPhoto("cover-shot.jpg", "#0f172a", "#0ea5e9", "01"),
      isObjectUrl: false,
    },
    {
      id: "starter-2",
      name: "detail-portrait.jpg",
      sizeLabel: "1.8 MB",
      url: createDemoPhoto("detail-portrait.jpg", "#111827", "#14b8a6", "02"),
      isObjectUrl: false,
    },
    {
      id: "starter-3",
      name: "landscape.jpg",
      sizeLabel: "3.1 MB",
      url: createDemoPhoto("landscape.jpg", "#172554", "#fb7185", "03"),
      isObjectUrl: false,
    },
  ];
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}
