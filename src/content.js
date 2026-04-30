import { tutorialSeriesMarkdown } from './tutorial-series-content.js';
import { topicGuidesMarkdown, howToGuidesMarkdown } from './guides-content.js';
import { migrationGuidesMarkdown } from './migration-guides-content.js';
import { bestPracticesMarkdown } from './best-practices-content.js';
import { glossaryMarkdown } from './glossary-content.js';
import { errorReferenceMarkdown } from './error-reference-content.js';

import { frameworkContent } from './framework-content.js';
import { interactiveExamplesMarkdown } from './interactive-examples-content.js';
import { ecosystemPackagesMarkdown } from './ecosystem-packages-content.js';

// NEW: Documentation improvements
import { quickstartGuideMarkdown } from './quickstart-guide-content.js';
import { exampleProjectMarkdown } from './example-project-content.js';
import { cliToolMarkdown } from './cli-tool-content.js';
import { benchmarksMarkdown } from './benchmarks-content.js';
import { simplifiedGuideMarkdown } from './simplified-guide-content.js';

import { INLINE_DOC_SECTIONS_CORE } from './content/bodies/inline-doc-sections-core.js';
import { INLINE_DOC_CHANGELOG } from './content/bodies/inline-doc-changelog.js';
import { newFeaturesMarkdown } from './new-features-content.js';

// Documentation content
export const content = {
  ...frameworkContent,
  ...ecosystemPackagesMarkdown,
  ...tutorialSeriesMarkdown,
  ...topicGuidesMarkdown,
  ...howToGuidesMarkdown,
  'interactive-examples': interactiveExamplesMarkdown,
  'tutorial-series': tutorialSeriesMarkdown['tutorial-overview'],
  ...INLINE_DOC_SECTIONS_CORE,

  // Topic Guides (Conceptual)
  'topic-async': topicGuidesMarkdown['topic-async'],
  'topic-dependency-injection': topicGuidesMarkdown['topic-dependency-injection'],
  'topic-caching-strategies': topicGuidesMarkdown['topic-caching-strategies'],

  // How-To Guides (Recipes)
  'howto-oauth': howToGuidesMarkdown['howto-oauth'],
  'howto-rate-limiting': howToGuidesMarkdown['howto-rate-limiting'],
  'howto-soft-delete': howToGuidesMarkdown['howto-soft-delete'],
  'howto-fulltext-search': howToGuidesMarkdown['howto-fulltext-search'],
  'howto-file-uploads': howToGuidesMarkdown['howto-file-uploads'],

  // Migration Guides
  'migration-overview': migrationGuidesMarkdown['migration-overview'],
  'migration-django': migrationGuidesMarkdown['migration-django'],
  'migration-flask': migrationGuidesMarkdown['migration-flask'],
  'migration-fastapi': migrationGuidesMarkdown['migration-fastapi'],
  'migration-express': migrationGuidesMarkdown['migration-express'],
  'migration-nestjs': migrationGuidesMarkdown['migration-nestjs'],

  // Best Practices
  'best-practices': bestPracticesMarkdown['best-practices-overview'],

  // Glossary
  'glossary': glossaryMarkdown['glossary-overview'],
  'glossary-architecture': glossaryMarkdown['glossary-architecture'],
  'glossary-caching': glossaryMarkdown['glossary-caching'],
  'glossary-database': glossaryMarkdown['glossary-database'],
  'glossary-security': glossaryMarkdown['glossary-security'],
  'glossary-distributed': glossaryMarkdown['glossary-distributed'],
  'glossary-performance': glossaryMarkdown['glossary-performance'],

  // Error Reference
  'error-reference': errorReferenceMarkdown['error-overview'],
  'error-config': errorReferenceMarkdown['error-config'],
  'error-database': errorReferenceMarkdown['error-database'],
  'error-cache': errorReferenceMarkdown['error-cache'],
  'error-auth': errorReferenceMarkdown['error-auth'],
  'error-validation': errorReferenceMarkdown['error-validation'],
  'error-nplus1': errorReferenceMarkdown['error-nplus1'],
  'error-saga': errorReferenceMarkdown['error-saga'],
  'error-tracing': errorReferenceMarkdown['error-tracing'],
  'error-encryption': errorReferenceMarkdown['error-encryption'],

  // NEW: Quickstart & Getting Started
  'quickstart': quickstartGuideMarkdown['quickstart'],
  
  // NEW: Example Projects
  'example-ecommerce': exampleProjectMarkdown['example-ecommerce'],
  'example-blog': exampleProjectMarkdown['example-blog'],
  
  // NEW: CLI Tool
  'cli-tool': cliToolMarkdown['cli-tool'],
  
  // NEW: Benchmarks
  'benchmarks': benchmarksMarkdown['benchmarks'],
  
  // NEW: Simplified Guide
  'simplified-guide': simplifiedGuideMarkdown['simplified-guide'],

  // NEW: v1.7.x Features
  'websocket-channels': newFeaturesMarkdown['websocket-channels'],
  'health-probes': newFeaturesMarkdown['health-probes'],
  'guide-dev-server': newFeaturesMarkdown['guide-dev-server'],
  'guide-sdk-generation': newFeaturesMarkdown['guide-sdk-generation'],
  'guide-deployment': newFeaturesMarkdown['guide-deployment'],
  'pkg-fast-channels': newFeaturesMarkdown['pkg-fast-channels'],

  ...INLINE_DOC_CHANGELOG,
};

// Export existing components for homepage
export { createHeroSection, createHomeWriteLessSection, createFeaturesGrid, createComparisonTable, createCTASection, createDocsPage, highlightCode } from './content-components.js';
