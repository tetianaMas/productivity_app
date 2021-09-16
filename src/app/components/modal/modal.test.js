/* eslint-disable no-undef */
import { ModalView } from './MVC/modalView';
import isChecked from './template/isChecked';
const modal = new ModalView();

describe('firstLetterToUppercase', () => {
  test('should return string with first letter in uppercase', () => {
    const result = modal.firstLetterToUppercase('   to upper case');
    expect(result[0]).toBe('T');
  });

  test('should return falthy value if argument does not equal `string`', () => {
    const result = modal.firstLetterToUppercase(34);
    expect(result).toBeFalsy();
  });

  test('should return falthy value from string with only spaces', () => {
    const result = modal.firstLetterToUppercase('            ');
    expect(result).toBeFalsy();
  });

  test('should return falthy value with no arguments', () => {
    const result = modal.firstLetterToUppercase();
    expect(result).toBeFalsy();
  });
});

describe('validateTextField', () => {
  test('should return true', () => {
    const result = modal.validateTextField('   validate me!    ');
    expect(result).toBe(true);
  });

  test('should return false with no arguments', () => {
    const result = modal.validateTextField();
    expect(result).toBe(false);
  });

  test('should return falthy value if argument does not equal `string`', () => {
    const result = modal.validateTextField(23454353);
    expect(result).toBe(false);
  });

  test('should return false from string with only spaces', () => {
    const result = modal.validateTextField('                         ');
    expect(result).toBe(false);
  });
});

describe('isChecked', () => {
  test('should return css class `checked`', () => {
    const result = isChecked('truthy', 'truthy');
    expect(result).toBe('checked');
  });

  test('should return empty string', () => {
    const result = isChecked('truthy', 'falthy');
    expect(result).toBe('');
  });

  test('should return empty string', () => {
    const result = isChecked('', 'other');
    expect(result).toBe('');
  });
});
