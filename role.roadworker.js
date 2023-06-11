var roleRoadworker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('🔨 repair');
	    }

	    if(creep.memory.repairing) {
    	    var roads = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax)});
            if (roads.length) {
                var optimalRoads = _.sortBy(roads, s => (s.hits * 15) * creep.pos.getRangeTo(s));
                if(creep.repair(optimalRoads[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(optimalRoads[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.energyIndex]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.energyIndex], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleRoadworker;