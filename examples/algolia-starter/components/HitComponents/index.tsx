import { Hits } from 'react-instantsearch-hooks-web';
import React from 'react';
import { ComponentInstance } from '@uniformdev/canvas';
import Hit from "@/components/HitComponents/Hit";

enum HitTypes {
  Hit = 'algolia-hit'
}

export const renderHits = (component: ComponentInstance) => {
  const hitType = component?.slots?.hitComponent?.[0]?.type;
  switch (hitType) {
    case HitTypes.Hit:
      return <Hits hitComponent={Hit} />;
    default:
      return <Hits />;
  }
};
