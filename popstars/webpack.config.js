module.exports = {
	entry: './app.js',
	output:{
		path: './dist/',
		filename: 'app.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel'
		}]
	}
}