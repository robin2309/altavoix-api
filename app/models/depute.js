const POUR = 'pour';
const CONTRE = 'contre';
const ABSTENTION = 'abstention';
const ABSENT = 'absent';

const parseVotes = votes => {
    return votes.reduce((acc, vote) => {
        acc[vote.standing] = (acc[vote.standing] || 0) + 1;
        return acc;
    }, {});
}

export { POUR, CONTRE, ABSTENTION, ABSENT, parseVotes };
