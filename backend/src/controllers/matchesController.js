const matchesService = require('../services/matchesService')

exports.getMatches = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        
        // First check if user is eligible for matching
        const eligibility = await matchesService.checkUserMatchingEligibility(firebaseUid);
        
        if (!eligibility.hasSkills || !eligibility.hasInterests) {
            return res.status(200).json({
                matches: [],
                message: !eligibility.hasSkills && !eligibility.hasInterests 
                    ? "You need to verify at least 1 skill and add at least 1 interest to start finding matches."
                    : !eligibility.hasSkills 
                    ? "You need to verify at least 1 skill to start finding matches."
                    : "You need to add at least 1 interest to start finding matches."
            });
        }
        
        // Get matches if user is eligible
        const matches = await matchesService.getMatchesWithProfiles(firebaseUid);
        
        if (matches.length === 0) {
            return res.status(200).json({
                matches: [],
                message: "No matches found. Try adding more skills or interests to find compatible users."
            });
        }
        
        res.status(200).json({
            matches: matches,
            message: `Found ${matches.length} match${matches.length === 1 ? '' : 'es'}!`
        });
        
    } catch (err) {
        console.error('Error getting matches:', err);
        res.status(500).json({ error: 'Failed to get matches' });
    }
};
