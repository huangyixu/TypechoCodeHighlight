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
    public static function deactivate() {}

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
    public static function personalConfig(Typecho_Widget_Helper_Form $form) {}

    /**
     * 插件实现方法
     * 
     * @access public
     * @return void
     */
    public static function render() {}

    /**
     *为header添加css文件
     *@return void
     */
    public static function header() {}

    /**
     *为footer添加js文件
     *@return void
     */
    public static function footer()
    {
        $rootDirname = Helper::options()->pluginUrl . '/TypechoCodeHighlight';
        $style = Helper::options()->plugin('TypechoCodeHighlight')->code_style;
        // $showln = Helper::options()->plugin('TypechoCodeHighlight')->showln;
        // js中访问$showln永远是true，所以需要单独判断
        if (Helper::options()->plugin('TypechoCodeHighlight')->showln) {
            $showln = true;
        } else {
            $showln = false;
        }
        echo <<<HTML
        <script type="text/javascript" src="{$rootDirname}/index.js"></script>
        <script type="text/javascript">
            const preList = document.getElementsByTagName('pre')
            const codeList = []
            for (let i = 0; i < preList.length; i++) {
                const codepre = preList[i]
                if (codepre.children[0].tagName === 'CODE') {
                    const language = codepre.children[0].className.split(' ')[0].split('lang-')[1]
                    const content = codepre.children[0].innerHTML

                    codeList[i] = {
                        originalElement: codepre,
                        language,
                        content,
                    }
                }
            }
            // 在上个for循环中直接操作节点会实时改变preList数组长度，并且使用反循环的话页面会从低到高渲染
            Promise.all(codeList.map((item, index) => {
                codeList[index].iframe = new IframeSandbox({
                    showln: "{$showln}",
                    cssName: "{$style}",
                    content: item.content,
                    language: item.language,
                    originalElement: item.originalElement,
                }, "{$rootDirname}")
            }))
        </script>
        HTML;
    }
}
