import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of, throwError } from 'rxjs';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): any {
    return of(exception.getError());
  }
}
