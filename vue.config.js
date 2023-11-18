process.env.VUE_APP_TITLE       = 'Fish Frets';
process.env.VUE_APP_BASE_URL    = '/';
process.env.VUE_APP_VERSION     = require('./package.json').version;
process.env.VUE_APP_DESCRIPTION = require('./package.json').description;

module.exports = {

	productionSourceMap: false,

	devServer: {
		https: true,
		host: '0.0.0.0',
		port: '8080',
	},

	css: {
		// Enable source maps in dev mode only
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the mixins in every component
		loaderOptions: {
			scss: {
				additionalData: `
					@use "@/styles/mixins" as *;
					@use "@/styles/layout"; 

					@use "sass-mq/_mq" as * with (
						$mq-breakpoints: (
							desktop: layout.$mq-breakpoint-desktop,
							wide:    layout.$mq-breakpoint-wide,
						)
					);
				`
			}
		}
	},

	chainWebpack: config => {

		// Minify the CSS in `public/index.html`
		config.plugin('html').tap(args => {
			args[0].minify = {
				collapseWhitespace:            true,
				removeComments:                true,
				removeRedundantAttributes:     true,
				removeScriptTypeAttributes:    true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype:               true,
				minifyCSS:                     true,
			};

			return args;
		});

		// Enable tests coverage
		if (process.env.NODE_ENV === 'test') {
			config.module.rule('js')
				.test(/\.js$/)
				.use('istanbul-instrumenter-loader')
				.loader('istanbul-instrumenter-loader')
				.options({ esModules: true });
		}
	},

	pluginOptions: {

		// Stylelint
		lintStyleOnBuild: true,

		// Font Awesome icons
		fontawesome: {
			component: 'fa-icon',
			imports: !isModuleAvailable('@fortawesome/free-regular-svg-icons') ? {} : {
				// General UI
				'arrow-left':               'free-regular',
				'chevron-down':             'free-regular',
				'chevron-up':               'free-regular',
				'ellipsis-h':               'free-regular',

				// Instruments
				'banjo':                    'free-regular',
				'guitar':                   'free-regular',
				'guitar-electric':          'free-regular',
				'mandolin':                 'free-regular',

				// Tools & settings
				'arrow-circle-up':          'free-regular',
				'arrows-v':                 'free-regular',
				'cog':                      'free-regular',
				'desktop':                  'free-regular',
				'desktop-alt':              'free-regular',
				'file-download':            'free-regular',
				'file-image':               'free-regular',
				'hand-paper':               'free-regular',
				'image-polaroid':           'free-regular',
				'info-circle':              'free-regular',
				'list-music':               'free-regular',
				'list-ol':                  'free-regular',
				'moon':                     'free-regular',
				'music':                    'free-regular',
				'sun':                      'free-regular',

				// Scales
				'plus':                     'free-regular',
				'trash-alt':                'free-regular',
				'eye':                      'free-regular',
				'eye-slash':                'free-regular',
				'bullseye':                 'free-regular',
				'intersection':             'free-solid',
				'copy':                     'free-regular',
				'times-circle':             'free-regular',

				// Footer
				'twitter':                  'free-brands',
				'github':                   'free-brands',
				'paper-plane':              'free-regular',
				'heart':                    'free-regular',
				'external-link-square-alt': 'free-regular',
			}
		},

		// Sitemap
		sitemap: {
			trailingSlash:  false,
			productionOnly: true,

			baseURL: process.env.VUE_APP_BASE_URL ?? '/',
			urls: [{
				loc:        '/',
				priority:   1.0,
				changefreq: 'always',
			}]
		},
	},
}

function isModuleAvailable(name) {
	try { require.resolve(name) } catch(_err) { return false; }
	return true;
}
