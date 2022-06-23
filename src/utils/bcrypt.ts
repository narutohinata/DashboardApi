import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPass: string) {
  const SALT = await bcrypt.genSalt();
  return bcrypt.hash(rawPass, SALT);
}

export function validatePassword(
  rawPass: string,
  digest_pass: string,
): boolean {
  return bcrypt.compareSync(rawPass, digest_pass);
}
