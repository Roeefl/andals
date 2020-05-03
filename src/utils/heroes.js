import {
  HERO_CARD_QhorinHalfhand,
  HERO_CARD_BenjenStark
} from '@/specs/heroCards';

export function isAllowRobberReset(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_QhorinHalfhand);
};

export function isAllowNorthWildlingsRemove(player) {
  return (player && player.heroPrivilege && player.heroPrivilege === HERO_CARD_BenjenStark);
};
