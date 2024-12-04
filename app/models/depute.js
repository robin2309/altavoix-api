const POUR = 'pour';
const CONTRE = 'contre';
const ABSTENTION = 'abstention';
const ABSENT = 'absent';

const parseVotes = votes => {
    return votes.reduce((acc, vote) => {
        acc[vote.standing] = (acc[vote.standing] || 0) + 1;
        return acc;
    }, {
        [POUR]: 0,
        [CONTRE]: 0,
        [ABSTENTION]: 0,
        [ABSENT]: 0,
    });
}

export { POUR, CONTRE, ABSTENTION, ABSENT, parseVotes };
