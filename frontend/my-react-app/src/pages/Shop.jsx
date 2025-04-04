import React, { Suspense, lazy } from "react";
import Hero from "./Hero";
import Popular from "../components/popular/Popular";
import Offers from "../components/offers/Offer";
import ToastifyWrapper from "./Toastify"; // We'll create this wrapper
import HotDeals from "./HotDeals";
import BeiYangu from "./BieYangu";
import RecentlyViewedItems from "./RecentViewed";
// Lazy load less critical or lower in the viewport components
const LazyNew = lazy(() => import("../components/NewColections/NewCollection"));
const LazyNews = lazy(() => import("../components/NewsLatter/NewsLatter"));
const LazyFeatures = lazy(() => import("../components/Features/Features"));
const LazyFAQ = lazy(() => import("../components/Faq/Faq"));
const LazyAll = lazy(() => import("./All"));
const LazyMyPocket = lazy(() => import("./MyPocket"));
const LazyBestVitronTvs = lazy(() => import("./BestVitron"));
const LazyBestPowerbanks = lazy(() => import("./BestOrimoPowerBanks"));
const LazyBestJblSpeakers = lazy(() => import("./BestJbl"));
const LazyBestHpLaptops = lazy(() => import("./BestHp"));

// Optional loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
  </div>
);

const Shop = () => {
  return (
    <div>
      <Hero />
      <HotDeals />
      <BeiYangu />
      <LazyMyPocket />
      <Offers />
      <Popular />
      <Suspense fallback={<LoadingFallback />}>
        <LazyBestVitronTvs />
        <LazyBestPowerbanks />
        <LazyBestJblSpeakers />
        <LazyBestHpLaptops />
        <LazyNew />
        <LazyAll />
        <RecentlyViewedItems/>
        <LazyNews />
        <LazyFeatures />
        <LazyFAQ />
      </Suspense>
      
      <ToastifyWrapper />
    </div>
  );
};

export default Shop;