
export class Value {
  value: any;
  hasValue: boolean = false;
  constructor (value: any) {
    this.value = value;
  }

  setValue(value: any) {
    console.log(value)

    this.value = value;
    this.hasValue = true;
  }

  clear() {
    this.value = null;
    this.hasValue = false;
  }
}
