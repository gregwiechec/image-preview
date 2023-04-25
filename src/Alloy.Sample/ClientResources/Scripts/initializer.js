define([
    "dojo",
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/when",

    "epi/_Module",

    "epi-cms/contentediting/editors/ContentAreaEditor",
    "epi-cms/contentediting/editors/_ContentAreaTreeModel"
], function (
    dojo,
    declare,
    aspect,
    when,

    _Module,

    ContentAreaEditor,
    _ContentAreaTreeModel
) {
    /* ============================================================= */
    /* A custom logic for resolving display options */
    function resolveDisplayOption(currentContent, propertyName, item) {
        if (currentContent.typeIdentifier.indexOf("startpage") === -1) {
            return null;
        }

        if (propertyName !== "mainContentArea") {
            return null;
        }

        if (item.data.typeIdentifier.indexOf("pagelistblock") !== -1) {
            return "wide";
        }
        if (item.data.typeIdentifier.indexOf("teaserblock") !== -1) {
            return "narrow";
        }

        return null;
    }

    /* ============================================================= */

    function updateDisplayOption(model, item, propertyName, dndData) {
        when(model.getCurrentContent()).then(function (currentContent) {
            var displayOption = resolveDisplayOption(currentContent, propertyName, dndData);
            if (displayOption) {
                item.attributes["data-epi-content-display-option"] = displayOption;
            }
        });
    }

    // handle D&D at the of the list
    var originalBuildRendering = ContentAreaEditor.prototype.buildRendering;
    ContentAreaEditor.prototype.buildRendering = function () {
        var result = originalBuildRendering.apply(this, arguments);

        this.model.propertyName = this.name;
        this.own(aspect.after(this._dndTarget, "onDropData", function (dndData, source, nodes, copy) {
            this.model.modify(function () {
                (dndData || []).forEach(function (dndItem, index) {
                    var items = this.model.getChildren();
                    var item = items[items.length - dndData.length + index];
                    updateDisplayOption(this.model, item, this.name, dndItem);
                }.bind(this));
            }.bind(this));
        }.bind(this), true));

        return result;
    };
    ContentAreaEditor.prototype.buildRendering.nom = "buildRendering";

    // handle selection from dialog
    var originalOnDialogExecute = ContentAreaEditor.prototype.onDialogExecute;
    ContentAreaEditor.prototype.onDialogExecute = function (selectedContent) {
        var result = originalOnDialogExecute.apply(this, arguments);

        this.model.modify(function (dndData) {
            var items = this.model.getChildren();
            var item = items[items.length - 1];
            updateDisplayOption(this.model, item, this.name, { data: selectedContent });
        }.bind(this));

        return result;
    };
    ContentAreaEditor.prototype.onDialogExecute.nom = "onDialogExecute";

    // handle D&D between items
    var originalNewItem = _ContentAreaTreeModel.prototype.newItem;
    _ContentAreaTreeModel.prototype.newItem = function (args, parent, insertIndex, before) {
        var result = originalNewItem.apply(this, arguments);

        var parentModel = parent.id === "root" ? this.model : this.model.getChildById(parent.id);
        this.model.modify(function () {
            var items = parentModel.getChildren();
            var item = items[insertIndex];
            updateDisplayOption(parentModel, item, this.model.propertyName, args.dndData);
        }.bind(this));

        return result;
    };
    _ContentAreaTreeModel.prototype.newItem.nom = "newItem";


    return declare([_Module], {});
});
