define([
    ],
    function(
    ) {
        'use strict';

        var Component = function() {
            this._dirty = true;
            this._enabled = true;
            this._entity = null;
        };

        Component.prototype = {
            constructor: Component,

            hasEntity: function() {
                return this._entity !== null;
            },

            setEntity: function(entity) {
                this._entity = entity;
            },

            getEntity: function() {
                return this._entity;
            },

            isDirty: function() {
                return this._dirty;
            },

            setDirty: function(value) {
                this._dirty = value;
            },

            isEnabled: function() {
                return this._enabled;
            },

            setEnabled: function(value) {
                this._enabled = value;
            }
        };

        return Component;
    }
);
