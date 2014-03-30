(function($){

    var data = {
        state : {
            isOverWorld: function(){
                return $('.overworld-locations').is(':visible');
            },
            isChooseParty: function(){
                return $('.page-dungeon-chooseparty').is(':visible');
            },
            isAdventure: function(){
                return $('.dungeon-map-inner').is(':visible') && !$('.modal-window').is(':visible');
            },
            isSelectCompanion: function(){
                return $('.encounter-party-list').is(':visible');
            },
            isEncounter: function(){
                return $('.page-dungeons').is(':visible') && 
                        (!$('.modal-window').is(':visible') || 
                          $('.modal-confirm.combat-wild > h3:contains(' + data.text.criticalHit + ')').is(':visible'));
            },
            isDiceRoller: function(){
                return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
            },
            isModal: function(){
                return $('.modal-window').is(':visible');
            }
        },
        text:{
            chooseYourParty: 'Choose Your Party',
            ok: 'OK',
            d20: 'D20',
            criticalHit: 'Critical Hit!'
        }
    };

    
    var Adventure = function(character, dicePickerBrain){

        var _adv = [
            {
                tier: "tier-[1|2|3|4|5|6]",
                companions: [ 
                    {
                        "name":"cleric",
                        "required":true||false,
                    },
                    {
                        "name":"guy",
                        "required":true||false,
                    }
                ]
            },
            {
                tier: "tier-1",
                companions: [ 
                    {
                        "name":"lowbies",
                        "required":true||false,
                    }
                ]
            },

        ];

        this.character = character;
        this.changeCharacter = $.nwg.changeCharacter.create(this.character);
        this.adventures = this.character.adv;
        this.dicePicker = $.nwg.dicePicker.create(this.character, 
            !dicePickerBrain ? $.nwg.dicePickerBrain.create() : dicePickerBrain);
    };

    Adventure.prototype.make_adventure_active = function(task) {
        $('.nav-dungeons').trigger('click');
        return {
            error: false,
            delay: 3000
        };
    };

    Adventure.prototype.check_adventure_state = function(task) {
        //var task = self.crete_base_task();
        /*
            Should only be called from the crate_base_task method
        */

        if(data.state.isOverWorld()){
            console.log("isOverWorld");
            task.then(this.start_adventure.bind(this))
            task.then(this.confirm_adventure.bind(this));
            task.then(this.clear_adventure_party.bind(this));
            task.then(this.select_adventure_party.bind(this));
        }
        else if(data.state.isSelectCompanion()){
            console.log("isSelectCompanion");
            task.then(this.clear_adventure_party.bind(this));
            task.then(this.select_adventure_party.bind(this));
        }
        else if(data.state.isEncounter()){
            console.log("isEncounter");
            task.then(this.dicePicker.pick_die.bind(this.dicePicker));
        }
        //isAdventure
            //select encounter
        //isSelectCompanion
            //choose encounter companion
        //isEncounter || isCritical
            //select die
        //isDiceRoller
            //wait
        //isModal
            //clear
        else if (data.state.isModal){
            task.then(this.clear_modal.bind(this));
        }
        //else

        return {error:false, delay: 3000};
    };


    Adventure.prototype.start_adventure = function(task) {
        console.log("start_adventure");
        $('a.' + 'tier-1').trigger('click');
        
        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.confirm_adventure = function(task) {
        console.log("confirm_adventure");
        $('.choosePartyButton > button:contains(' + data.text.chooseYourParty + ')').trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_adventure_party = function(old_task) {
        console.log("select_adventure_party");
        //select adventure party member (which attemps to cancel the confirm if up THEN clears THEN selects)
        var PARTY_SIZE = 4;
        var adventures = this.adventures;
        var self = this;
        var companionsToSelect = [];

        $(adventures).each(function(indx, adventure){

            var tier = adventure.tier;
            var adventureCompanions = adventure.companions;
            var requiredCompanions = [];
            var optionalCompanions = [];
            var totalCompanionCount = $('.party-entry.full-sheet:not(.promo)').length;
            var disabledCount = $('.party-entry.full-sheet.disabled').length;
            var maxAvailableCount = totalCompanionCount - disabledCount;
            var availableCompanions = $('.party-entry.full-sheet.available:not(.promo)>a:not(.selected)');

            if(adventureCompanions && adventureCompanions.length > 0 && 
                totalCompanionCount > PARTY_SIZE && maxAvailableCount > PARTY_SIZE){

                $(availableCompanions).each(function(indx, aCmp){
                    var aComp = $(aCmp);
                    var matched = false;
                    $(adventureCompanions).each(function(indx, cmp){
                        var companion = aComp.has(':contains(' + cmp.name + ')');
                        if(companion.length === 1){
                            matched = true;
                            if(cmp.required){
                                requiredCompanions.push(companion);
                            }
                            else if(!cmp.excluded){
                                optionalCompanions.push(companion);
                            }
                        }
                    });
                    if(!matched){
                        optionalCompanions.push(aComp);
                    }
                    //console.log("rC=" + requiredCompanions.length + " | oC=" + optionalCompanions.length);
                });


                if(requiredCompanions.length + optionalCompanions.length >= PARTY_SIZE){
                    
                    for(var i = 0; i < requiredCompanions.length && i < PARTY_SIZE; i++){
                        companionsToSelect.push($(requiredCompanions[i]));
                    }

                    for(var ii = 0; ii < optionalCompanions.length && ii < PARTY_SIZE && ii < PARTY_SIZE - requiredCompanions.length; ii++){
                        companionsToSelect.push($(optionalCompanions[ii]));
                    }

                    return false;
                }
            }
            else if(totalCompanionCount <= PARTY_SIZE && disabledCount === 0){
                companionsToSelect = availableCompanions;
                return false;
            }
        });

        if(companionsToSelect.length > 0){
            for(var i = 0; i < companionsToSelect.length && i < PARTY_SIZE; i++){
                $(companionsToSelect[i]).trigger('click');
            }

            var task = self.create_base_task();
            task.then(self.comfirm_adventure_party.bind(self));
            task.then(self.select_encounter.bind(self));
            task.then(self.select_encoutner_companion.bind(self));
            task.then(self.select_die.bind(self));

            task.start_in(1500);
        }

        old_task.finish();
    };

    Adventure.prototype.clear_adventure_party = function(task){
        console.log("clear_adventure_party");
        var partyCloseButtons = $('.party-entry > button.close-button');
        partyCloseButtons.each(function(idx, btn) {
            $(btn).trigger('click');
        });

        return {
            error: false,
            delay: 3000
        };
    };

    Adventure.prototype.comfirm_adventure_party = function(task) {
        console.log("comfirm_adventure_party");
        $('.modal-window  button:contains(' + data.text.ok + ')').trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_encounter = function(task) {
        console.log("select_encounter");
        if($('.dungeon-map-inner').length === 0){
            //console.log("Dungeon not ready");
            return {
                error: false,
                delay: 1000
            };
        }
        var encounters = $('.overlay.button:not(.complete, .exit, .boss)');
        var boss = $('.overlay.button.boss');

        //console.log("[encounters=" + encounters.length + "]");
        if(encounters.length > 0){
            encounters.eq(0).trigger('click');
        }
        else if(boss.length > 0){
            boss.eq(0).trigger('click');
        }

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_encoutner_companion = function(task) {
        console.log("select_encoutner_companion");
        var companions = $('a.selectable');
        if(!companions.length){
            //console.log("companions not found");
            return {
                error: false,
                delay: 1000
            };
        };
        $('a.selectable').eq(0).trigger('click');
        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.clear_modal = function(task) {
        var m = $('.modal-window');

        var okBtn = m.find('button:contains(' + data.text.ok + ')')
        var d20Btn = m.find('button:contains('+ data.text.d20+')');

        if(okBtn.length === 1){
            okBtn.trigger('click');
        }
        if(d20Btn.l === 1){
            d20Btn.trigger('click');
        }

        return {
            error:false,
            delay: 3000
        }
    };

    Adventure.prototype.create_base_task = function create_base_task() {
        var self = this;
        var task = $.task.create(this.changeCharacter.activate.bind(this.changeCharacter));
        task.then(this.make_adventure_active.bind(this));
        task.then(this.check_adventure_state.bind(this));

        return task;
    };


    $.extend(true, $.nwg, {
        adventure: {
            create:function(character){
                return new Adventure(character);
            }
        }
    });

}(jQuery));