export const layout = "layouts/default.tsx";

export const items = {
  "design/": {},
  "experiments/": {},
  "games/": {},
};

declare global {
  namespace Lume {
    interface Data {
      items: Record<string, { timestamp?: string; description?: string }>;
    }
  }
}
