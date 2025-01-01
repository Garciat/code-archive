export const layout = "layouts/default.tsx";

export const items = {
  "explorer/": {},
  "itunes/": {},
  "new-wave/": {},
  "taskbar/": {},
  "wlmail/": {},
};

declare global {
  namespace Lume {
    interface Data {
      items: Record<string, { timestamp?: string; description?: string }>;
    }
  }
}
