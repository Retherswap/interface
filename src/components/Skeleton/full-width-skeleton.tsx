import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function FullWidthSkeleton({ width = '100%', height = '5px' }: { width?: string; height?: string }) {
  return <Skeleton containerClassName="max-container" width={width}></Skeleton>;
}
