var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    var friendlyCreeps = creep.room.find(FIND_CREEPS, {filter: (s) => s.hits < s.hitsMax});
	    if (friendlyCreeps.length) {
	        var lowestCreeps = _.sortBy(friendlyCreeps, s => s.hits);
	        if (creep.heal(lowestCreeps[0]) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(lowestCreeps[0], {visualizePathStyle: {stroke: '#00ff23'}});
	        }
	    } else {
            creep.moveTo(Game.flags["Idle"], {visualizePathStyle: {stroke: '#ffffff'}});
        }
	}
};

module.exports = roleHealer;