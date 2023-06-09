var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadworker = require('role.roadworker');
var roleHealer = require('role.healer');
var roleDefender = require('role.defender');

var structureTower = require('structure.tower');

module.exports.loop = function () {
    // Clear up data for non-existing creeps.
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var roadworkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadworker');
    var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    
    var randomIndex = Math.floor(Math.random() * (Game.spawns['Spawn1'].room.find(FIND_SOURCES).length));
    if (harvesters.length < 4) {
        let maxEnergy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        let bodyParts = [];
        let maxBodyParts = 50;
    
        while(maxBodyParts >= 4 && maxEnergy >= 300){
            bodyParts.push(WORK); bodyParts.push(WORK); bodyParts.push(CARRY); bodyParts.push(MOVE);
            maxBodyParts -= 4;
            maxEnergy -= 300;
        }
        if (bodyParts.length && Game.spawns['Spawn1'].canCreateCreep(bodyParts, 'Test') == OK) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
    
            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'harvester', energyIndex: randomIndex}});
        } else {
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                roleHarvester.run(creep);
            }
        }
    } else if (Game.spawns['Spawn1'].room.energyAvailable >= 600) {
        if (harvesters.length < 2) {
            var bodyParts = [MOVE,MOVE,CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,WORK];
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);

            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'harvester', energyIndex: randomIndex}});
        } else if (upgraders.length < 2) {
            var bodyParts = [MOVE,MOVE,CARRY,CARRY,WORK,WORK,WORK,WORK];
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);

            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'upgrader', energyIndex: randomIndex}});
        } else if (defenders.length < 2) {
            var bodyParts = [MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK];
            var newName = 'Defender' + Game.time;
            console.log('Spawning new defender: ' + newName);

            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'defender', energyIndex: randomIndex}});
        } else if (roadworkers.length < 1 && Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax/2)}).length > 0) {
            var bodyParts = [MOVE,MOVE,CARRY,CARRY,WORK,WORK,WORK,WORK];
            var newName = 'Roadworker' + Game.time;
            console.log('Spawning new roadworker: ' + newName);

            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'roadworker', energyIndex: randomIndex}});
        } else if (builders.length < 2 && (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0 || Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL}).length > 0)) {
            var bodyParts = [MOVE,MOVE,CARRY,CARRY,WORK,WORK,WORK,WORK];
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);

            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'builder', energyIndex: randomIndex}});
        } else if (healers.length < 1) {
            var bodyParts = [MOVE,MOVE,HEAL,HEAL];
            var newName = 'Healer' + Game.time;
            console.log('Spawning new healer: ' + newName);

            Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
                {memory: {role: 'healer', energyIndex: randomIndex}});
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
        var nearestEnemies = _.sortBy(enemies, s => Game.spawns['Spawn1'].room.controller.pos.getRangeTo(s));
        if (Game.spawns['Spawn1'].room.controller.safeModeAvailable > 0 && Game.spawns['Spawn1'].pos.getRangeTo(nearestEnemies[0]) < 2) {
            Game.notify("ENTERING SAFE MODE!", 0);
            console.log("ENTERING SAFE MODE!");
            
            Game.spawns['Spawn1'].room.controller.activateSafeMode();
            return;
        }
                
        Game.notify("HOSTILE ALERT! THERE ARE " + enemies.length + " ENEMIES! Attacking: " + nearestEnemies[0].owner.username +" AT "+  Game.time, 0);
        console.log("HOSTILE ALERT! THERE ARE " + enemies.length + " ENEMIES! Attacking: " + nearestEnemies[0].owner.username +" AT "+  Game.time);
    }

    if (harvesters.length) {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            else if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            else if (creep.memory.role == 'roadworker') {
                roleRoadworker.run(creep);
            }
            else if (creep.memory.role == 'healer') {
                roleHealer.run(creep);
            }
            else if (creep.memory.role == 'defender') {
                roleDefender.run(creep);
            }
        }
    }

    for (let rooms in Game.rooms) {
        let room = Game.rooms[rooms];
        structureTower.run(room);
    }
    
    // Update when the Room Controller has changed levels (both upgraded and downgraded).
    var currentController = Game.spawns['Spawn1'].room.controller;
    if (!Game.spawns['Spawn1'].memory.levelAlert || Game.spawns['Spawn1'].memory.levelAlert != currentController.level) {
            var context = Game.spawns['Spawn1'].memory.levelAlert < currentController.level ? "upgraded" : "downgraded";
            Game.spawns['Spawn1'].memory.levelAlert = currentController.level;
                        
            Game.notify("Room "+ Game.spawns['Spawn1'].room.name +"'s Room Controller has been "+ context +" to level " + currentController.level + "!", 0);
            console.log("Room "+ Game.spawns['Spawn1'].room.name +"'s Room Controller has been "+ context +" to level " + currentController.level + "!");
    }
}