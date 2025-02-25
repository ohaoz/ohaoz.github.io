<?php
header("Content-Type: application/json");

// 读取模型列表
$modelListJson = file_get_contents('model-list.json');
$modelList = json_decode($modelListJson, true);

$id = isset($_GET['id']) ? $_GET['id'] : '';
if (empty($id)) {
    // 默认返回第一个模型
    $modelName = $modelList['models'][0][0];
    $modelPath = "live2d_models/{$modelName}/{$modelName}.model.json";
    header("Location: $modelPath");
    exit;
}

// 解析ID格式 (modelId-textureId)
$ids = explode('-', $id);
$modelId = isset($ids[0]) ? intval($ids[0]) : 0;
$textureId = isset($ids[1]) ? intval($ids[1]) : 0;

// 获取模型名称
if (isset($modelList['models'][$modelId]) && isset($modelList['models'][$modelId][0])) {
    $modelName = $modelList['models'][$modelId][0];
    $modelPath = "live2d_models/{$modelName}/{$modelName}.model.json";
    header("Location: $modelPath");
} else {
    // 默认返回第一个模型
    $modelName = $modelList['models'][0][0];
    $modelPath = "live2d_models/{$modelName}/{$modelName}.model.json";
    header("Location: $modelPath");
} 