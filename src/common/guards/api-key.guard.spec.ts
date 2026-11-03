import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

const contextWithHeaders = (
  headers: Record<string, unknown>,
): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  }) as unknown as ExecutionContext;

describe('ApiKeyGuard', () => {
  const guard = new ApiKeyGuard();

  it('rejects a request without an x-api-key header', () => {
    expect(() => guard.canActivate(contextWithHeaders({}))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a request with an empty x-api-key header', () => {
    expect(() =>
      guard.canActivate(contextWithHeaders({ 'x-api-key': '' })),
    ).toThrow(UnauthorizedException);
  });
});
