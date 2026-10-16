import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export type JsonLdType = {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
};

interface JsonLdProps {
  data: JsonLdType;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  useEffect(() => {
    const scriptId = 'json-ld-schema';
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.textContent = JSON.stringify(data);
    } else {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
    }
  }, [data]);

  return (
    <Helmet>
      <script type="application/ld+json" id="json-ld-schema">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};
