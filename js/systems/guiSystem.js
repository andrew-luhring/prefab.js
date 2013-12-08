define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/subSystem',
        'graphics/device',
        'graphics/vertexElement',
        'graphics/vertexDeclaration',
        'graphics/spriteFont',
        'graphics/meshFactory',
        'graphics/mesh',
        'components/meshFilter',
        'components/meshRenderer'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        SubSystem,
        GraphicsDevice,
        VertexElement,
        VertexDeclaration,
        SpriteFont,
        MeshFactory,
        Mesh,
        MeshFilter,
        MeshRenderer
    ) {
        'use strict';

        var GUISystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['GUIElement']);

            this.device = device;
            this.fontCache = {};
            this.meshFactory = new MeshFactory(this.device);
        };

        GUISystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: GUISystem,

            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('GUIText')) {
                            this.updateText(entity);
                        }
                    }
                }
            },

            updateText: function(entity) {
                var transform    = entity.getComponent('Transform');
                var guiElement   = entity.getComponent('GUIElement');
                var guiText      = entity.getComponent('GUIText');
                var meshFilter   = entity.getComponent('MeshFilter');
                var meshRenderer = entity.getComponent('MeshRenderer');

                if (typeof meshFilter === 'undefined') {
                    meshFilter = new MeshFilter();
                    entity.addComponent(meshFilter);
                }

                if (typeof meshRenderer === 'undefined') {
                    meshRenderer = new MeshRenderer();
                    entity.addComponent(meshRenderer);
                }

                if (guiText.isDirty()) {
                    if (typeof meshFilter.mesh !== 'undefined') {
                        meshFilter.mesh.destroy();
                    }

                    guiText._spriteFont = this.generateSpriteFont(guiText);

                    meshRenderer.material.diffuseMap = guiText._spriteFont._texture;
                    meshRenderer.material.setDirty(true);

                    meshFilter.mesh = this.generateTextMesh(guiElement, guiText);
                    meshFilter.setDirty(true);

                    guiText.setDirty(false);
                }
            },

            generateSpriteFont: function(guiText) {
                var fontDef = guiText.getFontStyle();
                var spriteFont = this.fontCache[fontDef];
                if (typeof spriteFont === 'undefined') {
                    spriteFont = new SpriteFont(this.device, guiText);
                    this.fontCache[fontDef] = spriteFont; 
                }
                return spriteFont;
            },

            generateTextMesh: function(guiElement, guiText) {
                var mesh = new Mesh(this.device);
                this.meshFactory.begin(mesh);

                this.generateCharacterMesh(guiElement, guiText);

                this.meshFactory.end();
                return mesh;
            },

            generateCharacterMesh: function(guiElement, guiText) {
                var i, len = guiText.content.length;
                var character, sprite, currentWidth = 0, currentHeight = 0;
                var u, v, w, h, a, b, c, d, count;

                for (i = 0; i < len; i++) {
                    character = guiText.content.charAt(i);

                    if (character === '\n') {
                        currentWidth = 0;
                        currentHeight += guiText.lineHeight;
                    } else {
                        sprite = guiText._spriteFont.getSprite(character);

                        if (currentWidth + sprite.width > guiElement.boundingBox.width) {
                            currentWidth = 0;
                            currentHeight += guiText.lineHeight;
                        }
                        currentWidth += sprite.width;

                        u = sprite.getUCoordinate();
                        v = 1 - sprite.getVCoordinate();
                        w = sprite.getUVWidth();
                        h = -sprite.getUVHeight();

                        a = currentWidth - sprite.width;
                        b = currentWidth;
                        c = currentHeight - sprite.height;
                        d = currentHeight;

                        var vertexCount = this.meshFactory.getVertexCount();

                        this.meshFactory.addVertex(new Vector3(a, c, 0));
                        this.meshFactory.addVertex(new Vector3(b, c, 0));
                        this.meshFactory.addVertex(new Vector3(b, d, 0));
                        this.meshFactory.addVertex(new Vector3(a, d, 0));

                        this.meshFactory.addUVtoLayer0(new Vector2(u,   v  ));
                        this.meshFactory.addUVtoLayer0(new Vector2(u+w, v  ));
                        this.meshFactory.addUVtoLayer0(new Vector2(u+w, v+h));
                        this.meshFactory.addUVtoLayer0(new Vector2(u  , v+h));

                        this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                        this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
                    }
                }
            }
        });

        return GUISystem;
    }
);
