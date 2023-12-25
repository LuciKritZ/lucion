'use client';

import { useEffect, useState } from 'react';

import { useUser } from '@clerk/clerk-react';
import Script from 'next/script';

/**
 * @see https://samelogic.com/blog/heap-analytics-in-nextjs-with-nextauthjs
 * AnalyticsProvider returns a Script tag for heap analytics.
 */
const AnalyticsProvider = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user && window.heap) {
      console.info('Identifying Heap User...');
      window.heap.identify(user.id);
      window.heap.addUserProperties({
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
      });
    }
  }, [scriptLoaded, user]);

  const scriptReady = () => {
    if (window.heap) {
      setScriptLoaded(true);
    }
  };

  return (
    <Script
      id='heap-analytics'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{
        __html: `
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
      heap.load("${process.env.NEXT_PUBLIC_HEAP_ANALYTICS_ID}");
      `,
      }}
      onReady={scriptReady}
    />
  );
};

export default AnalyticsProvider;
