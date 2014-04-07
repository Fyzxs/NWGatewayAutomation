 var character = {
        name: 'This Guy',
        assignments : {
            filter:{
                sort: 'asc|desc',
                hide_abovelevel: true||false,
                hide_unmetreqs: true||false
            },
            todo:[],
            tasks:{
                leadership: [],
                leatherworking: [],
                tailoring : [],
                mailsmithing: [],
                platesmithing: [],
                artificing: [],
                weaponsmithing: [],
                alchemy:[]
            }
        }
    };


$.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/NeverwinterGateway.js').then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src/js/taskPromise.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/switchToCharacter.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/professionTask.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/swordCoastAdventureTask.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/dicePickerBrain.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/dicePickerTask.js');
})

var thor = {
    name: 'Thoradin Strifeminer',
    assignments:{
        filter:{
            sort: 'desc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leadership: ['Assemble Maps', 'Chart Region', 'Explore Local Area', 'Patrol the Mines', 'Feed the Needy', 'War Games Training'],
            tailoring:['Intensive Scrap Gathering'],
            artificing:['Gather Ore and Wood']
        },
        todo:['leadership']
    },
    adv : [{
                tier:'tier-3',
                companions:[]}
    ]
};
//This needs to operate like professions do, seaching for specified companions and resetting based on their delay.
//the lesser selection is too hacky to work around


            {
                tier:'tier-3',
                companions:[
                    {
                        name:'Cal',
                        required:true,
                    },
                    {
                        name:'Drew',
                        required:true,
                    },
                    {
                        name:'Crunk',
                        required:true,
                    },
                    {
                        name:'Mushroom',
                        required:true,
                    },
                    {
                        name:'Spellboard',
                        excluded:true,
                    },
                    {
                        name:'Manny',
                        excluded:true,
                    },
                    {
                        name:'Conan',
                        excluded:true,
                    },
                    {
                        name:'Shaz',
                        excluded:true,
                    },
                    {
                        name:'Dwalia',
                        excluded:true,
                    },
                    {
                        name:'Budz',
                        excluded:true,
                    },

                ]
            },
            {
                tier:'tier-2',
                companions:[
                    {
                        name:'Cal',
                        excluded:true,
                    },
                    {
                        name:'Drew',
                        excluded:true,
                    },
                    {
                        name:'Crunk',
                        excluded:true,
                    },
                    {
                        name:'Mushroom',
                        excluded:true,
                    },
                ]
            }
var wizardia = {
    name: 'Wizardia',
    assignments:{
        filter:{
            sort: 'asc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leatherworking: ['Gather Simple Pelts']
        },
        todo:['leatherworking']
    },
    adv : [
        {
            tier:'tier-1',
            companions: [
            ]
        }
    ]
};


(function($){
    var profTask = $.nwg.adventure.create(thor);
    var task = profTask.create_base_task();
    task.progress();
}(jQuery));



(function($){
    var profTask = $.nwg.profession.create(thor);
    var task = profTask.create_base_task();
    task.then(profTask.check_job_progress.bind(profTask));
    task.progress();
}(jQuery));




(function($){
    var profTask = $.nwg.profession.create(thor);
    var task = profTask.create_base_task();
    task.then(profTask.start_job.bind(profTask));
    task.progress();
}(jQuery));



(function($){
    var profTask = $.nwg.adventure.create(wizardia);
    var task = profTask.create_base_task();
    task.progress();
}(jQuery));



(function($){
    var profTask = $.nwg.profession.create(wizardia);
    var task = profTask.create_base_task();
    task.then(profTask.check_job_progress.bind(profTask));
    task.progress();
}(jQuery));







(function($){
    var profTask = $.nwg.profession.create(thor);
    var task = $.task.create(profTask.start);
    task.progress();
    //console.log(task.id);
}(jQuery));

var amaranthine = {
    name: 'Amaranthine',
    assignments:{
        filter:{
            sort: 'desc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leadership: ['Explore Local Area'],
            leatherworking: ['Gather Simple Pelts'],
            tailoring : ['Gather Wool Scraps'],
            mailsmithing: ['Gather Iron Ore'],
            platesmithing: ['Gather Iron Ore'],
            artificing: ['Gather Ore and Wood'],
            weaponsmithing: ['Gather Iron Ore and Pine Wood'],
            alchemy:['Gather Simple Components']
        },
        todo:['tailoring', 'leatherworking', 'mailsmithing', 'artificing'],
    }
};


(function($){
    var profTask = $.nwg.profession.create(amaranthine);
    var task = $.task.create(profTask.start);
    task.progress();
}(jQuery));

(function($){
    var profTask = $.nwg.profession.create(amaranthine);
    var task = $.task.create(profTask.start);
    task.progress();
    var profTask2 = $.nwg.profession.create(amaranthine);
    var task2 = $.task.create(profTask2.start);
    task2.progress();
}(jQuery));
