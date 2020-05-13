import {
  HERO_CARD_QhorinHalfhand,
  HERO_CARD_BenjenStark,
  HERO_CARD_Stannis,
  HERO_CARD_Ygritte,
  HERO_CARD_JeorMormont
} from '@/specs/heroCards';

import { CARD_KNIGHT } from '@/specs/gameCards';

export function isAllowNorthWildlingsRemove(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_BenjenStark);
};

export function isAllowedGuardRelocate(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_Stannis);
};

export function isAllowRemoveWildlingFromHextile(player) {
 return (player && (
   (player.activeGameCard && player.activeGameCard === CARD_KNIGHT) ||
   (player.heroPrivilege && player.heroPrivilege === HERO_CARD_Ygritte)
 ));
};

export function mustGiveBackOnSteal(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_JeorMormont);
};

export function isAllowMoveRobber(player) {
  return (player && (
    player.mustMoveRobber ||
    (player.activeGameCard && player.activeGameCard === CARD_KNIGHT)
  ));
};

export function isAllowRobberReset(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_QhorinHalfhand);
};
