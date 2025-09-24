(function (global) {
    'use strict';

    function detectLanguage(codeElement) {
        if (!codeElement || !codeElement.className) {
            return '';
        }
        var classes = codeElement.className.split(/\s+/);
        for (var i = 0; i < classes.length; i += 1) {
            var cls = classes[i];
            if (!cls) {
                continue;
            }
            if (cls.indexOf('language-') === 0) {
                return cls.substring('language-'.length);
            }
            if (cls.indexOf('lang-') === 0) {
                return cls.substring('lang-'.length);
            }
        }
        return '';
    }

    function sanitizeStyleName(name) {
        if (typeof name !== 'string') {
            return '';
        }
        var normalized = name.trim();
        return /^[\w-]+$/.test(normalized) ? normalized : '';
    }

    function IframeSandbox(config, rootDirname) {
        this.config = config;
        this.rootDirname = rootDirname;
        this.iframe = document.createElement('iframe');
        this.iframe.src = rootDirname + '/highlight/template.html';
        this.iframe.title = config.language || 'code block';
        this.iframe.setAttribute('sandbox', 'allow-scripts allow-clipboard-write');
        this.iframe.allow = 'clipboard-write';
        this.iframe.style.width = '100%';
        this.iframe.style.border = 'none';
        this.iframe.style.overflow = 'hidden';
        this.iframe.style.borderRadius = '4px';
        this.iframe.style.padding = '0';
        this._handleMessage = this._handleMessage.bind(this);
        window.addEventListener('message', this._handleMessage, false);
        config.originalElement.parentNode.replaceChild(this.iframe, config.originalElement);
        var self = this;
        this.iframe.addEventListener('load', function () {
            self._postConfig();
        });
    }

    IframeSandbox.prototype._postConfig = function () {
        if (!this.iframe.contentWindow) {
            return;
        }
        var cssName = sanitizeStyleName(this.config.cssName) || 'atom-one-light';
        this.iframe.contentWindow.postMessage({
            type: 'render',
            payload: {
                cssName: cssName,
                language: this.config.language || '',
                content: this.config.content || '',
                showLineNumber: !!this.config.showln,
            },
        }, '*');
    };

    IframeSandbox.prototype._handleMessage = function (event) {
        if (event.source !== this.iframe.contentWindow || !event.data) {
            return;
        }
        var data = event.data;
        if (data.type === 'ready') {
            this._postConfig();
            return;
        }
        if (data.type === 'resize' && data.payload) {
            var height = Number(data.payload.height);
            if (!isNaN(height) && height > 0) {
                this.iframe.style.height = height + 'px';
            }
        }
    };

    IframeSandbox.prototype.destroy = function () {
        window.removeEventListener('message', this._handleMessage, false);
    };

    function collectCodeBlocks() {
        var preList = document.getElementsByTagName('pre');
        var blocks = [];
        for (var i = 0; i < preList.length; i += 1) {
            var pre = preList[i];
            var code = pre.querySelector('code');
            if (!code) {
                continue;
            }
            blocks.push({
                originalElement: pre,
                codeElement: code,
            });
        }
        return blocks;
    }

    function render(config) {
        if (!config || !config.rootDirname) {
            return;
        }
        var styleName = sanitizeStyleName(config.styleName) || 'atom-one-light';
        var showLineNumber = !!config.showLineNumber;
        var rootDirname = config.rootDirname.replace(/\/$/, '');
        var codeBlocks = collectCodeBlocks();
        for (var i = 0; i < codeBlocks.length; i += 1) {
            var block = codeBlocks[i];
            var language = detectLanguage(block.codeElement);
            var content = block.codeElement.textContent || '';
            new IframeSandbox({
                cssName: styleName,
                language: language,
                content: content,
                showln: showLineNumber,
                originalElement: block.originalElement,
            }, rootDirname);
        }
    }

    global.TypechoCodeHighlight = {
        render: render,
    };
})(window);
