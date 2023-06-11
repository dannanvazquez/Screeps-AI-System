var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length) {
            var closestEnemies = _.sortBy(enemies, s => s.pos.getRangeTo(Game.spawns['Spawn1']));
            if (creep.rangedAttack(closestEnemies[0]) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(closestEnemies[0], {visualizePathStyle: {stroke: '#ff0000'}});
	        }
	    } else {
            creep.moveTo(Game.flags["Idle"], {visualizePathStyle: {stroke: '#ffffff'}});
        }
	}
};

module.exports = roleDefender;