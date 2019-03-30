/**
 * 获取弧度
 *
 * @param   {number}  degrees  [传入角度]
 *
 * @return  {number}           [返回弧长]
 */
declare function getRadian(degrees: number): number;
/**
 * 获取度数
 *
 * @param   {number}  radian  [传入弧长]
 *
 * @return  {number}          [返回度数]
 */
declare function getDegrees(radian: number): number;
declare function getRadiusPoint(x: number, y: number, radius: number, degrees: number): {
    x1: number;
    y1: number;
};
declare function randomHexColor(): string;
/**
 * [isObject 判断是否为一个对象]
 *
 * @param   {[type]}  item  [传入的值]
 *
 * @return  {[type]}        [返回布尔值]
 */
export declare function isObject(item: any): boolean;
/**
 * [mergeDeep description]
 *
 * @param   {[type]}  target:      [target: 被合并的对象]
 * @param   {[type]}  ...sources:  [...sources: 合并的对象]
 *
 * @return  {any}                  [return 深合并后的对象]
 */
export declare function mergeDeep(target: any, ...sources: any[]): any;
declare const _default: {
    getRadian: typeof getRadian;
    getDegrees: typeof getDegrees;
    getRadiusPoint: typeof getRadiusPoint;
    randomHexColor: typeof randomHexColor;
    isObject: typeof isObject;
    mergeDeep: typeof mergeDeep;
};
export default _default;
