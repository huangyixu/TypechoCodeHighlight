function generateHtml(rootDirname) {
	return `<!DOCTYPE html>
<html lang="en" theme="light">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>TypechoCodeHighlight</title>
		<link rel="stylesheet" type="text/css" href="${rootDirname}/highlight/highlightjs-line.css" />
		<style>
			@font-face {
				font-family: 'FiraCode';
				src: url('https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/woff2/FiraCode-Regular.woff2');
			}
			:root {
				--border-radius: 4px;
			}
			html[theme='dark'],
			html[data-theme='dark'] {
				--header-bg: #50505a;
				--text-color: #fff;
				--scrollbar-thumb-bg: #666;
			}
			html[theme='light'],
			html[data-theme='light'] {
				--header-bg: #e9e9e9;
				--text-color: #666;
				--scrollbar-thumb-bg: #ccc;
			}
			::-webkit-scrollbar {
				/*滚动条整体样式*/
				width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
				height: 10px;
			}
			::-webkit-scrollbar-thumb {
				/*滚动条里面小方块*/
				background: var(--scrollbar-thumb-bg);
				border-radius: var(--border-radius);
			}
			::-webkit-scrollbar-track {
				/*滚动条里面轨道*/
				background: transparent;
			}
			body {
				margin: 0;
				max-height: 400px;
			}
			.header {
				width: 100%;
				height: 30px;
				background: var(--header-bg);
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 14px;
				font-size: 12px;
				color: var(--text-color);
			}
			.title {
				font-weight: bold;
			}
			.copy {
				cursor: pointer;
				transition: all 0.3s;
			}
			pre {
				margin: 0;
				padding: 12px;
				padding-top: 0;
				background: var(--header-bg);
				box-sizing: border-box;
				display: flex;
				max-height: 370px;
				overflow: hidden;
			}
			code {
				width: 100%;
				box-sizing: border-box;
				padding: 1em;
				overflow-y: auto;
				max-height: calc(370px - 1em);
				border-radius: var(--border-radius);
				font-family: 'FiraCode';
			}
			code table {
				border: none;
			}
		</style>
	</head>
	<body>
		<div class="header">
			<span class="title"></span>
			<span class="copy">复制</span>
		</div>
		<pre>
            <code></code>
        </pre>
	</body>
</html>
`;
}

class IframeSandbox {
	// 创建公有属性
	iframe = null;
	window = null;

	showln = false;
	cssName = '';
	content = '';
	language = '';

	codeElement = null;
	titleElement = null;
	copyElement = null;

	constructor({ showln = false, cssName, content, language, originalElement }, rootDirname) {
		this.showln = showln;
		this.cssName = cssName;
		this.content = content;
		this.language = language;

		this.iframe = document.createElement('iframe');
		this.iframe.srcdoc = generateHtml(rootDirname);
		this.iframe.title = language;
		this.iframe.style = `
			width: 100%;
			height: 83.33px;
			border: none;
			overflow: hidden;
			border-radius: 4px;
			padding: 0 !important;
		`;
		originalElement.replaceWith(this.iframe);

		this.window = this.iframe.contentWindow;

		this.iframe.onload = () => {
			this.loadStatic(rootDirname);

			this.codeElement = this.window.document.querySelector('code');
			this.titleElement = this.window.document.querySelector('.title');
			this.copyElement = this.window.document.querySelector('.copy');

			this.render();
		};
	}

	loadStatic(rootDirname) {
		const styleLink = document.createElement('link');
		styleLink.href = `${rootDirname}/highlight/styles/${this.cssName}.min.css`;
		styleLink.rel = 'stylesheet';
		styleLink.type = 'text/css';
		this.window.document.head.appendChild(styleLink);
	}

	render() {
		this.window.document.documentElement.setAttribute('theme', this.cssName.includes('dark') ? 'dark' : 'light');
		this.codeElement.classList.add(`language-${this.language}`);
		this.titleElement.innerHTML = this.language;
		this.codeElement.innerHTML = this.content;
		this.copyElement.onclick = () => {
			copy(this.content);
			this.copyElement.innerHTML = '已复制';
			this.copyElement.style.color = '#2080f0';
			setTimeout(() => {
				this.copyElement.innerHTML = '复制';
				this.copyElement.style.color = '#666';
			}, 1000);
		};

		hljs.highlightElement(this.codeElement);
		if (this.showln) {
			hljs.initLineNumbersOnLoad();
		}
		setTimeout(() => {
			this.iframe.style.height = `${this.window.document.body.scrollHeight}px`;
		}, 0);
	}
}

function escape2Html(str) {
	var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };

	return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
		return arrEntities[t];
	});
}

async function copy(copyTxt) {
	try {
		// 对copyTxt进行转义, 防止特殊字符导致复制失败
		await navigator.clipboard.writeText(escape2Html(copyTxt));
		// console.log('Page URL copied to clipboard');
	} catch (err) {
		console.error('Failed to copy: ', err);
	}
}
