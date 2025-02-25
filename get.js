/**
 * 模型API - get方法
 * 用于获取模型路径
 */
async function get(id) {
  // 获取模型列表
  const response = await fetch('model-list.json');
  const modelList = await response.json();
  
  // 解析ID格式 (modelId-textureId)
  const ids = id.split('-');
  const modelId = parseInt(ids[0]) || 0;
  const textureId = parseInt(ids[1]) || 0;
  
  // 获取模型名称
  if (modelList.models[modelId] && modelList.models[modelId][0]) {
    const modelName = modelList.models[modelId][0];
    return `live2d_models/${modelName}/${modelName}.model.json`;
  } else {
    // 默认返回第一个模型
    const modelName = modelList.models[0][0];
    return `live2d_models/${modelName}/${modelName}.model.json`;
  }
} 