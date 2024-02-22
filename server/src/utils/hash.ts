import * as crypto from 'crypto';

/**
 * 加密字符串
 * @param plainText 待加密字符串
 * @returns 加密后结果
 */
export const sha256Hash = (plainText: string) => {
  const hash = crypto.createHash('sha256');
  return hash.update(plainText).digest('hex');
};

/**
 * 检查是否一致
 * @param plainText 未加密前的字符串
 * @param hash hash 后的结果
 * @returns 是否一致
 */
export const checkHash = (plainText: string, hash: string) => {
  return hash === sha256Hash(plainText);
};
