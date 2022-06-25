/**
 *
 */
export class TokenGeneratorService {
  public static VALID_CHARS = 'ABCDEFGHKMNPQRSTUVWXYZ';
  public static STANDARD_SEPERATOR = '-';

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
        const randdomIdx = this.getRandomNumber(0, TokenGeneratorService.VALID_CHARS.length - 1);
        token += TokenGeneratorService.VALID_CHARS[randdomIdx];
      }

      if (i !== blockSize) {
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
    const org = orginalToken.replace('-', '');
    const verify = tokenToVerify.replace(seperator, '');

    return org === verify;
  }

  /**
   * Return a random number in a range (min + max included)
   */
  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max + 1 - min) + min;
  }
}
