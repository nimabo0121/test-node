class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  toString() {
    return JSON.stringify(this);
  }
}
const p1 = new Person("John", 25);
console.log(p1);
console.log(p1 + "");

// CJS 的匯出, 可以匯出任何類型的資料
// 但只能有一個
module.exports = { Person, p1 };
