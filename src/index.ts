import utils from './utils';

// 默认参数的类型
interface StyleParams {
  line: {
    initColor: string; // 初始化颜色
    activeColor: string; // 高亮的颜色
    width: number; // 线条的粗细
  };
  dashLine: {
    initColor: string; // 初始化颜色
    activeColor: string; // 高亮的颜色
    width: number; // 线条的粗细
  };
  outerText: {
    // 外环文本
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
  arrowImg: string; // 箭头 base64
  x: number; // 圆心的x坐标
  y: number; // 圆心的y坐标
  startAngle: number; // 开始的角度
  endAngle: number; // 结束的角度
  currentAngle: number; // 当前的角度
  scoreStart: number; // 起步分
  scoreTarget: number; // 目标分
  scoreMin: number; // 最低分
  scoreMax: number; // 最高分
  scoreEvaDate: string; // 评估日期
  segAngle: number; // 总角度分成几等分
  outerTextSeg: number; // 外围文本分成几份
  style: StyleParams; // 样式
  scoreLevelText: string; // 信用等级文本
}

class CreditScore {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public ratio: number;
  public options: DefaultParams;

  public pointImg: HTMLImageElement;

  public el: HTMLElement | null;

  public isDrawComplete: boolean;

  public cacheParams: {};

  constructor(el: string, options = { arrowImg: '' }) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as any;
    this.ratio = window.devicePixelRatio; // 像素比
    this.pointImg = new Image(); // 新建一个图片实例
    this.isDrawComplete = false; // 画布是否渲染完毕
    this.el = document.getElementById(el);
    this.cacheParams = {};
    if (options && options.arrowImg) {
      this.pointImg.src = options.arrowImg;
    } else {
      this.pointImg.src =
        'data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiAgZmlsbD0icmdiKDI1NSwgMjU1LCAyNTUpIiBkPSJNOC4wMDAsMjQuMDA1IEMzLjU4MiwyNC4wMDUgLTAuMDAwLDIwLjUyNSAtMC4wMDAsMTYuMjMwIEMtMC4wMDAsMTEuOTM2IDguMDAwLC0wLjAwNSA4LjAwMCwtMC4wMDUgQzguMDAwLC0wLjAwNSAxNS45OTksMTEuOTM2IDE1Ljk5OSwxNi4yMzAgQzE1Ljk5OSwyMC41MjUgMTIuNDE4LDI0LjAwNSA4LjAwMCwyNC4wMDUgWk04LjAwMCwxMi4wNjUgQzUuNjI1LDEyLjA2NSAzLjcwMCwxMy45MzQgMy43MDAsMTYuMjM5IEMzLjcwMCwxOC41NDQgNS42MjUsMjAuNDEzIDguMDAwLDIwLjQxMyBDMTAuMzc1LDIwLjQxMyAxMi4zMDAsMTguNTQ0IDEyLjMwMCwxNi4yMzkgQzEyLjMwMCwxMy45MzQgMTAuMzc1LDEyLjA2NSA4LjAwMCwxMi4wNjUgWiIvPjwvc3ZnPg==';
    }

    this.options = utils.mergeDeep(
      {
        x: 0,
        y: 0,
        startAngle: 165, // 画布的起点
        endAngle: 375, // 画布的结束点
        currentAngle: 165, // 当前的角度
        scoreStart: 450, // 起步分
        scoreTarget: 770, // 目标分
        scoreMin: 450, // 最低分
        scoreMax: 850, // 最高分
        scoreEvaDate: '评估日期：2019-04-01', // 评估日期
        scoreLevelText: '', // 信用等级文字
        segAngle: 42, // 总角度分成几等分,
        outerTextSeg: 5, // 数字范围等分
        style: {
          line: {
            // 线条颜色控制
            initColor: 'rgba(255, 191, 150, 0.5)', // 初始化颜色
            activeColor: '#fff', // 高亮的颜色
            width: 1 // 线条的出息
          },
          dashLine: {
            initColor: 'rgba(255, 191, 150, 0.5)', // 初始化颜色
            activeColor: '#fff', // 高亮的颜色
            width: 1 // 线条的粗细
          },
          outerText: {
            // 外环文本
            fontSize: 12,
            color: '#fff'
          },
          innerText: {
            score: {
              fontSize: 36,
              color: '#fff'
            },
            level: {
              fontSize: 16,
              color: '#fff'
            },
            date: {
              fontSize: 12,
              color: '#f2f2f2',
              fontWeight: 'normal'
            }
          }
        }
      },
      options
    );
    this.initElm();
  }

