var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var nearestTargets = _.sortBy(targets, s => creep.pos.getRangeTo(s));
                if(creep.build(nearestTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var walls = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL});
                if (walls.length) { 
                    var sortedWalls = _.sortBy(walls, s => (s.hits * 15) * creep.pos.getRangeTo(s));
                    if(creep.repair(sortedWalls[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sortedWalls[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
	    }
	    else {
	        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if (targets.length > 0) {
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creep.memory.energyIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.energyIndex], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
	    }
	}
};

module.exports = roleBuilder;