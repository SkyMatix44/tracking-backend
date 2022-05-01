/**
 *
 */
export class TokenGeneratorService {
  /**
   * TODO
   */
  public generateToken(): string {
    return '123-456';
  }

  /**
   * TODO
   * Check token
   */
  public verfiyToken(orginalToken: string, tokenToVerify): boolean {
    return orginalToken === tokenToVerify;
  }
}
