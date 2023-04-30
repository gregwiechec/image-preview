define([
    "dojo",
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/when",

    "epi/_Module",

    "dijit/popup",
    "dijit/TooltipDialog",

    "epi-cms/dgrid/formatters",
    "epi-cms/widget/ContentList",

    "./image-tooltip"
], function (
    dojo,
    declare,
    aspect,
    when,

    _Module,

    popup,
    TooltipDialog,

    formatters,
    ContentList,

    ImageTooltip
) {
    var additionalProperties;

    var originalGetBaseSettings = ContentList.prototype._getBaseSettings;
    ContentList.prototype._getBaseSettings = function () {
        var self = this;
        self._imageTooltipContainer = null;
        self._imageTooltip = null;
        self.closeTooltip = function() {
            popup.close(self._imageTooltipContainer);
        }

        var settings = originalGetBaseSettings.apply(this, arguments);
        var originalFormatter = settings.formatters[0];
        settings.formatters[0] = function(value, object, node, options) {
            var result = originalFormatter.apply(this, arguments);

            function showTooltip() {
                if (!self._imageTooltip) {
                    self._imageTooltip = new ImageTooltip({
                        additionalProperties: additionalProperties,
                        imageUrl: value.publicUrl,
                        content: value,
                    });
                    self.own(self._imageTooltip);

                    self._imageTooltipContainer = new TooltipDialog({
                        content: self._imageTooltip,
                        closable: true,
                        onMouseLeave: function () {
                            popup.close(self._tooltip);
                        }
                    });
                    self.own(self._imageTooltipContainer);
                    self._imageTooltipContainer.domNode.classList.add("image-tooltip");
                    self._imageTooltipContainer.own(self._imageTooltip);

                    self.grid.own(self._imageTooltipContainer);
                } else {
                    self._imageTooltip.set("imageUrl", value.publicUrl);
                    self._imageTooltip.set("content", value);
                }
                popup.open({
                    popup: self._imageTooltipContainer,
                    around: node.querySelector("img"),
                    orient: ["before-centered", "before", "above-centered", "below-centered", "below"]
                });
            }

            setTimeout(function() {
                var img = node.querySelector("img");
                if (img) {
                    img.onclick = showTooltip;
                }
            }, 0);

            return result;
        };
        return settings;
    }
    ContentList.prototype._getBaseSettings.nom = "_getBaseSettings";

    var originalOnSelect = ContentList.prototype._onSelect;
    ContentList.prototype._onSelect = function () {
        if (this.closeTooltip) {
            this.closeTooltip();
        }
        return originalOnSelect.apply(this, arguments);
    };
    ContentList.prototype._onSelect.nom = "_onSelect";

    var originalSetQueryAttr = ContentList.prototype._setQueryAttr;
    ContentList.prototype._setQueryAttr = function () {
        if (this.closeTooltip) {
            this.closeTooltip();
        }
        return originalSetQueryAttr.apply(this, arguments);
    };
    ContentList.prototype._onSelect.nom = "_setQueryAttr";

    return declare([_Module], {
        initialize: function () {
            additionalProperties = this._settings.additionalProperties
        }
    });
});
