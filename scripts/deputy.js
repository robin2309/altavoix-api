import { IN_FAVOR, AGAINST, ABSTENTION, ABSENT, parseVotes, normalizeId } from '#models/deputy.js';

const isInVoters = (votes, id) => {
  if (!votes) return false;
  const normalizedId = normalizeId(id);
  if (!!(votes?.votant?.acteurRef)) {
    return normalizedId === votes.votant.acteurRef;
  }
  return votes ? votes.votant.find(({acteurRef}) => {
    return normalizedId === acteurRef;
  }) : false;
};

const getStanding = (votes, id) => {
  const {groupe: groups} = votes.organe.groupes;
  for (let group of groups) {
    const {pours, contres, abstentions} = group.vote.decompteNominatif;
    if (isInVoters(pours, id)) return IN_FAVOR;
    if (isInVoters(contres, id)) return AGAINST;
    if (isInVoters(abstentions, id)) return ABSTENTION;
  }
  return ABSENT;
}

export { getStanding };
