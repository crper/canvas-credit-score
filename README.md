# Canvas-credit-score

面向现代主流浏览器实现的 Canvas 绘制的一个类似支付宝信用分的组件

- 支持高清绘制(走像素比，然后缩放)
- 文字等分的传入
- 虚线等分的传入
- 线条大小，颜色
- 文字的色彩及大小

默认分数段是 450-850，角度 42 等分,文字 5 等分。。。

没那么严谨的各种判断，只是为了满足业务需求写的，有兴趣完善的可以提交 PR

## 安装

```
// yarn add canvas-credit-score
npm install --save canvas-credit-score
```

## 用法

```js
// 引入
import CreditScore from 'canvas-credit-score';

// 初始化
let cs = new CreditScore(el: '',{/*options*/});

cs.drawBaseMap(); // 执行绘制

// 也可以调用init函数来设置配置，再执行绘制
let cs2 = new CreditScore(el);
cs2.init(configObject);
cs2.drawBaseMap(); // 执行绘制

```

## 选项

- 参数(直接拿`typescript`的描述了哈)

```js
interface defaultParams {
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
  style: styleParams; // 样式
}

interface styleParams {
  line?: {
    initColor?: string, // 初始化颜色
    activeColor?: string, // 高亮的颜色
    width?: number // 线条的粗细
  };
  dashLine?: {
    initColor?: string, // 初始化颜色
    activeColor?: string, // 高亮的颜色
    width?: number // 线条的粗细
  };
  outerText?: {
    // 外环文本
    fontSize?: number,
    color?: string
  };
  innerText?: {
    score?: {
      fontSize?: number,
      color?: string
    },
    level?: {
      fontSize?: number,
      color?: string
    },
    date?: {
      fontSize?: number,
      color?: string,
      fontWeight?: string
    }
  };
}
```

- 方法
- `instance.drawBaseMap()` - 读取配置后绘制图形
- `instance.init()` - 配置参数，可选。也可以在构造函数传入
- `instance.refresh(delay,callback)` - 延迟多少秒后再次渲染，支持回调函数的传入

## License

The MIT License (MIT). Please see [License File](https://opensource.org/licenses/MIT) for more information.
