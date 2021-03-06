define([
        'lodash',
        'core/component',
        'core/events'
    ],
    function(
        _,
        Component,
        Events
    ) {
        'use strict';

        var _entityCount = 0;

        var Entity = function(){
            this.uuid = Entity.generateUUID();
            this.name = '';
            this.id = _entityCount++;
            this.components = {};

            this.parent = null;
            this.children = [];
        };

        Entity.prototype = {
            constructor: Entity,

            hasParent: function() {
                return this.parent !== null;
            },

            getParent: function() {
                return this.parent;
            },

            setParent: function(entity) {
                this.parent = entity;
            },

            addChild: function(entity) {
                if (entity instanceof Entity) {
                    this.children.push(entity);
                    entity.setParent(this);
                }
            },

            removeChild: function(entity) {
                var index = this.children.indexOf(entity);
                if (index > -1) {
                    this.children.splice(index, 0);
                    entity.setParent(null);
                }
            },

            addComponent: function(component) {
                if (component instanceof Component) {
                    if (typeof component.constructor.__name__ === 'undefined') {
                        throw 'Entity: addComponent(), cannot add component with undefined constructor.__name__';
                    }
                    component.setEntity(this);
                    this.components[component.constructor.__name__] = component;
                    this.trigger('component.added', component);
                }
            },

            getComponent: function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }
                return this.components[type];
            },

            hasComponent: function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }
                return typeof this.components[type] !== 'undefined';
            },

            removeComponent: function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }

                var component = this.components[type];
                delete this.components[type];

                if (component) {
                    this.trigger('component.removed', component);
                }
            },

            toString: function() {
                return this.name;
            }
        };

        Entity.generateUUID = (function (){
            // http://www.broofa.com/Tools/Math.uuid.htm
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var charArray = chars.split('');
            var uuid = new Array(36);
            var rnd = 0, r, i;
            return function () {
                for (i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) {
                        uuid[i] = '-';
                    } else if (i === 14) {
                        uuid[i] = '4';
                    } else {
                        if (rnd <= 0x02) {
                            rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        } 
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return uuid.join('');
            };
        }());

        _.extend(Entity.prototype, Events.prototype);

        return Entity;
    }
);
