import { SourceCodeProvider } from 'in-it-shared-types';
import Mongoose from 'mongoose';
import { DefaultSession } from 'next-auth';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Mongoose;
}

declare module 'next-auth' {
  export interface Session extends DefaultSession {
    user?: DefaultSession['user'] & {
      id: string;
      provider: SourceCodeProvider;
    };
  }
}
