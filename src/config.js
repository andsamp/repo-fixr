import { DEFAULT_CONFIG } from './utils/constants'
import { defaultsDeep } from 'lodash'
import { isValidDirectoryPath, isValidFilePath } from './utils/file'
import { validateArray, validateExists } from './utils/config-validation'

const path = require('path')

export const generateConfig = (configFile) => {
  if (isValidFilePath(configFile)) {
    const config = defaultsDeep(require(configFile), DEFAULT_CONFIG)

    validateConfig(config)

    config.absoluteBaseDirectory = path.resolve(config.baseDirectory)

    return config
  } else {
    throw new Error(`Specified config file(${configFile}) is not valid`)
  }
}

export const validateConfig = (config) => {
  const configValidationErrors = []

  if (!config.baseDirectory) {
    configValidationErrors.push('baseDirectory not specified')
  } else if (isValidDirectoryPath(config.baseDirectory)) {
    configValidationErrors.push('baseDirectory is not a valid directory')
  }

  if (!config.git.mainBranch) configValidationErrors.push('git.mainBranch not specified')
  if (!config.git.remote) configValidationErrors.push('git.remote not specified')
  if (!config.git.newBranch) configValidationErrors.push('git.newBranch not specified')
  if (!config.git.commitMessage) configValidationErrors.push('git.commitMessage not specified')

  configValidationErrors.push(...validateArray(config, 'projects'))
  configValidationErrors.push(...validateArray(config, 'commands'))

  configValidationErrors.push(validateExists(config, 'installCommand'))
  configValidationErrors.push(validateExists(config, 'testCommand'))

  if (configValidationErrors.length > 0) {
    throw new Error(`Invalid Configuration: ${configValidationErrors}`)
  }
}