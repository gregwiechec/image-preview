define([
        "dojo/_base/declare",
        "dojo/date/locale",
        "dojo/topic",
        "dojo/when",

        "dijit/_CssStateMixin",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/popup",

        "epi/dependency",

        "dijit/form/Button",

        "xstyle/css!./image-tooltip.css"
    ],
    function (
        declare,
        locale,
        topic,
        when,

        _CssStateMixin,
        _Widget,
        _TemplatedMixin,
        _WidgetsInTemplateMixin,
        popup,

        dependency
    ) {
        function formatBytes(bytes, decimals = 2) {
            if (!+bytes) return '0 Bytes'

            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

            const i = Math.floor(Math.log(bytes) / Math.log(k))

            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin], {

            templateString: `<div class="dijitInline image-tooltip-container" tabindex="-1" role="presentation">
                                <button data-dojo-type="dijit/form/Button" class="epi-chromelessButton close-button" data-dojo-props="iconClass:'epi-iconClose', showLabel:false" data-dojo-attach-event="onClick:_onClose"></button>
                            <div class="image-container">
                                <div>
                                    <img data-dojo-attach-point="tooltipImage" />
                                </div>
                            </div>
                            <div class="image-info">
                                <table>
                                    <tbody data-dojo-attach-point="info"></tbody>
                                </table>
                                <div class="footer">
                                    <h3>References</h3>
                                    <div data-dojo-attach-point="footer"></div>
                                </div>
                            </div>
                        </div>`,

            postCreate: function () {
                this.inherited(arguments);

                this.tooltipImage.onload = function () {
                    var value = this.tooltipImage.naturalWidth + " x " + this.tooltipImage.naturalHeight;
                    this.info.insertBefore(this._createInfoNode("Dimensions", value), this.info.children[1]);

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', this.tooltipImage.src, true);
                    xhr.responseType = 'blob';
                    xhr.onload = function()
                    {
                        var blob = xhr.response;
                        this.info.insertBefore(this._createInfoNode("Size", formatBytes(blob.size)), this.info.children[2]);
                    }.bind(this);
                    xhr.send();
                }.bind(this);
            },

            _setImageUrlAttr: function (value) {
                this.tooltipImage.src = value;
            },

            _setContentAttr: function (content) {
                this.info.innerHTML = "";

                this.info.appendChild(this._createInfoNode("Name", content.name, undefined, content.publicUrl));
                this.info.appendChild(this._createInfoNode("Changed", locale.format(new Date(content.changed), {
                    selector: "date",
                    formatLength: "short"
                })));
                this.info.appendChild(this._createInfoNode("Changed by", content.changedBy, "main-properties-end"));

                when(this._getStore().get(content.contentLink)).then(function (contentDetails) {
                    if (this._destroyed) {
                        return;
                    }
                    this.info.appendChild(this._createInfoNode("Copyright", contentDetails.properties.copyright, "first-property"));
                }.bind(this));

                when(this._getReferencesStore().query({ ids: [content.contentLink] })).then(function (result) {
                    if (result.length === 0 || result[0].references.length === 0) {
                        this.footer.innerHTML = "No references";
                        return;
                    }

                    this.footer.innerHTML = "";
                    result[0].references.forEach(function (link, index) {
                        var anchor = document.createElement("a");
                        anchor.innerHTML = link.name;
                        anchor.onclick = function () {
                            popup.close();
                            topic.publish("/epi/shell/context/request", { uri: link.uri }, { sender: this });

                        };
                        this.footer.appendChild(anchor);

                        if (index < result[0].references.length - 1) {
                            var anchorDelimiter = document.createTextNode(", ");
                            this.footer.appendChild(anchorDelimiter);
                        }
                    }, this);
                }.bind(this));
            },

            _createInfoNode: function (name, value, rowClass, link) {
                var tr = document.createElement("tr");
                if (rowClass) {
                    tr.classList.add(rowClass);
                }

                var tdName = document.createElement("td");
                tdName.innerText = name + ":";
                tr.appendChild(tdName);

                var tdValue = document.createElement("td");
                if (link) {
                    var anchor = document.createElement("a");
                    anchor.classList.add("epi-functionLink");
                    anchor.innerText = value;
                    anchor.target = "_blank";
                    anchor.href = link;
                    tdValue.appendChild(anchor);
                } else {
                    tdValue.innerText = value;
                }
                tr.appendChild(tdValue);

                return tr;
            },

            _getStore: function () {
                if (!this._store) {
                    var registry = dependency.resolve("epi.storeregistry");
                    this._store = registry.get("epi.cms.contentdata");
                }
                return this._store;
            },

            _getReferencesStore: function () {
                if (!this._referencesStore) {
                    var registry = dependency.resolve("epi.storeregistry");
                    this._referencesStore = registry.get("epi.cms.referenced-content");
                }
                return this._referencesStore;
            },

            _onClose: function () {
                popup.close();
            }
        });
    });
