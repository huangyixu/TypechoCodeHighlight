class IframeSandbox {
	// 创建公有属性
	iframe = null;
	window = null;

	showln = false;
	cssName = "";
	content = "";
	language = "";

	codeElement = null;
	titleElement = null;
	copyElement = null;

	constructor({ showln = false, cssName, content, language, originalElement }, rootDirname) {
		this.showln = showln;
		this.cssName = cssName;
		this.content = content;
		this.language = language;

		this.iframe = document.createElement("iframe");
		this.iframe.src = `${rootDirname}/highlight/template.html`;
		this.iframe.title = language;
		this.iframe.style = `
			width: 100%;
			height: 83.33px;
			border: none;
			overflow: hidden;
			border-radius: 4px;
		`;
		originalElement.replaceWith(this.iframe);

		this.window = this.iframe.contentWindow;

		this.iframe.onload = () => {
			this.loadStatic();

			this.codeElement = this.window.document.querySelector("code");
			this.titleElement = this.window.document.querySelector(".title");
			this.copyElement = this.window.document.querySelector(".copy");

			this.render();
		};
	}

	loadStatic() {
		const styleLink = document.createElement("link");
		styleLink.href = `./styles/${this.cssName}.min.css`;
		styleLink.rel = "stylesheet";
		styleLink.type = "text/css";
		this.window.document.head.appendChild(styleLink);
	}

	render() {
		this.window.document.documentElement.setAttribute("theme", this.cssName.includes("dark") ? "dark" : "light");
		this.codeElement.classList.add(`language-${this.language}`);
		this.titleElement.innerHTML = this.language;
		this.codeElement.innerHTML = this.content;
		this.copyElement.onclick = () => {
			copy(this.content);
			this.copyElement.innerHTML = "已复制";
			this.copyElement.style.color = "#2080f0";
			setTimeout(() => {
				this.copyElement.innerHTML = "复制";
				this.copyElement.style.color = "#666";
			}, 1000);
		};

		this.window.hljs.highlightElement(this.codeElement);
		if (this.showln) {
			this.window.hljs.initLineNumbersOnLoad();
		}
		setTimeout(() => {
			this.iframe.style.height = `${this.window.document.body.scrollHeight}px`;
		}, 0);
	}
}

async function copy(copyTxt) {
	try {
		await navigator.clipboard.writeText(copyTxt);
		// console.log('Page URL copied to clipboard');
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
}
