import assert from 'node:assert';
import { test } from 'node:test';
import { sum } from './index.js';

test('sum menjumlahkan dua angka dengan benar', () => {
  assert.strictEqual(sum(2, 3), 5);
});

test('sum dapat menjumlahkan angka negatif dan positif', () => {
  assert.strictEqual(sum(-2, 5), 3);
});
