import assert from 'node:assert';
import { test } from 'node:test';
import sum from './index.js';

test('sum mengembalikan hasil penjumlahan untuk dua angka valid', () => {
  assert.strictEqual(sum(2, 3), 5);
});

test('sum mengembalikan 0 jika a bukan number', () => {
  assert.strictEqual(sum('2', 3), 0);
});

test('sum mengembalikan 0 jika b bukan number', () => {
  assert.strictEqual(sum(2, '3'), 0);
});

test('sum mengembalikan 0 jika a bernilai negatif', () => {
  assert.strictEqual(sum(-2, 3), 0);
});

test('sum mengembalikan 0 jika b bernilai negatif', () => {
  assert.strictEqual(sum(2, -3), 0);
});
