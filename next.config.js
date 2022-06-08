const path = require('path');

module.exports = {
  trailingSlash: false,
  reactStrictMode: false,
  images: { domains: ['localhost', '*.paragoniu-student-passport.com'] },

  experimental: {
    esmExternals: false,
    jsconfigPaths: true, // enables it for both jsconfig.json and tsconfig.json
  },

  webpack: (config) => {
    // console.log(config.resolve.alias);
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        './node_modules/apexcharts-clevision'
      ),
    };

    return config;
  },
};
