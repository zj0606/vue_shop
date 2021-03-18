# vue_shop

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


1，项目优化
1.1 项目优化策略
	1.生成打包报告
	2.第三方库启用CDN
	3.Element-UI组件按需加载
	4.路由懒加载
	5.首页内容定制
	
	
	1.生成打包报告
	打包时，为了直观地发现项目中存在的问题，可以在打包时生成打包报告，生成打包报告的方式有两种：
	（1）通过命令行参数的形式生成报告
		//通过 vue-cli 的命令选项可以生成打包报告
		// --report 选项可以生成 report.html以帮助分析包内容
		vue-cli-service build --report
	 （2）通过可视化的UI 面板直接查看报告
			在可视化的UI面板中，通过 控制台 和 分析 面板，可以方便地看到项目中所存在的问题
	2.通过vue.config.js 修改webpack的默认配置
		通过vue-cli 3.0以上版本生成的项目，默认隐藏了所有的webpack的配置项。
		目的是为了屏蔽项目的配置过程，让程序员把工作重心 放到具体功能和业务逻辑的实现上。
	    
		如果想要修改对应的webpack配置。可以在项目的根目录中 按需创建vue.config.js这个配置文件，从而对项目的打包发布过程做自定义的配置
		https://cli.vuejs.org/zh/config/#vue-config-js
	
	3.为开发模式与发布模式指定不同的打包入口
		默认情况下，vue项目的开发模式与发布模式，共用一个打包入口文件（即src/main.js）.为了将项目的开发过程与发布过程
		分离，我们可以为两种模式，各自指定打包入口文件，即：
		（1）开发模式的入口文件为src/main_dev.js
		（2）发布模式的入口文件为src/main_prod.js
	4.configureWebpack 和 chainWebpack
		在vue.config.js 导出的配置对象中，新增configureWebpack 或 chainWebpack节点，来自定义webpack的打包配置。
		在这里，configureWebpack 和 chainWebpack的作用相同，唯一的区别就是它们修改的webpack 配置的方式不同：
		（1）chainWebpack 通过链式编程的形式，来修改默认的webpack 配置
		（2） configureWebpack 通过操作对象的形式，来修改默认的webpack配置 
		https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
		
	5.使用chainWebpack 自定义打包入口
	module.exports = {
	  chainWebpack: config => {
	  // 当运行环境为 生产环境时
		config.when(process.env.NODE_ENV === 'production', config => {
		  config.entry('app').clear().add('./src/main_prod.js')
		  config.set('externals', {
			vue: 'vue',
			'vue-router': 'Vuerouter',
			axios: 'axios',
			lodash: '_',
			echarts: 'echarts',
			nprogress: 'NProgress',
			'vue-quill-editor': 'VueQuillEditor'
		  })
		})
		//当环境为开发模式时
		config.when(process.env.NODE_ENV === 'development', config => {
		  config.entry('app').clear().add('./src/main_dev.js')
		})
	  }
	}
	6.通过externals加载外部CDN 资源
		默认情况下，通过import语法导入的第三方依赖包，最终会被打包合并到同一个文件中，从而导致打包成功后 单文件体积过大的问题
		
		为了解决上述问题，可以通过 webpack的externals节点，来配置并加载外部的CDN资源，凡是声明在externals中的第三方依赖包，都不会被打包
		配置如下：
		 config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
	  同时需要在public/index.html 文件头部 添加相应的CDN资源引用（css和js 文件）：（注意版本号）
	7.通过CDN优化ElementUI 的打包
		虽然在开发阶段 启用了element-ui组件的按需加载，尽可能的减少打包的体积，但是哪些被按需加载的组件，
		还是占用了较大的体积，此时，我们可以将element-ui 中的组件，也通过CDN 的形式来加载，这样能够进一步
		减小打包后的文件体积。
		
		具体操作流程如下：
		（1）在main-prod.js 中注释掉element-ui 按需加载的代码
		（2）在index.html的头部区域 通过CDN 加载element-ui 的js 和 css 样式
	
	8.首页内容定制
		不同的打包环境下 首页内容有所不同，可以通过插件的方式进行定制，插件配置如下：
		chainWebpack: config => {
			config.when(process.env.NODE_ENV === 'production', config => {
				config.plugin('html').tap(args => {
					args[0].isProd = true
					return args
				})
			})
			
			config.when(process.env.NODE_ENV === 'development', config => {
				config.plugin('html').tap(args => {
					args[0].isProd = false
					return args
				})
			})
		}
		在public/index.html 首页中，可以根据isProd 的值，来决定如何渲染页面结构
		// 按需渲染页面的标题
		<title><%= htmlWebpackPlugin.options.isProd? '' : 'dev-' %></title>
		//按需加载外部的CDN资源
		<% if (htmlWebpackPlugin.options.isProd) { %>
			//通过externals加载外部CDN
		<% } %>
		
	9.路由懒加载
		当打包构建项目时，javaScript包会变的非常大，影响页面加载速度，如果我们把路由对应的组件分割成不同的代码块
		，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
		（1）安装@babel/plugin-syntax-dynamic-import包
		（2）在babel.config.js 配置文件中声明该插件
		（3）将路由改为按需加载的形式，示例代码如下：
		有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。
		const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
		const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
		const Todo = () => import(/* webpackChunkName: "group-todo" */ './Todo.vue')
		https://router.vuejs.org/zh/guide/advanced/lazy-loading.html#%E6%8A%8A%E7%BB%84%E4%BB%B6%E6%8C%89%E7%BB%84%E5%88%86%E5%9D%97
		
		
	
