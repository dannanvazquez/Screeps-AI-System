var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    
    var bodyParts = [WORK,CARRY,MOVE];
    if (Game.spawns['Spawn1'].canCreateCreep(bodyParts, 'Test') == OK) {
        var tier = 1;
        while (Game.spawns['Spawn1'].room.energyAvailable > 200 + (tier * 100)) {
            tier++;
            bodyParts.push(WORK);
        }
        if (Game.spawns['Spawn1'].room.energyAvailable >= 150 + (tier * 100)) {
            tier+=0.5;
            bodyParts.push(MOVE);
        }
        var randomIndex = Math.floor(Math.random() * (Game.spawns['Spawn1'].room.find(FIND_SOURCES).length));
        if (harvesters.length < 3) {
            var newName = '[T' + tier + ']Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'harvester', energyIndex: randomIndex}});
        } else if(upgraders.length < 3) {
            var newName = '[T' + tier + ']Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'upgrader', energyIndex: randomIndex}});
        } else if (builders.length < 3 && (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0 || Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL}).length > 0)) {
            var newName = '[T' + tier + ']Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'builder', energyIndex: randomIndex}});
        } else if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length == 0 && Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL}).length == 0) {
            if (harvesters.length < 4) {
                var newName = '[T' + tier + ']Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                    {memory: {role: 'harvester', energyIndex: randomIndex}});
            } else if(upgraders.length < 4) {
                var newName = '[T' + tier + ']Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                    {memory: {role: 'upgrader', energyIndex: randomIndex}});
            }
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    var enemies = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        var nearestEnemies = _.sortBy(enemies, s => Game.spawns['Spawn1'].pos.getRangeTo(s));
                
        Game.notify("HOSTILE ALERT! THERE ARE " + enemies.length + " enemies!", 0);
        console.log("HOSTILE ALERT! THERE ARE " + enemies.length + " enemies! Attacking: " + nearestEnemies[0].name);
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            creep.attack(nearestEnemies[0]);
            
            if(creep.attack(nearestEnemies[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestEnemies[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    } else {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
    }
}