const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const coreRoot = path.resolve(projectRoot, '../core')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [coreRoot]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(coreRoot, 'node_modules'),
]

config.resolver.extraNodeModules = {
  '@applaid/core': coreRoot,
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '../lib/supabase' || moduleName === './lib/supabase') {
    return {
      filePath: path.resolve(projectRoot, 'src/lib/supabase.ts'),
      type: 'sourceFile',
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
