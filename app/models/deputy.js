const IN_FAVOR = 'in favor';
const AGAINST = 'against';
const ABSTENTION = 'abstention';
const ABSENT = 'absent';

const parseVotes = votes => {
    return votes.reduce((acc, vote) => {
        acc[vote.standing] = (acc[vote.standing] || 0) + 1;
        return acc;
    }, {
        [IN_FAVOR]: 0,
        [AGAINST]: 0,
        [ABSTENTION]: 0,
        [ABSENT]: 0,
    });
}

const getPictureUrl = id => `https://www.assemblee-nationale.fr/dyn/static/tribun/17/photos/carre/${id}.jpg`

const normalizeId = id => `PA${id}`

export { IN_FAVOR, AGAINST, ABSTENTION, ABSENT, parseVotes, getPictureUrl, normalizeId };
