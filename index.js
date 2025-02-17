// Class 写法
class IframeSandbox {
	// 创建公有属性
	iframe = null;
	window = null;
	showln = false;
	content = '';
	lang = '';

	constructor({ showln = false, content = '', originalElement }) {
		console.log('入口');

		// 从原始元素中获取content 以及 lang
		this.content = originalElement.children[0].textContent;
		this.lang = originalElement.children[0].className.split(' ')[0].split('lang-')[1];

		this.showln = showln;
		this.content = content;

		// 插入到body中
		this.iframe = this.createIframe();
		// document.body.appendChild(this.iframe);
		originalElement.replaceWith(this.iframe);

		this.window = this.iframe.contentWindow;

		// this.iframe.src = 'about:blank';
	}

	// 创建一个iframe的沙盒环境
	createIframe() {
		const iframe = document.createElement('iframe');
		iframe.className = 'tch-precode-iframe';
		iframe.style.width = '100%';
		iframe.style.border = 'none';
		iframe.style.overflow = 'hidden';
		return iframe;
	}

	// 创建一个precode的标题
	createTitle() {
		const titleElement = document.createElement('div');
		titleElement.className = 'title';
		titleElement.textContent = this.lang;
		titleElement.style.display = 'flex';
		titleElement.style.alignItems = 'center';
		titleElement.style.justifyContent = 'space-between';
		titleElement.style.padding = '0 10px';
		titleElement.style.height = '30px';
		titleElement.style.backgroundColor = '#f0f0f0';
		titleElement.style.borderRadius = '4px 4px 0 0';
		return titleElement;
	}

	// 创建一个precode标签
	createBody() {
		const preElement = document.createElement('pre');
		const codeElement = document.createElement('code');
		codeElement.textContent = this.content;
		codeElement.className = `language-${this.lang}`;
		preElement.appendChild(codeElement);
		return preElement;
	}
}
