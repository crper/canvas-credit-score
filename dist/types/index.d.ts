interface StyleParams {
    line: {
        initColor: string;
        activeColor: string;
        width: number;
    };
    dashLine: {
        initColor: string;
        activeColor: string;
        width: number;
    };
    outerText: {
        fontSize: number;
        color: string;
    };
    innerText: {
        score: {
            fontSize: number;
            color: string;
        };
        level: {
            fontSize: number;
            color: string;
        };
        date: {
            fontSize: number;
            color: string;
            fontWeight: string;
        };
    };
}
interface DefaultParams {
    x: number;
    y: number;
    startAngle: number;
    endAngle: number;
    currentAngle: number;
    scoreStart: number;
    scoreTarget: number;
    scoreMin: number;
    scoreMax: number;
    scoreEvaDate: string;
    segAngle: number;
    outerTextSeg: number;
    style: StyleParams;
}
declare class CreditScore {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    ratio: number;
    options: DefaultParams;
    pointImg: HTMLImageElement;
    el: HTMLElement | null;
    isDrawComplete: boolean;
    cacheParams: {};
    constructor(el: string, options?: {});
    private initElm;
    private fixRangeValue;
    protected init(options?: {}): void;
    protected canvasSize(width?: number, height?: number): void;
    /**
     *
     * @param endAngle 结束的角度
     * @param startAngle 开始的角度
     * @param segAngle 拆成多少等分
     */
    private stepAngleCalc;
    /**
     * [clearCanvas description]
     *
     * @param   {number}  width   [清除的宽度]
     * @param   {number}  height  [清除的高度]
     *
     * @return  {[type]}          [没有返回]
     */
    private clearCanvas;
    /**
     *
     * @param 线条旋转这些
     * @param 圆的三要素,x,y,半径
     */
    private drawCircleLine;
    /**
     *
     * @param x 坐标的x
     * @param y 坐标的y
     * @param text 展示的文本
     * @param fontSize 文本的大小
     * @param color 文本的颜色
     * @param fontWeight 文本的粗细
     */
    private drawOuterText;
    private drawOuterTextLine;
    /**
     *
     * @param x x坐标
     * @param y y坐标
     * @param radius 半径
     * @param fillColor
     * @param mode true:顺时针 false:逆时针
     */
    private drawCircle;
    /**
     *
     * @param x 坐标的x
     * @param y 坐标的y
     * @param text 展示的文本
     * @param fontSize 文本的大小
     * @param color 文本的颜色
     * @param fontWeight 文本的粗细
     */
    private drawInnerText;
    /**
     *
     * @param x 坐标x
     * @param y 坐标y
     * @param rotate 偏移的角度
     */
    private waterDrop;
    /**
     *
     * @param x 坐标x
     * @param y 坐标y
     * @param radius 半径
     * @param angle 移动的角度
     */
    private moveWaterDrop;
    private drawCircleDashLine;
    /**
     * @param type 'score'|'angel'
     */
    protected getNumberRange(type: string): number;
    /**
     * @param text 传入分数值，没有传入则拆分范围为三等分给出默认级别
     */
    protected getScoreLevelText(text?: string): string;
    private getOuterTextCollection;
    drawBaseMap(): void | boolean;
    /**
     * [refresh description]
     *
     * @param   {[type]}  delay      [delay 推迟几秒重新渲染]
     * @param   {[type]}  callback?  [callback? 传入的回调函数]
     *
     * @return  {[type]}             [return description]
     */
    refresh(delay?: number, callback?: Function): void;
}
export default CreditScore;
