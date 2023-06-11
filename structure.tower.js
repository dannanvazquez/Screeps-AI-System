var structureTower = {

    run: function (roomName) {
        var tower = roomName.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if (tower) {
            for (i = 0; i < tower.length; i++) {
                var enemies = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
                if (enemies.length > 0) {
                    var closestHostile = tower[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (closestHostile) {
                        tower[i].attack(closestHostile);
                    }
                } else if (tower[i].energy > tower[i].energyCapacity - 50) {
                    var repairableStructures = tower[i].room.find(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax});
                    if (repairableStructures.length) { 
                        var sortedRepairables = _.sortBy(repairableStructures, s => (s.hits * 40) * tower[i].pos.getRangeTo(s));
                        tower[i].repair(sortedRepairables[0], {visualizePathStyle: {stroke: '#00c5ff'}});
                    }
                }
            }
        }
    }
};
module.exports = structureTower;