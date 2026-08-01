import AsyncStorage from "@react-native-async-storage/async-storage";
import { methodObjects, variableObjects } from "./Models";
import { defaultRecipeObjects } from "./DefaultRecipes";

const DATA_KEY = "modern_coffee_data";

let writeChain = Promise.resolve();

function enqueue(fn) {
  writeChain = writeChain.then(fn).catch((error) => {
    console.error(error);
  });
  return writeChain;
}

async function getData() {
  const raw = await AsyncStorage.getItem(DATA_KEY);
  if (raw == null) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function setData(data) {
  await AsyncStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function read(cb) {
  return writeChain.then(() => getData().then(cb));
}

function buildSeed() {
  const methods = {};
  methodObjects.forEach((item, index) => {
    methods[`method-${index + 1}`] = { ...item };
  });
  const variables = {};
  variableObjects.forEach((item, index) => {
    variables[`variable-${index + 1}`] = { ...item };
  });
  const recipes = {};
  defaultRecipeObjects.forEach((item, index) => {
    if (!recipes[item.method]) {
      recipes[item.method] = {};
    }
    recipes[item.method][`recipe-${index + 1}`] = { ...item };
  });
  return { methods, variables, recipes };
}

function deepMerge(target, source) {
  Object.entries(source).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === "object"
    ) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  });
}

function mutate(update) {
  return enqueue(async () => {
    const current = (await getData()) || buildSeed();
    const next = update(current);
    await setData(next);
  });
}

function randomId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function rehydrateMethods(methods) {
  const staticByName = {};
  methodObjects.forEach((item) => {
    staticByName[item.methodName] = item;
  });
  const fallbackIcon = require("../assets/images/icons/featuredIconWhite200x200.png");
  const fallbackBanner = require("../assets/images/banners/dripBanner400x300.png");
  const result = {};
  Object.entries(methods).forEach(([id, method]) => {
    const staticMethod = staticByName[method.methodName];
    result[id] = {
      ...method,
      iconUrl: staticMethod ? staticMethod.iconUrl : fallbackIcon,
      bannerUrl: staticMethod ? staticMethod.bannerUrl : fallbackBanner,
    };
  });
  return result;
}

export async function initializeLocalData() {
  return writeChain.then(async () => {
    const current = await getData();
    if (current && current.methods && current.variables && current.recipes) {
      return current;
    }
    const seed = buildSeed();
    await setData(seed);
    return seed;
  });
}

export function getMethods() {
  return read((data) => {
    if (data == null || !data.methods) {
      return {};
    }
    return rehydrateMethods(data.methods);
  });
}

export function getVariables() {
  return read((data) => {
    return data && data.variables ? data.variables : {};
  });
}

export function getRecipes(method) {
  return read((data) => {
    if (data == null || !data.recipes) {
      return {};
    }
    return data.recipes[method] || {};
  });
}

export function getAllRecipes() {
  return read((data) => {
    return data && data.recipes ? data.recipes : {};
  });
}

export function getRecipe(method, id) {
  return read((data) => {
    if (data == null || !data.recipes || !data.recipes[method]) {
      return null;
    }
    return data.recipes[method][id] || null;
  });
}

export function addMethod(methodObject) {
  return mutate((data) => {
    const id = randomId("method");
    data.methods[id] = { ...methodObject };
    return data;
  });
}

export function updateMethod(id, patch) {
  return mutate((data) => {
    if (data.methods[id]) {
      deepMerge(data.methods[id], patch);
    }
    return data;
  });
}

export function removeMethod(id) {
  return mutate((data) => {
    delete data.methods[id];
    return data;
  });
}

export function removeAllRecipes(method) {
  return mutate((data) => {
    delete data.recipes[method];
    return data;
  });
}

export function addVariable(variableObject) {
  return mutate((data) => {
    const id = randomId("variable");
    data.variables[id] = { ...variableObject };
    return data;
  });
}

export function updateVariable(id, patch) {
  return mutate((data) => {
    if (data.variables[id]) {
      deepMerge(data.variables[id], patch);
    }
    return data;
  });
}

export function removeVariable(id) {
  return mutate((data) => {
    delete data.variables[id];
    return data;
  });
}

export function addRecipe(method, recipeObject) {
  return mutate((data) => {
    if (!data.recipes[method]) {
      data.recipes[method] = {};
    }
    const id = randomId("recipe");
    data.recipes[method][id] = { ...recipeObject };
    return data;
  });
}

export function updateRecipe(method, id, patch) {
  return mutate((data) => {
    if (data.recipes[method] && data.recipes[method][id]) {
      deepMerge(data.recipes[method][id], patch);
    }
    return data;
  });
}

export function removeRecipe(method, id) {
  return mutate((data) => {
    if (data.recipes[method]) {
      delete data.recipes[method][id];
    }
    return data;
  });
}

export function removeRecipeVariable(method, id, variableName) {
  return mutate((data) => {
    if (data.recipes[method] && data.recipes[method][id]) {
      delete data.recipes[method][id][variableName];
    }
    return data;
  });
}

export function resetAllData() {
  return enqueue(async () => {
    const seed = buildSeed();
    await setData(seed);
  });
}
