module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:8000/:path*', // URL interna da sua API
      },
    ];
  },
}; 