export const classList = (obj: Record<string, boolean>): string[] => {
  return Object.entries(obj)
    .filter(([_k, v]) => !!v)
    .map(([k, _k]) => k);
};
