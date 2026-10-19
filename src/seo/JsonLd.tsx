import { useEffect } from 'react';

type JsonLdProps = {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ id, data }: JsonLdProps) {
  const payload = JSON.stringify(data);

  useEffect(() => {
    const scriptId = `json-ld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = payload;

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [id, payload]);

  return null;
}
