export default {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16, // 기준 폰트 크기 (1rem = 16px)
      unitPrecision: 5, // 소수점 자릿수
      propList: [
        "padding",
        "margin",
        "font-size",
        "height",
        "width",
        "gap",
        "max-width",
      ], // 어떤 CSS 속성을 변환할지 (모두 변환)
      selectorBlackList: [], // 변환 제외할 class (예: ['.no-rem'])
      replace: true,
      mediaQuery: true, // @media px도 변환할지 여부
      minPixelValue: 1, // 변환할 최소 px 값 (1px 이하는 제외)
    },
  },
};