  // 构建元素并添加到指定区域
  private initElm(): void {
    if (this.el) {
      this.ctx.scale(this.ratio, this.ratio);
      this.el.appendChild(this.canvas);
      const { height, width } = this.el.getBoundingClientRect();
      console.log('height, width: ', height, width);
      this.canvasSize(width, height);
      this.options = {
        ...this.options,
        x: (height * this.ratio) / 2,
        y: (width * this.ratio) / 2
      };
      this.fixRangeValue(this.options);
      // 缓存实例初始化的参数
      this.cacheParams = this.options;
      this.init();
    } else {
      throw new Error('请传入一个渲染区域的ID');
    }
  }

  // 做一些常规的判断，比如传入的最小值大于最大值，起始分和起始角度同步最小分和最小起始角度
  private fixRangeValue(options: DefaultParams): void {
    this.options = {
      ...options,
      scoreStart: this.options.scoreMin, // 重置开始计算的分很为最小分
      scoreTarget:
        this.options.scoreTarget > this.options.scoreMax
          ? this.options.scoreMax
          : this.options.scoreTarget,
      currentAngle: this.options.startAngle
    };
  }

  // 初始化canvas的一些参数
  protected init(options = {}): void {
    this.options = utils.mergeDeep(this.options, options);
    this.fixRangeValue(this.options);
  }

