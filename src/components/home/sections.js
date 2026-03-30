import { codeWindowToolbar, codeWindowCodeBlock } from '../ui/code-window.js';
import { WRITE_LESS_CODE_CLASS, WRITE_LESS_CODE_FUNCTION } from '../../verified-home-code.js';

import {
  HOME_CODE_FEATURES,
  FEATURES_GRID_ITEMS,
  COMPARISON_ROWS,
  ECOSYSTEM_PACKAGES,
} from './sections-data.js';

import {
  homeFeatureCardsTemplate,
  featuresGridCardsTemplate,
  comparisonTableTbodyTemplate,
  ecosystemPackageCardsTemplate,
  homeHeroSectionTemplate,
  homeWriteLessSectionTemplate,
  featuresGridSectionTemplate,
  securityArchitectureTeaserTemplate,
  comparisonTableSectionTemplate,
  monorepoSectionTemplate,
  ctaSectionTemplate,
} from './sections-templates.js';

export { WRITE_LESS_CODE_FUNCTION, WRITE_LESS_CODE_CLASS };

function escapeCodeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function createHeroSection() {
  const heroCode = escapeCodeHtml(WRITE_LESS_CODE_FUNCTION);
  return homeHeroSectionTemplate({ heroCode });
}

export function createHomeWriteLessSection() {
  const featureCards = homeFeatureCardsTemplate(HOME_CODE_FEATURES);
  const toolbar = codeWindowToolbar({
    filename: 'home_class_style.py',
    codeId: 'main',
    showTryCopy: true,
    showControllerToggle: true,
  });
  const body = codeWindowCodeBlock({
    codeId: 'main',
    code: WRITE_LESS_CODE_CLASS,
    wrapperClass: 'p-6 overflow-x-auto',
  });

  return homeWriteLessSectionTemplate({ toolbar, body, featureCards });
}

export function createFeaturesGrid() {
  const cards = featuresGridCardsTemplate(FEATURES_GRID_ITEMS);
  return featuresGridSectionTemplate({ cards });
}

export function createSecurityArchitectureTeaser() {
  return securityArchitectureTeaserTemplate();
}

export function createComparisonTable() {
  const tbody = comparisonTableTbodyTemplate(COMPARISON_ROWS);
  return comparisonTableSectionTemplate({ tbody });
}

export function createMonorepoSection() {
  const cards = ecosystemPackageCardsTemplate(ECOSYSTEM_PACKAGES);
  return monorepoSectionTemplate({ cards });
}

export function createCTASection() {
  return ctaSectionTemplate();
}
