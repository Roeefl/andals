import {
  HERO_CARD_QhorinHalfhand,
  HERO_CARD_BenjenStark,
  HERO_CARD_Stannis,
  HERO_CARD_Ygritte
} from '@/specs/heroCards';

import { CARD_KNIGHT } from '@/specs/gameCards';

export function isAllowRobberReset(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_QhorinHalfhand);
};

export function isAllowNorthWildlingsRemove(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_BenjenStark);
};

export function isAllowedGuardRelocate(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_Stannis)
};

export function isAllowRemoveWildlingFromHextile(player) {
 return (player && (
   (player.heroPrivilege && player.heroPrivilege === HERO_CARD_Ygritte) ||
   (player.activeGameCard && player.activeGameCard === CARD_KNIGHT)
 ));
};
