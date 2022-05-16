export const encodeBase64 = (data: string): string => {
  return Buffer.from(data, 'utf8').toString('base64');
};

export const decodeBase64 = (data: string): string => {
  return Buffer.from(data, 'base64').toString('utf8');
};
