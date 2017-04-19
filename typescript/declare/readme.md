**declare**  用于声明不是来自TypeScript类型的文件的变量

#### 比如jquery

直接用 $ 会报错

declare var $ : any;

$.xx 就行了

就像定义一个数据，但不会打包进js