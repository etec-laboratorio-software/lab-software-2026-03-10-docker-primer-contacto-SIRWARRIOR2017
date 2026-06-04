export const normalizeMediaUrl = (url) => {
  if (!url) return '';

  const trimmedUrl = String(url).trim();
  if (!trimmedUrl) return '';

  const localPrefix = 'http://localhost:3000';
  const httpsLocalPrefix = 'https://localhost:3000';

  if (trimmedUrl.startsWith(localPrefix)) {
    return trimmedUrl.replace(localPrefix, '');
  }

  if (trimmedUrl.startsWith(httpsLocalPrefix)) {
    return trimmedUrl.replace(httpsLocalPrefix, '');
  }

  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('data:')) {
    return trimmedUrl;
  }

  return trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
};
