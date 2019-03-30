/**
 * 获取弧度
 *
 * @param   {number}  degrees  [传入角度]
 *
 * @return  {number}           [返回弧长]
 */
function getRadian(degrees: number): number {
  return (Math.PI / 180) * degrees;
}

/**
 * 获取度数
 *
 * @param   {number}  radian  [传入弧长]
 *
 * @return  {number}          [返回度数]
 */
function getDegrees(radian: number): number {
  return (180 / Math.PI) * radian;
}

// 获取圆边上点的坐标
function getRadiusPoint(
  x: number,
  y: number,
  radius: number,
  degrees: number
): { x1: number; y1: number } {
  return {
    x1: x + radius * Math.cos(degrees),
    y1: y + radius * Math.sin(degrees)
  };
}

// 生成随机的16进制颜色
function randomHexColor(): string {
  //随机生成十六进制颜色
  var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = '0' + hex;
  }
  return '#' + hex; //返回‘#’开头16进制颜色
}

/**
 * [isObject 判断是否为一个对象]
 *
 * @param   {[type]}  item  [传入的值]
 *
 * @return  {[type]}        [返回布尔值]
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * [mergeDeep description]
 *
 * @param   {[type]}  target:      [target: 被合并的对象]
 * @param   {[type]}  ...sources:  [...sources: 合并的对象]
 *
 * @return  {any}                  [return 深合并后的对象]
 */
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export default {
  getRadian,
  getDegrees,
  getRadiusPoint,
  randomHexColor,
  isObject,
  mergeDeep
};