  // 画布大小
  protected canvasSize(width: number = 375, height: number = 375): void {
    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   *
   * @param endAngle 结束的角度
   * @param startAngle 开始的角度
   * @param segAngle 拆成多少等分
   */
  private stepAngleCalc(
    endAngle: number,
    startAngle: number,
    segAngle: number
  ): number {
    return (endAngle - startAngle) / segAngle;
  }

  // 清空画布
  /**
   * [clearCanvas description]
   *
   * @param   {number}  width   [清除的宽度]
   * @param   {number}  height  [清除的高度]
   *
   * @return  {[type]}          [没有返回]
   */
  private clearCanvas(width: number = 0, height: number = 0): void {
    this.ctx.clearRect(0, 0, width, height);
  }

  /**
   *
   * @param 线条旋转这些
   * @param 圆的三要素,x,y,半径
   */
  private drawCircleLine(
    { color = '#fff' }: { color: string },
    {
      x = 0,
      y = 0,
      radius = 0,
      startAngle,
      endAngle
    }: {
      x: number;
      y: number;
      radius: number;
      startAngle?: number;
      endAngle?: number;
    }
  ): void {
    this.ctx.beginPath();
    this.ctx.arc(
      x,
      y,
      radius,
      utils.getRadian(startAngle ? startAngle : this.options.startAngle),
      utils.getRadian(endAngle ? endAngle : this.options.endAngle)
    );
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 1 * this.ratio;
    this.ctx.stroke();
  }

  // 绘制外围文本
  /**
   *
   * @param x 坐标的x
   * @param y 坐标的y
   * @param text 展示的文本
   * @param fontSize 文本的大小
   * @param color 文本的颜色
   * @param fontWeight 文本的粗细
   */
  private drawOuterText(
    x: number,
    y: number,
    text: string,
    fontSize: number = 28,
    color: string = '#fff',
    fontWeight: string = 'normal'
  ): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontWeight} ${fontSize * this.ratio}px Microsoft yahei`;
    this.ctx.textBaseline = 'ideographic';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(
      text,
      x - (this.ctx.measureText(text).width * this.ratio) / 2,
      y
    );
  }

  // 画外围文本线
  private drawOuterTextLine(
    {
      outerText: { textArr, textAngelArr, textLenght }
    }: {
      outerText: {
        textArr: number[];
        textAngelArr: number[];
        textLenght: number;
      };
    },
    { x, y, radius }: { x: number; y: number; radius: number }
  ): void {
    // 最外围文字层
    for (let index = 0; index < textLenght; index++) {
      let angle = utils.getRadian(textAngelArr[index]);
      const { x1, y1 } = utils.getRadiusPoint(x, y, radius, angle);

      this.drawOuterText(
        x1,
        y1,
        '' + textArr[index],
        this.options.style.outerText.fontSize,
        this.options.style.outerText.color
      );
    }
  }

  // 画小圆点
  /**
   *
   * @param x x坐标
   * @param y y坐标
   * @param radius 半径
   * @param fillColor
   * @param mode true:顺时针 false:逆时针
   */
  private drawCircle(
    x: number = 0,
    y: number = 0,
    radius: number = 1,
    fillColor: string = '#fff',
    mode: boolean = false
  ): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, mode);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
  }

  /**
   *
   * @param x 坐标的x
   * @param y 坐标的y
   * @param text 展示的文本
   * @param fontSize 文本的大小
   * @param color 文本的颜色
   * @param fontWeight 文本的粗细
   */
  private drawInnerText(
    x: number,
    y: number,
    text: number | string,
    fontSize: number = 30,
    color: string = '#fff',
    fontWeight: string = 'bold'
  ): void {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontWeight} ${fontSize * this.ratio}px Microsoft yahei`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${text}`, x, y);
    this.ctx.textBaseline = 'ideographic';
    this.ctx.restore();
  }

  // 画水滴
  /**
   *
   * @param x 坐标x
   * @param y 坐标y
   * @param rotate 偏移的角度
   */
  private waterDrop(x: number, y: number, rotate: number): void {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(utils.getRadian(rotate));
    this.ctx.drawImage(this.pointImg, 0, 0, 8, 12);
    this.ctx.restore();
  }

  // 移动水滴
  /**
   *
   * @param x 坐标x
   * @param y 坐标y
   * @param radius 半径
   * @param angle 移动的角度
   */
  private moveWaterDrop(
    x: number,
    y: number,
    radius: number,
    angle: number
  ): void {
    const { x1, y1 } = utils.getRadiusPoint(
      x,
      y,
      radius,
      utils.getRadian(angle)
    );
    // 为什么要加90°，是因为图片默认是垂直的，我们要扭正他，从坐标系的初始值开始
    this.waterDrop(x1, y1, angle + 90);
  }

  // 画虚线圆弧
  private drawCircleDashLine(
    { color = '#ccc' }: { color: string },
    {
      x,
      y,
      radius,
      startAngle,
      endAngle
    }: {
      x: number;
      y: number;
      radius: number;
      startAngle?: number;
      endAngle?: number;
    }
  ): void {
    this.ctx.beginPath();
    for (let i = 1; i <= this.options.segAngle; i++) {
      const { x1, y1 } = utils.getRadiusPoint(
        x,
        y,
        radius,
        utils.getRadian(
          this.options.startAngle +
            this.stepAngleCalc(
              endAngle ? endAngle : this.options.endAngle,
              startAngle ? startAngle : this.options.startAngle,
              this.options.segAngle
            ) *
              i
        )
      );
      this.drawCircle(x1, y1, 1 * this.ratio, color);
    }
  }

  // 获取范围
  /**
   * @param type 'score'|'angel'
   */
  protected getNumberRange(type: string): number {
    if (type === 'score') {
      return this.options.scoreMax - this.options.scoreMin;
    }
    if (type === 'angel') {
      return this.options.endAngle - this.options.startAngle;
    }
    return 0;
  }

  /**
   * @param text 传入分数值，没有传入则拆分范围为三等分给出默认级别
   */
  protected getScoreLevelText(text?: string): string {
    if (text) {
      return text;
    } else {
      let per: number = Math.ceil(this.getNumberRange('score') / 4);
      if (this.options.scoreStart <= this.options.scoreMin + per) {
        return '信用中等';
      }
      if (
        this.options.scoreStart > this.options.scoreMin + per &&
        this.options.scoreStart <= this.options.scoreMin + per * 2
      ) {
        return '信用良好';
      }
      if (
        this.options.scoreStart > this.options.scoreMin + per * 2 &&
        this.options.scoreStart <= this.options.scoreMin + per * 3
      ) {
        return '信用优秀';
      }
      if (
        this.options.scoreStart > this.options.scoreMin + per * 3 &&
        this.options.scoreStart <= this.options.scoreMin + per * 4
      ) {
        return '信用极高';
      }
      return '';
    }
  }

  // 获取外部文本的对象集合
  private getOuterTextCollection(): any {
    let textGap: number = Math.ceil(
      this.getNumberRange('score') / (this.options.outerTextSeg - 1)
    );
    // 不能完全整除的，最后一个值取范围最大值
    let textArr: number[] = Array.from(
      new Array(this.options.outerTextSeg),
      (item, index): number =>
        this.options.outerTextSeg - 1 === index
          ? this.options.scoreMax
          : textGap * index + this.options.scoreMin
    );
    let textStepAngel: number =
      this.getNumberRange('angel') / (textArr.length - 1);
    let textAngelArr: number[] = textArr.map(
      (item, index) => this.options.startAngle + textStepAngel * index
    );
    return {
      textArr,
      textLenght: textArr.length,
      textAngelArr
    };
  }

  // 绘制画布
  public drawBaseMap(): void | boolean {
    this.clearCanvas(this.canvas.width, this.canvas.height);

    this.drawOuterTextLine(
      { outerText: this.getOuterTextCollection() },
      {
        x: this.options.x,
        y: this.options.y,
        radius: this.options.x * 0.82
      }
    );
    this.drawCircleLine(
      {
        color: this.options.style.line.initColor
      },
      {
        x: this.options.x,
        y: this.options.y,
        radius: this.options.x * 0.7
      }
    );
    this.drawCircleDashLine(
      {
        color: this.options.style.dashLine.initColor
      },
      {
        x: this.options.x,
        y: this.options.y,
        radius: this.options.x * 0.6666666
      }
    );

    // 文字位置()
    this.drawInnerText(
      this.options.x,
      this.options.y - 10,
      this.options.scoreStart,
      this.options.style.innerText.score.fontSize,
      this.options.style.innerText.score.color
    );
    this.drawInnerText(
      this.options.x,
      this.options.y + 20 * this.ratio,
      this.options.scoreLevelText
        ? this.options.scoreLevelText
        : this.getScoreLevelText(),
      this.options.style.innerText.level.fontSize,
      this.options.style.innerText.level.color
    );
    this.drawInnerText(
      this.options.x,
      this.options.y + 40 * this.ratio,
      this.options.scoreEvaDate,
      this.options.style.innerText.date.fontSize,
      this.options.style.innerText.date.color,
      this.options.style.innerText.date.fontWeight
    );

    // 覆盖实线
    this.drawCircleLine(
      {
        color: this.options.style.line.activeColor
      },
      {
        x: this.options.x,
        y: this.options.y,
        radius: this.options.x * 0.7,
        startAngle: this.options.startAngle,
        endAngle: this.options.currentAngle
      }
    );

    // 覆盖虚线
    this.drawCircleDashLine(
      {
        color: this.options.style.dashLine.activeColor
      },
      {
        x: this.options.x,
        y: this.options.y,
        radius: this.options.x * 0.6666666,
        startAngle: this.options.startAngle,
        endAngle: this.options.currentAngle
      }
    );

    // 移动小水滴
    this.moveWaterDrop(
      this.options.x,
      this.options.y,
      this.options.x * 0.6,
      this.options.currentAngle
    );

    // 范围内无限render
    if (this.options.scoreStart < this.options.scoreTarget) {
      let stepMoveAngle = this.stepAngleCalc(
        this.options.endAngle,
        this.options.startAngle,
        this.options.segAngle
      );
      // 每次移动角度的度数范围
      this.options.currentAngle += stepMoveAngle;

      // 文字变化
      // 求出每次移动角度的度数范围要走多少分数
      let stepScore =
        (this.getNumberRange('score') * stepMoveAngle) /
        this.getNumberRange('angel');
      this.options.scoreStart = this.options.scoreStart + Math.round(stepScore);
      if (this.options.scoreStart >= this.options.scoreTarget) {
        this.options.scoreStart = this.options.scoreTarget;
      }
      // 求当前角度与分数角度的比较，当前累计的角度小于需要移动到目的地的角度就继续渲染
      let stepAngle =
        this.options.startAngle +
        (this.getNumberRange('score') *
          (this.options.scoreTarget - this.options.scoreMin)) /
          this.getNumberRange('score');

      if (this.options.currentAngle >= stepAngle) {
        this.isDrawComplete = true;
        this.ctx.save();
        return false;
      } else {
        window.requestAnimationFrame(this.drawBaseMap.bind(this));
      }
    }
  }

  // 重新渲染画布
  /**
   * [refresh description]
   *
   * @param   {[type]}  delay      [delay 推迟几秒重新渲染]
   * @param   {[type]}  callback?  [callback? 传入的回调函数]
   *
   * @return  {[type]}             [return description]
   */
  refresh(delay: number = 1000, callback?: Function): void {
    let st: any = setTimeout(() => {
      clearTimeout(st);
      if (this.isDrawComplete) {
        this.isDrawComplete = false;
      }
      this.init(this.cacheParams);
      this.drawBaseMap();
      if (callback) callback();
    }, delay);
  }
}

export default CreditScore;