.prettierrc 文件中设置 printWidth:200 文件单行可以显示的字节数 默认是80
babel-plugin-transform-remove-console 插件作用移除所有的console.*  此处需要注意 只需要移除生产环境的


2.项目上线
	2.1 项目上线相关的配置
	
		1.通过node创建web服务器
		2.开启gzip配置
		3.配置https服务
		4.使用pm2 管理应用
		
		
	1.通过node 创建web服务器
		创建node项目，并安装express，通过express创建web服务器，将vue打包生成的dist 文件夹，托管为静态资源即可，关键代码如下：
		const express = require('express')
		// 创建web服务器
		const app = expresss()
		
		//托管静态资源
		app.use(express.static('./dist'))
		
		
		//启动 web 服务器
		app.listen(80, () => {
			console.log('web server running at http://127.0.0.1')
		})
		
	具体步骤：
	（1）创建一个文件 用编辑器打开 运行命令 npm  init -y 创建一个包管理配置文件
	（2）运行 npm install express -S
	（3）将打包出来的 dist文件拷贝到当前文件下
	（4）新建一个app.js 入口文件 在里面进行上述操作
	（5）node app.js 运行命令
	
	2.开启gzip配置
		使用gzip 可以减少文件体积，是传输速度更快。
		（1）可以通过服务器端使用Express做gzip 压缩。配置如下：
		//安装相应的包
		npm install compression -S
		//导入包
		const compression = require('compression');
		//启用中间件
		app.use(compression());//注意中间件的启用位置
	3.配置https服务

		为什么要启用https服务呢？
		（1）传统的HTTP协议传输的数据都是明文 不安全
		（2）采用HTTPS协议对传输的数据进行加密处理，可以防止数据被中间人窃取，使用更安全
		
		
		 申请SSL证书 （https://freessl.org） （前提买了服务器 和域名）
		 (1)进入https://freessl.cn/ 官网，输入要申请的域名并选择品牌。
		 （2）输入自己的邮箱并选择相关的选项
		 （3）验证DNS（在域名管理后台添加TXT记录）
		 （4）验证通过后，下载SSL证书（full_chain.pem 公钥；private.key 私钥）。
		 
		 在后台项目中导入证书
			const https = require('https');
			const fs = require('fs');
			const options = {
				cert: fs。readFileSync('./fuul_chain.pem'),
				key: fs.readFileSync('./private.key')
			}
			
			https.createServer(options, app).listen(443)
			
	4.使用pm2 管理应用
		（1）在服务器中安装pm2： npm i pm2 -g
		（2）启动项目：pm2 start 脚本 --name 自定义名称
		（3）查看运行项目：pm2 ls
		（4）重启项目：pm2 restart 自定义名称
		（5）停止项目：pm2 stop 自定义名称
		（6）删除项目：pm2 delete 自定义名称
		例如：pm2 start app.js --name web_veushop
		
	
