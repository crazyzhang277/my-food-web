import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePasswordConfirmation } from './passwordValidation.js';

test('returns an error when confirmation password does not match', () => {
  assert.equal(
    validatePasswordConfirmation('secret123', 'secret124'),
    '两次输入的密码不一致'
  );
});

test('returns no error when confirmation password matches', () => {
  assert.equal(validatePasswordConfirmation('secret123', 'secret123'), null);
});
