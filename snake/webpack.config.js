module.exports = {

  entry: './src/app.tsx',
  
  output: {
    filename: 'app.js',
    path: './dist'
  },
  
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js']
  },
  
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
  
}