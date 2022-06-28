/**
 *
 */
export class TokenGeneratorService {
  private static VALID_CHARS = 'ABCDEFGHKMNPQRSTUVWXYZ123456789'; // without IJLO0
  private static STANDARD_SEPERATOR = '-';

  /**
   * Generate a random token
   */
  public generateToken(
    blocks: number,
    blockSize: number,
    seperator: string = TokenGeneratorService.STANDARD_SEPERATOR,
  ): string {
    let token = '';

    for (let i = 1; i <= blocks; i++) {
      for (let j = 1; j <= blockSize; j++) {
        const randdomIdx = this.getRandomInt(0, TokenGeneratorService.VALID_CHARS.length - 1);
        token += TokenGeneratorService.VALID_CHARS[randdomIdx];
      }

      if (i !== blocks) {
        token += seperator;
      }
    }

    return token;
  }

  /**
   * Check token
   */
  public verfiyToken(
    orginalToken: string,
    tokenToVerify,
    seperator: string = TokenGeneratorService.STANDARD_SEPERATOR,
  ): boolean {
    if (null != orginalToken && null != tokenToVerify) {
      const org = orginalToken.replace('-', '');
      const verify = tokenToVerify.replace(seperator, '');

      return org === verify;
    }

    return false;
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   */
  private getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
