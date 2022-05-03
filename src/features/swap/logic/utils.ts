export const chunkBy = <T>(items: T[], fn: (item: T) => any): T[][] => {
  const chunks: T[][] = [];
  let chunkValue: unknown;

  items.forEach((item, i) => {
    const value = fn(item);

    if (value !== chunkValue || i === 0) {
      chunks.push([]);
      chunkValue = value;
    }

    const chunk = chunks[chunks.length - 1];

    chunk.push(item);
  });

  return chunks;
};
