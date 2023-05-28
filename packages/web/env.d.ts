import Mongoose from 'mongoose';
import { User, DefaultSession } from 'next-auth';

declare global {
  var mongoose: Mongoose;
}

declare module 'next-auth' {
  export interface Session extends DefaultSession {
    user?: DefaultSession['user'] & {
      id: string
      provider: string
    }
  }
}
