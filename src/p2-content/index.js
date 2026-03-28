import { edgeFunctionsContent } from './edge-functions.js';
import { geoPartitioningContent } from './geo-partitioning.js';
import { chaosEngineeringContent } from './chaos-engineering.js';
import { costTrackingContent } from './cost-tracking.js';

/** Markdown bodies keyed by docs section id (matches sidebar `data-section`). */
export const P2_SECTIONS = {
  'edge-functions': edgeFunctionsContent.content,
  'geo-partitioning': geoPartitioningContent.content,
  'chaos-engineering': chaosEngineeringContent.content,
  'cost-tracking': costTrackingContent.content,
};
