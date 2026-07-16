import { useEffect } from 'react';
import { applyPageMeta, PageMetaInput } from '../helpers/seo';

const PageMeta = ({
  title,
  description,
  path,
  image,
  type,
  jsonLd,
  noindex,
}: PageMetaInput) => {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    applyPageMeta({
      title,
      description,
      path,
      image,
      type,
      noindex,
      jsonLd: jsonLdKey ? (JSON.parse(jsonLdKey) as PageMetaInput['jsonLd']) : undefined,
    });
  }, [title, description, path, image, type, noindex, jsonLdKey]);

  return null;
};

export default PageMeta;
