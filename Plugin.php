<?php
/**
 * 代码显示样式风格 可多用户不同风格
 * 根据作者 hongweipeng(https://www.hongweipeng.com) 的 CodeStyle 修改制作
 * 
 * @package TypechoCodeHighlight 
 * @author Ammmm
 * @version 1.0.0
 * @link https://blog.huangyixu.cn
 */
class TypechoCodeHighlight_Plugin implements Typecho_Plugin_Interface
{
    /**
     * 激活插件方法,如果激活失败,直接抛出异常
     * 
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function activate()
    {
        Typecho_Plugin::factory('Widget_Archive')->header = array(__CLASS__, 'header');
        Typecho_Plugin::factory('Widget_Archive')->footer = array(__CLASS__, 'footer');
    }

    /**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     * 
     * @static
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function deactivate()
    {
    }

    /**
     * 获取插件配置面板
     * 
     * @access public
     * @param Typecho_Widget_Helper_Form $form 配置面板
     * @return void
     */
    public static function config(Typecho_Widget_Helper_Form $form)
    {
        //设置代码风格样式
        $styles = array_map('basename', glob(dirname(__FILE__) . '/highlight/styles/*.min.css'));
        $stylesname = array_map(function (&$v) {
            return substr_replace($v, "", strpos($v, ".min.css"), strlen(".min.css"));
        }, $styles);
        $styles = array_combine($stylesname, $stylesname);
        $name = new Typecho_Widget_Helper_Form_Element_Select('code_style', $styles, 'atom-one-light', _t('选择你的代码风格'));
        $form->addInput($name->addRule('enum', _t('必须选择配色样式'), $styles));
        $showLineNumber = new Typecho_Widget_Helper_Form_Element_Checkbox('showln', array('showln' => _t('显示行号')), array('showln'), _t('是否在代码左侧显示行号'));
        $form->addInput($showLineNumber);

    }

    /**
     * 个人用户的配置面板
     * 
     * @access public
     * @param Typecho_Widget_Helper_Form $form
     * @return void
     */
    public static function personalConfig(Typecho_Widget_Helper_Form $form)
    {
    }

    /**
     * 插件实现方法
     * 
     * @access public
     * @return void
     */
    public static function render()
    {

    }

    /**
     *为header添加css文件
     *@return void
     */
    public static function header()
    {
        // $style = Helper::options()->plugin('TypechoCodeHighlight')->code_style;
        // $cssUrl = Helper::options()->pluginUrl . '/TypechoCodeHighlight/highlight/styles/' . $style . '.min.css';
        // $codeCssUrl = Helper::options()->pluginUrl . '/TypechoCodeHighlight/code.css';
        // echo '<link rel="stylesheet" type="text/css" href="' . $cssUrl . '" />';
        // echo '<link rel="stylesheet" type="text/css" href="' . $codeCssUrl . '" />';
        // if (Helper::options()->plugin('TypechoCodeHighlight')->showln) {
        //     echo '<link rel="stylesheet" type="text/css" href="' . Helper::options()->pluginUrl . '/TypechoCodeHighlight/highlightjs-line.css" />';
        // }
    }

    /**
     *为footer添加js文件
     *@return void
     */
    public static function footer()
    {
        // $jsUrl = Helper::options()->pluginUrl . '/TypechoCodeHighlight/highlight/highlight.min.js';
        // $lineUrl = Helper::options()->pluginUrl . '/TypechoCodeHighlight/highlightjs-line-numbers.min.js';
        // $showIn = Helper::options()->plugin('TypechoCodeHighlight')->showln;
//         echo <<<HTML
//             <script type="text/javascript" src="{$jsUrl}"></script>
//             <script type="text/javascript">
//                 async function copy(copyTxt) {
//                     try {
//                         await navigator.clipboard.writeText(copyTxt);
//                         // console.log('Page URL copied to clipboard');
//                     } catch (err) {
//                         console.error('Failed to copy: ', err);
//                     }
//                 }
//                 const preList = document.getElementsByTagName('pre')
//                 for (let i = 0; i < preList.length; i++) {
//                     const codepre = preList[i]
//                     if (codepre.children[0].tagName === 'CODE') {
//                         const lang = codepre.children[0].className.split(' ')[0].split('lang-')[1]
//                         const codeTxt = codepre.children[0].innerHTML

//                         codepre.style.marginTop = '0'
//                         codepre.style.paddingTop = '0'
//                         codepre.style.background = '#e9e9e9'
//                         codepre.children[0].style.maxHeight = '370px'

//                         const codeTitle = document.createElement('div')
//                         codeTitle.style = 'height: 28px; width: 100%; background: #e9e9e9; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 0 14px; font-size: 12px; font-weight: bold; border-radius: 6px 6px 0 0;'

//                         const title = document.createElement('span')
//                         title.style.color = 'black'
//                         title.innerText = lang

//                         const copyButton = document.createElement('span')
//                         copyButton.style = 'color: #666; cursor: pointer; transition: all 0.3s;'
//                         copyButton.innerText = '复制'
//                         copyButton.onclick = () => {
//                             copy(codeTxt)
//                             copyButton.innerText = '已复制'
//                             copyButton.style.color = '#2080f0'
//                             setTimeout(() => {
//                                 copyButton.innerText = '复制'
//                                 copyButton.style.color = '#666'
//                             }, 1000)
//                         }

//                         codeTitle.appendChild(title)
//                         codeTitle.appendChild(copyButton)

//                         codepre.before(codeTitle)
//                         hljs.highlightElement(codepre.children[0]);
//                     }
//                 }
//             </script>
// HTML;
//         if ($showIn) {
//             echo <<<HTML
//             <script type="text/javascript" src="{$lineUrl}"></script>
//             <script type="text/javascript">
//                 hljs.initLineNumbersOnLoad();
//             </script>
// HTML;

//         }
        $jsUrl = Helper::options()->pluginUrl . '/TypechoCodeHighlight/index.js';
        echo <<<HTML
        <script type="text/javascript" src="{$jsUrl}"></script>
        <script type="text/javascript">
            const preCode1 = new IframeSandbox({
                showln: true,
                content: 'console.log("Hello, world!");',
                lang: 'javascript'
            });
        </script>
        HTML;
    }
}
