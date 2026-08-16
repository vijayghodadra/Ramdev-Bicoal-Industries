import { useEffect } from 'react';

export default function SEO({ title, description, keywords, schema }) {
  useEffect(() => {
    // Set Document Title
    const baseTitle = 'Ramdev Biocoal Industries';
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = `${baseTitle} | Premium Agriculture Sorting & Processing Solutions`;
    }

    // Set Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        description || 'Ramdev Biocoal Industries provides premium agriculture sorting, grading, and packing solutions across Gujarat. Built on trust, driven by quality.'
      );
    }

    // Set Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        'content',
        keywords || 'Ramdev Biocoal Industries, Peanut Sorting, Chana Sorting, Tuwar Grading, Wheat Sorting, Agricultural Packing, Gujarat Agriculture Processing, Sorting Machinery'
      );
    }

    // Update Open Graph (OG) Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | ${baseTitle}` : baseTitle);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute(
        'content',
        description || 'Providing high quality sorting, grading, and packing services across Gujarat. Precision. Quality. Reliability.'
      );
    }

    // Handle Schema Markup (JSON-LD)
    let schemaScript = document.getElementById('seo-schema');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }
  }, [title, description, keywords, schema]);

  return null;
}
