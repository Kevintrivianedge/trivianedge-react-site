import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useServiceInquiryLink(service: string, homepageSource?: string) {
  const { pathname, search } = useLocation();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // The service snapshot is prerendered without query parameters.
  const fromHome = ready && new URLSearchParams(search).get('from') === 'home';
  const source = fromHome && homepageSource ? homepageSource : pathname;
  return `/contact?${new URLSearchParams({ service, source })}#project-brief`;
}
